# FitJoy yoga MVP: tài khoản, doanh nghiệp, phân phối

Ngày nghiên cứu: 11/11/2026. Đây là đề xuất triển khai; chưa xây redeem, thanh toán hoặc phân quyền doanh nghiệp.

## Quyết định đã chốt

- PWA trước; App Store/Google Play sau.
- Doanh nghiệp cấp quyền cho nhân viên nội bộ; chưa triển khai cho bệnh nhân.
- Ưu tiên mã mời nhân viên tự redeem; IAP chưa thuộc phạm vi MVP PWA.

## Đề xuất

Ra PWA trước, dùng một tài khoản cá nhân xuyên iOS/Android. Doanh nghiệp mua số lượng quyền sử dụng qua hợp đồng/hóa đơn; hệ thống phát mã mời dùng một lần để nhân viên tự tạo tài khoản và nhận quyền. Không tạo sẵn mật khẩu hàng loạt.

Tách bốn khái niệm: tài khoản, tư cách thành viên tổ chức, quyền dùng chương trình, giao dịch thanh toán. Cài lại app hoặc đổi điện thoại không làm mất quyền. Chu kỳ nội dung 22 ngày không mặc định là thời hạn hợp đồng.

## Flow MVP

1. Nhận link/mã mời từ công ty hoặc mở trang đăng ký cá nhân.
2. Tạo username + mật khẩu; người đã có tài khoản đăng nhập để redeem. Không cần email.
3. Server xác thực mã, gắn tài khoản vào tổ chức, cấp quyền chương trình trong một transaction.
4. Làm check ban đầu ngắn, có thể lưu dở; vào Home, mở bài hôm nay, xem video và hoàn thành bài.
5. Lưu tiến độ; chọn ba giờ nhắc nếu muốn; ngày 22 làm lại check và xem so sánh.

MVP chỉ cần một chương trình yoga/balance rõ nội dung, một người sử dụng mỗi tài khoản. Chưa thêm đặt lịch khám, hồ sơ bệnh án, chat bác sĩ, thư viện nhiều khóa hoặc white-label riêng từng công ty.

Nội dung hiện tại còn mẫu fitness, coach và video mẫu. Cần thay bằng giáo trình yoga thật và xác nhận ý nghĩa của 18 bài check trước khi bán. Không tự suy ra điểm chẩn đoán từ dữ liệu check.

## Mã và số lượng quyền

- Một mã cho một suất, dùng một lần; không dùng một mã chung cho toàn công ty.
- Mã ngẫu nhiên đủ mạnh, lưu hash/HMAC trên server, giới hạn lần thử và thời hạn redeem.
- Link mời chỉ mang mã; không chứa mật khẩu hoặc dữ liệu sức khỏe. Không ghi mã vào log/analytics.
- Redeem phải atomic: khóa/cập nhật có điều kiện, kiểm hạn hợp đồng, chống vượt số suất và chống hai tài khoản dùng cùng mã.
- Retry của cùng tài khoản không trừ thêm suất. Tài khoản đã thuộc tổ chức khác phải xử lý rõ, không tự chuyển dữ liệu.
- Phân biệt hạn sử dụng mã với hạn dùng chương trình. Mã đã dùng không bị vô hiệu chỉ vì hết hạn redeem sau đó.
- Admin được phát thêm, hủy mã chưa dùng, xem số suất đã cấp; cần chính sách riêng nếu thu hồi/tái cấp suất đang dùng.
- Không có email thì cần flow khôi phục: mã khôi phục một lần hoặc tổ chức xác minh và cấp reset ngắn hạn. Không cho quản trị viên xem mật khẩu.

## Mô hình dữ liệu tối thiểu

| Bảng | Trách nhiệm |
| --- | --- |
| organizations | Doanh nghiệp, trạng thái hợp đồng |
| organization_members | user_id, organization_id, vai trò trong tổ chức |
| license_batches | Chương trình, số suất mua, thời hạn quyền |
| invitation_codes | code_hash, batch_id, redeem_before, redeemed_by, redeemed_at, revoked_at |
| entitlements | Quyền chương trình của user, nguồn cấp, hiệu lực, trạng thái |
| audit_events | Ai phát/hủy/redeem mã; không ghi dữ liệu sức khỏe hoặc mã gốc |
| purchases (giai đoạn store) | Store, transaction ID duy nhất, user, trạng thái xác minh |

Ràng buộc unique, foreign key và transaction phải ở DB. Kiểm quyền ở mọi API và đường cấp video; chỉ chặn bằng giao diện không bảo vệ được nội dung trả phí.

Giữ platform admin riêng với organization admin. Endpoint admin/members hiện xem toàn bộ người dùng: không được cấp trực tiếp cho doanh nghiệp. Organization admin chỉ thấy thành viên của tổ chức mình và dữ liệu được phép. Mặc định báo cáo số suất/tiến độ tổng hợp, không cho doanh nghiệp đọc ghi chú hay kết quả sức khỏe cá nhân.

