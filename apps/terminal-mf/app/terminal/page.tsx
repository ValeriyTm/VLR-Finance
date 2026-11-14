'use client';

import { useEffect, useState } from 'react';
import { MarketTick } from '@vlr-finance/schemas';

export default function TerminalPage() {
  const [ticks, setTicks] = useState<MarketTick[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Simulate SSE connection for market data
    const eventSource = new EventSource('/api/ingestor/stream');

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      const tick = JSON.parse(event.data) as MarketTick;
      setTicks((prev) => [tick, ...prev.slice(0, 99)]); // Keep last 100 ticks
    };

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Trading Terminal</h2>
        <div className={`px-3 py-1 rounded-full text-sm ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ticks.map((tick, index) => (
          <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="font-medium">{tick.symbol}</span>
            <span className="text-green-600">${tick.price.toFixed(2)}</span>
            <span className="text-gray-500">Vol: {tick.volume.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
