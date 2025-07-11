document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('mensaje');

  const errorNombre = nombre.nextElementSibling;
  const errorCorreo = correo.nextElementSibling;
  const errorMensaje = mensaje.nextElementSibling;

  form.addEventListener('submit', function(event) {
    // Limpiar mensajes anteriores
    errorNombre.textContent = '';
    errorCorreo.textContent = '';
    errorMensaje.textContent = '';

    let hasError = false;

    if (nombre.value.trim() === '') {
      errorNombre.textContent = "El nombre es obligatorio.";
      hasError = true;
    }

    if (correo.value.trim() === '') {
      errorCorreo.textContent = "El correo es obligatorio.";
      hasError = true;
    } else if (!validateEmail(correo.value)) {
      errorCorreo.textContent = "El correo no tiene un formato válido.";
      hasError = true;
    }

    if (mensaje.value.trim() === '') {
      errorMensaje.textContent = "El mensaje es obligatorio.";
      hasError = true;
    }

    if (hasError) {
      event.preventDefault(); // No enviar formulario si hay error
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    return re.test(email.toLowerCase());
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ... (Aquí va también el código de validación del formulario que ya hicimos)

  // Función para obtener y mostrar productos
  async function cargarProductos() {
    const contenedor = document.querySelector('.productos-container');
    contenedor.innerHTML = '<p>Cargando productos...</p>';

    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Error al cargar productos');

      const productos = await response.json();

      contenedor.innerHTML = ''; // Limpiar mensaje de carga

      productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        card.innerHTML = `
          <img src="${producto.image}" alt="${producto.title}">
          <p><strong>${producto.title}</strong></p>
          <p>Precio: $${producto.price.toFixed(2)}</p>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;

        contenedor.appendChild(card);
      });

      // Aquí podríamos agregar la funcionalidad para el botón "Agregar al carrito" más adelante

    } catch (error) {
      contenedor.innerHTML = '<p>Error al cargar los productos.</p>';
      console.error(error);
    }
  }

  cargarProductos();
});


document.addEventListener('DOMContentLoaded', () => {
    
  // Variables globales
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const contenedor = document.querySelector('.productos-container');
  const contadorCarrito = document.getElementById('carrito-cantidad');
  const carritoSection = document.getElementById('carrito');
  const carritoItems = document.getElementById('carrito-items');
  const carritoTotal = document.getElementById('carrito-total');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
  const carritoContenedor = document.getElementById('carrito-contenedor');

  // Actualizar contador visible en header
  function actualizarContador() {
    const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    contadorCarrito.textContent = cantidadTotal;
  }

  // Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Cargar productos desde API y mostrarlos
  async function cargarProductos() {
    contenedor.innerHTML = '<p>Cargando productos...</p>';

    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Error al cargar productos');

      const productos = await response.json();

      contenedor.innerHTML = '';

      productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        card.innerHTML = `
          <img src="${producto.image}" alt="${producto.title}">
          <p><strong>${producto.title}</strong></p>
          <p>Precio: $${producto.price.toFixed(2)}</p>
          <button class="btn-agregar" data-id="${producto.id}" data-title="${producto.title}" data-price="${producto.price}" data-image="${producto.image}">Agregar al carrito</button>
        `;

        contenedor.appendChild(card);
      });

      // Eventos para botones agregar
      const botonesAgregar = document.querySelectorAll('.btn-agregar');
      botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
          const id = boton.dataset.id;
          const title = boton.dataset.title;
          const price = parseFloat(boton.dataset.price);
          const image = boton.dataset.image;

          agregarAlCarrito({ id, title, price, image });
        });
      });

      actualizarContador();

    } catch (error) {
      contenedor.innerHTML = '<p>Error al cargar los productos.</p>';
      console.error(error);
    }
  }

  // Agregar producto al carrito
  function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContador();
    mostrarMensaje('Producto agregado al carrito');
    renderizarCarrito();
    actualizarContador();
  }

  // Mostrar/ocultar carrito al hacer click en el contador
  carritoContenedor.addEventListener('click', () => {
    carritoSection.style.display = carritoSection.style.display === 'none' ? 'block' : 'none';
    renderizarCarrito();
  });

  // Cerrar carrito
  cerrarCarritoBtn.addEventListener('click', () => {
    carritoSection.style.display = 'none';
  });

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    vaciarCarritoBtn.addEventListener('click', () => {
    const confirmar = window.confirm('¿Querés vaciar todo el carrito?');
    if (confirmar) {
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarCarrito();  
        actualizarContador(); 
        mostrarMensaje('Carrito vaciado');
    }
    });
    
    const finalizarCompraBtn = document.getElementById('finalizar-compra');

    finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('¡Gracias por su compra!');
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    actualizarContador();
    });
  // Renderizar carrito en la sección con edición y eliminar
  function renderizarCarrito() {
    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p>El carrito está vacío.</p>';
      carritoTotal.textContent = '0.00';
      document.getElementById('vaciar-carrito').disabled = true; 
      return;
    }

    document.getElementById('vaciar-carrito').disabled = false;
    carrito.forEach((producto, index) => {
      const div = document.createElement('div');
      div.style.borderBottom = '1px solid #ccc';
      div.style.padding = '10px 0';

      div.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}" style="width:50px; height:50px; object-fit:cover; vertical-align:middle; margin-right:10px;">
        <strong>${producto.title}</strong><br>
        Precio: $${producto.price.toFixed(2)} <br>
        Cantidad: 
        <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" style="width:50px;">
        <button data-index="${index}" class="eliminar-producto" style="margin-left:10px; cursor:pointer;">Eliminar</button>
      `;

      carritoItems.appendChild(div);
    });

    const total = carrito.reduce((acc, producto) => acc + producto.price * producto.cantidad, 0);
    carritoTotal.textContent = total.toFixed(2);

    // Eventos para editar cantidad
    const inputsCantidad = carritoItems.querySelectorAll('input[type="number"]');
    inputsCantidad.forEach(input => {
      input.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const cantidad = parseInt(e.target.value);
        if (cantidad < 1) {
          e.target.value = carrito[index].cantidad;
          return;
        }
        carrito[index].cantidad = cantidad;
        guardarCarrito();
        actualizarContador();
        renderizarCarrito();
      });
    });
    
    // Eventos para eliminar producto
    const btnsEliminar = carritoItems.querySelectorAll('.eliminar-producto');
    btnsEliminar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        guardarCarrito();
        actualizarContador();
        renderizarCarrito();
      });
    });
  }

  // Iniciar carga de productos
  cargarProductos();
  // Actualizar contador al cargar la página
  actualizarContador();
});

function mostrarMensaje(texto) {
  const mensaje = document.getElementById('mensaje-carrito');
  mensaje.textContent = texto;
  mensaje.style.display = 'block';
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 2000);
}