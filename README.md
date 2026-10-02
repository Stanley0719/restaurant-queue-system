# 餐廳排隊點餐系統

這是一個簡單的靜態前端專案，會顯示：

- 第一號
- 最後一號
- 目前叫號
- 待叫號列表

## 啟動方式

直接用瀏覽器開啟 `index.html` 即可，或使用本地伺服器：

```bash
python -m http.server 8000
```

接著前往：

```text
http://localhost:8000/
```

## GitHub Pages 部署

在 GitHub 建立新 repository 之後，執行：

```bash
git remote add origin https://github.com/<你的 GitHub 使用者名稱>/<你的 repository 名稱>.git
git branch -M main
git push -u origin main
```

之後在 GitHub 網站中：

1. 進入 repository
2. 點選 `Settings`
3. 左側選 `Pages`
4. 選擇 `Deploy from a branch`
5. Branch 選 `main`，Folder 選 `/root`
6. 儲存後即可取得 GitHub Pages 網址

如果你想直接在本地預覽：

```bash
cd restaurant-queue-system
python -m http.server 8000
```

然後打開：

```text
http://localhost:8000/
```
