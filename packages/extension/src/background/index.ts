import { browser, Runtime } from 'webextension-polyfill-ts';
import { getBootData } from '@dailydotdev/shared/src/lib/boot';

const cacheAmplitudeDeviceId = async ({
  reason,
}: Runtime.OnInstalledDetailsType): Promise<void> => {
  if (reason === 'install') {
    const boot = await getBootData('extension');
    if (boot.visit.ampStorage) {
      localStorage.setItem(
        `amp_${process.env.NEXT_PUBLIC_AMPLITUDE.slice(0, 6)}`,
        boot.visit.ampStorage,
      );
    }
  }
};

browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  tabs.forEach((tab) => {
    console.log(tab);
    browser.runtime.onMessage.addListener(async (request, sender) => {
      console.log(request);
      const boot = await getBootData('extension');
      await browser.tabs.sendMessage(tab.id, {
        boot,
      });
      return true;
    });
  });
});

browser.browserAction.onClicked.addListener(() => {
  const url = browser.extension.getURL('index.html?source=button');
  browser.tabs.create({ url, active: true });
});

browser.runtime.onInstalled.addListener(async (details) => {
  await Promise.all([
    cacheAmplitudeDeviceId(details),
    browser.runtime.setUninstallURL('https://daily.dev/uninstall'),
  ]);
});
