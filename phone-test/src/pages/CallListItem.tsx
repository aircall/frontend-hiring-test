import { Typography } from '@aircall/tractor';
import { List } from '../components/common/List';
import { CallListItemInnerList } from './CallListItemInnerList';

type CallListItemProps = {
  header: React.ReactNode;
  calls: Call[];
  onCallClick: React.ComponentPropsWithoutRef<typeof CallListItemInnerList>['onClick'];
};

export const CallListItem: React.FC<CallListItemProps> = ({ header, calls, onCallClick }) => {
  return (
    <li>
      <header>
        <Typography as="h1" variant="heading" textAlign="left" py={3}>
          {header}
        </Typography>
      </header>
      <List>
        {calls.map((call: Call) => (
          <CallListItemInnerList key={call.id} call={call} onClick={onCallClick} />
        ))}
      </List>
    </li>
  );
};
