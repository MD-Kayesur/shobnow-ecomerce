import React, { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Check } from "lucide-react";

export interface PaymentCardItem {
  id: string;
  name: string;
  category: "card" | "mfs" | "bank" | "wallet";
  logoContent: React.ReactNode;
}

export const ROW_1_CARDS: PaymentCardItem[] = [
  {
    id: "visa",
    name: "VISA",
    category: "card",
    logoContent: (
      <span className="font-sans font-black text-[#1A1F71] text-xs sm:text-[13px] tracking-tight italic">
        VISA
      </span>
    ),
  },
  {
    id: "mastercard",
    name: "Mastercard",
    category: "card",
    logoContent: (
      <div className="flex items-center -space-x-2">
        <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block opacity-90" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] inline-block opacity-90" />
      </div>
    ),
  },
  {
    id: "amex",
    name: "American Express",
    category: "card",
    logoContent: (
      <div className="bg-[#006FCF] px-1 py-0.5 rounded-[2px] text-[9px] font-black text-white leading-none tracking-tighter">
        AMEX
      </div>
    ),
  },
  {
    id: "unionpay",
    name: "UnionPay",
    category: "card",
    logoContent: (
      <div className="flex items-center space-x-0.5">
        <span className="w-1.5 h-3 bg-[#E21838] rounded-xs" />
        <span className="w-1.5 h-3 bg-[#004A97] rounded-xs" />
        <span className="w-1.5 h-3 bg-[#007B5F] rounded-xs" />
      </div>
    ),
  },
  {
    id: "diners",
    name: "Diners Club",
    category: "card",
    logoContent: (
      <div className="w-4 h-4 rounded-full border-2 border-[#004B87] flex items-center justify-center">
        <div className="w-1 h-3 bg-[#004B87]" />
      </div>
    ),
  },
  {
    id: "nexus",
    name: "DBBL Nexus",
    category: "card",
    logoContent: (
      <div className="flex flex-col items-center leading-none">
        <span className="text-[7px] font-black text-[#00833E]">DBBL</span>
        <span className="text-[8px] font-bold text-[#E21838] tracking-tighter">Nexus</span>
      </div>
    ),
  },
  {
    id: "qcash",
    name: "Q-Cash",
    category: "card",
    logoContent: (
      <div className="w-4 h-4 rounded-full bg-[#E21838] text-white flex items-center justify-center font-black text-[9px]">
        Q
      </div>
    ),
  },
  {
    id: "takapay",
    name: "TakaPay",
    category: "card",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="text-[#00833E] font-bold text-[8px]">Taka</span>
        <span className="text-[#E21838] font-bold text-[8px]">Pay</span>
      </div>
    ),
  },
  {
    id: "bkash",
    name: "bKash",
    category: "mfs",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#E2136E]">
          <path d="M12 2L3 9l9 7 9-7-9-7zm0 10.5L6.5 9 12 4.7 17.5 9 12 12.5z" />
          <path d="M3 13l9 7 9-7" stroke="#E2136E" strokeWidth="2" fill="none" />
        </svg>
        <span className="font-bold text-[#E2136E] text-[9px] tracking-tight">bKash</span>
      </div>
    ),
  },
  {
    id: "nagad",
    name: "Nagad",
    category: "mfs",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#E62E04] to-[#F97316]" />
        <span className="font-bold text-[#E62E04] text-[9px]">নগদ</span>
      </div>
    ),
  },
  {
    id: "rocket",
    name: "Rocket",
    category: "mfs",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="font-bold text-[#8C3494] text-[9px]">রকেট</span>
      </div>
    ),
  },
  {
    id: "upay",
    name: "Upay",
    category: "mfs",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="font-black text-[#005BAA] text-[9px]">u</span>
        <span className="font-bold text-[#FFCC00] text-[9px]">pay</span>
      </div>
    ),
  },
  {
    id: "dmoney",
    name: "Dmoney",
    category: "wallet",
    logoContent: (
      <div className="flex items-center">
        <span className="font-black text-[#E61C24] text-[9px]">D</span>
        <span className="text-[8px] font-bold text-gray-700">money</span>
      </div>
    ),
  },
  {
    id: "okwallet",
    name: "OK Wallet",
    category: "wallet",
    logoContent: (
      <div className="bg-[#00A859] px-1 py-0.5 rounded-[2px] text-white text-[8px] font-bold">
        OK
      </div>
    ),
  },
  {
    id: "mcash",
    name: "mCash",
    category: "wallet",
    logoContent: (
      <span className="text-[#00833E] font-bold text-[8px] tracking-tight">
        mCash
      </span>
    ),
  },
  {
    id: "islamicwallet",
    name: "Islamic Wallet",
    category: "wallet",
    logoContent: (
      <div className="flex flex-col items-center leading-none">
        <span className="text-[#006837] text-[7px] font-bold">Islamic</span>
        <span className="text-[#006837] text-[6px]">Wallet</span>
      </div>
    ),
  },
  {
    id: "mycash",
    name: "MYCash",
    category: "wallet",
    logoContent: (
      <span className="text-[#0072BC] font-bold text-[8px]">MYCash</span>
    ),
  },
  {
    id: "meghnapay",
    name: "MeghnaPay",
    category: "wallet",
    logoContent: (
      <span className="text-[#00A88F] font-bold text-[8px]">Meghna</span>
    ),
  },
  {
    id: "citytouch",
    name: "Citytouch",
    category: "bank",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="w-2 h-2 rounded-xs bg-[#E31B23]" />
        <span className="text-[#00529B] font-bold text-[8px]">touch</span>
      </div>
    ),
  },
  {
    id: "cellfin",
    name: "Cellfin",
    category: "bank",
    logoContent: (
      <div className="bg-[#00833E] px-1 py-0.5 rounded-xs text-white text-[8px] font-bold">
        cellfin
      </div>
    ),
  },
  {
    id: "eblsky",
    name: "EBL SKYBANKING",
    category: "bank",
    logoContent: (
      <div className="bg-[#FFCC00] px-1 py-0.5 rounded-xs text-[#003366] text-[7px] font-black">
        EBL SKY
      </div>
    ),
  },
  {
    id: "abdirect",
    name: "AB Direct",
    category: "bank",
    logoContent: (
      <span className="text-[#ED1C24] font-black text-[9px]">AB•</span>
    ),
  },
  {
    id: "sonalibank",
    name: "Sonali Bank",
    category: "bank",
    logoContent: (
      <div className="w-4 h-4 rounded-full border border-[#006837] text-[#006837] flex items-center justify-center text-[7px] font-bold">
        SB
      </div>
    ),
  },
];

