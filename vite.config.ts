/*
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-06-26 11:19:19
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-06-26 11:50:39
 * @FilePath: /AI-project/berarbobo-discovery/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    },
  },
})