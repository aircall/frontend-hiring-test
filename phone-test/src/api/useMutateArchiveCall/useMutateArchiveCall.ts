import { useMutation } from '@apollo/client';
import { ArchiveCallParams, ArchiveCallsDTO, UseMutateArchiveCallParams } from './types';
import { ARCHIVE_CALL } from '../../gql/mutations';
import { useState } from 'react';

export const useMutateArchiveCall = ({ onSuccess, onFailure }: UseMutateArchiveCallParams) => {
  const [mutation] = useMutation<ArchiveCallsDTO, ArchiveCallParams>(ARCHIVE_CALL);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data: ArchiveCallParams) => {
    try {
      setIsLoading(true);
      await mutation({
        variables: data
      });
      onSuccess && onSuccess();
    } catch (error) {
      console.error(error);
      onFailure && onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};
