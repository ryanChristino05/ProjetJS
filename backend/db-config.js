const mysql = require('mysql2');

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost', // Adresse du serveur MySQL (souvent localhost)
  user: 'root',      // Nom d'utilisateur de la base de données
  password: '',      // Mot de passe de l'utilisateur (si applicable)
  database: 'librairie' // Nom de la base de données
});

// Vérifier la connexion
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion réussie à la base de données MySQL!');
});

module.exports = connection; // Exporter la connexion pour l'utiliser ailleurs
