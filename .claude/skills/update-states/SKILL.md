---
name: update-states
description: Research and update the active/inactive sportsbook lists in src/data/sportsbooks.json for US states where online sports betting is legal. Use this skill whenever the user asks to update, sync, research, or audit sportsbooks for any US state — or when they say something like "check what's changed", "are there new books in X", "update the list", or "research sportsbooks". The skill handles fetching current state from official sportsbook and state gaming authority sources, comparing against the existing JSON, and writing the diff back with cited sources.
---

## Scope

**Only research and update the specific state(s) the user names.** If the user says "update Colorado and New York", touch only those two entries. Do not research or modify any other states, even if you notice potential issues elsewhere. If the user doesn't name a state, ask them which state(s) to update before proceeding.

## Goal

You're maintaining `src/data/sportsbooks.json` — a state-by-state record of which online sportsbooks are **active** (accepting wagers now) and which are **inactive** (formerly active, now closed or acquired). Your job is to research only the requested states, identify what's changed, and write those changes back to the file with cited sources.

## Data structure

Each state entry looks like this:

```json
"colorado": {
  "legal": true,
  "updatedAt": "2025-12-01",
  "active": [
    { "name": "DraftKings" },
    { "name": "FanDuel" }
  ],
  "inactive": [
    {
      "name": "Barstool Sportsbook",
      "status": "Became ESPNBet",
      "date": "2023-11-14"
    }
  ]
}
```

- `active` — sportsbooks currently live and accepting wagers in that state
- `inactive` — books that were once active but are no longer (closed, acquired, rebranded)
  - `status` — brief reason: "Closed", "Acquired by Fanatics", "Became ESPNBet", etc.
  - `date` — best known date it stopped operating in that state (empty string `""` if unknown)
- `updatedAt` — set this to today's date (ISO 8601: YYYY-MM-DD) for any state you modify

## Research process

### Step 1 — Read the current file

Read `src/data/sportsbooks.json` and note the current active/inactive lists **only for the states the user specified**. Ignore all other states.

### Step 2 — Check sportsbook sources (primary)

These sportsbooks publish their own state availability pages. **Check these first** — they're authoritative for the books that maintain them:

| Sportsbook | URL |
|---|---|
| PrizePicks | https://www.prizepicks.com/resources/states-where-you-can-play-prizepicks |
| Bet365 | https://www.bet365.com/usa |
| Fanatics | https://betfanatics.my.site.com/FBGSupport/s/article/Where-is-Fanatics-Sportsbook-available |
| Hard Rock Bet | https://www.hardrock.bet/sportsbook/ |
| BetMGM | https://sports.betmgm.com/en/blog/discover-betmgm-across-america/ |
| BetRivers | https://www.betrivers.com/ |
| DraftKings | https://sportsbook.draftkings.com/help/sports-betting/where-is-sports-betting-legal |
| Circa | https://www.circasports.com/ |
| Bally Bet | https://play.ballybet.com/promo/sports/p/brand-bet10-get50/ |
| Betfred | https://betfredsports.com/ |
| TwinSpires | https://www.twinspires.com/edge/help/our-story/ |
| ESPN Bet | https://about.espnbet.com/ |

### Step 3 — Check state gaming authority sources (secondary)

Some states publish official registries. Check these for the relevant states:

| State | URL |
|---|---|
| Colorado | https://docs.google.com/spreadsheets/d/10U_66tIi87Et38MplUEUTS39EvnEghVzP3gZd2tDAXI/edit?gid=1190930214#gid=1190930214 |
| New York | https://gaming.ny.gov/sports-wagering |

For other states, use web search to find any official gaming commission pages.

### Step 4 — Determine changes

Compare what you found against the current file:

**Additions** — A sportsbook is confirmed active in a state but is not in the state's `active` array. Add it as `{ "name": "BookName" }`.

**Inactives** — A sportsbook is in the state's `active` array but you've confirmed it's no longer operating there. Move it to `inactive` with a `status` and `date`.

Only report changes you can substantiate from the sources above or credible web search results. If you can't confirm either way, leave it alone and note the uncertainty.

### Step 5 — Update this skill with any new sources discovered

While researching, you may encounter useful sources not listed above — a sportsbook that now publishes a state-availability page, or a state gaming commission that maintains a public registry. If a source proved genuinely useful for verifying active/inactive status, add it to this skill file so future runs benefit from it.

- New sportsbook availability pages → add a row to the sportsbook sources table in Step 2
- New state gaming authority pages → add a row to the state sources table in Step 3

Only add sources that are authoritative and likely to stay current (official sportsbook sites, government gaming commission pages). Skip news articles, aggregator sites, or anything that felt like a one-off find.

Edit `.claude/skills/update-states/SKILL.md` directly with any additions before writing the sportsbooks.json changes.

### Step 6 — Write changes and report

1. Edit `src/data/sportsbooks.json` with all confirmed changes
2. Update `updatedAt` for each modified state to today's date
3. Report a summary of every change with its source URL, and note any sources added to this skill

## Naming conventions

Use the end-user brand name, not the license holder:
- "BetRivers" not "Rush Street Interactive"
- "ESPNBet" not "Penn Entertainment"
- "Fanatics" not "PointsBet" (after acquisition)

Match the capitalization and spacing already used in the file for consistency. If a book appears under a new name, add the old name as inactive with `status: "Became [NewName]"`.

## Change report format

After updating the file, provide a report like this:

```
## Changes — [State Name]

**Added:**
- BookName — Source: [URL]

**Moved to inactive:**
- BookName — Status: "Closed" — Date: 2024-06-01 — Source: [URL]

**No changes found for:** [list of states with no changes]
```

If you're uncertain about a change (can't confirm from a primary source), call it out rather than guessing.
