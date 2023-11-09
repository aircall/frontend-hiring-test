export const PATHS = {
  LOGIN: '/login',

  CALLS: '/calls',

  CALL_DETAIL(callId?: string) {
    return `${this.CALLS}/${callId}`;
  }
};
