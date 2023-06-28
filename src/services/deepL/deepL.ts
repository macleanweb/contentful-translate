import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
const API_URL = 'https://hp-translate.netlify.app/.netlify/functions/translate';

export async function deepLTranslate(text: string, targetLang: string) {
    const sdk = useSDK<SidebarAppSDK>();
    // todo: move to installation parameters
    const API_KEY = sdk.parameters.instance.deeplApiKey;
    console.log(sdk);
    console.log(API_KEY);
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
