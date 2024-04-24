const { createServer } = require('vite');

async function startServer(port, entry) {
  const server = await createServer({
    // 指定 Vite 配置
    configFile: './vite.config.ts',
    server: {
      port,
    }
  });
  await server.listen();
}
async function main() {
  await startServer(5173, 'main');
  await startServer(3006, 'translator');
}

main();