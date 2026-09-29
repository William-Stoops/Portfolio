// A miniature of William's IT-Finance work (ADR 0036): option prices, turned back into the
// volatilities that produce them, as a desk does. The market is simulated; only its prices
// reach the solver.

const SPOT = 100;
const RATE = 0.02;
// 1 / sqrt(2π), √(2π).
const INV_SQRT_TWO_PI = 0.3989422804014327;
const SQRT_TWO_PI = 2.506628274631;
const SOLVER = { tolerance: 1e-11, newtonSteps: 30, bisectionSteps: 80, low: 0.001, high: 4 };

function forward(maturity: number): number {
  return SPOT * Math.exp(RATE * maturity);
}

// Cumulative normal distribution, after Hart (1968) as given by West (2005): accurate in
// the tails, where the prices of deep out-of-the-money options are tiny.
function normCdf(x: number): number {
  const a = Math.abs(x);
  let tail = 0;
  if (a <= 37) {
    const density = Math.exp((-a * a) / 2);
    if (a < 7.071_067_811_865_47) {
      const numerator =
        (((((0.035_262_496_599_891_1 * a + 0.700_383_064_443_688) * a + 6.373_962_203_531_65) * a +
          33.912_866_078_383) *
          a +
          112.079_291_497_871) *
          a +
          221.213_596_169_931) *
          a +
        220.206_867_912_376;
      const denominator =
        ((((((0.088_388_347_648_318_4 * a + 1.755_667_163_182_64) * a + 16.064_177_579_207) * a +
          86.780_732_202_946_1) *
          a +
          296.564_248_779_674) *
          a +
          637.333_633_378_831) *
          a +
          793.826_512_519_948) *
          a +
        440.413_735_824_752;
      tail = (density * numerator) / denominator;
    } else {
      const fraction = a + 1 / (a + 2 / (a + 3 / (a + 4 / (a + 0.65))));
      tail = density / fraction / SQRT_TWO_PI;
    }
  }
  return x > 0 ? 1 - tail : tail;
}

function d1(strike: number, maturity: number, sigma: number): number {
  return (
    (Math.log(SPOT / strike) + (RATE + (sigma * sigma) / 2) * maturity) /
    (sigma * Math.sqrt(maturity))
  );
}

// Black-Scholes price of the out-of-the-money option, as desks quote them: a put below the
// forward, a call above it.
export function optionPrice(strike: number, maturity: number, sigma: number): number {
  const first = d1(strike, maturity, sigma);
  const second = first - sigma * Math.sqrt(maturity);
  const discount = Math.exp(-RATE * maturity);
  return strike < forward(maturity)
    ? strike * discount * normCdf(-second) - SPOT * normCdf(-first)
    : SPOT * normCdf(first) - strike * discount * normCdf(second);
}

// How much the price moves for a point of volatility: Newton's step.
function vega(strike: number, maturity: number, sigma: number): number {
  const first = d1(strike, maturity, sigma);
  return SPOT * Math.exp((-first * first) / 2) * Math.sqrt(maturity) * INV_SQRT_TWO_PI;
}

// The volatility that gives back `price`. Newton-Raphson from Manaster and Koehler's start,
// from which it converges without overshooting; bisection if a step ever leaves the range.
export function impliedVolatility(price: number, strike: number, maturity: number): number {
  let sigma = Math.sqrt((2 * Math.abs(Math.log(forward(maturity) / strike))) / maturity) || 0.25;
  for (let step = 0; step < SOLVER.newtonSteps; step += 1) {
    const gap = optionPrice(strike, maturity, sigma) - price;
    if (Math.abs(gap) < SOLVER.tolerance) {
      return sigma;
    }
    const next = sigma - gap / vega(strike, maturity, sigma);
    if (!(next > SOLVER.low && next < SOLVER.high)) {
      break;
    }
    sigma = next;
  }
  let low = SOLVER.low;
  let high = SOLVER.high;
  for (let step = 0; step < SOLVER.bisectionSteps; step += 1) {
    const middle = (low + high) / 2;
    if (optionPrice(strike, maturity, middle) > price) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return (low + high) / 2;
}

// The simulated market: a smile that fades with maturity, a mild skew to the downside, a
// term structure that rises.
export function marketVolatility(strike: number, maturity: number): number {
  const moneyness = Math.log(strike / SPOT);
  return (
    0.15 +
    0.06 * (1 - Math.exp(-1.2 * maturity)) -
    (0.03 * moneyness) / Math.sqrt(maturity + 0.2) +
    (1.1 * moneyness * moneyness) / (1 + 2 * maturity)
  );
}
