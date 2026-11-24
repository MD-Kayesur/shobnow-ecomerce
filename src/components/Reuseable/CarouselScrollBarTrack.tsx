import React, { useState, useEffect, useRef, useCallback } from "react";

interface CarouselScrollBarTrackProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  stepAmount?: number;
}

export const CarouselScrollBarTrack: React.FC<CarouselScrollBarTrackProps> = ({
  scrollRef,
  className = "",
  stepAmount = 345,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  // Sync scroll position from scrollRef container
  const updateThumbPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setThumbLeft(0);
      setThumbWidth(100);
      return;
    }

    const visibleRatio = clientWidth / scrollWidth;
    const calculatedWidth = Math.max(12, Math.min(100, visibleRatio * 100));
    setThumbWidth(calculatedWidth);

    const progress = scrollLeft / maxScroll;
    const calculatedLeft = Math.max(0, Math.min(100 - calculatedWidth, progress * (100 - calculatedWidth)));
    setThumbLeft(calculatedLeft);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateThumbPosition();

    el.addEventListener("scroll", updateThumbPosition, { passive: true });
    window.addEventListener("resize", updateThumbPosition);

    return () => {
      el.removeEventListener("scroll", updateThumbPosition);
      window.removeEventListener("resize", updateThumbPosition);
    };
  }, [scrollRef, updateThumbPosition]);

  // Click on track to jump
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !scrollRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: ratio * maxScroll,
      behavior: "smooth",
    });
  };

  // Drag thumb (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = scrollRef.current?.scrollLeft || 0;
  };

  // Drag thumb (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    dragStartScrollLeftRef.current = scrollRef.current?.scrollLeft || 0;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current || !scrollRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      const trackWidth = trackRef.current.clientWidth;
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

      if (trackWidth > 0 && maxScroll > 0) {
        const scrollDelta = (deltaX / trackWidth) * maxScroll;
        scrollRef.current.scrollLeft = dragStartScrollLeftRef.current + scrollDelta;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !trackRef.current || !scrollRef.current) return;
      const deltaX = e.touches[0].clientX - dragStartXRef.current;
      const trackWidth = trackRef.current.clientWidth;
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

      if (trackWidth > 0 && maxScroll > 0) {
        const scrollDelta = (deltaX / trackWidth) * maxScroll;
        scrollRef.current.scrollLeft = dragStartScrollLeftRef.current + scrollDelta;
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [isDragging, scrollRef]);

  // Arrow step buttons
  const handleStep = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -stepAmount : stepAmount;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 w-full select-none ${className}`}>
      {/* Left Triangle Arrow Button */}
      <button
        type="button"
        onClick={() => handleStep("left")}
        className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shrink-0 active:scale-90"
        title="Slide Left"
        aria-label="Previous items"
      >
        <svg
          viewBox="0 0 8 10"
          className="w-2.5 h-3 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="7,1 1,5 7,9" />
        </svg>
      </button>

      {/* Horizontal Scroll Track with generous hit area */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative flex-1 py-2 cursor-pointer flex items-center"
      >
        <div className="w-full h-[6px] bg-[#E5E7EB] hover:bg-[#DCDFE4] rounded-full relative transition-colors">
          {/* Active Draggable Thumb */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              left: `${thumbLeft}%`,
              width: `${thumbWidth}%`,
            }}
            className={`absolute top-0 h-full bg-[#717680] hover:bg-[#52525B] rounded-full cursor-grab active:cursor-grabbing ${
              isDragging ? "cursor-grabbing bg-[#3F3F46]" : "transition-[left,width] duration-150"
            }`}
            title="Drag to scroll"
          />
        </div>
      </div>

      {/* Right Triangle Arrow Button */}
      <button
        type="button"
        onClick={() => handleStep("right")}
        className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shrink-0 active:scale-90"
        title="Slide Right"
        aria-label="Next items"
      >
        <svg
          viewBox="0 0 8 10"
          className="w-2.5 h-3 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="1,1 7,5 1,9" />
        </svg>
      </button>
    </div>
  );
};

export default CarouselScrollBarTrack;
