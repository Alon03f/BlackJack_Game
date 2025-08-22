# 🎲 Blackjack Game – משחק בלאק ג'ק

## 📖 תוכן העניינים
- [English](#english)
- [עברית](#עברית)

---

# English

## 🃏 Project Overview
This project is a **fully animated Blackjack game** built with **HTML, CSS, and JavaScript**.  
It simulates a real casino experience with smooth animations, chip betting, statistics tracking, and proper Blackjack rules, including **Split** and **Double Down**.

The project was designed to be:
- 🎨 Visually appealing with professional casino-inspired design.
- 📱 Fully responsive across desktop, tablet, and mobile devices.
- 💾 Persistent, saving bankroll and stats using `localStorage`.

---

## 🚀 Features
- **Full Blackjack Rules**:
  - Dealer stands on soft 17.
  - Natural Blackjack pays 3:2.
  - Split and Double Down supported (with restrictions as in real casinos).
  - Split Aces receive one card only (not counted as Blackjack).
- **Betting System**:
  - Chips available in values of 5, 10, 25, 50, 100, 500.
  - Bets placed visually on the table with drag-like animation.
  - Bankroll auto-updates with animated counting effect.
- **Responsive Design**:
  - Smooth scaling with `clamp()`.
  - Breakpoints for 1200px, 992px, 768px, 576px, and 420px.
  - Mobile: fixed bottom bar for actions, scrollable chip row.
- **Statistics Tracking**:
  - Table tracks 10 last results (Player/Dealer/Push).
  - Auto-scrolls, removing older results.
- **Visual Feedback**:
  - Toast notifications (“You Win!”, “You Lose..”, “Blackjack!!!”).
  - Bust/Blackjack tags above cards.
- **Persistence**:
  - Bankroll, stats, and last bet saved with `localStorage`.

---

## 🛠️ Tech Stack
- **HTML5**
- **CSS3 (Responsive with Flex/Grid & clamp())**
- **Vanilla JavaScript (ES6+)**
- **LocalStorage** (for persistence)

---

## 📂 Project Structur
📁 project-root
┣ 📁 assets
┃ ┣ 📁 cards # All card images (e.g. AS.png, 5H.png, back.png)
┃ ┗ 📁 chips # Chip images (5.png, 10.png, 25.png, 50.png, 100.png, 500.png)
┣ index.html # Main HTML file
┣ style.css # Styling & responsive rules
┣ app.js # Game logic & animations
┗ README.md # This file

---

## ⚙️ Installation & Run
1. Clone or download the repository.
2. Place card and chip images inside `assets/cards` and `assets/chips`.
3. Open `index.html` in any modern browser.

No backend is required – everything runs client-side.

---

## 📱 Responsiveness
- Desktop: full experience with chips and controls around the table.
- Tablet: stacked player hands, rescaled chips/cards.
- Mobile: action bar at the bottom, chip row above, fully optimized for touch.

---

## 📜 License
This project is released under the **MIT License** – free to use, modify, and distribute.

---

# עברית

## 🃏 סקירת הפרויקט
הפרויקט הוא **משחק בלאק־ג'ק מונפש** שנבנה ב־**HTML, CSS, JavaScript**.  
המשחק מדמה חוויית קזינו אמיתית עם אנימציות חלקות, הימורים בצ'יפים, טבלת סטטיסטיקה וחוקי המשחק המלאים כולל **ספליט** ו־**דאבל דאון**.

המשחק נבנה כך שיהיה:
- 🎨 מעוצב ומזמין בעיצוב בסגנון קזינו אמיתי.
- 📱 מותאם באופן מלא לכל מסך – מחשב, טאבלט ונייד.
- 💾 שומר נתוני יתרה וסטטיסטיקות באמצעות `localStorage`.

---

## 🚀 פיצ'רים
- **חוקי בלאק־ג'ק מלאים**:
  - דילר עומד על 17 (כולל "סופט 17").
  - בלאק־ג'ק טבעי משלם ביחס 3:2.
  - תמיכה בספליט ודאבל דאון (בהתאם למגבלות האמיתיות).
  - פיצול אסים – קלף אחד ליד (לא נחשב בלאק־ג'ק).
- **מערכת הימורים בצ'יפים**:
  - ערכי צ'יפים: 5, 10, 25, 50, 100, 500.
  - הצגת צ'יפים על השולחן באנימציה.
  - יתרה מתעדכנת אוטומטית עם אפקט "ספירה".
- **עיצוב רספונסיבי**:
  - שימוש ב־`clamp()` להתאמות חלקות.
  - נקודות שבירה ב־1200, 992, 768, 576, 420 פיקסלים.
  - מובייל: סרגל פעולות קבוע בתחתית, שורת צ'יפים גלילה מעל.
- **מעקב סטטיסטי**:
  - טבלה עם 10 התוצאות האחרונות (שחקן/דילר/תיקו).
  - תוצאות ישנות נעלמות אוטומטית.
- **משוב ויזואלי**:
  - חלוניות קופצות (“ניצחת!”, “הפסדת..”, “Blackjack!!!”).
  - תגים ("BUST", "BlackJack") ליד הקלפים.
- **שימור נתונים**:
  - יתרה, סטטיסטיקות והימור אחרון נשמרים ב־`localStorage`.

---

## 🛠️ טכנולוגיות
- **HTML5**
- **CSS3** (רספונסיבי עם Flex/Grid ו־clamp)
- **JavaScript (ES6+)**
- **LocalStorage**

---

## 📂 מבנה הפרויקט
📁 project-root
┣ 📁 assets
┃ ┣ 📁 cards # כל תמונות הקלפים (AS.png, 5H.png, back.png וכו')
┃ ┗ 📁 chips # כל תמונות הצ'יפים (5.png, 10.png, 25.png, 50.png, 100.png, 500.png)
┣ index.html # קובץ HTML ראשי
┣ style.css # עיצוב + רספונסיביות
┣ app.js # לוגיקת המשחק ואנימציות
┗ README.md # קובץ זה


---

## ⚙️ התקנה והרצה
1. הורד או שיבט את הריפו.
2. הכנס את תמונות הקלפים והתמונות של הצ'יפים לתיקיות `assets/cards` ו־`assets/chips`.
3. פתח את `index.html` בכל דפדפן מודרני.

אין צורך בשרת – המשחק רץ כולו בצד הלקוח.

---

## 📱 התאמה רספונסיבית
- מחשב שולחני: חוויה מלאה עם כל הכפתורים והצ'יפים.
- טאבלט: סידור מחדש של קלפים והקטנת רכיבים.
- מובייל: סרגל פעולות קבוע בתחתית, שורת צ'יפים גלילה מעל, מותאם למסך מגע.

--

## 📜 רישיון
הפרויקט מופץ תחת רישיון **MIT** – חופשי לשימוש, עריכה והפצה.
---

 
## Contact
You can reach me at [LinkedIn](https://www.linkedin.com/in/alon-fridman-16a917352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app) or [GitHub](https://github.com/Alon03f).
