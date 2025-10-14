import VisaIcon from "@/assets/icons/airplane_ticket.svg?react";
import FlightIcon from "@/assets/icons/airplanemode_active.svg?react";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import VoltageIcon from "@/assets/icons/power.svg?react";
import ClockIcon from "@/assets/icons/schedule.svg?react";
import type { City } from "@/types";
import Button from "../common/Button";

interface CityDetailProps {
  city: City;
}

const CityDetail = ({ city }: CityDetailProps) => {
  return (
    <div className="w-full flex flex-col">
      <div className="mb-18 flex">
        <div className="flex-1 flex flex-col">
          <div className="mb-18">
            <h3 className="text-20 text-gray300 mb-10">
              {city.nameEn.toLocaleUpperCase()}
            </h3>
            <h2 className="text-30 font-bold">
              {city.country.name} {city.name}
            </h2>
          </div>
          <p className="text-14 leading-[160%] -tracking-[0.08px] mb-18 break-keep break-words">
            {city.description}
          </p>
          <div className="flex gap-x-26 mb-16">
            <div className="flex flex-col">
              <div className="mb-16 flex">
                <FlightIcon />
                <span className="ml-8 text-15 tracking-[0.15px] font-semibold">
                  항공
                </span>
              </div>
              <div className="text-14 tracking-[0.14px]">
                <p className="text-gray600 mb-8">직항</p>
                <p className="text-gray800 font-medium">
                  약 {city.flightHours}시간
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-16 flex">
                <VisaIcon />
                <span className="ml-8 text-15 tracking-[0.15px] font-semibold">
                  비자
                </span>
              </div>
              <div className="text-14 tracking-[0.14px]">
                <p className="text-gray600 mb-8">
                  {city.country.visa.required ? "필요" : "무비자"}
                </p>
                <p className="text-gray800 font-medium">
                  {city.country.visa.duration}일
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-16 flex">
                <VoltageIcon />
                <span className="ml-8 text-15 tracking-[0.15px] font-semibold">
                  전압
                </span>
              </div>
              <div className="text-14 tracking-[0.14px]">
                <p className="text-gray600 mb-8">콘센트</p>
                <p className="text-gray800 font-medium">
                  {city.country.voltage}V
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-16 flex">
                <ClockIcon />
                <span className="ml-8 text-15 tracking-[0.15px] font-semibold">
                  시차
                </span>
              </div>
              <div className="text-14 tracking-[0.14px]">
                <p className="text-gray600 mb-8">한국대비</p>
                <p className="text-gray800 font-medium">
                  {getTimeDiff(city.timezoneOffset)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          src={city.thumbnail}
          alt={city.name}
          className="w-[260px] rounded-10 ml-17"
        />
      </div>
      <Button className="w-185">
        <span className="ml-8 mr-5">일정 만들기</span>
        <ArrowIcon />
      </Button>
    </div>
  );
};

// 헬퍼 함수
const getTimeDiff = (cityOffset: number) => {
  const koreaOffset = 9; // UTC+9가 한국 기준
  const diff = cityOffset - koreaOffset;

  if (diff === 0) return "없음";
  return diff > 0 ? `+${diff}시간` : `${diff}시간`;
};

export default CityDetail;
