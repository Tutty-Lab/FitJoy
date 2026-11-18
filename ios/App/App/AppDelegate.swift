import UIKit
import Capacitor
import WidgetKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    static var pendingStreak = false

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        if let url = launchOptions?[.url] as? URL, url.scheme == "fitjoy", url.host == "streak" {
            AppDelegate.pendingStreak = true
        }
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        if url.scheme == "fitjoy", url.host == "streak" {
            AppDelegate.pendingStreak = true
            if let controller = window?.rootViewController as? CAPBridgeViewController {
                controller.webView?.evaluateJavaScript("window.dispatchEvent(new Event('fitjoy:streak'))", completionHandler: nil)
            }
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}

@objc(StreakWidgetPlugin)
public class StreakWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StreakWidgetPlugin"
    public let jsName = "StreakWidget"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise), CAPPluginMethod(name: "getLaunchRoute", returnType: CAPPluginReturnPromise)]
    @objc func getLaunchRoute(_ call: CAPPluginCall) {
        let pending = AppDelegate.pendingStreak
        AppDelegate.pendingStreak = false
        call.resolve(pending ? ["route": "/streak"] : [:])
    }
    @objc func update(_ call: CAPPluginCall) {
        let defaults = UserDefaults(suiteName: "group.com.tuttylab.fitjoy")
        defaults?.set(call.getArray("dates", String.self) ?? [], forKey: "activeDates")
        defaults?.set(call.getBool("signedIn") ?? false, forKey: "signedIn")
        defaults?.set(call.getString("language") ?? "de", forKey: "language")
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }
}

@objc(FitJoyBridgeViewController)
class FitJoyBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(StreakWidgetPlugin())
    }
}
