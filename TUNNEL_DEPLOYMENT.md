# Hướng dẫn Deploy bằng Tunnel

## Cách 1: Sử dụng ngrok (Khuyên dùng)

### Bước 1: Cài đặt ngrok
1. Tải ngrok: https://ngrok.com/download
2. Giải nén và add vào PATH (hoặc đặt trong thư mục dự án)
3. Đăng ký tài khoản miễn phí tại https://ngrok.com/

### Bước 2: Deploy Backend
```bash
# Terminal 1: Chạy backend tunnel
ngrok http 5000
```

Bạn sẽ nhận được URL backend như: `https://abc123.ngrok-free.app`

### Bước 3: Cập nhật .env
Tạo file `.env.local` hoặc update `.env`:
```env
VITE_API_URL=https://abc123.ngrok-free.app/api
```

**LƯU Ý:** Thay `abc123.ngrok-free.app` bằng URL ngrok của bạn

### Bước 4: Deploy Frontend
```bash
# Terminal 2: Chạy frontend tunnel
ngrok http 5003
```

Bạn sẽ nhận được URL frontend như: `https://xyz456.ngrok-free.app`

### Bước 5: Truy cập
Mở trình duyệt và truy cập URL frontend: `https://xyz456.ngrok-free.app`

---

## Cách 2: Sử dụng Cloudflare Tunnel (Miễn phí, không giới hạn)

### Bước 1: Cài đặt
```bash
npm install -g cloudflared
```

### Bước 2: Deploy Backend
```bash
# Terminal 1: Chạy backend tunnel
cloudflared tunnel --url http://localhost:5000
```

Copy URL backend (VD: `https://abc-def-ghi.trycloudflare.com`)

### Bước 3: Cập nhật .env
```env
VITE_API_URL=https://abc-def-ghi.trycloudflare.com/api
```

### Bước 4: Deploy Frontend
```bash
# Terminal 2: Chạy frontend tunnel
cloudflared tunnel --url http://localhost:5003
```

Copy URL frontend và truy cập

---

## Cách 3: Sử dụng localtunnel (Đơn giản nhất)

### Bước 1: Cài đặt
```bash
npm install -g localtunnel
```

### Bước 2: Deploy Backend
```bash
# Terminal 1
lt --port 5000 --subdomain bmbank-api
```

URL backend: `https://bmbank-api.loca.lt`

### Bước 3: Cập nhật .env
```env
VITE_API_URL=https://bmbank-api.loca.lt/api
```

### Bước 4: Deploy Frontend
```bash
# Terminal 2
lt --port 5003 --subdomain bmbank-app
```

URL frontend: `https://bmbank-app.loca.lt`

---

## Script Tự Động (Khuyên dùng)

### Tạo file `tunnel.bat` (Windows):
```batch
@echo off
echo Starting Backend Tunnel...
start cmd /k "ngrok http 5000"
timeout /t 5
echo Starting Frontend Tunnel...
start cmd /k "ngrok http 5003"
echo.
echo ========================================
echo Tunnels started!
echo ========================================
echo 1. Copy Backend URL from first window
echo 2. Update VITE_API_URL in .env file
echo 3. Restart dev server (npm run dev)
echo 4. Access Frontend URL from second window
echo ========================================
pause
```

### Tạo file `tunnel.sh` (Mac/Linux):
```bash
#!/bin/bash
echo "Starting Backend Tunnel..."
ngrok http 5000 &
sleep 5
echo "Starting Frontend Tunnel..."
ngrok http 5003 &

echo ""
echo "========================================"
echo "Tunnels started!"
echo "========================================"
echo "1. Copy Backend URL"
echo "2. Update VITE_API_URL in .env file"
echo "3. Restart dev server (npm run dev)"
echo "4. Access Frontend URL"
echo "========================================"
```

---

## Troubleshooting

### Lỗi: CORS error
✅ **Đã fix!** CORS đã được cấu hình để chấp nhận tunnel URLs

### Lỗi: ERR_NGROK_3200
- Nguyên nhân: Ngrok URL đã hết hạn (free tier reset sau 2 giờ)
- Giải pháp: Chạy lại ngrok và update `.env`

### Lỗi: Cannot fetch API
1. Kiểm tra backend đang chạy: `http://localhost:5000/health`
2. Kiểm tra VITE_API_URL trong `.env` đúng chưa
3. Restart dev server sau khi đổi `.env`

### Lỗi: ngrok warning banner
- Tạo tài khoản ngrok và authenticate:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

---

## Lưu ý quan trọng

⚠️ **BẢO MẬT:**
- Chỉ dùng tunnel cho development/demo
- KHÔNG dùng cho production
- KHÔNG share tunnel URL với người lạ
- Database vẫn ở localhost, cần bảo mật

⚠️ **PERFORMANCE:**
- Tunnel có thể chậm hơn localhost
- Ngrok free có giới hạn số request
- Cloudflare tunnel không giới hạn

⚠️ **ENV FILE:**
- Restart dev server sau khi đổi `.env`
- Đảm bảo file `.env` KHÔNG commit lên Git
- Mỗi lần chạy ngrok sẽ có URL mới

---

## Kiểm tra xem đã hoạt động chưa

1. Truy cập Frontend URL
2. Mở DevTools (F12) → Network tab
3. Thử login
4. Kiểm tra request có gọi đến Backend URL tunnel không
5. Status code nên là 200 (success)

Nếu vẫn lỗi, check console log và báo lại!
