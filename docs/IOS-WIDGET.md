# FitJoy streak widget

WidgetKit target `StreakWidget` is embedded in App. Shared group: `group.com.tuttylab.fitjoy`.
The Capacitor `StreakWidget` bridge writes only activity dates, language and login status. Sign-out clears the shared data. Timeline entries recalculate the streak at midnight; iOS controls refresh scheduling.

Before a signed device build:

1. Register `com.tuttylab.fitjoy.streak` in the Apple Developer account.
2. Register the App Group and enable it for both app identifiers.
3. Regenerate the app provisioning profile; create a distribution profile for the widget.
4. `scripts/ios_ci_signing.py` now installs/exports both profiles and checks the App Group entitlement. It stops with a clear error if the Apple Developer setup is missing.
5. Build App with Xcode on macOS, add the widget on a device, complete a session, check midnight expiry, sign out, then verify no history remains. Tap the widget after both cold and warm launches.

This change has not been submitted to App Review. Native compilation/device verification requires macOS; web build success does not validate Swift or provisioning.
