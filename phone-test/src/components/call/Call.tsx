import { Box, Grid, Icon, Typography } from '@aircall/tractor';
import { ComponentType, SVGProps } from 'react';

interface CallProps {
  date: string;
  duration: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  notes: string;
  onCall: VoidFunction;
  subtitle: string;
  title: 'Missed call' | 'Call answered' | 'Voicemail';
}

export const Call = ({ date, icon, notes, onCall, subtitle, title, duration }: CallProps) => {
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
      <Box px={4} py={2}>
        <Typography variant="caption">{notes}</Typography>
      </Box>
    </Box>
  );
};
