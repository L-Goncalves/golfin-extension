import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabFeed.scss"

import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import { KeywordEditor } from "~components/KeywordEditor/KeywordEditor"
import { shouldRemoveAllFeedPosts, shouldRemoveFeedPosts } from "~contentScripts/storage"



export const TabFeed = () => {
  const [removeAllPosts, setRemoveAllPosts] = useState(false)
  const [removePostsByWords, setRemovePostsByWords] = useState(false)

  const handleFeedCheckbox = async (checked: boolean, key: string, stateFunc: any) => {
    const storage = new Storage();
    stateFunc(checked);

    await storage.set(key, checked) // Save the checkbox state in storage
  }

  useEffect(() => {
    const fetchInitialState = async () => {
      const shouldRemove = await shouldRemoveAllFeedPosts() // Fetch initial state
      const shouldRemoveByWords = await shouldRemoveFeedPosts()
      setRemoveAllPosts(shouldRemove)
      setRemovePostsByWords(shouldRemoveByWords);
    }

    fetchInitialState()
  }, [])

  return (
    <div className="tabfeed">
      <h2>Feed</h2>

      <p>
        Olá!😁 Essa seção é dedicada a melhorar o seu Feed! Aqui você pode
        filtrar o que você quer ver, ou não ver absolutamente nada para momentos
        de foco!
      </p>
      <div>
        Opções:
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
          onChange={(checked) => handleFeedCheckbox(checked, "removeFeedPostsByWords", setRemovePostsByWords)}
          checked={removePostsByWords}
        />
        <KeywordEditor />
      </div>
    </div>
  )
}
