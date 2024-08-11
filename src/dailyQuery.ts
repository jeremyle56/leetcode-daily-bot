import { DailyProblemData } from './types';

// GraphQL query to fetch the daily problem from Leetcode's API
const QUERY = `#graphql
  query getDailyProblem {
    activeDailyCodingChallengeQuestion {
      link
      question {
        questionFrontendId
        title
        difficulty
      }
    }
  }
`;

/**
 * Format the daily problem data to be displayed in the discord thread
 * @param data - The daily problem data
 * @returns The formatted daily problem data
 */
const formatDailyProblem = (data: DailyProblemData) => {
  const { activeDailyCodingChallengeQuestion } = data;
  let { link, question } = activeDailyCodingChallengeQuestion;
  const { questionFrontendId, title, difficulty } = question;

  // Construct the link to the problem
  link = 'https://leetcode.com' + link;

  return { link, questionFrontendId, title, difficulty };
};

/**
 * Fetch the daily problem from leetcode's API
 * @returns The daily problem data
 */
const fetchDailyProblem = async () => {
  try {
    // Fetch the daily problem from LeetCode's API
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com/',
      },
      body: JSON.stringify({ query: QUERY }),
    });

    const result = await response.json();
    if (result.errors) {
      return result.errors;
    }

    return await formatDailyProblem(result.data);
  } catch (err) {
    console.error('Error: ', err);
    return err;
  }
};

export default fetchDailyProblem;
