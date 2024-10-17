import { isDev } from "~global";
import { changeUIColor, getCurrentColors } from "./colors";
import { generateManyAnswersNumeric, generateResponse } from "./ai";
import { getFormQuestions } from "./jobs";
import { QuestionType } from "./types";



export function listen(){
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        isDev && console.log("[APP] Received message from background script:", message);


        if (message.name === "get-theme-color") {
            const colors = await getCurrentColors();
    
            sendResponse({ colors });
          }

        if(message.name === "update-theme-color"){
            changeUIColor(message.body.color)
            
        }

        if (message.name === "auto-apply-linkedin") {
            const questions = getFormQuestions();
            
            const numericQuestions = questions.filter((question) => question.type == QuestionType.NUMERIC).map((question) => question.question);
            const response = await generateManyAnswersNumeric(numericQuestions);
            const numericAnswers = response.data.questions_and_answers
            const questions_with_answers_numeric = numericQuestions.map((question, index) => ({
                question: question,
                answer: numericAnswers[index] // Assuming numericAnswers has the same length as numericQuestions
            }));

            console.log(questions_with_answers_numeric);
      
        }
    });
}