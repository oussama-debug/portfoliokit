export class Booking {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _title: string,
    private readonly _startTime: Date,
    private readonly _endTime: Date,
    private readonly _createdAt: Date
  ) {}

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toObject() {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      startTime: this._startTime.toISOString(),
      endTime: this._endTime.toISOString(),
      createdAt: this._createdAt.toISOString(),
    };
  }
}
