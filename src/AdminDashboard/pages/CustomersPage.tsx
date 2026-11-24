// src/pages/Admin/CustomersPage.tsx
import { useState, useMemo } from "react";
import { Users, Search, Crown, Mail, Phone, MapPin, UserPlus } from "lucide-react";

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "VIP" | "Active" | "Inactive";
  joinedDate: string;
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: "CUST-001",
    name: "Ayesha Rahman",
    email: "ayesha.r@gmail.com",
    phone: "+880 1712-345678",
    city: "Dhaka (Dhanmondi)",
    totalOrders: 14,
    totalSpent: 42800,
    status: "VIP",
    joinedDate: "Jan 12, 2026",
  },
  {
    id: "CUST-002",
    name: "Farhana Islam",
    email: "farhana.isl@outlook.com",
    phone: "+880 1819-876543",
    city: "Chittagong (Nasirabad)",
    totalOrders: 8,
    totalSpent: 22400,
    status: "Active",
    joinedDate: "Feb 28, 2026",
  },
  {
    id: "CUST-003",
    name: "Tasnim Chowdhury",
    email: "tasnim.chy@gmail.com",
    phone: "+880 1678-112233",
    city: "Dhaka (Gulshan 2)",
    totalOrders: 19,
    totalSpent: 64900,
    status: "VIP",
    joinedDate: "Nov 04, 2025",
  },
  {
    id: "CUST-004",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@yahoo.com",
    phone: "+880 1911-445566",
    city: "Sylhet (Zindabazar)",
    totalOrders: 5,
    totalSpent: 11200,
    status: "Active",
    joinedDate: "Apr 15, 2026",
  },
  {
    id: "CUST-005",
    name: "Sabrina Hossain",
    email: "sabrina.h@gmail.com",
    phone: "+880 1722-998877",
    city: "Dhaka (Uttara)",
    totalOrders: 2,
    totalSpent: 3500,
    status: "Active",
    joinedDate: "Oct 19, 2026",
  },
  {
    id: "CUST-006",
    name: "Mehnaz Akter",
    email: "mehnaz.akter@gmail.com",
    phone: "+880 1552-334455",
    city: "Rajshahi (Shaheb Bazar)",
    totalOrders: 1,
    totalSpent: 1850,
    status: "Inactive",
    joinedDate: "Aug 02, 2026",
  },
];

const CustomersPage = () => {
  const [customers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone.includes(searchTerm) ||
        cust.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || cust.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const vipCount = customers.filter((c) => c.status === "VIP").length;
  const activeCount = customers.filter((c) => c.status === "Active").length;
  const totalSpendAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-primary" />
            Customers Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Registered customer accounts, purchase loyalty, total spend, and contact records.
          </p>
        </div>

        <button
          onClick={() => alert("Customer invitation link copied to clipboard!")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total Accounts</span>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{customers.length}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> VIP Customers
          </span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{vipCount}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
            Active Buyers
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-primary uppercase font-semibold">Lifetime Customer Value</span>
          <p className="text-2xl font-extrabold text-primary mt-1">
            ৳{totalSpendAll.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, email, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-semibold">
          {["All", "VIP", "Active", "Inactive"].map((status) => (
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

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {cust.name}
                          {cust.status === "VIP" && (
                            <Crown className="w-3.5 h-3.5 text-amber-500 inline" />
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{cust.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-xs">
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {cust.email}
                    </p>
                    <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {cust.phone}
                    </p>
                  </td>

                  <td className="py-3 px-4 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {cust.city}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {cust.totalOrders} orders
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    ৳{cust.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cust.status === "VIP"
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50"
                          : cust.status === "Active"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                    {cust.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;

