import { Badge } from "../ui/badge";

export default function OrderStatusBadge({ status }) {
  if (status === "Delivered") return <Badge variant="success">Delivered</Badge>;
  if (status === "Ready") return <Badge variant="warning">Ready</Badge>;
  if (status === "Baking") return <Badge>Baking</Badge>;
  return <Badge variant="default">Pending</Badge>;
}