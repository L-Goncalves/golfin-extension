import React, { useState } from "react";
import "./Tabs.scss";

interface ITab {
  id: string;
  label: string;
  content: React.JSX.Element;
}

interface ITabProps {
  tabs: ITab[];
}

const Tabs = ({ tabs }: ITabProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
