import { QueryExecutor } from '../infra/QueryExecutor';
import { DrivingRecordMapper } from './DrivingRecordMapper';

export class DrivingRecordRepository {
  async getListByUserId(userId: number) {
    const conn = QueryExecutor.getInstance().getConnection();
    const drivingRecords = await conn('driving_records').select().where({ user_id: userId });
    const recordIds = drivingRecords.map((e:any) => e.record_id);
    const characters = await conn('course_character').select().whereIn('record_id', recordIds);
    const assessments = await conn('drive_assessment').select().whereIn('record_id', recordIds);
    return DrivingRecordMapper.toService(drivingRecords, characters, assessments);
  }

  getPracticalCourse() {
    const conn = QueryExecutor.getInstance().getConnection();
    return conn('practical_course').select();
  }

  insertRecordWithUserId(userId: number,
    recordTitle: string,
    cruisecontrol: number,
    costing: number,
    overspeed: number,
    hightorque: number,
    idling: number,
    anticipation: number,
    drivingTime: number,
    engineOnTime: number,
    date: Date,
    distance: number,
    startPoint: string,
    endPoint: string,
    startTime: Date,
    endTime: Date,
    totalPoint: number,
    summary: string) {
    const conn = QueryExecutor.getInstance().getConnection();
    return conn('driving_records').insert({
      user_id: userId,
      record_title: recordTitle,
      cruisecontrol,
      costing,
      overspeed,
      hightorque,
      idling,
      anticipation,
      driving_time: drivingTime,
      engine_on_time: engineOnTime,
      date,
      distance,
      start_point: startPoint,
      end_point: endPoint,
      start_time: startTime,
      end_time: endTime,
      total_point: totalPoint,
      summary,
    });
  }
}
