import clsx from "clsx";
import Button from "../common/Button";

const steps = [
  { text: "날짜 확인" },
  { text: "장소 선택" },
  { text: "숙소 선택" },
];

const PlanSteps = () => {
  const currentStep = 0;

  return (
    <div className="px-20 py-50 flex flex-col items-center justify-between">
      <ul className="w-78 mx-8 flex flex-col gap-y-30 text-left">
        {steps.map((step, index) => {
          const isActive = index === currentStep;

          return (
            <li
              key={index}
              className={clsx("text-15 font-semibold leading-normal", {
                "text-main": isActive,
                "text-gray300": !isActive,
              })}
            >
              {`STEP ${index + 1}`} <br />
              {step.text}
            </li>
          );
        })}
      </ul>
      <Button>다음</Button>
    </div>
  );
};

export default PlanSteps;
