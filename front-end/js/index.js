main();

//Fonction asynchrone pour gérer les fonctions dans le temps
async function main() {
  //Utilisation de await pour attendre que la fonction getTeddies soit effectuée
  const teddies = await getTeddies();

  //Pour chaque élément dans teddies
  for (teddie of teddies) {
      displayTeddie(teddie);
  }

}

//On récupère les données de l'API
function getTeddies() {
    return fetch ("http://localhost:3000/api/teddies")
    .then(function(httpBodyResponse) {
        return httpBodyResponse.json();
    })
    .then(function(teddies) {
        return teddies;
    })
    .catch(function(error) {
        alert(error);
    })
}

//Non utilisation de innerHTML :
//(1) Risque de sécurité : peut devenir un vecteur d'attaque sur un site.
//(2) Moins performant.
function displayTeddie(teddie) {
    //Création du template
    const templateElt = document.getElementById("templateTeddies");

    //On clone notre élément template
    const cloneElt = document.importNode(templateElt.content, true);

    //Utilisation de textContent pour modifier les informations du clone
    //(1) Meilleures performances car le texte n'est pas analysé en HTML.
    //(2) Peut empêcher les attaques XSS.
    cloneElt.getElementById("teddie-name").textContent = teddie.name;
    cloneElt.getElementById("teddie-description").textContent = teddie.description;

    //Modification du prix (séparation euros / centimes)
    const priceString = teddie.price.toString();
    const priceSlice = priceString.slice(0, -2) + "." + priceString.slice(-2);
    cloneElt.getElementById("teddie-price").textContent = priceSlice + " €";

    //Modification de la source des images avec l'imageUrl de l'API
    cloneElt.getElementById("teddie-img").src = teddie.imageUrl;

    //Ajout de l'id du produit dans l'URL des liens des produits
    cloneElt.getElementById("teddie-link").href += "?id=" + teddie._id;

    //Création d'un enfant du clone
    document.getElementById("teddies-collection").appendChild(cloneElt);
}