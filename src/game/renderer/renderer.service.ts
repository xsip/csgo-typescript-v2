import { gM, rbf } from '../../shared/declerations';
import { offsets } from '../offsets';

export class RendererService {
  constructor() {

  }

    viewMatrix: any[] = [];

    readViewMatrix() {
      const viewMatOffset = gM('client_panorama.dll').modBaseAddr + offsets.signatures.dwViewMatrix;
      const matBuffer: Buffer = rbf(viewMatOffset, 64);

      for (let i = 0; i < 16; i++) {
        this.viewMatrix[i] = matBuffer.readFloatLE(i * 0x4);
      }
    }
}
