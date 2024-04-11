import dayjs from 'dayjs';
import Day from './Day';
import uuid from 'react-uuid';
import { Fragment, memo, useMemo, useState } from 'react';
import EmptyDates from './EmptyDates';
import { useRecoilValue } from 'recoil';
import { globalCurrentDateState } from 'states/globalCurrentDateState';

const Days = ({ year, month }: { year: number; month: number }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState<number>(0);
  const globalCurrentDate = useRecoilValue(globalCurrentDateState);

  const targetDate = useMemo(() => dayjs().set('year', year).set('month', month), [year, month]);
  const datesOfMonth = useMemo(
    () => Array.from(new Array(targetDate.daysInMonth()).fill(0), (_, index) => index + 1),
    [targetDate.daysInMonth(), year, month]
  );
  const firstDateIndex = useMemo(
    () => targetDate.startOf('month').day(),
    [targetDate.startOf('month').day(), year, month]
  );

  return (
    <>
      <EmptyDates firstDateIndex={firstDateIndex} />
      {datesOfMonth.map((date) => {
        const isToday =
          globalCurrentDate.date() === date && globalCurrentDate.year() === year && globalCurrentDate.month() === month;
        return (
          <Day
            key={uuid()}
            isToday={isToday}
            firstDateIndex={firstDateIndex}
            date={date}
            year={year}
            month={month}
            isSelected={localSelectedDate === date}
            setLocalSelectedDate={setLocalSelectedDate}
          />
        );
      })}
    </>
  );
};

export default memo(Days);
