function getSection(end) {
  const list = end.split(" ");
  const today_0_0_0 = setDayTime("", "0:0:0");
  const now = new Date();
  let time = 0;
  if (list.length == 1) {
    time = setDayTime(today_0_0_0, list[0]);
  } else {
    time = setDayTime(today_0_0_0, list[1]);
  }
  return +time - +now;
}

function setDayTime(date, time) {
  let [hour, min, sec] = time.split(":").map((e) => parseInt(e));
  let now = date ? new Date(date) : new Date();
  now.setMilliseconds(0);
  now.setSeconds(sec);
  now.setMinutes(min);
  now.setHours(hour);
  return now;
}

module.exports = {
  getSection
}