GET /api/reports/category-stats 200 in 363ms


[monthly-usage] APIベースURL: http://go-app:8080⁠


[category-stats] APIベースURL: http://go-app:8080⁠


月別利用金額の取得エラー: AxiosError: Request failed with status code 500


at settle (webpack-internal:///(rsc)/./node_modules/axios/lib/core/settle.js:21:16)


at IncomingMessage.handleStreamEnd (webpack-internal:///(rsc)/./node_modules/axios/lib/adapters/http.js:519:81)


at IncomingMessage.emit (node:events:536:35)


at endReadableNT (node:internal/streams/readable:1698:12)


at process.processTicksAndRejections (node:internal/process/task_queues:82:21)


at Axios.request (webpack-internal:///(rsc)/./node_modules/axios/lib/core/Axios.js:50:49)


at process.processTicksAndRejections (node:internal/process/task_queues:95:5)


at async GET (webpack-internal:///(rsc)/./src/app/api/reports/monthly-usage/route.ts:16:38)


at async /app/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:63809


at async eU.execute (/app/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:53964)


at async eU.handle (/app/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:65062)


at async doRender (/app/node_modules/next/dist/server/base-server.js:1333:42)


at async cacheEntry.responseCache.get.routeKind (/app/node_modules/next/dist/server/base-server.js:1555:28)


at async DevServer.renderToResponseWithComponentsImpl (/app/node_modules/next/dist/server/base-server.js:1463:28)


at async DevServer.renderPageComponent (/app/node_modules/next/dist/server/base-server.js:1856:24)


at async DevServer.renderToResponseImpl (/app/node_modules/next/dist/server/base-server.js:1894:32)


at async DevServer.pipeImpl (/app/node_modules/next/dist/server/base-server.js:911:25)


at async NextNodeServer.handleCatchallRenderRequest (/app/node_modules/next/dist/server/next-server.js:271:17)


at async DevServer.handleRequestImpl (/app/node_modules/next/dist/server/base-server.js:807:17)


at async /app/node_modules/next/dist/server/dev/next-dev-server.js:331:20


at async Span.traceAsyncFn (/app/node_modules/next/dist/trace/trace.js:151:20)


at async DevServer.handleRequest (/app/node_modules/next/dist/server/dev/next-dev-server.js:328:24)


at async invokeRender (/app/node_modules/next/dist/server/lib/router-server.js:163:21)


at async handleRequest (/app/node_modules/next/dist/server/lib/router-server.js:342:24)


at async requestHandlerImpl (/app/node_modules/next/dist/server/lib/router-server.js:366:13)


at async Server.requestListener (/app/node_modules/next/dist/server/lib/start-server.js:140:13) {