import WidgetKit
import SwiftUI

private let group = "group.com.tuttylab.fitjoy"

struct StreakEntry: TimelineEntry {
    let date: Date
    let streak: Int
    let done: Bool
    let signedIn: Bool
    let vietnamese: Bool
}

struct StreakProvider: TimelineProvider {
    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(date: Date(), streak: 7, done: true, signedIn: true, vietnamese: false)
    }
    func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
        completion(context.isPreview ? placeholder(in: context) : entry(at: Date()))
    }
    func entry(at now: Date) -> StreakEntry {
        let defaults = UserDefaults(suiteName: group)
        let dates = Set(defaults?.stringArray(forKey: "activeDates") ?? [])
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.dateFormat = "yyyy-MM-dd"
        let done = dates.contains(formatter.string(from: now))
        var cursor = done ? now : Calendar.current.date(byAdding: .day, value: -1, to: now)!
        var streak = 0
        while dates.contains(formatter.string(from: cursor)) {
            streak += 1
            cursor = Calendar.current.date(byAdding: .day, value: -1, to: cursor)!
        }
        return StreakEntry(date: now, streak: streak, done: done, signedIn: defaults?.bool(forKey: "signedIn") ?? false, vietnamese: defaults?.string(forKey: "language") == "vi")
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
        let now = Date()
        let midnight = Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: now)!)
        let next = Calendar.current.date(byAdding: .day, value: 1, to: midnight)!
        completion(Timeline(entries: [entry(at: now), entry(at: midnight), entry(at: next)], policy: .after(next)))
    }
}

struct StreakView: View {
    let entry: StreakEntry
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "flame.fill").font(.system(size: 42)).foregroundColor(entry.done ? .orange : .gray)
                Spacer()
                Image("Vestibu").resizable().scaledToFit().frame(width: 44, height: 50).accessibilityHidden(true)
                Text("FitJoy").font(.headline).foregroundColor(Color(red: 0.07, green: 0.44, blue: 0.49))
            }
            Text(entry.signedIn ? "\(entry.streak) " + (entry.vietnamese ? "ngày" : "Tage") : (entry.vietnamese ? "Cùng tập nhé!" : "Los geht’s!"))
                .font(.system(size: 28, weight: .heavy, design: .rounded)).minimumScaleFactor(0.7).lineLimit(1)
            Text(!entry.signedIn ? (entry.vietnamese ? "Mở FitJoy để đăng nhập" : "FitJoy öffnen und anmelden") : entry.done ? (entry.vietnamese ? "Hôm nay đã hoàn thành!" : "Heute geschafft!") : (entry.vietnamese ? "Một phút để giữ lửa" : "Eine Minute für deinen Streak"))
                .font(.system(size: 12, weight: .semibold, design: .rounded)).foregroundColor(.secondary)
        }
        .padding(16)
        .widgetURL(URL(string: "fitjoy://streak"))
    }
}

@main
struct FitJoyStreakWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "FitJoyStreak", provider: StreakProvider()) { entry in
            if #available(iOSApplicationExtension 17.0, *) {
                StreakView(entry: entry).containerBackground(Color(red: 1, green: 0.97, blue: 0.90), for: .widget)
            } else {
                StreakView(entry: entry).background(Color(red: 1, green: 0.97, blue: 0.90))
            }
        }
        .configurationDisplayName("FitJoy Streak")
        .description("Deine tägliche Minute im Blick. / Theo dõi chuỗi ngày luyện tập.")
        .supportedFamilies([.systemSmall, .systemMedium])
        .contentMarginsDisabled()
    }
}
