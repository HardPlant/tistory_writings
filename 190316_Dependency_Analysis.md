### 전자정부 의존성 분석

아래 `pom.xml`에서 의존성을 분석해보자.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<properties>
	    <spring.maven.artifact.version>4.1.2.RELEASE</spring.maven.artifact.version>
		<egovframework.rte.version>3.6.0</egovframework.rte.version>
		<org.apache.tiles-version>3.0.8</org.apache.tiles-version>
	</properties>
```
프로젝트 이름은 삭제했다.

```xml
	<repositories>
		<repository>
			<id>mvn2</id>
			<url>http://repo1.maven.org/maven2/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</repository>
		<repository>
			<id>egovframe</id>
			<url>http://www.egovframe.go.kr/maven/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
		<repository>
			<id>egovframe2</id>
			<url>http://maven.egovframe.kr:8080/maven/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
	</repositories>
```
라이브러리 저장소다. 의존성에 egovframe이 있다.

```xml
	<dependencies>
		<!-- 표준프레임워크 실행환경 -->
        <dependency>
		    <groupId>egovframework.rte</groupId>
		    <artifactId>egovframework.rte.ptl.mvc</artifactId>
		    <version>${egovframework.rte.version}</version>
		    <exclusions>
		    	<exclusion>
		    		<artifactId>commons-logging</artifactId>
		    		<groupId>commons-logging</groupId>
		    	</exclusion>
		    </exclusions>
        </dependency>
        <dependency>
		    <groupId>egovframework.rte</groupId>
		    <artifactId>egovframework.rte.psl.dataaccess</artifactId>
		    <version>${egovframework.rte.version}</version>
        </dependency>
        <dependency>
			<groupId>egovframework.rte</groupId>
			<artifactId>egovframework.rte.fdl.idgnr</artifactId>
			<version>${egovframework.rte.version}</version>
		</dependency>
       	<dependency>
			<groupId>egovframework.rte</groupId>
			<artifactId>egovframework.rte.fdl.property</artifactId>
			<version>${egovframework.rte.version}</version>
		</dependency>
```

전자정부 실행환경이다.


```xml
        <dependency>
		    <groupId>javax.servlet</groupId>
		    <artifactId>servlet-api</artifactId>
		    <scope>provided</scope>
		    <version>2.5</version>
        </dependency>

        <dependency>
		    <groupId>javax.servlet</groupId>
		    <artifactId>jstl</artifactId>
		    <version>1.2</version>
        </dependency>

        <dependency>
		    <groupId>taglibs</groupId>
		    <artifactId>standard</artifactId>
		    <version>1.1.2</version>
        </dependency>
```
서블릿, jstl이다. taglibs도 보인다.


```xml
		<dependency>
	        <groupId>org.antlr</groupId>
	        <artifactId>antlr</artifactId>
	        <version>3.5</version>
   		</dependency>

		<dependency>
			<groupId>org.hsqldb</groupId>
			<artifactId>hsqldb</artifactId>
			<version>2.3.2</version>
		</dependency>
```

hsqldb, antlr은 뭔지는 모르겠다.

```xml
		<!-- 타일즈    -->
	    <dependency>
	       <groupId>org.apache.tiles</groupId>
	       <artifactId>tiles-jsp</artifactId>
	       <version>${org.apache.tiles-version}</version>
	    </dependency>
	    
	    <dependency>
	       <groupId>org.apache.tiles</groupId>
	       <artifactId>tiles-core</artifactId>
	       <version>${org.apache.tiles-version}</version>
	    </dependency>
```        
타일즈다.

```xml
        <!-- mysql이나 oracle 필요시 사용 -->
        <dependency>
            <groupId>com.googlecode.log4jdbc</groupId>
            <artifactId>log4jdbc</artifactId>
            <version>1.2</version>
            <exclusions>
                <exclusion>
                    <artifactId>slf4j-api</artifactId>
                    <groupId>org.slf4j</groupId>
                </exclusion>
            </exclusions>
        </dependency>
```

slf4j 로깅 라이브러리이다.

```xml
        <dependency>
            <groupId>commons-dbcp</groupId>
            <artifactId>commons-dbcp</artifactId>
            <version>1.4</version>
        </dependency>
        
        <dependency>
		    <groupId>org.mariadb.jdbc</groupId>
		    <artifactId>mariadb-java-client</artifactId>
		    <version>2.2.1</version>
		</dependency>
        
        <!--
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.31</version>
        </dependency>

        <dependency>
            <groupId>ojdbc</groupId>
            <artifactId>ojdbc</artifactId>
            <version>14</version>
            <scope>system</scope>
            <systemPath>${basedir}/src/main/webapp/WEB-INF/lib/ojdbc-14.jar</systemPath>
        </dependency>
        -->
```   
db 클라이언트다.

```xml
        <dependency>
	    	<groupId>com.fasterxml.jackson.core</groupId>
	   		<artifactId>jackson-databind</artifactId>
	    	<version>2.4.3</version>
		</dependency>
		
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.5</version>
            <scope>compile</scope>
        </dependency>
	</dependencies>
