```
  _   _ _______  ______  _______  __
 | \ | | ____\ \/ /  _ \|  __ \ \/ /
 |  \| |  _|  \  /| |_) | |__) \  /
 | |\  | |___ /  \|  _ <|  __ / /\ \
 |_| \_|_____/_/\_\_| \_\_|  /_/  \_\

  HTTP Client · ElrayyXml · v2.0.0
```

> **Zero-config API client. ESM + CJS. Full TypeScript. Singleton or instance — your call.**

[![npm](https://img.shields.io/npm/v/api-nexray.svg?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/api-nexray)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![downloads](https://img.shields.io/npm/dt/api-nexray.svg?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/api-nexray)
[![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen?style=flat-square)](https://nodejs.org)

---

## ▸ Install

```bash
npm install api-nexray
# or
yarn add api-nexray
# or
pnpm add api-nexray
```

---

## ▸ Quick Start

```ts
// ESM
import nexray from 'api-nexray';

// CJS
const nexray = require('api-nexray').default;

const data = await nexray.get('/ai/gemini', { text: 'Halo dunia' });
console.log(data);
// { status: true, author: '@nexray - ElrayyXml', result: '...' }
```

---

## ▸ Usage Patterns

### Pattern 1 — Global singleton (recommended)

Import `nexray` anywhere, it shares one global instance across your whole app.

```ts
// entry.ts — configure once
import nexray from 'api-nexray';

nexray.configure({
  baseURL: 'https://api.nexray.eu.cc',
  timeout: 30_000,
  maxRetries: 3,
  headers: { apikey: 'secret' },
});
```

```ts
// any other file — just use it, no new, no setup
import nexray from 'api-nexray';

const result = await nexray.get('/ai/gemini', { text: 'Hello' });
```

> Changes in `entry.ts` propagate globally. No passing config around.

---

### Pattern 2 — Own instance with `new Nexray()`

Useful when you need multiple isolated clients (different base URLs, different keys).

```ts
import { Nexray } from 'api-nexray';

const client = new Nexray({
  baseURL: 'https://my-other-api.com',
  timeout: 10_000,
  headers: { Authorization: 'Bearer token123' },
});

const data = await client.get('/endpoint', { q: 'hello' });
```

---

### Pattern 3 — Mix both

```ts
// file-a.ts — uses global singleton
import nexray from 'api-nexray';
const a = await nexray.get('/ai/gemini', { text: 'hi' });

// file-b.ts — own isolated instance
import { Nexray } from 'api-nexray';
const myClient = new Nexray({ baseURL: 'https://staging.api.com' });
const b = await myClient.get('/test');
```

---

## ▸ API Reference

### `nexray.get(endpoint, params?)`

```ts
const data = await nexray.get('/ai/gemini', {
  text: 'Jelaskan quantum computing',
});
console.log(data.result);
```

```bash
# output
{
  "status": true,
  "author": "@nexray - ElrayyXml",
  "result": "Quantum computing adalah..."
}
```

---

### `nexray.post(endpoint, data?)`

Supports plain values, file paths (any type), and raw `Buffer`.  
File type is detected automatically from extension — no hardcoded `.jpg`.

```ts
// plain POST
const res = await nexray.post('/ai/chatgpt', { text: 'Halo' });

// file upload — image
const res = await nexray.post('/ai/vision', { image: './photo.png' });

// file upload — video
const res = await nexray.post('/tools/transcode', { video: './clip.mp4' });

// file upload — document
const res = await nexray.post('/tools/parse', { file: './report.pdf' });

// file upload — audio
const res = await nexray.post('/ai/whisper', { audio: './voice.mp3' });

// raw Buffer
import fs from 'fs';
const buf = fs.readFileSync('./data.bin');
const res = await nexray.post('/tools/analyze', { data: buf });
```

**Supported file types (auto-detected MIME):**

| Category  | Extensions                                      |
| --------- | ----------------------------------------------- |
| Image     | jpg, jpeg, png, gif, webp, svg                  |
| Video     | mp4, mkv, mov, avi                              |
| Audio     | mp3, wav, ogg, flac                             |
| Document  | pdf, docx, xlsx, pptx                           |
| Archive   | zip, tar, gz                                    |
| Data      | json, xml, csv, txt, html, js, ts, py           |
| Binary    | any `Buffer` → `application/octet-stream`       |

Returns `Buffer` when server responds with non-JSON content (e.g. image, audio), JSON otherwise.

```ts
// response is a Buffer → save to file
import fs from 'fs';
const buffer = await nexray.post('/maker/generate', { text: 'cover' });
if (Buffer.isBuffer(buffer)) {
  fs.writeFileSync('output.jpg', buffer);
}
```

---

### `nexray.getBuffer(endpoint, params?)`

Always returns `Buffer` regardless of content-type.

```ts
const buf = await nexray.getBuffer('/maker/brat', { text: 'hi' });
if (Buffer.isBuffer(buf)) {
  fs.writeFileSync('result.jpg', buf);
}
```

---

### `nexray.configure(options)` / `instance.configure(options)`

```ts
nexray.configure({
  baseURL?: string;      // base URL for all requests
  timeout?: number;      // ms, e.g. 30000
  maxRetries?: number;   // retry count on failure (default: 3)
  headers?: Record<string, string>;
});
```

---

## ▸ Error Responses

All methods return a typed error object on failure — never throw.

```bash
# 400
{ "status": false, "author": "...", "error": "400 Bad Request - Invalid parameters or missing required fields" }

# 500
{ "status": false, "author": "...", "error": "500 Internal Server Error - Server encountered an error" }

# Network
{ "status": false, "author": "...", "error": "Network Error" }
```

```ts
const data = await nexray.get('/ai/gemini', { text: '' });
if (!data.status) {
  console.error(data.error); // handle it
}
```

---

## ▸ TypeScript Types

```ts
import type {
  NexrayOptions,
  NexrayResponse,
  NexrayError,
  NexrayResult,
} from 'api-nexray';
```

---

## ▸ CommonJS

```js
// CJS — works without any config
const { default: nexray } = require('api-nexray');
const { Nexray } = require('api-nexray');

(async () => {
  const data = await nexray.get('/ai/gemini', { text: 'test' });
  console.log(data);
})();
```

---

## ▸ Contact

| Platform   | Link                                             |
| ---------- | ------------------------------------------------ |
| Instagram  | [@elrayyxml](https://instagram.com/elrayyxml)    |
| TikTok     | [@elrayyxml](https://tiktok.com/@elrayyxml)      |
| Email      | elrayy68@gmail.com                               |
| WhatsApp   | [+6289526377530](https://wa.me/6289526377530)    |

[![WhatsApp Channel](https://img.shields.io/badge/Join-WhatsApp%20Channel-25D366?logo=whatsapp&logoColor=white&style=flat-square)](https://whatsapp.com/channel/0029Vb69z8n1dAvztHQTDu3r)

---

## ▸ License

[MIT](./LICENSE) © ElrayyXml
