# 문서화된 API에 대한 테스트 작성

[윤상배님의 강의](https://www.joinc.co.kr/w/blog/gotdd)를 듣고, MSA 환경에서 API를 어떻게 다루고 테스트해야할 지 고민해보았다.

* API 정의하기

* SwaggerHub를 통해 자동 코드 생성하기

## OpenAPI 코드 자동 생성

자동으로 작성된 코드를 분석해보자.

```bash
.
├── api
│   └── swagger.yaml
├── go
│   ├── default_api.go
│   ├── inline_response_200.go
│   ├── logger.go
│   ├── README.md
│   └── routers.go
└── main.go
```
현재 폴더는 이렇게 되어 있다.

* `api` 폴더에는 API의 정의가 들어있다.

* `main.go`는 라우터를 초기화하고 서버를 실행한다.

```go

package main

import (
	"log"
	"net/http"

	// WARNING!
	// Change this to a fully-qualified import path
	// once you place this file into your project.
	// For example,
	//
	//    sw "github.com/myname/myrepo/go"
	//
	sw "./go"
)

func main() {
	log.Printf("Server started")

	router := sw.NewRouter()

	log.Fatal(http.ListenAndServe(":8080", router))
}
```

`go`폴더의 내용을 살펴보자.

* `default_api.go`

```go
func PersonsGet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
```
작성한 API의 내용이 있다.

* `inline_response_200.go`

`definitions`의 `inline_response_200`이다.

```go
type InlineResponse200 struct {

	FirstName string `json:"firstName,omitempty"`

	LastName string `json:"lastName,omitempty"`

	Username string `json:"username"`
}

```

* `logger.go`

로그 형식은 이렇게 된다.

```
2018/10/09 15:28:39 Server started
2018/10/09 15:29:09 GET /openapi101/persons PersonsGet 7.594µs
```

```go
package swagger

import (
    "log"
    "net/http"
    "time"
)

func Logger(inner http.Handler, name string) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        inner.ServeHTTP(w, r)

        log.Printf(
            "%s %s %s %s",
            r.Method,
            r.RequestURI,
            name,
            time.Since(start),
        )
    })
}
```

* routers.go

```go

var routes = Routes{
	Route{
		"Index",
		"GET",
		"/openapi101/",
		Index,
	},

	Route{
		"PersonsGet",
		strings.ToUpper("Get"),
		"/openapi101/persons",
		PersonsGet,
	},
}
```

라우팅을 수행한다.

## 자동으로 생성된 코드와 net/http/httptest의 연동

[다음 글](https://blog.questionable.services/article/testing-http-handlers-go/)을 참고한다.

현재 우리는 빈 200 OK 응답을 보내는 `/persons` API를 가지고 있다.
간단한 응답을 보내도록 코드를 추가하자.

```go
func PersonsGet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	io.WriteString(w, `{"alive": true}`)
}

```
그리고 `handlers_test.go`를 작성하고 다음 테스트를 입력하자.

```go
package swagger

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPersons(t *testing.T) {
	// 핸들러에 넘길 요청을 만든다.
	// 세 번째 인자는 쿼리 파라메터이다. nil을 넘기면 된다.
	req, err := http.NewRequest("GET", "/persons", nil)
	if err != nil {
		t.Fatal(err)
	}

	// http.ResponseWriter에 대응하는 ResponseRecorder를 만든다.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(PersonsGet)

	// routers.go에서 http.Handler 타입으로 라우트를 설정하고 있다.
	// ServeHTTP 메서드를 직접 불러서 Request. ResponseRecorder로 넘긴다.
	handler.ServeHTTP(rr, req)

	// HTTP 상태 코드를 점검한다.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// 응답 바디를 점검한다.
	expected := `{"alive":true}`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}

}
```

Go의 testing, httptest 패키지를 통해 테스트를 한다.
`*http.Request`와 `*httptest.ResponseRecorder`를 만들고, 핸들러가 어떻게 반응하는지 점검한다. (상태 코드, 바디 체크)

특정 쿼리 파라메터를 체크하고자 하면, NewRequest의 세 번째 인자에 값을 넣자.

또, 헤더에 대한 반응을 넣을 수도 있다.

```yaml
    // e.g. GET /api/projects?page=1&per_page=100
    req, err := http.NewRequest("GET", "/api/projects",
        // Note: url.Values is a map[string][]string
        url.Values{"page": {"1"}, "per_page": {"100"}})
    if err != nil {
        t.Fatal(err)
    }

    // Our handler might also expect an API key.
    req.Header.Set("Authorization", "Bearer abc123")

    // Then: call handler.ServeHTTP(rr, req) like in our first example.
```

그리고 `go test` 명령을 입력하면..

```bash
$ go test
PASS
ok      _/home/seongwon/repo/openapi/httptest/go        0.003s
```

Context와 DB 테스트를 포함한 httptest는 다음에 번역하겠다.
출처: [여기](https://blog.questionable.services/article/testing-http-handlers-go/)
