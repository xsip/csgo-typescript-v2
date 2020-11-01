import * as rxjs from 'rxjs';
import {AfterEntityLoopData, BaseGameData, GameData, HackConfig} from './base.interfaces';
import {ClientStateService} from './game/clientState/clientState.service';
import {EntityBase} from './game/entity/entity.service';
import {Player} from './game/player/player';
import {RendererService} from './game/renderer/renderer.service';
import {SocketService} from './network/socket/socket.service';
import {offsets} from './offsets';
import {ProcessService} from './process/process.service';
import {Global} from './shared/declerations';

export let proc: ProcessService;

export class BaseService {
    private newDataSubject: rxjs.Subject<GameData> = new rxjs.Subject<GameData>();

    private afterEntityLoopSubject: rxjs.Subject<AfterEntityLoopData> = new rxjs.Subject<AfterEntityLoopData>();

    private socketService: SocketService = new SocketService();

    private wsStarted: boolean;

    constructor(public config: HackConfig = {
        webSocketService: {
            start: false,
            socketServicePort: 8080,
        },
    }) {
        console.log('base service init');
    }

    run() {
        if (this.wsShouldStart()) {
            console.log('starting ws server..');
            this.socketService.startServer(this.doRun.bind(this));
            this.wsStarted = true;
            return;
        }
        this.doRun();
    }

    public onNewData(): rxjs.Subject<GameData> {
        return this.newDataSubject;
    }

    public afterEntityLoop(): rxjs.Subject<AfterEntityLoopData> {
        return this.afterEntityLoopSubject;
    }

    private wsShouldStart = () => (this.config.webSocketService ? this.config.webSocketService.start : false);

    private getBaseReply = (): BaseGameData => ({
        clientState: Global.clientState,
        baseIsRunning: true,
        entityBase: Global.entityBase,
        localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
        player: Global.player,
        sendMessageToEachWsClient: this.socketService.sendToEachClient.bind(this.socketService),
        offsets: this.config.offsets,
        getModuleBase: (moduleName: string) => Global.gM(moduleName).modBaseAddr,
        readMemory: Global.rpm,
    });

    private declareGlobal(processService: ProcessService) {
        Global.gM = processService.getModule.bind(proc);
        Global.rpm = processService.readMemory.bind(proc);
        Global.rbf = processService.readBuffer.bind(proc);
        Global.wpm = processService.writeMemory.bind(proc);

        Global.clientState = new ClientStateService(offsets);
        Global.entityBase = new EntityBase(offsets);
        Global.renderer = new RendererService(offsets);
        Global.player = new Player(offsets);
    }

    private doRun() {
        proc = new ProcessService('csgo.exe');
        this.declareGlobal(proc);
        console.log('hack initialized..\nstarting main loop..');

        const update = () => {
            Global.clientState.update();
            Global.entityBase.update(Global.clientState.localEntityIndex);
            Global.renderer.readViewMatrix();
        };

        update();
        const main = rxjs.interval(0);

        main.subscribe(() => {
            for (let i = 0; i < Global.clientState.maxEntitys; i++) {
                Global.entityBase.update(i);
                const entity = Global.entityBase.entity(i);
                if (entity && entity.lifeState === 0) {
                    if ((entity.team === 2 || entity.team === 3)) {
                        this.newDataSubject.next({
                            ...this.getBaseReply(),
                            currentEntity: entity,
                            localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
                            currentEntityIndex: i,
                            player: Global.player,
                        });
                        // forEachPlayer(entity, i);
                    }
                }
            }

            update();
            // on update
            this.afterEntityLoopSubject.next({
                ...this.getBaseReply(),
                localEntity: Global.entityBase.entity(Global.clientState.localEntityIndex),
                player: Global.player,
            });
        });
    }
}
