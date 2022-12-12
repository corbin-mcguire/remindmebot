import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export let FILE_LOCKED = false;

export class Reminder {
  constructor(owner, date, message) {
    this.id = uuidv4();
    this.owner = owner;
    this.date = date;
    this.message = message;
  }
}

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

    remindersJson.reminders.splice(reminderIndex, 1);

    writeReminderFile(fileUrl, remindersJson);
  });
}

// TODO: checks the file for existing reminders
export function checkReminders() {}

function writeReminderFile(fileUrl, reminders) {
  FILE_LOCKED = true;
  fs.writeFile(fileUrl, JSON.stringify(reminders), (err) => {
    if (err) console.error("Error appending file", err);
    FILE_LOCKED = false;
  });
  FILE_LOCKED = false;
}
