import React, { useState, useRef } from 'react';

const Carousel = ({ children, title = 192 }) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setDragged(false);
    scrollContainerRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.2;
    if (Math.abs(walk) > 5) {
      setDragged(true)
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
    setTimeout(() => {
      setDragged(false);
    }, 0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragged) {
        setDragged(false);
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
      }
    }
  };
  
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      isDragging,
      dragged,
      style: { cursor: isDragging ? 'grabbing' : 'pointer', ...(child.props.style || {}) },
    })
  );

  return (
    <div className="mb-4">
      {title && <h2 className="text-white text-2xl font-bold mb-1">{title}</h2>}
      
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide select-none"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
           
          {childrenWithProps}
        </div>

      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;