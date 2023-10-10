import { useMutation } from '@apollo/client';
import { ARCHIVE_CALL } from '../../gql/mutations';
import { Button } from '@aircall/tractor';
import { useEffect } from 'react';

type CallDetailsFormProps = {
  id: string;
  isArchived: boolean;
  subscribeToUpdates: () => unknown;
};

export const CallDetailsForm: React.FC<CallDetailsFormProps> = ({
  id,
  isArchived,
  subscribeToUpdates
}) => {
  const [archiveCall, { loading }] = useMutation<{ archiveCall: Call }, { id: string }>(
    ARCHIVE_CALL
  );

  useEffect(() => {
    subscribeToUpdates();
  }, [subscribeToUpdates]);

  return (
    <Button
      disabled={loading}
      onClick={() =>
        archiveCall({
          variables: {
            id
          }
        })
      }
    >
      {!isArchived ? 'Archive' : 'Unarchive'}
    </Button>
  );
};
