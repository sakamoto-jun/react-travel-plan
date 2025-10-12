import LeftArrowIcon from "@/assets/icons/keyboard_arrow_left.svg?react";
import { ko } from "date-fns/locale";
import { useMemo, useState } from "react";
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TravelDateSelector.css";

const TravelDateSelector = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const monthsShown = useMemo(() => 2, []);

  const handleChange = ([startDay, endDay]: [Date | null, Date | null]) => {
    setStartDate(startDay);
    setEndDate(endDay);
  };

  const maxDate =
    startDate && !endDate
      ? new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 10
        )
      : undefined;

  return (
    <DatePicker
      inline
      monthsShown={monthsShown}
      selectsRange
      startDate={startDate}
      endDate={endDate}
      minDate={today}
      maxDate={maxDate}
      locale={ko}
      onChange={handleChange}
      calendarClassName="custom-datepicker"
      dayClassName={(date) =>
        date.getDay() === 0 ? "react-datepicker__sunday" : ""
      }
      renderCustomHeader={({
        monthDate,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
      }: ReactDatePickerCustomHeaderProps) => (
        <div className="flex justify-between items-center">
          <button
            aria-label="Previous Month"
            className={
              "react-datepicker__navigation react-datepicker__navigation--previous"
            }
            style={{
              visibility: customHeaderCount === 0 ? "visible" : "hidden",
            }}
            onClick={decreaseMonth}
          >
            <LeftArrowIcon />
          </button>
          <span className="react-datepicker__current-month">
            {monthDate.toLocaleString("ko-KR", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            aria-label="Next Month"
            className={
              "react-datepicker__navigation react-datepicker__navigation--next"
            }
            style={{
              visibility:
                customHeaderCount === monthsShown - 1 ? "visible" : "hidden",
            }}
            onClick={increaseMonth}
          >
            <LeftArrowIcon className="scale-x-[-1]" />
          </button>
        </div>
      )}
    />
  );
};

export default TravelDateSelector;
