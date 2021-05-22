import { DrivingRecordRepository } from '../DrivingRecordRepository';

export class GetPracticalCourse {
  private repo: DrivingRecordRepository;

  constructor() {
    this.repo = new DrivingRecordRepository();
  }

  async execute() {
    const courses = await this.repo.getPracticalCourse();
    return courses;
  }
}
