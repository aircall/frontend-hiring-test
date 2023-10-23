import { Box } from '@aircall/tractor';
import { de } from 'date-fns/locale';

const EmptyCallListItem = () => {
  return <Box>
    <p>No calls found</p>
  </Box>;
};

export default EmptyCallListItem;
