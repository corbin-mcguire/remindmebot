import { v4 as uuidv4 } from "uuid";

export class Reminder {
  constructor(owner, date, message) {
    this.id = uuidv4();
    this.owner = owner;
    this.date = date;
    this.message = message;
  }
}
