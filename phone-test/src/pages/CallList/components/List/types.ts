export interface ListProps {
  calls: Call[];
  onItemClick: (id: string) => void;
  onArchive: (id: string) => void;
}
