export interface ListItemProps {
  call: Call;
  onItemClick: (id: string) => void;
  onArchive: (id: string) => void;
}
