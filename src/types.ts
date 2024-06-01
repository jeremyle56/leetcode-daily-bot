export interface DailyProblemData {
  activeDailyCodingChallengeQuestion: {
    link: string;
    question: {
      questionFrontendId: string;
      title: string;
      difficulty: string;
    };
  };
}
