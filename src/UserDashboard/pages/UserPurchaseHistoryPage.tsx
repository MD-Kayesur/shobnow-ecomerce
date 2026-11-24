// src/pages/Client/UserPurchaseHistoryPage.tsx
import { useState } from "react";
import { Clock, Download, Repeat, Star, CheckCircle2, Search } from "lucide-react";

export interface PastOrder {
  id: string;
  deliveredDate: string;
  itemsCount: number;
  itemsList: string;
  totalAmount: number;
  paymentMethod: string;
  invoiceUrl: string;
}

const PAST_PURCHASES: PastOrder[] = [
  {
    id: "SN-97812",
    deliveredDate: "Oct 28, 2026",
    itemsCount: 3,
    itemsList: "Madagascar Centella Ampoule, Zero Pore Pad 2.0, Vitamin C Serum",
    totalAmount: 5650,
    paymentMethod: "SSLCommerz (Nagad)",
    invoiceUrl: "#",
  },
  {
    id: "SN-96940",
    deliveredDate: "Oct 12, 2026",
    itemsCount: 2,
    itemsList: "Beauty of Joseon Sun Relief Rice, Cosrx Low pH Good Morning Gel",
    totalAmount: 2650,
    paymentMethod: "Cash on Delivery",
    invoiceUrl: "#",
  },
  {
    id: "SN-95123",
    deliveredDate: "Sep 22, 2026",
    itemsCount: 4,
    itemsList: "Anua Heartleaf Soothing Toner, Rice Toner, Lip Glowy Balm, Cleanser",
    totalAmount: 7800,
    paymentMethod: "SSLCommerz (bKash)",
    invoiceUrl: "#",
  },
  {
    id: "SN-93450",
    deliveredDate: "Aug 15, 2026",
    itemsCount: 1,
    itemsList: "Dr. Althea 345 Relief Cream (50ml)",
    totalAmount: 2100,
    paymentMethod: "SSLCommerz (Visa)",
    invoiceUrl: "#",
  },
  {
    id: "SN-91204",
    deliveredDate: "Jul 04, 2026",
    itemsCount: 3,
    itemsList: "Missha Time Revolution Night Repair, Cosrx BHA Liquid, Eye Cream",
    totalAmount: 5650,
    paymentMethod: "Cash on Delivery",
    invoiceUrl: "#",
  },
];

const UserPurchaseHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewModalProduct, setReviewModalProduct] = useState<string | null>(null);

  const filteredPurchases = PAST_PURCHASES.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemsList.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-primary" />
            Purchase Receipts & History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access past fulfilled orders, download official tax receipts, and reorder favorites in 1 click.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>
      </div>

      {/* Lifetime Purchases Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400 font-semibold">Total Delivered Orders</span>
          <div className="text-2xl font-bold font-faustina text-gray-900 dark:text-white mt-1">
            8 Orders
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> 100% Fulfilled
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400 font-semibold">Lifetime Spend</span>
          <div className="text-2xl font-bold font-faustina text-primary mt-1">
            ৳28,400
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
            Avg. ৳3,550 per basket
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400 font-semibold">VIP Cash Savings</span>
          <div className="text-2xl font-bold font-faustina text-amber-500 mt-1">
            ৳4,250
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">
            VIP Discounts & Free Shipping
          </span>
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-3.5">
        {filteredPurchases.map((purchase) => (
          <div
            key={purchase.id}
            className="p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base text-gray-900 dark:text-white">
                  Order #{purchase.id}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Delivered on {purchase.deliveredDate}
                </span>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">
                <strong>Items:</strong> {purchase.itemsList}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span>{purchase.itemsCount} Products</span>
                <span>•</span>
                <span>Payment: {purchase.paymentMethod}</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
              <div className="text-left md:text-right pr-2">
                <span className="text-xs text-gray-400 block">Total</span>
                <span className="text-base font-extrabold text-gray-900 dark:text-white">
                  ৳{purchase.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading Official Tax Invoice for #${purchase.id}...`)}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary transition-all cursor-pointer"
                  title="Download Invoice"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => alert(`Reordering products from #${purchase.id} into cart...`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-50 dark:bg-pink-950/40 text-primary border border-pink-200 dark:border-pink-900 hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>

                <button
                  onClick={() => setReviewModalProduct(purchase.id)}
                  className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  title="Rate & Review"
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Write Product Review for #{reviewModalProduct}
            </h3>
            <p className="text-xs text-gray-500">
              Your feedback helps other beauty enthusiasts choose authentic Korean and global skincare products.
            </p>

            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star className="w-6 h-6 fill-amber-400" />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Share your skin experience, texture notes, and results..."
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewModalProduct(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Thank you! Your verified review has been submitted.");
                  setReviewModalProduct(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPurchaseHistoryPage;
