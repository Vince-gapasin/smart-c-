import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes       from './routes/auth.routes.js';
import userRoutes       from './routes/user.routes.js';
import credentialRoutes from './routes/credential.routes.js';
import adminRoutes      from './routes/admin.routes.js';

import * as CredService     from './services/credential-service.js';
import * as R               from './utils/response.js';
import { blockchainStatus } from './services/blockchain.js';
import { ipfsStatus }       from './services/pinata.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`  ${req.method.padEnd(6)} ${req.path}`);
    next();
  });
}

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/admin',       adminRoutes);

app.get('/api/did/:did', async (req, res) => {
  const doc = await CredService.getDIDDocument(req.params.did);
  if (!doc) return R.notFound(res, 'DID document not found');
  return R.ok(res, doc);
});

app.get('/api/health', (_req, res) => {
  const bc   = blockchainStatus();
  const ipfs = ipfsStatus();
  res.json({
    status:      'ok',
    service:     'LumenID Backend',
    version:     '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp:   new Date().toISOString(),
    blockchain: {
      enabled:          bc.enabled,
      rpcConfigured:    bc.rpcConfigured,
      signerConfigured: bc.signerConfigured,
      contractAddress:  bc.contractAddress,
    },
    ipfs: {
      enabled:       ipfs.enabled,
      jwtConfigured: ipfs.jwtConfigured,
      gateway:       ipfs.gateway,
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    data: null,
  });
});

app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error', data: null });
});

app.listen(PORT, () => {
  const line = '═'.repeat(40);
  console.log(`\n  ╔${line}╗`);
  console.log(`  ║  LumenID Backend · Running              ║`);
  console.log(`  ║  http://localhost:${PORT}                  ║`);
  console.log(`  ║                                          ║`);
  console.log(`  ║  /api/auth        → Auth endpoints       ║`);
  console.log(`  ║  /api/users       → Profile & Vault      ║`);
  console.log(`  ║  /api/credentials → Credential CRUD      ║`);
  console.log(`  ║  /api/admin       → Admin dashboard      ║`);
  console.log(`  ║  /api/did         → DID resolution       ║`);
  console.log(`  ╚${line}╝\n`);
});