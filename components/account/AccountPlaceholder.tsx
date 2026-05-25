type AccountPlaceholderProps = {
  message?: string;
};

export default function AccountPlaceholder({
  message = "This section is coming soon.",
}: AccountPlaceholderProps) {
  return <p className="cl-text-2 py-3">{message}</p>;
}
