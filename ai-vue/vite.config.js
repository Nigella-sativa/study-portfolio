import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      '@':resolve(__dirname, 'src')
      //resolve方法：用来做路径拼接  意思是以@符表示绝对路径（以根目录与src拼接成的绝对路径）
    },
  },
  server:{
    proxy:{
      '/api':{
        target:'http://159.75.169.224:1235',
        changeOrigin:true
      }
    }
  }
})
