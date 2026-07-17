import { useState, useRef, useEffect } from 'react';

export default function VirtualizedList({ items, itemHeight = 72, renderItem, containerHeight = 600 }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    const handleScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const totalHeight = items.length * itemHeight;
  const overscan = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div ref={containerRef} style={{ height: containerHeight, overflowY: 'auto' }} className="relative">
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => (
          <div
            key={item._id || startIndex + i}
            style={{ position: 'absolute', top: (startIndex + i) * itemHeight, height: itemHeight, width: '100%' }}
          >
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
    </div>
  );
}