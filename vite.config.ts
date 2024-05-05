import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import VuetifyPlugin from 'vite-plugin-vuetify'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
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
        resolve: {
          alias: {
            '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
            '@root': resolve(__dirname, '.')
          }
        },
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
            '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
            '@root': resolve(__dirname, '.')
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
        resolve: {
          alias: {
            '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
            '@root': resolve(__dirname, '.')
          }
        },
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
        '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
        '@root': resolve(__dirname, '.')
      }
    },
    assetsInclude: ['**/*.exe', '**/*.dll'],
    base: './',
    root: resolve('./src/renderer'),
    clearScreen: false,
    publicDir: resolve('./static/images'),
    build: {
      assetsDir: './static/images',
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve('./dist'),
      rollupOptions: {
        output: {
          assetFileNames: 'static/images/[hash]-[name][extname]'
        },
        input: {
          main: resolve(__dirname, './src/renderer/index.html'),
          translate: resolve(__dirname, './src/renderer/translate.html')
        }
      },
      assetsInlineLimit: 409600
    },
    plugins: [
      Vue(),
      VueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      VuetifyPlugin({
        autoImport: true
      }),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      ElectronPlugin(electronPluginConfigs),
      RendererPlugin()
    ]
  }
})
