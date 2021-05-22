import { Car } from '../car/domain/Car';
import { DrivingRecord } from '../DrivingRecord/domain/DrivingRecord';
import { User } from './domain/User';

export class UserMapper {
  static toService(
    userRow:any,
    carRows:any[],
    driveRecordRow:any[],
    characters: any[],
  ): User | null {
    if (!userRow) {
      return null;
    }
    const cars = carRows.map((e) => new Car(e.car_id,
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
    const driveRecords = driveRecordRow.map((e) => new DrivingRecord(
      e.record_id,
      e.user_id,
      e.cruisecontrol,
      e.costing,
      e.overspeed,
      e.hightorque,
      e.idling,
      e.anticipation,
      e.driving_time,
      e.engine_on_time,
      e.date,
      e.distance,
      e.start_point,
      e.end_point,
      e.start_time,
      e.end_time,
      e.total_point,
      e.summary,
      characters.filter((e2) => e2.record_id === e.record_id).map((e) => e.character),
    ));
    const user = new User(
      userRow.user_id, userRow.name, cars, driveRecords,
    );

    return user;
  }
}
