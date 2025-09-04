// Importar todas las imágenes de productos con manejo de errores
let product1, product2, product3, product4, product5, product6;

try {
  product1 = require('./img/product-1.JPG');
  console.log('product1 cargado:', product1);
} catch (e) {
  console.error('Error cargando product-1.JPG:', e);
  product1 = null;
}

try {
  product2 = require('./img/product-2.JPG');
  console.log('product2 cargado:', product2);
} catch (e) {
  console.error('Error cargando product-2.JPG:', e);
  product2 = null;
}

try {
  product3 = require('./img/product-3.JPG');
  console.log('product3 cargado:', product3);
} catch (e) {
  console.error('Error cargando product-3.JPG:', e);
  product3 = null;
}

try {
  product4 = require('./img/product-4.JPG');
  console.log('product4 cargado:', product4);
} catch (e) {
  console.error('Error cargando product-4.JPG:', e);
  product4 = null;
}

try {
  product5 = require('./img/product-5.JPG');
  console.log('product5 cargado:', product5);
} catch (e) {
  console.error('Error cargando product-5.JPG:', e);
  product5 = null;
}

try {
  product6 = require('./img/product-6.JPG');
  console.log('product6 cargado:', product6);
} catch (e) {
  console.error('Error cargando product-6.JPG:', e);
  product6 = null;
}

// Exportar las imágenes
export {
  product1,
  product2,
  product3,
  product4,
  product5,
  product6
}