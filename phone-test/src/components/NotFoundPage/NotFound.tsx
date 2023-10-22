  import { Flex } from '@aircall/tractor';
  import { ErrorImage, ErrorText, ErrorTitle } from './notFound.style';
  import { Link } from 'react-router-dom';
  
  export const NotFoundPage = () => {
    return (
      <Flex flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <ErrorImage
          src="https://img.freepik.com/vector-gratis/error-404-ilustracion-concepto-paisaje_114360-7898.jpg?w=1380&t=st=1697573689~exp=1697574289~hmac=cc2e9894fb977e6b221f04744302db60e3a5ae17d308a95910cc0ba002a3ba11"
          alt="404 Error"
        />
        <ErrorTitle>Oops! Page not found</ErrorTitle>
        <ErrorText>The page you are looking for is unavailable.</ErrorText>
        <Link to="/calls" style={{ fontSize: '1.5rem', textDecoration: 'underline' }}> Go to calls page </Link>
      </Flex>
    );
  };
  