# Heroku + Spring MVC + Mybatis (+PostgreSQL)

### PostgreSQL 설정

튜토리얼을 진행한 뒤 생성된 데이터베이스를 재사용한다.
[출처](https://devcenter.heroku.com/articles/heroku-postgresql#sharing-heroku-postgres-between-applications)

```sh
heroku addons:attach (튜토리얼의 DB 이름)::DATABASE --app (새로 만든 이름)
```

실행 결과는

```sh
Attaching (튜토리얼App) to ⬢ (새로만든앱)... done
Setting DATABASE config vars and restarting ⬢ (새로만든앱)... done, v3
```

이고, 설정변수에 `_URL`이 붙어서 최종적으로는 `DATABASE_URL`로 변수이름이 붙는다.

```sh
heroku run -a stormy-anchorage-89988 echo \$DATABASE_URL
```

```sh
Running echo $DATABASE_URL on ...
postgres://...
```

### 의존성 추가

`pom.xml`

```xml
		<dependency>
			<groupId>com.zaxxer</groupId>
			<artifactId>HikariCP</artifactId>
		</dependency>
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>
```

HikariCP 커넥션 풀을 사용하도록 설정하자.

### 스프링 설정 파일

`application.yml`

```yml
spring:
  datasource:
    url: ${JDBC_DATABASE_URL:}
    hikari:
      connection-timeout: 30000
      maximum-pool-size: 10
server:
    port: ${PORT:5000}
```

### 연결

`DatabaseConfiguration.java`

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.SQLException;

//...

	@Value("${spring.datasource.url}")
	private String dbUrl;

	@Autowired
	private DataSource dataSource;

	@Bean
	public DataSource dataSource() throws SQLException {
	  if (dbUrl == null || dbUrl.isEmpty()) {
		return new HikariDataSource();
	  } else {
		HikariConfig config = new HikariConfig();
		config.setJdbcUrl(dbUrl);
		return new HikariDataSource(config);
	  }
	}
```

해당 설정으로 Heroku PostgreSQL을 사용할 수 있게 되었다.

## Mybatis 연동

### 의존성 추가

```xml
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>2.0.0</version>
		</dependency>
```

### 매퍼 xml 폴더 추가

`resources/mapper/todo-mapper.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hardplant.todo.service.impl.TodoMapper">

</mapper>
```

`Application.java`

```java

import org.mybatis.spring.annotation.MapperScan;
@MapperScan("com.hardplant.todo.**.impl")
//...
```

### Mapper 파일 추가

`java/.../service/impl/TodoMapper.java`

```java
package com.hardplant.todo.service.impl;


import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TodoMapper {
    
}
```

이후 MyBatis 사용하듯이 사용하면 된다.

## JSP/JSTL 연동

### 의존성 추가

```xml

<dependency>
	<groupId>javax.servlet</groupId>
	<artifactId>jstl</artifactId>
</dependency>
<dependency>
	<groupId>org.apache.tomcat.embed</groupId>
	<artifactId>tomcat-embed-jasper</artifactId>
	<scope>provided</scope>
</dependency>
```

### jsp 파일

`wepapp/WEB-INF/jsp/hello.jsp`

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Hello Millky</title>
</head>
<body>
	<c:out value="<xmp>" escapeXml="true"></c:out>
	<h2>Hello! ${name}</h2>
	<div>JSP version</div>
</body>
</html>
```

### ViewResolver 설정

`application.yaml`

```yml
spring:
  mvc:
    view:
      prefix: /WEB-INF/jsp/
      suffix: .jsp
```

## tiles 설정

### 의존성 추가

```xml

		<dependency>
				<groupId>org.apache.tiles</groupId>
				<artifactId>tiles-jsp</artifactId>
				<version>3.0.8</version>
		</dependency>    
```

### 타일즈 xml 추가

`/webapp/WEB-INF/tiles/tiles.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
 
<!DOCTYPE tiles-definitions PUBLIC "-//Apache Software Foundation//DTD Tiles Configuration 3.0//EN" "http://tiles.apache.org/dtds/tiles-config_3_0.dtd">
 
<tiles-definitions>

    <definition name="base" template="/WEB-INF/jsp/cmmn/default-layouts.jsp">
            <put-attribute name="header" value="/WEB-INF/jsp/cmmn/default-header.jsp" />
            <put-attribute name="left" value="/WEB-INF/jsp/cmmn/default-left.jsp" />
            <put-attribute name="body" value="" />
            <put-attribute name="footer" value="/WEB-INF/jsp/cmmn/default-footer.jsp" />
    </definition>

    <definition name="*/*.tiles" extends="base">
            <put-attribute name="body" value="/WEB-INF/jsp/{1}/{2}.jsp" />
    </definition>

    <definition name="*/*/*.tiles" extends="base">
            <put-attribute name="body" value="/WEB-INF/jsp/{1}/{2}/{3}.jsp" />
    </definition>
 
</tiles-definitions>
```

### 타일즈 설정 추가

`TilesConfig.java`

```java
package com.hardplant.todo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;
 
@Configuration
public class TilesConfig {
 
    @Bean
    public UrlBasedViewResolver viewResolver() {
        UrlBasedViewResolver tilesViewResolver = new UrlBasedViewResolver();
        tilesViewResolver.setViewClass(TilesView.class);
        return tilesViewResolver;
    }
 
    @Bean
    public TilesConfigurer tilesConfigurer() {
 
        TilesConfigurer tiles = new TilesConfigurer();
        tiles.setDefinitions(new String[] { "/WEB-INF/tiles/tiles.xml" });
        return tiles;
    }
}
```

### 설정을 검색하도록 추가

`Appplication.java`

```java
@Controller
@SpringBootApplication
@ComponentScan("com.hardplant.todo")
@ComponentScan("com.hardplant.todo.web")
@MapperScan("com.hardplant.todo.**.impl")
public class TodoApplication {
// ...
```

### 정적 파일 추가

[](https://stackoverflow.com/questions/42393211/how-can-i-serve-static-html-from-spring-boot)

스프링 부트 프로젝트는 다음 경로 파일들을 정적으로 제공한다.
실제 프로젝트에서는 CDN이나 apache2 웹 서버 등을 별도로 운용한다.

```
/META-INF/resources/  
/resources/  
/static/  
/public/
```