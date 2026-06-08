# Conway's Game of Life

A browser implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), a cellular automaton where simple rules produce surprisingly complex behaviour.

## The rules

Each cell on the grid is either alive or dead. On every generation:

1. A live cell with **2 or 3** live neighbours survives.
2. A live cell with fewer than 2 neighbours dies (underpopulation).
3. A live cell with more than 3 neighbours dies (overpopulation).
4. A dead cell with **exactly 3** live neighbours becomes alive (reproduction).

That's it — everything else (gliders, oscillators, still lifes) emerges from those four rules.

## Running it

No build step or dependencies. Just open `index.html` in a browser:

```bash
open index.html      # macOS
# or simply double-click the file
```

## Controls

- **Start / Stop** — run or pause the simulation
- **Step** — advance a single generation
- **Randomize** — seed the grid randomly
- **Clear** — empty the grid
- **Speed** — generations per second
- **Click / drag** on the grid to draw your own patterns

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup and controls |
| `style.css` | Styling |
| `game.js` | Grid, rules, rendering, and input |
