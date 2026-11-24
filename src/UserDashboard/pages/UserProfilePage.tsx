// src/UserDashboard/pages/UserProfilePage.tsx
import { useState } from "react";
import {
  UserCheck,
  MapPin,
  Mail,
  Plus,
  Trash2,
  Check,
  Save,
  Crown,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export interface AddressItem {
  id: string;
  label: "Home" | "Office" | "Other";
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "addr-01",
    label: "Home",
    recipientName: "Ayesha Rahman",
    phone: "+880 1712-345678",
    address: "House 42, Flat 4B, Road 27, Dhanmondi R/A",
    city: "Dhaka (South)",
    district: "Dhaka",
    isDefault: true,
  },
  {
    id: "addr-02",
    label: "Office",
    recipientName: "Ayesha Rahman",
    phone: "+880 1712-345678",
    address: "Level 7, Concord Tower, Gulshan 2 Avenue",
    city: "Dhaka (North)",
    district: "Dhaka",
    isDefault: false,
  },
];

const UserProfilePage: React.FC = () => {
  const [name, setName] = useState("Ayesha Rahman");
  const [email, setEmail] = useState("ayesha.r@gmail.com");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [birthday, setBirthday] = useState("1996-05-18");
  // const [gender, setGender] = useState("Female");
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("New password cannot be the same as your current password.");
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password Updated Successfully!", {
        description: "Your user account credentials have been updated securely.",
      });
      setTimeout(() => setPasswordSuccess(false), 4000);
    }, 500);
  };

  // New address state
  const [newAddr, setNewAddr] = useState({
    label: "Home" as "Home" | "Office" | "Other",
    recipientName: "Ayesha Rahman",
    phone: "+880 1712-345678",
    address: "",
    city: "Dhaka",
    district: "Dhaka",
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address) return;

    const created: AddressItem = {
      id: `addr-${Date.now()}`,
      label: newAddr.label,
      recipientName: newAddr.recipientName,
      phone: newAddr.phone,
      address: newAddr.address,
      city: newAddr.city,
      district: newAddr.district,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, created]);
    setNewAddr({ ...newAddr, address: "" });
    setIsAddAddressOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-primary" />
            Profile & Delivery Addresses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal credentials, contact info, and delivery locations across Bangladesh.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* VIP Membership Status Card */}
      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                Gold VIP Loyalty Member
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Enjoy <strong>Free Nationwide Delivery</strong> on orders over ৳1,500 and <strong>5% automatic cashback</strong> points.
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-gray-400 block">Available Points</span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
            <Sparkles className="w-4 h-4 inline" /> 1,420 Pts
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSave} className="p-6 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Mobile Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Change Password & Security Section */}
      <form
        id="security-password-section"
        onSubmit={handlePasswordChange}
        className="p-6 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            Change Password & Security
          </h2>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" /> End-to-End Encrypted Session
          </span>
        </div>

        {/* Inline Alerts */}
        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Password updated successfully! Please keep your new password confidential.</span>
          </div>
        )}

        {/* 3 Password Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Guideline Footnote & Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[11px] text-gray-400">
            💡 Minimum 6 characters required. Use numbers and special symbols for stronger account protection.
          </p>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-primary border border-pink-200 dark:border-pink-900/60 text-xs font-bold shadow-xs hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
          </button>
        </div>
      </form>

      {/* Saved Delivery Addresses */}
      <div className="p-6 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Saved Delivery Addresses
          </h2>

          <button
            onClick={() => setIsAddAddressOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-50 dark:bg-pink-950/40 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                addr.isDefault
                  ? "border-primary bg-pink-50/30 dark:bg-pink-950/20"
                  : "border-gray-200/80 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/20"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                      <Check className="w-3 h-3" /> Default Delivery
                    </span>
                  )}
                </div>

                <p className="font-bold text-sm text-gray-900 dark:text-white pt-1">
                  {addr.recipientName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {addr.address}, {addr.city}, {addr.district}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {addr.phone}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    className="text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-600 font-semibold">Primary Address</span>
                )}

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A24] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Add New Delivery Address
            </h3>

            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {(["Home", "Office", "Other"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, label: type })}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                        newAddr.label === type
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={newAddr.recipientName}
                  onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Contact Phone (+880)
                </label>
                <input
                  type="tel"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Street Address / House / Road / Area
                </label>
                <textarea
                  rows={2}
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  placeholder="e.g. House 14, Road 5, Block C, Banani"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    City / Zone
                  </label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={newAddr.district}
                    onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
