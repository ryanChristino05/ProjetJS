let allBooks = [];

fetch('/api/livres')
  .then(response => response.json())
  .then(data => {
    allBooks = data;
    afficherLivres(allBooks);
    afficherSuggestions(); // ✅ Générer des suggestions
  })
  .catch(error => console.error('Erreur:', error));

// 🔥 Affichage des livres en mode grille
function afficherLivres(livres) {
  const container = document.getElementById('bookContainer');
  container.innerHTML = '';

  livres.forEach(livre => {
    const bookCard = document.createElement('a');
    bookCard.classList.add('book-card');
    bookCard.href = `detail.html?id=${livre.id}`; // ✅ Redirection vers détails

    const img = document.createElement('img');
    img.classList.add('imagebook');
    img.src = livre.photo_couverture;

    const info = document.createElement('div');
    info.classList.add('titre-book');

    const titre = document.createElement('h5');
    titre.textContent = livre.titre;

    const auteur = document.createElement('p');
    auteur.textContent = livre.auteur;

    info.appendChild(titre);
    info.appendChild(auteur);
    bookCard.appendChild(img);
    bookCard.appendChild(info);
    container.appendChild(bookCard);
  });
}

// 🔎 Filtrer par catégorie
function filtrerParCategorie(categorieSelectionnee) {
  if (categorieSelectionnee === 'all') {
    afficherLivres(allBooks);
  } else {
    const livresFiltres = allBooks.filter(livre => 
      livre.genre && livre.genre.trim().toLowerCase() === categorieSelectionnee.trim().toLowerCase()
    );
    afficherLivres(livresFiltres);
  }
}

// 🔍 Recherche dynamique
function rechercherCategorie() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();

  const livresFiltres = allBooks.filter(livre =>
    livre.genre.toLowerCase().includes(searchTerm) ||
    livre.titre.toLowerCase().includes(searchTerm) ||
    livre.auteur.toLowerCase().includes(searchTerm)
  );

  afficherLivres(livresFiltres);
}


// 📖 Affichage des détails du livre
function afficherDetailsLivre(livre) {
  window.location.href = `detail.html?id=${livre.id}`;
}

// 🚀 Suggestions intelligentes de livres
function afficherSuggestions() {
  const container = document.getElementById('suggestionContainer');
  container.innerHTML = '';

  const livresAleatoires = allBooks.sort(() => 0.5 - Math.random()).slice(0, 10);

  livresAleatoires.forEach(livre => {
    const suggestionCard = document.createElement('div');
    suggestionCard.classList.add('book-card');

    const img = document.createElement('img');
    img.src = livre.photo_couverture;
    img.alt = livre.titre;

    const title = document.createElement('h4');
    title.textContent = livre.titre;

    suggestionCard.appendChild(img);
    suggestionCard.appendChild(title);
    suggestionCard.onclick = () => afficherDetailsLivre(livre);

    container.appendChild(suggestionCard);
  });

  // auto-scroll fluide
  setInterval(() => {
    container.scrollBy({ left: 220, behavior: 'smooth' });

    // si arrivé à la fin, revenir au début
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 3000); // toutes les 3 secondes
}


// ⬇️ Télécharger un livre
function telechargerLivre(fichierPdf) {
  const link = document.createElement('a');
  link.href = `/${fichierPdf}`;
  link.download = fichierPdf.split('/').pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
