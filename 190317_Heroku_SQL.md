# Heroku Postgres SQL로 SQL 파일 실행하기

### psql 설치

개발/운영 환경 분리를 위해 로컬에 postgresql을 설치하는 것을 권장한다.
(설치용량 20MB)

https://devcenter.heroku.com/articles/heroku-postgresql#local-setup

### 로컬 설정

psql을 설치한 뒤에 설정해줘야 할 게 있다.
사용자를 로그인할 수 있게 해줘야아 한ㄷ.

```sh
sudo -u postgres -i
```
로 postgres 계정으로 로그인한 뒤에, 로그인 가능하게 설정한다.

```sh
USERNAME=username
echo "CREATE USER $USERNAME" | psql
echo "GRANT ROOT TO $USERNAME" | psql
echo "ALTER ROLE $USERNAME WITH LOGIN" | psql
echo "CREATE DATABASE $USERNAME" | psql
echo "ALTER USER $USERNAME WITH PASSWORD '$USERNAME';" | psql
```

### 명령어 실행

```sh
cat file.sql | heroku pg:psql
```

**콘솔**에서 인코딩을 확인하려면..

```sh
show SERVER_ENCODING;
```

기본 결과값은..

``` 
server_encoding 
-----------------
 UTF8
(1 row)
```
### 문법

#### SEIRAL 데이터타입

기본키 자동증가를 위한 `SERIAL`이라는 데이터타입을 제공한다.
mariadb의 auto_increment는 사용할 수 없다.
테이블 생성 시 `(테이블 이름)` 표기, 따옴표(')를 사용할 수 없다.

```sql
CREATE TABLE COMPANY(
   ID  SERIAL PRIMARY KEY,
   NAME           TEXT      NOT NULL,
   AGE            INT       NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL
);
```
#### sequence 데이터타입

```sql
CREATE SEQUENCE seq
    increment   10
    minvalue    10 
    maxvalue    1000000
    start 10
    cache 100
    cycle 
;
```
사용할 때에는

```sql
insert into tbl values (nextval('seq'));
```

식으로 사용한다.

### 테이블 삽입

```sql
insert into t_hp_temp(name) values ('hard3');
```

문자열에 쌍따옴표를 사용할 수 없다.