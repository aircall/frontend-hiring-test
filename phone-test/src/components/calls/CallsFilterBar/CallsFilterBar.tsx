import {
  Box,
  Button,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Flex,
  Icon,
  Select
} from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CallsFilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  //Used to remove page when changing filter. Fix pagination bug
  const deletePageParam = () => {
    setSearchParams(params => {
      params.delete('page');
      return params;
    });
  };

  const handleCallDirection = (direction: string) => {
    if (direction === 'all') {
      setSearchParams(params => {
        params.delete('dir');
        return params;
      });
    } else {
      setSearchParams(params => {
        params.set('dir', direction);
        return params;
      });
    }
    deletePageParam();
    navigate(`/calls/?${searchParams.toString()}`);
  };

  const handleCallType = (key: React.Key[]) => {
    setSearchParams(params => {
      if (!key[0]) params.delete('type');
      else params.set('type', key[0].toString());
      return params;
    });
    deletePageParam();
    navigate(`/calls/?${searchParams.toString()}`);
  };

  const callTypes = [
    { value: 'missed', label: 'Missed calls' },
    { value: 'answered', label: 'Answered calls' },
    { value: 'voicemail', label: 'Voicemail calls' },
    { value: 'unknown', label: 'Unknown calls' }
  ];

  return (
    <Flex justifyContent="space-between">
      <Box maxWidth={200} color="white">
        {/* I'm not using defaultValue because it's not working. I tried defaultValue="missed" hardcoded and 
        it doesn't work. I tried passing all option object and no works*/}
        <Select
          size="small"
          maxW={250}
          placeholder="Filter by call type"
          options={callTypes}
          onSelectionChange={key => handleCallType(key)}
        />
      </Box>
      <Flex minWidth={220} justifyContent="space-between">
        <Button size="xSmall" variant="primary" onClick={() => handleCallDirection('all')}>
          All
        </Button>
        <Button size="xSmall" variant="primary" onClick={() => handleCallDirection('inbound')}>
          <Icon component={DiagonalDownOutlined} size={20} />
        </Button>
        <Button size="xSmall" variant="primary" onClick={() => handleCallDirection('outbound')}>
          <Icon component={DiagonalUpOutlined} size={20} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default CallsFilterBar;
