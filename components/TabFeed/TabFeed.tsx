import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabFeed.scss"

import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import ColorPicker from "~components/ColorPicker/ColorPicker"
import { KeywordEditor } from "~components/KeywordEditor/KeywordEditor"
import {
  shouldRemoveAllFeedPosts,
  shouldRemoveFeedPosts,
  shouldSupressNotication
} from "~content-scripts/storage"

export const TabFeed = () => {
  const [removeAllPosts, setRemoveAllPosts] = useState(false)
  const [removePostsByWords, setRemovePostsByWords] = useState(false)
  const [removeNotifications, setRemoveNotifications] = useState(false)
  const handleFeedCheckbox = async (
    checked: boolean,
    key: string,
    stateFunc: any
  ) => {
    const storage = new Storage()
    stateFunc(checked)

    await storage.set(key, checked) // Save the checkbox state in storage
  }

  useEffect(() => {
    const fetchInitialState = async () => {
      const shouldRemove = await shouldRemoveAllFeedPosts() // Fetch initial state
      const shouldRemoveByWords = await shouldRemoveFeedPosts()
      const shouldRemoveNotifications = await shouldSupressNotication()
      setRemoveAllPosts(shouldRemove)
      setRemovePostsByWords(shouldRemoveByWords);
      setRemoveNotifications(shouldRemoveNotifications);
    }

    fetchInitialState()
  }, [])

  return (
    <div className="tabfeed">
      <h2>Geral</h2>

      <p>
        Olá!😁 Essa seção é dedicada a melhorar o sua experiência geral e sua página de Início do LinkedIn!<br/> Aqui você pode
        filtrar o que você quer ver, ou não ver absolutamente nada para momentos
        de foco!
      </p>
      <div>
        Opções:
        <div>
          <ColorPicker />
        </div>
    
        <Checkbox
          onChange={(checked) => handleFeedCheckbox(checked, "removeFeedPosts", setRemoveAllPosts)}
          id={"remove-all-postings"}
          label={"Remover todas as postagens "}
          tooltip={"Otimo pra você que é viciado no LinkedIn🤣"}
          checked={removeAllPosts}
        />
        <Checkbox
          id={"remove-posting-by-words"}
          label={"Remover Postagens com palavras-chaves "}
          tooltip={
            "Vai limpar o seu feed para que você não se distraia com postagens controversas 🧠"
          }
          onChange={(checked: boolean) => handleFeedCheckbox(checked, "removeFeedPostsByWords", setRemovePostsByWords)}
          checked={removePostsByWords}
        />

        <Checkbox
          id={"supress-notifications"}
          label={"Silenciar Notificações"}
          tooltip={
            "Vai silenciar as notificações e remove-las visualmente, para que você possa se concentrar em outras coisas "
          }
          onChange={(checked: boolean) => handleFeedCheckbox(checked, "supressNotification", setRemoveNotifications)}
          checked={removeNotifications}
        />

        <KeywordEditor />
      </div>
    </div>
  )
}
