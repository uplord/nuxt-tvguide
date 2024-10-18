// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  css: ['~/assets/scss/globals.scss'],
  devtools: { enabled: true },
  image: {
    domains: ['msaas.img.freeviewplay.net'],
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  srcDir: "src/",
  ssr: true,
})