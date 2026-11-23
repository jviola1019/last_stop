# Economy balance — deterministic 7-day evaluation

A local scripted active player collects each minute and purchases the best immediately affordable income-per-coin action (room, upgrade or resident). Station arrivals continue every 85 simulated seconds. This is a **stress-test policy**, not a prediction of human engagement.

| Elapsed | Train cars | Total room levels | Coins on hand | Current passive coins/min |
|---|---:|---:|---:|---:|
| 1 minute | 3 | 3 | 130 | 339 |
| 10 minutes | 4 | 10 | 3,613 | 750 |
| 1 hour | 7 | 48 | 18,124 | 4,705 |
| 1 day | 18 | 216 | 3,266,380 | 34,671 |
| 7 days | 23 | 276 | 74,608,270 | 42,872 |

The cost curves in `src/economy.js` now use 1.95× cost growth per added carriage, 2.40× upgrade costs per level, and 1.27× income per level. This avoids reaching the full 25-room level cap on day one. Early upgrade costs (99 coins for the sleeper) and the one-minute collect loop remain accessible.

**Limitations of modeled balance:** The purchase policy acts every minute and ignores cosmetics/locomotive upgrades; playing less frequently slows progression. A seven-day absence earns **only eight hours** of bounded offline coins and does not advance 7 days of stations. All monetary values are in-game coins.
