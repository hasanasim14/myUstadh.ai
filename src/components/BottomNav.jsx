import { useEffect, useRef, useState } from "react";

const BottomNav = ({ currentTab, setTab }) => {
  const tabs = [
    { id: "content", label: "Content" },
    { id: "chat", label: "Chat" },
    { id: "library", label: "Library" },
  ];

  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const currentRef = tabRefs.current[currentTab];
    if (currentRef) {
      const { offsetLeft, offsetWidth } = currentRef;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [currentTab]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-around items-center border-t border-gray-200 bg-white py-6"
    >
      <span
        className="absolute -top-0 h-1 bg-[#0a0a0a] rounded-full transition-all duration-300"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[tab.id] = el)}
          onClick={() => setTab(tab.id)}
          className={`relative flex flex-col items-center text-sm transition-colors duration-300 ${
            currentTab === tab.id ? "text-[#0a0a0a]" : "text-[#666666]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
