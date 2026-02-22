import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs } from "../components/ui/tabs";
import OrderStatusBadge from "../components/common/OrderStatusBadge";

const STATUS_TABS = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Baking", label: "Baking" },
  { value: "Ready", label: "Ready" },
  { value: "Delivered", label: "Delivered" },
];

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/orders");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (tab === "All") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "Pending").length;
    const baking = orders.filter((o) => o.status === "Baking").length;
    const ready = orders.filter((o) => o.status === "Ready").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { pending, baking, ready, delivered, revenue };
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Track customer orders and manage production workflow.
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={() => navigate("/orders/new")}>New Order</Button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="mt-1 text-2xl font-semibold">{stats.pending}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Baking</div>
            <div className="mt-1 text-2xl font-semibold">{stats.baking}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Ready</div>
            <div className="mt-1 text-2xl font-semibold">{stats.ready}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Total revenue</div>
            <div className="mt-1 text-2xl font-semibold">${stats.revenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4">
          <Tabs value={tab} onValueChange={setTab} tabs={STATUS_TABS} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr className="border-b">
                <th className="py-3 pr-3">Customer</th>
                <th className="py-3 pr-3">Items</th>
                <th className="py-3 pr-3">Total</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={5}>
                    No orders found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    <td className="py-3 pr-3 font-medium">{o.customerName}</td>
                    <td className="py-3 pr-3 text-gray-600">{o.items?.length || 0}</td>
                    <td className="py-3 pr-3">${Number(o.total || 0).toFixed(2)}</td>
                    <td className="py-3 pr-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="py-3 pr-3 text-gray-600">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}