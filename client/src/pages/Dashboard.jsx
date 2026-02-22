import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import StatCard from "../components/common/StatCard";
import OrderStatusBadge from "../components/common/OrderStatusBadge";

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([api.get("/api/products"), api.get("/api/orders")]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();

    const lowStock = products.filter((p) => Number(p.stockQty) <= Number(p.minStockQty)).length;

    const todayOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return isSameDay(created, now);
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const pending = orders.filter((o) => o.status === "Pending").length;

    return {
      lowStock,
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      pending,
      recent: orders.slice(0, 6),
    };
  }, [products, orders]);

  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="text-sm text-gray-500">Overview of today’s activity.</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/orders/new")}>New Order</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today’s orders"
          value={loading ? "…" : stats.todayOrdersCount}
          hint="Orders created today"
        />
        <StatCard
          label="Pending orders"
          value={loading ? "…" : stats.pending}
          hint="Need action"
        />
        <StatCard
          label="Low stock items"
          value={loading ? "…" : stats.lowStock}
          hint="Below min stock"
        />
        <StatCard
          label="Today’s revenue"
          value={loading ? "…" : `$${stats.todayRevenue.toFixed(2)}`}
          hint="From today’s orders"
        />
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>Last 6 orders created.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              View all
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : stats.recent.length === 0 ? (
            <div className="text-sm text-gray-500">
              No orders yet. Create your first one.
              <span className="ml-2">
                <Button size="sm" onClick={() => navigate("/orders/new")}>
                  Create Order
                </Button>
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr className="border-b">
                    <th className="py-3 pr-3">Customer</th>
                    <th className="py-3 pr-3">Items</th>
                    <th className="py-3 pr-3">Total</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((o) => (
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
                  ))}
                </tbody>
              </table>

              {/* Low stock quick link */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="text-sm">
                  {stats.lowStock > 0 ? (
                    <span className="flex items-center gap-2">
                      <Badge variant="warning">{stats.lowStock} low stock</Badge>
                      <span className="text-gray-700">Check products and restock.</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Badge variant="success">All stocked</Badge>
                      <span className="text-gray-700">No low stock items right now.</span>
                    </span>
                  )}
                </div>
                <Button variant="outline" onClick={() => navigate("/products")}>
                  Products
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}