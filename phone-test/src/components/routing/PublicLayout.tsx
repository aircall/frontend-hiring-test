import { Outlet } from 'react-router-dom';
import { Flex } from '@aircall/tractor';

export const PublicLayout = () => {
  return (
    <Flex flexDirection="column" maxWidth={768} p={4} w="100%">
      <Outlet />
    </Flex>
  );
};
