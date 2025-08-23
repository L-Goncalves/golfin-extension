import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

// @ts-ignore
import icon from "./assets/icon.png"
import { deleteAllStorage ,getAllStorageItems } from "./content-scripts/storage"

import "./index.scss"

import { MdOutlineLogout } from "react-icons/md"

import { InputToggle } from "~components/InputToggle/InputToggle"
import { TabConnections } from "~components/TabConnections/TabConnections"
import { TabJobs } from "~components/TabJobs/TabJobs"
import { autoApply } from "~content-scripts/jobs"
import { isDev } from "~global"
import { useTranslation } from "~hooks/useTranslation"
import { LanguageSelector } from "~components/LanguageSelector/LanguageSelector"





function IndexPopup() {
  const { t } = useTranslation()
  const manifest = chrome.runtime.getManifest()
  const version = manifest.version
 
  const tabData = [
    { id: "tab1", label: t("tab1"), content: <TabFeed /> },
    { id: "tab3", label: t("tab3"), content: <TabConnections /> },
    { id: "tab2", label: t("tab2"), content: <TabJobs /> }
  ]

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
        {/* {isUpdateAvailable && <>
          <p className="warning-outdated">
          Existe uma nova versão da extensão disponível,{" "}
          <a
            href="https://chromewebstore.google.com/detail/golfin/paimcllbimjdfleoankkhpljgclpapee"
            target="_blank"
            rel="noopener noreferrer">
            clique aqui para ir para loja.
          </a>
        </p>
        
        </>} */}
        <LanguageSelector />
      </div>

      <>
      {/* <div className="enable-disable-extension">
      <InputToggle
              label="Habilitar extensão"
              value={isExtensionEnabled}
              onChange={handleToggleChange}
            />

      </div> */}
  
        <Tabs tabs={tabData} />
      </>
      {isDev && <>
      <button onClick={deleteAllStorage} > DELETAR TODA STORAGE</button>
      <button onClick={getAllStorageItems} > VER STORAGE</button>
      {/* <button onClick={autoApply} > Aplicar Automaticamente</button> */}
      
      </>}
      {/*  */}
    </div>
  )
}

export default IndexPopup
