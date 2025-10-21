(base) mnitta@MasatonoMacBook-Pro HomeStock % docker-compose up --build -d
WARN[0000] /Users/mnitta/devlop/HomeStock/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 1/1
 ✔ db Pulled                                                                                                                               6.0s 
Compose can now delegate builds to bake for better performance.
 To do so, set COMPOSE_BAKE=true.
[+] Building 1.6s (13/13) FINISHED                                                                                         docker:desktop-linux
 => [next-app internal] load build definition from Dockerfile.frontend                                                                     0.0s
 => => transferring dockerfile: 226B                                                                                                       0.0s
 => [go-app internal] load build definition from Dockerfile.backend                                                                        0.0s
 => => transferring dockerfile: 237B                                                                                                       0.0s
 => CANCELED [next-app internal] load metadata for docker.io/library/node:20                                                               1.6s
 => [go-app internal] load metadata for docker.io/library/golang:1.25.1                                                                    1.4s
 => [go-app internal] load .dockerignore                                                                                                   0.0s
 => => transferring context: 2B                                                                                                            0.0s
 => [go-app 1/7] FROM docker.io/library/golang:1.25.1@sha256:d7098379b7da665ab25b99795465ec320b1ca9d4addb9f77409c4827dc904211              0.0s
 => [go-app internal] load build context                                                                                                   0.0s
 => => transferring context: 3.10kB                                                                                                        0.0s
 => CACHED [go-app 2/7] WORKDIR /app                                                                                                       0.0s
 => CACHED [go-app 3/7] COPY go.mod ./                                                                                                     0.0s
 => CACHED [go-app 4/7] COPY go.sum ./                                                                                                     0.0s
 => CACHED [go-app 5/7] RUN go mod download                                                                                                0.0s
 => CACHED [go-app 6/7] COPY . .                                                                                                           0.0s
 => ERROR [go-app 7/7] RUN go build -o main .                                                                                              0.2s
------                                                                                                                                          
 > [go-app 7/7] RUN go build -o main .:
0.155 no Go files in /app
------
failed to solve: process "/bin/sh -c go build -o main ." did not complete successfully: exit code: 1