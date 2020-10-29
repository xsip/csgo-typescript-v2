import {BaseService} from './base.service';
import {getOffsets} from './offsets';
import {MemoryTypes} from './process/process.interfaces';

getOffsets().then((offsets ) => {
    process.exit(1);
    const base: BaseService = new BaseService({
        webSocketService: {
            start: false,
            socketServicePort: 8080,
        },
        offsets,
    });

    base.run();

    let allLocations = [];
    let position: any;
    let viewAngles: any;
    let vecView: any;

    base.afterEntityLoop().subscribe((data) => {
        if (base.config.webSocketService.start) {
            data.sendMessageToEachWsClient(
                JSON.stringify({entities: allLocations, local: {position, viewAngles, vecView}}));
        }
        allLocations = [];
    });

    base.onNewData().subscribe((data) => {
        const crosshairId = data.localEntity.read<number>(data.offsets.netvars.m_iCrosshairId, MemoryTypes.int);
        allLocations.push(data.currentEntity.origin);
        position = data.localEntity.origin;
        viewAngles = data.clientState.viewAngles;
        vecView = data.localEntity.vecView;

        if (data.localEntity.crosshairEntity) {
            data.player.attack();
        }
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
}).catch(e => {
    console.log('couldnt load offsets...');
});
