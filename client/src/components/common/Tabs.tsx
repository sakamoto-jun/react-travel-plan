import clsx from "clsx";
import { useState, type HTMLAttributes } from "react";

type Tab = {
  title: string;
  component: React.ComponentType;
};

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
}

interface TabButtonsProps {
  tabs: Tab[];
  currentTab: number;
  onChangeTab: (index: number) => void;
}

const Tabs = ({ tabs, className }: TabsProps) => {
  const [currentTab, setCurrentTab] = useState(0);

  // 현 스텝 컴포넌트 함수 추출
  const CurrentComponent = tabs[currentTab].component;

  return (
    <div className={clsx("flex", className)}>
      {/* 좌측 탭 영역 */}
      <TabButtons
        tabs={tabs}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      {/* 우측 컨텐츠 영역 */}
      <CurrentComponent />
    </div>
  );
};

const TabButtons = ({ tabs, currentTab, onChangeTab }: TabButtonsProps) => {
  return (
    <div className="px-20 py-50">
      <ul className="flex flex-col items-center">
        {tabs.map((tab, index) => {
          const isActive = index === currentTab;

          return (
            <li key={index}>
              <button
                type="button"
                className={clsx(
                  "px-24 py-15 text-16 tracking-[0.16px] transition-colors duration-200",
                  isActive
                    ? "text-white bg-black font-medium"
                    : "text-gray800 bg-bg",
                  index === 0 && "rounded-t-6",
                  index === tabs.length - 1 && "rounded-b-6"
                )}
                onClick={() => onChangeTab(index)}
              >
                {tab.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
