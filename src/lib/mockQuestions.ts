export type MockQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export const mockQuestions: MockQuestion[] = [
  {
    id: 1,
    question: "Which number completes the pattern: 2, 4, 8, 16, __ ?",
    options: ["18", "24", "32", "34"],
    correctAnswer: "32",
  },
  {
    id: 2,
    question: "If a rectangle has length 8 and width 3, what is its area?",
    options: ["11", "24", "16", "32"],
    correctAnswer: "24",
  },
  {
    id: 3,
    question: "Which fraction is equal to 0.5?",
    options: ["1/4", "2/3", "1/2", "3/4"],
    correctAnswer: "1/2",
  },
  {
    id: 4,
    question: "Find the next number: 5, 10, 15, 20, __",
    options: ["22", "24", "25", "30"],
    correctAnswer: "25",
  },
  {
    id: 5,
    question: "Which is the smallest prime number?",
    options: ["1", "2", "3", "5"],
    correctAnswer: "2",
  },
];
