import useCallList from './useCallList';

// COMMENT: We can extract this to a fixture or mocked response folder/file
const dummyRawData = [
    {
      "__typename": "Call",
      "id": "f0679b7d-4c6c-4279-9a92-e79bffb35d07",
      "direction": "outbound",
      "from": "+33158645815",
      "to": "+33126013937",
      "duration": 71274,
      "is_archived": true,
      "call_type": "voicemail",
      "via": "+33165766027",
      "created_at": "2024-03-29T16:47:34.012Z",
      "notes": [
        {
          "__typename": "Note",
          "id": "1b69641c-c6bc-45f9-9d58-8ecee221a4df",
          "content": "Est voluptatem ea cum debitis enim."
        }
      ]
    },
    {
      "__typename": "Call",
      "id": "5e36abcc-b817-4b88-91e8-27e13e86e227",
      "direction": "outbound",
      "from": "+33164877565",
      "to": "+33160833145",
      "duration": 42627,
      "is_archived": true,
      "call_type": "answered",
      "via": "+33154363270",
      "created_at": "2024-03-30T12:45:33.558Z",
      "notes": []
    },
    {
      "__typename": "Call",
      "id": "adf117d3-1bdf-446f-9f71-a56b2310569d",
      "direction": "inbound",
      "from": "+33104729906",
      "to": "+33187072962",
      "duration": 70381,
      "is_archived": false,
      "call_type": "voicemail",
      "via": "+33102860496",
      "created_at": "2024-03-29T12:59:48.740Z",
      "notes": [
        {
          "__typename": "Note",
          "id": "ba3fa54e-eabf-4a13-95c1-15200d1b0224",
          "content": "Harum architecto excepturi a officia."
        }
      ]
    },
];

describe('useCallList custom utils hook', () => {
    
    describe('getCallsGivenFilterCriteria method', () => {
        it('should retrieve the same number of elements if no filters are provided', () => {
            const { getCallsGivenFilterCriteria } = useCallList();
            const result = getCallsGivenFilterCriteria(dummyRawData);

            expect(result.length).toBe(3);
        });

        it('should return the exact number of elements when filtering by a call type', () => {
            const { getCallsGivenFilterCriteria } = useCallList();
            const expectedNthItems = dummyRawData.filter((item) => item.call_type === 'voicemail').length;
            const result = getCallsGivenFilterCriteria(dummyRawData, { callTypes: ['voicemail']});

            expect(result.length).toEqual(expectedNthItems);
        });

        it('should return an empty array if an empty array is provided', () => {
            const { getCallsGivenFilterCriteria } = useCallList();
            const result = getCallsGivenFilterCriteria([]);

            expect(result).toEqual([]);
        });

        it('should order the data descendingly', () => {
            const { getCallsGivenFilterCriteria } = useCallList();
            const expectedResult = dummyRawData.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
            const result = getCallsGivenFilterCriteria(dummyRawData, undefined, 'desc');

            expect(result).toEqual(expectedResult);
        });

        it('should throw an error if provided data source is not an array-like element - forcing type', () => {
            const { getCallsGivenFilterCriteria } = useCallList();
            
            expect(() => getCallsGivenFilterCriteria({} as unknown as [])).toThrow(Error);
        });
    });
    
    describe('mapCallDataByCreationDate method', () => {
        it('should return an object key-value-like that respect the expected mapping format', () => {
            const { mapCallDataByCreationDate } = useCallList();
            const result = mapCallDataByCreationDate(dummyRawData);
            const [item] = Object.entries(result!);

            expect(result).toBeDefined();
            expect(typeof item[0]).toBe('string');
            expect(typeof item[1]).toBe('object');
            expect(Array.isArray(item[1])).toBeTruthy();
        });

        it('should return null if no data is provided - forcing argument type', () => {
            const { mapCallDataByCreationDate } = useCallList();
            const result = mapCallDataByCreationDate(undefined as unknown as []);
            
            expect(result).toBeNull();
        });
    });
});