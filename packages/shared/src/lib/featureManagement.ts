import { JSONValue } from '@growthbook/growthbook';
import {
  ExperienceLevelExperiment,
  ReadingStreaksExperiment,
  TagSourceSocialProof,
} from './featureValues';

export class Feature<T extends JSONValue> {
  readonly id: string;

  readonly defaultValue?: T;

  constructor(id: string, defaultValue?: T) {
    this.id = id;
    this.defaultValue = defaultValue;
  }
}

const feature = {
  feedVersion: new Feature('feed_version', 15),
  lowImps: new Feature('feed_low_imps'),
  bookmarkOnCard: new Feature('bookmark_on_card', false),
  readingStreaks: new Feature(
    'reading_streaks',
    ReadingStreaksExperiment.Control,
  ),
  forceRefresh: new Feature('force_refresh', false),
  feedAdSpot: new Feature('feed_ad_spot', 0),
  searchVersion: new Feature('search_version', 1),
  forcedTagSelection: new Feature('forced_tag_selection', false),
  readingReminder: new Feature('reading_reminder', false),
  onboardingMostVisited: new Feature('onboarding_most_visited', false),
  shareExperience: new Feature('share_experience', false),
  bookmarkLoops: new Feature('bookmark_loops', false),
  sidebarClosed: new Feature('sidebar_closed', false),
  tagSourceSocialProof: new Feature(
    'tag_source_social_proof',
    TagSourceSocialProof.Control,
  ),
  experienceLevel: new Feature(
    'experience_level',
    ExperienceLevelExperiment.Control,
  ),
};

export { feature };
