const data = require('./countries');
console.log(Object.keys(data.Countries).length)
const province_code = {}
for (const key in data.Countries) {
    const element = data.Countries[key];
    if(element.province_codes && Object.keys(element.province_codes).length > 0){
        province_code[element.code] = {}
        for (const i in element.province_codes) {
            const e = element.province_codes[i];
            province_code[element.code][e] = i
        }
    }
}
console.log(province_code, Object.keys(province_code))
console.log(JSON.stringify(province_code))