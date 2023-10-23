import { Box, Typography } from '@aircall/tractor';

const EmptyCallListItem = () => {
  return <Box>
    <Typography variant="displayS2" textAlign="center">No calls found</Typography>
  </Box>;
};

export default EmptyCallListItem;
