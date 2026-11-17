# Gleichgewichts-Code implementation

Source: Gleichgewichts-Code-App.html (customer brief) + "Requirements cho dev" (90-day version).

## Content
- `src/data/vestibu-inhalte.json`: Excel content (90 days: phase, Begrüßung, Affirmation, Bonus-Impuls, bonus pick; 74 bonus exercises).
- Re-import after Michaela edits the Excel: `pip install openpyxl && python scripts/import-vestibu.py Vestibu_90_Tage_Texte.xlsx`.
- `src/data/program.ts`: 90 days, 3 sessions/day, 60 s practice, base exercise text, bonus every 3 days.

## Flow
- First open: Michaela/Vestibu welcome → tips → 18-task check (Stehen 1–12 / Gehen 13–17 / Sitzen 18; value + safety required).
- Home: Vestibu greeting of the day, phase, day x/90, base exercise n/3, 90-day advent calendar.
- Session: instructions (video, steps, affirmation, replay/start) → 60 s of active video playback (big affirmation) → congrats + bonus question → optional 60 s bonus. Pause/buffering/error stop the countdown; short sample clips loop. Replay starts from zero.
- Unlock: a day is done after ≥1 session; the next day opens on the next calendar day (`profile.dayDates`).
- Day 90 done → check again → comparison (grouped, average safety).

## Pending
- Affirmations are still empty; a sample sentence is shown until customer content is supplied. Bonus picks can remain empty: the customer approved seeded random selection per 3-day block. If assigned, the first valid pick in the block applies to all three days; admin edits it on the block's first day.
- AI video for the base exercise (`baseExercise.video`, currently sample video).
- Separate bonus videos/content are deferred by request. Bonus currently uses the same sample video for testing.
- Vestibu artwork and Michaela's welcome text (placeholder copy in BalanceCheck intro).
- Admin "Program" (/admin/workouts): 90-day table with missing-affirmation and bonus-block counters; per-day editor (greeting, affirmation, bonus impulse, bonus pick from the 74-exercise library); /admin/workouts/0 sets the base exercise video for all days. Overrides are stored in workout_overrides (day 0–90) and only differing fields are saved, so an Excel re-import still shows through.
- Admin custom text takes precedence in both German and Vietnamese; it is displayed verbatim, without automatic translation.

## Regression checks

- `node scripts/check-program.cjs`: isolated content/bonus/localization checks, no server writes.
- Edge browser checks completed with mocked API: playback/pause/replay, autoplay blocked, buffering/error/retry, base completion, bonus completion, session stability, calendar toast and admin block selection. See `REQUIREMENTS-AUDIT-2026-11-17.md` for scope and limitations.

## Database
- Migration `db/migrations/0005_program_90_days.sql` widens `completions.day` to 1–90 and `workout_overrides.day` to 0–90. Applied to the Neon DB from `.env.local` on 2026-11-15.
