import clsx from "clsx";
import { useState, type PropsWithChildren } from "react";
import Button from "./Button";

type Step = {
  title: string;
  component: React.ComponentType<{ onNext: () => void }>;
};

interface WizardProps {
  steps: Step[];
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onChangeStep: (index: number) => void;
}

const Wizard = ({ steps, children }: PropsWithChildren<WizardProps>) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // 현 스텝 컴포넌트 함수 추출
  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="flex">
      {/* 좌측 스텝 영역 */}
      <Steps
        steps={steps}
        currentStep={currentStep}
        onChangeStep={setCurrentStep}
      />

      {/* 우측 컨텐츠 영역 */}
      <div className="relative flex-1 flex flex-col px-24 py-30">
        {children}
        <CurrentComponent onNext={onNext} />
      </div>
    </div>
  );
};

const Steps = ({ steps, currentStep, onChangeStep }: StepsProps) => {
  return (
    <div className="px-20 py-50 flex flex-col items-center justify-between">
      <ul className="w-78 mx-8 flex flex-col gap-y-30">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li key={index}>
              <button
                type="button"
                className={clsx(
                  "text-left text-15 font-semibold leading-normal transition-colors duration-200",
                  isCompleted && "text-main/60 line-through",
                  isActive ? "text-main" : "text-gray300"
                )}
                disabled={!isCompleted}
                onClick={() => index <= currentStep && onChangeStep(index)}
              >
                {`STEP ${index + 1}`} <br />
                {step.title}
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        className={clsx({ invisible: currentStep === steps.length - 1 })}
        onClick={() => onChangeStep(currentStep + 1)}
      >
        다음
      </Button>
    </div>
  );
};

export default Wizard;
