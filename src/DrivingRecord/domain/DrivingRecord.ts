export class DrivingRecord {
  private record_id :number;

  private user_id :number;

  private cruisecontrol :number;

  private costing :number;

  private overspeed :number;

  private hightorque :number;

  private idling :number;

  private anticipation :number;

  private driving_time :number;

  private engine_on_time :number;

  private date :Date;

  private distance :number;

  private start_point :string;

  private end_point :string;

  private start_time :Date;

  private end_time :Date;

  private total_point :number;

  private summary :string;

  private character: string[];

  private driveAssesments : any[];

  constructor(
    record_id :number,
    user_id :number,
    cruisecontrol :number,
    costing :number,
    overspeed :number,
    hightorque :number,
    idling :number,
    anticipation :number,
    driving_time :number,
    engine_on_time :number,
    date :Date,
    distance :number,
    start_point :string,
    end_point :string,
    start_time :Date,
    end_time :Date,
    total_point :number,
    summary :string,
    character: string[],
    driveAssesments : any[],
  ) {
    this.record_id = record_id;
    this.user_id = user_id;
    this.cruisecontrol = cruisecontrol;
    this.costing = costing;
    this.overspeed = overspeed;
    this.hightorque = hightorque;
    this.idling = idling;
    this.anticipation = anticipation;
    this.driving_time = driving_time;
    this.engine_on_time = engine_on_time;
    this.date = date;
    this.distance = distance;
    this.start_point = start_point;
    this.end_point = end_point;
    this.start_time = start_time;
    this.end_time = end_time;
    this.total_point = total_point;
    this.summary = summary;
    this.character = character;
    this.driveAssesments = driveAssesments;
  }
}
