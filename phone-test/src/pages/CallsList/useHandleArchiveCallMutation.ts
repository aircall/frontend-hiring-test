import { useMutation } from '@apollo/client';
import {
  ARCHIVE_CALL,
  ARCHIVE_CALL_DATA,
  ARCHIVE_CALL_VARIABLES
} from '../../gql/mutations/archiveCall';
import { useToast } from '@aircall/tractor';

const FIVE_SECONDS_IN_MILISECONDS = 5 * 1000;

export function useHandleArchiveCallMutation() {
  const toast = useToast();

  const [mutation] = useMutation<ARCHIVE_CALL_DATA, ARCHIVE_CALL_VARIABLES>(ARCHIVE_CALL);

  async function archiveCallHandler(id: Call['id']) {
    try {
      await mutation({
        variables: {
          id
        }
      });
    } catch (error) {
      console.log('AM I REACHING THIS???');
      toast.showToast({
        variant: 'error',
        dismissIn: FIVE_SECONDS_IN_MILISECONDS,
        message:
          'We have been unable to archive your call. Please try again later, or contact our support team through support.aircall.io',
        icon: true
      });
    }
  }

  return {
    archiveCallHandler
  };
}
