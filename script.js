const API = "http://localhost:3000/cuchillos"; 

const form = document.getElementById("formulario");
const lista = document.getElementById("lista-cuchillos");
const btnHeaderCuchillos = document.getElementById("btn-nuestros-cuchillos");
const btnAgregarCuchillo = document.getElementById("btn-agregar-cuchillo");

/*Funciones de mostrar cuchillos*/
async function cargarCuchillos() { //llamada a la API con metodo GET
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Err: ${res.status}`);
    const data = await res.json();
    renderCuchillos(data); //con los datos obtenidos de la llamada, llamar al metodo que los renderiza en el html
}

function renderCuchillos(cuchillos) { //recibe el json que devuelve el get de la API
    lista.innerHTML = ""; //vacia lista
    if (cuchillos.length > 0) { //si la lista contiene algo, hay que borrar el elemento que dice "cargando cuchillos..."
        const cargando = document.getElementById("cargando-cuchillos");
        if (cargando) cargando.remove();
    }

    cuchillos.forEach((c) => { 
        const li = document.createElement("li"); //por cada elemento del json, creo un li y le pongo los datos del cuchillo
        li.textContent = `Nombre: ${c.nombre} | Tipo: ${c.tipo} | LargoHoja: ${c.largoHoja}cm | LargoTotal: ${c.largoTotal}cm`;

        const acciones = document.createElement("span"); //creo un span, que va a contener el botón de eliminar
        acciones.classList.add("acciones");

        const btnEliminar = document.createElement("button"); //creo el botón y le agrego un nombre, tipo de clase "btn-eliminar" y le agrego un evento al clickearlo (eliminar)
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.onclick = () => eliminarCuchillo(c.nombre, c.id);

        acciones.appendChild(btnEliminar); //añado el botón al span

        li.appendChild(acciones); //añado el span a la li
        lista.appendChild(li); //añado la li a la lista
    });
}


/*Función de agregar un cuchillo*/
form.addEventListener("submit", async (e) => { //evento al enviar el form
    e.preventDefault(); //evitar recarga
    const nombre = document.getElementById("nombre").value.trim(); //traigo todos los datos del form
    const tipo = document.getElementById("tipo").value;
    const largoHoja = parseInt(document.getElementById("largo-hoja").value); //los parseo a Int para evitar errores
    const largoTotal = parseInt(document.getElementById("largo-total").value); //los parseo a Int para evitar errores

    if (!nombre || !tipo || isNaN(largoHoja) || isNaN(largoTotal)) { //si alguno está vacio
        alert("Complete todos los campos");
        return;
    }

    if (largoHoja >= largoTotal) { //validación de largo
        alert("Error, el largo de la hoja no puede ser mayor ni igual al largo total");
        return;
    }

    if (largoHoja < 5 || largoHoja > 30) { //validación de largo
        alert("Error, el largo de la hoja tiene que ser de entre 5 y 30 centimetros");
        return;
    }

    if (largoTotal < 10 || largoTotal > 45) { //validación de largo
        alert("Error, el largo de la hoja tiene que ser de entre 10 y 45 centimetros");
        return;
    }

    if (window.confirm(`¿Desea agregar el cuchillo ${nombre}?`)) { //lanzo una alert para que me confirme si quiere enviarlo
        await fetch(API, { //mando un post a la API con los datos obtenidos del form
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, tipo, largoHoja, largoTotal })
        });

        alert(`Cuchillo ${nombre} agregado correctamente`);
        form.reset(); //vacio el formulario por si quiere volver a cargar otro
        cargarCuchillos(); //renderizo devuelta los cuchillos
    }
});

/*Función de eliminar un cuchillo*/
async function eliminarCuchillo(nombre, id) { //recibe el id del cuchillo
    if (window.confirm(`¿Desea eliminar el cuchilo ${nombre}?`)) { //lanzo un alert para confirmar que lo quiere eliminar
        await fetch(`${API}/${id}`, { method: "DELETE" }); //hago una llamada a la API con metodo DELETE, y en la url va el id a eliminar
        alert(`Cuchillo ${nombre} eliminado con éxito`);
        cargarCuchillos(); //renderizo devuelta los cuchillos
    }
}

/*Eventos*/
window.addEventListener("DOMContentLoaded", cargarCuchillos); //evento inicial, renderiza los cuchillos

btnHeaderCuchillos.addEventListener("click", () => { //scroll behavior en los botones, para que al tocar uno del header vaya a su respectivo lugar con suavidad
    document.querySelector(".main").scrollIntoView({ behavior: "smooth" });
});

btnAgregarCuchillo.addEventListener("click", () => { //scroll behavior en los botones, para que al tocar uno del header vaya a su respectivo lugar con suavidad
    document.querySelector(".formulario").scrollIntoView({ behavior: "smooth" });
});