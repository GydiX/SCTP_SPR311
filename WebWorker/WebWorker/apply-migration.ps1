# Скрипт для применения миграции базы данных
Write-Host "Применение миграции базы данных..." -ForegroundColor Green

# Попробуем найти dotnet-ef
$efPath = Get-Command dotnet-ef -ErrorAction SilentlyContinue
if ($efPath) {
    Write-Host "Найден dotnet-ef: $($efPath.Source)" -ForegroundColor Yellow
    & dotnet-ef database update
} else {
    Write-Host "dotnet-ef не найден в PATH, попробуем через dotnet tool run..." -ForegroundColor Yellow
    try {
        & dotnet tool run dotnet-ef database update
    } catch {
        Write-Host "Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Попробуйте выполнить команду вручную:" -ForegroundColor Yellow
        Write-Host "dotnet ef database update" -ForegroundColor Cyan
    }
}

Write-Host "Готово!" -ForegroundColor Green
