const express = require('express');
const path = require('path');
const db = require('./db-config'); // Connexion à la base de données
const app = express();
const PORT = 3000;

// Servir le frontend (les fichiers HTML, CSS, JS du frontend)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
// Servir les fichiers PDF et images depuis le dossier "livres"
app.use('/livres', express.static(path.join(__dirname, 'livres')));

// API pour récupérer les livres
app.get('/api/livres', (req, res) => {
  const { genre, exclude } = req.query;

  if (genre) {
    // On filtre par genre et on exclut l'ID s'il est précisé
    const query = exclude
      ? 'SELECT * FROM livres WHERE genre = ? AND id != ?'
      : 'SELECT * FROM livres WHERE genre = ?';

    const params = exclude ? [genre, parseInt(exclude)] : [genre];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erreur dans la requête avec filtre:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(results);
    });
  } else {
    // Si aucun genre fourni, on retourne tout (comportement par défaut)
    db.query('SELECT * FROM livres', (err, results) => {
      if (err) {
        console.error('Erreur dans la requête sans filtre:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(results);
    });
  }
});

// Api pour un seul livre 
app.get('/api/livres/:id', (req, res) => {
  const livreId = req.params.id;
  const query = 'SELECT * FROM livres WHERE id = ?';
  
  db.query(query, [livreId], (err, result) => {
    if (err) {
      console.error('Erreur dans la requête:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (result.length > 0) {
        res.json(result[0]); // ✅ Retourne UN livre
      } else {
        res.status(404).json({ error: 'Livre non trouvé' });
      }
    }
  });
});
// API pour récupérer les genres uniques depuis la base
app.get('/api/genres', (req, res) => {
  const query = 'SELECT DISTINCT genre FROM livres ORDER BY genre ASC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des genres :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const genres = results.map(row => row.genre); // transforme en tableau simple
    res.json(genres);
  });
});

//API pour une nouvelle inscription :
app.post('/api/inscription', (req, res) => {
  const { email, nom, password } = req.body;

  if (!email || !nom || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const query = 'INSERT INTO utilisateurs (email, nom_utilisateur, mot_de_passe) VALUES (?, ?, ?)';
  db.query(query, [email, nom, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Ce nom d’utilisateur est déjà pris.' });
      }

      console.error('Erreur lors de l’inscription :', err);
      return res.status(500).json({ message: 'Erreur lors de l’inscription.' });
    }

    res.status(200).json({ message: 'Inscription réussie !' });
  });
});


// API pour se connecter : 
app.post('/api/connexion', (req, res) => {
  const { nom, password } = req.body;

  if (!nom || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const query = 'SELECT * FROM utilisateurs WHERE nom_utilisateur = ?';
  db.query(query, [nom], (err, results) => {
    if (err) {
      console.error('Erreur lors de la connexion :', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Nom d’utilisateur incorrect.' });
    }

    const utilisateur = results[0];

    if (utilisateur.mot_de_passe !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    res.status(200).json({ message: 'Connexion réussie !',nom: utilisateur.nom_utilisateur,
      email: utilisateur.email });
  });
});
// ✅ API pour ajouter un nouveau livre
app.post('/api/ajouter-livre', (req, res) => {
  const { titre, auteur, genre, photo_couverture, fichier_pdf, resume } = req.body;

  if (!titre || !auteur || !genre || !photo_couverture || !fichier_pdf) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const query = `
    INSERT INTO livres (titre, auteur, genre, photo_couverture, fichier_pdf, resume)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [titre, auteur, genre, photo_couverture, fichier_pdf, resume], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l’ajout du livre :', err);
      return res.status(500).json({ message: 'Erreur lors de l’ajout du livre.' });
    }

    res.status(201).json({ message: '✅ Livre ajouté avec succès !' });
  });
});

// ✅ API pour modifier un livre existant
app.put('/api/modifier-livres/:id', (req, res) => {
  const livreId = req.params.id;
  const { titre, auteur, genre, photo_couverture, fichier_pdf, resume } = req.body;

  if (!titre || !auteur || !genre || !photo_couverture || !fichier_pdf) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  const query = `
    UPDATE livres
    SET titre = ?, auteur = ?, genre = ?, photo_couverture = ?, fichier_pdf = ?, resume = ?
    WHERE id = ?
  `;

  db.query(query, [titre, auteur, genre, photo_couverture, fichier_pdf, resume, livreId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la modification du livre :', err);
      return res.status(500).json({ message: 'Erreur lors de la modification.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    res.status(200).json({ message: '✅ Livre modifié avec succès !' });
  });
});
// ✅ API pour supprimer un livre
app.delete('/api/supprimer-livre/:id', (req, res) => {
  const livreId = req.params.id;

  const query = 'DELETE FROM livres WHERE id = ?';

  db.query(query, [livreId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du livre :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    res.status(200).json({ message: '✅ Livre supprimé avec succès !' });
  });
});
// API pour récupérer un seul livre
app.get('/api/livre/:id', (req, res) => {
  const livreId = req.params.id;

  const query = 'SELECT * FROM livres WHERE id = ?';

  db.query(query, [livreId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du livre:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.json(result[0]); // Renvoie le livre trouvé
  });
});


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
