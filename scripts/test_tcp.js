const net = require('net')
const tls = require('tls')

function testTCP(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let done = false
    socket.setTimeout(timeout)
    socket.on('connect', () => {
      if (done) return
      done = true
      console.log(`${host}:${port} TCP OPEN`)
      socket.end()
      resolve({host, port, proto: 'tcp', status: 'open'})
    })
    socket.on('timeout', () => {
      if (done) return
      done = true
      console.error(`${host}:${port} TCP TIMEOUT`)
      socket.destroy()
      resolve({host, port, proto: 'tcp', status: 'timeout'})
    })
    socket.on('error', (err) => {
      if (done) return
      done = true
      console.error(`${host}:${port} TCP ERROR: ${err.message}`)
      resolve({host, port, proto: 'tcp', status: 'error', message: err.message})
    })
    socket.connect(port, host)
  })
}

function testTLS(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = tls.connect({host, port, servername: host, rejectUnauthorized: false})
    let done = false
    socket.setTimeout(timeout)
    socket.on('secureConnect', () => {
      if (done) return
      done = true
      console.log(`${host}:${port} TLS OPEN`)
      socket.end()
      resolve({host, port, proto: 'tls', status: 'open'})
    })
    socket.on('timeout', () => {
      if (done) return
      done = true
      console.error(`${host}:${port} TLS TIMEOUT`)
      socket.destroy()
      resolve({host, port, proto: 'tls', status: 'timeout'})
    })
    socket.on('error', (err) => {
      if (done) return
      done = true
      console.error(`${host}:${port} TLS ERROR: ${err.message}`)
      resolve({host, port, proto: 'tls', status: 'error', message: err.message})
    })
  })
}

async function run() {
  const host = 'aws-0-ap-northeast-1.pooler.supabase.com'
  const results = []
  results.push(await testTCP(host, 6543))
  results.push(await testTLS(host, 6543))
  results.push(await testTCP(host, 5432))
  console.log('\nSUMMARY:')
  console.table(results)
}

run().catch((e) => { console.error('FAILED', e) ; process.exit(1) })
