<p align="center">
  <img src="favicon.png" alt="Thai GPA Logo" width="80" height="80" style="border-radius: 16px;">
</p>

<h1 align="center">Thai GPA Calculator</h1>

<p align="center">
  เครื่องคำนวณเกรดเฉลี่ย GPA ออนไลน์สำหรับนักเรียนไทย<br>
  ใช้งานฟรี ไม่ต้องสมัครสมาชิก ไม่เก็บข้อมูลส่วนตัว
</p>

<p align="center">
  <img src="https://img.shields.io/badge/language-Thai-blue" alt="Language: Thai">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT">
  <img src="https://img.shields.io/badge/vanilla-HTML%20%2F%20CSS%20%2F%20JS-orange" alt="Tech: Vanilla">
  <img src="https://img.shields.io/badge/no%20framework-required-lightgrey" alt="No Framework">
</p>

---

## ✨ Features

| ฟีเจอร์ | รายละเอียด |
|:-------:|:-----------|
| 📝 **คำนวณ GPA รายเทอม** | ใส่รายวิชา หน่วยกิต และเกรด — ระบบคำนวณ GPA ให้ทันที |
| 📈 **GPAX สะสม** | รวม GPA หลายเทอม คำนวณ GPAX สำหรับยื่น TCAS |
| 🎯 **เป้าหมาย GPA** | คำนวณว่าต้องทำเกรดเท่าไหร่ในเทอมหน้าเพื่อถึงเป้าหมาย |
| 📄 **Export PDF** | บันทึกผลลัพธ์เป็น PDF สำหรับเก็บไว้หรือส่งให้ผู้ปกครอง |
| 💾 **บันทึกอัตโนมัติ** | ข้อมูลถูกบันทึกใน Local Storage ไม่หายแม้ปิดเบราว์เซอร์ |
| ❓ **FAQ** | คำถามที่พบบ่อย 10 ข้อ พร้อม FAQPage JSON-LD สำหรับ Rich Results |
| 📱 **Responsive** | ใช้งานได้ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ |

## 🖼️ Preview

```
┌─────────────────────────────────┐
│          Thai GPA               │
├─────────────────────────────────┤
│  📝 คำนวณ GPA │ 📈 GPAX │ 🎯  │
├─────────────────────────────────┤
│     ┌───────────────────┐       │
│     │  เกรดเฉลี่ยประจำเทอม  │       │
│     │       3.38        │       │
│     │    12 หน่วยกิต     │       │
│     └───────────────────┘       │
│                                 │
│  รายวิชา                        │
│  ├── ภาษาไทย    1.5  เกรด 3.5  │
│  ├── คณิตศาสตร์  2.0  เกรด 3.0  │
│  └── ...                        │
└─────────────────────────────────┘
```

## 🚀 Getting Started

### วิธีที่ 1 — เปิดไฟล์ตรง

เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม

### วิธีที่ 2 — ใช้ Live Server

```bash
# clone repository
git clone https://github.com/your-username/thai-gpa-calculator.git
cd thai-gpa-calculator

# เปิดด้วย VS Code Live Server หรือ serve อื่น ๆ
npx serve .
```

> 💡 โปรเจกต์นี้เป็น **Vanilla HTML/CSS/JS** ไม่ต้อง `npm install` หรือ build ใด ๆ

## 📁 Project Structure

```
Thai GPA Calculator/
├── index.html          # หน้าหลัก + SEO Meta Tags + JSON-LD
├── style.css           # Design System (iOS-inspired, Mobile-first)
├── favicon.png         # ไอคอนเว็บไซต์
├── package-lock.json   # Lock file
├── README.md           # ไฟล์นี้
└── js/
    ├── app.js          # Main Application Logic (UI, Events, Rendering)
    ├── calculator.js   # GPA Computation Engine (สูตรคำนวณ)
    ├── storage.js      # Local Storage Manager (บันทึก/โหลดข้อมูล)
    └── pdf-export.js   # PDF Export Module (html2pdf.js)
```

## 🧮 สูตรคำนวณ

### GPA (เกรดเฉลี่ยประจำเทอม)

```
GPA = Σ(เกรด × หน่วยกิต) ÷ Σหน่วยกิต
```

### GPAX (เกรดเฉลี่ยสะสม)

```
GPAX = Σ(GPA แต่ละเทอม × หน่วยกิตแต่ละเทอม) ÷ Σหน่วยกิตทั้งหมด
```

### เป้าหมาย GPA เทอมหน้า

```
Required GPA = [(Target × Total Credits) - (Current GPA × Current Credits)] ÷ Next Credits
```

## 🔧 Tech Stack

- **HTML5** — Semantic structure + SEO meta tags + JSON-LD Structured Data
- **CSS3** — Custom Properties, Flexbox, Grid, Animations
- **Vanilla JavaScript** — ES Modules, No framework
- **html2pdf.js** — PDF export (CDN)
- **Google Fonts** — Inter

## 🔍 SEO

โปรเจกต์นี้ปรับแต่ง SEO อย่างครบถ้วน:

- ✅ Primary Meta Tags (title, description, keywords)
- ✅ Open Graph / Facebook tags
- ✅ Twitter Card tags
- ✅ JSON-LD Structured Data — `WebApplication`
- ✅ JSON-LD Structured Data — `FAQPage` (10 questions)
- ✅ Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- ✅ `lang="th"` และ `og:locale="th_TH"`
- ✅ Responsive viewport meta

## 🤝 Contributing

Pull requests ยินดีต้อนรับครับ! สำหรับการเปลี่ยนแปลงใหญ่ กรุณาเปิด Issue ก่อนเพื่อหารือ

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**ddech production**

---

<p align="center">
  Made with ddechproduction for Thai students<br>
  Thai GPA Calculator © 2026
</p>

