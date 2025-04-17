#!/bin/bash

# Chemin vers le binaire mysql dans XAMPP
MYSQL="/c/xampp/mysql/bin/mysql.exe"

echo "✔ Création de la base de données..."
"$MYSQL" -u root -e "CREATE DATABASE IF NOT EXISTS librairie DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;"

echo "✔ Importation des données..."
"$MYSQL" -u root librairie < ./database/sauvegarde.sql

echo "✔ Base de données restaurée avec succès !"
