// src/pages/Admin/OrdersPage.tsx
import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Download,
} from "lucide-react";

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: "SSLCommerz" | "Cash on Delivery" | "bKash";
  paymentStatus: "Paid" | "Pending" | "Failed";
  fulfillmentStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "SN-98241",
    customerName: "Ayesha Rahman",
    customerEmail: "ayesha.r@gmail.com",
    customerPhone: "+880 1712-345678",
    city: "Dhaka (Dhanmondi)",
    items: [
      { name: "Cosrx Advanced Snail 96 Mucin Essence", qty: 1, price: 1650 },
      { name: "Beauty of Joseon Relief Sun Rice + Probiotics", qty: 2, price: 1450 },
    ],
    totalAmount: 4550,
    paymentMethod: "SSLCommerz",
    paymentStatus: "Paid",
    fulfillmentStatus: "Pending",
    createdAt: "Today, 11:20 AM",
  },
  {
    id: "SN-98240",
    customerName: "Farhana Islam",
    customerEmail: "farhana.isl@outlook.com",
    customerPhone: "+880 1819-876543",
    city: "Chittagong (Nasirabad)",
    items: [
      { name: "Anua Heartleaf 77% Soothing Toner", qty: 1, price: 1850 },
      { name: "Axis-Y Dark Spot Correcting Glow Serum", qty: 1, price: 1350 },
    ],
    totalAmount: 3200,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    createdAt: "Today, 09:45 AM",
  },
  {
    id: "SN-98239",
    customerName: "Tasnim Chowdhury",
    customerEmail: "tasnim.chy@gmail.com",
    customerPhone: "+880 1678-112233",
    city: "Dhaka (Gulshan 2)",
    items: [
      { name: "Laneige Lip Sleeping Mask (Berry)", qty: 2, price: 950 },
      { name: "Rom&nd Juicy Lasting Tint #23", qty: 1, price: 1100 },
    ],
    totalAmount: 3000,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    fulfillmentStatus: "Shipped",
    createdAt: "Yesterday, 04:15 PM",
  },
  {
    id: "SN-98238",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat.jahan@yahoo.com",
    customerPhone: "+880 1911-445566",
    city: "Sylhet (Zindabazar)",
    items: [
      { name: "Celimax The Real Noni Energy Ampoule", qty: 1, price: 2150 },
    ],
    totalAmount: 2150,
    paymentMethod: "SSLCommerz",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    createdAt: "Nov 08, 2026",
  },
  {
    id: "SN-98237",
    customerName: "Sabrina Hossain",
    customerEmail: "sabrina.h@gmail.com",
    customerPhone: "+880 1722-998877",
    city: "Dhaka (Uttara Sector 7)",
    items: [
      { name: "Dabo Collagen Lifting Cream", qty: 1, price: 1250 },
    ],
    totalAmount: 1250,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    fulfillmentStatus: "Cancelled",
    createdAt: "Nov 07, 2026",
  },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm) ||
        order.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.fulfillmentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Update order fulfillment status
  const handleUpdateStatus = (
    orderId: string,
    newStatus: AdminOrder["fulfillmentStatus"]
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, fulfillmentStatus: newStatus } : null));
    }
  };

  // KPI summaries
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.fulfillmentStatus === "Pending").length;
  const processingCount = orders.filter((o) => o.fulfillmentStatus === "Processing").length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === "Delivered").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-primary" />
            Orders Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track customer orders, courier fulfillment, payments, and dispatch invoices.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting all orders to CSV...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#141A24] text-gray-700 dark:text-gray-200 hover:text-primary hover:border-primary/50 text-sm font-semibold shadow-xs cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total Revenue (Paid)</span>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Dispatch
          </span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {pendingCount}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Processing / Courier
          </span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {processingCount}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {deliveredCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-white"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-semibold">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-primary text-white shadow-xs font-bold"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    #{order.id}
                  </td>

                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customerPhone} • {order.city}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                    {order.createdAt}
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    ৳{order.totalAmount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold w-fit ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.fulfillmentStatus}
                      onChange={(e) =>
                        handleUpdateStatus(
                          order.id,
                          e.target.value as AdminOrder["fulfillmentStatus"]
                        )
                      }
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                        order.fulfillmentStatus === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.fulfillmentStatus === "Shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.fulfillmentStatus === "Processing"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : order.fulfillmentStatus === "Cancelled"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-primary">Invoice Details</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Delivery City:</strong> {selectedOrder.city}</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-2">Ordered Items:</p>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <span>{item.qty}x {item.name}</span>
                      <span className="font-bold">৳{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-primary text-base">৳{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

