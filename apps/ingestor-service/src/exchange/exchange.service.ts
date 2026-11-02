import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WebSocket from 'ws';
import { MarketTick, ExchangeState } from '@vlr-finance/schemas';

@Injectable()
export class ExchangeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ExchangeService.name);
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private tickCount = 0;
  private errorCount = 0;
  private lastTickTimestamp: number | null = null;
  private connected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const mockStrategy = this.configService.get<boolean>('MOCK_STRATEGY', false);
    
    if (mockStrategy) {
      this.logger.log('Mock strategy enabled - starting mock data generation');
      this.startMockStrategy();
    } else {
      this.connect();
    }
  }

  async onModuleDestroy() {
    this.disconnect();
  }

  private connect() {
    const wsUrl = this.configService.get<string>(
      'BINANCE_WS_URL',
      'wss://stream.binance.com:9443/ws',
    );
    const symbols = this.configService.get<string>('SYMBOLS', 'btcusdt,ethusdt').split(',');

    this.logger.log(`Connecting to Binance WebSocket: ${wsUrl}`);
    this.logger.log(`Subscribing to symbols: ${symbols.join(', ')}`);

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join('/');
    const url = `${wsUrl}/${streams}`;

    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.logger.log('WebSocket connection established');
      this.connected = true;
      this.reconnectAttempts = 0;
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      this.handleMessage(data);
    });

    this.ws.on('error', (error) => {
      this.logger.error('WebSocket error:', error);
      this.errorCount++;
    });

    this.ws.on('close', () => {
      this.logger.warn('WebSocket connection closed');
      this.connected = false;
      this.scheduleReconnect();
    });
  }

  private disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    const maxAttempts = this.configService.get<number>(
      'MAX_RECONNECT_ATTEMPTS',
      10,
    );
    const baseInterval = this.configService.get<number>(
      'RECONNECT_INTERVAL',
      5000,
    );

    if (this.reconnectAttempts >= maxAttempts) {
      this.logger.error('Max reconnection attempts reached');
      return;
    }

    const delay = baseInterval * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.logger.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(data: WebSocket.Data) {
    try {
      const message = JSON.parse(data.toString());
      const tick = this.parseBinanceTick(message);
      
      if (tick) {
        this.tickCount++;
        this.lastTickTimestamp = Date.now();
        this.emit('tick', tick);
      }
    } catch (error) {
      this.logger.error('Error parsing tick:', error);
      this.errorCount++;
    }
  }

  private parseBinanceTick(data: any): MarketTick | null {
    try {
      // Binance ticker format
      return {
        symbol: data.s.toUpperCase(),
        price: parseFloat(data.c),
        volume: parseFloat(data.v),
        timestamp: Date.now(),
        exchange: 'binance',
      };
    } catch (error) {
      this.logger.error('Error parsing Binance tick:', error);
      return null;
    }
  }

  private startMockStrategy() {
    const symbols = this.configService.get<string>('SYMBOLS', 'btcusdt,ethusdt').split(',');
    const interval = this.configService.get<number>('MOCK_INTERVAL', 1000);

    setInterval(() => {
      for (const symbol of symbols) {
        const tick: MarketTick = {
          symbol: symbol.toUpperCase(),
          price: this.generateMockPrice(symbol),
          volume: Math.random() * 1000,
          timestamp: Date.now(),
          exchange: 'mock',
        };
        
        this.tickCount++;
        this.lastTickTimestamp = Date.now();
        this.emit('tick', tick);
      }
    }, interval);
  }

  private generateMockPrice(symbol: string): number {
    // Generate realistic mock prices
    const basePrices: Record<string, number> = {
      BTCUSDT: 45000,
      ETHUSDT: 3000,
    };

    const basePrice = basePrices[symbol] || 100;
    const variation = basePrice * 0.01; // 1% variation
    return basePrice + (Math.random() - 0.5) * variation;
  }

  private emit(event: string, data: any) {
    // This will be handled by the IngestorService
    // Using a simple event emitter pattern
    (this as any).listeners?.(event)?.forEach((listener: Function) => listener(data));
  }

  on(event: string, listener: Function) {
    (this as any).listeners = (this as any).listeners || {};
    (this as any).listeners[event] = (this as any).listeners[event] || [];
    (this as any).listeners[event].push(listener);
  }

  getState(): ExchangeState {
    return {
      connected: this.connected,
      lastTickTimestamp: this.lastTickTimestamp,
      tickCount: this.tickCount,
      errorCount: this.errorCount,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}