## PWA, native và thanh toán

| Kênh | Cài đặt | Thanh toán/quyền sử dụng |
| --- | --- | --- |
| PWA trên iPhone | Mở web, Share, Add to Home Screen | Thanh toán web hoặc hợp đồng B2B; mã redeem do FitJoy quản lý |
| PWA trên Android | Mở web, Install/Add to Home Screen tùy trình duyệt | Cùng backend/quyền như iPhone |
| Capacitor trên App Store | App native qua xét duyệt Apple | StoreKit cho IAP; bán B2B và redeem phải đối chiếu mô hình thực tế với chính sách |
| Capacitor trên Google Play | App native qua Google Play | Play Billing cho bán nội dung số trong app; có thể cân nhắc app consumption-only |

PWA thông thường không gọi StoreKit/Google Play Billing như app native. Web checkout vẫn dùng được. Bọc Capacitor không tự có IAP; cần SDK, sản phẩm store, xác minh giao dịch và xử lý vòng đời mua hàng.

Apple 3.1.1 hạn chế dùng license key/QR tự phát để mở nội dung số trong app. 3.1.3(c) cho ngoại lệ khi app chỉ bán trực tiếp cho tổ chức để nhân viên/học sinh dùng; không mặc định áp dụng cho app bán lẻ hỗn hợp hoặc bệnh nhân của phòng khám. Đưa redeem sang web không tự làm mô hình native hợp lệ. Apple 3.1.3(b) cũng có điều kiện cho nội dung mua trên nền tảng khác. Không mặc định FitJoy là reader app chỉ vì có video.

Google cho phép consumption-only: đăng nhập để dùng nội dung đã mua bên ngoài, không bán trong app. Nếu bán khóa yoga/subscription số ngay trong app Play thì thường phải dùng Play Billing, trừ ngoại lệ/chương trình vùng áp dụng. Cần xác định thị trường bán trước khi chọn flow thanh toán ngoài store.

Khách hàng là bệnh viện không tự biến khóa yoga số thành dịch vụ khám chữa bệnh được miễn billing. Dịch vụ lâm sàng thực tế là sản phẩm khác, cần đánh giá riêng.

Nếu bổ sung bán lẻ native: cân nhắc non-consumable cho một khóa cố định hoặc subscription khi có giá trị/nội dung liên tục. RevenueCat có SDK Capacitor cho iOS/Android, nhưng không miễn quy định store. Gắn giao dịch với user ID ổn định; hỗ trợ restore, chống claim chéo tài khoản, webhook có chữ ký, idempotency, refund/revoke và hết hạn. Server cấp entitlement, không tin kết quả thành công do client gửi lên.

## Những việc còn thiếu trước khi gọi là MVP bán được

1. Đã chốt PWA trước, nhân viên nội bộ. Còn cần xác định thị trường và khóa mua một lần hay quyền theo thời hạn.
2. Nội dung yoga thật, video thật, flow check và hướng dẫn an toàn phù hợp đối tượng.
3. Mời/redeem, khôi phục tài khoản, kiểm quyền server và media; rate limit login/signup/redeem.
4. Đồng bộ đáng tin cậy: trạng thái lưu lỗi, retry/idempotency, không báo đã lưu khi chỉ ghi local. Cache PWA hiện không đồng nghĩa video offline hoặc dữ liệu đã đồng bộ.
5. Thử trên iPhone/Android thật: cài PWA, đăng nhập lại, đổi máy, mất mạng, redeem trùng/hết hạn, hết quyền và cách ly tổ chức.
6. Nhắc nền riêng: Web Push cần backend/scheduler và quyền thiết bị; iOS web push yêu cầu home-screen web app trên phiên bản hỗ trợ. Timer khi mở app không phải thông báo khi đóng app.
7. Nếu lên store: build native, IAP nếu có bán lẻ trong app, restore/refund, nội dung riêng tư và review notes. Apple 4.2 yêu cầu giá trị vượt việc chỉ đóng gói lại một website.

## Nguồn chính thức đã đọc

- Apple App Review Guidelines, 3.1.1, 3.1.3(b/c), 4.2: https://developer.apple.com/app-store/review/guidelines/
- Apple Custom Apps / Apple Business Manager: https://developer.apple.com/support/volume-purchase-and-custom-apps/
- Google Play Payments policy: https://support.google.com/googleplay/android-developer/answer/9858738?hl=en
- Google Play Payments FAQ, consumption-only: https://support.google.com/googleplay/android-developer/answer/10281818?hl=en
- PWA installation: https://web.dev/learn/pwa/installation/
- RevenueCat Capacitor SDK: https://www.revenuecat.com/docs/getting-started/installation/capacitor

Chính sách theo storefront và chương trình có thể thay đổi; kiểm tra lại khi chốt thị trường và trước khi submit. Đây là đánh giá kỹ thuật, không phải bảo đảm được store duyệt.
