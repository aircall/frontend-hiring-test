import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatDuration = (seconds: number) => {
  const d = dayjs.duration(seconds * 1000);
  // Basic formatting matching previous logic: HH:mm:ss if > 1h, else mm:ss
  return seconds >= 3600 
    ? d.format('HH:mm:ss') 
    : d.format('mm:ss');
};

export const formatDate = (date: string) => {
  return dayjs(date).format('MMM D - HH:mm');
};
