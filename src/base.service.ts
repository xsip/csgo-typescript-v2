import * as rxjs from 'rxjs';
import {
  AfterEntityLoopData, BaseGameData, GameData, HackConfig,
} from './base.interfaces';
import { SocketService } from './network/socket/socket.service';
import {
  clientState, entityBase, gM, hackBase, player, rpm,
} from './shared/declerations';
import { PlayerEntity } from './game/entity/entity.interfaces';

export class BaseService {
    private newDataSubject: rxjs.Subject<GameData> = new rxjs.Subject<GameData>();

    private afterEntityLoopSubject: rxjs.Subject<AfterEntityLoopData> = new rxjs.Subject<AfterEntityLoopData>();

    private socketService: SocketService = new SocketService();

    private wsShouldStart = () => (this.config.webSocketService ? this.config.webSocketService.start : false);

    private wsStarted: boolean;

    constructor(private config: HackConfig = {
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

    private getBaseReply = (): BaseGameData => ({
      clientState,
      baseIsRunning: true,
      entityBase,
      localEntity: entityBase.entity(clientState.localEntityIndex),
      player,
      sendMessageToEachWsClient: this.socketService.sendToEachClient.bind(this.socketService),
      offsets: this.config.offsets,
      getModuleBase: (moduleName: string) => gM(moduleName).modBaseAddr,
      readMemory: rpm,
    });

    private doRun() {
      hackBase(this.config.offsets, (currentEntity: PlayerEntity, currentEntityIndex: number) => {
        this.newDataSubject.next({
          ...this.getBaseReply(),
          currentEntity,
          localEntity: entityBase.entity(clientState.localEntityIndex),
          currentEntityIndex,
          player,
        });
      }, () => {
        this.afterEntityLoopSubject.next({
          ...this.getBaseReply(),
          localEntity: entityBase.entity(clientState.localEntityIndex),
          player,
        });
      });
    }

    public onNewData(): rxjs.Subject<GameData> {
      return this.newDataSubject;
    }

    public afterEntityLoop(): rxjs.Subject<AfterEntityLoopData> {
      return this.afterEntityLoopSubject;
    }
}
