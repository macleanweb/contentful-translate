const API_URL = 'https://hp-translate.netlify.app/.netlify/functions/translate';

export async function deepLTranslate(text: string, targetLanguage: string, apiKey: string) {
    if (!text || !targetLanguage) {
        throw new Error(
            `Missing required parameters provided text: ${text}, targetLang: ${targetLanguage}
        `);
    }

    const body = JSON.stringify({
        apiKey,
        text,
        targetLanguage,
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
        return data.text;

    } catch (error) {
        console.error(error);
    }
}
