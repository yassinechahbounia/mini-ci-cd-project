# mini-ci-cd-project
flowchart LR
    Internet[[Internet]]
    subgraph VPC_10_0_0_0_16["VPC 10.0.0.0/16"]
        IGW["Internet Gateway"]
        subgraph PublicSubnet["Public Subnet 10.0.1.0/24"]
            WebEC2["EC2 WebApp\nAngular + Spring Boot\nEIP 52.71.4.237"]
        end
        subgraph PrivateSubnet["Private Subnet 10.0.2.0/24"]
            DBEC2["EC2 DB\nMySQL"]
        end
    end

    Internet --> IGW
    IGW --> WebEC2
    WebEC2 --> DBEC2

## Architecture

Le projet déploie une architecture web + base de données dans une VPC dédiée avec subnet public et privé.

## Ressources réseau

| Ressource          | Rôle principal                                              |
|--------------------|------------------------------------------------------------|
| VPC 10.0.0.0/16    | Réseau isolé qui contient tous les subnets du projet      |
| Public subnet      | 10.0.1.0/24, héberge l’EC2 WebApp accessible depuis Internet |
| Private subnet     | 10.0.2.0/24, héberge l’EC2 DB non accessible directement depuis Internet |
| Internet Gateway   | Permet au subnet public de communiquer avec Internet      |
| Public route table | Route 0.0.0.0/0 vers l’Internet Gateway pour le subnet public |
| Private route table| Route uniquement locale dans la VPC pour le subnet privé  |





