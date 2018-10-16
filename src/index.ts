
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
        let strBody = body.toString()
        const ind = strBody.search(/aberoth/gi)
        if (ind != -1) {
            console.log('aberoth is in "' + req.url + '"')
            console.log(strBody.substr(ind - 100, 200))
        }
        
        if (proxyRes.statusCode > 300 && proxyRes.statusCode < 310) {
            res.statusCode = 400
            res.end()
            return
        }

        for (let i = 0; i < proxyRes.rawHeaders.length; i += 2) {
            const header = proxyRes.rawHeaders[i]
            const value = proxyRes.rawHeaders[i + 1]

            if (header != 'Content-Length') {
                res.setHeader(header, value)
            }
        }

        if (req.url == '/') {

            strBody = strBody
                               .replace(/([\s\>])Siegers/gi, '$1Siggers')
                               .replace('Web Application Designer & Programmer', 'Dog')
                               .replace('="sharpen">E</', '="sharpen">G</')
                               .replace(/window.location.replace\(.*aberoth.com.*\)/gi, '')

            res.end(strBody)
        } else if (
            req.url.endsWith('.js') ||
            req.url.endsWith('.html') ||
            proxyRes.headers["content-type"] && (
                proxyRes.headers["content-type"] == 'application/json' ||
                proxyRes.headers["content-type"] == 'application/javascript' ||
                proxyRes.headers["content-type"].startsWith('text/html')
            )
        ) {
            const strBody = body.toString()
                              .replace(/aberoth(\.com)?/gi, '')
            res.end(strBody)
        }{
            res.end(body)
        }
    })
})

http.createServer((req, res) => {
    proxy.web(req, res, { secure: false })
}).listen(8080)
