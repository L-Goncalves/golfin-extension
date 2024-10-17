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
import { isDev } from "~global"
import { sendToBackground } from "@plasmohq/messaging"


async function triggerQuestion(){
  await sendToBackground({
    name: "auto-apply-linkedin",
  });
}


function IndexPopup() {

  const manifest = chrome.runtime.getManifest()
  const version = manifest.version
 
  const tabData = [
    { id: "tab1", label: "Início", content: <TabFeed /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> },
    { id: "tab2", label: "Vagas", content: <TabJobs /> }

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
      <button onClick={() => triggerQuestion()} > Gerar resposta</button>
      
      </>}
      {/*  */}
    </div>
  )
}

export default IndexPopup
