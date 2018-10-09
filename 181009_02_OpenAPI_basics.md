# [번역] Writing OpenAPI (Swagger) Specification Tutorial - 2

Part 2 - The Basics

API에 대한 기본 정보를 작성하자.
API 엔드포인트를 설명하자.
엔드포인트는 경로나 쿼리,body 파라메터로 구성된 HTTP 메서드를 보내서 다양한 HTTP 상태와 응답을 반환한다.

## 빈 OpenAPI 명세

```yaml
swagger: "2.0"

info:
  version: 1.0.0
  title: Simple API
  description: A simple API to learn how to write OpenAPI Specification

schemes:
  - https
host: simple.api
basePath: /openapi101

paths: {}
```

## OpenAPI 명세 버전

```yaml
swagger: "2.0"
```

OpenAPI는 swagger 기반이다. 현재는 openapi.yaml 파일에 `openapi: "3.0"`이라는 속성으로 정의하게 되어 있다.

## API 설명

`info` 속성으로 API의 버전(파일 버전), `title`, `description` 등을 정의해준다.

```yaml
info:
  version: 1.0.0
  title: Simple API
  description: A simple API to learn how to write OpenAPI Specification
```

## API URL

`web` API이므로, 루트 URL 정보는 사람과 프로그램이 사용할 중요한 정보이다.

프로토콜(scheme) 정보, 호스트, 기본 정보를 작성한다. 허용된 프로토콜 리스트는 [여기](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swaggerObject)에 있다.

```yaml
schemes:
  - https
host: simple.api
basePath: /openapi101
```
모든 API 엔드포인트들이  `https://simple.api/open101`를 기본 URL로 사용할 것이다. 이 정보는 `not required`이다.

## 연산 정의

사람의 목록을 나열하는 연산을 정의하자.

```yaml
swagger: "2.0"

info:
  version: 1.0.0
  title: Simple API
  description: A simple API to learn how to write OpenAPI Specification

schemes:
  - https
host: simple.api
basePath: /openapi101

paths:
  /persons:
    get:
      summary: Gets some persons
      description: Returns a list containing all persons.
      responses:
        200:
          description: A list of Person
          schema:
            type: array
            items:
              required:
                - username
              properties:
                firstName:
                  type: string
                lastName:
                  type: string
                username:
                  type: string 
```

## Path 추가

`paths` 섹션에 `persons` 자원에 맞는 `/persons` 경로를 정의했다.

## HTTP 메서드를 Path에 추가

```yaml
    get:
      summary: Gets some persons
      description: Returns a list containing all persons.
```

각 경로마다 http 동사(get, post, put, delete)를 추가해 해당 자원을 조작할 수 있도록 한다.
`get` HTTP 메서드를 적용했고, 짧은 설명(`description`)을 적는다.

## 응답 설명

```yaml
      responses:
        200:
          description: A list of Person
```

응답 세션에 각 연산마다, HTTP 상태 코드에 맞는 응답을 설명할 수 있다.
우리는 GET /persons에 200 응답만 응답할 것이다.

## 응답 내용 설명

```yaml
          schema:
            type: array
            items:
              required:
                - username
              properties:
                firstName:
                  type: string
                lastName:
                  type: string
                username:
                  type: string
```

`GET /persons` 연산은 사람의 리스트를 반환하며 우리는 그것이 무엇인지에 대해 `schema` 섹션에서 설명한다.
person의 리스트는 `array` 타입인 객체이다.
각 아이템은 세 속성으로 되어 있는데, `firstName : string`, `lastName : string`, `username : string`이다. `username` 속성은 항상 제공된다. (`필수 요건`)

## 쿼리 파라미터 정의

많은 `persons`를 핸들링하기 떄문에, 페이징 기능을 넣는 것이 좋다. 쿼리 파라메터를 추가함으로서 요청한 페이지와 페이지 당 아이템의 수를 정의한다.

```yaml
paths:
  /persons:
    get:
      summary: Gets some persons
      description: Returns a list containing all persons. The list supports paging.
      parameters:
       - name: pageSize
         in: query
         description: Number of persons returned
         type: integer
       - name: pageNumber
         in: query
         description: Page number
         type: integer
```



## 