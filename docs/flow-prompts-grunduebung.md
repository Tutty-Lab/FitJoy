# Google Flow · Video Grundübung (DaeyangFlow)

Video bài cơ bản của Der Gleichgewichts-Code, tạo bằng Veo trên Google Flow, chạy hàng loạt bằng extension DaeyangFlow.

## Cách dùng

1. Mở project Google Flow, chọn chế độ **Text to Video** (Veo), tỉ lệ **16:9**, 1 output mỗi prompt.
2. Mở side panel DaeyangFlow, đợi "Đã kết nối với Google Flow".
3. Copy **chỉ phần trong khung "COPY VÀO EXTENSION"** bên dưới (8 dòng = 8 clip) và dán vào ô prompt. Không copy tiêu đề hay ghi chú: extension coi **mỗi dòng không rỗng là một prompt**.
4. Đặt delay nghỉ khoảng 20–40 giây, bấm **Bắt đầu**.

**Lưu ý quan trọng:** DaeyangFlow hiện chỉ nhận biết **ảnh** mới (`<img>`) để biết lúc nào xong và để tải về. Với video, tool vẫn gõ và gửi prompt, nhưng có thể báo **Quá giờ** và không tự tải file. Video vẫn được tạo trong Flow, bạn tải tay từ Flow về. Nếu muốn tool tự nhận video và tải về, cần sửa `content.js` (chờ `<video>` thay vì `<img>`).

## Ghép video

Mỗi clip Veo dài khoảng 8 giây. Thứ tự ghép thành 1 video hướng dẫn:

| # | Clip | Dùng ở |
|---|------|--------|
| 1 | Tư thế đứng thẳng ban đầu | Hướng dẫn |
| 2 | Nâng gối phải + nghiêng đầu phải, giữ | Hướng dẫn + màn tập |
| 3 | Trở về tư thế thẳng | Hướng dẫn + màn tập |
| 4 | Nâng gối trái + nghiêng đầu trái, giữ | Hướng dẫn + màn tập |
| 5 | Trở về tư thế thẳng | Hướng dẫn + màn tập |
| 6 | Biến thể ngồi: tư thế ban đầu trên ghế | Hướng dẫn |
| 7 | Ngồi: nâng gối phải + nghiêng đầu | Hướng dẫn |
| 8 | Ngồi: nâng gối trái + nghiêng đầu | Hướng dẫn |

Video tập 60 giây: lặp 2 → 3 → 4 → 5 hai lần (mỗi bên gối 2 lần, đúng theo bài gốc), cắt cho vừa 60 giây. Tải video lên ở admin: `/admin/workouts/0`.

Prompt viết bằng tiếng Anh vì Veo hiểu tốt hơn. Nhân vật, trang phục, phòng và góc máy được lặp lại y hệt trong từng dòng để các clip ăn khớp nhau. Trong clip không có lời thoại, chữ hay nhạc, vì người dùng tự đọc to câu tự khẳng định trong app.

## COPY VÀO EXTENSION

```text
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, stands upright and relaxed in the middle of a bright, minimal living room with a light wooden floor, a plain warm-white wall and a sturdy wooden chair beside her. She stands tall, feet hip-width apart on the floor, arms relaxed at her sides, breathing calmly and smiling gently at the camera. Soft natural daylight from a window on the left, warm and even. Realistic, clear, unhurried movement suitable for a senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, in a bright, minimal living room with a light wooden floor, a plain warm-white wall and a sturdy wooden chair beside her. Starting upright, she slowly lifts her right knee to about hip height while at the same time gently tilting her head toward the right knee, bringing head and knee only slightly closer in a comfortable range, then holds this position steadily and calmly for several seconds with relaxed shoulders and a soft focus. Very slow, controlled, gentle movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, in a bright, minimal living room with a light wooden floor, a plain warm-white wall and a sturdy wooden chair beside her. She is holding her right knee raised with her head gently tilted toward it, then slowly lowers the right foot back to the floor and brings her head back to center, returning smoothly to a tall upright standing position with both feet on the floor, arms relaxed, breathing out calmly. Very slow, controlled movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, in a bright, minimal living room with a light wooden floor, a plain warm-white wall and a sturdy wooden chair beside her. Starting upright, she slowly lifts her left knee to about hip height while at the same time gently tilting her head toward the left knee, bringing head and knee only slightly closer in a comfortable range, then holds this position steadily and calmly for several seconds with relaxed shoulders and a soft focus. Very slow, controlled, gentle movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, in a bright, minimal living room with a light wooden floor, a plain warm-white wall and a sturdy wooden chair beside her. She is holding her left knee raised with her head gently tilted toward it, then slowly lowers the left foot back to the floor and brings her head back to center, returning smoothly to a tall upright standing position with both feet on the floor, arms relaxed, breathing out calmly. Very slow, controlled movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, in a bright, minimal living room with a light wooden floor and a plain warm-white wall. She sits upright on the front half of a sturdy wooden chair without armrests, back tall, both bare feet flat on the floor hip-width apart, hands resting lightly on her thighs, breathing calmly and smiling gently at the camera. Soft natural daylight from a window on the left. Realistic, unhurried senior balance exercise tutorial, seated variation. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, sitting upright on a sturdy wooden chair in a bright, minimal living room with a light wooden floor and a plain warm-white wall, both feet flat on the floor. She slowly lifts her right knee a little off the chair while gently tilting her head toward the right knee in a comfortable range, holds calmly for a few seconds, then slowly lowers the foot to the floor and returns her head to center, sitting tall again. Very slow, controlled movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
Wide static shot, eye level, 16:9. A calm, friendly woman in her early 60s with short silver hair, wearing a soft sage-green long-sleeve top and dark grey relaxed trousers, barefoot, sitting upright on a sturdy wooden chair in a bright, minimal living room with a light wooden floor and a plain warm-white wall, both feet flat on the floor. She slowly lifts her left knee a little off the chair while gently tilting her head toward the left knee in a comfortable range, holds calmly for a few seconds, then slowly lowers the foot to the floor and returns her head to center, sitting tall again. Very slow, controlled movement. Soft natural daylight from the left. Realistic senior balance exercise tutorial. No text, no captions, no music, no speech.
```

## Mẹo giữ nhân vật đồng nhất

- Nếu Flow có **Ingredients to Video**, tải lên 1 ảnh người mẫu (ví dụ một khung hình đẹp từ clip 1) làm nguyên liệu, rồi chạy các dòng còn lại để các clip cùng một người.
- Clip nào lệch động tác (nâng sai chân, nghiêng đầu ngược phía), bấm ↻ trong hàng đợi để tạo lại.
- Muốn đổi người mẫu hoặc phòng: sửa cùng một cụm mô tả ở tất cả 8 dòng.
