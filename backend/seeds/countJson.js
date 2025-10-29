import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonPath = join(__dirname, 'tacoComplete.json');
const jsonData = fs.readFileSync(jsonPath, 'utf-8');
const foods = JSON.parse(jsonData);

console.log('Total de alimentos no tacoComplete.json:', foods.length);
