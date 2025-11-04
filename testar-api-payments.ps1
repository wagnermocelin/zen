# Script para testar API de pagamentos

Write-Host "`n🧪 Testando API de Pagamentos...`n" -ForegroundColor Cyan

# Teste 1: Backend está online?
Write-Host "1️⃣ Testando se backend está online..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://zen-u03e.onrender.com" -Method Get
    Write-Host "   ✅ Backend online: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend offline!" -ForegroundColor Red
    exit
}

# Teste 2: Endpoint de pagamentos existe?
Write-Host "`n2️⃣ Testando endpoint /api/payments..." -ForegroundColor Yellow
try {
    $payments = Invoke-RestMethod -Uri "https://zen-u03e.onrender.com/api/payments" -Method Get
    Write-Host "   ✅ Endpoint funcionando!" -ForegroundColor Green
    Write-Host "   📊 Total de pagamentos: $($payments.data.Count)" -ForegroundColor Cyan
    
    if ($payments.data.Count -gt 0) {
        Write-Host "`n   📋 Primeiros 3 pagamentos:" -ForegroundColor Cyan
        $payments.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "      - ID: $($_._id)" -ForegroundColor White
            Write-Host "        Valor: R$ $($_.amount)" -ForegroundColor White
            Write-Host "        Status: $($_.status)" -ForegroundColor White
            Write-Host "        Vencimento: $($_.dueDate)" -ForegroundColor White
            Write-Host "        Month: $($_.month)" -ForegroundColor White
            Write-Host "        Year: $($_.year)" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Host "   ⚠️  Nenhum pagamento encontrado!" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ❌ Erro ao buscar pagamentos!" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Teste concluído!`n" -ForegroundColor Green
