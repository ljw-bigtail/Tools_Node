import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chromeExtension } from './packages/hy-vite-plugin-chrome-ext/src/index';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    chromeExtension({
      singleScripts: ['content', 'sdk'],
    }),
  ],
  build: {
    outDir: "运营工具箱",
    rollupOptions: {
      // inlineDynamicImports: true,
      input: {
        action: path.resolve(__dirname, "action.html"),
        content: path.resolve(__dirname, "content.html"),
        background: path.resolve(__dirname, "background.html"),
      },
      output: {
        entryFileNames: `assets/[name].bundle.js`,
        chunkFileNames: `assets/[name].bundle.js`,
        assetFileNames: `assets/[name].bundle.[ext]`,
      }
    },
    modulePreload: {
      polyfill: false,
      // resolveDependencies: (filename, deps, { hostId, hostType }) => {
      //   console.log('filename:', filename, filename == 'assets/action.js' ? deps : [])
      //   return filename == 'assets/action.js' ? deps : [];
      // }
    }
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
