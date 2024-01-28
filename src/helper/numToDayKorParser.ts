import { NUMBER_TO_DAY_KOR } from 'constants/dates';

export const numToDayKorParser = (weekIndexes: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | null)[]) => {
  if (weekIndexes.includes(null)) {
    return '안함';
  }
  if (weekIndexes.includes(7)) {
    return '날짜 지정';
  }
  if (weekIndexes.includes(0) && weekIndexes.includes(6) && weekIndexes.length === 2) {
    return '주말';
  }
  if (!weekIndexes.includes(0) && !weekIndexes.includes(6) && weekIndexes.length === 5) {
    return '주중';
  }
  return weekIndexes.map((weekIndex) => NUMBER_TO_DAY_KOR[weekIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6]).join(', ');
};
