import { Card, CardContent } from "../ui/card";

export default function StatCard({ label, value, hint }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold">{value}</div>
        {hint ? <div className="mt-2 text-xs text-gray-500">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}