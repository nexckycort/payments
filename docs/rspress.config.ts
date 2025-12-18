import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Bloque Payments',
  description: 'Payment SDK for Colombia - Accept payments with cards, PSE, and cash',
  lang: 'en',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    lastUpdated: true,
    hideNavbar: 'auto',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/bloque-app/bloque-payments',
      },
    ],
    locales: [
      {
        lang: 'es',
        label: 'Español',
        editLink: {
          docRepoBaseUrl:
            'https://github.com/bloque-app/bloque-payments/tree/main/docs',
          text: '📝 Editar esta página en GitHub',
        },
        overview: {
          filterNameText: 'Filtrar',
          filterPlaceholderText: 'Introducir palabra clave',
          filterNoResultText: 'No se encontraron API coincidentes',
        },
      },
      {
        lang: 'en',
        label: 'English',
        editLink: {
          docRepoBaseUrl:
            'https://github.com/bloque-app/bloque-payments/tree/main/docs',
          text: '📝 Edit this page on GitHub',
        },
      },
    ],
  },
  languageParity: {
    enabled: false,
    include: [],
    exclude: [],
  },
});
