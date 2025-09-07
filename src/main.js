import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Usar el router
app.use(router);

// Montar la aplicación en el elemento con id="app"
app.mount('#app');

console.log('✅ App iniciada correctamente');
console.log('🎯 Router configurado');
console.log('📱 CSS responsive cargados');
