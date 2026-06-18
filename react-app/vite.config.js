// // react-app/vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5050",
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// });


// react-app/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
// USE this
import pkg from 'react-helmet-async'
const { HelmetProvider } = pkg

export default defineConfig({
  plugins: [react(), vike()],
  build: {
    cssCodeSplit: false,  // ← merge all CSS into one file
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  ssr: {
    noExternal: ['react-helmet-async']
  },
  server: {
    // Dev server proxy (npm run dev → localhost:5173)
    proxy: {
      "/api": {
        target: "http://localhost:5051",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "http://localhost:5051",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});