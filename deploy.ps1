# Script de Deploy - Zen Personal Trainer
# Criado por Wagner Henrique Mocelin

Write-Host "🚀 Iniciando processo de deploy..." -ForegroundColor Green
Write-Host ""

# 1. Verificar se há mudanças não commitadas
Write-Host "📋 Verificando mudanças..." -ForegroundColor Yellow
git status

Write-Host ""
$commit = Read-Host "Deseja commitar as mudanças? (s/n)"

if ($commit -eq "s") {
    $message = Read-Host "Digite a mensagem do commit"
    
    Write-Host "📦 Adicionando arquivos..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Commitando..." -ForegroundColor Yellow
    git commit -m "$message"
    
    Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Deploy enviado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse seu dashboard (Render/Vercel/Railway)"
    Write-Host "2. Verifique os logs de build"
    Write-Host "3. Teste a aplicação"
    Write-Host ""
} else {
    Write-Host "❌ Deploy cancelado" -ForegroundColor Red
}

Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
