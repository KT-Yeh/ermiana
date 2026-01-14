# /deno 

此資料夾包含以 **TypeScript** 開發、並部署在 **Deno Deploy** 的小工具。

<a href="https://discord.com/application-directory/1078919650764652594"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fermiana.deno.dev%2F&style=flat-square&logo=Discord&logoColor=white&cacheSeconds=86400"></a>

## counter.ts

- **用途**：用於計算與記錄 Discord bot 被加入的伺服器（guild）數量，作為儀表板的資料來源。
- **替代**：用以替代舊有的 [/workers/ermiana-count.js](../workers/ermiana-count.js) 。

## 快速上手 

- 本地執行（視程式需要的權限）：

```bash
# 例：允許網路與環境變數（依實際需求調整）
deno run --allow-net --allow-env deno/counter.ts
```

- Deno Deploy：

  **Option A — Dashboard（建議）**:
  1. 在 Deno Deploy 建立一個新 Project，並連結你的 GitHub repository 或上傳檔案。
  2. 在 Project 設定中將入口檔案設定為 `deno/counter.ts`（或對應路徑），並在 Environment variables 加入必要的變數（例如 API tokens）。
  3. 點選 Deploy（部署）後會產生公開 URL，可用於 webhook 呼叫或定期 ping。

  **Option B — 使用 deployctl（CLI）**:
  1. 安裝或以 `deno run` 使用 `deployctl`：

```bash
# 安裝（範例）
deno install -f -n deployctl https://deno.land/x/deploy/deployctl.ts
```

  2. 從 Deno Deploy 取得 API token（例如設為 `DENO_DEPLOY_TOKEN` 環境變數），並以環境變數或 flag 提供給 `deployctl`。
  3. 以 `deployctl` 發布：

```bash
# 範例（參考 deployctl 文件調整參數）
deployctl deploy --project <PROJECT_NAME> deno/counter.ts
```

  4. 部署完成後同樣會得到公開 URL，可供 webhook 或定期 ping 呼叫。

  **注意**：Deno Deploy 會自動處理 TypeScript，若程式需要本地檔案或特定權限，請確認部署環境是否支援並調整程式或設定。
