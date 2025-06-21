# 🤖 Robot Interaction Logger

A React Native mobile app that logs AI-driven conversations between educational robots and students in real-time, with robust offline data persistence and dynamic Firestore structuring.

---

## 🚀 Features

- 📱 Mobile-first interface built with React Native  
- 🧠 Logs AI–user conversations per robot device  
- 🔁 Offline data queuing using AsyncStorage  
- ☁️ Syncs logs to Firebase Firestore with accurate timestamps  
- 📂 Dynamic Firestore collections for robot-wise log segregation  
- 🔐 Firebase Authentication for secure access  

---

## 🛠️ Tech Stack

- React Native  
- Firebase Firestore  
- Firebase Authentication  
- AsyncStorage (for offline persistence)  

---

## 🗂️ Data Structure

Each robot has its own Firestore sub-collection:

robots/
└─ robot_id/
└─ logs/
└─ [timestamped_log_entries


Each log entry includes:

- `message`: The conversation text  
- `sender`: Robot or User  
- `timestamp`: UTC ISO string  
- `context`: Optional metadata or tags  

---

## 📦 Installation

```bash
git clone https://github.com/swapisticated/siksha_logs_app.git
cd siksha_logs_app
npm install
# or
pnpm install

```
🧪 Run the App
```
npm run android
```


## 📸 Screenshots

| Robot Selector  | Log View | Log View |
|-------------|----------------|-------------|
| ![Home](https://github.com/user-attachments/assets/e7949c6c-6ccf-4f26-9692-4e261e78ad07) | ![Log](https://github.com/user-attachments/assets/36e981a0-d3ce-4cd8-86f0-ebfacd8f6447) | ![Sync](https://github.com/user-attachments/assets/0d03cc58-7468-4d73-bf7d-1d9a769427b6) |


--- 

✍️ Author

    @swapisticated

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.
