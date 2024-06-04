import { Flex, Icon, SpinnerOutlined } from '@aircall/tractor';

export const Loader = () => (
  <Flex justifyContent="center" m={15}>
    <Icon component={SpinnerOutlined} spin />
  </Flex>
);
