try {
  $h = 'aws-0-ap-northeast-1.pooler.supabase.com'
  $p = 5432
  $tcp = New-Object System.Net.Sockets.TcpClient
  $async = $tcp.BeginConnect($h, $p, $null, $null)
  if ($async.AsyncWaitHandle.WaitOne(5000)) {
    $tcp.EndConnect($async)
    Write-Output 'OPEN'
  } else {
    Write-Output 'TIMEOUT or BLOCKED'
  }
} catch {
  Write-Output "ERROR: $($_.Exception.Message)"
  exit 1
}
