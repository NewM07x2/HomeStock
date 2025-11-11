socket: [Socket],


_header: 'GET /api/stock-history?page=1&limit=10000 HTTP/1.1\r\n' +


'Accept: application/json, text/plain, */*\r\n' +


'User-Agent: axios/1.12.2\r\n' +


'Accept-Encoding: gzip, compress, deflate, br\r\n' +


'Host: localhost:8080\r\n' +


'Connection: keep-alive\r\n' +


'\r\n',


_keepAliveTimeout: 0,


_onPendingData: [Function: nop],


agent: [Agent],


socketPath: undefined,


method: 'GET',


maxHeaderSize: undefined,


insecureHTTPParser: undefined,


joinDuplicateHeaders: undefined,


path: '/api/stock-history?page=1&limit=10000',


_ended: false,


res: null,


aborted: false,


timeoutCb: [Function: emitRequestTimeout],


upgradeOrConnect: false,


parser: null,


maxHeadersCount: null,


reusedSocket: false,


host: 'localhost',


protocol: 'http:',


_redirectable: [Circular *1],


[Symbol(shapeMode)]: false,


[Symbol(kCapture)]: false,


[Symbol(kBytesWritten)]: 0,


[Symbol(kNeedDrain)]: false,


[Symbol(corked)]: 0,


[Symbol(kOutHeaders)]: [Object: null prototype],


[Symbol(errored)]: null,


[Symbol(kHighWaterMark)]: 16384,


[Symbol(kRejectNonStandardBodyWrites)]: false,


[Symbol(kUniqueHeaders)]: null


},


_currentUrl: 'http://localhost:8080/api/stock-history?page=1&limit=10000',


[Symbol(shapeMode)]: true,


[Symbol(kCapture)]: false


},


[cause]: Error: connect ECONNREFUSED 127.0.0.1:8080


at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1611:16)


at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {


errno: -111,


code: 'ECONNREFUSED',


syscall: 'connect',


address: '127.0.0.1',


port: 8080


}


}


GET /api/reports/monthly-usage 500 in 26ms
