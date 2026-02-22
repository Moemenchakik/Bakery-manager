import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Plus } from "lucide-react";
import { Button } from "../ui/button";

function SideLink({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black",
                ].join(" ")
            }
            end
        >
            <Icon size={18} />
            <span>{label}</span>
        </NavLink>
    );
}

export default function AppLayout() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/bakery2.jpg')" }}
        >
            <div className="min-h-screen bg-white/10 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                        {/* Sidebar */}
                        <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-4">
                                <div className="text-lg font-semibold">Bakery Manager</div>
                                <div className="text-xs text-gray-500">Orders & Inventory</div>
                            </div>

                            <nav className="space-y-1">
                                <SideLink to="/" icon={LayoutDashboard} label="Dashboard" />
                                <SideLink to="/products" icon={Package} label="Products" />
                                <SideLink to="/orders" icon={ShoppingBag} label="Orders" />
                            </nav>

                            <div className="mt-6">
                                <Button className="w-full gap-2" onClick={() => navigate("/orders/new")}>
                                    <Plus size={16} /> New Order
                                </Button>
                            </div>
                        </aside>

                        {/* Main */}
                        <main className="space-y-6">
                            {/* Top bar */}
                            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div>
                                    <div className="text-sm text-gray-500">Welcome back</div>
                                    <div className="text-base font-semibold">Manage your bakery easily</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => navigate("/products/new")}>
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}