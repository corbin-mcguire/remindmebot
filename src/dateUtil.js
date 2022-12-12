export function createDate(time, unit) {
  let date = new Date();
  switch (unit) {
    case "seconds":
      date.setSeconds(date.getSeconds() + time);
      break;
    case "minutes":
      date.setMinutes(date.getMinutes() + time);
      break;
    case "hours":
      date.setHours(date.getHours() + time);
      break;
    case "days":
      date.setDate(date.getDay() + time);
      break;
    default:
      break;
  }
  return date;
}
