import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export default (filepath) => { // получает путь к файлу выдает содержимое в виде Map
    const fullPath = path.resolve(filepath); // получаем (проверяем) полный путь к файлу
    if (['.yml', '.yaml'].includes(path.extname(fullPath))) { 
        try { // yaml
            return yaml.load(fs.readFileSync(fullPath, "utf8"));
        } catch (err) {
            console.error(err);
        };
    } else  if (path.extname(fullPath) === '.json') {
        try { // json
            return JSON.parse(fs.readFileSync(fullPath, "utf8")); // получаем строку, делаем объект
        } catch (err) {
            console.error(err);
        };
    } else {
        try { // txt
            return fs.readFileSync(fullPath, "utf8");
        } catch (err) {
            console.error(err);
        };
    };
};
