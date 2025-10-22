import LeftArrowIcon from "@/assets/icons/keyboard_arrow_left.svg?react";
import { format } from "date-fns";
import { useMemo } from "react";
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TravelDateSelector.css";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const TravelDateSelector = ({ startDate, endDate, onChange }: Props) => {
  const today = new Date();
  const monthsShown = useMemo(() => 2, []);

  const handleChange = ([startDay, endDay]: [Date | null, Date | null]) => {
    onChange(startDay, endDay);
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
            type="button"
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
            {format(monthDate, "yyyy년 MM월")}
          </span>
          <button
            type="button"
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
