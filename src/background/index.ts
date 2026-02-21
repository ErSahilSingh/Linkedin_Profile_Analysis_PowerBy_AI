import { analyzeProfile } from '../utils/gemini';
import { getStorage } from '../utils/storage';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'ANALYZE_PROFILE') {
    (async () => {
      try {
        const apiKey = await getStorage('gemini_api_key');
        if (!apiKey) {
          throw new Error('API Key not found. Please set it in settings.');
        }

        const result = await analyzeProfile(apiKey, request.data);
        sendResponse({ success: true, data: result });
      } catch (error: any) {
        console.error('Analysis error:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Keep message channel open for async response
  }
});
