# Economy validation

Baseline: starting sleeper earns 1.45 coins/second, café earns 2.1 coins/second. Combined income is **3.55 coins/second**, or **213 coins/minute**, before upgrades or adjacency effects. The starter wallet contains 160 coins and 42 pending coins; one first-level sleeper upgrade costs 99. A third sleeper costs 220, meaning players can reasonably expand in the opening minute.

| Elapsed real time | Passive income (no upgrades) | Offline accrual rule | Design interpretation |
| --- | ---: | --- | --- |
| 1 minute | 213 | full | First collectible income, immediate upgrade viable |
| 10 minutes | 2,130 | full | Several carriages affordable; station fares add bonuses when active |
| 1 hour | 12,780 | full | Advance multiple levels and purchase mid-game cars |
| 1 day away | 102,240 | capped at 8h | Optional return without punishment for not playing daily |
| 7 days away | 102,240 | capped at 8h | Same cap as one day; no exponential runaway |

These values are an **unchanged starter train** scenario, not a prediction of player behavior. Income changes with purchases, upgrade levels (+42% base income per level), room adjacency (+12% conditional bonus), and comfort (+6% train-wide per level). Station fares and postcards are only simulated while the game is active; offline accrual deliberately does **not** generate unlimited stops or rare events.

No costs are randomized. Carriage purchase prices increase by 24% for each carriage beyond the starting pair; type base costs range from 220 to 3,700. Prices are evaluated once and deducted only after the funds/unlock checks pass. Eight destinations create a small collectibles circuit. Experience should reward quick interactions, but full prestige/long-form progression is not implemented in v1.
