import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

// @ts-ignore
import icon from "./assets/icon.png"
import { deleteAllStorage ,getAllStorageItems } from "./contentScripts/storage"

import "./index.scss"

import { MdOutlineLogout } from "react-icons/md"

import { InputToggle } from "~components/InputToggle/InputToggle"
import { TabConnections } from "~components/TabConnections/TabConnections"
import { TabJobs } from "~components/TabJobs/TabJobs"

const isDev = process.env.NODE_ENV == "development"

function IndexPopup() {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false)

  useEffect(() => {
    const fetchStorageData = async () => {
      const storage = new Storage()
      const storedEnabledState = await storage.get("enabled")
      const isEnabledValue = !!storedEnabledState
      setIsExtensionEnabled(isEnabledValue)
    }

    // Check if user is authenticated
    fetchStorageData()
  })

  const tabData = [
    { id: "tab1", label: "Feed", content: <TabFeed /> },
    { id: "tab2", label: "Vagas", content: <TabJobs /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> }
  ]

  const handleToggleChange = async (enabled: boolean) => {
    setIsExtensionEnabled(enabled)
    const storage = new Storage()
    await storage.set("enabled", enabled)
  }

  return (
    <div className="container">
      
      <div>
      {isDev && (   <p>Modo desenvolvedor está ativado.</p>)}
        <div>
          <img width={50} src={icon} />
          <h1>GolfIn</h1>
        </div>
        <h4>A sua extensão para o LinkedIn!</h4>

      </div>

      <>
        <InputToggle
          label="Habilitar extensão"
          value={isExtensionEnabled}
          onChange={handleToggleChange}
        />
     
        <Tabs tabs={tabData} />
      </>
      {isDev && <><button onClick={deleteAllStorage} > DELETAR TODA STORAGE</button>
      <button onClick={getAllStorageItems} > VER STORAGE</button></>}
      {/*  */}
    </div>
  )
}

export default IndexPopup
