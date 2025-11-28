# 🏥 ResQ — Emergency Ambulance Dispatching System  
**Frontend Application (React + TypeScript + Vite)**

---

## 📌 Contexte du Projet  
**ResQ** est une solution de dispatching intelligent d’ambulances destinée aux opérateurs de régulation médicale.  
Cette application frontend permet de :

- Visualiser la flotte d'ambulances
- Gérer les incidents d'urgence
- Assigner des ambulances selon distance et disponibilité
- Suivre la performance via un dashboard complet

---

## 🎯 1. Objectifs du Projet  
Fournir une interface claire, rapide et ergonomique pour assister les régulateurs dans la prise de décision en temps réel.

---

## 🧩 2. Périmètre Fonctionnel

### 🗺️ A. Cartographie Interactive (Cœur du système)
- Visualisation de la flotte en temps réel  
- Marqueurs incidents (couleurs selon gravité)  
- Popups d'informations  
- Filtres, zoom, centrage automatique

### 🚨 B. Gestion des Incidents
- Création d’incident (adresse, patient, gravité)  
- Assignation automatique de l’ambulance la plus proche  
- Suivi du statut : *En attente → En cours → Terminé*

### 📊 C. Dashboard & Monitoring
- KPIs (ambulances disponibles, incidents en cours, temps moyen de réponse)  
- Graphiques statistiques  
- Historique des actions

### 🚑 D. Gestion de Flotte
- Liste tabulaire des ambulances  
- Mise à jour des statuts  
- Ajout / suppression de véhicules

---

## 🛠️ 3. Stack Technique

| Technologie | Usage |
|------------|--------|
| **React + TypeScript + Vite** | SPA Frontend |
| **Redux Toolkit** | Gestion d’état global |
| **TanStack Query** | Fetching & cache |
| **React-Leaflet** | Cartographie |
| **Tailwind CSS + Shadcn/UI** | UI moderne |
| **React Hook Form** | Formulaires |
| **JSON Server** | API simulée |

---

## 🧱 4. Architecture Technique

### Principes
- **SPA**  
- Découpage basé sur *Atomic Design*  
- Flux unidirectionnel avec Redux  
- Lazy loading des pages lourdes

### Sécurité & Qualité
- Validation via **Zod**  
- Environnements via `.env`  
- Performances optimisées

---

## 👤 5. User Stories

### Régulateur
- Voir les positions des ambulances  
- Créer un incident  
- Assigner l’ambulance la plus proche  
- Filtrer par statut  
- Modifier un statut manuellement  
- Voir l'historique des incidents  
- Notification en cas d’incident critique

### Chef de Parc
- Voir l’état complet de la flotte  
- Ajouter / retirer un véhicule  

---

## 📂 6. Architecture des Pages

### 🏠 Dashboard (`/`)
- KPIGrid  
- PerformanceChart  
- ActivityFeed  

### 🗺️ Dispatch Map (`/map`)
- MapContainer  
- AmbulanceMarker  
- IncidentMarker  
- DispatchPanel  
- AmbulanceFilter  

### 🚑 Gestion Flotte (`/fleet`)
- AmbulanceTable  
- StatusBadge  
- AddAmbulanceDialog  

### 📜 Historique (`/incidents`)
- IncidentList  
- IncidentDetails  

---

## 🗃️ 7. Simulation API — JSON Server

### Installation  
```bash
npm install -g json-server
json-server --watch db.json --port 5000
