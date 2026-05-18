interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium
        
        ${
          status === "Approved" ||
          status === "Active"
            ? "bg-green-50 text-green-600"
            : status === "Pending"
            ? "bg-yellow-50 text-yellow-600"
            : status === "Processing"
            ? "bg-blue-50 text-blue-600"
            : "bg-red-50 text-red-600"
        }
      `}
    >
      {status}
    </span>
  );
}