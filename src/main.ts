import {BaseService} from './base.service';
import {ExtendedMath, Vec3} from './math/extendedMath.service';
import {getOffsets} from './offsets';
import {MemoryTypes} from './process/process.interfaces';
import {Global} from './shared/declerations';

getOffsets().then((offsets) => {
    const base: BaseService = new BaseService({
        webSocketService: {
            start: false,
            socketServicePort: 8080,
        },
        offsets,
    });

    base.run();

    /*let allLocations = [];
    let position: any;
    let viewAngles: any;
    let vecView: any;*/

    base.afterEntityLoop().subscribe((data) => {
        /*if (data.localEntity.crosshairEntity) {
            // data.entityBase.update(data.localEntity.crosshairEntity.index);
            const headPosLocal = ExtendedMath.addVec(
                data.localEntity.origin, data.localEntity.vecView);
            const headPosEnemy = data.localEntity.crosshairEntity.getBonePosition(8);
            const aimAngles = ExtendedMath.calcAngle(headPosLocal, headPosEnemy);
            data.clientState.viewAngles = ExtendedMath.subVec(
                aimAngles, ExtendedMath.multiplyVec(data.localEntity.punchAngles, 2.0));
            data.player.attack();
        }*/
        /*if (base.config.webSocketService.start) {
            data.sendMessageToEachWsClient(
                JSON.stringify({entities: allLocations, local: {position, viewAngles, vecView}}));
        }
        allLocations = [];*/
    });

    base.onNewData().subscribe((data) => {
        const headPosLocal = ExtendedMath.addVec(
            data.localEntity.origin, data.localEntity.vecView);
        const headPosEnemy = data.currentEntity.getBonePosition(8);
        const aimAngles = ExtendedMath.calcAngle(headPosLocal, headPosEnemy);
        const angleDiff = ExtendedMath.subVec(data.clientState.viewAngles, aimAngles);
        const fov = 10;
        if (((angleDiff.x > 0 && angleDiff.x <= fov) || (angleDiff.x < 0 && angleDiff.x >= fov * -1)) &&
            ((angleDiff.y > 0 && angleDiff.y <= fov) || (angleDiff.y < 0 && angleDiff.y >= fov * -1))) {
            if (data.currentEntity.team !==  data.localEntity.team && data.currentEntity.health >= 1) {
                data.clientState.viewAngles = ExtendedMath.subVec(
                    aimAngles, ExtendedMath.multiplyVec(data.localEntity.punchAngles, 2.0));
                data.player.attack();
            }
        } else {
        }
        /*const crosshairId = data.localEntity.read<number>(data.offsets.netvars.m_iCrosshairId, MemoryTypes.int);
        allLocations.push(data.currentEntity.origin);
        position = data.localEntity.origin;
        viewAngles = data.clientState.viewAngles;
        vecView = data.localEntity.vecView;*/

        // console.log(data.localEntity.weaponEntity.name);
        // console.log(data.localEntity.weaponEntity.id);
        // There are Three ways to get data:

        // 1. Reading a buffer and then getting data from this buffer.
        //  const healthBuffer = data.localEntity.readBuffer(offsets.netvars.m_iHealth, 4);
        //  const health = healthBuffer.readIntLE(0, 4);

        // 2. Using quick access for the most basic entity vars.
        //  const health = data.localEntity.health;

        // 3. Reading a type by offset
        //  const health = data.localEntity.read<number>(offsets.netvars.m_iHealth,MemoryTypes.int);
        //  console.log(data.localEntity.health);

        // To get the bone position of a PlayerEntity, you can do one of the following executions

        // 1. To get the bone data for the currentLoop PlayerEntity
        //  console.log(data.currentEntity.getBonePosition(8));
        // or 2. To get the bone position for a entity by index ( index 10 in this case

        //  console.log(data.entityBase.entity(10).getBonePosition(8));
    });
}).catch((e) => {
    console.log('couldnt load offsets...');
});
