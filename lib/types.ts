export type AppMode = "beginner" | "advanced";

export type RiskLevel = "Low" | "Medium" | "High" | "Very High";

export interface StockSuggestion {
  symbol: string;
  name: string;
  exchangeShortName?: string;
  type?: string;
}

export interface DateRangeInput {
  startDate: string;
  endDate: string;
  preset?: "1Y" | "3Y" | "5Y" | "custom";
}

export interface StockStat {
  ticker: string;
  expectedReturn: number;
  volatility: number;
  riskLevel?: RiskLevel;
}

export interface OptimizationMetrics {
  expectedReturn: number;
  volatility: number;
  sharpe: number;
}

export interface FrontierPoint {
  risk: number;
  return: number;
  sharpe?: number;
}

export interface OptimizationResponse {
  weights: Record<string, number>;
  metrics: OptimizationMetrics;
  stockStats: StockStat[];
  diversificationScore: number;
  correlationMatrix: Record<string, Record<string, number>>;
  frontier: FrontierPoint[];
  randomPortfolios: FrontierPoint[];
}

export interface SavedPortfolio {
  id?: string;
  name: string;
  tickers: string[];
  dateRange: DateRangeInput;
  weights: Record<string, number>;
  metrics: OptimizationMetrics;
  stockStats: StockStat[];
  modeAtSave: AppMode;
  investmentAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
