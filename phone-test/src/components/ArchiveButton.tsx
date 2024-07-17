import { Reference, StoreObject, useMutation } from '@apollo/client';
import { ARCHIVE_CALL } from '../gql/mutations/archive';
import { Button } from '@aircall/tractor';

const ArchiveButton = ({ callId, isArchived }: { callId: string; isArchived?: boolean }) => {
  const [archiveCall] = useMutation(ARCHIVE_CALL, {
    update(cache, { data: { archiveCall } }) {
      cache.modify({
        fields: {
          calls(existingCallsRefs = [], { readField }) {
            return existingCallsRefs.map((callRef: Reference | StoreObject | undefined) => {
              if (readField('id', callRef) === archiveCall.id) {
                return { ...callRef, is_archived: archiveCall.is_archived };
              }
              return callRef;
            });
          }
        }
      });
    }
  });

  const handleArchive = () => {
    archiveCall({ variables: { id: callId } });
  };

  return (
    <Button
      size="xSmall"
      variant={isArchived ? 'instructive' : 'alternative'}
      onClick={handleArchive}
    >
      {isArchived ? 'Archive' : 'Unarchive'}
    </Button>
  );
};

export { ArchiveButton };
