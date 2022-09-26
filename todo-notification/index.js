const Notification = require("./tools/notification");
const { getSection } = require("./tools/date")

function runTodo(option) {
  const { todo, end } = option;
  const delta = getSection(end);
  if (delta <= 0) return;
  setTimeout(function () {
    Notification.run({
      title: todo,
      message: "设定的时间已经到了。",
      ok: function () {
        console.log("确认");
      },
      cancel: function () {
        console.log("取消");
      },
    });
  }, delta);
}

function runTodos(options){
  options.forEach(option => {
    runTodo(option)
  });
}

// 倒计时
const queue = [
  {
    todo: "该喝药了！",
    end: "16:08:00",
  },
  {
    todo: "aaaaa",
    end: "16:08:40",
  }
];

runTodos(queue);
