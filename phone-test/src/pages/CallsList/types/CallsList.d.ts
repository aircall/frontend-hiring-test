type CallType = 'missed' | 'answered' | 'voicemail';

type CallListFilter = {
    callTypes?: CallType[];
}