import 'dotenv/config';
import { Client, ThreadAutoArchiveDuration } from 'discord.js';
import fetchDailyProblem from './dailyQuery';

const client = new Client({
  intents: ['Guilds'],
});

// On startup, send the daily problem to the channel
client.on('ready', (c) => {
  console.log(`${c.user.username} is online.`);

  client.guilds.cache.forEach(async (g) => {
    // Find if the ping role exists
    const role = g.roles.cache.find((r) => r.name == 'LeetCode Daily');
    if (!role) {
      console.log("Please make a role named 'LeetCode Daily'");
      return;
    }

    // Find if the channel exists
    const channel = g.channels.cache.find((ch) => ch.name == 'coding-challenges');
    if (!channel || !channel.isTextBased()) {
      console.log("Please make a channel named 'coding-challenges'");
      return;
    }

    // Fetch problem, send to channel and create thread
    if (channel && channel.isTextBased()) {
      const daily = await fetchDailyProblem();
      const question = daily.questionFrontendId + '. ' + daily.title;
      const difficulty =
        daily.difficulty === 'Easy' ? '🟩' : daily.difficulty === 'Medium' ? '🟨' : '🟥';

      // Send the problem to the channel
      const message = await channel.send(
        `${difficulty} **[DAILY]** [${question}](<${daily.link}>)`
      );

      // Create thread
      const thread = await message.startThread({
        name: `${difficulty} [DAILY] ${question}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      });
      thread.send(`<@&${role?.id}>`);
    }
  });
});

client.login(process.env.TOKEN);
