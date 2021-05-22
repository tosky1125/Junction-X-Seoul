import { QueryExecutor } from '../infra/QueryExecutor';
import { DrivingRecordMapper } from './DrivingRecordMapper';

export class DrivingRecordRepository {
  async getListByUserId(userId: number) {
    const conn = QueryExecutor.getInstance().getConnection();
    const drivingRecords = await conn('driving_records').select().where({ user_id: userId });
    const recordIds = drivingRecords.map((e:any) => e.record_id);
    const characters = await conn('course_character').select().whereIn('record_id', recordIds);
    return DrivingRecordMapper.toService(drivingRecords, characters);
  }
}
