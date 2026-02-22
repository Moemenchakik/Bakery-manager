import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, Trash2 } from "lucide-react";
import { api } from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import IconButton from "../components/common/IconButton";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function NewOrder() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [query, setQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  // cart: { [productId]: { product, qty } }
  const [cart, setCart] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return name.includes(q) || cat.includes(q);
    });
  }, [products, query]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.product.price) * Number(item.qty), 0);
  }, [cartItems]);

  function addToCart(product) {
    setErr("");
    setCart((prev) => {
      const existing = prev[product._id];
      const nextQty = (existing?.qty || 0) + 1;

      // Don’t exceed stock (nice UX; backend will also validate)
      if (nextQty > Number(product.stockQty)) return prev;

      return {
        ...prev,
        [product._id]: { product, qty: nextQty },
      };
    });
  }

  function inc(productId) {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      const max = Number(item.product.stockQty);
      const nextQty = Math.min(item.qty + 1, max);
      return { ...prev, [productId]: { ...item, qty: nextQty } };
    });
  }

  function dec(productId) {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      const nextQty = item.qty - 1;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: { ...item, qty: nextQty } };
    });
  }

  function remove(productId) {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  }

  function clearCart() {
    setCart({});
  }

  function validate() {
    if (!customerName.trim()) return "Customer name is required";
    if (cartItems.length === 0) return "Add at least 1 item to the order";
    return "";
  }

  async function submitOrder() {
    setErr("");
    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim() || undefined,
        items: cartItems.map((it) => ({
          productId: it.product._id,
          qty: it.qty,
        })),
      };

      const res = await api.post("/api/orders", payload);

      // After creating order:
      // - go to order details
      // - products stock will already be decremented in DB
      navigate(`/orders/${res.data._id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      {/* LEFT: Products */}
      <Card>
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
          <CardDescription>Search products and build the customer’s cart.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              className="w-full text-sm outline-none"
              placeholder="Search by name or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loadingProducts ? (
            <div className="text-sm text-gray-500">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No products match your search.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((p) => {
                const low = Number(p.stockQty) <= Number(p.minStockQty);
                const out = Number(p.stockQty) === 0;

                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={out}
                    className="text-left rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.category}</div>
                      </div>
                      <div className="text-sm font-semibold">{money(p.price)}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        Stock: <span className="font-medium">{p.stockQty}</span>
                      </div>
                      <div className="flex gap-2">
                        {out ? (
                          <Badge variant="danger">Out</Badge>
                        ) : low ? (
                          <Badge variant="warning">Low</Badge>
                        ) : (
                          <Badge>OK</Badge>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Plus size={14} /> Add
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RIGHT: Cart */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Cart</CardTitle>
              <CardDescription>Customer info + order summary.</CardDescription>
            </div>
            <Button variant="outline" onClick={clearCart} disabled={cartItems.length === 0 || saving}>
              Clear
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {err ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Customer name</Label>
              <Input
                placeholder="e.g. Moumen"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone (optional)</Label>
              <Input
                placeholder="e.g. 71123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Items</div>
              <div className="text-sm text-gray-600">Total: <span className="font-semibold">{money(total)}</span></div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-sm text-gray-500">No items yet. Click a product to add it.</div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(({ product, qty }) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {money(product.price)} • Stock {product.stockQty}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IconButton onClick={() => dec(product._id)} disabled={saving}>
                        <Minus size={16} />
                      </IconButton>

                      <div className="w-10 text-center text-sm font-semibold">{qty}</div>

                      <IconButton
                        onClick={() => inc(product._id)}
                        disabled={saving || qty >= Number(product.stockQty)}
                      >
                        <Plus size={16} />
                      </IconButton>

                      <IconButton onClick={() => remove(product._id)} disabled={saving} className="ml-1">
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => navigate("/orders")} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submitOrder} disabled={saving}>
              {saving ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}