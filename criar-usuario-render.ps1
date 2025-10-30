# Script para criar usuário no Render

$body = @{
    name = "Wagner Mocelin"
    email = "wagner@zen.com"
    password = "senha123"
    role = "trainer"
} | ConvertTo-Json

Write-Host "Criando usuário no Render..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://zen-u03e.onrender.com/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`n✅ Usuário criado com sucesso!" -ForegroundColor Green
    Write-Host "`nCredenciais:" -ForegroundColor Cyan
    Write-Host "Email: wagner@zen.com" -ForegroundColor White
    Write-Host "Senha: senha123" -ForegroundColor White
    Write-Host "`nToken: $($response.token.Substring(0,50))..." -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ Erro ao criar usuário:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
