import { groupByDate } from "../../helpers/calls.group";


describe('call page tests', () => {

    test('calls must group by day', () => {

        const calls: Call[] = [];

        calls.push({
            id: '123456',
            call_type: 'voicemail',
            created_at: '2023-01-04T20:40:54.258Z',
            direction: 'inbound',
            from: '+33188026370',
            duration: 23434,
            is_archived: false,
            notes: [],
            to: '+33188026333',
            via: '33166513784'
        })

        calls.push({
            id: '123457',
            call_type: 'voicemail',
            created_at: '2023-01-03T20:40:54.258Z',
            direction: 'inbound',
            from: '+33188026370',
            duration: 23434,
            is_archived: false,
            notes: [],
            to: '+33188026333',
            via: '33166513784'
        })

        calls.push({
            id: '123458',
            call_type: 'voicemail',
            created_at: '2023-01-04T20:40:54.258Z',
            direction: 'inbound',
            from: '+33188026370',
            duration: 23434,
            is_archived: false,
            notes: [],
            to: '+33188026333',
            via: '33166513784'
        })

        const result = groupByDate(calls, "created_at");
        expect(result['Wed Jan 04 2023'].length).toBe(2);
        expect(result['Tue Jan 03 2023'].length).toBe(1);
    });

});