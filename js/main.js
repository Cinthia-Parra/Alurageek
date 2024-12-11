import { servicesProducts } from "./conexionAPI.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

//  estructura HTML para ser renderizada
function createCard({ name, price, image, id }) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
		<div class="img-container">
			<img src="${image}" alt="${name}">
		</div>
		<div class="card-container--info">
			<p>${name}</p>
			<div class="card-container--value">
				<p>$${price}</p>
                <button class="delete-button" data-id="${id}">
					<img src="./elementos/iconos/basura.png" class="img-boteBasura" alt="Eliminar">
				</button>
			</div>
		</div>
	`;

  // evento de eliminación
    addDeleteEvent(card, id);

    return card;
}

// evento de eliminar producto a la tarjeta
function addDeleteEvent(card, id) {
    const deleteButton = card.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
    try {
    await servicesProducts.deleteProduct(id);
    card.remove();
    console.log(`Producto con id ${id} eliminado`);
    } catch (error) {
    console.error(`Error al eliminar el producto con id ${id}:`, error);
    }
    });
}

// Renderizar los productos en el DOM
const renderProducts = async () => {
    try {
    const listProducts = await servicesProducts.productList();
    listProducts.forEach((product) => {
    const productCard = createCard(product);
    productsContainer.appendChild(productCard);
    });
    } catch (err) {
    console.error("Error al renderizar productos:", err);
    }
};

// Manejo del evento de envío del formulario
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-image]").value;

    if (name === "" || price === "" || image === "") {
    alert("Por favor, complete todos los campos");
    } else {
    try {
    const newProduct = await servicesProducts.createProduct(
        name,
        price,
        image
    );
    console.log("Producto creado:", newProduct);
    const newCard = createCard(newProduct);
    productsContainer.appendChild(newCard);
    } catch (error) {
            console.error("Error al crear el producto:", error);
    }

    form.reset(); // Reinicia el formulario
    }
});

// Ejecuta la función de renderizado inicial
renderProducts();