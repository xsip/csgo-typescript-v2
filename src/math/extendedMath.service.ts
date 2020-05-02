export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export interface Vec2 {
    x: number;
    y: number
}


export class ExtendedMath {
  constructor() {

  }

  public static subVec(from: Vec3, sub: Vec3): Vec3 {
    return {
      x: from.x - sub.x,
      y: from.y - sub.y,
      z: from.z - sub.z,
    };
  }

  public static calcAngle(src: Vec3, dst: Vec3): Vec3 {
    const angles: Vec3 = {} as Vec3;
    const delta: number[] = [(src.x - dst.x), (src.y - dst.y), (src.z - dst.z)];
    const hyp: number = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);
    angles.x = (Math.asin(delta[2] / hyp) * 57.295779513082);
    angles.y = (Math.atan(delta[1] / delta[0]) * 57.295779513082);
    angles.z = 0.0;
    if (delta[0] >= 0.0) {
      angles.y += 180.0;
    }


    return angles;
  }


  public static DEG2RAD(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  public static dotProduct(a: Vec3, b: Vec3 = { x: 0, y: 0, z: 0 }) {
    return (a.x * b.x + a.y * b.y + a.z * b.z);
  }

  public static getDistance(playerPos: Vec3, entityPos: Vec3): number {
    return Math.sqrt(ExtendedMath.dotProduct(ExtendedMath.subVec(entityPos, playerPos)));
  }

  public static angleDifference(viewAngles: Vec3, targetAngles: Vec3, dist: number): number {
    const pitch: number = viewAngles.x - targetAngles.x;
    const yaw : number = viewAngles.y - targetAngles.y;

    return Math.sqrt(Math.pow(pitch, 2.0) + Math.pow(yaw, 2.0));
  }

  public static worldToScreen(from: Vec3, viewMatrix: number[], width: number = 1280, height: number = 720): Vec2 {
    let w: number;
    const ret: Vec2 = {} as Vec2;

    ret.x = viewMatrix[0] * from.x + viewMatrix[1] * from.y + viewMatrix[2] * from.z + viewMatrix[3];
    ret.y = viewMatrix[4] * from.x + viewMatrix[5] * from.y + viewMatrix[6] * from.z + viewMatrix[7];
    w = viewMatrix[12] * from.x + viewMatrix[13] * from.y + viewMatrix[14] * from.z + viewMatrix[15];
    if (w < 0.01) {
      return { x: 0, y: 0 };
    }

    const invw: number = 1.0 / w;

    ret.x *= invw;
    ret.y *= invw;

    let x: number = width / 2;
    let y: number = height / 2;

    x += 0.5 * ret.x * width + 0.5;
    y -= 0.5 * ret.y * height + 0.5;

    ret.x = x;
    ret.y = y;
    return ret;
  }
}
