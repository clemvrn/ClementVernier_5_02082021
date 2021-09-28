main();

async function main() {
    //Récupérer l'id du produit
    const teddieId = getTeddieId();

    //Récupérer le produit avec l'id
    //Utilisation de await pour attendre d'obtenir l'id
    const teddie = await getTeddie(teddieId);
    
    //Changer le contenu (hydrater)
    hydrateTeddie(teddie);
}

function getTeddieId() {
    //Object URL = informations sur l'URL + la propriété searchParams
    //Obtenir le paramètre "_id" contenu dans l'URL
    return new URL(location.href).searchParams.get('id');
}


function getTeddie(teddieId) {
    //Récupération du produit sélectionné grâce à son id
    return fetch("http://localhost:3000/api/teddies/" + teddieId)
      .then(function(httpBodyResponse) {
        return httpBodyResponse.json()
      })
      .then(function(teddie) {
        return teddie
      })
      .catch(function(error) {
        alert(error)
      })
  }
  
  function hydrateTeddie(teddie) {
    document.getElementById("teddie-name").textContent = teddie.name;
    document.getElementById("teddie-description").textContent = teddie.description;
    document.getElementById("teddie-img").src = teddie.imageUrl;

    //Modification du prix (séparation euros / centimes)
    const priceString = teddie.price.toString();
    const priceSlice = priceString.slice(0, -2) + "." + priceString.slice(-2);
    document.getElementById("teddie-price").textContent = priceSlice + " €";
  }

  //Lors de l'ajout au panier du produit
  function setData() {
    //Création du produit à mettre dans le Local Storage
    let produit = {
        idProduit: getTeddieId(),
        nomProduit: document.getElementById("teddie-name").textContent,
        prixProduit: document.getElementById("teddie-price").textContent,
    };

    //Local Storage
    //JSON.parse = convertir données JSON en object Javascript
    let produitInLocalStorage = JSON.parse(localStorage.getItem("produit"));

    //Si il y a déja des produits dans le panier
    if(produitInLocalStorage) {
        produitInLocalStorage.push(produit);
        //JSON.stringify = convertir object Javascript en données JSON
        localStorage.setItem("produit", JSON.stringify(produitInLocalStorage))
    }
    //Si il n'y a pas de produits dans le panier
    else {
        //Création du tableau de stockage des produits
        produitInLocalStorage = [];
        produitInLocalStorage.push(produit);
        //JSON.stringify = convertir object Javascript en données JSON
        localStorage.setItem("produit", JSON.stringify(produitInLocalStorage))
    }

    //Afficher le message de succès d'ajout au panier
    //Changement de display
    document.getElementById("message-success").style.display = "flex";
    //Changement d'opacité
    var myopacity = 0;
    function MyFadeFunction() {
        if (myopacity<1) {
            myopacity += .075;
            setTimeout(function(){MyFadeFunction()},100);
        }
        document.getElementById('message-success').style.opacity = myopacity;
    }
    MyFadeFunction();

}