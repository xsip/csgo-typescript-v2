import { gM, rbf } from '../../shared/declerations';
import { OffsetCollection } from '../../offsets';

export class RendererService {
  constructor(private offsets: OffsetCollection) {

  }

    viewMatrix: any[] = [];

    readViewMatrix() {
      const viewMatOffset = gM('client_panorama.dll').modBaseAddr + this.offsets.signatures.dwViewMatrix;
      const matBuffer: Buffer = rbf(viewMatOffset, 64);

      for (let i = 0; i < 16; i++) {
        this.viewMatrix[i] = matBuffer.readFloatLE(i * 0x4);
      }
    }
}
