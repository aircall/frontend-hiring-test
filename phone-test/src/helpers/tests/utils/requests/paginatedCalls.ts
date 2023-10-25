import { PAGINATED_CALLS } from '../../../../gql/queries';

const data = {
  paginatedCalls: {
    nodes: [
      {
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
      },
      {
        id: '4fd052ba-9826-47a6-81ea-e5abe07a9bf4',
        direction: 'outbound',
        from: '+33186628908',
        to: '+33179811230',
        duration: 8026,
        is_archived: false,
        call_type: 'answered',
        via: '+33138992396',
        created_at: '2023-10-23T21:30:33.007Z',
        notes: [],
        __typename: 'Call'
      },
      {
        id: '0ceb6c02-49d4-4126-8c0f-8d7f017b988c',
        direction: 'inbound',
        from: '+33184346527',
        to: '+33178485155',
        duration: 54473,
        is_archived: false,
        call_type: 'answered',
        via: '+33191009162',
        created_at: '2023-10-23T14:34:36.980Z',
        notes: [
          {
            id: 'e60e908b-03bd-4a7d-b301-b20cd3a206bf',
            content: 'Dolor eos eveniet numquam.',
            __typename: 'Note'
          }
        ],
        __typename: 'Call'
      },
      {
        id: '01f84c35-2881-4c8e-a3db-9fa2fdd6da5e',
        direction: 'inbound',
        from: '+33158237891',
        to: '+33115197004',
        duration: 610,
        is_archived: false,
        call_type: 'missed',
        via: '+33123701854',
        created_at: '2023-10-19T22:32:54.163Z',
        notes: [],
        __typename: 'Call'
      }
    ],
    totalCount: 91,
    hasNextPage: true,
    __typename: 'PaginatedCalls'
  }
};

export const mockCallsQuery = {
  request: {
    query: PAGINATED_CALLS,
    variables: {
      offset: 0,
      limit: 5
    }
  },
  result: { data }
};
