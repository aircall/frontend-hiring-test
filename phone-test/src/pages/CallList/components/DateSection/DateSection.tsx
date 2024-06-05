import React from 'react';
import { Box, Typography } from '@aircall/tractor';
import { formatDate } from '../../../../helpers/dates';

interface DateSectionProps {
  date: string;
  children: React.ReactNode;
}

export const DateSection = ({ date, children }: DateSectionProps) => (
  <Box mb={3}>
    <Typography variant="body" p={2}>
      {formatDate(date, 'MMMM d, yyyy')}
    </Typography>
    {children}
  </Box>
);
