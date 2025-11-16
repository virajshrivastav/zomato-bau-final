# Execute SQL batches using Supabase CLI
# This script executes all SQL batch files in the correct order

Write-Host "Executing SQL Batches for Full Import (6,610 Restaurants)" -ForegroundColor Cyan
Write-Host "======================================================================"

# Check if Supabase is linked
Write-Host "`nChecking Supabase connection..." -ForegroundColor Yellow
supabase projects list | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Supabase not connected. Please run 'supabase link' first." -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Supabase connected" -ForegroundColor Green

# Get current count
Write-Host "`nChecking current database state..." -ForegroundColor Yellow
supabase db execute --file check_db_state.sql --linked

# Confirm execution
Write-Host "`nWARNING: This will execute 42 SQL batch files and import 6,610 restaurants." -ForegroundColor Yellow
$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Execution cancelled" -ForegroundColor Red
    exit 0
}

Write-Host "`nStarting batch execution..." -ForegroundColor Cyan

# Track progress
$totalBatches = 42
$currentBatch = 0
$startTime = Get-Date

# Execute base restaurant batches (14 batches)
Write-Host "`nPHASE 1: Inserting Base Restaurants (14 batches)" -ForegroundColor Cyan
for ($i = 1; $i -le 14; $i++) {
    $currentBatch++
    $batchFile = "sql_batches/insert_base_restaurants_batch_$($i.ToString('00')).sql"
    Write-Host "[$currentBatch/$totalBatches] Executing $batchFile..." -ForegroundColor Yellow

    supabase db execute --file $batchFile --linked

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR executing $batchFile" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: Completed $batchFile" -ForegroundColor Green
}

# Execute NCN update batches (12 batches)
Write-Host "`nPHASE 2: Updating NCN Data (12 batches)" -ForegroundColor Cyan
for ($i = 1; $i -le 12; $i++) {
    $currentBatch++
    $batchFile = "sql_batches/update_ncn_fields_batch_$($i.ToString('00')).sql"
    Write-Host "[$currentBatch/$totalBatches] Executing $batchFile..." -ForegroundColor Yellow

    supabase db execute --file $batchFile --linked

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR executing $batchFile" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: Completed $batchFile" -ForegroundColor Green
}

# Execute N2R update batches (12 batches)
Write-Host "`nPHASE 3: Updating N2R Data (12 batches)" -ForegroundColor Cyan
for ($i = 1; $i -le 12; $i++) {
    $currentBatch++
    $batchFile = "sql_batches/update_n2r_fields_batch_$($i.ToString('00')).sql"
    Write-Host "[$currentBatch/$totalBatches] Executing $batchFile..." -ForegroundColor Yellow

    supabase db execute --file $batchFile --linked

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR executing $batchFile" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: Completed $batchFile" -ForegroundColor Green
}

# Execute Items update batches (4 batches)
Write-Host "`nPHASE 4: Updating Items Data (4 batches)" -ForegroundColor Cyan
for ($i = 1; $i -le 4; $i++) {
    $currentBatch++
    $batchFile = "sql_batches/update_items_fields_batch_$($i.ToString('00')).sql"
    Write-Host "[$currentBatch/$totalBatches] Executing $batchFile..." -ForegroundColor Yellow

    supabase db execute --file $batchFile --linked

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR executing $batchFile" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: Completed $batchFile" -ForegroundColor Green
}

# Calculate duration
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "ALL BATCHES EXECUTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Total Duration: $($duration.ToString('mm\:ss'))" -ForegroundColor Cyan
Write-Host "Total Batches: $totalBatches" -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Run verification: supabase db execute --file verify_import.sql --linked" -ForegroundColor White
Write-Host "2. Check data in Supabase dashboard" -ForegroundColor White
Write-Host "3. Test frontend: npm run dev" -ForegroundColor White

