param(
    [string]$CommitMessage = "auto-commit"
)

# Paramètres à adapter
$repoOwner = "yassinechahbounia"
$repoName  = "mini-ci-cd-project"
$workflowFile = "deploy.yml"           # nom du fichier de workflow
$region = "us-east-1"
$stacksToDelete = @(
    "mini-ci-cd-networking",
    "mini-ci-cd-security",
    "mini-ci-cd-ec2",
    "mini-ci-cd-monitoring"
)

function Run-GitPush {
    git add .
    git commit -m $CommitMessage
    git push origin main
}

function Wait-Workflow {
    Write-Host "Attente de la fin du workflow GitHub Actions..."
    while ($true) {
        $raw = gh api "repos/$repoOwner/$repoName/actions/workflows/$workflowFile/runs?per_page=1" 2>$null

        if (-not $raw) {
            Write-Host "Aucun run trouvé (ou erreur API), nouvelle tentative dans 15s..."
            Start-Sleep -Seconds 15
            continue
        }

        $runsJson = $raw | ConvertFrom-Json
        if (-not $runsJson.workflow_runs -or $runsJson.workflow_runs.Count -eq 0) {
            Write-Host "Aucun run trouvé, nouvelle tentative dans 15s..."
            Start-Sleep -Seconds 15
            continue
        }

        $lastRun = $runsJson.workflow_runs[0]
        $status = $lastRun.status
        $conclusion = $lastRun.conclusion

        Write-Host "Status: $status - Conclusion: $conclusion"

        if ($status -eq "completed") {
            return $conclusion
        }

        Start-Sleep -Seconds 15
    }
}


function Delete-Stacks {
    param([string[]]$names)

    foreach ($name in $names) {
        Write-Host "Suppression de la stack CloudFormation $name..."
        aws cloudformation delete-stack --stack-name $name --region $region | Out-Null
    }

    Write-Host "Attente de la suppression complète..."
    foreach ($name in $names) {
        aws cloudformation wait stack-delete-complete --stack-name $name --region $region 2>$null
    }
}

while ($true) {
    Read-Host "Appuie sur Entrée pour lancer un nouveau cycle (ou CTRL+C pour quitter)" | Out-Null

    Run-GitPush

    $result = Wait-Workflow

    if ($result -eq "success") {
        Write-Host "✅ Workflow OK. Aucun nettoyage nécessaire."
    }
    else {
        Write-Host "❌ Workflow ECHEC -> suppression des stacks puis nouvelle tentative."
        Delete-Stacks -names $stacksToDelete
    }
}
