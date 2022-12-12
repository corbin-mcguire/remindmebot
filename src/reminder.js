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

    fs.writeFile(fileUrl, JSON.stringify(remindersJson), (err) => {
      if (err) console.error("Error writing to file", err);
      FILE_LOCKED = false;
    });

    FILE_LOCKED = false;
  } else {
    fs.readFile(fileUrl, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      FILE_LOCKED = true;

      const remindersJson = JSON.parse(data);
      remindersJson.reminders.push(reminder);

      fs.writeFile(fileUrl, JSON.stringify(remindersJson), (err) => {
        if (err) console.error("Error appending file", err);
        FILE_LOCKED = false;
      });

      FILE_LOCKED = false;
    });
  }
}

// TODO: removes a reminder from a file
export function remove(reminderId) {}

// TODO: checks the file for existing reminders
export function checkReminders() {}
