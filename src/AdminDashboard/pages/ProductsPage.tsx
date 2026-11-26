// src/pages/Admin/ProductsPage.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Plus,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { MOCK_PRODUCTS, Product, SHOP_CATEGORIES } from "@/data/data";

const ProductsPage = () => {
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "outOfStock">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "Cosrx",
    category: "Skin Care",
    price: 1200,
    originalPrice: 1500,
    stockQuantity: 25,
    volume: "100ml",
  });

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchesStock = true;
      if (stockFilter === "inStock") matchesStock = product.inStock && product.stockQuantity > 5;
      if (stockFilter === "lowStock") matchesStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
      if (stockFilter === "outOfStock") matchesStock = !product.inStock || product.stockQuantity === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [productsList, searchTerm, selectedCategory, stockFilter]);

  // KPI counts
  const totalCount = productsList.length;
  const inStockCount = productsList.filter((p) => p.inStock && p.stockQuantity > 5).length;
  const lowStockCount = productsList.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5).length;
  const outOfStockCount = productsList.filter((p) => !p.inStock || p.stockQuantity === 0).length;

  // Toggle inStock status
  const handleToggleStock = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to remove this product from catalog?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Add product handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand: newProduct.brand,
      category: newProduct.category,
      subcategory: "General",
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice),
      rating: 5.0,
      reviewsCount: 1,
      inStock: newProduct.stockQuantity > 0,
      stockQuantity: Number(newProduct.stockQuantity),
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
      description: "Authentic premium product imported directly from verified brand distributors.",
      volume: newProduct.volume,
      discountPercent: Math.round(
        ((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100
      ),
    };

    setProductsList([created, ...productsList]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      brand: "Cosrx",
      category: "Skin Care",
      price: 1200,
      originalPrice: 1500,
      stockQuantity: 25,
      volume: "100ml",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-primary" />
            Products & Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your store catalog, pricing, variants, and real-time inventory stock.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total Catalog</span>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalCount}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{inStockCount}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 uppercase font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock (≤ 5)
          </span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{lowStockCount}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-rose-600 dark:text-rose-400 uppercase font-semibold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Out of Stock
          </span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-white"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by Category"
            className="px-3 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-primary text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {SHOP_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStockFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                stockFilter === "all" ? "bg-white dark:bg-gray-700 text-primary shadow-xs" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter("inStock")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                stockFilter === "inStock" ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-xs" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter("lowStock")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                stockFilter === "lowStock" ? "bg-white dark:bg-gray-700 text-amber-600 shadow-xs" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter("outOfStock")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                stockFilter === "outOfStock" ? "bg-white dark:bg-gray-700 text-rose-600 shadow-xs" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Out
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredProducts.slice(0, 30).map((product) => {
                const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
                const isOut = !product.inStock || product.stockQuantity === 0;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    {/* Product Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-gray-900 dark:text-white truncate" title={product.name}>
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {product.volume || "Standard size"} • SKU: {product.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      {product.brand}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-xs">
                      <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Count */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isOut
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : isLowStock
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {product.stockQuantity} units
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(product.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          product.inStock
                            ? "bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-rose-100 hover:text-rose-700"
                            : "bg-rose-100/60 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-emerald-100 hover:text-emerald-700"
                        }`}
                        title="Click to toggle in-stock / out-of-stock"
                      >
                        {product.inStock ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors"
                          title="View on storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-200/80 dark:border-gray-800 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-gray-900 dark:text-white">{Math.min(30, filteredProducts.length)}</strong> of{" "}
            <strong>{filteredProducts.length}</strong> filtered items
          </span>
          <span className="text-[11px] text-primary font-medium">All changes reflect in the storefront</span>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Product to Catalog
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cosrx Advanced Snail 96 Mucin Power Essence"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary cursor-pointer"
                  >
                    {SHOP_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Sale Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Regular Price (৳)
                  </label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold shadow-md cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

