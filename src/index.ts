
import * as http from 'http'
import Server from 'http-proxy'

let proxy = Server.createProxyServer({
    target: {
        protocol: 'https:',
        host: 'jakesiegers.com',
        port: '443'
    },
    changeOrigin: true,
    selfHandleResponse: true
})

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.removeHeader('Accept-Encoding')
})

proxy.on('proxyRes', (proxyRes, req, res) => {
    let body = new Buffer('')
    proxyRes.on('data', data => {
        body = Buffer.concat([body, data])
    })
    proxyRes.on('end', () => {
        for (let i = 0; i < proxyRes.rawHeaders.length; i += 2) {
            const header = proxyRes.rawHeaders[i]
            const value = proxyRes.rawHeaders[i + 1]

            if (header != 'Content-Length') {
                res.setHeader(header, value)
            }
        }

        if (req.url == '/') {
            let strBody = body.toString()
            strBody = strBody.replace(/([\s\>])Siegers/gi, '$1Siggers')
                             .replace('Web Application Designer & Programmer', 'Dog')
                             .replace('="sharpen">E</', '="sharpen">G</')
                             .replace(/aberoth/gi, '')

            res.end(strBody)
        } else {
            res.end(body)
        }
    })
})

http.createServer((req, res) => {
    proxy.web(req, res, { secure: false })
}).listen(8080)
