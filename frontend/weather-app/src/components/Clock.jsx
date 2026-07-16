import { useState, useEffect } from 'react';

export default function Clock({ timezone }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let timeString = '';
  try {
    timeString = time.toLocaleTimeString([], { 
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone 
    });
  } catch (e) {
    timeString = time.toLocaleTimeString();
  }

  return (
    <div 
      className="clock-display" 
      style={{ 
        fontVariantNumeric: 'tabular-nums', 
        fontWeight: '500', 
        fontSize: '0.95rem',
        color: 'var(--text-secondary)' 
      }}
    >
      {timeString}
    </div>
  );
}
