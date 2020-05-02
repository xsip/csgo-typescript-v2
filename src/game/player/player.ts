import { gM, wpm } from '../../shared/declerations';
import { offsets } from '../offsets';
import { EMemoryTypes } from '../../process/process.interfaces';

type booleanByIndex = {[index: string]: boolean};
export class Player {
  constructor() {
    console.log('player init');
    // okay
  }

  // eslint-disable-next-line class-methods-use-this
  private canJump = true;

  private panoramaBase = () => gM('client_panorama.dll').modBaseAddr;

  private canDoCollection: booleanByIndex = {};

  private performAction(action: number) {
    if (!this.canDoCollection[action]) {
      this.canDoCollection[action] = true;
    }

    if (this.canDoCollection[action]) {
      this.canDoCollection[action] = false;
      wpm(this.panoramaBase() + action, 5, EMemoryTypes.int);
    }

    setTimeout(() => {
      wpm(this.panoramaBase() + action, 4, EMemoryTypes.int);
      this.canDoCollection[action] = true;
    }, 10);
  }

  jump(): void {
    this.performAction(offsets.signatures.dwForceJump);
  }

  attack(): void {
    this.performAction(offsets.signatures.dwForceAttack);
  }

  attack2(): void {
    this.performAction(offsets.signatures.dwForceAttack2);
  }
}
