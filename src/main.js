import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
import { createDate } from "./dateUtil.js";
import { add, checkReminders, Reminder } from "./reminder.js";

config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Reminds you after a specified amount of time!")
    .addNumberOption((option) =>
      option.setName("time").setDescription("The time value").setMinValue(1).setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("unit")
        .setDescription("The unit of time")
        .setRequired(true)
        .addChoices(
          { name: "seconds", value: "seconds" },
          { name: "minutes", value: "minutes" },
          { name: "hours", value: "hours" },
          { name: "days", value: "days" }
        )
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("The message you'd like to remind yourself of").setRequired(true)
    ),
];

async function main() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

main();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  checkReminders();
});

client.on("interactionCreate", async (interaction) => {
  console.log(interaction.user.tag, " used /", interaction.commandName);

  if (!interaction.isCommand()) return;

  if (interaction.commandName === "remindme") {
    const time = interaction.options.get("time");
    const unit = interaction.options.get("unit");
    const message = interaction.options.get("message");
    const date = createDate(time.value, unit.value);
    const reminder = new Reminder(interaction.user.tag, date, message.value);

    add(reminder);

    await interaction.reply(`I'll remind you at ${date.toString()} to ${message.value}`);
  }
});
