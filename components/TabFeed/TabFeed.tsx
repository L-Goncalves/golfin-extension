import { Checkbox } from "~components/Checkbox/Checkbox"

import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import ColorPicker from "~components/ColorPicker/ColorPicker"
import { KeywordEditor } from "~components/KeywordEditor/KeywordEditor"
import {
  shouldRemoveAllFeedPosts,
  shouldRemoveFeedPosts,
  shouldSupressNotication
} from "~content-scripts/storage"
import { useTranslation } from "~hooks/useTranslation"

export const TabFeed = () => {
  const { t } = useTranslation()
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
    <div className="tabfeed my-4">
      <h2>{t("tabfeed.h2")}</h2>

      <p dangerouslySetInnerHTML={{ __html: t("tabfeed.paragraph") }} />
      
      <div>
        {t("tabfeed.options.label")}
        <div>
          <ColorPicker />
        </div>
    
        <Checkbox
          onChange={(checked) => handleFeedCheckbox(checked, "removeFeedPosts", setRemoveAllPosts)}
          id={"remove-all-postings"}
          label={t("tabfeed.options.remove_postings")}
          tooltip={t("tabfeed.options.remove_postings_tooltip")}
          checked={removeAllPosts}
          tooltipPosition="bottom"
        />
        <Checkbox
          id={"remove-posting-by-words"}
          label={t("tabfeed.options.remove_by_keywords")}
          tooltip={t("tabfeed.options.remove_by_keywords_tooltip")}
          onChange={(checked: boolean) => handleFeedCheckbox(checked, "removeFeedPostsByWords", setRemovePostsByWords)}
          checked={removePostsByWords}
        />

        <Checkbox
          id={"supress-notifications"}
          label={t("tabfeed.options.suppress_notifications")}
          tooltip={t("tabfeed.options.suppress_notifications_tooltip")}
          onChange={(checked: boolean) => handleFeedCheckbox(checked, "supressNotification", setRemoveNotifications)}
          checked={removeNotifications}
        />

        <KeywordEditor />
      </div>
    </div>
  )
}
