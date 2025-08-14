import { sendToContentScript } from "@plasmohq/messaging";

const handler = async (req,res) => {
  const { timestamp } = req.body
  await sendToContentScript({
    body: { timestamp },
    name: "update-dropdown-timestamp"
  })

  return { success: true }
};  

export default handler;
