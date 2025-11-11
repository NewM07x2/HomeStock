Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.

Warning: Expected server HTML to contain a matching <td> in <td>.

See more info here: https://nextjs.org/docs/messages/react-hydration-error

Component Stack
td
td
tr
tbody
table
div
section
div
div
div
div
Call Stack
throwOnHydrationMismatch
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (7088:8)
throwOnHydrationMismatch
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (7117:6)
tryToClaimNextHydratableInstance
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (16524:4)
updateHostComponent$1
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (18427:13)
apply
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (20498:13)
dispatchEvent
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (20547:15)
apply
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (20622:28)
invokeGuardedCallback
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (26813:6)
beginWork
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (25637:11)
performUnitOfWork
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (25623:4)
workLoopConcurrent
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (25579:8)
renderRootConcurrent
node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js (24432:37)
callback
node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js (256:33)
workLoop
node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js (225:13)
flushWork
node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js (534:20)