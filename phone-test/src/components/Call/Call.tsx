import { ArchiveFilled, Box, DiagonalDownOutlined, DiagonalUpOutlined, Flex, Grid, Icon, IconButton, Spacer, Tag, Tooltip, Typography } from "@aircall/tractor";
import { formatDate, formatDuration } from '../../helpers/dates';

interface CallComponentProps {
  calls: Array<Call>;
  handleCallOnClick: (id: Call['id']) => void;
  handleArchiveCall: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: Call['id']) => void;
}

const CallComponent = ({ calls, handleCallOnClick, handleArchiveCall }: CallComponentProps): JSX.Element => {
  return (
    <Spacer space={3} direction="vertical">
      {calls.map((call: Call) => {
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
              <Box>
                <Typography variant="caption" textAlign="right">
                  {duration}
                </Typography>
                <Typography variant="caption">{date}</Typography>
              </Box>
            </Grid>
            <Flex px={4} py={2} justifyContent="space-between" alignItems="center">
              <Typography variant="caption">{notes}</Typography>
              {call.is_archived ? <Tag.Root cursor="pointer" size="small" variant="primary"> Archived </Tag.Root> : 
              <Tooltip title="Archive the call" side="right" mouseEnterDelay={20} mouseLeaveDelay={100}>
                <IconButton size={24} color="primary-500" component={ArchiveFilled} onClick={(e) => handleArchiveCall(e, call.id)}/>
              </Tooltip>
              }
            </Flex>
          </Box>
        );
      })}
    </Spacer>
  )
}

export default CallComponent;