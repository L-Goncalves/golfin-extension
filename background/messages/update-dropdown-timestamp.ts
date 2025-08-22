import { sendToContentScript } from "@plasmohq/messaging";

const handler = async (req,res) => {
  const { seconds } = req.body
  await sendToContentScript({
    body: { seconds },
    name: "update-dropdown-timestamp"
  })

  return { success: true }
};  

export default handler;
