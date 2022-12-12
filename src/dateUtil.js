export function createDate(time, unit) {
  let date = new Date();
  switch (unit) {
    case "minutes":
      date.setMinutes(date.getMinutes() + time);
      break;
    case "hours":
      date.setHours(date.getHours() + time);
      break;
    case "days":
      date.setDate(date.getDay() + time);
      break;
    case "months":
      date.setMonth(date.getMonth() + time);
      break;
    default:
      break;
  }
  return date;
}
