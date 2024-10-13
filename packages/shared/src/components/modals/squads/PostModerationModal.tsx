import React, { MouseEventHandler, ReactElement } from 'react';
import { Modal, ModalProps } from '../common/Modal';
import {
  Typography,
  TypographyTag,
  TypographyType,
} from '../../typography/Typography';
import { SourcePostModeration } from '../../../graphql/squads';
import PostSourceInfo from '../../post/PostSourceInfo';
import SquadPostAuthor from '../../post/SquadPostAuthor';
import { CommonSharePostContent } from '../../post/SharePostContent';
import { Squad } from '../../../graphql/sources';
import { Origin } from '../../../lib/log';
import { useReadArticle } from '../../../hooks/usePostContent';
import { SharePostTitle } from '../../post/share';
import Markdown from '../../Markdown';
import { MarkdownPostImage } from '../../post/MarkdownPostContent';
import { usePostModerationState } from '../../../hooks/squads/usePostModerationState';
import { SquadModerationActions } from '../../squads/moderation/SquadModerationActions';
import { SquadPostRejectedMessage } from '../../squads/moderation/SquadPostRejectedMessage';

type ActionHandler = (id: string, onSuccess?: MouseEventHandler) => void;

interface PostModerationModalProps extends ModalProps {
  onApprove: ActionHandler;
  onReject: ActionHandler;
  data: SourcePostModeration;
  squad: Squad;
}

function PostModerationModal({
  onApprove,
  onReject,
  data,
  squad,
  ...modalProps
}: PostModerationModalProps): ReactElement {
  const {
    id,
    post: editPost,
    createdAt,
    createdBy,
    image,
    title,
    titleHtml,
    content,
    contentHtml,
    sharedPost,
    status,
    reason,
  } = data;
  const onReadArticle = useReadArticle({
    origin: Origin.ArticleModal,
    post: sharedPost,
  });
  const { shouldShowActions, shouldShowRejectedMessage } =
    usePostModerationState({ status, member: squad?.currentMember });

  const closeWrapper = (callback: ActionHandler): MouseEventHandler => {
    return () => callback(id, modalProps.onRequestClose);
  };

  return (
    <Modal
      {...modalProps}
      size={Modal.Size.XLarge}
      kind={Modal.Kind.FlexibleTop}
    >
      <Modal.Body className="gap-6">
        {shouldShowActions && (
          <SquadModerationActions
            onApprove={closeWrapper(() => onApprove(id))}
            onReject={closeWrapper(() => onReject(id))}
          />
        )}
        <Typography type={TypographyType.Title3} tag={TypographyTag.H3} bold>
          Post preview
        </Typography>
        {shouldShowRejectedMessage && (
          <SquadPostRejectedMessage squad={squad.name} reason={reason} />
        )}
        <PostSourceInfo source={squad} />
        <SquadPostAuthor author={createdBy} date={createdAt} />
        <SharePostTitle
          title={title || editPost?.title}
          titleHtml={titleHtml || editPost?.titleHtml}
        />
        <MarkdownPostImage imgSrc={image || editPost?.image} />
        {contentHtml ? (
          <Markdown content={contentHtml} />
        ) : (
          <Typography type={TypographyType.Body}>{content}</Typography>
        )}
        {sharedPost && (
          <CommonSharePostContent
            mainSource={squad}
            sharedPost={sharedPost}
            onReadArticle={onReadArticle}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PostModerationModal;
