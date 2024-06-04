export interface PaginatedCallsParams {
  activePage: number;
  activeLimit: number;
}

export interface PaginatedCallsDTO {
  paginatedCalls: {
    totalCount: number;
    nodes: Call[];
  };
}
