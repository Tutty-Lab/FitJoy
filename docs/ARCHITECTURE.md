# FitJoy – Kiến trúc hệ thống

## 1. Tổng quan

```
                ┌──────────────────────────────┐
                │        FitJoy Client         │  React 19 + Vite + TS + Tailwind v4
                │  (một codebase, hai "app")   │  shadcn/ui + Animate UI (motion)
                │                              │
   iOS app  ◄───┤  /        → User app (PWA)   │  mobile-first, Capacitor bọc thành iOS
   (Capacitor)  │  /admin/* → Admin console    │  desktop-first, lazy-load (không vào bundle user)
                └──────────────┬───────────────┘
                               │  src/services/* (interface duy nhất gọi dữ liệu)
                               ▼
                ┌──────────────────────────────┐
   Hiện tại  →  │  Local adapter (localStorage)│  MVP / demo, chạy offline
   Backend  →   │  Vercel Functions (/api)     │  auth, kiểm quyền user/admin
                │  + Neon Postgres             │  chuỗi kết nối chỉ ở server
                └──────────────────────────────┘
```

**Nguyên tắc:** UI không gọi `localStorage` hay API trực tiếp. Mọi đọc/ghi đi qua `src/services/`. Đổi backend = viết adapter mới cho cùng interface, không sửa màn hình.

## 2. Cấu trúc thư mục

```
src/
  pages/                 # User app (mobile)
    auth/ onboarding/ workouts/ …
  admin/                 # Admin console (desktop) – lazy loaded
    AdminApp.tsx         # routes + guard
    AdminLayout.tsx      # sidebar + topbar
    pages/               # Dashboard, Users, Workouts, WorkoutEdit, Login
  components/            # dùng chung (VideoPlayer, shared, ui/ của shadcn)
  services/              # tầng dữ liệu
    types.ts             # kiểu dữ liệu chung (User, Workout, Stats…)
    catalog.ts           # danh sách bài tập (đọc: user app, ghi: admin)
    adminApi.ts          # thống kê, danh sách người dùng, phiên admin
  lib/                   # state phía user (profile, progress, reminders, theme)
  data/workouts.ts       # dữ liệu gốc 22 bài (seed)
```

## 3. Mô hình dữ liệu (đề xuất cho Postgres)

| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `profiles` | `id (=auth.uid)`, `name`, `email`, `role ('user'\|'admin')`, `goal`, `activity`, `focus[]`, `height`, `goal_weight`, `reminder_times[]`, `created_at` | 1–1 với tài khoản |
| `workouts` | `day (1–22)`, `title`, `category`, `mins`, `kcal`, `intensity`, `blurb`, `video_url`, `published` | admin sửa |
| `workout_steps` | `workout_day`, `order`, `name`, `mins`, `note` | |
| `completions` | `user_id`, `day`, `completed_at` | tính streak, tiến độ |
| `measurements` | `user_id`, `date`, `weight`, `waist`, `hip` | Before & After |
| `progress_photos` | `user_id`, `slot ('before'\|'after')`, `storage_path` | ảnh trong Storage, bucket private |

**Phân quyền:** API kiểm tra token; người dùng chỉ đọc/ghi dữ liệu của mình, chỉ `role = 'admin'` được sửa bài tập và xem toàn bộ thành viên.

## 4. Admin console

| Màn | Chức năng |
|---|---|
| Đăng nhập | Phiên admin riêng. **MVP: mật khẩu demo phía client – không an toàn, chỉ để demo.** Với backend: tài khoản thật có `role = 'admin'`, API kiểm quyền. |
| Dashboard | KPI: tổng người dùng, hoạt động 7 ngày, buổi tập hoàn thành, tỉ lệ giữ chân; biểu đồ hoàn thành theo ngày 1–22 (phễu bỏ cuộc). |
| Users | Bảng tìm kiếm/lọc theo mục tiêu, tiến độ, streak, ngày tham gia. |
| Workouts | Danh sách 22 bài, bật/tắt xuất bản; trang sửa: tiêu đề, nhóm, thời lượng, kcal, mô tả, URL video, các bước. Lưu xong user app thấy ngay. |

## 5. Backend: Vercel Functions + Neon

```
App (browser / iOS) ──HTTPS──► /api/* (Vercel Functions, Node) ──► Neon Postgres
        token Bearer                kiểm quyền user/admin            DATABASE_URL chỉ ở server
```

- Schema: `db/migrations/0001_init.sql` (`users`, `completions`, `activity_days`, `workout_overrides`).
- API: `api/auth/signup`, `api/auth/login`, `api/me` (GET/PUT), `api/completions`, `api/catalog` (GET công khai; PUT/DELETE admin), `api/admin/members` (admin).
- Đăng nhập: mật khẩu băm bằng scrypt, token ký HMAC (`AUTH_SECRET`), hạn 30 ngày.

**Bật lên:**
1. Vercel project `fit-joy` → Storage → kết nối Neon (tự thêm `DATABASE_URL`).
2. Chạy `db/migrations/0001_init.sql` trong Neon SQL Editor.
3. Thêm env trên Vercel: `AUTH_SECRET` (chuỗi ngẫu nhiên dài) và `VITE_BACKEND=neon`, rồi deploy lại.
4. Chạy local: `npx vercel dev` (cần `.env` theo `.env.example`); `npm run dev` thì không có `/api`.
5. Đăng ký một tài khoản, rồi `update users set role = 'admin' where email = '...';` để vào `/admin`.

Không đặt `VITE_BACKEND=neon` thì app chạy chế độ cục bộ (localStorage + dữ liệu mẫu).

**Đồng bộ:** app đọc cache localStorage; `main.tsx` kéo hồ sơ, tiến độ và bài tập về trước khi vẽ màn hình; mọi lần ghi ghi cache rồi gửi API (`src/services/remote.ts`). Ảnh Before/After vẫn chỉ ở trên máy.

## 6. Lộ trình

1. **Bây giờ (MVP):** admin UI chạy với local adapter + dữ liệu người dùng mẫu.
2. **Backend:** Vercel Functions + Neon (mục 5) — code đã có, cần bật env và chạy migration.
3. **Media:** upload video/ảnh lên Vercel Blob từ trang sửa bài.
4. **Nhắc nhở nền:** Capacitor Local Notifications trên iOS; Web Push qua Vercel Function + cron cho PWA.
5. **Tách deploy (tuỳ chọn):** khi admin lớn, tách `admin/` thành app riêng trong monorepo (pnpm workspaces) dùng chung `services/` và `types`.