export const ROW_2_CARDS: PaymentCardItem[] = [
  {
    id: "mtb",
    name: "Mutual Trust Bank",
    category: "bank",
    logoContent: (
      <div className="flex flex-col items-center leading-none">
        <span className="text-[#7B1846] font-black text-[9px] tracking-tighter">MTB</span>
      </div>
    ),
  },
  {
    id: "midland",
    name: "Midland Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#E31E24] font-bold text-[8px]">midland</span>
    ),
  },
  {
    id: "myprime",
    name: "Prime Bank (MyPrime)",
    category: "bank",
    logoContent: (
      <div className="flex items-center gap-0.5 text-[#004B8D]">
        <span className="text-[8px] font-bold">MyPrime</span>
      </div>
    ),
  },
  {
    id: "bankasia",
    name: "Bank Asia",
    category: "bank",
    logoContent: (
      <div className="bg-[#005596] text-white px-1 py-0.5 rounded-xs text-[7px] font-bold">
        Bank Asia
      </div>
    ),
  },
  {
    id: "sbac",
    name: "SBAC Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#8E258D] font-black text-[9px]">SB</span>
    ),
  },
  {
    id: "firstsecurity",
    name: "First Security Bank",
    category: "bank",
    logoContent: (
      <div className="flex flex-col items-center text-[#006837] text-[7px] font-bold leading-none">
        <span>FSIBL</span>
      </div>
    ),
  },
  {
    id: "madhumati",
    name: "Modhumoti Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#76BC43] font-bold text-[7px]">Modhumoti</span>
    ),
  },
  {
    id: "dmoney2",
    name: "Dmoney App",
    category: "wallet",
    logoContent: (
      <div className="w-3.5 h-3.5 rounded-xs bg-[#F7931E] flex items-center justify-center text-white text-[8px] font-black">
        D
      </div>
    ),
  },
  {
    id: "sbacbank",
    name: "SBAC Mobile",
    category: "bank",
    logoContent: (
      <span className="text-[#EC008C] font-bold text-[8px]">SBAC</span>
    ),
  },
  {
    id: "meghnabank",
    name: "Meghna Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#5B2C6F] font-bold text-[8px]">Meghna</span>
    ),
  },
  {
    id: "padma",
    name: "Padma Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#E46C0A] font-bold text-[8px]">Padma</span>
    ),
  },
  {
    id: "citizens",
    name: "Citizens Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#C00000] font-bold text-[7px]">Citizens</span>
    ),
  },
  {
    id: "ucbone",
    name: "UCB ONE",
    category: "bank",
    logoContent: (
      <div className="flex items-center text-[8px]">
        <span className="text-[#C1272D] font-black">UCB</span>
        <span className="text-gray-700 font-bold">ONE</span>
      </div>
    ),
  },
  {
    id: "nccbank",
    name: "NCC Bank",
    category: "bank",
    logoContent: (
      <span className="text-[#003A70] font-bold text-[8px]">NCC Bank</span>
    ),
  },
  {
    id: "abdirect2",
    name: "AB DIRECT",
    category: "bank",
    logoContent: (
      <span className="text-gray-800 font-bold text-[8px]">DIRECT</span>
    ),
  },
  {
    id: "cashbaba",
    name: "Cashbaba",
    category: "wallet",
    logoContent: (
      <span className="text-[#F15A24] font-bold text-[7px]">cashbaba</span>
    ),
  },
  {
    id: "rainbow",
    name: "Rainbow Pay",
    category: "wallet",
    logoContent: (
      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-400 via-green-400 to-blue-400" />
    ),
  },
  {
    id: "pocket",
    name: "Pocket (AB)",
    category: "wallet",
    logoContent: (
      <div className="bg-[#006837] text-white px-1 py-0.5 rounded-xs text-[7px] font-bold">
        pocket
      </div>
    ),
  },
  {
    id: "upay2",
    name: "Upay Wallet",
    category: "wallet",
    logoContent: (
      <span className="text-[#005BAA] font-bold text-[8px]">uPay</span>
    ),
  },
  {
    id: "fastpay",
    name: "FastPay",
    category: "wallet",
    logoContent: (
      <span className="text-[#0072BC] font-bold text-[8px]">FastPay</span>
    ),
  },
  {
    id: "ipay",
    name: "iPay",
    category: "wallet",
    logoContent: (
      <span className="text-[#00A88F] font-black text-[9px]">ipay</span>
    ),
  },
  {
    id: "qmoney",
    name: "Q-Money",
    category: "wallet",
    logoContent: (
      <div className="w-3.5 h-3.5 rounded-full bg-[#FFCC00] text-gray-900 font-bold text-[7px] flex items-center justify-center">
        Q
      </div>
    ),
  },
  {
    id: "gpay",
    name: "Google Pay",
    category: "wallet",
    logoContent: (
      <div className="flex items-center gap-0.5">
        <span className="font-bold text-[#4285F4] text-[9px]">G</span>
        <span className="text-gray-600 font-medium text-[8px]">Pay</span>
      </div>
    ),
  },
];

