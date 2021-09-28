main();

async function main() {
    //Récupération du prix total
    const totalPrice = await JSON.parse(localStorage.getItem("totalPrice"));

    //Récupération du n° de commande
    const orderId = await localStorage.getItem("orderId");

    //Insertion du contenu du panier
    hydrateCommande(totalPrice, orderId);
}

function hydrateCommande(totalPrice, orderId) {
    //Insertion du prix total
    document.getElementById("command-total-price").textContent = totalPrice + " €";

    //Insertion du n° de commande
    document.getElementById("order-id").textContent = orderId;

    //On vide le localStorage
    localStorage.clear();
}