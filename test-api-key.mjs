
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env relative to this file
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

const logFile = path.resolve(__dirname, 'models-list.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

fs.writeFileSync(logFile, ''); // Clear file

if (!apiKey) {
    log('❌ No API Key found.');
    process.exit(1);
}

log(`✅ Found API Key: ${apiKey.substring(0, 5)}...`);

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            log(`❌ API Request Failed: ${response.status} ${response.statusText}`);
            const err = await response.text();
            log(err);
            return;
        }

        const data = await response.json();
        
        if (data.models) {
            log(`\n✨ Found ${data.models.length} Models. Listing Gemini/Flash variants:`);
            data.models.forEach(model => {
                const name = model.name.replace('models/', '');
                if (name.includes('gemini') || name.includes('flash')) {
                    log(`- ${name}`);
                }
            });
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`);
    }
}

listModels();
