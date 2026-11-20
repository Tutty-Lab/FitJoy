# Vestibu · Đảo thăng bằng

## Nhân vật

Vestibu là người bạn dẫn đường trên một hòn đảo phủ sương. Tò mò, kiên nhẫn, vui với thành công nhỏ. Vestibu không chấm điểm cơ thể, không đóng vai bác sĩ, không trách người chơi khi nghỉ tập.

Giữ hình gốc trong `src/assets/home/vestibu-welcome.png` và các clip `public/vestibu/`. Giữ hình tai trong, ba vòng bán khuyên, gương mặt, tỉ lệ, trang phục và bảng màu của ảnh tham chiếu. Không thay thế bằng mascot vẽ lại bằng code.

## Bộ sáu trạng thái

| Trạng thái | Mood | Clip hiện có | Dùng tại |
|---|---|---|---|
| Chào | wave | wave, thumbs | Onboarding, mở truyện |
| Vui | idle | wave, think, stretch | Chờ, đi dạo |
| Suy nghĩ | think | think, point | Giới thiệu vùng mới |
| Động viên | encourage | thumbs, clap | Trước bài tập |
| Nghỉ ngơi | rest | stretch, think | Thông điệp nghỉ |
| Ăn mừng | celebrate | jump, clap, dance | Hoàn thành buổi tập |

Đây là các clip có sẵn từ repo, không phải sáu hình AI mới được tạo trong lần triển khai này. Các trạng thái xuất hiện theo ngữ cảnh; không có khu thử biểu cảm trong app.

## Giọng kể

- Gọi người chơi là “bạn”; kể bằng “mình cùng…”. Bản Đức dùng “du / wir”.
- Mỗi lượt thoại 1–3 câu, gắn với việc đang làm.
- Động viên: “Một bước nhỏ cũng đáng vui.”
- Trở lại sau nghỉ: “Hòn đảo vẫn ở đây. Mình đi tiếp khi bạn sẵn sàng.”
- Không dùng: “Bạn làm hỏng streak”, “Cơ thể bạn yếu”, “Tập để chữa khỏi”.

## Cốt truyện 90 ngày

1. Ngày 1–30: **Bến cảng bình yên**. Làm quen, dựng chỗ neo, ánh đèn và nơi nghỉ.
2. Ngày 31–60: **Khu rừng giác quan**. Khám phá lối đi, màu sắc, âm thanh. Không ép nhắm mắt hay thêm động tác ngoài nội dung bài tập.
3. Ngày 61–90: **Ngọn hải đăng chân trời**. Nối các vùng đảo, nhìn lại hành trình. Kết thúc dẫn đến tự kiểm tra cuối chương trình, không tuyên bố hiệu quả y khoa.

Mỗi ngày chương trình hoàn thành hồi sinh một góc đảo. Thành quả theo danh sách ngày hoàn thành; không phụ thuộc streak, không bị xóa khi nghỉ. Cốt truyện là lớp trò chơi trên bài tập gốc.

## Storyboard tuần đầu

| Ngày | Cảnh | Vật kỷ niệm | Nhịp cảm xúc |
|---|---|---|---|
| 1 | Sương hé, đèn bên bến sáng | Đèn bến cảng | Chào, tò mò, vui |
| 2 | Thuyền tìm được điểm neo | Chiếc neo nhỏ | Bình tĩnh, động viên |
| 3 | Đặt thêm ván cho cầu gỗ | Một nhịp cầu | Kiên nhẫn |
| 4 | Gió lay chiếc chuông | Chuông gió | Lắng nghe |
| 5 | Gửi lời chào từ đảo | Bưu thiếp | Gắn bó |
| 6 | Ghế bên bờ nước | Ghế nghỉ | Chấp nhận nghỉ ngơi |
| 7 | Cờ bay bên cảng | Lá cờ | Ăn mừng |

Lời thoại Đức/Việt: `src/data/story.ts`, `storyChapters.ts`, `storyScenes.ts`. Đã có chín chương và tình tiết từng ngày từ 1–90. Xem `UX-WORKFLOW.md` để duyệt cốt truyện và luồng màn hình.

## Gói cảnh hiện tại

`src/components/StoryIsland.tsx` có ba cảnh SVG phục vụ bản đồ UI: cảng, rừng, hải đăng. Các mốc sáng đèn, nhà, cờ, hoa theo tiến trình; chưa có animation riêng cho từng khám phá. Đây là minh họa SVG, không phải tranh raster do AI tạo.

## Quy trình sản xuất tiếp

Tạo pose sheet dựa ảnh gốc → duyệt gương mặt/tay/vòng tai/trang phục → tách lớp vector → dựng chuyển động trong Rive → xuất clip hoặc tích hợp runtime. Không tự đổi nhân vật trong app trước khi duyệt hình.
