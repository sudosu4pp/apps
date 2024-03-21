import type Router from 'next/router';
import { useFeature } from '../../components/GrowthBookProvider';
import { feature } from '../../lib/featureManagement';
import { OnboardingCopy, UserAcquisition } from '../../lib/featureValues';
import { useOnboardingAnimation } from './useOnboardingAnimation';

export const useOnboardingRedirect = (): any => {
  const { postOnboardingRedirect } = useOnboardingAnimation();
  const onboardingOptimizations = useFeature(feature.onboardingOptimizations);
  const isOnboardingCopyV1 =
    useFeature(feature.onboardingCopy) === OnboardingCopy.V1;
  const userAcquisitionVersion = useFeature(feature.userAcquisition);

  return postOnboardingRedirect({
    pathname: '/',
    query: {
      ...(userAcquisitionVersion === UserAcquisition.V1 && {
        ua: 'true',
      }),
      ...(!onboardingOptimizations && {
        welcome: 'true',
        hset: 'true',
      }),
    },
  });
};
