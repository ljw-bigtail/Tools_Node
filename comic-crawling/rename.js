const fs = require('fs');
const dir = 'end/after_the_one/img'

fs.readdir(dir, (err, files) => {
  if (err) {
      throw err;
  }
  // files object contains all files names
  // log them on console
  files.forEach(file => {
    console.log(file.toString());
    let _a = file.toString().split('_')[0]

    let a = (parseInt(_a) - 1).toString().padStart(4, '0')
    const regexp = new RegExp(_a)
    let newName = file.replace(regexp, a)
    fs.rename(`${dir}/${file}`, `${dir}/${newName}`, (err) => {
      if(!err) {
        console.log(newName + ' 已重命名！')
      }
    })
  });
})