const btn = document.querySelector(".auth-buttons"); // pour mettre à jour le header
document.addEventListener("DOMContentLoaded", () => {
    const form1 = document.querySelector(".connexion");
    const emailInput = document.querySelector(".nom");
    const passwordInput = document.querySelector(".password");
  
    form1.addEventListener("submit", async (e) => {
      e.preventDefault(); // Empêche le rechargement de la page
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      // Vérifie que tous les champs sont remplis
      if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
      }
  
      try {
        // Envoie la requête au serveur
        const response = await fetch("/api/connexion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nom: email, // ici tu utilises l’email comme nom d'utilisateur
            password: password
          })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert(result.message); // Connexion réussie
          // Redirige vers la page d’accueil (ou dashboard, selon ton app)

      
            alert("Inscription réussie !");
            sessionStorage.setItem("username",result.nom);
            sessionStorage.setItem("email", result.email);
    
            if (btn) {
              btn.innerHTML = `
                <a href='profil.html' class='btn-login'>Profil</a>
                <a href='accueil.html' class='btn-signup' onclick="sessionStorage.clear()">Se déconnecter</a>
              `;
            }
          window.location.href = "index.html";
        } else {
          alert(result.message); // Message d’erreur serveur
        }
      } catch (err) {
        console.error("Erreur lors de la requête :", err);
        alert("Une erreur est survenue lors de la connexion.");
      }
    });
  });
  // Inscription dans le compte
  document.addEventListener("DOMContentLoaded", () => {
    const form2 = document.querySelector(".inscription");
    const emailInput = document.querySelector(".email");
    const nomInput = document.querySelector(".nom");
    const passwordInput = document.querySelector(".password");
  
    form2.addEventListener("submit", async (e) => {
      e.preventDefault(); // Empêche le rechargement de la page
  
      const email = emailInput.value.trim();
      const nom = nomInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (!email || !nom || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
      }
  
      try {
        const response = await fetch("/api/inscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, nom, password })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert(result.message);
          window.location.href = "connexion.html"; // Redirection vers la connexion
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Erreur pendant l’inscription :", error);
        alert("Une erreur est survenue.");
      }
    });
  });
  