# App Store release — 18 November 2026

**Submitted successfully.** Version `1.0` (build `141`) is `WAITING_FOR_REVIEW`.

- Review submission: `c4da1e1e-d4af-48b3-b747-06d11591d662`.
- Confirmed submission run: https://github.com/Tutty-Lab/nail-game/actions/runs/44219220929
- The owner completed and published App Privacy answers before submission; Apple's final validation accepted the listing.

- App Store Connect app: `6836089248`, current listing name `Fitjoy`.
- Product name in the customer requirements: **Der Gleichgewichts-Code**. No listing rename has been requested.
- Bundle ID: `com.tuttylab.fitjoy`; Apple team: `5MNN7PQYBD`.
- Version `1.0`, build `141`, uploaded successfully and processed as `VALID`; selected for the iOS version.
- Native build source: `a61139d58144096e894859a6d984bf8d262e15fa`.
- Successful upload: https://github.com/Tutty-Lab/nail-game/actions/runs/44196741467
- Free download pricing configured: https://github.com/Tutty-Lab/nail-game/actions/runs/44200168420
- Public support: https://fit-joy.vercel.app/support.html
- Public privacy policy: https://fit-joy.vercel.app/privacy

## Release workflow

The user authorized using the existing Apple API key in `Tutty-Lab/nail-game` for FitJoy. The separate `.github/workflows/fitjoy-release.yml` there checks out a pinned FitJoy commit; it does not change the Nail Play build workflow. Apple credentials have not been copied into FitJoy.

Modes: `inspect`, `build`, `prepare`, `pricing`, `rights`, `screenshots`, `submit`.

- `build`: builds, signs and uploads in the same job, then revokes its temporary distribution certificate. An IPA retained after cleanup cannot be uploaded later with that revoked certificate; rebuild and upload together.
- `prepare`: sets German public metadata, category, privacy/support URLs, age declaration and selects processed build 141. Private review details were supplied through a temporary encrypted CI secret, then that secret was deleted after successful use. Existing review details remain in App Store Connect.
- `pricing`: sets the initial free download tier; preserves an already assigned price schedule.
- `submit`: creates/reuses a review draft, links the selected iOS version and submits only if Apple's validation accepts it. The user has explicitly authorized public App Review submission.

## Completed requirements

No submission blockers remain. Apple review is pending.

German screenshots are uploaded and processed as complete: three iPhone captures at 1320×2868, three iPad captures at 2064×2752. The actual local app was captured using the existing demo account without changing its data. Source images are in `store/app-store/de-DE/`.

The owner confirmed `2026 Tutty Lab` and rights to the supplied materials; copyright and content-rights declaration have been saved. Pricing is free. Screenshot upload: https://github.com/Tutty-Lab/nail-game/actions/runs/44215911735

The earlier validation run https://github.com/Tutty-Lab/nail-game/actions/runs/44216145769 reported only App Privacy missing. The owner completed this web-only step, then the successful submission run above confirmed `WAITING_FOR_REVIEW`.

Suggested privacy classifications must reflect the account name/identifier, optional stored email, exercise progress, self-test results and notes actually synchronized to the backend. These data support app functionality and are linked to accounts; no advertising/tracking SDK is present. Do not select “Data Not Collected.”

The German listing description explicitly states that access is provided by a participating organization/provider. The existing review demo account was verified to have active organization access; credentials are held in App Store Connect, not this document.

## Validation

`npm run build`, `node scripts/check-program.cjs`, native archive/export and Apple binary upload passed. Python release scripts were compiled locally and exercised through the GitHub workflow. Public support endpoint returns the deployed support page. The website deploys through the existing Vercel Git integration; a local Vercel CLI login is not available.
