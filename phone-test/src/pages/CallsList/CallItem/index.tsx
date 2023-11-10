import {
  ArchiveOutlined,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Flex,
  Grid,
  Icon,
  IconButton,
  Tag,
  Tooltip,
  Typography
} from '@aircall/tractor';
import { CallItemProps } from './index.decl';
import { formatDate, formatDuration } from '../../../helpers/dates';

export function CallItem({ call, onOpenDetail, onArchive }: CallItemProps) {
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
      onClick={() => onOpenDetail(call.id)}
      data-test="call-item"
      data-id={call.id}
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
        {call.is_archived ? (
          <Tag.Root variant="red">Archived</Tag.Root>
        ) : (
          <Tooltip
            content={
              <Typography variant="caption" textAlign="right">
                Archive Call
              </Typography>
            }
          >
            <IconButton
              aria-label="Archive Call"
              size={36}
              component={ArchiveOutlined}
              color="red-700"
              discColor="secondary-500"
              onClick={event => {
                event.stopPropagation();

                onArchive(call.id);
              }}
            />
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
}
