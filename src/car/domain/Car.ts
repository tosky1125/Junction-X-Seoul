import { ChangeInterval } from './ChangeInterval';

const SWAP_LIMIT = 500;

export class Car {
  private carId: number;

  private manufacturer: string;

  private model: string;

  private km: number;

  private oil: number;

  private oilFilter: number;

  private airCleaner: number;

  private transmissionFluid: number;

  private brakeFluid: number;

  private sparkPlug: number;

  private timingBelt: number;

  private hood: boolean;

  private trunk: boolean;

  private headLamp: boolean;

  private rearLamp: boolean;

  private frontDoor: boolean;

  private roof: boolean;

  private frontTire: boolean;

  private rearTire: boolean;

  private oilSwap : boolean;

  private oilFilterSwap : boolean;

  private airCleanerSwap: boolean;

  private transmissionFluidSwap: boolean;

  private brakeFluidSwap: boolean;

  private sparkPlugSwap: boolean;

  private timingBeltSwap: boolean;

  constructor(
    carId: number,
    manufacturer: string,
    model: string,
    km: number,
    oil: number,
    oilFilter: number,
    airCleaner: number,
    transmissionFluid: number,
    brakeFluid: number,
    sparkPlug: number,
    timingBelt: number,
    hood: boolean,
    trunk: boolean,
    headLamp: boolean,
    rearLamp: boolean,
    frontDoor: boolean,
    roof: boolean,
    frontTire: boolean,
    rearTire: boolean,
  ) {
    this.carId = carId;
    this.manufacturer = manufacturer;
    this.model = model;
    this.km = km;
    this.oil = oil;
    this.oilFilter = oilFilter;
    this.airCleaner = airCleaner;
    this.transmissionFluid = transmissionFluid;
    this.brakeFluid = brakeFluid;
    this.sparkPlug = sparkPlug;
    this.timingBelt = timingBelt;
    this.hood = hood;
    this.trunk = trunk;
    this.headLamp = headLamp;
    this.rearLamp = rearLamp;
    this.frontDoor = frontDoor;
    this.roof = roof;
    this.frontTire = frontTire;
    this.rearTire = rearTire;
    this.oilSwap = ChangeInterval.oil - oil < SWAP_LIMIT;
    this.oilFilterSwap = ChangeInterval.oilFilter - oilFilter < SWAP_LIMIT;
    this.airCleanerSwap = ChangeInterval.airCleaner - airCleaner < SWAP_LIMIT;
    this.transmissionFluidSwap = ChangeInterval.transmissionFluid - transmissionFluid < SWAP_LIMIT;
    this.brakeFluidSwap = ChangeInterval.brakeFluid - brakeFluid < SWAP_LIMIT;
    this.sparkPlugSwap = ChangeInterval.sparkPlug - sparkPlug < SWAP_LIMIT;
    this.timingBeltSwap = ChangeInterval.timingBelt - timingBelt < SWAP_LIMIT;
  }
}
