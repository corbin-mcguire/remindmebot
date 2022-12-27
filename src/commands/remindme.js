import fs from "fs";
import { client } from "../main.js";
import { Reminder } from "../models/Reminder.js";
import { Command } from "../models/Command.js";
import { createDate } from "../dateUtil.js";
import { SlashCommandBuilder } from "discord.js";

export let FILE_LOCKED = false;

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

  await interaction.reply(`I'll remind you at ${date.toString()} to ${message.value}`);
};

export const remindme = new Command("remindme", command, commandHandler);

export function add(reminder) {
  if (FILE_LOCKED) return;

  const directoryUrl = new URL("../data", import.meta.url);
  const fileUrl = new URL(`../data/reminders.json`, import.meta.url);

  if (!fs.existsSync(directoryUrl)) {
    FILE_LOCKED = true;
    fs.mkdirSync(directoryUrl);

    const remindersJson = {
      reminders: [reminder],
    };

    writeReminderFile(fileUrl, remindersJson);
  } else {
    fs.readFile(fileUrl, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      FILE_LOCKED = true;

      const remindersJson = JSON.parse(data);
      remindersJson.reminders.push(reminder);

      writeReminderFile(fileUrl, remindersJson);
    });
  }
}

export function remove(reminderId) {
  const directoryUrl = new URL("../data", import.meta.url);
  const fileUrl = new URL(`../data/reminders.json`, import.meta.url);

  if (FILE_LOCKED || !fs.existsSync(directoryUrl)) return;

  fs.readFile(fileUrl, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const remindersJson = JSON.parse(data);
    const reminderIndex = remindersJson.reminders.findIndex((reminder) => reminder.id === reminderId);

    console.log(new Date(), "Removing entry", reminderId);
    remindersJson.reminders.splice(reminderIndex, 1);

    writeReminderFile(fileUrl, remindersJson);
    console.log(new Date(), "Entry removed", reminderId);
  });
}

export function checkReminders() {
  const fileUrl = new URL(`../data/reminders.json`, import.meta.url);

  if (!fs.existsSync(fileUrl)) return;

  return fs.readFile(fileUrl, (err, data) => {
    if (err) console.error(err);
    const reminders = JSON.parse(data)?.reminders;

    reminders.forEach((reminder) => {
      const now = new Date();
      const reminderDate = new Date(reminder.date);

      if (reminderDate <= now) {
        sendReminder(reminder, "reminders");
        setTimeout(() => {
          remove(reminder.id);
        }, 500);
      }
    });
  });
}

export function sendReminder(reminder) {
  const channel = client.channels.cache.get("1052026975755173938");
  channel.send(`<@${reminder.owner}> ${reminder.message}`);
}

function writeReminderFile(fileUrl, reminders) {
  FILE_LOCKED = true;
  fs.writeFile(fileUrl, JSON.stringify(reminders), (err) => {
    if (err) console.error("Error appending file", err);
    FILE_LOCKED = false;
  });
  FILE_LOCKED = false;
}
