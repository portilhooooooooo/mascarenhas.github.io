import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({root:'ux-preview',plugins:[react()],server:{host:'0.0.0.0',port:5174,strictPort:true},build:{outDir:'../.build/ux-preview',emptyOutDir:true}});
