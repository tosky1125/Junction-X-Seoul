import { CarRepository } from '../CarRepository';

export class GetCarsByUserId {
  private repo: CarRepository;

  constructor() {
    this.repo = new CarRepository();
  }

  async execute(userId: number) {
    const cars = await this.repo.getCarListByUserId(userId);
    return cars;
  }
}
