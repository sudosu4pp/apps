import { NextSeo, NextSeoProps } from 'next-seo';
import React, { ReactElement } from 'react';
import {
  getMainFeedLayout,
  mainFeedLayoutProps,
} from '../components/layouts/MainFeedPage';
import { defaultOpenGraph, defaultSeo } from '../next-seo';

const seo: NextSeoProps = {
  title: 'Following',
  openGraph: { ...defaultOpenGraph },
  ...defaultSeo,
};

const FollowingFeed = (): ReactElement => <NextSeo {...seo} />;

FollowingFeed.getLayout = getMainFeedLayout;
FollowingFeed.layoutProps = mainFeedLayoutProps;

export default FollowingFeed;
