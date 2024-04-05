export type MappedCallDataByDate = Record<PropertyKey, Call[]>;

export interface UseCallListInterface {
    getCallsGivenFilterCriteria: (data: Call[], filters?: CallListFilter, sortDirection?: SortType) => Call[];
    mapCallDataByCreationDate: (data: Call[]) => MappedCallDataByDate | null;
}

const useCallList = (): UseCallListInterface => {
    
    const mapCallDataByCreationDate = (data: Call[]): MappedCallDataByDate | null => {
        
        if(!data) return null;
        
        const mappedData = data.reduce((acc: MappedCallDataByDate, item: Call) => {
            const key = new Date(item.created_at).toISOString().slice(0, 10);
            acc[key] = acc[key] || [];
            acc[key].push(item);
            return acc;
        }, {});

        return mappedData;
    }

    const getCallsGivenFilterCriteria = (data: Call[], filters?: CallListFilter, sortDirection: SortType = 'asc'): Call[] => {
        if(!Array.isArray(data)) {
            throw Error('Wrong data type source provided');
        }
        
        const { callTypes } = filters || {};

        const result = data
            .filter((item) => callTypes && callTypes.length > 0 ? callTypes.includes(item.call_type as CallType) : item)
            .sort((a, b) => {
                const dateA = +new Date(a.created_at);
                const dateB = +new Date(b.created_at);

                if(sortDirection === 'asc') {
                    return dateA - dateB;
                } else if(sortDirection === 'desc') {
                    return dateB - dateA;
                } else {
                    return 0;
                }
            });

        return result;
    }

    return {
        getCallsGivenFilterCriteria,
        mapCallDataByCreationDate,
    }
}

export default useCallList;
