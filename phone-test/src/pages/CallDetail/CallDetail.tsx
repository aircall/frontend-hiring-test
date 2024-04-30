import React, { useRef } from 'react';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Tooltip,
  ArchiveFilled,
  ArchiveOutlined,
  IconButton,
  Button,
  SpinnerOutlined,
  useToast
} from '@aircall/tractor';
// import { ARCHIVE_CALL } from '../gql/mutations';
// import { ARCHIVE_CALL } from '../../gql/mutations/archiveCall';
import { ARCHIVE_CALL } from '../../gql/mutations';

import { useMutation, useQuery } from '@apollo/client';

import { formatDate, formatDuration } from '../../helpers/dates';

import { CallDetailProps } from './CallDetail.decl';


export const CallDetail: React.FC<CallDetailProps> = ({ call, onClick }) => {
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

  const { showToast, removeToast } = useToast();
  const [archiveMutation] = useMutation(ARCHIVE_CALL);

  let archivingCallId = useRef<string | undefined>();
  const ARCHIVE_OPERATION = 'ARCHIVE_OPERATION';

  const handleArchiveCall = (call: Call) => {
    const { id } = call;
  
    removeToast(ARCHIVE_OPERATION);
    archivingCallId.current = id;
  
    archiveMutation({
      variables: {
        id
      },
      onCompleted: ({ archiveCall }) => {
        archivingCallId.current = undefined;
        showToast({
          id: ARCHIVE_OPERATION,
          message: archiveCall.is_archived ? 'Call archived' : 'Call unarchived',
          variant: 'success'
        });
      },
      onError: () => {
        archivingCallId.current = undefined;
        showToast({
          id: ARCHIVE_OPERATION,
          message: 'Error while archiving call',
          variant: 'error'
        });
      }
    });
  };
  

  return (
    <Spacer space={3} direction="vertical" fluid data-testid={`call-card`}>
      <Box
        minWidth="1"
        key={call.id}
        bg="black-a30"
        borderRadius={16}
        cursor="pointer"
        onClick={() => onClick(call.id)}
        margin={1}
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
          <Box>
            <Typography variant="caption" textAlign="right">
              {duration}
            </Typography>
            <Typography variant="caption">{date}</Typography>
          </Box>
          <Spacer space="s">
            <Tooltip title={call.is_archived ? 'Unarchive call' : 'Archive call'}>
              {archivingCallId.current === call.id ? (
                <Icon key={call.id} component={SpinnerOutlined} spin />
              ) : (
                // <>
                <IconButton
                  key={call.id}
                  size={24}
                  component={call.is_archived ? ArchiveFilled : ArchiveOutlined}
                  color="#01B288"
                  onClick={e => {
                    e.stopPropagation();
                    handleArchiveCall(call);
                    // console.log('archiving');
                  }}
                />
                // Archive Call
                // </>
                // <Button
                //   style={{
                //     color: 'black'
                //   }}
                //   mode="link"
                //   size="small"
                //   onClick={e => {
                //     e.stopPropagation();
                //     console.log('archive and dearchive');
                //   }}
                // >
                //          <IconButton
                //   key={call.id}
                //   size={24}
                //   component={call.is_archived ? ArchiveFilled : ArchiveOutlined}
                //   color="#01B288"
                //   onClick={e => {
                //     e.stopPropagation();
                //     // handleArchiveCall(call);
                //     console.log('archiving');
                //   }}
                // />
                //   {call.is_archived ? 'Unarchive call' : 'Archive call'}
                // </Button>
              )}
            </Tooltip>
          </Spacer>
        </Grid>
        <Box px={4} py={2}>
          <Typography variant="caption">{notes}</Typography>
        </Box>
      </Box>
    </Spacer>
  );
};
