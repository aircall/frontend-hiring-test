import { Flex } from '@aircall/tractor';
import { PropsWithChildren } from 'react';

const AppContainer = ({ children }: PropsWithChildren) => (
  <Flex flex={1} justifyContent="center" w="500px" mx="auto">
    {children}
  </Flex>
);

export { AppContainer };
