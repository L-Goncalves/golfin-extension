import { useState } from "react"

import { Button } from "~components/Button/Button"
import { TabFeed } from "~components/TabFeed/TabFeed"
import Tabs from "~components/Tabs/Tabs"

import "./index.scss"

import { TabJobs } from "~components/TabJobs/TabJobs"

function IndexPopup() {
  const [data, setData] = useState("")
  const tabData = [
    {
      id: "tab1",
      label: "Feed",
      content: <TabFeed />
    },
    { id: "tab2", label: "Vagas", content: <TabJobs /> },
    { id: "tab3", label: "Conexões", content: <div>Content for Tab 3</div> }
  ]

  return (
    <div className="container">
      <h1>Golfinho</h1>
      <h4>A sua extensão para o LinkedIn</h4>
      <Tabs tabs={tabData} />
    </div>
  )
}

export default IndexPopup
