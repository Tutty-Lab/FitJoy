# App Store release — 18 November 2026

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

Modes: `inspect`, `build`, `prepare`, `pricing`, `submit`.

- `build`: builds, signs and uploads in the same job, then revokes its temporary distribution certificate. An IPA retained after cleanup cannot be uploaded later with that revoked certificate; rebuild and upload together.
- `prepare`: sets German public metadata, category, privacy/support URLs, age declaration and selects processed build 141. Private review details were supplied through a temporary encrypted CI secret, then that secret was deleted after successful use. Existing review details remain in App Store Connect.
- `pricing`: sets the initial free download tier; preserves an already assigned price schedule.
- `submit`: creates/reuses a review draft, links the selected iOS version and submits only if Apple's validation accepts it. The user has explicitly authorized public App Review submission.

## Current blockers

Apple rejected adding the version to the review submission because these fields are incomplete:

1. iPhone screenshots (accepted large-screen iPhone screenshot family).
2. iPad 13-inch screenshots.
3. Version copyright.
4. App content-rights declaration.
5. Published App Privacy answers. This is a web-only App Store Connect step; the official API has no endpoint for these declarations.

Pricing was also reported missing by the initial validation; it has since been configured successfully.

Pending user replies: confirmation of `2026 Tutty Lab` and rights to supplied materials; permission to use Playwright for screenshots; opening the Fitjoy App Store Connect page in the visible Edge tab so the web-only privacy setup can continue.

Suggested privacy classifications must reflect the account name/identifier, optional stored email, exercise progress, self-test results and notes actually synchronized to the backend. These data support app functionality and are linked to accounts; no advertising/tracking SDK is present. Do not select “Data Not Collected.”

The German listing description explicitly states that access is provided by a participating organization/provider. The existing review demo account was verified to have active organization access; credentials are held in App Store Connect, not this document.

## Validation

`npm run build`, `node scripts/check-program.cjs`, native archive/export and Apple binary upload passed. Python release scripts were compiled locally and exercised through the GitHub workflow. Public support endpoint returns the deployed support page. The website deploys through the existing Vercel Git integration; a local Vercel CLI login is not available.
