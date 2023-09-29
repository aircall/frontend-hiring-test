import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { ArchiveFilled, ArchiveOutlined, Box, Divider, Grid, Spacer, Tooltip, Typography, useToast } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { ARCHIVE_CALL } from '../gql/mutations/archiveCall';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './Loading';


export const CallDetailsPage = () => {
  const [archiveMutation] = useMutation(ARCHIVE_CALL)
  const { callId } = useParams();
  const {login} = useAuth();
  const { showToast, removeToast } = useToast();
  const { loading, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
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

  const { call } = data;

  const handleRefreshToken = async() => {
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')
    const emailParsed = email? localStorage.getItem('email') : undefined
    const passwordParsed = password? localStorage.getItem('password') : undefined
    // await refresh()
    try {
      await login({ username: emailParsed, password: passwordParsed, navigatToCalls: false });
      removeToast('LOGIN_REJECTED');
    } catch (error) {
      console.log(error);
      showToast({
        id: 'LOGIN_REJECTED',
        message: 'Invalid email or password',
        variant: 'error'
      });
    }finally{
      window.location.reload()
    }
  }

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

  return (
    <>
    <Spacer space={4} direction='horizontal' marginLeft='30px'>
    <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      <Tooltip title={call.is_archived ?'Unarchive': 'Archive'} mouseLeaveDelay={0}>
        <Typography variant="displayM" textAlign="center" py={4} onClick={(_event: any)=>handleArchive(_event, call.id)} cursor={'pointer'}>
      {call.is_archived ? <ArchiveFilled color={'#307FE2'} /> : <ArchiveOutlined color={'#307FE2'}/>}
      </Typography>
      </Tooltip>
    </Spacer>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Type</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.__typename}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>ID</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.id}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Direction</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.direction}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Caller</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.from}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Recipient</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.to}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>CallDuration</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{formatDuration(call.duration)}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Call Type</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.call_type}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Via</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{call.via}</Typography>
      </Box>
    </Grid>
    <Grid gridTemplateColumns="2fr 3fr"
    alignItems="center"
    px={4}
    py={2}>
      <Box>
      <Typography>Call Time</Typography>
      </Box>
      <Box>
      <Typography textAlign={'left'}>{formatDate(call.created_at)}</Typography>
      </Box>
    </Grid>
    <Divider orientation='horizontal'/>
        {call.notes?.map((note: Note, index: number) => {
          return <Box marginLeft='5px' marginTop='5px'>
            <Typography>{`Note ${index + 1}: ${note.content}`}</Typography>
          </Box>
        })}
      </Box>
    </>
  );
};

