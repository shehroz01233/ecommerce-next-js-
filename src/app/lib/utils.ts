export function statusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-indigo-100 text-indigo-800";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}
