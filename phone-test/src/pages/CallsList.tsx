import { useMutation, useQuery, useSubscription } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Pagination,
  Dropdown,
  DropdownButton,
  Checkbox,
  Button,
  ArchiveFilled,
  ArchiveOutlined,
  useToast,
  Tooltip
} from '@aircall/tractor';
import { formatDate, formatDuration, getday } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { ARCHIVE_CALL } from '../gql/mutations/archiveCall';
// import { UPDATE_CALL } from '../gql/subscriptions/updateCall';
import { Loading } from './Loading';
import { NoData } from './NoData';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;
export const SpacerWrapper = styled.div`
  > div {
    height: 65vh;
    overflow-y: auto;
    width: 100%;
  }
`;

export const DropdownWrapper = styled.div`
  > div {
    height: 5vh;
    width: 20vw;
  }
`;

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const [callsPerPage, setCallsPerPage] = useState(5)
  const [callType, setCallType] = useState([] as string[])
  const [direction, setDirection] = useState([] as string[])
  const [archiveMutation] = useMutation(ARCHIVE_CALL)
  // const {refresh} = useAuth()
  const navigate = useNavigate();
  const callTypeOptions = {'missed':'Missed Call', 'voicemail':'Voice Mail', 'answered':'Call answered' }
  const callDirectionOptions = ['inbound', 'outbound']
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const {login} = useAuth()

  const handleRefreshToken = async() => {
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')
    const emailParsed = email? localStorage.getItem('email') : undefined
    const passwordParsed = password? localStorage.getItem('password') : undefined
    // await refresh()
    try {
      await login({ username: emailParsed, password: passwordParsed, navigateToCalls: true });
      removeToast('LOGIN_REJECTED');
    } catch (error) {
      console.log(error);
      showToast({
        id: 'LOGIN_REJECTED',
        message: 'Invalid email or password',
        variant: 'error'
      });
    }
  }

  // const {subLoading, newData, UpdateError}: any = useSubscription(UPDATE_CALL);
  const { showToast, removeToast } = useToast();
  const show = () => {
    showToast({
      variant: 'error',
      dismissIn: 3000,
      id: 'CallError',
      onClick(onDismiss) {
        removeToast('CallError')
      },
      // 3s
      message: `The call with ID does not exist`,
      icon: true
    });
  };

  const { loading, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * callsPerPage,
      limit: callsPerPage
    },
    onError: (error)=>{
      if(error.graphQLErrors[0].message === 'Unauthorized'){
        handleRefreshToken()
      }else{
        show()
      }
    }
  });

  if (loading) return <Box>
  {Loading()}
