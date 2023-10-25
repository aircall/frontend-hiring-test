import { GET_CALL_DETAILS } from '../../../../gql/queries/getCallDetails';

const data = {
  call: {
    id: '4eb15231-ff64-4b29-8a7a-db4588a666c3',
    direction: 'inbound',
    from: '+33112595244',
    to: '+33140027979',
    duration: 37368,
    is_archived: false,
    call_type: 'voicemail',
    via: '+33177174017',
    created_at: '2023-10-23T07:29:09.552Z',
    notes: [
      {
        id: 'c620b29a-93a6-4d6b-b38b-4626530e0a74',
        content: 'Aut corrupti recusandae commodi maiores sint iste sed facere.',
        __typename: 'Note'
      }
    ],
    __typename: 'Call'
  }
};

export const mockCallDetailsQuery = {
  request: {
    query: GET_CALL_DETAILS,
    variables: {
      id: '4eb15231-ff64-4b29-8a7a-db4588a666c3'
    }
  },
  result: { data }
};
