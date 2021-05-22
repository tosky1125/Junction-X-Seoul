import { DrivingRecord } from './domain/DrivingRecord';

export class DrivingRecordMapper {
  static toService(driveRecordRow:any[], characters:any[], assessments:any[]):DrivingRecord[] {
    return driveRecordRow.map((e) => new DrivingRecord(
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
      assessments.filter((e2) => e2.record_id === e.record_id),
    ));
  }
}
