# Script para verificar qual banco está sendo usado

Write-Host "`n🔍 Verificando conexão com o backend..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://zen-u03e.onrender.com" -Method Get
    
    Write-Host "`n✅ Backend está online!" -ForegroundColor Green
    Write-Host "Mensagem: $($response.message)" -ForegroundColor White
    Write-Host "Status: $($response.status)" -ForegroundColor White
    
    Write-Host "`n📊 Para ver qual banco está sendo usado:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://dashboard.render.com" -ForegroundColor White
    Write-Host "2. Clique no seu serviço" -ForegroundColor White
    Write-Host "3. Vá em 'Logs'" -ForegroundColor White
    Write-Host "4. Procure por: 'Database:'" -ForegroundColor White
    Write-Host "`nDeve aparecer: 📦 Database: zen-personal-trainer" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Erro ao conectar:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n" -NoNewline
