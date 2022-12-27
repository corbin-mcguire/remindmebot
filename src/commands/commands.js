import { remindme } from "./remindme.js";

export const commands = {
  [remindme.name]: remindme,
};

export const commandList = Object.values(commands).map((command) => command.getCommand());
