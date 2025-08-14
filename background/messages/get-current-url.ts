import { sendToContentScript } from "@plasmohq/messaging";

const handler = async (req,res) => {


  // Send the color message to the content script
  const response = await sendToContentScript({
    name: "get-current-url"
  });

  // Log the response from the content script
  console.log("Response from content script:", response);

 res.send({
    ...response
 })
};

export default handler;
