# Rà soát requirements — 17/11/2026

Kết luận rà soát ban đầu: luồng chính đã có, chưa đủ để xác nhận bàn giao hoàn chỉnh.

## Cập nhật sau triển khai sửa lỗi

Theo yêu cầu tiếp theo: sửa hành vi bằng dữ liệu mẫu; nội dung/video bonus chính thức bổ sung sau.

- Đã sửa timer/video: chỉ đếm khi video thực sự phát; tạm dừng, buffering, seek, media error hoặc autoplay bị chặn đều ngừng đếm. Resume dùng cùng nút điều khiển video. Video mẫu ngắn được lặp cho đủ phút tập.
- Đã sửa replay: tua về 0 trước khi phát.
- Đã giữ số session ổn định trong lúc tập/ghi hoàn thành, kể cả URL không có `?session=`; query session không hợp lệ dùng fallback hợp lệ.
- Đã sửa bonus block: lựa chọn hợp lệ đầu tiên trong block thắng cho cả ba ngày; bỏ qua ID không còn trong thư viện. Admin chỉnh bonus tại ngày đầu block, hai ngày sau hiển thị cùng lựa chọn.
- Đã sửa bản Việt: override từ admin ưu tiên hơn JSON dịch. Custom text hiển thị nguyên văn, có giải thích trong admin; không tự tạo bản dịch.
- Đã sửa metadata PWA 90 ngày/tiếng Đức, lời báo lỗi video và các hint admin cũ. Thêm nút thử lại video.
- Sửa link ngày trước/sau của admin để dùng semantics link, tránh lỗi Base UI trong console.
- Giữ nguyên nội dung mẫu: 90 affirmation thật chưa có, video chính thức/riêng cho bonus chưa có. Không tạo hoặc nhập dữ liệu mới.

Kiểm chứng sau sửa:

- Browser Edge riêng, profile test, toàn bộ API được mock: replay, phát thực, pause/resume, blocked autoplay, waiting/error/retry, đủ 60 giây ghi đúng một session, bonus reset 60 giây và không ghi thêm session cơ bản, URL không truyền session.
- Home hiển thị số ngày trong thanh tiến độ; DayReview không còn subtitle giai đoạn; toast xuất hiện/đóng/tự ẩn. Kiểm tra overflow DayReview ở 320/768/1024/1440 px; xem ảnh Home, màn tập, toast ở mobile.
- Admin round-trip với API giả lập: save nội dung và bonus, ngày 2/3 cùng lựa chọn, nội dung admin hiện ở tiếng Việt; không có console error mới sau sửa link.
- `node scripts/check-program.cjs`: regression cho cả Đức/Việt, 30 block ổn định, picks xung đột/ID hỏng, block cuối, override và fallback.
- Không ghi dữ liệu test lên server. Những mục bên dưới mô tả phát hiện tại thời điểm audit ban đầu; các mục 3–7 đã được xử lý trong phạm vi nêu trên.

## Căn cứ và phạm vi

- Requirements gốc trong session Claude “Gleichgewichts-Code app requirements”, các phiên tiếp nối, các chỉnh sửa trong chat Codex hiện tại.
- Đọc source app, admin, API, script nhập Excel; chạy logic thật của program/progress trong môi trường bộ nhớ riêng; GET public catalog qua local API.
- Không sửa database, không dùng dữ liệu tài khoản để chạy thử, không ghi admin/server.
- Build gần nhất của các chỉnh sửa UI hiện tại đã pass. Chưa kiểm tra trực quan hoặc chạy end-to-end vì công cụ browser chưa kết nối được. Chưa kiểm tra production hay migration trực tiếp trên DB.
- Nội dung Word được đối chiếu qua lịch sử session; chưa đọc độc lập bản Word gốc trong lần rà soát này.

## Những thay đổi yêu cầu đã được chấp thuận

Không coi những điểm sau là lỗi so với bản requirements ban đầu:

