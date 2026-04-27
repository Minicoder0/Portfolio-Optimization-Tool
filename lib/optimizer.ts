import { Matrix } from "ml-matrix";

interface FrontierPoint {
  risk: number;
  return: number;
  sharpe?: number;
}

interface StockStat {
  ticker: string;
  expectedReturn: number;
  volatility: number;
}

interface OptimizeResult {
  weights: Record<string, number>;
  metrics: { expectedReturn: number; volatility: number; sharpe: number };
  stockStats: StockStat[];
  diversificationScore: number;
  correlationMatrix: Record<string, Record<string, number>>;
  frontier: FrontierPoint[];
  randomPortfolios: FrontierPoint[];
}

function pctChange(prices: number[][]): number[][] {
  const rows = prices.length;
  const cols = prices[0].length;
  const result: number[][] = [];
  for (let i = 1; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const prev = prices[i - 1][j];
      row.push(prev !== 0 ? (prices[i][j] - prev) / prev : 0);
    }
    result.push(row);
  }
  return result;
}

function columnMean(data: number[][]): number[] {
  const cols = data[0].length;
  const rows = data.length;
  const means = new Array(cols).fill(0);
  for (let j = 0; j < cols; j++) {
    let sum = 0;
    for (let i = 0; i < rows; i++) sum += data[i][j];
    means[j] = sum / rows;
  }
  return means;
}

function columnStd(data: number[][]): number[] {
  const cols = data[0].length;
  const rows = data.length;
  const means = columnMean(data);
  const stds = new Array(cols).fill(0);
  for (let j = 0; j < cols; j++) {
    let sumSq = 0;
    for (let i = 0; i < rows; i++) {
      const diff = data[i][j] - means[j];
      sumSq += diff * diff;
    }
    stds[j] = Math.sqrt(sumSq / (rows - 1));
  }
  return stds;
}

function covarianceMatrix(data: number[][]): number[][] {
  const cols = data[0].length;
  const rows = data.length;
  const means = columnMean(data);
  const cov: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(0));
  for (let i = 0; i < cols; i++) {
    for (let j = i; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < rows; k++) {
        sum += (data[k][i] - means[i]) * (data[k][j] - means[j]);
      }
      const val = sum / (rows - 1);
      cov[i][j] = val;
      cov[j][i] = val;
    }
  }
  return cov;
}

function correlationMatrix(data: number[][]): number[][] {
  const cov = covarianceMatrix(data);
  const n = cov.length;
  const stds = cov.map((_, i) => Math.sqrt(cov[i][i]));
  const corr: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const denom = stds[i] * stds[j];
      corr[i][j] = denom > 0 ? cov[i][j] / denom : i === j ? 1 : 0;
    }
  }
  return corr;
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function matVecMul(mat: number[][], vec: number[]): number[] {
  return mat.map((row) => dot(row, vec));
}

function portfolioVolatility(w: number[], covMat: number[][]): number {
  const temp = matVecMul(covMat, w);
  return Math.sqrt(Math.max(dot(w, temp), 0));
}

function portfolioReturn(w: number[], mu: number[]): number {
  return dot(w, mu);
}

function projectOntoSimplex(v: number[]): number[] {
  const n = v.length;
  const u = [...v].sort((a, b) => b - a);
  let cumSum = 0;
  let rho = 0;
  for (let j = 0; j < n; j++) {
    cumSum += u[j];
    if (u[j] + (1 - cumSum) / (j + 1) > 0) {
      rho = j + 1;
    }
  }
  let sum = 0;
  for (let j = 0; j < rho; j++) sum += u[j];
  const theta = (sum - 1) / rho;
  return v.map((val) => Math.max(val - theta, 0));
}

function maximizeSharpe(
  mu: number[],
  covMat: number[][],
  n: number,
  iterations = 2000,
  lr = 0.005
): number[] {
  let w = new Array(n).fill(1 / n);
  let bestW = [...w];
  let bestSharpe = -Infinity;

  for (let iter = 0; iter < iterations; iter++) {
    const ret = portfolioReturn(w, mu);
    const vol = portfolioVolatility(w, covMat);
    if (vol === 0) break;

    const sharpe = ret / vol;
    if (sharpe > bestSharpe) {
      bestSharpe = sharpe;
      bestW = [...w];
    }

    const covW = matVecMul(covMat, w);
    const grad: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      grad[i] = mu[i] / vol - (ret * covW[i]) / (vol * vol * vol);
    }

    const step = lr / (1 + iter * 0.001);
    const next = w.map((wi, i) => wi + step * grad[i]);
    w = projectOntoSimplex(next);
  }

  return bestW;
}

