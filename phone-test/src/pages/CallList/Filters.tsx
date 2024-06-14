import { Button, Grid, Select } from "@aircall/tractor";

export default function Filters({
  filter,
  setFilter
}: {
  filter: { call_type: string; direction: string };
  setFilter: (filter: { call_type: string; direction: string }) => void;
}) {
  return (
    <Grid columnGap={3} rowGap={3} gridTemplateColumns="1fr 1fr 1fr" mb={6}>
      <Select
        options={[
          { label: "All Types", value: "" },
          { label: "Missed", value: "missed" },
          { label: "Voicemail", value: "voicemail" },
          { label: "Answered", value: "answered" }
        ]}
        selectedKeys={[filter.call_type]}
        onSelectionChange={([val]) => setFilter({ ...filter, call_type: val })}
        style={{ padding: "0.5rem" }}
      />
      <Select
        options={[
          { label: "All Directions", value: "" },
          { label: "Incoming", value: "inbound" },
          { label: "Outgoing", value: "outbound" }
        ]}
        selectedKeys={[filter.direction]}
        onSelectionChange={([val]) => setFilter({ ...filter, direction: val })}
        style={{ padding: "0.5rem" }}
      />
      <Button
        mode="link"
        variant="destructive"
        onClick={() => setFilter({ call_type: "", direction: "" })}
      >
        Reset Filters
      </Button>
    </Grid>
  );
}
