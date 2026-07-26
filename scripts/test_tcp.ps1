try {
  $tcp = New-Object System.Net.Sockets.TcpClient
  $tcp.Connect('aws-0-ap-northeast-1.pooler.supabase.com',6543)
  Write-Output 'CONNECTED'
  $tcp.Close()
} catch {
  Write-Output "ERROR: $($_.Exception.Message)"
  exit 1
}
