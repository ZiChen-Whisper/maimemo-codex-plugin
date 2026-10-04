param([switch]$Remove)
$ErrorActionPreference = 'Stop'
$tokenDirectory = Join-Path $env:USERPROFILE '.config\maimemo-codex-plugin'
$tokenPath = Join-Path $tokenDirectory 'token'
if ($Remove) {
    if (Test-Path -LiteralPath $tokenPath) { Remove-Item -LiteralPath $tokenPath }
    Write-Host '已移除本地 token 文件。环境变量如有配置，需单独清除。'
    exit
}
New-Item -ItemType Directory -Path $tokenDirectory -Force | Out-Null
if ($IsWindows -or $env:OS -eq 'Windows_NT') {
    $currentSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
    & icacls $tokenDirectory /inheritance:r /grant:r "*${currentSid}:(OI)(CI)F" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw '无法限制凭证目录权限，已停止。' }
}
$secureToken = Read-Host '输入墨墨开放 API token（不会显示）' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
try {
    $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr).Trim()
    if (-not $plainToken -or $plainToken -match '[\r\n]') { throw 'token 为空或包含换行。' }
    [IO.File]::WriteAllText($tokenPath, $plainToken, [Text.UTF8Encoding]::new($false))
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    $plainToken = $null
}
Write-Host '已保存到当前用户的本地凭证目录。重新打开 Codex chat 后使用。'
