import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import VuetifyPlugin from 'vite-plugin-vuetify'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
import EslintPlugin from 'vite-plugin-eslint'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'
const isDevEnv = process.env.NODE_ENV === 'development'

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
        ELECTRON_ENABLE_LOGGING: 'true'
      }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  rmSync('dist', { recursive: true, force: true })

  const electronPluginConfigs: ElectronOptions[] = [
    {
      entry: 'src/main/index.ts',
      onstart({ startup }) {
        startup()
      },
      vite: {
        build: {
          assetsDir: '.',
          outDir: 'dist/main',
          rollupOptions: {
            plugins: [
              require('@rollup/plugin-alias')({
                entries: [{ find: '@', replacement: resolve(__dirname, 'src') }]
              })
            ],
            external: ['electron', ...builtinModules, 'koffi']
          }
        }
      }
    },
    {
      entry: 'src/preload/index.ts',
      onstart({ reload }) {
        reload()
      },
      vite: {
        resolve: {
          alias: {
            '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src')
          }
        },
        build: {
          outDir: 'dist/preload'
        }
      }
    }
  ]

  if (isDevEnv) {
    electronPluginConfigs.push({
      entry: 'src/main/index.dev.ts',
      vite: {
        build: {
          outDir: 'dist/main'
        }
      }
    })
  }

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: './',
    root: resolve('./src/renderer'),
    publicDir: resolve('./src/renderer/public'),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve('./dist'),
      rollupOptions: {
        input: {
          main: 'index.html', // 客户端可视界面的入口
          translator: '../translator/translator.html', // 翻译端界面的入口
        }
      }
    },
    plugins: [
      Vue(),
      VueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      VuetifyPlugin({
        autoImport: true
      }),
      // EslintPlugin(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      ElectronPlugin(electronPluginConfigs),
      RendererPlugin()
    ]
  }
})
