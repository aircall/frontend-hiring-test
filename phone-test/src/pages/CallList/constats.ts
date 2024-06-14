type CallTypeOption = { label: string; value: Call["call_type"] | "" };

export const callTypeOptions: CallTypeOption[] = [
  { label: "All Types", value: "" },
  { label: "Missed", value: "missed" },
  { label: "Voicemail", value: "voicemail" },
  { label: "Answered", value: "answered" }
];

type CallDirectionOption = { label: string; value: Call["direction"] | "" };

export const callDirectionOptions: CallDirectionOption[] = [
  { label: "All Directions", value: "" },
  { label: "Incoming", value: "inbound" },
  { label: "Outgoing", value: "outbound" }
];