function minimizeVolatilityAtTarget(
  mu: number[],
  covMat: number[][],
  target: number,
  n: number,
  iterations = 1500,
  lr = 0.005
): number[] | null {
  let w = new Array(n).fill(1 / n);
  const penalty = 50;

  for (let iter = 0; iter < iterations; iter++) {
    const vol = portfolioVolatility(w, covMat);
    if (vol === 0) break;

    const ret = portfolioReturn(w, mu);
    const retGap = ret - target;

    const covW = matVecMul(covMat, w);
    const grad: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const volGrad = vol > 0 ? covW[i] / vol : 0;
      const penaltyGrad = penalty * 2 * retGap * mu[i];
      grad[i] = volGrad + penaltyGrad;
    }

    const step = lr / (1 + iter * 0.001);
    const next = w.map((wi, i) => wi - step * grad[i]);
    w = projectOntoSimplex(next);
  }

  return w;
}

function diversificationScore(corr: number[][]): number {
  const n = corr.length;
  if (n <= 1) return 0;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      sum += Math.abs(corr[i][j]);
      count++;
    }
  }
  const avgCorr = count > 0 ? sum / count : 0;
  return Math.max(0, Math.min(100, (1 - avgCorr) * 100));
}

function generateRandomPortfolios(
  mu: number[],
  covMat: number[][],
  count = 500
): FrontierPoint[] {
  const n = mu.length;
  const points: FrontierPoint[] = [];
  for (let i = 0; i < count; i++) {
    const raw = Array.from({ length: n }, () => Math.random());
    const total = raw.reduce((a, b) => a + b, 0);
    const w = raw.map((v) => v / total);
    const ret = portfolioReturn(w, mu);
    const vol = portfolioVolatility(w, covMat);
    points.push({
      risk: vol,
      return: ret,
      sharpe: vol > 0 ? ret / vol : 0,
    });
  }
  return points;
}

function buildFrontier(
  mu: number[],
  covMat: number[][],
  samples = 30
): FrontierPoint[] {
  const n = mu.length;
  const minRet = Math.min(...mu);
  const maxRet = Math.max(...mu);
  if (minRet === maxRet) return [{ risk: 0, return: minRet }];

  const points: FrontierPoint[] = [];
  for (let i = 0; i < samples; i++) {
    const target = minRet + (maxRet - minRet) * (i / (samples - 1));
    const w = minimizeVolatilityAtTarget(mu, covMat, target, n);
    if (!w) continue;
    const vol = portfolioVolatility(w, covMat);
    const ret = portfolioReturn(w, mu);
    points.push({ risk: vol, return: ret });
  }

  return points.sort((a, b) => a.risk - b.risk);
}

export function optimizeFromPrices(
  priceMatrix: number[][],
  tickers: string[]
): OptimizeResult {
  const n = tickers.length;
  const returns = pctChange(priceMatrix);

  if (returns.length < 30) {
    throw new Error("Not enough price history for this date range.");
  }

  const dailyMu = columnMean(returns);
  const dailyStd = columnStd(returns);
  const mu = dailyMu.map((m) => m * 252);
  const dailyCov = covarianceMatrix(returns);
  const covMat = dailyCov.map((row) => row.map((v) => v * 252));
  const corr = correlationMatrix(returns);

  const optWeights = maximizeSharpe(mu, covMat, n);

  const weightMap: Record<string, number> = {};
  let total = 0;
  for (let i = 0; i < n; i++) {
    if (optWeights[i] >= 0.01) {
      weightMap[tickers[i]] = optWeights[i];
      total += optWeights[i];
    }
  }
  if (total === 0) {
    for (let i = 0; i < n; i++) {
      weightMap[tickers[i]] = 1 / n;
    }
    total = 1;
  }
  for (const key of Object.keys(weightMap)) {
    weightMap[key] /= total;
  }

  const stockStats: StockStat[] = tickers.map((ticker, i) => ({
    ticker,
    expectedReturn: mu[i],
    volatility: dailyStd[i] * Math.sqrt(252),
  }));

  const wArr = tickers.map((t) => weightMap[t] ?? 0);
  const wSum = wArr.reduce((a, b) => a + b, 0);
  const normalizedW = wSum > 0 ? wArr.map((v) => v / wSum) : new Array(n).fill(1 / n);

  const ret = portfolioReturn(normalizedW, mu);
  const vol = portfolioVolatility(normalizedW, covMat);
  const sharpe = vol > 0 ? ret / vol : 0;

  const corrMap: Record<string, Record<string, number>> = {};
  for (let i = 0; i < n; i++) {
    corrMap[tickers[i]] = {};
    for (let j = 0; j < n; j++) {
      corrMap[tickers[i]][tickers[j]] = corr[i][j];
    }
  }

  return {
    weights: weightMap,
    metrics: { expectedReturn: ret, volatility: vol, sharpe },
    stockStats,
    diversificationScore: diversificationScore(corr),
    correlationMatrix: corrMap,
    frontier: buildFrontier(mu, covMat),
    randomPortfolios: generateRandomPortfolios(mu, covMat),
  };
}
