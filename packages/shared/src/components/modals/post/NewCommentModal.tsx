import React, { ReactElement } from 'react';
import { Modal } from '../common/Modal';
import { DayStreak, Streak } from '../../streak/popup';
import { IconSize } from '../../Icon';
import { Button, ButtonVariant } from '../../buttons/Button';
import { ModalClose } from '../common/ModalClose';
import { StreakModalProps } from '../../post/common';
import { LazyModalCommonProps } from '../common/Modal';
import { FormWrapper } from '../../fields/form';
import {
  CommentMarkdownInput,
  CommentMarkdownInputProps,
} from '../../fields/MarkdownInput/CommentMarkdownInput';
import { Post } from '../../../graphql/posts';

export interface NewCommentModalProps extends LazyModalCommonProps {
  comment?: string;
  post: Post;
  isReply?: boolean;
  onCommented?: CommentMarkdownInputProps['onCommented'];
}

export default function NewcommentModal({
  onRequestClose,
  comment,
  post,
  onCommented,
  isReply = false,
  ...props
}: NewCommentModalProps): ReactElement {
  const onSuccess: typeof onCommented = (comment, isNew) => {
    onCommented(comment, isNew);
    onRequestClose();
  };

  return (
    <Modal {...props} onRequestClose={onRequestClose}>
      <ModalClose className="right-2 top-2" onClick={onRequestClose} />
      <Modal.Body>
        <FormWrapper
          form="new comment"
          copy={{ right: isReply ? 'Reply' : 'Comment' }}
          onLeftClick={onRequestClose}
        >
          <CommentMarkdownInput
            {...props}
            post={post}
            onCommented={onSuccess}
            initialContent={comment}
          />
        </FormWrapper>
        <div>NEw comment</div>
      </Modal.Body>
    </Modal>
  );
}
