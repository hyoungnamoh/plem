export type Schedule = {
  id: number;
  name: string;
  category: string;
  repeats: Repeats;
  createdAt: string;
  updatedAt: null;
  startTime: Date;
  endTime: Date;
  notification: PlanNotification;
  repeatDays: number[];
};

export type AddSchedule = Omit<Schedule, 'createdAt' | 'id' | 'updatedAt'>;

export type Category = 'daily' | 'birth' | 'promise' | 'banking';
export type CategoryKor = '일상' | '생일' | '약속' | '금융';
