<template>
    <div class="container-fluid mt-4">
        <!-- Header -->
        <div class="text-center mb-4">
            <h1 class="display-4">
                <i class="bi bi-shop"></i> Tienda Online
            </h1>
            <p class="lead text-muted">Los mejores productos al mejor precio</p>
        </div>

        <div class="row">
            <!-- Columna 1: Productos Disponibles -->
            <div class="col-lg-8 col-md-7">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">
                            <i class="bi bi-box-seam"></i> Productos Disponibles
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div v-for="producto in productos" :key="producto.id"
                                 class="col-md-6 col-lg-4 mb-4">
                                <div class="card h-100 producto-card">
                                    <!-- Imagen del producto -->
                                    <div class="producto-imagen text-center p-3 bg-light">
                                        <img v-if="producto.imagen"
                                             :src="producto.imagen"
                                             :alt="producto.nombre"
                                             class="producto-img img-fluid">
                                        <i v-else
                                           :class="producto.icono"
                                           style="font-size: 4rem; color: #6c757d;"></i>

                                        <div class="position-absolute top-0 end-0 m-2">
                                            <span class="badge mb-1 d-block"
                                                  :class="getStockDisponible(producto.id) > 0 ? 'bg-success' : 'bg-danger'">
                                                Stock: {{ getStockDisponible(producto.id) }}
                                            </span>
                                            <span v-if="getItemEnCarrito(producto.id)"
                                                  class="badge bg-info d-block">
                                                En carrito: {{ getItemEnCarrito(producto.id).cantidad }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Alert para stock 0 -->
                                    <div v-if="getStockDisponible(producto.id) === 0"
                                         class="alert alert-danger m-2 mb-0 text-center">
                                        <strong>No hay más unidades disponibles en stock</strong>
                                    </div>

                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">{{ producto.nombre }}</h5>
                                        <p class="card-text text-primary fw-bold fs-4 mb-3">
                                            {{ formatearPrecio(producto.precio) }}
                                        </p>

                                        <button @click="agregarAlCarrito(producto)"
                                                class="btn mt-auto w-100"
                                                :class="getStockDisponible(producto.id) === 0 ? 'btn-secondary' : 'btn-primary'"
                                                :disabled="getStockDisponible(producto.id) === 0">
                                            <i class="bi" :class="getStockDisponible(producto.id) === 0 ? 'bi-x-circle' : 'bi-cart-plus'"></i>
                                            <span v-if="getStockDisponible(producto.id) === 0">
                                                Sin Stock Disponible
                                            </span>
                                            <span v-else>
                                                Agregar al Carrito
                                                <small v-if="getItemEnCarrito(producto.id)" class="d-block">
                                                    ({{ getItemEnCarrito(producto.id).cantidad }}/{{ producto.stock }} en carrito)
                                                </small>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna 2: Carrito de Compras -->
            <div class="col-lg-4 col-md-5">
                <div class="card shadow-sm sticky-top" style="top: 20px;">
                    <div class="card-header bg-success text-white">
                        <h4 class="mb-0 d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-cart3"></i> Carrito de Compras</span>
                            <span class="badge bg-light text-dark">{{ totalItems }}</span>
                        </h4>
                    </div>
                    <div class="card-body" style="max-height: 500px; overflow-y: auto;">
                        <!-- Carrito vacío -->
                        <div v-if="carrito.length === 0" class="text-center py-5">
                            <i class="bi bi-cart-x" style="font-size: 4rem; color: #dee2e6;"></i>
                            <p class="text-muted mt-3">Tu carrito está vacío</p>
                            <small class="text-muted">Agrega productos para comenzar</small>
                        </div>

                        <!-- Items del carrito -->
                        <div v-else>
                            <div v-for="item in carrito" :key="item.id"
                                 class="carrito-item mb-3 p-3 bg-light rounded">
                                <div class="row align-items-center">
                                    <div class="col-3">
                                        <div class="text-center p-2 bg-white rounded">
                                            <img v-if="item.imagen"
                                                 :src="item.imagen"
                                                 :alt="item.nombre"
                                                 class="carrito-img img-fluid">
                                            <i v-else
                                               :class="item.icono"
                                               style="font-size: 2rem; color: #6c757d;"></i>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <h6 class="mb-1">{{ item.nombre }}</h6>
                                        <small class="text-muted d-block">
                                            {{ formatearPrecio(item.precio) }} c/u
                                        </small>
                                        <span class="badge bg-secondary mt-1">
                                            Cantidad: {{ item.cantidad }}
                                        </span>
                                    </div>
                                    <div class="col-3 text-end">
                                        <button @click="removerDelCarrito(item.id)"
                                                class="btn btn-danger btn-sm"
                                                title="Remover del carrito">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-12 text-end">
                                        <small class="fw-bold text-primary">
                                            Subtotal: {{ formatearPrecio(item.precio * item.cantidad) }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total y botones -->
                    <div v-if="carrito.length > 0" class="card-footer bg-light">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>{{ formatearPrecio(subtotal) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>IVA (19%):</span>
                                <span>{{ formatearPrecio(iva) }}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold fs-5">
                                <span class="text-success">Total a Pagar:</span>
                                <span class="text-success">{{ formatearPrecio(totalPagar) }}</span>
                            </div>
                        </div>

                        <div class="d-grid gap-2">
                            <button @click="procesarCompra" class="btn btn-success btn-lg">
                                <i class="bi bi-credit-card"></i> Procesar Compra
                            </button>
                            <button @click="vaciarCarrito" class="btn btn-outline-danger">
                                <i class="bi bi-cart-x"></i> Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Información adicional -->
                <div class="card mt-3 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">
                            <i class="bi bi-info-circle"></i> Información
                        </h6>
                        <ul class="small mb-0">
                            <li>Envío gratis en compras sobre $50.000</li>
                            <li>Todos los precios incluyen IVA</li>
                            <li>Stock limitado en algunos productos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notificación simple -->
        <div v-if="mostrarNotificacion"
             class="position-fixed bottom-0 end-0 p-3"
             style="z-index: 1050;">
            <div class="alert alert-dismissible fade show"
                 :class="tipoNotificacion">
                <strong>{{ tituloNotificacion }}</strong>
                {{ mensajeNotificacion }}
                <button @click="cerrarNotificacion"
                        type="button"
                        class="btn-close">
                </button>
            </div>
        </div>
    </div>
</template>

<script>
// Importar imágenes de productos
import product1 from '@/assets/img/product-1.jpg'
import product2 from '@/assets/img/product-2.jpg'
import product3 from '@/assets/img/product-3.jpg'
import product4 from '@/assets/img/product-4.jpg'
import product5 from '@/assets/img/product-5.jpg'
import product6 from '@/assets/img/product-6.jpg'
export default {
    name: 'CarritoCompras',
    data() {
        return {
            productos: [
                {
                    id: 1,
                    nombre: 'Audífono',
                    precio: 30000,
                    stock: 3,
                    icono: 'bi bi-headphones',
                    imagen: product1
                },
                {
                    id: 2,
                    nombre: 'Mouse',
                    precio: 20000,
                    stock: 5,
                    icono: 'bi bi-mouse',
                    imagen: product2
                },
                {
                    id: 3,
                    nombre: 'Teclado',
                    precio: 15000,
                    stock: 10,
                    icono: 'bi bi-keyboard',
                    imagen: product3
                },
                {
                    id: 4,
                    nombre: 'Gabinete',
                    precio: 35000,
                    stock: 4,
                    icono: 'bi bi-pc-display',
                    imagen: product4
                },
                {
                    id: 5,
                    nombre: 'Pantalla',
                    precio: 175000,
                    stock: 3,
                    icono: 'bi bi-display',
                    imagen: product5
                },
                {
                    id: 6,
                    nombre: 'Silla',
                    precio: 150000,
                    stock: 2,
                    icono: 'bi bi-person-workspace',
                    imagen: product6
                }
            ],
            carrito: [],
            // Sistema de notificaciones
            mostrarNotificacion: false,
            tituloNotificacion: '',
            mensajeNotificacion: '',
            tipoNotificacion: 'alert-success'
        }
    },
    computed: {
        // Total de items en el carrito
        totalItems() {
            return this.carrito.reduce((total, item) => total + item.cantidad, 0);
        },

        // Subtotal sin IVA
        subtotal() {
            return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        },

        // IVA (19%)
        iva() {
            return Math.round(this.subtotal * 0.19);
        },

        // Total a pagar
        totalPagar() {
            return this.subtotal + this.iva;
        }
    },
    methods: {
        // Agregar producto al carrito
        agregarAlCarrito(producto) {
            const itemEnCarrito = this.carrito.find(item => item.id === producto.id);

            if (itemEnCarrito) {
                // Verificar stock disponible
                if (itemEnCarrito.cantidad >= producto.stock) {
                    // Mostrar alert nativo del navegador para mayor visibilidad
                    alert(`⚠️ STOCK AGOTADO\n\nNo hay más unidades disponibles de "${producto.nombre}".\n\nStock total: ${producto.stock} unidades\nCantidad en carrito: ${itemEnCarrito.cantidad} unidades\n\nNo se puede agregar más cantidad de este producto.`);

                    // También mostrar notificación visual
                    this.mostrarAlerta(
                        '⚠️ Stock Agotado',
                        `Ya tienes ${itemEnCarrito.cantidad} unidades de "${producto.nombre}" en el carrito. Stock máximo disponible: ${producto.stock}.`,
                        'alert-warning'
                    );
                    return;
                }
                // Incrementar cantidad
                itemEnCarrito.cantidad++;
            } else {
                // Verificar si hay stock disponible
                if (producto.stock === 0) {
                    alert(`❌ SIN STOCK\n\nEl producto "${producto.nombre}" no tiene stock disponible.`);

                    this.mostrarAlerta(
                        '❌ Sin Stock',
                        `El producto "${producto.nombre}" no tiene stock disponible.`,
                        'alert-danger'
                    );
                    return;
                }

                // Agregar nuevo producto al carrito
                this.carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    icono: producto.icono,
                    imagen: producto.imagen,
                    cantidad: 1
                });
            }

            // Mostrar confirmación
            this.mostrarAlerta(
                '✅ Producto Agregado',
                `"${producto.nombre}" agregado al carrito. Cantidad actual: ${this.carrito.find(item => item.id === producto.id).cantidad}/${producto.stock}`,
                'alert-success'
            );
        },

        // Remover producto del carrito
        removerDelCarrito(productoId) {
            const index = this.carrito.findIndex(item => item.id === productoId);
            if (index !== -1) {
                const nombreProducto = this.carrito[index].nombre;
                this.carrito.splice(index, 1);
                this.mostrarAlerta(
                    'Producto Removido',
                    `"${nombreProducto}" removido del carrito.`,
                    'alert-info'
                );
            }
        },

        // Vaciar todo el carrito
        vaciarCarrito() {
            if (this.carrito.length > 0) {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    this.carrito = [];
                    this.mostrarAlerta(
                        'Carrito Vaciado',
                        'Todos los productos han sido removidos del carrito.',
                        'alert-info'
                    );
                }
            }
        },

        // Procesar la compra
        procesarCompra() {
            if (this.carrito.length === 0) {
                alert('El carrito está vacío.\n\nAgrega algunos productos antes de procesar la compra.');
                return;
            }

            let detalleCompra = '';
            this.carrito.forEach(item => {
                detalleCompra += `${item.nombre}: ${item.cantidad} x ${this.formatearPrecio(item.precio)} = ${this.formatearPrecio(item.precio * item.cantidad)}\n`;
            });

            detalleCompra += `\nSubtotal: ${this.formatearPrecio(this.subtotal)}`;
            detalleCompra += `\nIVA (19%): ${this.formatearPrecio(this.iva)}`;
            detalleCompra += `\nTOTAL: ${this.formatearPrecio(this.totalPagar)}`;

            if (confirm('¿Confirmar la compra?\n\nRESUMEN:\n' + detalleCompra)) {
                this.mostrarAlerta(
                    '🎉 ¡Compra Exitosa!',
                    'Tu pedido ha sido confirmado. Gracias por tu compra.',
                    'alert-success'
                );
                this.carrito = [];
            }
        },

        // Obtener item del carrito por ID
        getItemEnCarrito(productoId) {
            return this.carrito.find(item => item.id === productoId);
        },

        // Obtener stock disponible (stock total - cantidad en carrito)
        getStockDisponible(productoId) {
            const producto = this.productos.find(p => p.id === productoId);
            const itemEnCarrito = this.carrito.find(item => item.id === productoId);
            const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
            return producto.stock - cantidadEnCarrito;
        },

        // Formatear precio a formato chileno
        formatearPrecio(precio) {
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP'
            }).format(precio);
        },

        // Sistema de modal personalizado para stock
        mostrarModalStock(titulo, mensaje, tipo) {
            this.tituloModal = titulo;
            this.mensajeModal = mensaje;
            this.tipoModal = tipo;
            this.mostrarModal = true;
        },

        cerrarModal() {
            this.mostrarModal = false;
        },

        // Sistema de notificaciones simple
        mostrarAlerta(titulo, mensaje, tipo) {
            this.tituloNotificacion = titulo;
            this.mensajeNotificacion = mensaje;
            this.tipoNotificacion = tipo;
            this.mostrarNotificacion = true;

            // Auto-cerrar después de 4 segundos
            setTimeout(() => {
                this.cerrarNotificacion();
            }, 4000);
        },

        cerrarNotificacion() {
            this.mostrarNotificacion = false;
        }
    },
    mounted() {
        console.log('Componente CarritoCompras montado correctamente');
        console.log('Productos cargados:', this.productos.length);
    }
}
</script>

