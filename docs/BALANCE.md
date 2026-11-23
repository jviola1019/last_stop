# Everline v4 — deterministic 30-day economic stress test

The scripts at `scripts/balance.mjs` model two illustrative policies. These are **not empirical user sessions** and do not prove economic or engagement quality.

- **Active**: continuously play 24 hours/day (deliberately extreme), collect each minute, purchase at most one best marginal income/coin action per minute, unlock eligible regions, and redeem a small permanent Stamp project when it becomes eligible. No seasons/prestige used.
- **Casual**: visit for about 10 minutes/day, perform a purchase per active minute when affordable, then receive a single bounded 8-hour offline credit at the next day boundary. Visits advance the station timer, but offline time never generates station stops. No prestige used.
- Region unlocks are constrained by *lifetime* stops, current train length, and available Stamps, so rare Stamp scarcity and offline pacing differ from direct income.
- Coins/minute are computed from `incomeRate(state)` with satisfaction, neighbors, matching residents, comfort and any legacy bonuses. Final coin balances may grow faster than expenses once the hard cap is reached.

| Elapsed | Active cars | Active regions | Active coins/min | Casual cars | Casual regions | Casual coins/min |
|---|---:|---:|---:|---:|---:|---:|
| 1 minute | 3 | 1 | 326 | 3 | 1 | 326 |
| 10 minutes | 4 | 1 | 723 | 4 | 1 | 688 |
| 1 hour | 7 | 3 | 4,878 | 4 | 1 | 688 |
| 1 day | 18 | 5 | 39,306 | 4 | 1 | 723 |
| 7 days | 23 | 6 | 49,665 | 8 | 3 | 5,744 |
| 30 days | 25 | 8 | 55,463 | 22 | 4 | 55,005 |

**Warning:** active results are a deliberate worst-case stress test and assume continuous manual play. Realistic activity lies far below 24-hour active participation. The 30-day active policy reaches the train cap and still accumulates spare coins; endgame coin sinks remain a future balancing opportunity. The optional timetable system provides a permanent-bonus restart without punitive energy gates. Casual runs retain region unlock requirements; unused income cannot automatically unlock new routes.

**Pricing:** new carriage cost = base × 1.95^(car count − 2); level upgrade cost = (55 + 20% of base car cost) × 2.4^(level − 1); base level rate grows ×1.27 per level; residents grant +18% each (dream match grants +10% more); station fares scale with passengers, station upgrades, satisfaction and souvenir project. Actual source functions are authoritative.

Run: `node scripts/balance.mjs`. For production economy tuning, additionally run seeded simulated play profiles and human usability studies before interpreting retention.
