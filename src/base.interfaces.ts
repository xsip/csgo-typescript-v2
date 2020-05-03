import { ClientStateService } from './game/clientState/clientState.service';
import { EntityBase } from './game/entity/entity.service';
import { PlayerEntity } from './game/entity/entity.interfaces';
import { Player } from './game/player/player';
import { Resolver } from '../typings/typings';
import { Netvars, OffsetCollection, Signatures } from './offsets';

export interface HackConfig {
    webSocketService?: {
        start: boolean;
        socketServicePort: number;
    }
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
}
export interface AfterEntityLoopData extends BaseGameData{

}
export interface GameData extends BaseGameData{
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
