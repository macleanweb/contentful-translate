import { SidebarAppSDK } from '@contentful/app-sdk';
import { Button } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import { marked } from 'marked';
import TurndownService  from 'turndown';
import { useState, useEffect } from 'react';
import { cfLocalToDeepLMap } from '../lib/helpers';
import { deepLTranslate } from '../services/deepL/deepL';
const turndownService = new TurndownService({headingStyle: 'atx'});

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const apiKey = sdk.parameters.instance.deeplApiKey;
  const [htmlToTranslate, setHtmlToTranslate] = useState('');
  const [localesToTranslate, setLocalesToTranslate] = useState<string[]>([]);
  const availableLocales = sdk.locales.available;

  async function translateEmptyFields(locale: string) {
    console.log('running');
    // early return if no source text
    if (!htmlToTranslate) return;
    const currentValue = await sdk.entry.fields.textMd.getValue(locale);
    // early return if field is not empty
    if (currentValue) return;
    const deepLLocale = cfLocalToDeepLMap[locale];
    const translatedText = await deepLTranslate(htmlToTranslate, deepLLocale, apiKey);
    const markDown = turndownService.turndown(translatedText);
    console.log(markDown);
    sdk.entry.fields.textMd.setValue(markDown, locale);
  }

  function clickHandler() {
    const sourceValue = sdk.entry.fields.textMd.getValue();
    const htmlSourceValue = marked.parse(sourceValue);
    setHtmlToTranslate(htmlSourceValue);
    console.log(htmlSourceValue);
    setLocalesToTranslate(availableLocales);
  };

  useEffect(() => {
    if (localesToTranslate?.length > 0) {
      localesToTranslate.forEach((locale) => {
        translateEmptyFields(locale);
      });
    }
  }, [localesToTranslate, htmlToTranslate]);

  return (
    <Button 
      isFullWidth 
      variant="primary"
      onClick={clickHandler}
    >
      Translate Content
    </Button>
  );
};

export default Sidebar;
