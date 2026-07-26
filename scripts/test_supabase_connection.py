import socket

host = 'aws-0-ap-northeast-1.pooler.supabase.com'
port = 5432

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(10)
try:
    s.connect((host, port))
    print('CONNECTED', host, port)
except Exception as e:
    print(type(e).__name__, e)
finally:
    s.close()
