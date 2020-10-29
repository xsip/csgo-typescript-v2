import { Resolver } from '../typings/typings';
import { ClientStateService } from './game/clientState/clientState.service';
import { PlayerEntity } from './game/entity/entity.interfaces';
import { EntityBase } from './game/entity/entity.service';
import { Player } from './game/player/player';
import { Netvars, OffsetCollection, Signatures } from './offsets';
import {rpm} from './shared/declerations';

export interface HackConfig {
    webSocketService?: {
        start: boolean;
        socketServicePort: number;
    };
    offsets?: OffsetCollection;
}

export interface BaseGameData {
    baseIsRunning?: boolean;
    clientState: ClientStateService;
    entityBase: EntityBase;
    localEntity: PlayerEntity;
    player: Player;
    offsets: OffsetCollection;
    sendMessageToEachWsClient: (message: any) => void;
    getModuleBase: (modeName: string) => void;
    readMemory: typeof rpm;
}
export interface AfterEntityLoopData extends BaseGameData {

}
export interface GameData extends BaseGameData {
    currentEntity: PlayerEntity;
    currentEntityIndex: number;
    player: Player;
}

export interface PlayerEntityResolver extends Resolver<Netvars> {
    base?: any;
}
export interface MiscEntityResolver extends Resolver<Netvars & Signatures> {
    base?: any;
}
