import { useMemo } from 'react';
import * as S from '../../styles';
import { groupCallsByDate } from '../../utils';
import { ListItem } from '../ListItem';
import { ListProps } from './types';
import { DateSection } from '../DateSection';

export const List = ({ calls, onItemClick, onArchive }: ListProps) => {
  // TODO: We can add sorting for list items also , but it will work only per page.
  // So it would be better to have that functionality covered on BE side
  const groupedCalls = useMemo(() => groupCallsByDate(calls), [calls]);

  return (
    <S.CallsList space={3} direction="vertical">
      {Object.keys(groupedCalls).map(date => (
        <DateSection key={date} date={date}>
          {groupedCalls[date].map((call: Call) => (
            <ListItem key={call.id} call={call} onItemClick={onItemClick} onArchive={onArchive} />
          ))}
        </DateSection>
      ))}
    </S.CallsList>
  );
};
