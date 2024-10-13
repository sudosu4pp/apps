import React, { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import {
  Typography,
  TypographyTag,
  TypographyType,
} from '../../typography/Typography';
import { CardImage } from '../../cards/common/Card';
import PostTags from '../../cards/common/PostTags';
import {
  SourcePostModeration,
  SourcePostModerationStatus,
} from '../../../graphql/squads';
import { ProfileImageSize, ProfilePicture } from '../../ProfilePicture';
import PostMetadata from '../../cards/common/PostMetadata';
import { SourceMemberRole, Squad } from '../../../graphql/sources';
import { Button, ButtonSize, ButtonVariant } from '../../buttons/Button';
import { capitalize } from '../../../lib/strings';
import OptionsButton from '../../buttons/OptionsButton';
import { TimerIcon, WarningIcon } from '../../icons';
import { useLazyModal } from '../../../hooks/useLazyModal';
import { LazyModal } from '../../modals/common/types';
import { usePostModerationState } from '../../../hooks/squads/usePostModerationState';
import { SquadModerationActions } from './SquadModerationActions';
import { SquadPostRejectedMessage } from './SquadPostRejectedMessage';

interface SquadModerationListProps {
  data: SourcePostModeration;
  onApprove: (id: string) => void;
  onReject: (id: string, onSuccess?: MouseEventHandler) => void;
  isLoading: boolean;
  squad: Squad;
}

export function SquadModerationItem({
  data,
  squad,
  onReject,
  onApprove,
  isLoading,
}: SquadModerationListProps): ReactElement {
  const { openModal } = useLazyModal();
  const {
    id,
    post,
    status,
    reason,
    createdBy,
    createdAt,
    title,
    image,
    sharedPost,
  } = data;
  const { shouldShowActions, shouldShowRejectedMessage } =
    usePostModerationState({ status, member: squad?.currentMember });

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    openModal({
      type: LazyModal.PostModeration,
      props: { data, squad, onApprove, onReject },
    });
  };

  const icon =
    status === SourcePostModerationStatus.Rejected ? (
      <WarningIcon />
    ) : (
      <TimerIcon />
    );

  return (
    <div className="relative flex flex-col gap-4 p-6 hover:bg-surface-hover">
      <button
        type="button"
        onClick={onClick}
        aria-label="Open the request"
        className="absolute inset-0"
      />
      <div className="flex flex-row gap-4">
        <ProfilePicture user={createdBy} size={ProfileImageSize.Large} />
        <div className="flex flex-col gap-1">
          <Typography bold type={TypographyType.Footnote}>
            {createdBy.name}
          </Typography>
          <PostMetadata readTime={post?.readTime} createdAt={createdAt} />
        </div>
        {squad?.currentMember.role === SourceMemberRole.Member && (
          <span className="ml-auto flex flex-row gap-2">
            <Button
              icon={icon}
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              disabled
            >
              {capitalize(status)}
            </Button>
            <OptionsButton className="z-1 !my-0" tooltipPlacement="right" />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4 tablet:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <Typography tag={TypographyTag.H2} type={TypographyType.Title3} bold>
            {title}
          </Typography>
          <PostTags className="!mx-0" tags={sharedPost?.tags || post?.tags} />
        </div>
        <CardImage src={image || sharedPost?.image || post?.image} />
      </div>
      {shouldShowActions && (
        <SquadModerationActions
          onApprove={() => onApprove(id)}
          onReject={() => onReject(id)}
          isLoading={isLoading}
        />
      )}
      {shouldShowRejectedMessage && (
        <SquadPostRejectedMessage squad={squad.name} reason={reason} />
      )}
    </div>
  );
}
