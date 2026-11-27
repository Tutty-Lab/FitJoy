# Session coach animation slots

`src/components/SessionCoach.tsx` owns bilingual encouragement and animation slots.

Each session 1–3 supports `ready`, `guide`, `practice`, `pause`, `done`, `bonus`. Existing Vestibu mood clips are the temporary fallback. Add generated MP4 paths to `sessionCoachClips`, for example `/vestibu/session-2-ready.mp4`. Store files under `public/vestibu/`. Preserve original character artwork; muted inline playback, no generated voice required.

Flow: opening → dedicated instructions → affirmation for new users → timed practice → praise → separate optional bonus offer → story. Day sheet expands each available session with its own coach preview.

No new ElevenLabs media generated in this change.
