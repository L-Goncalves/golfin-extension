import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

// @ts-ignore
import icon from "./assets/icon.png"

import "./index.scss"

import { TabConnections } from "~components/TabConnections/TabConnections"
import { TabJobs } from "~components/TabJobs/TabJobs"

function IndexPopup() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false)

  const handleToggleEnabled = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value === "enabled"
    setIsEnabled(value)

    const storage = new Storage()
    await storage.set("enabled", value) // Save the enabled state to storage
  }

  useEffect(() => {
    const fetchStorageData = async () => {
      const storage = new Storage()
      const storedTheme = await storage.get("theme")
      const storedEnabledState = await storage.get("enabled")
      const isEnabledValue = storedEnabledState === "true" // or use JSON.parse if it's stored as a JSON boolean

      setIsEnabled(isEnabledValue)

      // Optionally, set the theme state if needed
    }

    fetchStorageData()
  }, [])
  const tabData = [
    {
      id: "tab1",
      label: "Feed",
      content: <TabFeed />
    },
    { id: "tab2", label: "Vagas", content: <TabJobs /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> }
  ]

  return (
    <div className="container">
      <div>
        <div>
          <img width={50} src={icon} />
          <h1>Golfynho</h1>
        </div>
       
        <h4>A sua extensão para o LinkedIn!</h4>
      </div>


      {/* Dropdown for enabling/disabling the extension */}
      <label htmlFor="extension-toggle">Habilitar extensão:</label>
      <select
        id="extension-toggle"
        value={isEnabled ? "enabled" : "disabled"}
        onChange={handleToggleEnabled}>
        <option value="enabled">Sim</option>
        <option value="disabled">Não</option>
      </select>
      <Tabs tabs={tabData} />
    </div>
  )
}

export default IndexPopup
