import moment from 'moment';
import { DrivingRecordRepository } from '../DrivingRecordRepository';
import { PayloadValidationError } from '../../infra/PayloadValidationError';

export class InsertDrivingRecord {
  private repo: DrivingRecordRepository;

  constructor() {
    this.repo = new DrivingRecordRepository();
  }

  async execute(body:any) {
    const {
      userId,
      cruisecontrol,
      costing,
      overspeed,
      hightorque,
      idling,
      anticipation,
      drivingTime,
      engineOnTime,
      distance,
      startPoint,
      endPoint,
      startTime,
      endTime,
      recordTitle,
    } = body;
    if (!userId
      || !cruisecontrol
      || !costing
      || !overspeed
      || !hightorque
      || !idling
      || !anticipation
      || !drivingTime
      || !engineOnTime
      || !distance
      || !startPoint
      || !endPoint
      || !startTime
      || !endTime
    ) {
      throw new PayloadValidationError();
    }
    const totalPoint = Number(cruisecontrol)
      + Number(costing)
      + Number(overspeed)
      + Number(hightorque)
      + Number(idling)
      + Number(anticipation);

    const title = recordTitle || `From ${startPoint} to ${endPoint}`;
    const summary = `You scored in the top ${(100 - (drivingTime - engineOnTime))}%.
Compared to the average user, the ability to recognize information and comply with speed is better, but the ability to park is insufficient.`;
    const records = await this.repo.getListByUserId(userId);
    const lastRecords = records[records.length - 1];
    await this.repo.insertRecordWithUserId(userId,
      title,
      cruisecontrol,
      costing,
      overspeed,
      hightorque,
      idling,
      anticipation,
      drivingTime,
      engineOnTime,
      new Date(),
      distance,
      startPoint,
      endPoint,
      moment(startTime).toDate(),
      moment(endTime).toDate(),
      totalPoint,
      summary);
    let speedResult: string;
    if (overspeed > 80) {
      speedResult = 'Excellent';
    } else {
      speedResult = overspeed > 60 ? 'Good' : 'Bad';
    }
    let moralityResult: string;
    if (idling > 80) {
      moralityResult = 'Excellent';
    } else {
      moralityResult = idling > 60 ? 'Good' : 'Bad';
    }
    let fuelResult: string;
    if (cruisecontrol > 80) {
      fuelResult = 'Excellent';
    } else {
      fuelResult = cruisecontrol > 60 ? 'Good' : 'Bad';
    }
    const rate = totalPoint / 600;
    let startResult: number;
    if (rate === 1) {
      startResult = 5;
    } else if (totalPoint > 540) {
      startResult = 4.5;
    } else if (totalPoint > 480) {
      startResult = 4;
    } else if (totalPoint > 420) {
      startResult = 3.5;
    } else if (totalPoint > 360) {
      startResult = 3;
    } else if (totalPoint > 300) {
      startResult = 2.5;
    } else if (totalPoint > 240) {
      startResult = 2;
    } else if (totalPoint > 180) {
      startResult = 1.5;
    } else if (totalPoint > 120) {
      startResult = 1;
    } else {
      startResult = totalPoint > 60 ? 0.5 : 0;
    }
    const comment = lastRecords.compareScore(totalPoint);
    return {
      stars: startResult,
      speed: speedResult,
      morality: moralityResult,
      fuelEfficiency: fuelResult,
      description: `Compared to the last driving,
 the skill score ${comment ? 'increased' : 'decreased'} by ${comment} points`,
    };
  }
}
