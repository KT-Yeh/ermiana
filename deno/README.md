# /deno 

此資料夾包含以 **TypeScript** 開發、並部署在 **Deno Deploy** 的小工具與範例程式。

## counter.ts  伺服器計數器 

- **用途**：用於計算與記錄 Discord bot 被加入的伺服器（guild）數量，作為統計與儀表板資料來源。
- **替代**：此檔案用來替代舊有的 `/workers/ermiana-count.js`（將同步或移轉功能至 Deno 環境）。
- **技術**：TypeScript + Deno（建議部署至 Deno Deploy）。

## 快速上手 

- 本地執行（視程式需要的權限）：

```bash
# 例：允許網路與環境變數（依實際需求調整）
den o run --allow-net --allow-env deno/counter.ts
```

- Deno Deploy：
  1. 在 Deno Deploy 建立一個新服務（Project）。
  2. 指定 `counter.ts` 為入口檔案，並設定必要的環境變數（若有）。
  3. 部署後會有公開 URL，可用來做 webhook 呼叫或定期 ping。

## API / 使用方式（範例）

- counter.ts 會暴露簡單的 HTTP 介面（例如 `/count`、`/ping` 等）以便 Bot 或其他服務呼叫以更新或讀取計數。詳情請參考程式碼註解。

```bash
# 範例：讀取計數
curl https://<your-deno-deploy>.deno.dev/count
```

## 維運 & 注意事項 

- 本地測試時請注意授權參數（`--allow-net`, `--allow-env` 等）。
- 部署後建議監控流量與日誌以確保計數正確。 
- 若要清理舊版，可在確認功能等效後移除 `/workers/ermiana-count.js`。

## 貢獻或問題回報 

歡迎提出 PR 或 issue。如果需要，我可以幫忙加入更詳細的 API 範例或自動化部署說明。
