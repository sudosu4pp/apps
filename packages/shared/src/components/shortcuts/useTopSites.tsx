import { TopSites } from 'webextension-polyfill';
import { useEffect, useMemo, useState } from 'react';
import { checkIsExtension } from '../../lib/func';

type TopSite = TopSites.MostVisitedURL;
export type UseTopSitesRet = {
  topSites: TopSite[] | undefined;
  hasCheckedPermission: boolean;
  revokePermission: () => Promise<unknown>;
  askTopSitesPermission: () => Promise<boolean>;
};

const TOP_SITES = [
  {
    url: 'https://www.google.com/',
    title: 'Google',
    favicon: 'https://www.google.com/favicon.ico',
  },
  {
    url: 'https://www.youtube.com/',
    title: 'YouTube',
    favicon: 'https://www.youtube.com/favicon.ico',
  },
  {
    url: 'https://www.facebook.com/',
    title: 'Facebook',
    favicon: 'https://www.facebook.com/favicon.ico',
  },
  {
    url: 'https://www.amazon.com/',
    title: 'Amazon',
    favicon: 'https://www.amazon.com/favicon.ico',
  },
  {
    url: 'https://www.reddit.com/',
    title: 'Reddit',
    favicon: 'https://www.reddit.com/favicon.ico',
  },
  {
    url: 'https://www.wikipedia.org/',
    title: 'Wikipedia',
    favicon: 'https://www.wikipedia.org/favicon.ico',
  },
  {
    url: 'https://www.yahoo.com/',
    title: 'Yahoo',
    favicon: 'https://www.yahoo.com/favicon.ico',
  },
  {
    url: 'https://www.twitter.com/',
    title: 'Twitter',
    favicon: 'https://www.twitter.com/favicon.ico',
  },
];

export default function useTopSites(): UseTopSitesRet {
  const [topSites, setTopSites] = useState<TopSite[] | undefined>([]);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);
  const isExtension = checkIsExtension();

  // @NOTE see https://dailydotdev.atlassian.net/l/cp/dK9h1zoM
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const revokePermission = async () => {
    if (isExtension) {
      const browser = await import('webextension-polyfill').then(
        (mod) => mod.default,
      );
      await browser.permissions.remove({
        permissions: ['topSites'],
      });
    }

    setTopSites(undefined);
  };

  const getTopSites = async (): Promise<void> => {
    if (isExtension) {
      const browser = await import('webextension-polyfill').then(
        (mod) => mod.default,
      );

      try {
        const topSitesBrowser = (await browser.topSites.get()).slice(0, 8);
        setTopSites(topSitesBrowser);
      } catch (err) {
        setTopSites(undefined);
      }
    } else {
      setTopSites(TOP_SITES);
    }
    setHasCheckedPermission(true);
  };

  // @NOTE see https://dailydotdev.atlassian.net/l/cp/dK9h1zoM
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const askTopSitesPermission = async (): Promise<boolean> => {
    if (isExtension) {
      const browser = await import('webextension-polyfill').then(
        (mod) => mod.default,
      );

      const granted = await browser.permissions.request({
        permissions: ['topSites'],
      });
      if (granted) {
        await getTopSites();
      }
      return granted;
    }

    getTopSites();
    return true;
  };

  useEffect(() => {
    getTopSites();
  }, []);

  return useMemo(
    () => ({
      topSites,
      hasCheckedPermission,
      revokePermission,
      askTopSitesPermission,
    }),
    [topSites, hasCheckedPermission, revokePermission, askTopSitesPermission],
  );
}
