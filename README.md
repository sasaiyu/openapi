# OpenAPI

## TL;DR

schemas フォルダに格納された [OpenAPI](https://swagger.io/specification/) (.yaml) を [swagger-merger](https://github.com/WindomZ/swagger-merger) で結合し swagger.yaml を再生成する。

[http://localhost:8000/api](http://localhost:8000/api) (ただし、`/api` は schemas に作成したディレクトリ名) にアクセスすると、[Swagger UI](https://hub.docker.com/r/swaggerapi/swagger-ui) にリダイレクトし自動生成された [Swagger Doc](https://swagger.io/docs/) を表示する。なお、アクセスするポート番号は .env の`APP_PORT`で変更できる。リダイレクトされる Swagger UI のポート番号は `SWAGGER_PORT` で変更できる。デフォルト値は以下の通りである。

```
#.env
APP_PORT=8000
SWAGGER_PORT=8001
```
