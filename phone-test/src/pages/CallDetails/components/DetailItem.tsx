interface DetailItemProps {
  label: string;
  value: string;
}

export const DetailItem = ({ label, value }: DetailItemProps) => <div>{`${label}: ${value}`}</div>;
