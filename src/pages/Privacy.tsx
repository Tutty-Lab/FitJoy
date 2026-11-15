import type { ReactNode } from 'react'
import { SubPage } from '../components/shared'
import { L } from '../lib/i18n'

// Public privacy policy (linked from Profile and from the App Store listing: /privacy).
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5 text-sm leading-6 text-[#3f4a4b] shadow-[0_8px_20px_-8px_rgba(200,220,218,0.6)]">
      <h2 className="mb-1 text-base font-bold text-[#151c27]">{title}</h2>
      {children}
    </section>
  )
}

export default function Privacy() {
  return (
    <SubPage title={L('Datenschutz', 'Chính sách bảo mật')} back="/profile">
      <p className="text-xs text-[#6f7472]">{L('Stand: 16. November 2026 · Tutty Lab', 'Cập nhật: 16/11/2026 · Tutty Lab')}</p>
      <Block title={L('Was wir speichern', 'Chúng tôi lưu gì')}>
        {L('Deinen Namen, deinen Benutzernamen und ein verschlüsseltes Passwort für dein Konto. Außerdem deinen Übungsfortschritt, die Ergebnisse deiner Selbsttests und deine Erinnerungszeiten, damit sie zwischen deinen Geräten synchronisiert werden.', 'Tên, tên đăng nhập và mật khẩu đã mã hóa cho tài khoản của bạn. Ngoài ra là tiến trình tập, kết quả các bài tự kiểm tra và giờ nhắc, để đồng bộ giữa các thiết bị của bạn.')}
      </Block>
      <Block title={L('Wofür wir die Daten nutzen', 'Chúng tôi dùng dữ liệu để làm gì')}>
        {L('Nur um die App zu betreiben: dich anzumelden, deinen Plan und Fortschritt zu zeigen und das Übungsprogramm zu verbessern. Wir verkaufen keine Daten, zeigen keine Werbung und nutzen kein Tracking durch Dritte.', 'Chỉ để vận hành ứng dụng: đăng nhập, hiển thị lộ trình và tiến trình của bạn, và cải thiện chương trình tập. Chúng tôi không bán dữ liệu, không hiển thị quảng cáo và không dùng công cụ theo dõi của bên thứ ba.')}
      </Block>
      <Block title={L('Wo die Daten liegen', 'Dữ liệu được lưu ở đâu')}>
        {L('Auf Servern von Vercel und Neon (Postgres), verschlüsselt übertragen. Erinnerungen und Mitteilungen laufen auf deinem Gerät.', 'Trên máy chủ của Vercel và Neon (Postgres), được mã hóa khi truyền. Lời nhắc và thông báo được xử lý trên thiết bị của bạn.')}
      </Block>
      <Block title={L('Deine Möglichkeiten', 'Quyền của bạn')}>
        {L('Unter Profil → Daten sichern kannst du jederzeit eine Kopie herunterladen. Unter Profil → Konto löschen entfernst du dein Konto und deinen gesamten Fortschritt dauerhaft.', 'Vào Hồ sơ → Sao lưu dữ liệu để tải bản sao bất cứ lúc nào. Vào Hồ sơ → Xóa tài khoản để xóa vĩnh viễn tài khoản và toàn bộ tiến trình.')}
      </Block>
      <Block title={L('Gesundheitshinweis', 'Lưu ý sức khỏe')}>
        {L('Die App bietet allgemeine Gleichgewichtsübungen und ersetzt keine ärztliche Beratung. Sprich bei Beschwerden oder Unsicherheit vorher mit deiner Ärztin oder deinem Arzt.', 'Ứng dụng cung cấp các bài tập thăng bằng chung và không thay thế tư vấn y tế. Nếu có triệu chứng hoặc chưa chắc chắn, hãy hỏi ý kiến bác sĩ trước.')}
      </Block>
      <Block title={L('Kontakt', 'Liên hệ')}>
        {L('Fragen oder Löschanfragen: Wende dich an den Support deines Anbieters.', 'Câu hỏi hoặc yêu cầu xóa dữ liệu: vui lòng liên hệ bộ phận hỗ trợ.')}
      </Block>
    </SubPage>
  )
}
