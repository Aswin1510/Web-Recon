# BMSCE EventVerse

> One sharp, searchable home for workshops, hackathons, fests, talks and the campus moments you do not want to miss.

**BMSCE EventVerse** is a student-built campus event platform for **BMS College of Engineering, Bengaluru**. It brings together everything happening on campus — workshops, hackathons, competitions, cultural fests, seminars and club activities — into one clean, searchable and easy-to-use website.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Search & Filter** | Find events by keyword, category, organizer, date or eligibility |
| 📅 **Upcoming Events** | Browse the campus calendar sorted by date |
| 📝 **Submit Events** | Organizers can publish new events with full details |
| 👤 **Student & Organizer Login** | Role-based accounts with a personal portal dashboard |
| 🌙 **Dark / Light Mode** | Toggle between themes, preference saved locally |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet and mobile |
| 🎨 **Modern UI** | Bold typography, smooth animations and poster-style event cards |
| 🔔 **Toast Notifications** | Instant feedback for actions like publishing or sharing |
| 📤 **Share Events** | Share event links via Web Share API or clipboard |

---

## 🖼️ Screenshots

### Homepage — Hero
![Homepage Hero](screenshots/homepage-hero.png)

### Homepage — Coming Up on Campus
![Coming Up on Campus](screenshots/homepage-events.png)

### Explore Events
![Explore Events](screenshots/explore-events.png)

### Submit Event
![Submit Event](screenshots/submit-event.png)

### About
![About](screenshots/about.png)

### Login
![Login](screenshots/login.png)

### Event Details
![Event Details](screenshots/event-details.png)

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, responsive design
- **Vanilla JavaScript** — No frameworks, no build step
- **localStorage** — Events, user accounts and sessions stored in the browser

---

## 📁 Project Structure

```
├── index.html            # Homepage
├── events.html           # Explore / browse events
├── event-details.html    # Single event detail view
├── submit-event.html     # Event submission form
├── login.html            # Student / Organizer login & register
├── portal.html           # Personal dashboard (after login)
├── about.html            # About the project
├── style.css             # All styles (light + dark themes)
├── script.js             # All application logic
├── BMSCE.jpeg            # College logo
├── logo.jpeg             # Alternate logo
├── eventverse-logo.svg   # EventVerse logo
└── screenshots/          # README screenshots
```

---

## 🚀 Getting Started

### Prerequisites

Any modern web browser — that's it. No build tools or server required.

### Run Locally

**Option 1 — Direct open**

Simply open `index.html` in your browser.

**Option 2 — Local server (recommended)**

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve -l 8080
```

Then visit `http://localhost:8080` in your browser.

---

## 👥 User Roles

### Student
- Browse and search all campus events
- View event details (venue, fee, deadline, contact)
- Register via external links
- Share events with friends

### Organizer
- Everything a student can do, plus:
- Submit new events through a validated form
- View a personal dashboard with their published events
- Track upcoming vs. completed events

---

## 📋 Event Categories

`Workshop` · `Hackathon` · `Competition` · `Fest` · `Seminar/Talk` · `Cultural Event` · `Technical Event` · `Club Activity` · `Other`

---

## 🎯 Why This Exists

> Students often miss important events because updates are spread across WhatsApp groups, posters, Instagram posts, and registration forms.

BMSCE EventVerse brings campus activities together in one searchable and easy-to-use platform — so you never miss the thing worth showing up for.

---

## 📄 License

This is a student project for BMS College of Engineering. Feel free to use it as a template for your own campus.

---

## 🤝 Contributing

This is a student project. If you're a BMSCE student and want to contribute, reach out to the team!

---

**Made with ❤️ by students, for students — BMSCE EventVerse**
