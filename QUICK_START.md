# 🚀 快速開始指南

## 5 分鐘內建立您的多人名片系統

---

## 第 1 步：修改 `people.json`

編輯根目錄的 `people.json` 檔案，更新公司資訊和員工資料。

**只需修改這一個檔案！**

### 公司資訊部分

```json
"company": {
  "name": "Hyper 科技股份有限公司",        // 改成您的公司名稱
  "website": "https://www.hyper-tech.com", // 改成公司官網
  "logoUrl": "shared/logo.png",            // 公司 LOGO 路徑
  "stockCode": "3008",                     // 股票代碼（可留空）
  "phone": "+886-2-1234-5678"              // 公司電話
}
```

### 員工資料部分

為每個員工修改：

```json
{
  "id": "person-a",                        // 唯一識別碼（改成員工代碼）
  "name": {
    "zh": "王大明",                        // 中文姓名
    "en": "David Wang"                     // 英文姓名
  },
  "title": "執行長 / CEO",                 // 職稱
  "department": "策略發展部",              // 部門
  "contact": {
    "mobile": "+886-912-345-678",          // 手機
    "phone": "+886-2-1234-5678",           // 市話
    "email": "david.wang@hyper-tech.com"   // Email
  },
  "social": {
    "line": "davidwang_tw",                // LINE ID
    "facebook": "https://www.facebook.com/davidwang",
    "instagram": "davidwang.tw"
  },
  "assets": {
    "photoUrl": "people/person-a/assets/photo.jpg",
    "iconUrl": "people/person-a/assets/icon.png",
    "namecardFolder": "people/person-a/namecard/"
  }
}
```

---

## 第 2 步：建立員工資料夾

為每個員工建立資料夾結構：

```bash
mkdir -p people/person-a/assets
mkdir -p people/person-a/namecard
```

---

## 第 3 步：放入圖片

### 必需的圖片

在 `people/person-a/assets/` 中放入：

- **icon.png** - 頭像（192×192px 以上）
  - 用途：瀏覽器分頁、PWA 圖標
  - 建議：使用個人正式照片

- **photo.jpg** - 個人照片（400×400px 以上）
  - 用途：名片上的大頭照
  - 建議：高解析度、清晰的個人照片

### 可選的圖片

在 `people/person-a/namecard/` 中放入名片圖片：

- `card_zh.jpg` - 中文版名片
- `card_en.jpg` - 英文版名片
- `card_other.jpg` - 其他版本

---

## 第 4 步：本地測試

### 方法 1：使用 Python

```bash
cd hyper-business-cards
python3 -m http.server 8000
```

然後在瀏覽器中訪問 `http://localhost:8000`

### 方法 2：使用 Node.js

```bash
npx http-server hyper-business-cards -p 8000
```

### 方法 3：使用 Live Server（VS Code）

1. 在 VS Code 中開啟 `hyper-business-cards` 資料夾
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

---

## 第 5 步：部署到線上

### 選項 A：GitHub Pages（免費）

```bash
# 1. 建立 Git Repository
cd hyper-business-cards
git init

# 2. 新增所有檔案
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 推送到 GitHub
git branch -M main
git remote add origin https://github.com/your-username/hyper-business-cards.git
git push -u origin main
```

然後在 GitHub Repository 的 Settings → Pages 中啟用 GitHub Pages。

網站會在 `https://your-username.github.io/hyper-business-cards/` 上線！

### 選項 B：Manus 永久託管

1. 在 Manus 上建立新的 web-static 專案
2. 上傳所有檔案
3. 獲得永久網址

---

## 新增員工

### 只需 3 個步驟：

#### 1. 在 `people.json` 中新增員工配置

在 `"people": [...]` 陣列中新增：

```json
{
  "id": "person-d",
  "name": { "zh": "新員工", "en": "New Employee" },
  "title": "職稱",
  "department": "部門",
  "contact": {
    "mobile": "+886-912-345-XXX",
    "email": "newemp@hyper-tech.com"
  },
  "assets": {
    "photoUrl": "people/person-d/assets/photo.jpg",
    "iconUrl": "people/person-d/assets/icon.png",
    "namecardFolder": "people/person-d/namecard/"
  }
}
```

#### 2. 建立資料夾

```bash
mkdir -p people/person-d/assets
mkdir -p people/person-d/namecard
```

#### 3. 放入圖片

- 放入 `people/person-d/assets/icon.png`
- 放入 `people/person-d/assets/photo.jpg`
- （可選）放入名片圖片到 `people/person-d/namecard/`

**完成！** 新員工會自動出現在員工選擇器中。

---

## 修改框架（所有人自動更新）

所有框架檔案都在 `framework/` 資料夾中。

修改框架時，**所有員工的名片會自動應用新的框架**。

### 例如：修改顏色主題

編輯 `people.json` 中的 `theme` 部分：

```json
"theme": {
  "primaryColor": "#1a3a5c",      // 改成您的主色
  "accentColor": "#4a90e2",       // 改成您的強調色
  "backgroundColor": "#ffffff",
  "textColor": "#333333"
}
```

所有員工的名片主題色會立即更新！

---

## 常見問題

### Q: 修改後沒看到變化？
**A:** 清除瀏覽器快取（Ctrl+Shift+Delete）或按 Ctrl+F5 強制重新整理。

### Q: 圖片路徑怎麼寫？
**A:** 路徑相對於網站根目錄。例如：
- `people/person-a/assets/photo.jpg` ✅
- `./people/person-a/assets/photo.jpg` ❌

### Q: 如何隱藏某個聯絡方式？
**A:** 將該欄位設為空字串 `""`。例如：
```json
"fax": ""  // 不顯示傳真
```

### Q: 支援哪些社群媒體？
**A:** 目前支援：LINE、Facebook、Instagram、LinkedIn、YouTube、Twitter

### Q: 如何新增自訂社群媒體？
**A:** 編輯 `framework/main.js` 中的 `renderSocial()` 函式。

---

## 檔案清單

建立完整系統所需的最少檔案：

```
hyper-business-cards/
├── people.json                    # ⭐ 中央配置（必需修改）
├── index.html                     # 員工選擇入口
├── framework/                     # 共用框架
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   ├── service-worker.js
│   └── manifest.json
├── people/
│   ├── person-a/
│   │   ├── assets/
│   │   │   ├── icon.png
│   │   │   └── photo.jpg
│   │   └── namecard/
│   ├── person-b/
│   │   └── ...
│   └── person-c/
│       └── ...
├── shared/
│   └── logo.png
└── README.md
```

---

## 下一步

- 📖 詳細說明：查看 `README.md`
- 🎨 自訂設計：編輯 `framework/style.css`
- 🔧 進階功能：編輯 `framework/main.js`

---

**祝您使用愉快！** 🎉