- Khách đã bổ sung: “Die Übungen können Random einfliessen.” Bonus ngẫu nhiên được phép; hiện dùng thứ tự xáo có seed, cố định cho mọi người.
- Cho phép thoát/hoãn bài tự kiểm tra, làm lại mà không bị khóa trong màn check.
- Bổ sung tiếng Việt bên cạnh tiếng Đức mặc định.
- Tách lịch ra màn riêng; khóa lại ngày tương lai, giữ nút refresh.
- Bonus có thêm đếm ngược 1 phút, video và quote.
- Đã bỏ XP; giữ giao diện clay/cartoon.

## Đối chiếu luồng chính

| Yêu cầu | Kết quả |
| --- | --- |
| 90 ngày, 3 giai đoạn × 30 ngày | Đạt ở dữ liệu và logic |
| Một bài cơ bản, tối đa 3 lần/ngày chương trình | Có; ghi nhận session không trùng |
| Lời chào Vestibu từng ngày | Đủ 90 câu |
| Mỗi ngày một câu khẳng định, cả 3 lần cùng câu | UI/logic có; thiếu toàn bộ nội dung thật |
| Hướng dẫn có video, bước tập, quote, xem lại/bắt đầu | Có; nút xem lại chưa thực sự tua lại |
| Tập 60 giây, quote lớn, chúc mừng | Có; timer và video chưa đồng bộ |
| Hỏi bonus sau mỗi lần tập, không bắt buộc | Có |
| Bonus 1 phút, video, quote | Có màn hình; video dùng lại bài cơ bản |
| Cùng bonus trong một block 3 ngày | Đạt với dữ liệu hiện tại; cấu hình admin có thể phá quy tắc |
| Hoàn thành ≥1 session mới mở ngày tiếp theo | Đạt logic: ngày tiếp mở vào ngày lịch sau |
| Không xem trước ngày khóa | Có chặn ở Calendar, DayReview, WorkoutDetail |
| Check 18 bài, nhóm 12 Đứng / 5 Đi / 1 Ngồi | Đạt số lượng, nhóm |
| Kết quả số, an toàn 1–10, nhận thấy đa chọn, ghi chú | Có; chặn chuyển tiếp/lưu khi thiếu kết quả hoặc an toàn |
| Check lại sau ngày 90, so sánh đủ 18 bài | Có gate, dùng chung danh sách, có bảng và an toàn trung bình |
| Nhập lại Excel thành JSON | Có script; chưa chạy nhập lại file trong lần rà soát này |
| Admin chỉnh nội dung 90 ngày, video chung | Có source; chưa kiểm thử thao tác lưu bằng phiên admin trong lần này |
| Home: số ngày trong progress, bỏ nhãn suy nghĩ | Đã sửa local |
| Trang ngày: bỏ dòng giai đoạn | Đã sửa local |
| Ngày khóa: toast cartoon thay thông báo trong thẻ | Đã sửa local; tự ẩn 6 giây, đóng bằng nút hoặc Escape |

## Phát hiện cần xử lý

### 1. Thiếu nội dung khẳng định thật — chặn bàn giao nội dung

- JSON có 90/90 trường affirmation trống.
- Sau khi ghép catalog thật từ local API vẫn thiếu 90/90 câu.
- `affirmationFor` đang dùng một câu mẫu chung cho cả chương trình.
- Cần nhập 90 câu được khách duyệt; không tự coi câu fallback là nội dung hoàn chỉnh.

### 2. Video vẫn mẫu; bonus đang phát video bài cơ bản — ưu tiên cao

- `baseVideo()` sau khi ghép catalog vẫn trả `/videos/workout-sample.mp4`.
- `WorkoutDetail.tsx` dùng cùng `src={video}` ở instructions, practice và bonus.
- `BonusExercise` chưa có video riêng; admin chỉ upload video chung ở ngày 0.
- Với bonus như thở/thả lỏng, video bài cơ bản nâng gối không tương ứng nội dung.
- Cần video cơ bản chính thức và cơ chế chọn/lưu video theo bài bonus. Chưa có các tài nguyên đó trong cấu hình hiện tại.

### 3. Timer và video hoạt động độc lập — ưu tiên cao

