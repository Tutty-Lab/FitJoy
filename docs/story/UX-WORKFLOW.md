# Bản kiểm tra UX và cốt truyện

Phạm vi: bản local để anh và khách hàng kiểm tra hành trình. Ưu tiên nội dung, điều hướng, trạng thái và ngôn ngữ. Tranh, map và chuyển động hoàn thiện sau. Không thay nội dung bài tập gốc bằng nhiệm vụ trong truyện.

## Cốt truyện

Một tấm bưu thiếp trắng xuất hiện trong bến cảng phủ sương. Vestibu cùng người chơi chuẩn bị nơi đón bạn, lần theo dấu vỏ sò qua khu rừng và tìm được phòng thư trên hải đăng. Những tấm thiệp là lời mời kết nối các nơi trên đảo. Cuối cùng chính người chơi cùng Vestibu viết lời chào mới, để đảo trở thành nơi có thể trở về.

| Ngày | Chương tiếng Việt / Deutsch | Diễn biến và cầu nối chương sau |
|---|---|---|
| 1–10 | Bến cảng trong sương / Ein Hafen im Nebel | Thắp đèn, dựng bến, tìm dấu vỏ sò. Thiệp thứ hai vẽ cây cầu. |
| 11–20 | Xưởng nhỏ bên bờ nước / Die Werkstatt am Wasser | Tìm xưởng, sửa cầu. Dưới ván cuối có chiếc lá mang dấu vỏ sò. |
| 21–30 | Lời chào gửi khu rừng / Ein Gruß an den Wald | Chuẩn bị thư hồi âm và nơi đón bạn. Qua cầu thấy nhà cây hé sáng. |
| 31–40 | Ngôi nhà cây giữ thư / Das Baumhaus der Briefe | Sắp xếp thư, tìm ra các điểm trên đảo. Tuyến thư bị đứt bên suối. |
| 41–50 | Tuyến thư bên suối / Der unterbrochene Postweg | Nối hai đoạn cầu, giữ thư khô ráo. Thư dẫn tới khoảng rừng có đốm sáng. |
| 51–60 | Khoảng rừng đom đóm / Die Lichtung der kleinen Lichter | Mở bản đồ cũ dưới ánh đom đóm. Điểm tiếp theo là hải đăng. |
| 61–70 | Con đường ven biển / Der Weg an der Küste | Tìm dấu đường, kính ngắm, chìa khóa. Thư hồi âm nằm bên cửa tháp. |
| 71–80 | Căn phòng thư trên tháp / Das Zimmer der Inselpost | Phát hiện lời mời trong album, đưa đèn nhỏ từ bến lên tháp. |
| 81–90 | Hòn đảo đón bạn về / Eine Insel, die dich willkommen heißt | Gom kỷ niệm ba vùng, viết thiệp mới, thắp ánh sáng chào đón. |

Nội dung Đức/Việt nằm trong `src/data/story.ts`, `storyChapters.ts`, `storyScenes.ts`. Mỗi ngày có dẫn trước, khám phá và lời sau. Ngày 1–7 giữ lời kể đã có; ngày 8–90 có tình tiết riêng. Lời sau dùng cấu trúc ngắn chung để xác nhận khám phá và gợi ngày kế tiếp; cuối mỗi chương có đoạn nối riêng. Đây là bản nội dung để khách hàng biên tập, chưa phải bộ tranh 90 cảnh.

## Điều hướng

Ba mục chính: **Hành trình / Reise**, **Nhật ký / Inselbuch**, **Hồ sơ / Profil**. Nhắc nhở, mục tiêu chuỗi ngày, hướng dẫn widget và ngôn ngữ ở Hồ sơ. Bỏ thanh chọn vùng khỏi trang chủ. Trang chủ chỉ có map liên tục chín chương / 90 ngày, tự mở gần ngày hiện tại. Bấm một ngày có sẵn để vào ba bước chuẩn bị. Bỏ các thẻ tóm tắt và tab Lịch; đường dẫn /calendar cũ chuyển về map.

