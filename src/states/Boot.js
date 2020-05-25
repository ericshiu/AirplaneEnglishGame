import Phaser from 'phaser'
import wordConfig from '../wordConfig'
let player, bullets, bg, shotAudio, enemys, scoreText, spaceKey, text, backgroundA, word, cursors,nowWord ,bricks, correct
let fireRate = 100
let nextFire = 0
let nextEnemy = 0
let lestX = 0
let score = 0
// let isOver = false
export default class extends Phaser.State {
  init () {
    // this.stage.backgroundColor = '#EDEEC9'
  }
  preload () {
    this.load.audio('backgroundAudio', 'assets/audio/bgm.mp3')
    this.load.audio('correct', 'assets/audio/correct.mp3')
    this.load.audio('shotAudio', 'assets/audio/shotAudio.mp3')
    this.load.spritesheet('airP', 'assets/images/plane-sprite-png-4.png', 189, 140)
    this.load.spritesheet('bullet', 'assets/images/bullet.png', 39.5, 29)
    this.load.spritesheet('enemy', 'assets/images/enemy.png', 155, 155)
    // this.load.image('background', 'assets/images/sakura_art_nebo.jpg')
    this.load.image('background', 'assets/images/bg.jpg')
    this.load.bitmapFont('Desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');
    this.load.image('WORD_a', 'assets/images/A.PNG')
    this.load.image('WORD_b', 'assets/images/B.PNG')
    this.load.image('WORD_e', 'assets/images/E.PNG')
    this.load.image('WORD_d', 'assets/images/D.PNG')
    this.load.image('WORD_g', 'assets/images/G.PNG')
    this.load.image('WORD_m', 'assets/images/M.PNG')
    this.load.image('WORD_o', 'assets/images/O.PNG')
    this.load.image('WORD_p', 'assets/images/P.PNG')
    this.load.image('WORD_t', 'assets/images/T.PNG')
    this.load.image('WORD_y', 'assets/images/Y.PNG')
    this.load.image('WORD_z', 'assets/images/Z.PNG')


    this.load.audio('bag', 'assets/audio/bag.mp3')
    this.load.audio('day', 'assets/audio/day.mp3')
    this.load.audio('jacket', 'assets/audio/jacket.mp3')
    this.load.audio('mom', 'assets/audio/mom.mp3')
    this.load.audio('jump', 'assets/audio/jump.mp3')
    this.load.audio('mouse', 'assets/audio/mouse.mp3')
    this.load.audio('read', 'assets/audio/read.mp3')
    this.load.audio('zoo', 'assets/audio/zoo.mp3')

  }
  create () {
    // 加入音樂
    backgroundA = this.add.audio('backgroundAudio')
    shotAudio = this.add.audio('shotAudio')
    correct = this.add.audio('correct')
    // backgroundA.play()
    backgroundA.loopFull()
    // 放入背景圖案
    bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background')
    // 滾動背景
    bg.autoScroll(0, 20)
    bg.smoothed = false
    this.physics.startSystem(Phaser.Physics.ARCADE)

    //設定飛機
    player = this.add.sprite(0, this.world.height, 'airP')
    player.scale.setTo(0.5, 0.5)
    this.physics.arcade.enable(player)
    player.frame = 2
    player.body.bounce.y = 0.5
    player.body.collideWorldBounds = true
    player.inputEnabled = true
    player.input.enableDrag(false)
    player.animations.add('left', [1], 190, false)
    player.animations.add('right', [3], 190, false)
    console.log(player);
    
    //設定角色碰撞邊界
    // player.body.setSize(150, 100, 0);


    // 製作子彈
    bullets = this.add.group()
    bullets.enableBody = true
    // bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(200, 'bullet', [0, 1, 2, 3])
    bullets.setAll('checkWorldBounds', true)
    bullets.setAll('outOfBoundsKill', true)
    bullets.setAll('anchor.y', 0.5)
    bullets.setAll('scale.x', 0.85)
    bullets.setAll('scale.y', 0.85)
    bullets.callAll('animations.add', 'animations', 'fly3', [0, 1, 2, 3], 4, true)
    // 製作敵人
    enemys = this.add.group()
    enemys.enableBody = true
    enemys.createMultiple(200, 'enemy', [0, 1, 2, 3])
    enemys.setAll('outOfBoundsKill', true)
    enemys.setAll('checkWorldBounds', true)
    enemys.callAll('animations.add', 'animations', 'fly2', [0, 1, 2, 3], 4, true)
    // 記分板
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

    // 單字
    word = this.add.bitmapText(400/2, 736/2, 'Desyrel', 'START', 64);
    word.anchor.x = 0.5;
    word.anchor.y = 0.5;

    // 方塊
    bricks = game.add.group();
    bricks.enableBody = true;

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }
  update () {
    // console.log(player.body.debug)
    if (this.physics.arcade.collide(player, enemys)) {
      backgroundA.stop();
      this.state.start('Over')
    }
    if (this.time.now/1000 > nextEnemy) {
      nextEnemy +=10;
      this.changeWord()
      this.createEnemy()
    }
    if (this.input.pointer1.isDown || spaceKey.isDown) {
      this.fire()
      // this.physics.arcade.accelerationFromRotation(bullet.rotation, 300, bullet.body.acceleration)
    }

    this.physics.arcade.overlap(player, bricks, this.confirmAnswer, null, this)
    // // player.body.velocity.setTo(0, 0);
    // if (cursors.left.isDown)
    // {
    //   console.log('left:',player.body.velocity.x);
    //   player.body.velocity.x = -200;
    // }
    // else if (cursors.right.isDown)
    // {
    //   console.log('right');
    //   player.body.velocity.x = 200;
    // }



    if (lestX > player.x) {
      // 播放此動畫。
      player.animations.play('left')
      lestX = player.x
    } else if (lestX < player.x) {
      // 播放此動畫。
      player.animations.play('right')
      lestX = player.x
    } else {
      // 停止此動畫。
      player.body.velocity.x = 0
      player.animations.stop()
      player.frame = 2
    }
    // 此方法在這遊戲是把物件刪除
    // 子彈跟怪物碰撞的時候
    this.physics.arcade.overlap(bullets, enemys, this.collectStar, null, this)
  }
  // checkOver (body1, body2) {
  //   console.log('air : ', body1.y)
  //   console.log('e : ', body2.y)
  //   if ((body1.y + 70) < (body2.y)) {
  //     isOver = true
  //   } else {
  //     isOver = false
  //   }
  // }
  collectStar (bullet, e) {
    // 把這個刪除
    e.kill()
    bullet.kill()
    score += 10
    scoreText.text = 'Score: ' + score
  }