- Bấm bắt đầu tập/bonus làm timer chạy ngay; VideoPlayer mới vẫn chờ người dùng bấm play.
- Nút Pause/Fortsetzen chỉ đổi `running`, không pause/play video.
- Pause video hoặc lỗi video không dừng timer; đủ 60 tick vẫn ghi hoàn thành bài cơ bản.
- Cần thống nhất việc bắt đầu/tạm dừng của timer và video; xử lý video không tải được.
- Bằng chứng source: `src/pages/workouts/WorkoutDetail.tsx:34–53,84–112`; `src/components/VideoPlayer.tsx:43–56,67–95`.

### 4. Admin có thể chọn bonus khác nhau trong cùng block — ưu tiên vừa

- `bonusFor` ưu tiên lựa chọn ngày đang xem trước lựa chọn đầu block.
- Tái hiện trong bộ nhớ: ngày 1 chọn A, ngày 2 chọn B thì ngày 1/2/3 trả A/B/A.
- Catalog hiện chưa có xung đột: không ngày nào đã chọn bonus.
- Cần lưu/chọn bonus theo block hoặc báo lỗi khi cấu hình không nhất quán.

### 5. Nội dung admin bị bản dịch Việt ghi đè — ưu tiên vừa

- `localDay` ghép `dayContent` rồi ghép `viDays` lên trên.
- Khi dùng tiếng Việt, lời chào và bonus impulse sửa trong admin không xuất hiện; phase cũng lấy từ JSON dịch.
- Affirmation override vẫn xuất hiện nhưng không tự được dịch; đây là giới hạn nội dung đa ngôn ngữ cần thể hiện rõ trong admin.
- Cần hỗ trợ trường ngôn ngữ hoặc quy tắc fallback rõ ràng.

### 6. “Xem lại hướng dẫn” chỉ tiếp tục video — ưu tiên vừa

- Nút có trong yêu cầu gốc, không phải tự bổ sung.
- Hiện chỉ gọi `play()`, không đặt `currentTime = 0`; đang xem dở thì tiếp tục từ vị trí cũ.
- Cần hành vi replay từ đầu đúng với tên nút.

### 7. Metadata PWA và một số chữ còn cũ — ưu tiên thấp

- `vite.config.ts` còn `lang: 'en'`, mô tả “Your 22-day balance program”.
- Thông báo lỗi VideoPlayer còn tiếng Anh.
- Admin còn hướng dẫn “Placeholder from library order” dù thực tế bonus fallback đã xáo ngẫu nhiên; hint affirmation nói “folgt bald” nhưng UI dùng câu mẫu chung.
- Cần đồng bộ thông tin với chương trình 90 ngày, tiếng Đức/Việt và hành vi thật.

## Kiểm chứng đã chạy

- Profile mới: ngày 1 mở, ngày 2 khóa.
- Hoàn thành session 1: ngày được tính xong; ngày kế tiếp vẫn khóa trong cùng ngày lịch.
- Ghi session trùng: không tăng số lần; đủ ba session không nhân đôi completed day.
- Ngày hoàn thành nằm trong quá khứ: mở đúng ngày kế tiếp, ngày sau nữa khóa.
- 90 ngày hoàn thành: `finished = true`.
- Danh sách check: 18 ID; nhóm 12/5/1.
- Bonus mặc định giữ nguyên trong block 1–3.
- Tái hiện xung đột bonus khi admin có lựa chọn khác nhau trong cùng block.
- JSON: đủ 90 greeting, 74 bonus có hướng dẫn; thiếu 90 affirmation và 90 bonus pick. Bonus pick trống được phép vì khách đã cho dùng random.
- GET catalog: một ngày có override; video hiệu lực vẫn là sample, affirmation hiệu lực vẫn trống toàn bộ.

## Thứ tự hoàn thiện đề xuất

1. Đồng bộ timer/video, sửa replay.
2. Hỗ trợ video bonus phù hợp; gắn video chính thức khi có.
3. Đưa 90 affirmation được khách duyệt vào dữ liệu/admin.
4. Bảo đảm bonus đồng nhất theo block; xử lý override cho tiếng Việt.
5. Sửa metadata/copy cũ, chạy lại toàn bộ luồng trên browser và kiểm tra lưu admin/server bằng tài khoản thử.