| Màn | Thông tin chính | Hành động chính | Nhánh phụ / trạng thái |
|---|---|---|---|
| Đăng nhập / đăng ký | Tài khoản, lỗi biểu mẫu, đang xử lý | Đăng nhập / tạo tài khoản | Chọn Đức/Việt trước khi nhập; không có nút ghi nhớ giả |
| Kích hoạt | Mã mời, đang kiểm tra, lỗi | Kích hoạt | Về Hồ sơ để đổi tài khoản; không gửi yêu cầu thật trong test |
| Onboarding | Thiệp bí ẩn → cách dùng 3 × 1 phút → chuẩn bị an toàn | Tiếp tục, đến tự kiểm tra | Ba bước; không bắt thiết lập widget hoặc chọn mục tiêu |
| Tự kiểm tra đầu | Chuẩn bị, an toàn, 18 câu | Tiếp, lưu | Hoãn ở màn chuẩn bị; lưu từng câu; quay lại từ câu chưa đủ dữ liệu |
| Hành trình | Map 90 ngày, ngày hiện tại nổi bật | Bấm ngày hiện tại | Ngày cũ xem lại; ngày khóa hiện toast; tự kiểm tra và streak trong Hồ sơ |
| Hướng dẫn tập | Video, động tác, câu khẳng định, quy tắc đếm giờ | Bắt đầu 60 giây | Video có điều khiển riêng; bỏ nút xem lại trùng lặp |
| Đang tập | Video, thời gian còn lại | Tạm dừng / tiếp tục | Video dừng, tải lại hoặc chuyển nền thì đồng hồ dừng; rời bài phải xác nhận |
| Phút đầu hoàn thành | Một diễn biến truyện, đã xong 1/3 | Đến phút 2 | Tạm nghỉ về Hôm nay; bonus trong mục mở rộng |
| Phút hai hoàn thành | Đã xong 2/3, không nhận truyện trùng | Đến phút 3 | Tạm nghỉ, bonus tùy chọn |
| Phút ba hoàn thành | Đã xong 3/3 | Về Hôm nay | Bonus tùy chọn |
| Hôm nay đã tập | Diễn biến đã mở, số phút còn lại | Phút tiếp theo hoặc đọc khám phá | Nói rõ ngày tiếp theo mở vào ngày mai |
| Bonus | Tùy chọn, không mở thêm ngày | Bắt đầu, tạm dừng, tiếp tục | Xong quay về phút cơ bản tiếp theo hoặc Hôm nay |
| /calendar cũ | Không còn màn Lịch riêng | Chuyển về map | Giữ tương thích đường dẫn cũ |
| Chuẩn bị ngày tập | Ba trang: lời chào/truyện → khẳng định → số phút và bắt đầu; thanh tiến trình 1/3–3/3 | Tiếp tục, rồi bắt đầu phút tiếp theo | Quay lại từng bước; ẩn điều hướng dưới; tuyệt đối không hiện bonus trước khi hoàn thành bài |
| Nhật ký | Chín chương, mở sẵn chương hiện tại | Về phút tập hôm nay | Đọc lại các ngày đã mở; tình tiết tương lai bị ẩn |
| Chuỗi ngày | Số ngày liên tiếp, tuần, mục tiêu | Về Hôm nay | Hiện ngay; không phải vuốt để mở. Nghỉ không xóa truyện |
| Hết 90 ngày | Kết truyện, số phút còn lại | Hoàn tất phút còn lại, rồi tự kiểm tra cuối | Kết quả đã có thì mở so sánh |
| Tự kiểm tra cuối | Cùng 18 câu, lưu nháp | Lưu, xem so sánh | Hoãn và tiếp tục sau |
| Kết quả | Dữ liệu đầu/cuối, thiếu dữ liệu thể hiện rõ | Về Hôm nay | Không tự suy diễn truyện thành đánh giá y khoa |
| Hồ sơ | Ngôn ngữ, nhắc tập, chuỗi ngày, widget, tài khoản | Chọn mục muốn chỉnh | Ngôn ngữ đổi toàn app; đăng xuất/xóa giữ xác nhận sẵn có |
| Nhắc tập | Ba khung giờ, bật/tắt, tự lưu | Chỉnh giờ | Nói rõ chỉ hoạt động khi app mở; cần quyền thông báo của thiết bị |

## Quy tắc không thay đổi

- 90 ngày chương trình, ba phút cơ bản mỗi ngày, mỗi phút 60 giây.
- Phút cơ bản đầu tiên hoàn thành ngày và mở truyện. Hai phút còn lại không mở thêm truyện.
- Ngày tiếp theo chỉ mở khi đã hoàn thành ngày trước và sang ngày lịch mới. Bỏ lỡ không nhảy ngày chương trình.
- Bonus và tập lại không tạo khám phá trùng. Nghỉ không xóa tiến trình.
- Không phát sinh thêm động tác sức khỏe từ các nhiệm vụ trên đảo.
- Ngôn ngữ hiện hỗ trợ Đức và Việt. Nội dung quản trị nhập tự do giữ nguyên bản nhập, chưa tự dịch.

## Cách kiểm tra với khách hàng

1. Tạo tài khoản thử riêng; chọn ngôn ngữ trước onboarding.
2. Đi qua ba bước, thử hoãn tự kiểm tra, bấm ngày hiện tại trên map để mở ba bước chuẩn bị.
3. Trong phút đầu, tạm dừng, thử rời bài rồi chọn ở lại. Đồng hồ phải giữ nguyên khi dừng.
4. Hoàn thành phút đầu: đọc tình tiết, chọn nghỉ; trở lại phải hiện 1/3 và phút 2.
5. Hoàn thành các phút còn lại: truyện không nhận lại; ngày mai vẫn chờ ngày lịch mới.
6. Mở Nhật ký, xem chương hiện tại và một chương tương lai. Nội dung chưa mở không lộ.
7. Làm một câu tự kiểm tra, lưu sau; vào lại phải ở câu còn thiếu.
8. Đổi sang ngôn ngữ còn lại trong Hồ sơ; kiểm tra cùng các màn.

Kiểm tra tự động: `node scripts/check-story.cjs`, `check-game.cjs`, `check-program.cjs`; browser script `scripts/check-workflow-browser.js` chạy trong phiên Playwright riêng. Browser script xóa dữ liệu phiên thử; không chạy trên hồ sơ người dùng thật. Kiểm tra timer dùng media giả lập và đồng hồ ảo để kiểm tra trạng thái; không thay thế kiểm tra video/âm thanh trên iPhone thật.

## Phần còn để sau

- Tranh, animation và bố cục map chi tiết; hiện giữ cảnh SVG và clip Vestibu sẵn có.
- Video/affirmation chính thức và dữ liệu bonus bổ sung. Mẫu hiện dùng để kiểm tra luồng, không coi là nội dung sản xuất đã duyệt.
- Thông báo nền khi app đóng; ký và kiểm tra widget trên thiết bị iOS thật.
- Đăng ký/đồng bộ/xóa tài khoản thật cần kiểm tra với tài khoản thử trên backend; vòng kiểm tra này không ghi dữ liệu thật.
- Chưa triển khai Vercel hoặc gửi bản iOS mới.
