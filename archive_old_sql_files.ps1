# Archive Old Large SQL Files
# This script moves the old large SQL files to an archive folder

Write-Host "🗂️  Archiving Old Large SQL Files" -ForegroundColor Cyan
Write-Host "=" * 60

# Create archive folder if it doesn't exist
$archiveFolder = "sql_archive_old_large_files"
if (-not (Test-Path $archiveFolder)) {
    New-Item -ItemType Directory -Path $archiveFolder | Out-Null
    Write-Host "✅ Created archive folder: $archiveFolder" -ForegroundColor Green
}

# List of files to archive (old large files without 'batch' in name)
$filesToArchive = @(
    "update_ncn_fields_part1.sql",
    "update_ncn_fields_part2.sql",
    "update_ncn_fields_part3.sql",
    "update_ncn_fields_part4.sql",
    "update_ncn_fields_part5.sql",
    "update_n2r_fields_part1.sql",
    "update_n2r_fields_part2.sql",
    "update_n2r_fields_part3.sql",
    "update_n2r_fields_part4.sql",
    "update_n2r_fields_part5.sql",
    "update_items_fields_part1.sql",
    "update_items_fields_part2.sql",
    "update_items_fields_part3.sql",
    "update_items_fields_part4.sql",
    "update_items_fields_part5.sql"
)

$movedCount = 0
$totalSize = 0

foreach ($file in $filesToArchive) {
    if (Test-Path $file) {
        $fileSize = (Get-Item $file).Length / 1MB
        $totalSize += $fileSize
        
        Move-Item -Path $file -Destination $archiveFolder -Force
        Write-Host "✅ Moved: $file ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor Green
        $movedCount++
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Files moved: $movedCount / $($filesToArchive.Count)" -ForegroundColor White
Write-Host "   Total size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
Write-Host "   Archive location: $archiveFolder" -ForegroundColor White
Write-Host ""
Write-Host "✅ Archive complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: You can safely delete the archive folder after verifying batch files work correctly." -ForegroundColor Yellow

