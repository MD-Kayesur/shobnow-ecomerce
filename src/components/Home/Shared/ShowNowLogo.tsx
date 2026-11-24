import React from "react";
import { Link } from "react-router-dom";

interface ShowNowLogoProps {
  className?: string;
  variant?: "primary" | "white" | "dark";
  size?: "sm" | "md" | "lg";
}

export const ShowNowLogo: React.FC<ShowNowLogoProps> = ({
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const textColor =
    variant === "white"
      ? "text-white"
      : variant === "dark"
      ? "text-gray-900"
      : "text-[#4338ca]";

  const subColor =
    variant === "white"
      ? "text-indigo-200/90"
      : variant === "dark"
      ? "text-gray-500"
      : "text-[#4338ca]/80";

  const sizeClasses = {
    sm: {
      script: "text-2xl sm:text-[28px]",
      serif: "text-xl sm:text-[22px]",
      sub: "text-[8px] sm:text-[9px]",
    },
    md: {
      script: "text-3xl sm:text-4xl lg:text-[40px]",
      serif: "text-2xl sm:text-3xl lg:text-[32px]",
      sub: "text-[9px] sm:text-[10px]",
    },
    lg: {
      script: "text-4xl sm:text-5xl",
      serif: "text-3xl sm:text-4xl",
      sub: "text-[10px] sm:text-[11px]",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <Link to="/" className={`flex flex-col select-none group leading-none ${className}`}>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`${currentSize.script} font-bold tracking-tight ${textColor} transition-transform group-hover:scale-105 inline-block`}
          style={{ fontFamily: "'Dancing Script', cursive, serif" }}
        >
          Show
        </span>
        <span
          className={`${currentSize.serif} font-serif tracking-[0.22em] font-extrabold ${textColor}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          NOW
        </span>
      </div>
      <span
        className={`${currentSize.sub} tracking-[0.18em] uppercase font-bold mt-1 ${subColor}`}
      >
        Your Ultimate Shopping Destination
      </span>
    </Link>
  );
};

export default ShowNowLogo;
