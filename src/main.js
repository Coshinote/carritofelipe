import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import CarritoCompras from './views/CarritoCompras.vue'; // Ruta ajustada a src/views/

const app = createApp(App);

// Registra el componente CarritoCompras globalmente
app.component('CarritoCompras', CarritoCompras);

// Usa el router
app.use(router);

// Monta la aplicación en el elemento con id="app"
app.mount('#app');

console.log('App iniciada correctamente con router y CarritoCompras registrado globalmente');