<style scoped>
/* Estilos específicos del componente */
.container-fluid {
    max-width: 1400px;
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
}
/* Imágenes de productos */
.producto-img {
    max-height: 150px;
    max-width: 150px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.carrito-img {
    max-height: 50px;
    max-width: 50px;
    object-fit: cover;
    border-radius: 4px;
}
/* Tarjetas de productos */
.producto-card {
    transition: all 0.3s ease;
    border: none;
    overflow: hidden;
}
.producto-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
}
.producto-imagen {
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}
/* Items del carrito */
.carrito-item {
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
}
.carrito-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
/* Botones */
.btn {
    transition: all 0.3s ease;
    font-weight: 500;
}
.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
/* Badge de stock */
.badge {
    font-size: 0.75rem;
    padding: 0.4em 0.6em;
}
/* Scrollbar personalizado para el carrito */
.card-body::-webkit-scrollbar {
    width: 8px;
}
.card-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
.card-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
.card-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}
/* Animaciones */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
.carrito-item {
    animation: slideIn 0.3s ease-out;
}
/* Responsive */
@media (max-width: 768px) {
    .sticky-top {
        position: relative !important;
        margin-top: 20px;
    }

    .producto-imagen {
        min-height: 150px;
    }

    .producto-img {
        max-height: 120px;
        max-width: 120px;
    }
}
/* Efectos hover para cards */
.card {
    transition: box-shadow 0.3s ease;
}
.card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
/* Estilos para el display de precios */
.fs-4 {
    font-size: 1.3rem !important;
}
.fs-5 {
    font-size: 1.15rem !important;
}
/* Estilos para el modal personalizado */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}
.modal-custom {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}
.modal-header-custom {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.modal-header-custom.bg-success {
    background-color: #198754 !important;
}
.modal-header-custom.bg-warning {
    background-color: #ffc107 !important;
}
.modal-header-custom.bg-danger {
    background-color: #dc3545 !important;
}
.modal-header-custom.bg-info {
    background-color: #0dcaf0 !important;
}
.modal-title-custom {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.modal-body-custom {
    padding: 1.5rem;
}
.modal-footer-custom {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
/* Estilo para el alert de stock 0 */
.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
    border-radius: 0.25rem;
    padding: 0.5rem;
    margin: 0.5rem;
    font-size: 0.875rem;
}
</style>
