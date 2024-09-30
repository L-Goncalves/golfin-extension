import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

// @ts-ignore
import icon from "./assets/icon.png"
import { deleteAllStorage, getAllStorageItems } from "./contentScripts/storage"

import "./index.scss"

import { MdOutlineLogout } from "react-icons/md"

import { InputToggle } from "~components/InputToggle/InputToggle"
import { TabConnections } from "~components/TabConnections/TabConnections"
import { TabJobs } from "~components/TabJobs/TabJobs"

const isDev = process.env.NODE_ENV == "development"



function IndexPopup() {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const manifest = chrome.runtime.getManifest()
  const version = manifest.version
  useEffect(() => {
    const fetchStorageData = async () => {
      const storage = new Storage()
      const storedEnabledState = await storage.get("enabled")
      const isEnabledValue = !!storedEnabledState
      
      setIsExtensionEnabled(isEnabledValue)
    //   const lastCheckedTime: string | null | undefined = await storage.get("lastCheckedTime");
    //   const currentTime = new Date();
    //   const lastTime = new Date(lastCheckedTime).getTime();
   
      
    //     // Set a threshold (e.g., check every 24 hours)
    //   const oneHour = 1 * 60 * 60 * 1000
    //   if (isEnabledValue && (!lastCheckedTime || currentTime.getTime() - lastTime > oneHour)) {
    //     chrome.runtime.requestUpdateCheck((status) => {
    //       console.log(status)

    //       if (status === "update_available") {
    //         setIsUpdateAvailable(true)
    //       }

    //       // Update the last checked time in storage
    //       storage.set("lastCheckedTime", currentTime.toISOString())
    //     })

    

    // }
  }
    // Check if user is authenticated
    fetchStorageData()
  }, [])

  const tabData = [
    { id: "tab1", label: "Início", content: <TabFeed /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> },
    { id: "tab2", label: "Vagas", content: <TabJobs /> }

  ]

  const handleToggleChange = async (enabled: boolean) => {
    setIsExtensionEnabled(enabled)
    const storage = new Storage()
    await storage.set("enabled", enabled)
  }

  return (
    <div className="container">
      <div>
        {isDev && <p>Modo desenvolvedor está ativado.</p>}
        <div>
          <div className="logo-icon-version">
            {/* <img src={icon} /> */}
            <h1>GolfIn</h1>
            <h6>V.{version}</h6>
           
          </div>
        </div>
        {isUpdateAvailable && <>
          <p className="warning-outdated">
          Existe uma nova versão da extensão disponível,{" "}
          <a
            href="https://chromewebstore.google.com/detail/golfin/paimcllbimjdfleoankkhpljgclpapee"
            target="_blank"
            rel="noopener noreferrer">
            clique aqui para ir para loja.
          </a>
        </p>
        
        </>}
      
      </div>

      <>
      <div className="enable-disable-extension">
      <InputToggle
              label="Habilitar extensão"
              value={isExtensionEnabled}
              onChange={handleToggleChange}
            />

      </div>
  
        <Tabs tabs={tabData} />
      </>
      {isDev && (
        <>
          <button onClick={deleteAllStorage}> DELETAR TODA STORAGE</button>
          <button onClick={getAllStorageItems}> VER STORAGE</button>
        </>
      )}
      {/*  */}
    </div>
  )
}

export default IndexPopup
