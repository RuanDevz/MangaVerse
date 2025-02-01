import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 5173;

app.use(cors());

// Proxy middleware for MangaDex API
app.use('/api', createProxyMiddleware({
  target: 'https://api.mangadex.org',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  onProxyRes: function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
}));

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});