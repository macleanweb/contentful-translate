const API_URL = 'https://hp-translate.netlify.app/.netlify/functions/translate';
const API_KEY = process.env.DEEPL_API_KEY;

export async function deepLTranslate(text: string, targetLang: string) {
    console.log('deeplTranslate', text, targetLang);
    if (!text || !targetLang) {
        throw new Error(
            `Missing required parameters provided text: ${text}, targetLang: ${targetLang}
        `);
    }

    const body = JSON.stringify({
        apiKey: API_KEY,
        text: 'hello, world!',
        targetLanguage: 'NL',
        option: {
            tag_handling: 'html',
        },
    });

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body,
    }

    try {
        const response = await fetch(API_URL, options);
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error(error);
    }
}
