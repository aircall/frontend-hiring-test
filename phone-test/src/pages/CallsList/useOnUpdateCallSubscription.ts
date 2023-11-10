import { useSubscription } from '@apollo/client';
import { ON_UPDATE_CALL } from '../../gql/subscriptions/onUpdateCall';

export function useOnUpdateCallSubscription() {
  return useSubscription(ON_UPDATE_CALL);
}
