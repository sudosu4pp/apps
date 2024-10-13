import { SourceMember, SourceMemberRole } from '../../graphql/sources';
import { SourcePostModerationStatus } from '../../graphql/squads';

interface UsePostModerationState {
  shouldShowRejectedMessage: boolean;
  shouldShowActions: boolean;
}

interface UsePostModerationStateProps {
  member: SourceMember;
  status: SourcePostModerationStatus;
}

export const usePostModerationState = ({
  member,
  status,
}: UsePostModerationStateProps): UsePostModerationState => {
  const role = member?.role;
  const isMember = role === SourceMemberRole.Member;

  return {
    shouldShowActions:
      !isMember && status === SourcePostModerationStatus.Pending,
    shouldShowRejectedMessage:
      isMember && status === SourcePostModerationStatus.Rejected,
  };
};
