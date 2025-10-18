import Modal, { ModalBackdrop, ModalPanel } from "@/components/common/Modal";
import { usePlanStore } from "@/store";
import Button from "../common/Button";
import TravelDateSelector from "./TravelDateSelector";

const TravelPeriodModal = () => {
  const { startDate, endDate, setStartDate, setEndDate, setStatus } =
    usePlanStore();

  const handleDateChange = (startDay: Date | null, endDay: Date | null) => {
    setStartDate(startDay);
    setEndDate(endDay);
  };

  const handleConfirm = () => {
    setStatus("planning");
  };

  return (
    <Modal>
      <ModalBackdrop />
      <ModalPanel className="text-center">
        <h2 className="mb-18 text-32 font-semibold">
          여행 기간이 어떻게 되시나요?
        </h2>
        <p className="mb-30 text-15 leading-normal">
          * 여행 일지는 최대 10일까지 설정 가능합니다. <br />
          현지 여행 기간(여행지 도착 날짜, 여행지 출발 날짜)으로 입력해 주세요.
        </p>
        <div className="mb-30">
          <TravelDateSelector
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex justify-end">
          <Button
            className="max-w-120"
            onClick={handleConfirm}
            disabled={!startDate || !endDate}
          >
            <span>선택</span>
          </Button>
        </div>
      </ModalPanel>
    </Modal>
  );
};

export default TravelPeriodModal;
