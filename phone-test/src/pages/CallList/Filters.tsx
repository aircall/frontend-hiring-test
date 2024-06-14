import { Button, Grid, Select } from "@aircall/tractor";
import { callDirectionOptions, callTypeOptions } from "./constants";
import { useCallback } from "react";

export default function Filters({
  filter,
  setFilter
}: {
  filter: { call_type: string; direction: string };
  setFilter: (filter: { call_type: string; direction: string }) => void;
}) {
  const handleSelectionChange = useCallback(
    (key: keyof typeof filter, value: string) => {
      setFilter({ ...filter, [key]: value });
    },
    [filter, setFilter]
  );

  const handleReset = useCallback(() => {
    setFilter({ call_type: "", direction: "" });
  }, [setFilter]);
  return (
    <Grid columnGap={4} gridTemplateColumns="1fr 1fr auto">
      <Select
        size="small"
        options={callTypeOptions}
        selectedKeys={[filter.call_type]}
        onSelectionChange={([val]) => handleSelectionChange("call_type", val)}
      />
      <Select
        size="small"
        options={callDirectionOptions}
        selectedKeys={[filter.direction]}
        onSelectionChange={([val]) => handleSelectionChange("direction", val)}
      />
      <div>
        <Button mode="link" variant="destructive" size="small" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </Grid>
  );
}
