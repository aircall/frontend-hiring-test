import { useMemo } from 'react';
import * as S from '../../styles';
import { groupCallsByDate } from '../../utils';
import { ListItem } from '../ListItem';
import { ListProps } from './types';
import { DateSection } from '../DateSection';
import { Box, Typography } from '@aircall/tractor';

export const List = ({ calls, onItemClick, onArchive }: ListProps) => {
  // TODO: We can add sorting for list items also , but it will work only per page.
  // So it would be better to have that functionality covered on BE side
  const groupedCalls = useMemo(() => groupCallsByDate(calls), [calls]);
  const groups = Object.keys(groupedCalls);
  return (
    <S.CallsList space={3} direction="vertical">
      {groups.length ? (
        groups.map(date => (
          <DateSection key={date} date={date}>
            {groupedCalls[date].map((call: Call) => (
              <ListItem key={call.id} call={call} onItemClick={onItemClick} onArchive={onArchive} />
            ))}
          </DateSection>
        ))
      ) : (
        <Box>
          <Typography pt={5}>No calls found. Please try adjusting your filters.</Typography>
        </Box>
      )}
    </S.CallsList>
  );
};
