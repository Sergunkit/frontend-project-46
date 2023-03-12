import yaml from 'js-yaml'
import fs from 'fs';
import path from 'path';


export default (filepath) => { // получает путь к файлу выдает содержимое в виде Map
    // if (typeof filepath === 'object') return (filepath);
    // если getMap вызывается в рекурсии возвращаем Map

    const fullPath = path.resolve(filepath); // получаем (проверяем) полный путь к файлу
    if (['.yml', '.yaml'].includes(path.extname(fullPath))) { 
        try { // yaml
            return yaml.load(fs.readFileSync(fullPath, "utf8"));
            // return (new Map(Object.entries(data))); // делаем из него карту, возвращаем
        } catch (err) {
            console.error(err);
        };
    } else {
        try { // json
            // console.log(JSON.parse(fs.readFileSync(fullPath, "utf8"))); // получаем строку, делаем объект
            // console.log(fs.readFileSync(fullPath, "utf8")); // получаем строку, делаем объект
            return JSON.parse(fs.readFileSync(fullPath, "utf8")); // получаем строку, делаем объект
            // return (new Map(Object.entries(data))); // делаем из него карту, возвращаем
        } catch (err) {
            console.error(err);
        };
    };
};

