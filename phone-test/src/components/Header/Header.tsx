import { Typography } from '@aircall/tractor';
import { HeaderProps } from './types';

export const Header = ({ title, align = 'center' }: HeaderProps) => (
  <Typography variant="displayM" textAlign={align} py={3}>
    {title}
  </Typography>
);
