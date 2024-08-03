cd ..

$gitCommitId = (& "git" log --format=`"%H`" -n 1).Substring(0, 7)

Write-Host "Creating image for commit ID:" $gitCommitId

& "docker" build -t kaiyrous/fixthebank-alpha:$gitCommitId .

& "docker" tag kaiyrous/fixthebank-alpha:$gitCommitId kaiyrous/fixthebank-alpha:latest

& "docker" push --all-tags kaiyrous/fixthebank-alpha:latest

cd ./scripts
