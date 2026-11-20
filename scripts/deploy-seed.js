const { spawnSync } = require('child_process');

if (process.env.RUN_SEED_ON_DEPLOY !== 'true') {
  process.exit(0);
}

const result = spawnSync(process.execPath, ['prisma/seed.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
