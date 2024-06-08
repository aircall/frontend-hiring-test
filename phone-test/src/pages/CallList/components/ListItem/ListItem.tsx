import { useMemo } from 'react';
import { Box, Grid, Icon, Typography } from '@aircall/tractor';

import { ListItemProps } from './types';
import { transformData } from './utils';

export const ListItem = ({ call, onClick }: ListItemProps) => {
  const { icon, title, subtitle, duration, date, notes } = useMemo(
    () => transformData(call),
    [call]
  );

  const handleClick = () => onClick(call.id);

  return (
    <Box
      key={call.id}
      mb={2}
      bg="black-a30"
      borderRadius={16}
      cursor="pointer"
      onClick={handleClick}
      data-test-id="call-item"
    >
      <Grid
        gridTemplateColumns="32px 1fr max-content"
        columnGap={2}
        borderBottom="1px solid"
        borderBottomColor="neutral-700"
        alignItems="center"
        px={4}
        py={2}
      >
        <Box>
          <Icon component={icon} size={32} />
        </Box>
        <Box>
          <Typography variant="body">{title}</Typography>
          <Typography variant="body2">{subtitle}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" textAlign="right">
            {duration}
          </Typography>
          <Typography variant="caption">{date}</Typography>
        </Box>
      </Grid>
      <Box px={4} py={2}>
        <Typography variant="caption">{notes}</Typography>
      </Box>
    </Box>
  );
};
