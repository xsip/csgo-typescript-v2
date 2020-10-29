import {IModuleListEntry, Resolver} from '../../typings/typings';
import {ClientStateService} from '../game/clientState/clientState.service';

import {PlayerEntity} from '../game/entity/entity.interfaces';
import {EntityBase} from '../game/entity/entity.service';
import {Player} from '../game/player/player';
import {RendererService} from '../game/renderer/renderer.service';
import {OffsetCollection} from '../offsets';
import {MemoryTypes} from '../process/process.interfaces';
import {ProcessService} from '../process/process.service';

const notInitializedFunc = () => {
    throw Error('Globals not initialized!!');
};

export let proc: ProcessService;
export let gM: (moduleName: string) => IModuleListEntry = notInitializedFunc;
export let rpm: typeof ProcessService.prototype.readMemory = notInitializedFunc;
export let rbf: typeof ProcessService.prototype.readBuffer = notInitializedFunc;
export let wpm: typeof ProcessService.prototype.writeMemory = notInitializedFunc;
export const mT = MemoryTypes;

export let entityBase: EntityBase;

export let clientState: ClientStateService;
export let renderer: RendererService;
export let player: Player;
export const createResolver = <T, U = {}>(
    baseOffset: any, offsetList: T,
    typesForSignatures?: { [index: string]: MemoryTypes }, extendBy?: U): Resolver<T> => {
    const resolver: Resolver<typeof offsetList> & U = {
        base: baseOffset,
        ...extendBy || {},
        set: {},
    } as Resolver<typeof offsetList> & U;

    for (const k in offsetList as Object) {
        if (offsetList[k]) {
            resolver[k] = (type?: MemoryTypes) => rpm(resolver.base + offsetList[k], type || typesForSignatures[k]);
            resolver.set[k] = (value: any, type?: MemoryTypes) => {
                wpm(resolver.base + offsetList[k], value, type || typesForSignatures[k]);
            };
        } else {
            resolver[k] = (type?: MemoryTypes) => console.log(`${k} is not a valid offset`);
            resolver.set[k] = (value: any, type?: MemoryTypes) => {
                console.log(`${k} is not a valid offset`);
            };
        }
    }

    return resolver;
};
process.title = 'External Cs go!';
export const hackBase = (
    offsets: OffsetCollection,
    forEachPlayer: (enemy: PlayerEntity, entityIndex: number) => void,
    onUpdate: () => void) => {
    proc = new ProcessService('csgo.exe');
    gM = proc.getModule.bind(proc);
    rpm = proc.readMemory.bind(proc);
    rbf = proc.readBuffer.bind(proc);
    wpm = proc.writeMemory.bind(proc);

    clientState = new ClientStateService(offsets);
    entityBase = new EntityBase(offsets);
    renderer = new RendererService(offsets);
    player = new Player(offsets);
    console.log('hack initialized..\nstarting main loop..');

    const update = () => {
        clientState.update();
        entityBase.update(clientState.localEntityIndex);
        renderer.readViewMatrix();
    };

    update();

    const main = setInterval(() => {
        for (let i = 0; i < clientState.maxEntitys; i++) {
            entityBase.update(i);
            const entity = entityBase.entity(i);
            if (entity && entity.lifeState === 0) {
                if ((entity.team === 2 || entity.team === 3)) {
                    forEachPlayer(entity, i);
                }
            }
        }

        update();
        onUpdate();
    }, 0);
};

export enum WeaponIndex {
    WEAPON_DEAGLE = 1,
    WEAPON_ELITE = 2,
    WEAPON_FIVESEVEN = 3,
    WEAPON_GLOCK = 4,
    WEAPON_AK47 = 7,
    WEAPON_AUG = 8,
    WEAPON_AWP = 9,
    WEAPON_FAMAS = 10,
    WEAPON_G3SG1 = 11,
    WEAPON_GALILAR = 13,
    WEAPON_M249 = 14,
    WEAPON_M4A1 = 16,
    WEAPON_MAC10 = 17,
    WEAPON_P90 = 19,
    WEAPON_UMP45 = 24,
    WEAPON_XM1014 = 25,
    WEAPON_BIZON = 26,
    WEAPON_MAG7 = 27,
    WEAPON_NEGEV = 28,
    WEAPON_SAWEDOFF = 29,
    WEAPON_TEC9 = 30,
    WEAPON_TASER = 31,
    WEAPON_HKP2000 = 32,
    WEAPON_MP7 = 33,
    WEAPON_MP9 = 34,
    WEAPON_NOVA = 35,
    WEAPON_P250 = 36,
    WEAPON_SCAR20 = 38,
    WEAPON_SG556 = 39,
    WEAPON_SSG08 = 40,
    WEAPON_KNIFE = 42,
    WEAPON_FLASHBANG = 43,
    WEAPON_HEGRENADE = 44,
    WEAPON_SMOKEGRENADE = 45,
    WEAPON_MOLOTOV = 46,
    WEAPON_DECOY = 47,
    WEAPON_INCGRENADE = 48,
    WEAPON_C4 = 49,
    WEAPON_KNIFE_T = 59,
    WEAPON_M4A1_SILENCER = 60,
    WEAPON_USP_SILENCER = 61,
    WEAPON_CZ75A = 63,
    WEAPON_REVOLVER = 64,
    WEAPON_KNIFE_BAYONET = 500,
    WEAPON_KNIFE_FLIP = 505,
    WEAPON_KNIFE_GUT = 506,
    WEAPON_KNIFE_KARAMBIT = 507,
    WEAPON_KNIFE_M9_BAYONET = 508,
    WEAPON_KNIFE_TACTICAL = 509,
    WEAPON_KNIFE_FALCHION = 512,
    WEAPON_KNIFE_SURVIVAL_BOWIE = 514,
    WEAPON_KNIFE_BUTTERFLY = 515,
    WEAPON_KNIFE_PUSH = 516
}
