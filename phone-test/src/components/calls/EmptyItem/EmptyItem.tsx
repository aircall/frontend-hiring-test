import { Box, Typography } from '@aircall/tractor';

interface EmptyCallListItemProps {
  text: string;
}
const EmptyCallListItem = ({ text }: EmptyCallListItemProps) => {
  return (
    <Box>
      <Typography variant="displayS2" textAlign="center">
        {text}
      </Typography>
    </Box>
  );
};

export default EmptyCallListItem;
