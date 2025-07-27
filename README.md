
---

# Cruise Ship Management

[![License](https://img.shields.io/github/license/arshc0der/Cruise-Ship-Management?color=blue)](LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/arshc0der/Cruise-Ship-Management?style=social)](https://github.com/arshc0der/Cruise-Ship-Management/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/arshc0der/Cruise-Ship-Management?style=social)](https://github.com/arshc0der/Cruise-Ship-Management/network)
[![Open Issues](https://img.shields.io/github/issues/arshc0der/Cruise-Ship-Management)](https://github.com/arshc0der/Cruise-Ship-Management/issues)
[![Last Commit](https://img.shields.io/github/last-commit/arshc0der/Cruise-Ship-Management)](https://github.com/arshc0der/Cruise-Ship-Management/commits/main)
[![Maintained](https://img.shields.io/maintenance/yes/2025)]()
[![Made With](https://img.shields.io/badge/Made%20With-JavaScript-yellow)]()
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)]()
[![Tailwind CSS](https://img.shields.io/badge/Style-TailwindCSS-blue)]()
[![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen)]()
[![Status](https://img.shields.io/badge/Project-Complete-success)]()
[![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=live&url=https%3A%2F%2Ffirebase.google.com)]()
[![Deployed](https://img.shields.io/badge/Deployed-Firebase%20Hosting-success)]()
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)]()
[![HTML](https://img.shields.io/badge/Markup-HTML5-red)]()
[![CSS](https://img.shields.io/badge/Style-CSS3-blue)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)]()
[![Contribution](https://img.shields.io/badge/Contributions-Welcome-lightgrey)]()
[![Security](https://img.shields.io/badge/Security-Firestore%20Rules-important)]()
[![GitHub Repo Size](https://img.shields.io/github/repo-size/arshc0der/Cruise-Ship-Management)]()

---

## 📖 About the Project

The **Cruise Ship Management** is a web-based system built using Firebase, HTML, CSS (Tailwind), and JavaScript. It allows hospitals to efficiently manage:

- 🔐 Secure authentication for Admin and Users
- 👨‍⚕️ Doctor and 👩‍⚕️ Patient records
- 🕒 Scheduling of surgeries and OT activities
- 📃 Uploading surgical reports (if needed)
- 📊 Viewing schedules dynamically

Built with minimal UI and maximum functionality in mind — no frameworks required.

---

## 🔧 Firebase Setup

To get started with Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project
3. Enable the following:
   - 🔑 **Authentication** → Sign-in method → Enable **Email/Password**
   - 🗃️ **Cloud Firestore** → Start in **Production Mode**
   - ☁️ (Optional) **Storage** → Enable if you want to upload reports/files

4. Create your Firestore structure:
   - Collection: `users`
     - Document ID: `UID` (auto created on register)
     - Fields:
       - `email`: string
       - `role`: `'admin'` or `'user'`

---

## 🔐 Firebase Config Setup

Create a file called **`public/env.js`** with your Firebase app credentials:

```js
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
````
---

## 🚀 Run Locally

```bash
npm install -g firebase-tools

firebase login
firebase init
firebase serve
```

Then visit: [http://localhost:5000](http://localhost:5000)

---

## 📤 Deploy to Firebase Hosting

```bash
firebase deploy
```

---

## 📸 Screenshots

> (You can include screenshots here to show UI, if desired)

---

## 🙌 Contributing

Pull requests and contributions are welcome!
Please open an issue or PR for improvements or suggestions.

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).

---

### 💬 Need Help?

Create a GitHub issue.

---
