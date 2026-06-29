# 瀚軒 - 多人數位名片系統

一個功能完整的子路徑方式多人數位名片系統，每個職員有獨立的網址，但共用同一套框架代碼。

## 🌐 訪問方式

- **首頁**: https://omnisynccard.github.io/hypersonic/
- **陳文冠**: https://omnisynccard.github.io/hypersonic/TonyChen/
- **林逸群**: https://omnisynccard.github.io/hypersonic/TerryLin/

## 🎯 核心特色

✅ **獨立網址** - 每個職員有自己的 URL
✅ **框架共用** - 修改一次，所有人自動更新
✅ **集中配置** - 所有資料在 people.json
✅ **易於擴展** - 新增職員只需 3 步
✅ **完整功能** - PWA、QR Code、VCF、社群媒體等

## 🏗️ 目錄結構

```
hypersonic/
├── index.html              # 首頁（員工選擇器）
├── people.json             # 中央配置檔案
├── framework/              # 共用框架
├── TonyChen/               # 職員 A 的獨立網址
├── TerryLin/               # 職員 B 的獨立網址
└── people/                 # 職員資料夾
```

## 🚀 快速開始

### 1. 編輯 people.json
修改公司資訊和職員資料。

### 2. 放入圖片
在 `people/person/assets/` 等資料夾中放入圖片。

### 3. 本地測試
```bash
python3 -m http.server 8000
```

### 4. 部署
推送到 GitHub，GitHub Pages 會自動部署。

## 📝 新增職員

1. 在 `people.json` 中新增職員資料
2. 建立 `person-c/` 資料夾和 `people/person-c/` 資料夾
3. 複製 `person/index.html` 到 `person-c/index.html`
4. 放入圖片

完成！新職員會自動出現在首頁。

## 📱 功能清單

- ✅ 獨立網址（子路徑方式）
- ✅ 公司 LOGO（可點擊）
- ✅ 股票代碼（可查詢）
- ✅ 個人照片（可放大）
- ✅ 名片圖片輪播
- ✅ 聯絡資訊（可互動）
- ✅ 社群媒體連結
- ✅ VCF 通訊錄下載
- ✅ 分享功能
- ✅ QR Code
- ✅ PWA 支援
- ✅ 深色模式
- ✅ 響應式設計

## 🔧 修改框架

修改 `framework/` 中的檔案，所有職員的名片會自動應用新框架。

- 修改 `framework/style.css` → 所有人的樣式更新
- 修改 `framework/main.js` → 所有人的邏輯更新
- 修改 `people.json` 中的 `theme` → 所有人的主題色更新

## 📄 授權

本系統由 OmniSync. WindTrace開發，可自由使用和修改。

## 📞 支援

如有問題，請檢查：
1. `people.json` 的格式是否正確
2. 圖片路徑是否正確
3. 瀏覽器控制台是否有錯誤訊息
