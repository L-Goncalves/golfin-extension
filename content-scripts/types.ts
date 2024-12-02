interface JobData {
    jobId: string;
    jobUrl: string;
    timestamp: string;
    lastSeen: string;
}

export const QuestionType = {
    NUMERIC: "numeric",
    TEXT: "text",
    UNKNOWN: "unknown",
    MULTIPLE_CHOICE: "multiple-choiche"
  }
  
  export const TypeMap = {
    "numeric-error": QuestionType.NUMERIC,
    "multipleChoice-error": QuestionType.MULTIPLE_CHOICE
  }
  
  export interface LinkedInQuestion {
    inputAnswerField: HTMLInputElement
    question: any
    label: HTMLLabelElement
    type: string
  }
  
  export interface LinkedInQuestionDrop {
    inputAnswerField: NodeListOf<Element>
    question: any
    label: HTMLLabelElement
    type: string
  }
  
  