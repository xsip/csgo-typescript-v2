import {OffsetCollection} from '../../offsets';
import {MemoryTypes} from '../../process/process.interfaces';
import {gM, wpm} from '../../shared/declerations';

export class Player {

  private canDoCollection: Record<string, boolean> = {};
  constructor(private offsets: OffsetCollection) {
    console.log('player init');
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


  private panoramaBase = () => gM('client.dll').modBaseAddr;

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
}
