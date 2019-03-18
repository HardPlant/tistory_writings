# Phaser-Tiled 게임 제작기 -1일차

Phaser로 풀스크린 지원 HTML5 게임을 만들어볼 생각이다.
Tiled로 기존에 있는 맵 데이터를 불러올 것이다.

### Phaser 소개

### Tiled 소개

작은 블록으로 구성된 레벨
tmx 형태로 저장되며, json으로 변환해서 Phaser가 사용할 수 있게 만들어야 함

### 새 맵 만들기

File->New

### 레이어 종류

* Tile 레이어

타일/블록을 만들 수 있음

* Object 레이어

벡터 오브젝트를 만들어 메타데이터를 담을 수 있음

이 예제에서는 2개 타일 레이어와 1개 물체 레이어를 만들 것임

`backgroundLayer` : 플레이어와 충돌하지 않는 것들
`blockedLayer`    : 장애물 레이어

`objectsLayer`    : 게임 요소를 담을 객체 레이어, 플레이어 스타팅 지점이나 아이템 등

### 타일셋 로드

[File] -> [New Tileset]

[](http://opengameart.org/content/simple-broad-purpose-tileset)

이 타일을 사용할 것임

16*16 크기고, 구분용 여백이 없음

`Name` 텍스트 필드는 Phaser에서 참조할 것이므로 잘 기억해 놓아야 함.

### 레벨 만들기

잘 만들어 봐요.

백그라운드 레이어와 장애물 레이러를 적절히 섞어봅시다.

### 물체 레이어

플레이어 등장 위치와 다음 레벨 이동 위치를 지정할 것임.
그리고 파란 컵, 초록 컵을 만들어 아이템을 만들 것임.

우측 Object 탭에서 레이어를 선택하고 단축키 T를 누름 (Insert Tile, 상단 도구모음의 그림 추가 버튼)

### 물체에 프로퍼티 추가

Phaser가 물체가 무엇을 나타내는지, 어떤 스프라이트를 표시할 지 지정함

상단의 (S)elect Object 버튼을 누르고, 생성한 물체를 더블클릭해면 프로퍼티를 입력할 수 있음

좌측의 프로퍼티 창에서 다음과 같이 지정함.
type 프로퍼티는 문에는 `door`, 플레이어 위치에는 `playerStart`,

sprite 프로퍼티를 생성하고, 파란 컵에 `bluecup`, 초록 컵에 `greencup`, 문에 `browndoor`를 입력함.

이건 Phaser 기본 기능이 아니라 Tiled 기능이므로, Phaser 내장 Tilemap을 보는 것도 나쁘지 않음.

### JSON 파일로 저장

[File]->[Export As]->[Json Files]
로, `/assets/tilemaps` 경로에 저장함.

## Phaser

[메인 메뉴 만들기 강좌](https://gamedevacademy.org/html5-phaser-tutorial-spacehipster-a-space-exploration-game/)

Phaser에서 모든 행동은 State를 부름. 게임의 주요 순간이라고 보면 됨.

Boot, Preload, Game를 사용할 것임.
Boot 상태에서 게임 설정을 불러오고, 프리로딩(로딩 바 등) asset을 부를 것임.
Preload 상태에서는 게임 asset(이미지, 스프라이트시트, 오디오, 텍스쳐 등)을 메모리에 넣고, 로딩 바를 조작할 것임.
Game 상태에서는 실제 게임이 진행됨.

`index.html`

```html
<!DOCTYPE html>
<html>
 
	<head>
		<meta charset="utf-8" />
		<title>Learn Game Development at ZENVA.com</title>
 
		<script type="text/javascript" src="js/phaser.js"></script>
		<script type="text/javascript" src="js/Boot.js"></script>
		<script type="text/javascript" src="js/Preload.js"></script>
		<script type="text/javascript" src="js/Game.js"></script>
 
		<style>
		  body {
		    padding: 0px;
		    margin: 0px;
		  }
		  </style>
	</head>
 
	<body>  
		<!-- include the main game file -->
		<script src="js/main.js"></script>
	</body>
</html>
```

main.js는 게임을 생성하고 픽셀로 게임 사이즈 지정함.
타일셋은 작고, 전체 레벨을 브라우저에서 한 눈에 볼 수 있게 하지는 않을 것임.

`TopDownGame` 부모 객체 안에서 모든 것을 만들 것임. (namespace 패턴)

다른 라이브러리들 중 어떤 것이 영향을 줄지 모르므로 전역 스코프를 건드리면 위험함.

`main.js`

```js
var TopDownGame = TopDownGame || {};

TopDownGame.game = new Phaser.Game(160, 160, Phaser.AUTO, '');

TopDownGame.game.state.add("Boot", TopDownGame.Boot);
TopDownGame.game.state.add("Preload", TopDownGame.Preload);
TopDownGame.game.state.add("Game", TopDownGame.Game);

TopDownGame.game.state.start("Boot");
```

### Boot.js

Boot 상태를 만들고, 로딩 스크린 이미지를 불러오고 다른 게임단 설정을 정의할 것임.
`Phaser.ScaleManager.SHOW_ALL`을 사용해 브라우저 크기를 최대로 사용하고, 160*160 픽셀보다 더 많이 보여주지 않게 할 것임.
이는 메인에서 설정했음.

`boot.js`

```js
var TopDownGame = TopDownGame || {};

TopDownGame.Boot = function() {};

TopDownGame.Boot.prototype = {
    preload: function() {
        // 로딩 스크린에 사용할 asset (없음)
        this.load.image("preloadbar", "assets/images/preloader-bar.png");
    },
    create: function() {
        // 하얀 로딩 스크린
        this.game.stage.backgroundColor = "#fff";

        // 크기조정 옵션
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // 게임을 가운데정렬함
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // 물리시스템
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start("Preload");
    }
}
```

### Preload.js

tilemap을 포함해 asset 로드함.
타일셋 자체가 다른 sprite에 어떻게 로드되는지를 보면 좋음.

```js
var TopDownGame = TopDownGame || {};
 
//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
    preload: function() {
        // 로딩 스크린 보여주기
        this.preloadBar = this.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY + 128,
            "preloadbar");
        this.preloadBar.anchor.setTo(0.5);

        this.preload.setPreloadSprite(this.preloadBar);

        // asset 로드
        this.load.tilemap("level1", "assets/tilemaps/level1.json"
            , null, Phaser.Tilemap.TILED_JSON);
        this.load.image("gameTiles", "asset/images/tiles.png");
        this.load.image("greencup", "asset/images/greencup.png");
        this.load.image("bluecup", "asset/images/bluecup.png");
        this.load.image("player", "asset/images/player.png");
        this.load.image("browndoor", "asset/images/browndoor.png");
    },
    create: function() {
        this.state.start("Game");
    }
};
```

### Game.js

```js
var TopDownGame = TopDownGame || {};
 
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap("level1");

        //타일셋 이름, asset이 사용할 키
        this.map.addTilesetImage("tiles", "gameTiles");

        //레이어 생성
        this.backgroundlayer = this.map.createLayer("backgroundLayer");
        this.blockedlayer = this.map.createLayer("blockedLayer");

        //blockedLayer에 충돌 설정
        this.map.setCollisionBetween(1, 2000, true, "blockedLayer");

        //게임 월드 크기를 레이어 차원에 맞게 조정
        this.backgroundlayer.resizeWorld();
    }
};
```
먼저 JSON에서 타일맵을 불러왔다.
"tiles"는 Tiled 타일셋이고, "gameTiles"는 `Preload.js`에서 만든 이미지 키다.

blockedLayer에 충돌 설정을 할 떄 1~2000 인덱스 숫자는 충돌을 일으킬 타일 idx다.
(의도는 모든 타일을 포함하도록 하는 큰 수)

json 파일의 layers->data를 봐서 각 레이어의 수 중 가장 큰 숫자를 입력해도 된다.

### type 프로퍼티로 물체 찾기

type으로 물체를 찾는 함수를 `Game.js`에 넣는다.

Tilemap 객체는 "objects" 프로퍼티를 갖고 있고, 각 레이어의 물체들을 나타낸다. 이 메서드를 `type` 프로퍼티를 찾도록 하면 된다.

Phaser 라이브러리의 `Tilemap.js` 파일을 한번 보는 것을 추천한다.

`Game.js`

```js
    // "type" 프로퍼티의 값이 일치하는 물체를 찾음
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (item, idx) {
            if (item.properties.type === type) {
                // Phaser는 top-left, Tiled는 bottom-left를 사용함
                // y 좌표를 보정할 필요가 있음
                // 컵 이미지도 16*16보다 약간 작음
                // Tiled의 같은 픽셀 위치에 있으면 안됨
                item.y -= map.tileHeight;
                result.push(element);
            }
        });

        return result;
    }
```

### Tiled 객체에서 sprite 만들기

type으로 Tiled 객체를 찾아서 해당하는 sprite를 만들도록 할 것임.

```js
createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

    // 모든 프로퍼티를 sprite에 복사
    Object.keys(element.properties).forEach(function(key) {
        sprite[key] = element.properties[key];
    });
}
```

Tiled에서 작성한 모든 프로퍼티를 복사하고 있다.
예를 들어, door에 alpha 프로퍼티를 작성했다면 해당 프로퍼티가 js에 등록이 된다.

(Tilemap.createFromObject()를 쓰지 않음, Tiled의 type, sprite를 지정할 수 있기 때문에)

`Game.js`

```js
TopDownGame.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap("level1");

        //타일셋 이름, asset이 사용할 키
        this.map.addTilesetImage("tiles", "gameTiles");

        //레이어 생성
        this.backgroundlayer = this.map.createLayer("backgroundLayer");
        this.blockedlayer = this.map.createLayer("blockedLayer");

        //blockedLayer에 충돌 설정
        this.map.setCollisionBetween(1, 100000, true, "blockedLayer");

        //게임 월드 크기를 레이어 차원에 맞게 조정
        this.backgroundlayer.resizeWorld();

        createItems();
    },
    createItems: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;

        result = this.findObjectsByType("item", this.map, "objectsLayer");
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    }
//...
```

### 문 만들기

```js

    //게임 월드 크기를 레이어 차원에 맞게 조정
    this.backgroundlayer.resizeWorld();

    this.createItems();
    this.createDoors();
    
    //....

createDoors: function() {
    this.doors = this.game.add.group();
    this.doors.enableBody = true;

    result = this.findObjectsByType("door", this.map, "objectsLayer");
    result.forEach(function(element) {
        this.createFromTiledObject(element, this.door);
    }, this);
},
```

### 플레이어

`playserStart` 타입 오브젝트가 플레이어 시작 위치다.

해당 위치에 플레이어 스프라이트를 만든다.

```js
var result = this.findObjectsByType("playerStart", this.map, "objectsLayer");

//결과는 하나라고 예쌍
this.player = this.game.add.sprite(result[0].x, result[0].y, "player");
this.game.physics.arcade.enable(this.player);

// 카메라 설정
this.game.camera.follow(this.player);

// 플레이어를 커서 키로 이동
this.cursors = this.game.input.keyboard.createCursorKeys();
```

### 플레이어 움직임

update() 메서드를 사용한다.

```js
    update: function() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 50;
        } else if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
        }
    },
```

### 충돌

```js
// 플레이어를 커서 키로 이동
this.cursors = this.game.input.keyboard.createCursorKeys();

// 충돌

this.game.physics.arcade.collide(this.player, this.blockedlayer);
this.game.physics.arcade.collide(this.player, this.items, this.collect, null, this);
this.game.physics.arcade.collide(this.player, this.doors, this.enterDoor, null, this);

//...

collect: function(player, collectable) {
console.log("...");

collectable.destroy();
},
enterDoor: function(player, door) {
console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
},
```