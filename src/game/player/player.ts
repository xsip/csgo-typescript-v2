import { gM, wpm } from '../../shared/declerations';
import { OffsetCollection } from '../../offsets';
import { MemoryTypes } from '../../process/process.interfaces';

type booleanByIndex = {[index: string]: boolean};
export class Player {
  constructor(private offsets: OffsetCollection) {
    console.log('player init');
  }


  private panoramaBase = () => gM('client_panorama.dll').modBaseAddr;

  private canDoCollection: booleanByIndex = {};

  private performAction(action: number) {
    if (!this.canDoCollection[action]) {
      this.canDoCollection[action] = true;
    }

    if (this.canDoCollection[action]) {
      this.canDoCollection[action] = false;
      wpm(this.panoramaBase() + action, 5, MemoryTypes.int);
    }

    setTimeout(() => {
      wpm(this.panoramaBase() + action, 4, MemoryTypes.int);
      this.canDoCollection[action] = true;
    }, 10);
  }

  jump(): void {
    this.performAction(this.offsets.signatures.dwForceJump);
  }

  attack(): void {
    this.performAction(this.offsets.signatures.dwForceAttack);
  }

  attack2(): void {
    this.performAction(this.offsets.signatures.dwForceAttack2);
  }
}
