# Vestibu animation

`src/components/Vestibu.tsx` preserves the original Vestibu PNG. The attempted SVG redraw was removed after visual feedback. Existing `idle`, `wave` and `celebrate` states now apply a small whole-image float, tilt or bounce, without deforming the face or limbs. No independent blinking or arm animation is claimed. No Rive file is used.

`GameEffects.tsx` supplies the morphing streak flame and a bounded confetti burst. Reduced motion disables character movement and confetti. Character animation plays once.

`public/audio/reward.wav` is a locally synthesized four-note reward sound. The audio context is resumed on a workout start gesture. Playback honors the existing `chime` setting. The welcome voice button and device speech synthesis were removed at the user’s request. No user data is sent to a speech service.

ElevenLabs sound generation and voice lookup both timed out during implementation. No ElevenLabs audio was generated or integrated. Replace the static reward asset and welcome playback with reviewed recorded files when the service becomes available. Do not put API credentials in frontend code.

Verified: production web build; mobile onboarding and widget layout; streak reveal; reduced-motion confetti suppression; reward file served successfully; existing game logic checks.

Map: scoped CSS motion in src/adventure.css; useMapMotion pauses offscreen/hidden maps. Reduced motion disables map animation. scripts/check-map-motion.js verifies movement, pause, landmark feedback, day navigation; run in an isolated Playwright session only (writes preview localStorage).
