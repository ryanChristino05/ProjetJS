@echo off
echo 📌 Création de la base de données...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS librairie CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

echo 📌 Importation de la structure et des données...
mysql -u root librairie < setup_librairie.sql

echo 📌 Installation terminée avec succès ! 🚀
pause
