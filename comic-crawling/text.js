const fs = require("fs");
const file = "./end/after_the_one/cache.json";

(async function () {
  const val = await fs.readFileSync(file);

  const json = JSON.parse(val);

  const len = json.list.length;

  json.list = json.list.map((e, i) => {
    e.imgs && (e.imgs = e.imgs.map((_e, j) => {
      // img/
      let _a = _e.file.toString().split("/")[1].split("_")[0];
      let a = (len - i).toString().padStart(4, "0");
      const regexp = new RegExp(_a);
      return {
        src: _e.src,
        file: _e.file.replace(regexp, a)
      };
    }))
    return e
  });
  await fs.writeFileSync(file, JSON.stringify(json));
})();
