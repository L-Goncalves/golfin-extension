import { sendToContentScript } from "@plasmohq/messaging"

const handler = async (req) => {
  const { color } = req.body
  await sendToContentScript({
    body: { color },
    name: "update-theme-color"
  })

  return { success: true }
}

export default handler
