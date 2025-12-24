<h1>🚀 Mini CI/CD Project – AWS Full Stack (Angular + Spring Boot + MySQL)</h1>
<p>
<a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS-CloudFormation-orange" alt="AWS"></a>
<a href="https://github.com/features/actions"><img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue" alt="CI/CD"></a>
<a href="https://angular.io/"><img src="https://img.shields.io/badge/Frontend-Angular-DD0031" alt="Frontend"></a>
<a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F" alt="Backend"></a>
<a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/Database-MySQL-4479A1" alt="Database"></a></p>
<p><strong>Projet Full Stack avec automatisation complète du cycle de vie logiciel</strong></p>

<hr>

<h2>📋 Description du projet</h2>
<p>Ce projet déploie une application <strong>Full Stack</strong> sur AWS via une chaîne <strong>CI/CD</strong> automatisée. L'objectif est de démontrer une approche DevOps réaliste combinant <strong>Infrastructure as Code (IaC)</strong> et livraison continue (CD) sur une architecture réseau segmentée (public/privé).</p>

<hr>

<h2>🏗️ Architecture AWS</h2>
<h3>Schéma Logique</h3>
<pre><code>
                Internet
                   |
                   v
          [Internet Gateway]
                   |
            [Public Subnet]
                   |
           [EC2 Frontend - Nginx]
             - Angular build
             - Elastic IP: 52.71.4.237
                   |
             /api (proxy)
                   v
            [EC2 Backend - Spring]
              - java -jar (8080)
                   |
                   v
             [MySQL Database]
    </code></pre>
<blockquote>💡 <strong>Remarque :</strong> Dans la configuration actuelle, si le backend est sur la même instance que le frontend, Nginx sert de reverse proxy. Si le backend est sur une instance privée, le job <code>deploy-app</code> doit être adapté pour cibler l'IP privée.</blockquote>

    <hr>

<h2>🧱 Infrastructure as Code (CloudFormation)</h2>
<p>L'infrastructure est découpée en <strong>3 stacks</strong> déployées séquentiellement :</p>
    <ul>
        <li><code>mini-ci-cd-networking</code> : Réseau (VPC, subnets, routing).</li>
        <li><code>mini-ci-cd-security</code> : Security Groups et règles (SSH, HTTP, 8080, DB).</li>
        <li><code>mini-ci-cd-ec2</code> : Instances EC2 et association de l'Elastic IP.</li>
    </ul>

<h3>✅ Déploiement manuel (AWS CLI)</h3>
    <pre><code># Obtenir ton IP publique pour restreindre le SSH
MY_IP=$(curl -s https://ifconfig.me)

# 1. Réseau
aws cloudformation deploy --stack-name mini-ci-cd-networking --template-file CloudFormation/networking.yaml --region us-east-1 --capabilities CAPABILITY_NAMED_IAM

# 2. Sécurité
aws cloudformation deploy --stack-name mini-ci-cd-security --template-file CloudFormation/security.yaml --region us-east-1 --parameter-overrides MyHomeIp=${MY_IP}/32

# 3. Compute (Instances)
aws cloudformation deploy --stack-name mini-ci-cd-ec2 --template-file CloudFormation/ec2.yaml --region us-east-1 --capabilities CAPABILITY_IAM --parameter-overrides WebAmiId=ami-0fa3fe0fa7920f68e DbAmiId=ami-0fa3fe0fa7920f68e InstanceType=t3.micro KeyName=key-pair</code></pre>

<hr>

<h2>🔄 CI/CD (GitHub Actions)</h2>
<p>Fichier de workflow : <code>.github/workflows/deploy.yml</code></p>
    
<h3>Les Jobs du Pipeline :</h3>
    <ol>
        <li><strong>Job <code>build-test</code></strong> : 
            <ul>
                <li>Backend : Build Maven + Upload du JAR.</li>
                <li>Frontend : <code>npm ci</code> + <code>npm run build</code> + Upload du dossier <code>dist</code>.</li>
            </ul>
        </li>
        <li><strong>Job <code>deploy-infra</code></strong> : Déploiement automatisé des 3 stacks CloudFormation.</li>
        <li><strong>Job <code>deploy-app</code></strong> :
            <ul>
                <li>Transfert du JAR via SCP et démarrage du service Java (<code>nohup</code>).</li>
                <li>Copie des fichiers Angular vers <code>/usr/share/nginx/html</code> et restart de Nginx.</li>
            </ul>
        </li>
    </ol>

<hr>

<h2>🔐 Secrets GitHub Actions (Obligatoires)</h2>
    <table border="1">
        <thead>
            <tr>
                <th>Secret</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>AWS_ACCESS_KEY_ID</code></td>
                <td>Clé d'accès IAM AWS.</td>
            </tr>
            <tr>
                <td><code>AWS_SECRET_ACCESS_KEY</code></td>
                <td>Clé secrète IAM AWS.</td>
            </tr>
            <tr>
                <td><code>EC2_SSH_KEY</code></td>
                <td>Contenu privé de votre fichier <code>key-pair.pem</code>.</td>
            </tr>
        </tbody>
    </table>

<hr>

<h2>📁 Structure du projet</h2>
    <pre><code>mini-ci-cd-project/
├── .github/workflows/   # Pipeline CI/CD (deploy.yml)
├── CloudFormation/      # IaC (networking, security, ec2)
├── webapp/
│   ├── backend/         # Spring Boot 3
│   └── frontend/        # Angular 17
└── README.md</code></pre>

<hr>

<h2>🐛 Dépannage & Maintenance</h2>
    <ul>
        <li><strong>Vérifier le Backend :</strong> <code>ps aux | grep app.jar</code></li>
        <li><strong>Logs Nginx :</strong> <code>tail -n 100 /var/log/nginx/error.log</code></li>
    </ul>

<h3>🧹 Nettoyage des ressources</h3>
<pre><code>aws cloudformation delete-stack --stack-name mini-ci-cd-ec2
aws cloudformation delete-stack --stack-name mini-ci-cd-security
aws cloudformation delete-stack --stack-name mini-ci-cd-networking</code></pre>

<hr>

<div align="center">
    <h2>👨‍💻 Auteur</h2>
    <p><strong>Yassine Chahbounia</strong><br>
    Email : <a href="mailto:ychahbounia@gmail.com">ychahbounia@gmail.com</a></p>
<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 52c5f4f (Version Final)
