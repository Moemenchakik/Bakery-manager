import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const CATEGORIES = ["Bread", "Pastry", "Cake", "Cookies", "Drinks", "Other"];

export default function NewProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Pastry",
    price: "",
    stockQty: "",
    minStockQty: "5",
  });

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!form.category) return "Category is required";

    const price = Number(form.price);
    const stock = Number(form.stockQty);
    const minStock = Number(form.minStockQty);

    if (Number.isNaN(price) || price < 0) return "Price must be a valid number ≥ 0";
    if (!Number.isInteger(stock) || stock < 0) return "Stock must be an integer ≥ 0";
    if (!Number.isInteger(minStock) || minStock < 0) return "Min stock must be an integer ≥ 0";

    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/products", {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stockQty: Number(form.stockQty),
        minStockQty: Number(form.minStockQty),
      });
      navigate("/products");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
        <CardDescription>Create a new bakery item and set its stock.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {err ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                placeholder="e.g. Chocolate Croissant"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-black/20"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="3.50"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQty">Stock quantity</Label>
              <Input
                id="stockQty"
                type="number"
                step="1"
                placeholder="25"
                value={form.stockQty}
                onChange={(e) => setField("stockQty", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockQty">Min stock alert</Label>
              <Input
                id="minStockQty"
                type="number"
                step="1"
                placeholder="5"
                value={form.minStockQty}
                onChange={(e) => setField("minStockQty", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}