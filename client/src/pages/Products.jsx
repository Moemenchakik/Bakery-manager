import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [edit, setEdit] = useState({
    price: "",
    stockQty: "",
    minStockQty: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => Number(p.stockQty) <= Number(p.minStockQty)).length;
  }, [products]);

  function openEdit(product) {
    setErr("");
    setSelected(product);
    setEdit({
      price: String(product.price ?? ""),
      stockQty: String(product.stockQty ?? ""),
      minStockQty: String(product.minStockQty ?? ""),
    });
    setOpen(true);
  }

  function validate() {
    const price = Number(edit.price);
    const stock = Number(edit.stockQty);
    const minStock = Number(edit.minStockQty);

    if (Number.isNaN(price) || price < 0) return "Price must be a valid number ≥ 0";
    if (!Number.isInteger(stock) || stock < 0) return "Stock must be an integer ≥ 0";
    if (!Number.isInteger(minStock) || minStock < 0) return "Min stock must be an integer ≥ 0";
    return "";
  }

  async function saveEdit() {
    if (!selected) return;

    setErr("");
    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/api/products/${selected._id}`, {
        price: Number(edit.price),
        stockQty: Number(edit.stockQty),
        minStockQty: Number(edit.minStockQty),
      });

      setOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage stock and pricing.{" "}
                {lowStockCount > 0 ? (
                  <span className="ml-2">
                    <Badge variant="warning">{lowStockCount} low stock</Badge>
                  </span>
                ) : (
                  <span className="ml-2">
                    <Badge variant="success">All good</Badge>
                  </span>
                )}
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={load} disabled={loading}>
                Refresh
              </Button>
              <Button onClick={() => navigate("/products/new")}>Add Product</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr className="border-b">
                  <th className="py-3 pr-3">Name</th>
                  <th className="py-3 pr-3">Category</th>
                  <th className="py-3 pr-3">Price</th>
                  <th className="py-3 pr-3">Stock</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={6}>
                      No products yet. Add your first product.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const low = Number(p.stockQty) <= Number(p.minStockQty);
                    return (
                      <tr key={p._id} className="border-b last:border-b-0">
                        <td className="py-3 pr-3 font-medium">{p.name}</td>
                        <td className="py-3 pr-3 text-gray-600">{p.category}</td>
                        <td className="py-3 pr-3">${Number(p.price).toFixed(2)}</td>
                        <td className="py-3 pr-3">{p.stockQty}</td>
                        <td className="py-3 pr-3">
                          {low ? <Badge variant="danger">Low stock</Badge> : <Badge>OK</Badge>}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          {selected ? (
            <div className="mt-1 text-sm text-gray-500">{selected.name} • {selected.category}</div>
          ) : null}
        </DialogHeader>

        <DialogContent className="space-y-4">
          {err ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={edit.price}
                onChange={(e) => setEdit((s) => ({ ...s, price: e.target.value }))}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Stock quantity</Label>
              <Input
                type="number"
                step="1"
                value={edit.stockQty}
                onChange={(e) => setEdit((s) => ({ ...s, stockQty: e.target.value }))}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Min stock alert</Label>
              <Input
                type="number"
                step="1"
                value={edit.minStockQty}
                onChange={(e) => setEdit((s) => ({ ...s, minStockQty: e.target.value }))}
                disabled={saving}
              />
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={saveEdit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}