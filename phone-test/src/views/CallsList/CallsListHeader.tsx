import { Typography, Flex } from '@aircall/tractor';
import React from 'react';

interface CallsListHeaderProps {
  itemsPerPage: number;
  options: number[];
  onItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  callTypeFilter: string;
  directionFilter: string;
  onCallTypeFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDirectionFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CallsListHeader = ({
  itemsPerPage,
  onItemsPerPageChange,
  options,
  callTypeFilter,
  directionFilter,
  onCallTypeFilterChange,
  onDirectionFilterChange
}: CallsListHeaderProps) => {
  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Flex mb="20px" justifyContent={'center'} style={{ gap: '0.5rem' }}>
        <label htmlFor="itemsPerPage">Calls per page: </label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={onItemsPerPageChange}>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label htmlFor="callTypeFilter">Call Type: </label>
        <select id="callTypeFilter" value={callTypeFilter} onChange={onCallTypeFilterChange}>
          <option value="">All</option>
          <option value="missed">Missed</option>
          <option value="answered">Answered</option>
          <option value="voicemail">Voicemail</option>
        </select>
        <label htmlFor="directionFilter">Direction: </label>
        <select id="directionFilter" value={directionFilter} onChange={onDirectionFilterChange}>
          <option value="">All</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
        </select>
      </Flex>
    </>
  );
};

export { CallsListHeader };
