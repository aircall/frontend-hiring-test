import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';

export const useNavigateWithParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mergeUrlParams } = useSearch();

  const navigateWithParams = (path: string, params: object) => {
    navigate(`${path}?${mergeUrlParams(location.search, params)}`);
  };

  return navigateWithParams;
};
