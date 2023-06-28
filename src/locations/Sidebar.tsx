import { SidebarAppSDK } from '@contentful/app-sdk';
import { Button } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import { marked } from 'marked';
import { useState, useEffect } from 'react';
import { cfLocalToDeepLMap } from '../lib/helpers';
import { deepLTranslate } from '../services/deepL/deepL';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const [htmlToTranslate, setHtmlToTranslate] = useState('');
  const [localesToTranslate, setLocalesToTranslate] = useState<string[]>([]);
  const availableLocales = sdk.locales.available;

  deepLTranslate('helloWorld', 'NL');

  async function translateEmptyFields(locale: string) {
    // early return if no source text
    if (!htmlToTranslate) return;
    const currentValue = await sdk.entry.fields.textMd.getValue(locale);
    // early return if field is not empty
    if (currentValue) return;
    const deepLLocale = cfLocalToDeepLMap[locale];
    const translatedText = await deepLTranslate(htmlToTranslate, deepLLocale);
    sdk.entry.fields.textMd.setValue(translatedText, locale);
  }

  function clickHandler() {
    const sourceValue = sdk.entry.fields.textMd.getValue();
    const htmlSourceValue = marked.parse(sourceValue);
    setHtmlToTranslate(htmlSourceValue);
    setLocalesToTranslate(availableLocales);
  };

  useEffect(() => {
    if (localesToTranslate?.length > 0) {
      localesToTranslate.forEach((locale) => {
        translateEmptyFields(locale);
      });
    }
  }, [localesToTranslate, htmlToTranslate]);
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

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
