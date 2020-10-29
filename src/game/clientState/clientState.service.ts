import { Resolver } from '../../../typings/typings';
import { Vec3 } from '../../math/extendedMath.service';
import { MemoryTypesForSignatures, OffsetCollection, Signatures } from '../../offsets';
import {
  createResolver, gM, mT, rpm,
} from '../../shared/declerations';

export class ClientStateService {
  public set viewAngles(angles: Vec3) {
    this.resolver().set.dwClientState_ViewAngles(angles);
  }

  public get viewAngles(): Vec3 {
    return this.privateViewAngles;
  }

    public currentMap: string = '';

    public maxEntitys: number = 0;

    public localEntityIndex: number;


    private clientStateBase;

    private resolverResult: Resolver<Signatures>;

    private privateViewAngles = { x: 0, y: 0, z: 0 };


    constructor(private offsets: OffsetCollection) {
      this.clientStateBase = rpm(gM('engine.dll').modBaseAddr + this.offsets.signatures.dwClientState, mT.dword);
      console.log(this.clientStateBase);
    }


    update() {
      const resolver = this.resolver();
      this.privateViewAngles = resolver.dwClientState_ViewAngles();
      this.currentMap = resolver.dwClientState_Map();
      this.maxEntitys = resolver.dwClientState_MaxPlayer();
      this.localEntityIndex = resolver.dwClientState_GetLocalPlayer();
    }

    private resolver(): Resolver<Signatures> {
      if (!this.resolverResult) {
        this.resolverResult = createResolver<Signatures>(
            this.clientStateBase, this.offsets.signatures, MemoryTypesForSignatures, {});
      }
      return this.resolverResult;
    }
}
