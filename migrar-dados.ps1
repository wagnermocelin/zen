# Script PowerShell para migrar dados

Write-Host "`n🔄 MIGRAÇÃO DE DADOS: test → zen-personal-trainer`n" -ForegroundColor Cyan

Write-Host "Este script irá:" -ForegroundColor Yellow
Write-Host "1. Conectar ao banco 'test'" -ForegroundColor White
Write-Host "2. Conectar ao banco 'zen-personal-trainer'" -ForegroundColor White
Write-Host "3. Copiar todos os dados" -ForegroundColor White
Write-Host "4. Verificar se migrou corretamente`n" -ForegroundColor White

$resposta = Read-Host "Deseja continuar? (S/N)"

if ($resposta -ne "S" -and $resposta -ne "s") {
    Write-Host "`n❌ Migração cancelada." -ForegroundColor Red
    exit
}

Write-Host "`n🚀 Iniciando migração...`n" -ForegroundColor Green

# Ir para pasta backend
Set-Location backend

# Executar script de migração
node scripts/migrar-dados.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Migração concluída com sucesso!`n" -ForegroundColor Green
    
    $verificar = Read-Host "Deseja verificar a migração? (S/N)"
    
    if ($verificar -eq "S" -or $verificar -eq "s") {
        Write-Host "`n🔍 Verificando migração...`n" -ForegroundColor Cyan
        node scripts/verificar-migracao.js
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Verificação OK! Todos os dados foram migrados.`n" -ForegroundColor Green
            Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
            Write-Host "1. Acesse MongoDB Atlas e confirme os dados" -ForegroundColor White
            Write-Host "2. Atualize a string de conexão no Render" -ForegroundColor White
            Write-Host "3. Aguarde o redeploy (5-10 minutos)" -ForegroundColor White
            Write-Host "4. Teste o sistema`n" -ForegroundColor White
        } else {
            Write-Host "`n⚠️  Há diferenças entre os bancos!" -ForegroundColor Yellow
            Write-Host "Execute o script novamente.`n" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "`n❌ Erro na migração!" -ForegroundColor Red
    Write-Host "Verifique os erros acima e tente novamente.`n" -ForegroundColor Red
}

# Voltar para pasta raiz
Set-Location ..
