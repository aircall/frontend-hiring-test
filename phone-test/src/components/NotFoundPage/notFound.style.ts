import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ErrorTitle = styled.h1`
  font-size: '3rem';
  margin-bottom: '1rem';
`;

export const ErrorText = styled.p`
  font-size: '1.5rem';
  text-align: 'center'
  max-width: '50ch';
`;

export const ErrorImage = styled.img`
  max-width: '400px';
  margin-bottom: '2rem';
`;

export const ErrorLink = styled(Link)`
font-size: '1.5rem';
text-decoration: 'underline';
`;