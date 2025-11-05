# 🧩 TicTacToe 16×16 (Gomoku) – React + Firebase Realtime DB

**Gomoku 16×16, thắng 5** theo hàng/ngang/chéo. 2 người/1 phòng, có thể đặt mật khẩu. Cả hai **Sẵn sàng** để bắt đầu; khi **kết thúc ván** có nút **Chơi tiếp** (giữ **tỉ số**, reset **bàn cờ**). Frontend: **React + Vite + TypeScript + Tailwind CSS**, realtime bằng **Firebase Realtime Database**, deploy **Firebase Hosting**.

> **Demo/Hosting**: cập nhật đường dẫn của bạn (ví dụ `https://<your-site>.web.app` hoặc domain tùy chỉnh).

---

## ✨ Tính năng chính

* Bàn cờ **16×16**, điều kiện thắng **5 liên tiếp** (ngang, dọc, chéo xuôi, chéo ngược).
* **Phòng**: tạo phòng (tuỳ chọn mật khẩu), vào phòng bằng mã + mật khẩu (nếu có).
* **2 người / 1 phòng**, slot **X** và **O**.
* Trạng thái phòng: `LOBBY → PLAYING → ROUND_END`.
* **Sẵn sàng (Ready)**: cả 2 cùng sẵn sàng thì **tự động bắt đầu** ván.
* **Tỉ số**: cộng điểm người thắng; **Chơi tiếp** giữ tỉ số, chỉ reset bàn cờ.
* **Realtime** mọi thao tác: vào/ra phòng, sẵn sàng, đặt quân, kết thúc ván…
* Đặt quân dùng **transaction** tránh xung đột khi bấm đồng thời.

---

## 🧰 Tech stack

* **React 18** + **Vite** + **TypeScript**
* **Tailwind CSS v4** (`@tailwindcss/postcss`)
* **Firebase**: Realtime Database, Authentication (Anonymous), Hosting

---

## 📂 Cấu trúc thư mục

```
 tictactoe-react-firebase/
 ├─ src/
 │  ├─ components/
 │  │  └─ game/
 │  │     └─ GameBoard.tsx
 │  ├─ pages/
 │  │  ├─ LobbyPage.tsx
 │  │  └─ GamePage.tsx
 │  ├─ services/
 │  │  ├─ roomService.ts      // tạo/vào/phát sự kiện phòng, transactions, ready, play-again
 │  │  └─ gameLogic.ts        // SIZE=16, WIN=5, checkWin(), emptyBoard()
 │  ├─ firebase.ts            // init app + Realtime Database + Auth
 │  ├─ App.tsx
 │  ├─ main.tsx
 │  └─ index.css
 ├─ public/
 ├─ firebase.json             // hosting rewrites SPA
 ├─ database.rules.json       // rules Realtime DB
 ├─ postcss.config.js
 ├─ tailwind.config.js        // (nếu dùng v3)
 ├─ .env                      // VITE_* Firebase keys (không commit)
 └─ package.json
```

---

## ⚙️ Cài đặt & chạy

### 1) Clone & cài dependencies

```bash
git clone <repo-url>
cd tictactoe-react-firebase
npm i
```

### 2) Cấu hình Tailwind v4

Cài plugin PostCSS phù hợp (nếu chưa có):

```bash
npm i -D tailwindcss @tailwindcss/postcss postcss
```

`postcss.config.js`

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

Trong `src/index.css` (đầu file):

```css
@import "tailwindcss";

@layer base {
  html, body, #root { @apply min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900; }
}
```

> Nếu dự án dùng cấu hình Tailwind v3 trước đây, cân nhắc nâng lên v4 hoặc giữ cấu hình cũ cho thống nhất.

### 3) Tạo file `.env`

> Lấy giá trị từ Firebase Console → Project settings → *Your apps* (Web app).

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4) Thiết lập Firebase

