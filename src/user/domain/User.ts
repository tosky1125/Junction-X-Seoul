import { Car } from '../../car/domain/Car';
import { DrivingRecord } from '../../DrivingRecord/domain/DrivingRecord';

export class User {
  private userId: number;

  private name: string;

  private cars: Car[];

  private drivingRecords: DrivingRecord[];

  constructor(userId: number, name: string, cars: Car[], drivingRecords: DrivingRecord[]) {
    this.userId = userId;
    this.name = name;
    this.cars = cars;
    this.drivingRecords = drivingRecords;
  }
}
