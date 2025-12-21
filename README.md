<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>README - CI/CD Mini Project</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292e;
            max-width: 900px;
            margin: 40px auto;
            padding: 0 20px;
        }
        h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        code {
            background-color: rgba(27, 31, 35, 0.05);
            border-radius: 3px;
            padding: 0.2em 0.4em;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 85%;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
        }
        pre code { background-color: transparent; padding: 0; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        table, th, td { border: 1px solid #dfe2e5; }
        th, td { padding: 8px 13px; text-align: left; }
        th { background-color: #f6f8fa; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 10px; color: white; font-size: 12px; font-weight: bold; text-decoration: none; }
        .badge-blue { background-color: #007bff; }
        .badge-orange { background-color: #ff8c00; }
    </style>
</head>
<body>

    <h1>🚀 CI/CD Mini Project – Spring Boot | Angular | AWS</h1>

    <p>
        <a href="#" class="badge badge-blue">GitHub Actions: Pipeline</a>
        <a href="#" class="badge badge-orange">AWS: Infrastructure</a>
    </p>

    <p>Ce projet implémente un pipeline de déploiement continu (CI/CD) complet pour une application Full-Stack sur Amazon Web Services (AWS).</p>

    

    <h2>🏗️ Architecture du Projet</h2>
    <ul>
        <li><strong>Backend</strong> : Spring Boot (Java 17) sur le port <code>8080</code>.</li>
        <li><strong>Frontend</strong> : Angular 17+ servi par <strong>Nginx</strong>.</li>
        <li><strong>Base de données</strong> : MariaDB/MySQL sur une instance EC2 privée.</li>
        <li><strong>Infrastructure</strong> : Automatisée via <strong>AWS CloudFormation</strong>.</li>
        <li><strong>Automation</strong> : Pipeline <strong>GitHub Actions</strong>.</li>
    </ul>

    <h2>🛠️ Installation et Configuration Locale</h2>
    <h3>1. Clonage</h3>
    <pre><code>git clone https://github.com/&lt;TON_USERNAME&gt;/mini-ci-cd-project.git
cd mini-ci-cd-project</code></pre>

    <h3>2. Gestion des Clés SSH (AWS)</h3>
    <pre><code>aws ec2 create-key-pair --key-name key-pair --region us-east-1 --query 'KeyMaterial' --output text > key-pair.pem
chmod 400 key-pair.pem</code></pre>

    <h2>📡 Déploiement de l'Infrastructure</h2>
    <pre><code>MY_IP=$(curl -s https://ifconfig.me)/32
aws cloudformation deploy \
  --template-file CloudFormation/template.yml \
  --stack-name mini-ci-cd-stack \
  --parameter-overrides MyIP=$MY_IP \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1</code></pre>

    <h2>💻 Développement</h2>
    <h3>☕ Backend (Spring Boot)</h3>
    <p>Configurez <code>src/main/resources/application.properties</code> :</p>
    <pre><code>spring.datasource.url=jdbc:mysql://&lt;HOST_DB&gt;:3306/app_db
spring.datasource.username=app_user
spring.datasource.password=123456</code></pre>

    <h3>🅰️ Frontend (Angular)</h3>
    <p>Mise à jour de <code>src/environments/environment.prod.ts</code> :</p>
    <pre><code>export const environment = {
  production: true,
  apiUrl: 'http://&lt;IP_FRONTEND_PUBLIC&gt;/api'
};</code></pre>

    <h2>🤖 Pipeline CI/CD (GitHub Actions)</h2>
    <table>
        <thead>
            <tr>
                <th>Étape</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Build-Test</strong></td>
                <td>Compile le JAR Java et le Dist Angular.</td>
            </tr>
            <tr>
                <td><strong>Deploy-Infra</strong></td>
                <td>Met à jour les ressources AWS via CloudFormation.</td>
            </tr>
            <tr>
                <td><strong>Deploy-App</strong></td>
                <td>Copie le code sur EC2 (SCP) et redémarre les services.</td>
            </tr>
        </tbody>
    </table>

    <h2>🌐 Configuration Serveur (Nginx)</h2>
    <pre><code>server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://&lt;IP_PRIVEE_BACKEND&gt;:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}</code></pre>

    <h2>🧹 Nettoyage</h2>
    <pre><code>aws cloudformation delete-stack --stack-name mini-ci-cd-stack --region us-east-1</code></pre>

    <hr>
    <p><em>💡 Projet réalisé dans le cadre du cursus Simplon.</em></p>

</body>
</html>