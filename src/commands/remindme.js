import { Reminder } from "../models/Reminder.js";
import { Command } from "../models/Command.js";
import { createDate } from "../dateUtil.js";
import { SlashCommandBuilder } from "discord.js";
import { add } from "../reminderUtil.js";

const command = new SlashCommandBuilder()
  .setName("remindme")
  .setDescription("Reminds you after a specified amount of time!")
  .addNumberOption((option) => option.setName("time").setDescription("The time value").setMinValue(1).setRequired(true))
  .addStringOption((option) =>
    option
      .setName("unit")
      .setDescription("The unit of time")
      .setRequired(true)
      .addChoices(
        { name: "minutes", value: "minutes" },
        { name: "hours", value: "hours" },
        { name: "days", value: "days" },
        { name: "months", value: "months" }
      )
  )
  .addStringOption((option) =>
    option.setName("message").setDescription("The message you'd like to remind yourself of").setRequired(true)
  );

const commandHandler = async (interaction) => {
  const time = interaction.options.get("time");
  const unit = interaction.options.get("unit");
  const message = interaction.options.get("message");
  const date = createDate(time.value, unit.value);
  const reminder = new Reminder(interaction.user.id, date, message.value);

  add(reminder);

  await interaction.reply({ content: `I'll remind you at ${date.toString()} to ${message.value}`, ephemeral: true });
};

export const remindme = new Command("remindme", command, commandHandler);