```

json 처리 라이브러리이다.
mybatis가 없는 것이 수상한데, 전자정부 rte에 포함되어 있는 것일까.

```xml
	<build>
        <defaultGoal>install</defaultGoal>
        <directory>${basedir}/target</directory>
        <finalName>${artifactId}-${version}</finalName>
        <pluginManagement>
            <plugins>
                <plugin>
	                <groupId>org.apache.tomcat.maven</groupId>
	                <artifactId>tomcat7-maven-plugin</artifactId>
	                <version>2.2</version>
	                <configuration>
	                    <port>80</port>
	                    <path>/</path>
	                    <systemProperties>
	                        <JAVA_OPTS>-Xms256m -Xmx768m -XX:MaxPermSize=256m</JAVA_OPTS>
	                    </systemProperties>
	                </configuration>
	            </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <source>1.7</source>
                        <target>1.7</target>
                        <encoding>UTF-8</encoding>
                    </configuration>
                </plugin>
                <plugin>
                    <groupId>org.codehaus.mojo</groupId>
                    <artifactId>hibernate3-maven-plugin</artifactId>
                    <version>2.1</version>
                    <configuration>
                        <components>
                            <component>
                                <name>hbm2ddl</name>
                                <implementation>annotationconfiguration</implementation>
                            </component>
                        </components>
                    </configuration>
                    <dependencies>
                        <dependency>
                            <groupId>org.hsqldb</groupId>
                            <artifactId>hsqldb</artifactId>
                            <version>2.3.2</version>
                        </dependency>
                    </dependencies>
                </plugin>
                <!-- EMMA -->
                <plugin>
                    <groupId>org.codehaus.mojo</groupId>
                    <artifactId>emma-maven-plugin</artifactId>
                    <version>1.0-alpha-3</version>
                </plugin>
                <!-- PMD manven plugin -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-pmd-plugin</artifactId>
                    <version>3.1</version>
                </plugin>
            </plugins>
        </pluginManagement>
        <plugins>
            <!-- EMMA -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skipTests>true</skipTests>
                    <forkMode>once</forkMode>
                    <reportFormat>xml</reportFormat>
                    <excludes>
                        <exclude>**/Abstract*.java</exclude>
                        <exclude>**/*Suite.java</exclude>
                    </excludes>
                    <includes>
                        <include>**/*Test.java</include>
                    </includes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>emma-maven-plugin</artifactId>
                <inherited>true</inherited>
            </plugin>
            <!-- JavaDoc -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>2.9.1</version>
            </plugin>
        </plugins>
    </build>
```

빌드 타겟이다.
install에서 hibernate를 사용하고 있고, 그 외에 surefire 같은 것이 보인다.

```xml
    <reporting>
        <outputDirectory>${basedir}/target/site</outputDirectory>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-project-info-reports-plugin</artifactId>
                <version>2.7</version>
                <reportSets>
                    <reportSet>
                        <id>sunlink</id>
                        <reports>
                            <report>javadoc</report>
                        </reports>
                        <inherited>true</inherited>
                        <configuration>
                            <links>
                                <link>http://docs.oracle.com/javase/6/docs/api/</link>
                            </links>
                        </configuration>
                    </reportSet>
                </reportSets>
            </plugin>
            <!-- JUnit Test Results & EMMA Coverage Reporting -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>emma-maven-plugin</artifactId>
                <inherited>true</inherited>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>surefire-report-maven-plugin</artifactId>
                <inherited>true</inherited>
                <reportSets>
                    <reportSet>
                        <reports>
                            <report>report-only</report>
                        </reports>
                    </reportSet>
                </reportSets>
            </plugin>
            <!-- Generating JavaDoc Report -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <configuration>
                    <minmemory>128m</minmemory>
                    <maxmemory>512m</maxmemory>
                    <encoding>${encoding}</encoding>
                    <docencoding>${encoding}</docencoding>
                    <charset>${encoding}</charset>
                </configuration>
            </plugin>
            <!-- Generating Java Source in HTML -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jxr-plugin</artifactId>
                <configuration>
                    <inputEncoding>${encoding}</inputEncoding>
                    <outputEncoding>${encoding}</outputEncoding>
                    <linkJavadoc>true</linkJavadoc>
                    <javadocDir>apidocs</javadocDir>
                </configuration>
            </plugin>
        </plugins>
    </reporting>
</project>

```

리포팅.. 테스트 결과나 HTML 파일 같은 것을 보여주는 것 같다.

전자정부 부분을 보면

```xml
	<dependencies>
		<!-- 표준프레임워크 실행환경 -->
        <dependency>
		    <groupId>egovframework.rte</groupId>
		    <artifactId>egovframework.rte.ptl.mvc</artifactId>
		    <version>${egovframework.rte.version}</version>
		    <exclusions>
		    	<exclusion>
		    		<artifactId>commons-logging</artifactId>
		    		<groupId>commons-logging</groupId>
		    	</exclusion>
		    </exclusions>
        </dependency>
        <dependency>
		    <groupId>egovframework.rte</groupId>
		    <artifactId>egovframework.rte.psl.dataaccess</artifactId>
		    <version>${egovframework.rte.version}</version>
        </dependency>
        <dependency>
			<groupId>egovframework.rte</groupId>
			<artifactId>egovframework.rte.fdl.idgnr</artifactId>
			<version>${egovframework.rte.version}</version>
		</dependency>
       	<dependency>
			<groupId>egovframework.rte</groupId>
			<artifactId>egovframework.rte.fdl.property</artifactId>
			<version>${egovframework.rte.version}</version>
		</dependency>
```

이 안에 spring-mvc, mybatis 등이 들어있다고 추측해볼 수 있을 것이다.