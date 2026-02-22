import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select } from "../components/ui/select";
import OrderStatusBadge from "../components/common/OrderStatusBadge";

const STATUSES = ["Pending", "Baking", "Ready", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const subtotal = useMemo(() => {
    if (!order) return 0;
    return (order.items || []).reduce(
      (sum, it) => sum + Number(it.priceSnapshot || 0) * Number(it.qty || 0),
      0
    );
  }, [order]);

  async function updateStatus(newStatus) {
    if (!order) return;
    setSaving(true);
    setErr("");
    try {
      const res = await api.patch(`/api/orders/${order._id}/status`, {
        status: newStatus,
      });
      setOrder(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>View items and manage order status.</CardDescription>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Back
            </Button>
            <Button variant="outline" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {err ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : !order ? (
          <div className="text-gray-500">Order not found.</div>
        ) : (
          <div className="space-y-6">
            {/* Top info */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500">Customer</div>
                <div className="mt-1 text-lg font-semibold">{order.customerName}</div>
                {order.phone ? <div className="text-sm text-gray-600">{order.phone}</div> : null}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-2">
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="mt-3">
                  <Select
                    value={order.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    disabled={saving}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <div className="mt-1 text-xs text-gray-500">
                    {saving ? "Saving..." : "Change status to update workflow"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500">Created</div>
                <div className="mt-1 text-sm text-gray-700">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="mt-3 text-xs text-gray-500">Order ID</div>
                <div className="text-xs font-mono text-gray-700 break-all">{order._id}</div>
              </div>
            </div>

            {/* Items table */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold">Items</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr className="border-b">
                      <th className="py-3 pr-3">Product</th>
                      <th className="py-3 pr-3">Price</th>
                      <th className="py-3 pr-3">Qty</th>
                      <th className="py-3 pr-3">Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-3 pr-3 font-medium">{it.nameSnapshot}</td>
                        <td className="py-3 pr-3">${Number(it.priceSnapshot || 0).toFixed(2)}</td>
                        <td className="py-3 pr-3">{it.qty}</td>
                        <td className="py-3 pr-3">
                          ${(Number(it.priceSnapshot || 0) * Number(it.qty || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${Number(order.total || subtotal).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}