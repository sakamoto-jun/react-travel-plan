import UpArrowIcon from '@/assets/icons/keyboard_arrow_up.svg?react';
import { usePlanStore } from '@/store';
import { convertMinutesToTime, convertTimeToMinutes, formatTimeUnit } from '@/utils/time';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import Button from '../common/Button';

const StepDateConfirm = ({ onCompleted }: { onCompleted: () => void }) => {
  const [hidden, setHidden] = useState(false);

  const dailyTimes = usePlanStore((s) => s.dailyTimes);
  const setDailyTimes = usePlanStore((s) => s.setDailyTimes);

  const { hours, minutes } = useMemo(() => {
    const totalTime =
      dailyTimes?.reduce((sum, { startTime, endTime }) => {
        return sum + (convertTimeToMinutes(endTime) - convertTimeToMinutes(startTime));
      }, 0) ?? 0;

    const time = convertMinutesToTime(totalTime);

    return time;
  }, [dailyTimes]);

  return (
    <div className="w-[368px] flex flex-col gap-y-18">
      <p className="flex items-center gap-x-16 text-17 font-medium tracking-[0.17px]">
        <span>여행시간 상세설명</span>
        <span className="text-[#5A88FF]">{`총 ${hours}시간 ${formatTimeUnit(minutes)}분`}</span>
        <button
          type="button"
          className={clsx('transition-transform duration-200', !hidden && 'rotate-180')}
          onClick={() => setHidden((prev) => !prev)}
        >
          <UpArrowIcon />
        </button>
      </p>
      {!hidden && (
        <>
          <div>
            <p className="text-15 leading-[1.7] -tracking-[0.09px] break-keep break-words">
              입력하신 여행 기간이 시차를 고려한 현지 여행 기간이 맞는지 확인해 주시고 각 날짜의
              일정 시작시간과 종료시간을 현지 시간기준으로 설정해주세요. 기본 설정 시간은 오전
              10시~오후 10시 총 12시간입니다.
            </p>
          </div>
          <div>
            <div className="max-h-[400px] overflow-y-auto mb-36">
              <table className="w-full text-15 text-center">
                <thead className="bg-bg">
                  <tr>
                    <th className="py-10">일자</th>
                    <th className="py-10">요일</th>
                    <th className="py-10">시작시간</th>
                    <th className="py-10">종료시간</th>
                  </tr>
                </thead>
                <tbody className="before:contents-[''] before:block before:h-6">
                  {dailyTimes?.map((dailyTime, index) => (
                    <tr key={index}>
                      <td className="py-10">{format(dailyTime.date, 'M/dd')}</td>
                      <td className="py-10">{format(dailyTime.date, 'EEE')}</td>
                      <td className="py-10">
                        <input
                          data-testid="time-start"
                          type="time"
                          value={dailyTime.startTime}
                          onChange={(e) => setDailyTimes(index, e.currentTarget.value, 'startTime')}
                        />
                      </td>
                      <td className="py-10">
                        <input
                          data-testid="time-end"
                          type="time"
                          value={dailyTime.endTime}
                          onChange={(e) => setDailyTimes(index, e.currentTarget.value, 'endTime')}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button className="max-w-185" onClick={onCompleted}>
              시간 설정 완료
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StepDateConfirm;
