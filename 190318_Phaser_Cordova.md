# Phaser Cordova 연동

[참고](https://gamedevacademy.org/creating-mobile-games-with-phaser-3-and-cordova/)

### Cordova 설치

```sh
npm install -g cordova
```

### 프로젝트 생성

```sh
APPNAME="hello"

cordova create $APPNAME
```

### Phaser 설치

```sh
cd www
npm init
npm install --save phaser
```

### 브라우저 서포트 추가

iOS, Android 지원은 나중에 추가할 수 있다.

```sh
cordova platform add browser
```

### live reload 기능 추가

파일을 수정하면 자동 리로드하는 기능을 추가한다.

```sh
cordova plugin add cordova-plugin-browsersync
```

### HTTP 서버 실행

```sh
cordova run browser --live-reload
```

명령을 실행하면 [](http://localhost:8000/index.html)에서 게임을 볼 수 있다.

### 게임 코드

`index.html`의 `<div#app>` 부분을 삭제한다.

```html
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <title>Hello World</title>
    </head>
    <body>
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>
```

##### 로드 이벤트에 코드 추가

`js/index.js`

```js
document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        parent: 'game',
        scene: {
            preload: preload,
            create: create
        }
    };
    
    var game = new Phaser.Game(config);
    
    function preload() {
    }
    
    function create() {
    }    
});
```

코드는 다음 일을 한다.

* config 객체

`Phaser.Game` 생성자에 넘길 객체이다. 프레임워크가 어떤 코드를 호출할 지 정한다.

* `type:Phaser.WEBGL`

WebGL은 Canvas-2D보다 빠르다.

* `parent:game`

Phaser가`<canvas id="game">`에 게임을 렌더링하도록 한다. 요소가 없으면 만든다.

* `scene` 객체

Phaser 라이프사이클 중 호출할 함수를 지정한다.

### 게임 실행

```sh
cordova run browser -- --livereload
```

### Game Object

Phaser 3은 게임 오브젝트를 카테고리시켜화 공통으로 만들어놓았다.
`sprite` 게임 오브젝트를 추가한다.
스프라이트는 이미지면서, 게임 엔진이 물리 연산을 수행하는 등 연산을 할 수 있게 한다.

### Asset 추가

[](https://kenney.nl)에서

[](http://kenney.nl/assets/tappy-plane) 에셋을 다운받자.

`SpriteSheet/sheet.xml`
`SpriteSheet/sheet.png`

파일을 `www/img` 디렉터리에 넣고, `preload()`, `create()` 함수를 수정한다.

```js
    function preload() {
        this.load.atlas("sheet", "img/sheet.png", "img/sheet.json");
    }

    function create() {
        this.add.sprite(400, 300, 'sheet', 'planeBlue1.png');
    }
```

`img/sheet.json`은 `img/sheet.xml`에 기초해서 프로젝트 asset에 포함된다.

* Phaser에게 텍스쳐 파일이 있음을 알려주고 (`img/sheet.png`)

* 프레임워크는 `img/sheet.json`의 내용을 사용해 이미지 내의 프레임을 찾을 수 있고음을 알리고

* `img/sheet.xml`은 다음과 같이 png를 만들고 있다.

```xml
	<SubTexture name="planeBlue1.png" x="330" y="1371" width="88" height="73"/>
	<SubTexture name="planeBlue2.png" x="372" y="1132" width="88" height="73"/>
	<SubTexture name="planeBlue3.png" x="222" y="1562" width="88" height="73"/>
```

* Phaser에서 지원하는 json 형식을 만들어주어야 한다.

[](https://www.freeformatter.com/xml-to-json-converter.html) 에서 xml을 json으로 변환 후에
```json
{
    "frames": {
        "UIbg.png" : {
            "frame": {
                "x": 0,
                "y": 986,
                "w": 264,
                "h": 264
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 264,
                "h": 264
            },
            "sourceSize": {
                "w": 264,
                "h": 264
            }
       },
       "background.png" : {
           "frame": {
//...
//...
           "sourceSize": {
               "w": 400,
               "h": 73
           }
       }
    }
 }
```

형태로 만들어준다. 좌표값이 문자열이 아님에 유의하자.

### 스프라이트하기

`planeBlue`는 프레임이 3개 있다.
`create()`를 수정해 이를 반영하자.

```js
        function create() {
            this.anims.create({
                key: 'plane',
               repeat: -1,
               frameRate: 10,
               frames: this.anims.generateFrameNames("sheet",
               {
                   start: 1,
                   end: 3,
                   prefix: "planeBlue",
                   suffix: ".png"
                }) 
            });

            this.add.sprite(400, 300, 'sheet').play("plane");
```

먼저 `Phaser.AnimationManager`에 애니메이션을 등록했다.
`generateFrameNames()` 헬퍼 함수로 프레임 관련 png 파일 이름을 생성했다.
그리고 `.play()` 함수로 비행기 스프라이트를 인스턴스화했다.

### 배경 만들기

빈 배경을 만들자. 비행기를 만들기 직전에 만든다.
`setOrigin(0)`은 이미지를 0.5(중간)에서 0(좌상단)에 위치시키게 만든다.

```js
this.add.image(0, 0, 'sheet', 'background.png').setOrigin(0);
this.add.sprite(400, 300, 'sheet').play("plane");
```

### 게임 크기 조정

`config` 객체를 이용해 게임 크기를 설정하자.
background 이미지 크기는 800x480이었다.

```js
var config = {
    type: Phaser.WEBGL,
    parent: 'game',
    width: 800,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};
```

물론 모바일에서는 반응형으로 게임 크기를 조정해야 한다.
간단한 수학으로 달성 가능하다.

```js
function create() {
    window.addEventListener("resize", resize);
    resize();
    //...
```


```js
function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
    
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}
```

### 무한 스크롤

Tappy Plane, Flappy Bird같은 게임의 배경화면은 무한스크롤한다.
Phaser에서 간단하게 구현할 수 있다.
config 객체에서 `update` 프로퍼티를 지정해준다. `update` 프로퍼티의 함수는 1frame마다 실행된다.

배경화면을 `image` 대신 `tileSprite`로 만들고, 변수에 넣는다.
타일 스프라이트는 카메라의 상대 위치를 업데이트할 수 있다.
이를 이용해 시선차이나 무한 스크롤을 만들 수 있다.

```js
this.bg = this.add.tileSprite(0, 0, 800, 480, 'sheet', 'background.png').setOrigin(0);
```

tilePositionX 변수를 이용해 카메라의 시선 차이, 사용자의 눈이 오른쪽으로 5px만큼 움직이는 효과를 볼 수 있다.

### iOS/Android 지원 추가

android, ios 지원을 추가하고,

```sh
cordova platform add ios android
```

에뮬레이트해보자. (iOS는 XCode가 있어야 한다.)

```sh
cordova emulate ios
```

### 게임 배포

[](http://www.9bitstudios.com/2016/01/submit-apache-cordova-applications-for-ios-and-android-to-the-apple-app-store-google-play/)
여기에 잘 정리되 있다.


```sh
cordova build --release ios
```

```sh
cordova platform add android
cordova emulate android
cordova build --release android
```