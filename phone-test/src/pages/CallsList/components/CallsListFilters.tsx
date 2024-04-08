import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spacer, Grid, Flex, Select, Button, Typography } from '@aircall/tractor';

export interface CallsListFiltersProps {
  onApplyFilters: (filters: CallListFilter) => void;
  onResetFilters: () => void;
}

const dateSortOpts: { value: SortType; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
];

const callTypeOpts: { value: CallType; label: string }[] = [
  { value: 'missed', label: 'Missed call' },
  { value: 'answered', label: 'Call answered' },
  { value: 'voicemail', label: 'Voicemail' }
];

const CallsListFilters: React.FC<CallsListFiltersProps> = (
  props: CallsListFiltersProps
): React.ReactElement => {
  const [search] = useSearchParams();

  const defaultFilters = {
    dateSort: search.getAll('dateSort') || [],
    callTypesFilter: search.getAll('callTypes') || []
  };

  const { onApplyFilters, onResetFilters } = props;
  const [dateSortFilter, setDateSortFilter] = useState<SortType[]>(
    defaultFilters.dateSort as unknown as SortType[]
  );
  const [callTypesFilter, setCallTypesFilter] = useState<CallType[]>(
    defaultFilters.callTypesFilter as unknown as CallType[]
  );

  const handleOnApplyFilters = (): void => {
    const [dateSort] = dateSortFilter;

    onApplyFilters({
      callTypes: callTypesFilter,
      dateSort: dateSort
    });
  };

  const handleOnClearFilters = (): void => {
    setCallTypesFilter([]);
    setDateSortFilter([]);
    onResetFilters();
  };

  useEffect(() => {
    handleOnApplyFilters();
  }, []);

  return (
    <>
      <Typography variant="caption">Filters</Typography>
      <Grid p={10} my={20}>
        <Flex alignItems="center" justifyContent="space-around">
          <Select
            w="30%"
            size="small"
            selectionMode="single"
            selectedKeys={dateSortFilter}
            options={dateSortOpts}
            onSelectionChange={(value: SortType[]) => setDateSortFilter(value)}
            placeholder="Select sort"
            data-test="select-date-sort"
          />
          <Select
            w="40%"
            size="small"
            selectionMode="multiple"
            selectedKeys={callTypesFilter}
            options={callTypeOpts}
            onSelectionChange={(value: CallType[]) => setCallTypesFilter(value)}
            placeholder="Select call type"
            data-test="select-call-types"
          />
          <Spacer space="s">
            <Button name="btn-apply" size="small" mode="link" onClick={handleOnApplyFilters}>
              Apply
            </Button>
            <Button
              name="btn-clear"
              size="small"
              mode="link"
              variant="destructive"
              onClick={handleOnClearFilters}
            >
              Clear
            </Button>
          </Spacer>
        </Flex>
      </Grid>
    </>
  );
};

export default CallsListFilters;
