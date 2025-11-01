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


path: '/api/items?limit=10',


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


_currentUrl: 'http://localhost:8080/api/items?limit=10',


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


Failed to load items: Error: Failed to fetch items. Please try again later.


at fetchRecentItems (webpack-internal:///(rsc)/./src/lib/api.ts:46:15)


at process.processTicksAndRejections (node:internal/process/task_queues:95:5)


at async RecentItems (webpack-internal:///(rsc)/./src/components/home/RecentItems.tsx:17:17)


GET / 200 in 126ms


GET /.well-known/appspecific/com.chrome.devtools.json 404 in 77ms