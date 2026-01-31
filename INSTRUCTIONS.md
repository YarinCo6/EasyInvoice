# 🚀 הוראות להעלאת האתר ל-GitHub Pages

## שלב 1: יצירת Repository ב-GitHub (5 דקות)

### א. היכנסי ל-GitHub:
1. פתחי דפדפן וגשי ל: **https://github.com/new**
2. אם אין לך חשבון - לחצי **Sign up** וצרי חשבון חינמי
3. אם יש לך חשבון - התחברי

### ב. מלאי את הפרטים:
```
Repository name: receipt-app
Description: (אופציונלי) "מערכת ליצירת קבלות לעוסק פטור"
🔘 Public (חשוב! בחרי Public)
❌ אל תסמני: "Add a README file"
❌ אל תסמני: "Add .gitignore"
❌ אל תסמני: "Choose a license"
```

### ג. לחצי על הכפתור הירוק: **"Create repository"**

---

## שלב 2: העלאת הקבצים (3 דקות)

### אחרי יצירת ה-Repository, GitHub יציג לך מסך עם הוראות.

### תראי משהו כזה:
```
…or push an existing repository from the command line

git remote add origin https://github.com/YOUR-USERNAME/receipt-app.git
git branch -M main
git push -u origin main
```

### 💡 **שימי לב:** תחליפי `YOUR-USERNAME` בשם המשתמש שלך ב-GitHub!

---

## שלב 3: פקודות להעלאה

### פתחי את **CMD** או **PowerShell** והעתיקי את הפקודות הבאות:

```bash
cd "C:\Users\yarin\OneDrive\שולחן העבודה\תוכן"

git remote add origin https://github.com/YOUR-USERNAME/receipt-app.git

git branch -M main

git push -u origin main
```

### ⚠️ **חשוב:**
- החליפי `YOUR-USERNAME` בשם המשתמש שלך ב-GitHub!
- אם זו הפעם הראשונה שאת משתמשת ב-Git, ייתכן שיתבקש ממך להתחבר

---

## שלב 4: הפעלת GitHub Pages (2 דקות)

### א. ב-GitHub, גשי ל-Repository שיצרת
### ב. לחצי על **"Settings"** (למעלה, ליד הכוכב)
### ג. בתפריט הצד, לחצי על **"Pages"**
### ד. תחת **"Source"**, בחרי:
```
Branch: main
Folder: / (root)
```
### ה. לחצי **"Save"**

### 🎉 תוך 1-2 דקות, האתר שלך יהיה זמין בכתובת:
```
https://YOUR-USERNAME.github.io/receipt-app/
```

---

## 📝 סיכום מהיר:

1. ✅ פתחי https://github.com/new
2. ✅ צרי repository בשם `receipt-app` (Public)
3. ✅ העתיקי את הפקודות מלמעלה ל-CMD
4. ✅ הפעילי GitHub Pages ב-Settings > Pages
5. ✅ האתר יהיה זמין תוך דקה!

---

## ❓ אם נתקעת:
כתבי לי מה השלב שבו נתקעת ואעזור לך!

## 🔗 אחרי שזה עובד:
תוכלי לשתף את הקישור `https://YOUR-USERNAME.github.io/receipt-app/` עם כל מי שתרצי,
והם יוכלו ליצור קבלות משלהם!
