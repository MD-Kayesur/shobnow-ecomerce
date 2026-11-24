// src/components/AdminDashboard/Dashboard/AdminDashboard.tsx
import {
  AlertCircle,
  ArrowUpRight,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Settings,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { MOCK_PRODUCTS } from "@/data/data";

const RECENT_ORDERS_PREVIEW = [
  {
    id: "SN-98241",
    customer: "Ayesha Rahman",
    items: "Cosrx Snail Essence + 1 more",
    total: 4550,
    status: "Pending",
    time: "Today, 11:20 AM",
  },
  {
    id: "SN-98240",
    customer: "Farhana Islam",
    items: "Anua Heartleaf Toner + 1 more",
    total: 3200,
    status: "Processing",
    time: "Today, 09:45 AM",
  },
  {
    id: "SN-98239",
    customer: "Tasnim Chowdhury",
    items: "Laneige Lip Sleeping Mask",
    total: 3000,
    status: "Shipped",
    time: "Yesterday, 04:15 PM",
  },
  {
    id: "SN-98238",
    customer: "Nusrat Jahan",
    items: "Celimax Noni Energy Ampoule",
    total: 2150,
    status: "Delivered",
    time: "Nov 08, 2026",
  },
];

const AdminDashboard = () => {
  // Low stock products preview from mock products
  const lowStockPreview = MOCK_PRODUCTS.filter((p) => p.stockQuantity <= 5).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Store Overview & Control Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time sales, order processing status, and inventory insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Metric Cards */}
      <DashboardCard />

      {/* Quick Navigation Cards: 5 Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          to="/admin-dashboard/products"
          className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              Products / Inventory
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Manage stock & prices</p>
          </div>
        </Link>

        <Link
          to="/admin-dashboard/orders"
          className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              Orders Management
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Fulfillment & Invoices</p>
          </div>
        </Link>

        <Link
          to="/admin-dashboard/customers"
          className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              Customers
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Accounts & Loyalty</p>
          </div>
        </Link>

        <Link
          to="/admin-dashboard/categories"
          className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              Categories & Brands
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">12 Categories & Partners</p>
          </div>
        </Link>

        <Link
          to="/admin-dashboard/settings"
          className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              Store Settings
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Shipping, fees & themes</p>
          </div>
        </Link>
      </div>

      {/* Grid: Recent Orders & Low Stock Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders Preview */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-gray-900 ">
                Recent Customer Orders
              </h2>
            </div>
            <Link
              to="/admin-dashboard/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 ">
            {RECENT_ORDERS_PREVIEW.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>#{order.id}</span>
                    <span className="text-xs text-gray-400 font-normal">• {order.customer}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900 ">
                    ৳{order.total.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600"
                        : order.status === "Shipped"
                        ? "bg-blue-50 text-blue-600"
                        : order.status === "Processing"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts Preview */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900 ">
                Low Stock & Restock Warnings
              </h2>
            </div>
            <Link
              to="/admin-dashboard/products"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Manage Inventory &rarr;
            </Link>
          </div>

          <div className="divide-y divide-gray-100 ">
            {lowStockPreview.map((prod) => (
              <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0"
                  />
                  <div className="min-w-0 truncate">
                    <p className="font-semibold text-gray-900 truncate">
                      {prod.name}
                    </p>
                    <p className="text-xs text-gray-400">{prod.brand} • ৳{prod.price.toLocaleString()}</p>
                  </div>
                </div>

                <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                  {prod.stockQuantity} in stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operations Notice Card */}
      <div className="w-full rounded-2xl p-5 bg-primary-light/60 border border-primary/20 space-y-2">
        <h2 className="text-primary font-semibold text-base sm:text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          Daily Order & Fulfillment Notice
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          Pending orders received before 2:00 PM must be packed and assigned for courier delivery today.
          Stock updates made in the inventory manager immediately synchronize with the customer storefront.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <Link
            to="/admin-dashboard/settings"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Configure Store Defaults & Shipping Policies &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
