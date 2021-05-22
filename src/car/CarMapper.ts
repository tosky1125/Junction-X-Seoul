import { Car } from './domain/Car';

export class CarMapper {
  static toService(carRows:any[]) {
    return carRows.map((e) => new Car(e.car_id,
      e.manufacturer,
      e.model,
      e.km,
      e.oil,
      e.oil_filter,
      e.air_cleaner,
      e.transmission_fluid,
      e.brake_fluid,
      e.spark_plug,
      e.timing_belt,
      e.hood,
      e.trunk,
      e.head_lamp,
      e.rear_lamp,
      e.front_door,
      e.roof,
      e.front_tire,
      e.rear_tire));
  }
}
