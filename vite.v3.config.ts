import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// This separate entry never loads config.js, operational auth or legacy renderers.
export default defineConfig({root:'v3-preview',plugins:[react()],server:{host:'127.0.0.1',port:5186,strictPort:true,fs:{allow:['..']},proxy:{'/api/v3':{target:'http://127.0.0.1:8766',changeOrigin:false}}},build:{outDir:'../.build/v3-preview',emptyOutDir:true}});
