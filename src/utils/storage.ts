export const getStorage = async (key: string): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result: { [list: string]: any }) => {
      resolve(result[key]);
    });
  });
};

export const setStorage = async (key: string, value: any): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};
