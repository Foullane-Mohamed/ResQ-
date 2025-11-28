# 🚀 Guide Complet Jenkins pour ResQ - Système de Dispatching d'Ambulances

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation de Jenkins](#installation-de-jenkins)
3. [Configuration initiale](#configuration-initiale)
4. [Configuration du projet ResQ](#configuration-du-projet-resq)
5. [Pipeline CI/CD](#pipeline-cicd)
6. [Déploiement automatisé](#déploiement-automatisé)
7. [Tests et qualité du code](#tests-et-qualité-du-code)
8. [Monitoring et notifications](#monitoring-et-notifications)
9. [Sécurité et bonnes pratiques](#sécurité-et-bonnes-pratiques)
10. [Dépannage](#dépannage)

---

## 🔧 1. Prérequis

### Système requis

- **OS**: Windows 10/11, Linux (Ubuntu 20.04+), ou macOS
- **RAM**: Minimum 4GB, recommandé 8GB+
- **Stockage**: 50GB d'espace libre minimum
- **Java**: OpenJDK 17 ou 21 (LTS versions)

### Outils nécessaires

- **Git** (dernière version)
- **Node.js** v18+ et npm
- **Docker** (optionnel mais recommandé)
- **Navigateur web** moderne

---

## ⚡ 2. Installation de Jenkins

### Option A: Installation sur Windows

```powershell
# Télécharger et installer Java 17
winget install Microsoft.OpenJDK.17

# Vérifier l'installation Java
java -version

# Télécharger Jenkins LTS
# Aller sur https://jenkins.io/download/ et télécharger jenkins.msi
# Ou utiliser Chocolatey
choco install jenkins

# Démarrer Jenkins
net start jenkins
```

### Option B: Installation sur Linux/Ubuntu

```bash
# Installer Java 17
sudo apt update
sudo apt install openjdk-17-jdk -y

# Ajouter la clé GPG Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Ajouter le repository Jenkins
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Installer Jenkins
sudo apt update
sudo apt install jenkins -y

# Démarrer et activer Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Option C: Installation avec Docker (Recommandé)

```bash
# Créer un réseau Docker pour Jenkins
docker network create jenkins

# Lancer Jenkins avec Docker
docker run -d \
  --name jenkins-resq \
  --restart=unless-stopped \
  --network jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17

# Récupérer le mot de passe initial
docker exec jenkins-resq cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 🛠️ 3. Configuration Initiale

### Première connexion

1. Accéder à `http://localhost:8080`
2. Entrer le mot de passe initial affiché dans les logs
3. Sélectionner "Install suggested plugins"
4. Créer le compte administrateur

### Plugins essentiels à installer

```
- Pipeline
- Git plugin
- GitHub plugin
- NodeJS plugin
- Docker plugin
- Blue Ocean (interface moderne)
- Email Extension
- Slack Notification
- SonarQube Scanner
- HTML Publisher
- Workspace Cleanup
- Timestamper
```

### Configuration des outils globaux

#### Node.js

1. Aller dans `Manage Jenkins > Global Tool Configuration`
2. Ajouter Node.js :
   - Name: `nodejs-18`
   - Version: `18.19.0` ou plus récent
   - Cocher "Install automatically"

#### Git

1. Vérifier que Git est configuré dans `Global Tool Configuration`
2. Ajouter les credentials Git si nécessaire

---

## 🏗️ 4. Configuration du Projet ResQ

### Étape 1: Créer un nouveau job Pipeline

1. **Nouveau Job**

   - Cliquer sur "New Item"
   - Nom: `ResQ-Frontend-Pipeline`
   - Type: "Pipeline"

2. **Configuration du Pipeline**
   - Source: "Pipeline script from SCM"
   - SCM: Git
   - Repository URL: `votre-repository-url`
   - Credentials: Ajouter vos identifiants Git
   - Branch: `*/main` ou `*/master`
   - Script Path: `Jenkinsfile`

### Étape 2: Créer le Jenkinsfile

Créer un fichier `Jenkinsfile` à la racine du projet :

```groovy
pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PROJECT_NAME = 'resq-frontend'
        DOCKER_IMAGE = 'resq-app'
        SONAR_PROJECT_KEY = 'resq-frontend'
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    triggers {
        pollSCM('H/5 * * * *') // Vérifier les changements toutes les 5 minutes
        cron('H 2 * * *') // Build nocturne à 2h
    }

    stages {
        stage('📋 Checkout') {
            steps {
                echo '🔄 Récupération du code source...'
                checkout scm
                sh 'git clean -fdx'
            }
        }

        stage('📦 Dependencies') {
            steps {
                echo '📥 Installation des dépendances...'
                sh 'npm cache clean --force'
                sh 'npm ci'
            }
            post {
                success {
                    echo '✅ Dépendances installées avec succès'
                }
                failure {
                    echo '❌ Échec de l\'installation des dépendances'
                }
            }
        }

        stage('🔍 Code Quality') {
            parallel {
                stage('ESLint') {
                    steps {
                        echo '🧹 Analyse ESLint...'
                        sh 'npm run lint -- --format=checkstyle --output-file=eslint-results.xml || true'
                        publishCheckStyleResults pattern: 'eslint-results.xml'
                    }
                }

                stage('Type Check') {
                    steps {
                        echo '🔧 Vérification TypeScript...'
                        sh 'npx tsc --noEmit'
                    }
                }
            }
        }

        stage('🧪 Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    changeRequest()
                }
            }
            steps {
                echo '🧪 Exécution des tests...'
                sh 'npm run test:ci || true'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        stage('🏗️ Build') {
            steps {
                echo '🏗️ Construction de l\'application...'
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    echo '✅ Build réussi - Artefacts archivés'
                }
            }
        }

        stage('🐳 Docker Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
                    echo "🐳 Construction de l'image Docker: ${DOCKER_IMAGE}:${imageTag}"

                    dockerImage = docker.build("${DOCKER_IMAGE}:${imageTag}", ".")
                    dockerImage.tag('latest')
                }
            }
        }

        stage('🚀 Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo '🚀 Déploiement en staging...'
                    // Arrêter l'ancien conteneur s'il existe
                    sh '''
                        docker stop resq-staging || true
                        docker rm resq-staging || true
                    '''

                    // Lancer le nouveau conteneur
                    sh """
                        docker run -d \
                            --name resq-staging \
                            -p 3001:80 \
                            --restart=unless-stopped \
                            ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('✅ Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo '🏥 Vérification de l\'état de l\'application...'
                    sleep(time: 10, unit: 'SECONDS')

                    def response = sh(
                        script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001',
                        returnStdout: true
                    ).trim()

                    if (response == '200') {
                        echo '✅ Application déployée et fonctionnelle'
                    } else {
                        error "❌ Health check failed: HTTP ${response}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Nettoyage du workspace...'
            cleanWs()
        }

        success {
            echo '🎉 Pipeline exécuté avec succès!'
            emailext (
                subject: "✅ ResQ Build Success - #${BUILD_NUMBER}",
                body: """
                    🎉 Le build ResQ #${BUILD_NUMBER} a réussi!

                    📋 Détails:
                    - Branche: ${BRANCH_NAME}
                    - Commit: ${GIT_COMMIT}
                    - Durée: ${currentBuild.durationString}

                    🔗 Voir les détails: ${BUILD_URL}
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@resq.com'}"
            )
        }

        failure {
            echo '❌ Échec du pipeline'
            emailext (
                subject: "❌ ResQ Build Failed - #${BUILD_NUMBER}",
                body: """
                    ❌ Le build ResQ #${BUILD_NUMBER} a échoué!

                    📋 Détails:
                    - Branche: ${BRANCH_NAME}
                    - Commit: ${GIT_COMMIT}
                    - Étape échouée: ${env.FAILED_STAGE}

                    🔗 Voir les logs: ${BUILD_URL}console
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@resq.com'}"
            )
        }

        unstable {
            echo '⚠️ Build instable - Vérifier les tests'
        }
    }
}
```

### Étape 3: Créer le Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Étape 4: Configuration Nginx

Créer le fichier `nginx.conf` :

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen       80;
        server_name  localhost;
        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (si nécessaire)
        location /api/ {
            proxy_pass http://backend:5000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 🚀 5. Pipeline CI/CD Avancé

### Configuration Multi-environnements

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production'],
            description: 'Environment to deploy to'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run tests before deployment'
        )
        string(
            name: 'VERSION_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag'
        )
    }

    stages {
        stage('🏷️ Determine Environment') {
            steps {
                script {
                    env.TARGET_ENV = params.ENVIRONMENT
                    env.PORT = (env.TARGET_ENV == 'production') ? '3000' : '3001'
                    env.CONTAINER_NAME = "resq-${env.TARGET_ENV}"

                    echo "🎯 Déploiement vers: ${env.TARGET_ENV}"
                    echo "🔌 Port: ${env.PORT}"
                }
            }
        }

        // ... autres stages ...

        stage('🚀 Deploy') {
            steps {
                script {
                    if (env.TARGET_ENV == 'production') {
                        // Demander confirmation pour la production
                        input message: 'Deploy to Production?',
                              ok: 'Deploy',
                              submitterParameter: 'DEPLOYER'
                    }

                    echo "🚀 Déploiement en ${env.TARGET_ENV}..."

                    // Blue-Green deployment pour la production
                    if (env.TARGET_ENV == 'production') {
                        sh """
                            # Lancer le nouveau conteneur
                            docker run -d \
                                --name ${env.CONTAINER_NAME}-new \
                                -p ${env.PORT}:80 \
                                --restart=unless-stopped \
                                ${DOCKER_IMAGE}:${params.VERSION_TAG}

                            # Attendre que l'application soit prête
                            sleep 10

                            # Vérifier la santé
                            curl -f http://localhost:${env.PORT} || exit 1

                            # Arrêter l'ancien conteneur
                            docker stop ${env.CONTAINER_NAME} || true
                            docker rm ${env.CONTAINER_NAME} || true

                            # Renommer le nouveau conteneur
                            docker rename ${env.CONTAINER_NAME}-new ${env.CONTAINER_NAME}
                        """
                    } else {
                        sh """
                            docker stop ${env.CONTAINER_NAME} || true
                            docker rm ${env.CONTAINER_NAME} || true
                            docker run -d \
                                --name ${env.CONTAINER_NAME} \
                                -p ${env.PORT}:80 \
                                --restart=unless-stopped \
                                ${DOCKER_IMAGE}:${params.VERSION_TAG}
                        """
                    }
                }
            }
        }
    }
}
```

---

## 🧪 6. Tests et Qualité du Code

### Configuration Jest pour les tests

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --ci --reporters=default --reporters=jest-junit"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "jest-junit": "^16.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.5"
  }
}
```

### Configuration SonarQube

```properties
# sonar-project.properties
sonar.projectKey=resq-frontend
sonar.projectName=ResQ Frontend
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.tsx,**/*.test.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-results.xml
```

---

## 📊 7. Monitoring et Notifications

### Configuration Slack

1. Installer le plugin "Slack Notification"
2. Configurer le webhook Slack dans Jenkins
3. Ajouter les notifications dans le Jenkinsfile :

```groovy
post {
    success {
        slackSend(
            channel: '#resq-deployments',
            color: 'good',
            message: "✅ ResQ déployé avec succès sur ${env.TARGET_ENV} - Build #${BUILD_NUMBER}"
        )
    }
    failure {
        slackSend(
            channel: '#resq-alerts',
            color: 'danger',
            message: "❌ Échec du déploiement ResQ sur ${env.TARGET_ENV} - Build #${BUILD_NUMBER}\n🔗 ${BUILD_URL}"
        )
    }
}
```

### Métriques et tableaux de bord

Créer un job de métriques :

```groovy
pipeline {
    agent any

    triggers {
        cron('H * * * *') // Toutes les heures
    }

    stages {
        stage('📊 Collect Metrics') {
            steps {
                script {
                    // Vérifier l'état de l'application
                    def stagingStatus = sh(
                        script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001',
                        returnStdout: true
                    ).trim()

                    def productionStatus = sh(
                        script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000',
                        returnStdout: true
                    ).trim()

                    // Envoyer les métriques
                    writeFile file: 'metrics.txt', text: """
                        resq_staging_status ${stagingStatus == '200' ? 1 : 0}
                        resq_production_status ${productionStatus == '200' ? 1 : 0}
                        resq_last_build_number ${BUILD_NUMBER}
                        resq_timestamp ${System.currentTimeMillis()}
                    """

                    archiveArtifacts artifacts: 'metrics.txt'
                }
            }
        }
    }
}
```

---

## 🔒 8. Sécurité et Bonnes Pratiques

### Configuration des secrets

1. **Variables d'environnement sécurisées**

   - Aller dans `Manage Jenkins > Manage Credentials`
   - Ajouter les secrets nécessaires :
     - `DOCKER_REGISTRY_CREDENTIALS`
     - `SLACK_WEBHOOK_URL`
     - `SONAR_TOKEN`

2. **Utilisation dans le pipeline**

```groovy
environment {
    DOCKER_REGISTRY = credentials('docker-registry')
    SONAR_TOKEN = credentials('sonar-token')
}

stages {
    stage('🔐 Security Scan') {
        steps {
            // Scan des vulnérabilités npm
            sh 'npm audit --audit-level high'

            // Scan des secrets
            sh 'git secrets --scan || true'
        }
    }
}
```

### Sauvegarde Jenkins

```bash
#!/bin/bash
# backup-jenkins.sh

BACKUP_DIR="/backup/jenkins"
JENKINS_HOME="/var/lib/jenkins"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le répertoire de sauvegarde
mkdir -p ${BACKUP_DIR}

# Arrêter Jenkins temporairement
sudo systemctl stop jenkins

# Créer l'archive
tar -czf ${BACKUP_DIR}/jenkins_backup_${DATE}.tar.gz \
    -C $(dirname ${JENKINS_HOME}) \
    $(basename ${JENKINS_HOME})

# Redémarrer Jenkins
sudo systemctl start jenkins

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find ${BACKUP_DIR} -name "jenkins_backup_*.tar.gz" -mtime +7 -delete

echo "Sauvegarde terminée: jenkins_backup_${DATE}.tar.gz"
```

---

## 🔧 9. Dépannage

### Problèmes courants

#### Build qui échoue avec "ENOSPC"

```bash
# Augmenter les watchers sur Linux
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### Problème de permissions Docker

```bash
# Ajouter l'utilisateur Jenkins au groupe docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### Mémoire insuffisante

```bash
# Augmenter la mémoire heap Java
# Dans /etc/default/jenkins ou variables d'environnement
JAVA_ARGS="-Xmx2048m"
```

### Logs utiles

```bash
# Logs Jenkins
sudo journalctl -u jenkins -f

# Logs application Docker
docker logs -f resq-staging

# Métriques système
htop
df -h
free -h
```

### Commandes de maintenance

```groovy
// Script Groovy pour nettoyer les anciens builds
Jenkins.instance.getAllItems(AbstractProject.class).each { project ->
    if (project.builds.size() > 10) {
        project.builds[10..-1].each { build ->
            build.delete()
        }
    }
}
```

---

## 🎯 10. Checklist de Mise en Production

### Avant le déploiement

- [ ] Tests unitaires passent (> 80% couverture)
- [ ] Tests d'intégration passent
- [ ] Scan de sécurité OK
- [ ] Performance acceptable
- [ ] Documentation à jour
- [ ] Sauvegarde effectuée

### Pendant le déploiement

- [ ] Blue-Green deployment activé
- [ ] Health checks configurés
- [ ] Monitoring en place
- [ ] Rollback plan prêt

### Après le déploiement

- [ ] Vérification fonctionnelle
- [ ] Tests de fumée OK
- [ ] Métriques normales
- [ ] Notifications envoyées
- [ ] Documentation mise à jour

---

## 📚 Ressources Supplémentaires

- [Documentation officielle Jenkins](https://jenkins.io/doc/)
- [Pipeline Syntax Reference](https://jenkins.io/doc/book/pipeline/syntax/)
- [Best Practices](https://jenkins.io/doc/book/pipeline/pipeline-best-practices/)
- [Plugin Index](https://plugins.jenkins.io/)

---

## 🆘 Support

Pour toute question ou problème :

1. Consulter les logs Jenkins
2. Vérifier la documentation
3. Contacter l'équipe DevOps
4. Créer un ticket dans le système de suivi

---

**📝 Note**: Ce guide doit être adapté selon votre infrastructure et vos besoins spécifiques. Testez toujours les configurations dans un environnement de développement avant la production.