export const SSLCommerzPaymentSection: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleCardClick = (card: PaymentCardItem) => {
    setSelectedMethod(card.id);
    toast.success(`Selected ${card.name}`, {
      description: "Secured & Encrypted via SSLCOMMERZ 256-bit payment gateway.",
    });
  };

  const handleVerifiedClick = () => {
    toast.info("SSLCOMMERZ Payment Gateway Verified", {
      description: "PCI-DSS Level 1 certified gateway protecting 100% of transactions.",
    });
  };

  return (
    <div className="w-full my-8 py-3 px-3 sm:px-6 bg-white dark:bg-[#111622] rounded-xl shadow-2xs border border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row items-center justify-between gap-4 select-none transition-colors duration-200">
      {/* 1. Left "Pay With" Badge with Blue Bar */}
      <div className="flex items-center gap-2.5 shrink-0 self-start xl:self-center">
        <div className="w-1 h-8 rounded-full bg-[#1E5198] dark:bg-[#38BDF8]" />
        <span className="text-[#1E5198] dark:text-[#38BDF8] font-inter font-bold text-sm sm:text-base tracking-tight whitespace-nowrap">
          Pay With
        </span>
      </div>

      {/* 2. Middle Grid: 2 Rows of Real Interactive Clickable Cards */}
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="flex-1 w-full flex flex-col gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden"
      >
        {/* ROW 1 */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-start min-w-max">
          {ROW_1_CARDS.map((card) => {
            const isSelected = selectedMethod === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                title={`Pay with ${card.name}`}
                className={`w-[48px] sm:w-[54px] h-[32px] sm:h-[35px] rounded-[6px] bg-white dark:bg-gray-800/90 border flex items-center justify-center p-1 relative shadow-2xs transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? "border-[#1E5198] dark:border-[#38BDF8] ring-2 ring-[#1E5198]/20 bg-blue-50/20 dark:bg-blue-950/30 shadow-xs"
                    : "border-gray-200/90 dark:border-gray-700 hover:border-[#1E5198] dark:hover:border-[#38BDF8] hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {card.logoContent}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1E5198] dark:bg-[#38BDF8] text-white rounded-full flex items-center justify-center">
                    <Check size={8} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ROW 2 */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-start min-w-max">
          {ROW_2_CARDS.map((card) => {
            const isSelected = selectedMethod === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                title={`Pay with ${card.name}`}
                className={`w-[48px] sm:w-[54px] h-[32px] sm:h-[35px] rounded-[6px] bg-white dark:bg-gray-800/90 border flex items-center justify-center p-1 relative shadow-2xs transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? "border-[#1E5198] dark:border-[#38BDF8] ring-2 ring-[#1E5198]/20 bg-blue-50/20 dark:bg-blue-950/30 shadow-xs"
                    : "border-gray-200/90 dark:border-gray-700 hover:border-[#1E5198] dark:hover:border-[#38BDF8] hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {card.logoContent}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1E5198] dark:bg-[#38BDF8] text-white rounded-full flex items-center justify-center">
                    <Check size={8} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right "Verified By SSLCOMMERZ" Badge with Vertical Divider */}
      <div className="flex items-center gap-3 shrink-0 self-end xl:self-center pt-2 xl:pt-0 border-t xl:border-t-0 xl:border-l border-gray-200 dark:border-gray-700 pl-0 xl:pl-4">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-inter font-medium">
            Verified By
          </span>
          <button
            onClick={handleVerifiedClick}
            className="mt-0.5 px-2.5 py-1 bg-[#134375] hover:bg-[#0E3259] text-white rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer group"
          >
            <ShieldCheck size={14} className="text-[#38BDF8] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black tracking-tight font-sans">
              SSL<span className="text-[#38BDF8]">COMMERZ</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSLCommerzPaymentSection;
