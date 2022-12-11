const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("!remindme".toLowerCase())) {
    console.log(message.content);

    message.reply("I'll remind you!");
  }
  if (message.content.startsWith("!help")) {
    message.reply('`!remindme 30(s|m|h) "something to remind you about"`');
  }
});

client.login("MTA1MTU0Nzg2NTI3NDY1NDc5MQ.GED-ns.FVcoXhsDTU12JO0Jx5F8KdKLCNuuJKbFA5owUw");
