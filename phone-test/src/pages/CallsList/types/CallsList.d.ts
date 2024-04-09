type CallType = 'missed' | 'answered' | 'voicemail';
type SortType = 'asc' | 'desc';

type CallListFilter = {
    callTypes?: CallType[];
    dateSort?: SortType;
}