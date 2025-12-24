<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
</head>
<body>

    <div align="center">
        <h1>🚀 Mini CI/CD Project – Angular, Spring Boot & AWS</h1>
        <p><strong>Projet complet de CI/CD automatisé sur AWS</strong></p>
    </div>

    <hr>

    <p>Ce projet démontre la mise en place d'une infrastructure cloud et d'un pipeline de déploiement continu pour une application Fullstack :</p>
    <ul>
        <li><strong>Frontend :</strong> Angular 17 déployé sur Nginx (EC2 publique).</li>
        <li><strong>Backend :</strong> Spring Boot 3 déployé sur EC2.</li>
        <li><strong>Base de données :</strong> Provisionnée via CloudFormation.</li>
        <li><strong>CI/CD :</strong> Pipelines GitHub Actions pour le build, les tests et le déploiement d'infrastructure.</li>
    </ul>

    <br>

    <h2>⚙️ Architecture</h2>
    
    <ul>
        <li><strong>Frontend :</strong> Angular 17 (<code>webapp/frontend</code>), servi par Nginx sur <code>/usr/share/nginx/html</code>.</li>
        <li><strong>Backend :</strong> Spring Boot 3 (<code>webapp/backend</code>), packagé en JAR et lancé avec <code>java -jar</code>.</li>
        <li><strong>Infra AWS :</strong>
            <ul>
                <li>VPC, subnets publics/privés, routing.</li>
                <li>EC2 frontend (Nginx + Angular).</li>
                <li>EC2 backend (Spring Boot).</li>
            </ul>
        </li>
        <li><strong>CI/CD :</strong> Workflow GitHub Actions <code>deploy.yml</code> qui automatise le déploiement SSH/SCP.</li>
    </ul>

    <hr>

    <h2>1️⃣ Cloner le projet</h2>
    <pre><code>git clone https://github.com/&lt;ton-user-GitHub&gt;/mini-ci-cd-project.git
cd mini-ci-cd-project</code></pre>

    <h2>2️⃣ Créer la KeyPair AWS</h2>
    <p>Dans AWS (région <code>us-east-1</code>) :</p>
    <pre><code>aws ec2 create-key-pair \
  --key-name key-pair \
  --region us-east-1 \
  --query 'KeyMaterial' \
  --output text > key-pair.pem

chmod 400 key-pair.pem</code></pre>
    <blockquote>⚠️ <strong>Note :</strong> Cette clé sera utilisée localement et devra être ajoutée aux secrets GitHub (<code>EC2_SSH_KEY</code>).</blockquote>

    <h2>3️⃣ Déployer l’infrastructure avec AWS CLI</h2>
    <p>Exécutez les commandes suivantes dans l'ordre :</p>
    <pre><code># Obtenir ton IP publique
MY_IP=$(curl -s https://ifconfig.me)

# 1. VPC / Réseau
aws cloudformation deploy \
  --stack-name mini-ci-cd-networking \
  --template-file CloudFormation/networking.yaml \
  --region us-east-1 \
  --capabilities CAPABILITY_NAMED_IAM

# 2. Sécurité
aws cloudformation deploy \
  --stack-name mini-ci-cd-security \
  --template-file CloudFormation/security.yaml \
  --region us-east-1 \
  --parameter-overrides MyHomeIp=${MY_IP}/32

# 3. Instances EC2
aws cloudformation deploy \
  --stack-name mini-ci-cd-ec2 \
  --template-file CloudFormation/ec2.yaml \
  --region us-east-1 \
  --parameter-overrides \
      WebAmiId=ami-0fa3fe0fa7920f68e \
      DbAmiId=ami-0fa3fe0fa7920f68e \
      InstanceType=t3.micro \
      KeyName=key-pair \
  --capabilities CAPABILITY_NAMED_IAM</code></pre>

    <hr>

    <h2>4️⃣ Configuration des secrets GitHub</h2>
    <p>Allez dans <strong>Settings > Secrets and variables > Actions</strong> et ajoutez :</p>
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
                <td>Clé IAM (CloudFormation / EC2).</td>
            </tr>
            <tr>
                <td><code>AWS_SECRET_ACCESS_KEY</code></td>
                <td>Secret associé à la clé IAM.</td>
            </tr>
            <tr>
                <td><code>EC2_SSH_KEY</code></td>
                <td>Contenu complet du fichier <code>key-pair.pem</code>.</td>
            </tr>
        </tbody>
    </table>

    <br>

    <h2>5️⃣ Workflow CI/CD (deploy.yml)</h2>
    <p>Le pipeline comprend trois étapes clés :</p>
    <ol>
        <li><strong>build-test :</strong> Compilation Maven (Backend) et npm (Frontend).</li>
        <li><strong>deploy-infra :</strong> Mise à jour des stacks AWS CloudFormation.</li>
        <li><strong>deploy-app :</strong> Transfert SSH et redémarrage des services.</li>
    </ol>

    <hr>

    <h2>7️⃣ Structure du projet</h2>
    <pre><code>mini-ci-cd-project/
├── .github/workflows/   # Pipeline CI/CD
├── CloudFormation/      # Templates d'infrastructure
├── db/                  # Scripts Base de données
├── webapp/
│   ├── backend/         # Spring Boot (Maven)
│   └── frontend/        # Angular 17
└── README.md</code></pre>

    <h2>8️⃣ Développement local</h2>
    <h4>Backend</h4>
    <pre><code>cd webapp/backend
./mvnw spring-boot:run</code></pre>
    <h4>Frontend</h4>
    <pre><code>cd webapp/frontend
npm install && npm start</code></pre>

    <hr>

    <h2>9️⃣ Nettoyer l’infrastructure</h2>
    <p>Pour éviter des frais inutiles :</p>
    <pre><code>aws cloudformation delete-stack --stack-name mini-ci-cd-ec2
aws cloudformation delete-stack --stack-name mini-ci-cd-security
aws cloudformation delete-stack --stack-name mini-ci-cd-networking</code></pre>

</body>
</html>
