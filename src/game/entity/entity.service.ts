import {MiscEntityResolver, PlayerEntityResolver} from '../../base.interfaces';

import {Vec3} from '../../math/extendedMath.service';
import {MemoryTypesForNetvars, MemoryTypesForSignatures, Netvars, OffsetCollection, Signatures} from '../../offsets';
import {MemoryTypes} from '../../process/process.interfaces';
import {createResolver, gM, mT, rbf, rpm} from '../../shared/declerations';
import {PlayerEntity} from './entity.interfaces';
import {WeaponEntity} from './weapon.entity';

export class EntityBase {
  private entityListBaseAddress;

  private playerEntityBaseList: { [index: number]: any } = {};

  private miscEntityBaseList: { [index: number]: any } = {};

  private entityList: PlayerEntity[] = [];

  constructor(private offsets: OffsetCollection) {
    this.entityListBaseAddress = gM('client.dll').modBaseAddr + this.offsets.signatures.dwEntityList;
  }

  public entity = (entityIndex: number) => this.entityList[entityIndex];

  update(entityId: number) {
    const p = this.getPlayerResolver(entityId);
    this.entityList[entityId] = {
      ...this.entityList[entityId],
      health: p.m_iHealth(),
      team: p.m_iTeamNum(),
      origin: p.m_vecOrigin(),
      vecView: p.m_vecViewOffset(),
      lifeState: p.m_lifeState(),
      getBonePosition: (bone: number) => this.getBonePositionByResolver(p, bone),
      read: <T>(offset: number, type: MemoryTypes): T => rpm(p.base + offset, type) as T,
      readBuffer: (offset: number, bytes: number): Buffer => rbf(p.base + offset, bytes) as Buffer,
      crosshairEntity: this.entity(p.m_iCrosshairId() || -1),
    };
    const currentEntity: PlayerEntity = this.entity(entityId);
    const currentWeaponEntityForEntity = this.getWeaponEntityResolver(p);
    if (!currentEntity.weaponEntity || currentEntity.weaponEntity.base !== currentWeaponEntityForEntity.base) {
      currentEntity.weaponEntity = new WeaponEntity(currentWeaponEntityForEntity);
    }
  }

  getBonePositionByResolver(entity: PlayerEntityResolver, bone: number): Vec3 {
    const boneBase = entity.m_dwBoneMatrix(mT.dword);
    const boneMatrixBuffer: Buffer = rbf(boneBase + (0x30 * bone), 64);
    const boneMatrixList: number[] = [];
    for (let i = 0; i < 16; i++) {
      boneMatrixList[i] = boneMatrixBuffer.readFloatLE(i * 0x4);
    }
    return { x: boneMatrixList[3], y: boneMatrixList[7], z: boneMatrixList[13] };
  }

  private getPlayerResolver(entityIndex: number): PlayerEntityResolver {
    this.playerEntityBaseList[entityIndex] = this.getBaseOffset(entityIndex);
    return this.buildPlayerResolver(entityIndex);
  }

  private getMiscResolver(entityIndex: number): MiscEntityResolver {
    this.miscEntityBaseList[entityIndex] = this.getBaseOffset(entityIndex);
    return this.buildMiscResolver(entityIndex);
  }

  private getBaseOffset(entityIndex: number): number {
    return rpm(this.entityListBaseAddress + 0x10 * entityIndex, mT.dword);
  }

  private buildPlayerResolver(entityIndex: number): PlayerEntityResolver {
    const resolver: PlayerEntityResolver = createResolver<Netvars>(
        this.playerEntityBaseList[entityIndex], this.offsets.netvars, MemoryTypesForNetvars, {});
    resolver.base = this.playerEntityBaseList[entityIndex];
    return resolver;
  }

  private buildMiscResolver(entityIndex: number): MiscEntityResolver {
    // eslint-disable-next-line no-undef
    const resolver: MiscEntityResolver = createResolver<Netvars & Signatures>(
        this.playerEntityBaseList[entityIndex],
        { ...this.offsets.netvars, ...this.offsets.signatures },
        { ...MemoryTypesForNetvars, ...MemoryTypesForSignatures }, {});
    resolver.base = this.miscEntityBaseList[entityIndex];
    return resolver;
  }


  private getWeaponEntityResolver(entityResolver: PlayerEntityResolver): MiscEntityResolver {
    let dwWeaponbase = entityResolver.m_hActiveWeapon() - 1;
    // eslint-disable-next-line no-bitwise
    dwWeaponbase &= 0xFFF;
    return this.getMiscResolver(dwWeaponbase);
  }

  private getCurrentWeaponId(entityResolver: PlayerEntityResolver) {
    return this.getWeaponEntityResolver(entityResolver).m_iItemDefinitionIndex();
  }
}
