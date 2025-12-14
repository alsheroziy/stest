# Soq.qa Application

Next.js ilovasida email autentifikatsiya va profil boshqaruvi bilan.

## Features

- ✅ Email va parol bilan login
- ✅ Foydalanuvchi profilini ko'rish va tahrirlash
- ✅ shadcn UI komponentlari
- ✅ API proxy (CORS muammosiz)

## Getting Started

### Development

1. Dependencies o'rnating:

```bash
npm install
```

2. Development serverni ishga tushiring:

```bash
npm run dev
```

3. Brauzerda oching: [http://localhost:3000](http://localhost:3000)

### Environment Variables (Ixtiyoriy)

Agar API URL'ni o'zgartirmoqchi bo'lsangiz, `.env.local` fayl yarating:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.soq.qa
```

Agar environment variable berilmasa, default `https://api.soq.qa` ishlatiladi.

## Deploy

### Vercel'ga Deploy

1. GitHub'ga push qiling:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. [Vercel](https://vercel.com)'ga kiring va yangi project yarating

3. GitHub repository'ni tanlang

4. Environment Variables (ixtiyoriy):
   - `NEXT_PUBLIC_API_BASE_URL` = `https://api.soq.qa`

5. Deploy qiling!

### Boshqa Platformalarga Deploy

1. Build qiling:

```bash
npm run build
```

2. Start qiling:

```bash
npm start
```

**Eslatma:** Production'da ham ishlaydi, chunki:
- ✅ API route'lar server-side'da ishlaydi (CORS muammosi yo'q)
- ✅ Environment variable'lar to'g'ri ishlatiladi
- ✅ Barcha xatolar to'g'ri qayta ishlanadi
- ✅ Vercel'da serverless function sifatida ishlaydi
- ✅ Barcha endpoint'lar to'g'ri konfiguratsiya qilingan (`/api/auth/login/`, `/api/users/me/`)

## Project Structure

```
/app
  /api          # Next.js API routes (proxy)
  /login        # Login page
  /profile      # Profile page
/contexts       # Auth context
/lib            # API client
/components     # shadcn UI components
```

## API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/users/me` - Current user
- `GET /api/users/[username]` - User profile
- `PATCH /api/users/[username]` - Update profile
