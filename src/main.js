import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commandList } from "./commands/commands.js";
import { handleInteractionCreate } from "./interactions.js";
import { checkReminders } from "./reminderUtil.js";

config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.TOKEN);

async function main() {
  try {
    console.log(new Date(), "Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandList });

    console.log(new Date(), "Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

main();

setInterval(() => {
  console.log(new Date(), "Checking for reminders");
  checkReminders();
}, 1000 * process.env.REMINDER_CHECK_INTERVAL_SECONDS);

client.on("ready", () => {
  console.log(new Date(), `Logged in as ${client.user.tag}!`);
  checkReminders();
});

client.on("interactionCreate", async (interaction) => {
  console.log(new Date(), `${interaction.user.tag} used /${interaction.commandName}`);

  handleInteractionCreate(interaction);
});
