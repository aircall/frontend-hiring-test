export function sortCallsDescendingByCreationDate(calls: Call[]) {
  return [...calls].sort((callA, callB) => {
    if (callA.created_at < callB.created_at) {
      return 1;
    }

    if (callA.created_at > callB.created_at) {
      return -1;
    }

    return 0;
  });
}
