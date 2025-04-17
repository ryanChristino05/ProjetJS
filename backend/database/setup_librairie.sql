CREATE DATABASE IF NOT EXISTS librairie CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE librairie;

CREATE TABLE IF NOT EXISTS livres (
  genre VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  titre VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  auteur VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  fichier_pdf VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  photo_couverture VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  resume TEXT COLLATE utf8mb4_general_ci,
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT(11) NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  nom_utilisateur VARCHAR(100) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SOURCE livres_data.sql;  