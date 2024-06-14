export interface UseMutateArchiveCallParams {
  onSuccess?: () => void;
  onFailure?: (err: unknown) => void;
}

export interface ArchiveCallParams {
  id: string;
}
export interface ArchiveCallsDTO {
  id: string;
  is_archived: boolean;
}
