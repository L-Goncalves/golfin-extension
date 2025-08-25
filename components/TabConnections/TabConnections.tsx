import { Checkbox } from "~components/Checkbox/Checkbox"


import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { shouldAutoConnect } from "~content-scripts/storage"
import { useTranslation } from "~hooks/useTranslation"

export const TabConnections = () => {
  const { t } = useTranslation()
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
      <h2>{t("tabconnections.h2")}</h2>

      <p>{t("tabconnections.paragraph")}</p>
      <div>
      <h3>{t("tabfeed.options.label")}</h3>
        <Checkbox
          onChange={(checked: boolean) =>
            handleFeedCheckbox(checked, "autoConnect", setAutoConnect)
          }
          id={"accept-auto-connections"}
          label={t("tabconnections.auto_connect")}
          tooltip={t("tabconnections.auto_connect_tooltip")}
          checked={autoConnect}
        />
      </div>
    </div>
  )
}
