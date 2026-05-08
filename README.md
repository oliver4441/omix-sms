# Omix School Management System

A modern, full-featured school and college management system built on **Laravel 10** — developed by **Omix**.

---

## 🎯 **Features**

✅ **Multi-User Roles** (7 types):
- Super Admin
- Admin
- Teacher
- Student
- Parent
- Accountant
- Librarian

✅ **Core Modules**:
- Student Management (admissions, classes, sections)
- Exam & Grading System
- Marksheets (view/print PDF)
- Fee Payment & Receipts
- Library Management
- Noticeboard & Calendar
- Study Materials Upload
- System Settings

---

## 🚀 **Installation**

### Requirements
- PHP 8.2+
- Composer
- MySQL/MariaDB
- Node.js & NPM (for assets)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/oliver4441/lav_sms.git
   cd lav_sms
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Generate app key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations & seeders:
   ```bash
   php artisan migrate --seed
   ```

6. Install & compile assets:
   ```bash
   npm install && npm run dev
   ```

7. Start the server:
   ```bash
   php artisan serve
   ```

---

## 🔑 **Default Login Credentials**

| Account Type | Email | Password |
|-------------|-------|----------|
| Super Admin | cj@cj.com | cj |
| Admin | admin@admin.com | cj |
| Teacher | teacher@teacher.com | cj |
| Student | student@student.com | cj |
| Parent | parent@parent.com | cj |
| Accountant | accountant@accountant.com | cj |

---

## 🛠 **Built With**

- **Framework:** Laravel 10
- **PHP:** 8.2+
- **PDF Generation:** barryvdh/laravel-dompdf
- **Frontend:** Laravel UI, Bootstrap

---

## 📞 **Support**

For customization, branding, or new features contact:

**Omix Company**  
📧 Email: [Your Omix Email]  
📱 Phone: [Your Omix Phone]  
🌐 Website: [Your Omix Website]

---

## 📄 **License**

MIT License — free to use, modify, and distribute.

---

*Powered by **Omix** 🐞*
