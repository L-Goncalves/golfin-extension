import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import { Button } from "~components/Button/Button";
import { TabFeed } from "~components/TabFeed/TabFeed";
import Tabs from "~components/Tabs/Tabs";
import { deleteAllStorage } from './contentScripts/storage';
// @ts-ignore
import icon from "./assets/icon.png";
import "./index.scss";
import { TabConnections } from "~components/TabConnections/TabConnections";
import { TabJobs } from "~components/TabJobs/TabJobs";
import { InputToggle } from "~components/InputToggle/InputToggle";

function IndexPopup() {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false);




  useEffect(() => {
    const fetchStorageData = async () => {
      const storage = new Storage();
      const storedEnabledState = await storage.get("enabled");
      const isEnabledValue = !!storedEnabledState
      setIsExtensionEnabled(isEnabledValue);
    };

    fetchStorageData();
  }, []);

  const tabData = [
    { id: "tab1", label: "Feed", content: <TabFeed /> },
    { id: "tab2", label: "Vagas", content: <TabJobs /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> },
  ];

  const handleToggleChange = async (enabled: boolean) => {
    setIsExtensionEnabled(enabled);

    const storage = new Storage();
    await storage.set("enabled", enabled)

  };


  return (
    <div className="container">
      <div>
        <div>
          <img width={50} src={icon} />
          <h1>GolfIn</h1>
        </div>
        <h4>A sua extensão para o LinkedIn!</h4>
      </div>
      
    
      <InputToggle 
        label="Habilitar extensão" 
        value={isExtensionEnabled} 
        onChange={handleToggleChange} 
      />
      
      <Tabs tabs={tabData} />
     
    </div>
  );
}

export default IndexPopup;
