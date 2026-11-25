# Rive animated objects for the adventure map

Drop `.riv` files here to place animated, optionally interactive objects on the
island map (steam, a stretching cat, waddling ducks, a bobbing umbrella …).

## Steps
1. Build or export a `.riv` in the Rive editor (https://rive.app) — or download a
   community file. Keep it small and with a transparent background.
2. Copy it into this folder, e.g. `public/rive/harbor-cat.riv`.
3. Register it in `src/components/MapRive.tsx` → `RIVE_OBJECTS`:

   ```ts
   { region: 'harbor', x: 46, y: 35, w: 90, h: 90,
     src: '/rive/harbor-cat.riv', stateMachine: 'Motion', trigger: 'tap' }
   ```

## Conventions
- `region`: `'harbor'` (home), `'forest'` (neighbourhood) or `'lighthouse'` (park).
- `x` / `y`: percent position on the map (0–100), same frame as the hotspots.
- `w` / `h`: pixel size of the object.
- `stateMachine` (optional): the state machine to play, e.g. `"Motion"`.
- `trigger` (optional): a **trigger** input inside that state machine; tapping the
  object fires it (e.g. the cat stretches). Leave out for a purely looping object.

A missing or broken file renders nothing — safe to commit entries before the art
is final.
