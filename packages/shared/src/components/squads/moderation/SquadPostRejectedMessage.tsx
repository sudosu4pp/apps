import React, { ReactElement } from 'react';
import { AlertPointerMessage } from '../../alert/common';
import { AlertColor } from '../../AlertDot';

export interface SquadPostRejectedMessageProps {
  squad: string;
  reason: string;
}

export function SquadPostRejectedMessage({
  squad,
  reason,
}: SquadPostRejectedMessageProps): ReactElement {
  return (
    <AlertPointerMessage color={AlertColor.Bun}>
      Your post in {squad} was not approved for the following reason:
      {reason}. Please review the feedback and consider making changes before
      resubmitting.
    </AlertPointerMessage>
  );
}
