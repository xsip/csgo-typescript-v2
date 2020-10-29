import {OffsetCollection} from '../../offsets';
import {gM, rbf} from '../../shared/declerations';

export class RendererService {

    viewMatrix: any[] = [];

    constructor(private offsets: OffsetCollection) {

    }

    readViewMatrix() {
        const viewMatOffset = gM('client.dll').modBaseAddr + this.offsets.signatures.dwViewMatrix;
        const matBuffer: Buffer = rbf(viewMatOffset, 64);

        for (let i = 0; i < 16; i++) {
            this.viewMatrix[i] = matBuffer.readFloatLE(i * 0x4);
        }
    }
}