</Box>;
  if (!data) return NoData();

  const { totalCount, nodes: calls } = data.paginatedCalls;


  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`); 
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };
  const handleCallType = (property: string) => {
    if(callType.includes(property)){
      setCallType(oldValues=> oldValues.filter(item => item !== property))
    }
    else{
      setCallType([...callType,property])
    }
  }
  const handleDirection = (property: string) => {
    if(direction.includes(property)){
      setDirection(oldValues=> oldValues.filter(item => item !== property))
    }
    else{
      setDirection([...direction, property])
    }
  }

  const gridData = (callData: Call[]) => {
    return callData.map((call: Call) => {
      const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
      const title =
        call.call_type === 'missed'
          ? 'Missed call'
          : call.call_type === 'answered'
          ? 'Call answered'
          : 'Voicemail';
      const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
      const duration = formatDuration(call.duration / 1000);
      const date = formatDate(call.created_at);
      const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

      return (
        <Box
          key={call.id}
          bg="black-a30"
          borderRadius={16}
          cursor="pointer"
          onClick={() => handleCallOnClick(call.id)}
        >
          <Grid
            gridTemplateColumns="32px 1fr max-content"
            columnGap={2}
            borderBottom="1px solid"
            borderBottomColor="neutral-700"
            alignItems="center"
            px={4}
            py={2}
          >
            <Box>
              <Icon component={icon} size={32} />
            </Box>
            <Box>
              <Typography variant="body">{title}</Typography>
              <Typography variant="body2">{subtitle}</Typography>
            </Box>
            <Grid
              gridTemplateColumns="2fr auto"
              alignItems="center"
              px={4}
              py={2}
              >
              <Box>
              <Tooltip title={call.is_archived ?'Unarchive': 'Archive'} mouseLeaveDelay={0}>
                <Button mode="link" variant="instructive" onClick={(_event: any)=>handleArchive(_event, call.id)}>
                  {call.is_archived ? <ArchiveFilled /> :<ArchiveOutlined/>}
                </Button>
                </Tooltip>
              </Box>
            <Box>
              <Typography variant="caption" textAlign="right">
                {duration}
              </Typography>
              <Typography variant="caption">{date}</Typography>
            </Box>
            </Grid>
          </Grid>
          <Box px={4} py={2}>
            <Typography variant="caption">{notes}</Typography>
          </Box>
        </Box>
      );
    })
  }

  const handleArchive = (_event: any, callId: string)=> {
    archiveMutation({
      variables: {
        id: callId
      },
      onError: (archiveError)=>{
        if (archiveError) {
          if(archiveError.graphQLErrors[0].message === 'Unauthorized'){
            handleRefreshToken()
          }else{
            show()
          }
      }
    }
    });
    _event.stopPropagation()
    }

  const filterDropdownChildren = () => {
    return <Spacer space={4} direction='horizontal'>
      <Box marginLeft="5px" marginRight="10px"><Typography marginLeft="5px" variant="displayS" textAlign="left" py={3}>
    Call Type
  </Typography>
  <Spacer space={2} direction='vertical'>
  {Object.entries(callTypeOptions).map(([key,value])=>{
        return<Checkbox
      key={key}
      onChange={() => handleCallType(key)}
      defaultChecked={callType.includes(key)}
      marginLeft="5px"
      marginRight="10px" 
      >{value}</Checkbox>}
    )}
    </Spacer>
  </Box>
  <Box marginLeft="5px" marginRight="10px"><Typography marginLeft="5px" variant="displayS" textAlign="left" py={3}>
    Call Direction
  </Typography>
  <Spacer space={2} direction='vertical'>
  {callDirectionOptions.map((item: string)=>{
        return<Checkbox
      key={item}
      onChange={() => handleDirection(item)}
      defaultChecked={direction.includes(item)}
      marginLeft="5px"
      marginRight="10px" 
      >{item}</Checkbox>}
    )}
    </Spacer>
  </Box>
    </Spacer>
  }

  const filteredCalls : Call[] = callType.length===0 && direction.length===0? calls: calls.filter((item:Call)=>{
    if(callType.length === 0){
      return direction.includes(item.direction)
    }else if(direction.length === 0){
      return callType.includes(item.call_type)
    }
    return direction.includes(item.direction) && callType.includes(item.call_type)
  })

  let groupedCalls:{[key: string]: Call[]} = {}
  filteredCalls.map((item: Call) => {
    const day: string = getday(item.created_at)
    if(Object.keys(groupedCalls).includes(day)){
      groupedCalls[day] = [...groupedCalls[day], item]
    }else{
      groupedCalls[day] = [item]
    }
  })

  const sortedGroupKeys = Object.keys(groupedCalls).sort(function(a: string,b: string) 
  {
    const date1 = new Date(a)
    const date2 = new Date(b)
    return date2.valueOf() - date1.valueOf()
  })

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer space={3} direction="horizontal">
      <DropdownWrapper>
      <Dropdown trigger={<DropdownButton mode='link'>Choose Filter</DropdownButton>} closeOnOutsideClick={true} closeOnInsideClick={false} children={filterDropdownChildren()}></Dropdown>
      </DropdownWrapper>
      </Spacer>
      <SpacerWrapper>
      <Spacer space={3} direction="vertical">
        {
          sortedGroupKeys.map((item: string)=> {
            return <Box boxShadow="1"><Spacer space={1} direction='vertical' minWidth='100%'>
              <Typography variant="overline" textAlign={'center'} bg='#101820' borderRadius='5px' minHeight='20px' paddingTop='4px'>{item}</Typography>
              {gridData(groupedCalls[item])}
              </Spacer>
              </Box>
          })
        }
      </Spacer>
      </SpacerWrapper>
      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
            onPageSizeChange={(newValue: number)=>{setCallsPerPage(newValue)}}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
