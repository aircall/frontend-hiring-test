import { Box, Button, DiagonalDownOutlined, DiagonalUpOutlined, Flex, Grid, Icon, Typography, Spacer } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { useNavigate } from 'react-router';
import {  useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ARCHIVE_CALL } from '../../gql/mutations/archiveCall';

type TCalls = {
    calls: Call[],
    archivedButtonActive: boolean;
}

const CallListDisplay = ({ calls, archivedButtonActive }: TCalls) => {
    const navigate = useNavigate();
    const [archiveCallMutation] = useMutation(ARCHIVE_CALL);

    const handleCallOnClick = (callId: string) => {
        navigate(`/calls/${callId}`);
    };

    const handleArchiveCall = (callId: string, e: any) => {
        e.stopPropagation();
        return archiveCallMutation({
            variables: { id: callId },
        })

    }

    return (<Spacer space={3} direction="vertical">
        {calls.filter((call: Call) => archivedButtonActive ? call.is_archived : !call.is_archived).map((call: Call) => {
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
            const isArchived = call.is_archived;

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
                        <Box>
                            <Typography variant="caption" textAlign="right">
                                {duration}
                            </Typography>
                            <Typography variant="caption">{date}</Typography>
                        </Box>
                    </Grid>
                    <Box px={4} py={2}>
                        <Flex justifyContent="space-between">
                            <Typography variant="caption">{notes}</Typography>
                            <Button onClick={(e: any) => handleArchiveCall(call.id, e)} size='xSmall'>{isArchived ? "Unarchive" : "Archive"}</Button>
                        </Flex>
                    </Box>
                </Box>
            );
        })}
    </Spacer>)
}

export default CallListDisplay;