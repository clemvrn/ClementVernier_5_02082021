//Déclaration de totalPrice (prix total)
let totalPrice = 0;

main();

async function main() {
    //Récupération des produits dans le panier
    const produitInLocalStorage = await JSON.parse(localStorage.getItem("produit"));

    //Insertion du contenu du panier
    hydrateProductPanier(produitInLocalStorage);
}

function hydrateProductPanier(produitInLocalStorage) {
    //Pour chaque produit présent dans le panier
    for (produit of produitInLocalStorage) {
        //Création du template
        const templateProductTeddies = document.getElementById("template-product-teddies");
        //On clone l'élément template
        const cloneProductTeddies = document.importNode(templateProductTeddies.content, true);
        //Utilisation de textContent pour modifier les informations du clone
        cloneProductTeddies.getElementById("teddie-product-name").textContent = produit.nomProduit;
        cloneProductTeddies.getElementById("teddie-product-price").textContent = produit.prixProduit;
        //Modification du prix pour calcul
        const price = parseInt(produit.prixProduit);
        //Calcul du prix total
        totalPrice = totalPrice + price;
        //Création d'un enfant du clone
        document.getElementById("section-product-teddies").appendChild(cloneProductTeddies);
        //Insertion du prix total
        document.getElementById("teddies-product-total-price").textContent = "Total : " + totalPrice + " €";
    }

    //Vérifier & Envoyer formulaire
    sendForm(produitInLocalStorage);
}

function sendForm(produitInLocalStorage) {
    //On récupère le formulaire de contact
    let myForm = document.getElementById("my-form");

    //Variable de vérification
    let verifOk = true;
    
    //Vérification des champs après le submit du formulaire
    myForm.addEventListener('submit', function(e) {
        e.preventDefault();

        //Récupération des champs du formulaire
        let myInputFirstName = document.getElementById("firstName").value;
        let myInputLastName = document.getElementById("lastName").value;
        let myInputCity = document.getElementById("city").value;
        let myInputEmail = document.getElementById("email").value;
        let myInputAddress = document.getElementById("address").value;

        //Condition pour les champs Prénom/Nom/Ville
        let stringRegex = /^[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ-]+$/;
        //Condition pour le champ Email
        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        //Vérification du champ firstName
        if (stringRegex.test(myInputFirstName) == false) {
            e.preventDefault();
            document.getElementById("firstName").style.cssText = 'border:1px solid red';
            verifOk = false;
        }
        //Vérification du champ lastName
        if (stringRegex.test(myInputLastName) == false) {
            e.preventDefault();
            document.getElementById("lastName").style.cssText = 'border:1px solid red';
            verifOk = false;
        }
        //Vérification du champ city
        if (stringRegex.test(myInputCity) == false) {
            e.preventDefault();
            document.getElementById("city").style.cssText = 'border:1px solid red';
            verifOk = false;
        }
        //Vérification du champ email
        if (emailRegex.test(myInputEmail) == false) {
            e.preventDefault();
            document.getElementById("email").style.cssText = 'border:1px solid red';
            verifOk = false;
        }
        //Vérification du champ address
        if (myInputAddress == "") {
            e.preventDefault();
            document.getElementById("address").style.cssText = 'border:1px solid red';
            verifOk = false;
        }

        //Création d'un tableau vide
        let produitsTab = [];

        //Mettre les ID de chaque produits du panier dans le tableau 
        for (produit of produitInLocalStorage) {
            const produitId = produit.idProduit;
            produitsTab.push(produitId);
        }

        //Objet contact avec les données du formulaire
        let contact = {
            firstName: myInputFirstName,
            lastName: myInputLastName,
            address: myInputAddress,
            city: myInputCity,
            email: myInputEmail,
        };

        //Tableau de product ID
        let products = produitsTab;

        //Préparer l'élément order qui sera envoyé
        let order = {
            contact,
            products,
        };
        
        //Si le formulaire est validé -> sendOrder();
        if (verifOk == true) {
            sendOrder(order);
        } else {
            alert("Erreur, les données du formulaire ne sont pas valides ! Veuillez réessayer ultérieurement.");
            //Réinitialisation de la valeur par défaut
            verifOk = true;
        }

    })
}

//Envoyer order
async function sendOrder(order) {
    try {
        let response = await fetch('http://localhost:3000/api/teddies/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (response.ok) {
            //Récupération de la réponse du back-end
            let data = await response.json();
            
            //On vide le localStorage
            localStorage.clear();

            //Récupération du n° de commande
            localStorage.setItem("orderId", data.orderId);

            //Récupération du prix total
            let totalFinalPrice = totalPrice;
            localStorage.setItem("totalPrice", totalFinalPrice);

            //Redirection vers la page de confirmation
            document.location.href = "commande.html";

        } else {
            alert("Erreur, Veuillez réessayer ultérieurement.");
        }

    } catch (error) {
        console.log(error);
    }
}