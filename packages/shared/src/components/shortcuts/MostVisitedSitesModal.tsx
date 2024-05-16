import React, { ReactElement } from 'react';
import { LazyImage } from '../LazyImage';
import { Button, ButtonVariant } from '../buttons/Button';
import { Modal, ModalProps } from '../modals/common/Modal';
import { Justify } from '../utilities';

interface MostVisitedSitesModalProps extends ModalProps {
  onApprove: () => unknown;
}

export default function MostVisitedSitesModal({
  className,
  onApprove,
  ...props
}: MostVisitedSitesModalProps): ReactElement {
  return (
    <Modal kind={Modal.Kind.FlexibleCenter} size={Modal.Size.Medium} {...props}>
      <Modal.Header />
      <Modal.Body>
        <Modal.Title className="mb-4">Show most visited sites</Modal.Title>
        <Modal.Text className="text-center">
          To show your most visited sites, your browser will now ask for more
          permissions. Once approved, it will be kept locally.
        </Modal.Text>
        <LazyImage
          imgSrc={
            process.env.TARGET_BROWSER === 'firefox'
              ? '/mvs_firefox.jpg'
              : '/mvs_google.jpg'
          }
          imgAlt="Image of the browser's default home screen"
          className="mx-auto my-8 w-full max-w-[22rem] rounded-16"
          ratio="45.8%"
          eager
        />
        <Modal.Text className="text-center">
          We will never collect your browsing history. We promise.
        </Modal.Text>
      </Modal.Body>
      <Modal.Footer justify={Justify.Center}>
        <Button onClick={onApprove} variant={ButtonVariant.Primary}>
          Add the shortcuts
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
