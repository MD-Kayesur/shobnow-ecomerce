// src/UserDashboard/pages/UserOrdersPage.tsx
import { useState } from "react";
import {
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface UserOrder {
  id: string;
  date: string;
  courier: string;
  trackingCode: string;
  status: "Out for Delivery" | "Processing" | "Delivered" | "Cancelled";
  step: number; // 1 to 4
  estimatedDelivery: string;
  riderName?: string;
  riderPhone?: string;
  shippingAddress: string;
  items: {
    name: string;
    brand: string;
    volume: string;
    price: number;
    qty: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending COD";
}

const USER_ORDERS_DATA: UserOrder[] = [
  {
    id: "SN-98241",
    date: "Nov 14, 2026",
    courier: "Pathao Express",
    trackingCode: "PTH-82914-BD",
    status: "Out for Delivery",
    step: 3,
    estimatedDelivery: "Today, between 2:00 PM – 4:30 PM",
    riderName: "Md. Shakil Hasan",
    riderPhone: "+880 1711-234567",
    shippingAddress: "House 42, Road 27, Dhanmondi R/A, Dhaka 1209",
    items: [
      {
        name: "Advanced Snail 96 Mucin Power Essence",
        brand: "COSRX",
        volume: "100ml",
        price: 1650,
        qty: 1,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Relief Sun: Rice + Probiotics SPF50+ PA++++",
        brand: "Beauty of Joseon",
        volume: "50ml",
        price: 1450,
        qty: 2,
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
      },
    ],
    subtotal: 4550,
    shippingFee: 0, // Free delivery for VIP
    total: 4550,
    paymentMethod: "SSLCommerz (bKash Gateway)",
    paymentStatus: "Paid",
  },
  {
    id: "SN-98104",
    date: "Nov 10, 2026",
    courier: "Steadfast Courier",
    trackingCode: "STF-44109-BD",
    status: "Processing",
    step: 2,
    estimatedDelivery: "Tomorrow, Nov 15, 2026",
    shippingAddress: "House 42, Road 27, Dhanmondi R/A, Dhaka 1209",
    items: [
      {
        name: "Heartleaf 77% Soothing Toner",
        brand: "Anua",
        volume: "250ml",
        price: 1850,
        qty: 1,
        image: "https://images.unsplash.com/photo-1608248597359-598466e3b5e4?auto=format&fit=crop&w=400&q=80",
      },
    ],
    subtotal: 1850,
    shippingFee: 60,
    total: 1910,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending COD",
  },
];

const UserOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "delivered">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>("SN-98241");

  const filteredOrders = USER_ORDERS_DATA.filter((order) => {
    if (activeTab === "active") return order.status !== "Delivered" && order.status !== "Cancelled";
    if (activeTab === "delivered") return order.status === "Delivered";
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-primary" />
            My Orders & Order Tracking
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time delivery progress, Pathao logistics tracking, and itemized receipts.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
            }`}
          >
            All ({USER_ORDERS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
            }`}
          >
            Active (2)
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "delivered"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Order Header Summary Bar */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                      Order #{order.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-100 text-primary dark:bg-pink-950/60 dark:text-pink-300">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Placed on {order.date} • {order.items.length} product(s)
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Total Amount</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    className="p-2 rounded-xl text-gray-400 hover:text-primary transition-colors"
                    aria-label="Expand order details"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Expanded Details */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-900/20 space-y-6">
                  {/* Stepper Progress */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#111620] border border-gray-200/60 dark:border-gray-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>Delivery Progress</span>
                      <span className="text-primary font-bold">{order.estimatedDelivery}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                      <div className="space-y-1">
                        <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-200 block text-[11px]">Placed</span>
                      </div>

                      <div className="space-y-1">
                        <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-200 block text-[11px]">Quality Check</span>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-7 h-7 mx-auto rounded-full ${order.step >= 3 ? "bg-primary text-white ring-4 ring-pink-100" : "bg-gray-200 text-gray-500"} flex items-center justify-center font-bold text-xs`}>
                          🚚
                        </div>
                        <span className="font-bold text-primary block text-[11px]">Out for Delivery</span>
                      </div>

                      <div className="space-y-1 opacity-50">
                        <div className="w-7 h-7 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-xs">
                          4
                        </div>
                        <span className="font-medium text-gray-500 block text-[11px]">Delivered</span>
                      </div>
                    </div>

                    {order.riderName && (
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs flex flex-wrap items-center justify-between gap-2 text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-primary" />
                          <span>Courier: <strong className="text-gray-900 dark:text-white">{order.courier}</strong> ({order.trackingCode})</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-primary font-semibold">
                          <Phone className="w-3.5 h-3.5" />
                          <span>Rider: {order.riderName} ({order.riderPhone})</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Purchased Items
                    </h3>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#111620] rounded-xl border border-gray-200/60 dark:border-gray-800 p-2">
                      {order.items.map((prod, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
                            />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {prod.name}
                              </p>
                              <p className="text-gray-500 mt-0.5">
                                {prod.brand} • {prod.volume} • Qty: <strong className="text-gray-800 dark:text-gray-200">{prod.qty}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="text-right font-bold text-sm text-gray-900 dark:text-white">
                            ৳{(prod.price * prod.qty).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#111620] border border-gray-200/60 dark:border-gray-800 space-y-1">
                      <span className="font-bold text-gray-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Destination:
                      </span>
                      <p className="font-medium text-gray-800 dark:text-gray-200 pl-5">
                        {order.shippingAddress}
                      </p>
                      <p className="text-gray-500 pl-5 text-[11px]">
                        Payment: {order.paymentMethod} ({order.paymentStatus})
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#111620] border border-gray-200/60 dark:border-gray-800 space-y-1.5 text-right flex flex-col justify-between">
                      <div className="space-y-1 text-gray-500">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-200">৳{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="font-bold text-emerald-600">
                            {order.shippingFee === 0 ? "FREE (VIP)" : `৳${order.shippingFee}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-primary pt-1 border-t border-gray-100 dark:border-gray-800">
                          <span>Total Paid:</span>
                          <span>৳{order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Downloading Invoice PDF for Order #${order.id}...`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrdersPage;

