import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingCart, Star, Trash2, Wallet, Package, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { addToCart, removeFromCart, selectCartItems, selectCartSubtotal } from "@/redux/features/cart/cartSlice";
import { MOCK_PRODUCTS } from "@/data/data";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import augustBanner from "@/assets/banners/hero-spray-banner.jpg";

const money = (amount: number) => `৳ ${amount.toLocaleString("en-BD")}`;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const cartItems = useAppSelector(selectCartItems);
  const cartSubtotal = useAppSelector(selectCartSubtotal);
  const products = MOCK_PRODUCTS.filter((product) => product.inStock).slice(0, 4);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="sn-dashboard">
      <section className="sn-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(255,246,251,.97) 0%, rgba(255,239,248,.88) 45%, rgba(255,239,248,.1) 100%), url(${augustBanner})` }}>
        <div className="sn-hero-copy">
          <span className="sn-eyebrow"><Sparkles size={14} /> YOUR SHOP NOW SPACE</span>
          <h1>Welcome back,<br /><strong>{firstName}!</strong></h1>
          <p>Shop smarter. Live better.</p>
          <Link to="/shop" className="sn-primary-button">Start shopping <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="sn-stat-grid" aria-label="Account overview">
        <Link to="/user-dashboard/orders" className="sn-stat-card"><span className="sn-stat-icon"><Package /></span><span><small>Total orders</small><b>—</b><em>View your order history</em></span></Link>
        <Link to="/user-dashboard/profile" className="sn-stat-card"><span className="sn-stat-icon"><Wallet /></span><span><small>Wallet balance</small><b>—</b><em>Wallet details</em></span></Link>
        <Link to="/user-dashboard/wishlist" className="sn-stat-card"><span className="sn-stat-icon"><Heart /></span><span><small>Wishlist items</small><b>—</b><em>Saved favorites</em></span></Link>
        <Link to="/user-dashboard/orders" className="sn-stat-card"><span className="sn-stat-icon"><Star /></span><span><small>Your savings</small><b>—</b><em>From completed orders</em></span></Link>
      </section>

      <div className="sn-dashboard-columns">
        <section className="sn-popular-panel">
          <div className="sn-section-heading"><div><span className="sn-eyebrow">PICKED FOR YOU</span><h2>Popular products</h2></div><Link to="/shop">View all <ArrowRight size={16} /></Link></div>
          <div className="sn-product-grid">
            {products.map((product) => (
              <article className="sn-product-card" key={product.id}>
                <Link to={`/products/${product.slug}`} className="sn-product-image"><img src={product.image} alt={product.name} loading="lazy" /><span className="sn-discount">{product.discountPercent ? `-${product.discountPercent}%` : "Shop now"}</span></Link>
                <Link className="sn-favorite-button" aria-label={`Open favorites to save ${product.name}`} to="/user-dashboard/wishlist"><Heart size={19} /></Link>
                <div className="sn-product-info"><Link to={`/products/${product.slug}`} className="sn-product-name">{product.name}</Link><div className="sn-product-price">{money(product.price)}{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div><div className="sn-product-rating"><Star size={15} fill="currentColor" /> {product.rating.toFixed(1)} <span>({product.reviewsCount})</span></div>
                  <button className="sn-add-cart" onClick={() => dispatch(addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, brand: product.brand, category: product.category, openDrawer: false }))}><ShoppingCart size={16} /> Add to cart</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="sn-dashboard-aside">
          <section className="sn-cart-panel">
            <div className="sn-section-heading"><h2>Your cart</h2><Link to="/cart">View cart <ArrowRight size={15} /></Link></div>
            {cartItems.length ? <div className="sn-cart-items">{cartItems.slice(0, 3).map((item) => <div className="sn-cart-item" key={`${item.id}-${item.selectedSize || ""}`}><img src={item.image} alt={item.name} /><div><b>{item.name}</b><small>Qty: {item.quantity}</small><strong>{money(item.price * item.quantity)}</strong></div><button aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize }))}><Trash2 size={15} /></button></div>)}<div className="sn-cart-total"><span>Total</span><b>{money(cartSubtotal)}</b></div><Link to="/checkout" className="sn-checkout-button"><ShoppingCart size={16} /> Checkout <ArrowRight size={16} /></Link></div> : <div className="sn-empty-cart"><ShoppingCart size={25} /><p>Your cart is waiting for something lovely.</p><Link to="/shop">Explore the shop <ArrowRight size={14} /></Link></div>}
          </section>
          <Link to="/offers" className="sn-promo-card"><span>YOUR NEXT FAVORITE</span><b>A little beauty<br />goes a long way.</b><small>Explore Shop Now offers <ArrowRight size={14} /></small></Link>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
