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
      date,
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
      || !date
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
      date,
      distance,
      startPoint,
      endPoint,
      startTime,
      endTime,
      totalPoint,
      summary);
  }
}
