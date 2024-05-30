import { Select } from '@aircall/tractor';

interface FilterProps {
  filter: string;
  onChangeFilter: (value: string) => void;
  options: { value: string; label: string }[];
}

export const Filter = ({ filter, onChangeFilter, options }: FilterProps) => {
  return (
    <Select
      selectionMode="single"
      size="small"
      selectedKeys={[filter]}
      options={options}
      onSelectionChange={selectedKeys => {
        if (selectedKeys.length === 0) return;
        onChangeFilter(selectedKeys[0]);
      }}
    />
  );
};
