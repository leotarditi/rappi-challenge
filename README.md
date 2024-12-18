# **Frontend Developer Challenge**  

**Descripción del Proyecto**  
Tiendas *"El Baratón"* busca expandir sus servicios mediante el desarrollo de un e-commerce. Don Pepe, propietario de la tienda, ha definido los siguientes requerimientos para el desarrollo del proyecto:  

---

## **Requerimientos del Proyecto**  

### 1. **Menú de Categorías y Subniveles**  
- La tienda debe mostrar **categorías** conformadas por **subniveles** anidados.  
- Los subniveles pueden tener más subniveles, formando una estructura jerárquica.  
- El menú debe mostrar las categorías y sus subniveles de forma **anidada**.  
  - **Ejemplo**:  
    - Categoría: Licores  
      - Subnivel: Vinos  
        - Subnivel: Vinos tintos  
        - Subnivel: Vinos blancos  

---

### 2. **Visualización de Productos**  
- Los productos tienen:  
  - Un **identificador principal**.  
  - Un **identificador de subnivel**.  
- Los productos deben mostrarse **únicamente** en el subnivel correspondiente.  

---

### 3. **Filtros y Ordenamiento de Productos**  
- Los productos deben poder **filtrarse** por:  
  - Disponibilidad.  
  - Rango de precios.  
  - Cantidad en stock.  
- Los productos deben poder **ordenarse** por:  
  - Precio.  
  - Disponibilidad.  
  - Cantidad en stock.  

---

### 4. **Carrito de Compras**  
- El e-commerce debe incluir un **carrito de compras** con las siguientes funcionalidades:  
  - Agregar productos.  
  - Editar la cantidad de productos.  
  - Eliminar productos.  
- Los productos deben **permanecer en el carrito** aunque el usuario cierre y vuelva a abrir la página.  
- El carrito debe **borrarse** únicamente cuando el usuario realice la compra.  

---

### 5. **Búsqueda de Productos**  
- Un **subnivel final** es aquel que **no tiene más subniveles** anidados.  
- En los subniveles finales, debe aparecer una **caja de texto** que permita buscar productos por **nombre**.  

---

### 6. **Responsive Design**  
- El e-commerce debe ser completamente **responsive**, adaptándose a distintos dispositivos y tamaños de pantalla.  

---

## **Datos del Proyecto**  
Los datos de la tienda se encuentran en los siguientes archivos:  
- `categories.json`  
- `products.json`  

> **Nota**: Se pueden modificar los datos, pero **no debe cambiarse la estructura** de los archivos.

---

## **Requisitos Técnicos**  
- Uso **indispensable** de **JavaScript**.  
- Se puede utilizar cualquier **framework o librería** basado en **JavaScript** o **Node.js**.  
- El proyecto debe ser manejado con **git** y subido a un repositorio en **Bitbucket** o **GitHub** (a elección).  
- Incluir un archivo **README** con:  
  - Los **pasos** para compilar y ejecutar el proyecto.  
  - Información adicional sobre la **resolución del problema** (opcional).  

---

## **Consideraciones Finales**  
- Estructurar el código de manera clara y modular.  
- Asegurar la usabilidad y experiencia del usuario.  
- Cumplir con los requisitos funcionales mencionados.  