* **Authentication** → bật **Anonymous**.
* **Realtime Database** → tab **Rules** → dùng file `database.rules.json` (bên dưới).
* **Hosting** → đã cấu hình trong `firebase.json` (SPA rewrites).

### 5) Chạy dev

```bash
npm run dev
# mở http://localhost:5173
```

---

## 🗄️ Mô hình dữ liệu (Realtime DB)

Node chính: `/rooms/{roomId}`

```jsonc
{
  "id": "ABC123",
  "name": "Phòng 16x16",
  "hasPassword": true,
  "passwordHash": "<sha256>",
  "status": "LOBBY" | "PLAYING" | "ROUND_END",
  "board": [[".", "X", ...], ...],  // 16x16
  "turn": "X" | "O",
  "winner": "X" | "O" | null,
  "players": {
    "X": { "uid": "...", "name": "Alice", "ready": true,  "score": 2 },
    "O": { "uid": "...", "name": "Bob",   "ready": true,  "score": 1 }
  },
  "lastMove": { "r": 7, "c": 8, "by": "X" },
  "createdAt": 1730790000000,
  "updatedAt": { ".sv": "timestamp" }
}
```

* Lắng nghe **realtime** bằng `onValue()`.
* Ghi/đổi trạng thái bằng `set() / update()`.
* **Đặt quân** dùng `runTransaction()` để kiểm tra lượt/ô trống và cập nhật **atomic**.
* Dùng `serverTimestamp()` để đồng bộ thời gian server.

---

## 🔐 Rules mẫu (database.rules.json)

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null"  
      }
    }
  }
}
```

> Bật **Anonymous Auth** để client có `auth != null` khi ghi dữ liệu.

---

## 🧠 Game logic

* **Kích thước**: `SIZE = 16`, **điều kiện thắng**: `WIN = 5`.
* Hàm `checkWin(board, r, c, me)` kiểm tra 4 hướng: `[(0,1), (1,0), (1,1), (1,-1)]`.
* `startRound()` reset `board`, `turn="X"`, `winner=null`, giữ nguyên **score**.
* `placeMove()` dùng transaction; nếu thắng → `status="ROUND_END"` và cộng điểm cho người thắng.

---

## 🧪 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

---

## 🚀 Build & Deploy (Firebase Hosting)

### 1) Build

```bash
npm run build
# output: dist/
```

### 2) Cấu hình Hosting (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "database": { "rules": "database.rules.json" }
}
```

### 3) Deploy

```bash
firebase login
firebase use <project-id>
firebase deploy --only hosting,database
```

> Nếu chỉ đổi frontend: `firebase deploy --only hosting`

### (Tuỳ chọn) Domain tuỳ chỉnh

* Thêm domain trong **Firebase Hosting → Add custom domain** và làm theo hướng dẫn DNS (TXT/CNAME/A). SSL cấp tự động.

---

## 🩺 Troubleshooting

* **Màn hình trắng sau deploy**: kiểm tra `rewrites → "/index.html"` và hard refresh (Ctrl+F5).
* **Tailwind v4 lỗi PostCSS**: cần `@tailwindcss/postcss` trong `postcss.config.js`.
* **Không ghi được DB**: chưa bật **Anonymous Auth** hoặc rules không cho `auth != null`.
* **TypeScript build lỗi `type-only import`**: dùng `import type { ... } from "react";` hoặc tắt `verbatimModuleSyntax`.
* **Không tự bắt đầu ván**: chỉ bắt đầu khi **cả X & O** `ready=true`.

---

## 🗺️ Roadmap (gợi ý)

* Spectator (xem trận).
* Danh sách phòng (lobby list) + tìm kiếm.
* Chống spam click (debounce client / rate-limit server).
* Lưu lịch sử nước đi & chia sẻ.
* Bot chơi thử (cấp độ dễ/khó).

---

## 📄 License

Chưa khai báo. Đề xuất: **MIT**.