  confirmAnswer (player, word) {
    // 把這個刪除
    console.log(word.value);
    if(word.value === nowWord.ans){
      score += 100
      correct.play();
      word.kill();
    }else{
      word.kill();
    }
    scoreText.text = 'Score: ' + score
  }

  changeWord(){
    // console.log(wordConfig.words[this.getRandomInt(wordConfig.words.length)]);
    nowWord = wordConfig.words[this.getRandomInt(wordConfig.words.length)];
    word.text = nowWord.fill;
    // 創建方塊
    var brick;
    bricks.removeBetween (0,3);
    for(var x = 0; x < nowWord.q.length; x++) {
      console.log('WORD'+nowWord.q[x]);
      
      brick = bricks.create((x * 60)+this.getRandomInt(200), 100+this.getRandomInt(200) , 'WORD_'+nowWord.q[x]);
      brick.scale.setTo(0.3, 0.3)
      brick.body.bounce.set(1);
      brick.value=nowWord.q[x];
      brick.body.immovable = true;
    };
    
    var ansAduio = this.add.audio(nowWord.word);
    ansAduio.play();
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  createEnemy () {
    let e = enemys.getFirstExists(false)
    var e2 = enemys.getAt(enemys.getChildIndex(e) + 1)
    var e3 = enemys.getAt(enemys.getChildIndex(e) + 2)
    var e4 = enemys.getAt(enemys.getChildIndex(e) + 3)
    console.log(e);
    if (e) {
      e.scale.setTo(0.5, 0.5)
      e2.scale.setTo(0.5, 0.5)
      e3.scale.setTo(0.5, 0.5)
      e4.scale.setTo(0.5, 0.5)
      // 設定乞食x y
      e.reset(0, 0)
      e2.reset(0+80, 0)
      e3.reset(0+160, 0)
      e4.reset(0+240, 0)
      //

      // e.life = config.life
      // 固定從頂部下來
      e.body.velocity.y = 100
      e2.body.velocity.y = 100
      e3.body.velocity.y = 100
      e4.body.velocity.y = 100
      
      e.play('fly2')
      e2.play('fly2')
      e3.play('fly2')
      e4.play('fly2')

    }
  }
  fire () {
    if (this.time.now > nextFire) {
      var bullet1 = bullets.getFirstExists(false)
      // var bullet2 = bullets.getAt(bullets.getChildIndex(bullet1) + 1)
      // var bullet3 = bullets.getAt(bullets.getChildIndex(bullet1) + 2)
      shotAudio.play()
      console.log('fire')
      nextFire = this.time.now + fireRate
      // bullet3.scale.setTo(2, 2)
      // 設定乞食x y
      bullet1.reset(player.x + player.width / 2, player.y + player.height / 2)
      // bullet2.reset(player.x + player.width / 2, player.y + player.height / 2)
      // bullet3.reset(player.x + player.width / 2, player.y + player.height / 2)
      // 設定 射到哪邊的仰角
      bullet1.rotation = this.physics.arcade.angleToXY(bullet1,player.x, 0)
      // bullet2.rotation = this.physics.arcade.angleToXY(bullet2, 0, 0)
      // bullet3.rotation = this.physics.arcade.angleToXY(bullet3, this.world.width, 0)
      bullet1.body.velocity.y = -700
      // bullet2.body.velocity.y = -700
      // bullet3.body.velocity.y = -700

      // bullet1.body.velocity.x = -50
      // bullet3.body.velocity.x = +50
      bullet1.play('fly3')
      // bullet2.play('fly3')
      // bullet3.play('fly3')
    }
  }
  render() {
    // console.log(this);
    
    this.game.debug.text("Time : " + this.game.time.now/1000, 32, 64);
    this.game.debug.line();
    // this.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
  }

}
