# VideoPlayerApp 📱🎬

แอปพลิเคชันเล่นวิดีโอที่พัฒนาด้วย React Native และ Expo สำหรับระบบปฏิบัติการ iOS และ Android

## ✨ คุณสมบัติหลัก

- 🎥 เล่นวิดีโอในหลายรูปแบบ
- 📁 เลือกและเปิดไฟล์วิดีโอจากเครื่อง
- 🖼️ สร้าง thumbnail จากวิดีโอ
- 📱 รองรับการหมุนหน้าจอ (Portrait/Landscape)
- 🎛️ ระบบ Navigation แบบ Tab และ Stack
- 📊 จัดการ State ด้วย Redux Toolkit
- 🎨 UI ที่สวยงามและใช้งานง่าย

## 🛠️ เทคโนโลยีที่ใช้

- **React Native** 0.79.4
- **Expo** ~53.0.13
- **TypeScript** 
- **Redux Toolkit** สำหรับ State Management
- **React Navigation** สำหรับการนำทาง
- **React Native Video** สำหรับเล่นวิดีโอ
- **Expo AV** สำหรับความสามารถด้านมีเดีย
- **Bun** เป็น Package Manager

## 📋 ความต้องการของระบบ

- Node.js (เวอร์ชัน 18 หรือใหม่กว่า)
- Bun (Package Manager)
- Expo CLI
- iOS Simulator (สำหรับทดสอบ iOS) หรือ Android Emulator (สำหรับทดสอบ Android)
- อุปกรณ์ iOS/Android จริง (ตัวเลือก)

## 🚀 การติดตั้งและเริ่มใช้งาน

### 1. Clone โปรเจกต์

```bash
git clone <repository-url>
cd VideoPlayerApp
```

### 2. ติดตั้ง Dependencies

```bash
bun install
```

### 3. เริ่มต้นโปรเจกต์

```bash
# เริ่ม Expo development server
bun start

# หรือใช้คำสั่งเหล่านี้สำหรับแพลตฟอร์มเฉพาะ
bun run android    # สำหรับ Android
bun run ios        # สำหรับ iOS
bun run web        # สำหรับ Web (ถ้ารองรับ)
```

### 4. เปิดแอปในอุปกรณ์

- **Android**: ใช้ Expo Go app แสกน QR code หรือเปิดใน Android Emulator
- **iOS**: ใช้ Expo Go app แสกน QR code หรือเปิดใน iOS Simulator

## 📂 โครงสร้างโปรเจกต์

```
VideoPlayerApp/
├── src/
│   ├── components/          # Components ที่ใช้ร่วมกัน
│   ├── navigation/          # ระบบ Navigation
│   ├── screens/             # หน้าจอต่างๆ
│   ├── store/               # Redux store และ slices
│   └── utils/               # Utility functions
├── assets/                  # รูปภาพและ Assets
├── android/                 # ไฟล์เฉพาะ Android
├── App.tsx                  # Component หลัก
├── package.json
└── app.json                 # การตั้งค่า Expo
```

## 🎮 วิธีการใช้งาน

1. **เปิดแอป**: เมื่อเปิดแอปจะเห็นหน้าหลักที่มีตัวเลือกต่างๆ
2. **เลือกวิดีโอ**: กดปุ่มเลือกไฟล์เพื่อเปิดวิดีโอจากเครื่อง
3. **เล่นวิดีโอ**: วิดีโอจะเล่นอัตโนมัติพร้อม Controls สำหรับควบคุม
4. **หมุนหน้าจอ**: หมุนอุปกรณ์เพื่อดูวิดีโอในโหมด Landscape
5. **ดู Thumbnail**: แอปจะสร้าง Thumbnail ให้อัตโนมัติ

## 🔧 การ Build สำหรับ Production

### Android

```bash
# สร้าง APK
expo build:android

# หรือใช้ EAS Build (แนะนำ)
eas build --platform android
```

### iOS

```bash
# สร้าง IPA
expo build:ios

# หรือใช้ EAS Build (แนะนำ)
eas build --platform ios
```

## 📱 การ Deploy

โปรเจกต์นี้ใช้ EAS (Expo Application Services) สำหรับการ build และ deploy:

- Project ID: `e5a72ca2-b8e5-42a0-816c-a963a9279b8c`
- รองรับ Over-the-Air (OTA) updates

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Metro bundler error**: ลองรัน `bun start --clear`
2. **Android build failed**: ตรวจสอบ Android SDK และ Java version
3. **iOS simulator ไม่เปิด**: ตรวจสอบ Xcode installation

### การ Debug

```bash
# เปิด Developer menu บนอุปกรณ์
# iOS: กด Cmd+D (Simulator) หรือเขย่าเครื่อง (Device)
# Android: กด Cmd+M (Emulator) หรือเขย่าเครื่อง (Device)
```

## 📄 License

Private Project - สงวนลิขสิทธิ์

## 👨‍💻 การสนับสนุน

หากพบปัญหาหรือมีข้อเสนอแนะ กรุณาติดต่อทีมพัฒนา

---

**Happy Coding! 🚀**
