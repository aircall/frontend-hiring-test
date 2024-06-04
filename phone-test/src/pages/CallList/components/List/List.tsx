import * as S from '../../styles';
import { ListItem } from '../ListItem';
import { ListProps } from './types';

export const List = ({ calls, onCLick }: ListProps) => (
  <S.CallsList space={3} direction="vertical">
    {calls.map((call: Call) => (
      <ListItem key={call.id} call={call} onClick={onCLick} />
    ))}
  </S.CallsList>
);
