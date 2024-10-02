import { toast } from "sonner";

const currentDateTime = new Date();
const options = {
  weekday: "long" as const,
  year: "numeric" as const,
  month: "long" as const,
  day: "numeric" as const,
  hour: "numeric" as const,
  minute: "numeric" as const,
  hour12: true,
};

const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
  currentDateTime
);

export default function aplyToast(message: string) {
  toast(message, {
    description: formattedDateTime,
    action: {
      label: "Close",
      onClick: () => null,
    },
  });
  return;
}
