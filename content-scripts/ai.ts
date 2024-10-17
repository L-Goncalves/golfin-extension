import axios from "axios";
import type { LinkedInQuestion } from "./types"

const API_URL = process.env.API_URL || 'http://localhost:3000'

export async function generateResponse(question: LinkedInQuestion) {
  const response = await axios.post(API_URL+'/question/generate-answer', { question: question.question });

  return response;
}


export async function generateManyAnswersNumeric(numericQuestions: string[]){
  const response = await axios.post(API_URL+'/question/generate-answers', { questions: numericQuestions });

  return response;
}