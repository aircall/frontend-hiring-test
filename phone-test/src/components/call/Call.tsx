import { Box, Button, Flex, Grid, Icon, Typography } from '@aircall/tractor';
import { ComponentType, MouseEventHandler, SVGProps } from 'react';

interface CallProps {
  date: string;
  duration: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isArchived: boolean;
  notes: string;
  onArchive: MouseEventHandler<HTMLButtonElement>;
  onCall: VoidFunction;
  subtitle: string;
  title: 'Missed call' | 'Call answered' | 'Voicemail';
}

export const Call = ({
  date,
  icon,
  isArchived,
  notes,
  onArchive,
  onCall,
  subtitle,
  title,
  duration
}: CallProps) => {
  return (
    <Box bg="black-a30" borderRadius={16} cursor="pointer" onClick={onCall}>
      <Grid
        alignItems="center"
        borderBottom="1px solid"
        borderBottomColor="neutral-700"
        columnGap={2}
        gridTemplateColumns="32px 1fr max-content"
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
      <Flex px={4} py={2} justifyContent="space-between">
        <Typography variant="caption">{notes}</Typography>
        <Button
          disabled={isArchived}
          mode="link"
          onClick={isArchived ? undefined : onArchive}
          size="xSmall"
          variant="destructive"
        >
          {isArchived ? 'Archived' : 'Archive'}
        </Button>
      </Flex>
    </Box>
  );
};
