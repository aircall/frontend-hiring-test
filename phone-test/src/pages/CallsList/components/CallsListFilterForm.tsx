import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spacer, Grid, Flex, Select, Button, Typography } from '@aircall/tractor';

export interface CallsListFiltersProps {
  onApplyFilters: (filters: CallListFilter) => void;
  onResetFilters: () => void;
}

const callTypeOpts: { value: CallType; label: string }[] = [
  { value: 'missed', label: 'Missed call' },
  { value: 'answered', label: 'Call answered' },
  { value: 'voicemail', label: 'Voicemail' }
];

const CallsListFilters: React.FC<CallsListFiltersProps> = (
  props: CallsListFiltersProps
): React.ReactElement => {
  const [search] = useSearchParams();

  const { onApplyFilters, onResetFilters } = props;
  const [callTypesFilter, setCallTypesFilter] = useState<CallType[]>([]);

  const handleOnApplyFilters = (): void => {
    onApplyFilters({
      callTypes: callTypesFilter
    });
  };

  const handleOnClearFilters = (): void => {
    setCallTypesFilter([]);
    onResetFilters();
  };

  useEffect(() => {
    setCallTypesFilter(search.getAll('callTypes') as unknown as CallType[]);
  }, [search]);

  return (
    <>
      <Typography variant="caption">Filters</Typography>
      <Grid p={10} my={10}>
        <Flex alignItems="center" justifyContent="space-between">
          <Select
            options={callTypeOpts}
            size="small"
            w="50%"
            placeholder="Select call type"
            selectionMode="multiple"
            selectedKeys={callTypesFilter}
            onSelectionChange={(value: CallType[]) => setCallTypesFilter(value)}
          />
          <Spacer space="s">
            <Button size="small" mode="link" onClick={handleOnApplyFilters}>
              Apply
            </Button>
            <Button size="small" mode="link" variant="destructive" onClick={handleOnClearFilters}>
              Clear
            </Button>
          </Spacer>
        </Flex>
      </Grid>
    </>
  );
};

export default CallsListFilters;
