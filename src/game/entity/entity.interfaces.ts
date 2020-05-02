import { Vec3 } from '../../math/extendedMath.service';
import { EMemoryTypes } from '../../process/process.interfaces';
import {WeaponEntity} from "./weapon.entity";
export interface Entity {
    read: <T>(offset: number, type: EMemoryTypes) => T;
    readBuffer: (offset: number, bytes: number) => Buffer;
}

export interface PlayerEntity extends Entity {
    health: number;
    team: number;
    origin: Vec3;
    vecView: Vec3;
    lifeState: number;
    weaponEntity?: WeaponEntity;
    crosshairEntity: PlayerEntity | null;
    getBonePosition: (bone: number) => Vec3;
}
