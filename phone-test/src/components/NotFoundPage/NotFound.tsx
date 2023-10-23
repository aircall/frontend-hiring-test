import { Button, Flex } from '@aircall/tractor';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ErrorTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const ErrorText = styled.p`
  font-size: 1.5rem;
  text-align: center;
`;

export const ErrorImage = styled.img`
  max-width: clamp(10rem, 500px, 70vh);
  margin-bottom: 2rem;
`;

export const NotFoundPage = () => {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop={30}>
      <ErrorImage
        src="https://img.freepik.com/vector-gratis/error-404-ilustracion-concepto-paisaje_114360-7898.jpg?w=1380&t=st=1697573689~exp=1697574289~hmac=cc2e9894fb977e6b221f04744302db60e3a5ae17d308a95910cc0ba002a3ba11"
        alt="404 Error"
      />
      <ErrorTitle>Oops! Page not found</ErrorTitle>
      <ErrorText>The page you are looking for is unavailable.</ErrorText>
      <Link to="/calls"><Button> Go to calls page</Button> </Link>
    </Flex>
  );
};
