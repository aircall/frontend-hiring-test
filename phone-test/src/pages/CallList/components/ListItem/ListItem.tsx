import { useMemo } from 'react';
import { ArchiveOutlined, Box, Button, Grid, Icon, Typography } from '@aircall/tractor';

import { ListItemProps } from './types';
import { transformData } from './utils';

export const ListItem = ({ call, onItemClick, onArchive }: ListItemProps) => {
  const { icon, title, subtitle, duration, date, notes, isArchived } = useMemo(
    () => transformData(call),
    [call]
  );

  const handleClick = () => onItemClick(call.id);

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onArchive(call.id);
  };

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
      <Grid
        gridTemplateColumns="1fr 1fr"
        columnGap={2}
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
      >
        <Box>
          <Typography variant="caption">{notes}</Typography>
        </Box>
        <Box justifySelf="flex-end">
          {isArchived ? (
            <Button size="xSmall" mode="outline" onClick={handleArchive}>
              Restore
            </Button>
          ) : (
            <Button size="xSmall" variant="destructive" mode="outline" onClick={handleArchive}>
              <ArchiveOutlined />
              Archive
            </Button>
          )}
        </Box>
      </Grid>
    </Box>
  );
};
