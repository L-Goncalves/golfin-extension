import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabConnections.scss"

import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { shouldAutoConnect } from "~content-scripts/storage"

export const TabConnections = () => {
  const [autoConnect, setAutoConnect] = useState(false)

  const handleFeedCheckbox = async (
    checked: boolean,
    key: string,
    stateFunc: any
  ) => {
    const storage = new Storage()
    stateFunc(checked)

    await storage.set(key, checked)
  }

  useEffect(() => {
    const fetchInitialState = async () => {
      const connect = await shouldAutoConnect()
      setAutoConnect(connect)
    }

    fetchInitialState()
  }, [])

  return (
    <div className="tab-connections">
      <h2>Minha Rede</h2>

      <p>Olá!😁 Essa seção é dedicada a te ajudar a se conectar com pessoas!</p>
      <div>
      <h3>Opções: </h3>
        <Checkbox
          onChange={(checked: boolean) =>
            handleFeedCheckbox(checked, "autoConnect", setAutoConnect)
          }
          id={"accept-auto-connections"}
          label={"Aceitar automaticamente conexões"}
          tooltip={"Perfeito pra você que recebe convites o tempo todo 💖"}
          checked={autoConnect}
        />
      </div>
    </div>
  )
}
