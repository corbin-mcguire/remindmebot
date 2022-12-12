import { v4 as uuidv4 } from "uuid";

export class Reminder {
  constructor(owner, date, message) {
    this.id = uuidv4();
    this.owner = owner;
    this.date = date;
    this.message = message;
  }
}

// TODO: writes a new reminder to a file
export function add(reminder) {}

// TODO: removes a reminder from a file
export function remove(reminderId) {}

// TODO: checks the file for existing reminders
export function checkReminders() {}
