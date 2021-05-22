import { Car } from '../../car/domain/Car';
import { DrivingRecord } from '../../DrivingRecord/domain/DrivingRecord';

export class User {
  private userId: number;

  private name: string;

  private cars: Car[] | null;

  private drivingRecords: DrivingRecord[] | null;

  constructor(userId: number, name: string, cars?: Car[], drivingRecords?: DrivingRecord[]) {
    this.userId = userId;
    this.name = name;
    this.cars = cars || null;
    this.drivingRecords = drivingRecords || null;
  }

  setDrivingRecords(value: DrivingRecord[]) {
    this.drivingRecords = value;
  }

  setCars(value: Car[]) {
    this.cars = value;
  }
}
