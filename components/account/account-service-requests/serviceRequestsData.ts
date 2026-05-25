export type ServiceRequestTypeId =
  | "cancel-order"
  | "repair"
  | "installation"
  | "product-return"
  | "buy"
  | "extend-tenure"
  | "change-bill-cycle"
  | "relocation"
  | "transfer-subscription"
  | "others";

export type ServiceRequestType = {
  id: ServiceRequestTypeId;
  label: string;
  icon: string;
};

export const SERVICE_REQUEST_TYPES: ServiceRequestType[] = [
  { id: "cancel-order", label: "Cancel Order", icon: "icon-X2" },
  { id: "repair", label: "Repair", icon: "icon-GearSix" },
  { id: "installation", label: "Installation", icon: "icon-PuzzlePiece" },
  { id: "product-return", label: "Product Return", icon: "icon-ArrowUDownLeft" },
  { id: "buy", label: "Buy", icon: "icon-Handbag" },
  { id: "extend-tenure", label: "Extend Tenure", icon: "icon-HourglassMedium" },
  { id: "change-bill-cycle", label: "Change Bill Cycle", icon: "icon-GitDiff" },
  { id: "relocation", label: "Relocation", icon: "icon-Truck" },
  {
    id: "transfer-subscription",
    label: "Transfer Subscription",
    icon: "icon-ArrowsLeftRight",
  },
  { id: "others", label: "Others", icon: "icon-ListDashes" },
];

export type ServiceRequestStatus =
  | "in_progress"
  | "scheduled"
  | "pending"
  | "completed";

export type OngoingServiceRequest = {
  id: string;
  typeLabel: string;
  ticketId: string;
  status: ServiceRequestStatus;
  statusLabel: string;
  updateMessage: string;
  updatedAt: string;
};

export const MOCK_ONGOING_SERVICE_REQUESTS: OngoingServiceRequest[] = [
  {
    id: "sr-1",
    typeLabel: "Product Return",
    ticketId: "1054551",
    status: "in_progress",
    statusLabel: "In Progress",
    updateMessage:
      "Pickup will be scheduled within 48–72 hours. Our team will get in touch before arrival.",
    updatedAt: "02 Jan, 2026",
  },
  {
    id: "sr-2",
    typeLabel: "Repair",
    ticketId: "1054489",
    status: "scheduled",
    statusLabel: "Scheduled",
    updateMessage:
      "Technician visit confirmed for 08 Jan, 2026 between 10:00 AM – 1:00 PM.",
    updatedAt: "28 Dec, 2025",
  },
  {
    id: "sr-3",
    typeLabel: "Relocation",
    ticketId: "1054312",
    status: "pending",
    statusLabel: "Pending",
    updateMessage:
      "We have received your request. A support agent will call you within 24 hours.",
    updatedAt: "30 Dec, 2025",
  },
];

export function getServiceRequestStatusClass(
  status: ServiceRequestStatus,
): string {
  switch (status) {
    case "in_progress":
      return "account-service-requests__status--in-progress";
    case "scheduled":
      return "account-service-requests__status--scheduled";
    case "pending":
      return "account-service-requests__status--pending";
    case "completed":
      return "account-service-requests__status--completed";
    default:
      return "";
  }
}
