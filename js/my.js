var MCard = function (n, s, pic) { //牌类
    this.num = n; //牌面大小，值为0,1,…12（代表A,2,3,4,5,6,7,8,9,10,J,Q,K）
    if (n > 10) n = 10; //set values for J, Q, K
    this.value = n; //点数(用于后面计算点数总和)
    this.suit = s; //牌面花色
    this.picture = pic;
    this.dealt = 0; //发给那位77u6牌手，未发0玩家1庄家2
};
//一副牌类
function Puke() { //一副牌
    this.deck = []; //52张牌数组
}
Puke.prototype.builddeck = function () { //构造一副牌 
    var i = 0;
    for (var si = 0; si < 4; si++) {
        for (var n = 0; n < 13; n++) {
            this.deck[i] = new MCard(n + 1, suitnames[si], pics[i]);
            i++;
        }
    }

}
Puke.prototype.shuffle = function () { //洗牌
    var i = 0;
    var s;
    while (i < this.deck.length) {
        //??Math.random() * 52 + 1（1~52）
        s = Math.floor(Math.random() * (51 + 1)); //0~561
        this.swapindeck(s, i);
        i++;
    }
}
Puke.prototype.swapindeck = function (j, k) { //交换两张牌
    var hold = this.deck[j]; //new MCard(deck[j].num, deck[j].suit, deck[j].picture);
    this.deck[j] = this.deck[k];
    this.deck[k] = hold;
}
Puke.prototype.dealfromdeck = function (who) { //给玩家或庄家发牌。玩家who=1;庄家who=2
    var card;
    var ch = 0;
    console.log(this.deck[ch])
    while ((this.deck[ch].dealt > 0)) //找到还没有发的牌
    {
        ch++;
        if (ch == 52) //如果一副牌发完，立即重洗一副牌
        {
            this.builddeck(); //重新构造一副牌
            this.shuffle();
            ch = 0;
        }
    }
    this.deck[ch].dealt = who; //发给who
    card = this.deck[ch];
    return card; //返回这张牌
}


var timer;
var cwidth = 800;
var cheight = 600;
var cardw = 75;
var cardh = 107;
var playerxp = 20; //玩家的第一张牌的x坐标
var playeryp = 180;
var housexp = 20; //庄家的第一张牌的x坐标
var houseyp = 10;
var housetotal; //庄家手中牌的点数和
var playertotal; //玩家手中牌的点数和
var pi = 0;
var hi = 0;
var puke;
var playerhand = []; //玩家手中牌
var househand = []; //庄家手中 牌
var pics = [];
var back = new Image(); //背面Image
back.src = "images/55.gif" //牌的背面
//将所有扑克牌图片加载到pics数组中。
suitnames = ["1", "2", "3", "4"];
nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
//缓存图像到pics[i]
var i = 0;
for (var si = 0; si < 4; si++) {
    for (var n = 0; n < 13; n++) {
        picname = suitnames[si] + "-" + nums[n] + ".gif";
        pics[i] = new Image();
        pics[i].src = "images/" + picname;
        i++;
    }
}

//游戏页面加载时执行init()，初始化一副牌puke，并且完成洗牌和发最初的四张牌。
function init() {
    ctx = document.getElementById('canvas').getContext('2d');
    // ctx.font = "italic 20pt Georgia";
    // ctx.fillStyle = "blue";
    puke = new Puke();
    puke.builddeck(); //构造一副牌
    puke.shuffle(); //洗牌
    stage = new createjs.Stage("myca");
     buildLoaderBar(); //创建加载条
     startLoad(); //用定时器累加加载条长度
     createjs.Ticker.setFPS(60);
     createjs.Ticker.addEventListener("tick", stage);
    // canvas1 = document.getElementById('canvas');
    // window.addEventListener('keydown', getkey, false);
    // console.log(1);
    // $(".bustlost").slideIn();
}
// 1.5秒后加载进度条消失，背景音乐响起
setTimeout(function () {
    $("#myca").fadeOut();
    $("#bg")[0].play();
  }, 1500)
// Deal
function newgame() { //开始新游戏
    ctx.clearRect(0, 0, cwidth, cheight); //清屏
    pi = 0;
    hi = 0;
    playerxp = 20;
    housexp = 20;
    dealstart(); //发最初的四张牌
}

function dealstart() { //发四张牌
    playerhand[pi] = puke.dealfromdeck(1); //第一张发给玩家
    ctx.drawImage(playerhand[pi].picture, playerxp, playeryp, cardw, cardh);
    playerxp = playerxp + 30;
    pi++;
    househand[hi] = puke.dealfromdeck(2); //第二张发给庄家
    ctx.drawImage(back, housexp, houseyp, cardw, cardh); //画背面
    housexp = housexp + 20;
    hi++;
    playerhand[pi] = puke.dealfromdeck(1); //第三张发给玩家
    ctx.drawImage(playerhand[pi].picture, playerxp, playeryp, cardw, cardh);
    playerxp = playerxp + 30;
    pi++;
    househand[hi] = puke.dealfromdeck(2); //第四张发给庄家
    ctx.drawImage(househand[hi].picture, housexp, houseyp, cardw, cardh);
    housexp = housexp + 20;
    // console.log(househand[hi].value);
    // $(".housesum").html(househand[hi].value);
    hi++;

}
// HIT
function deal() { //玩家再要一张
    playerhand[pi] = puke.dealfromdeck(1);
    ctx.drawImage(playerhand[pi].picture, playerxp, playeryp, cardw, cardh);
    playerxp = playerxp + 30;
    pi++;
    if (more_to_house()) { //同时发给庄家一张牌
        househand[hi] = puke.dealfromdeck(2);
        ctx.drawImage(househand[hi].picture, housexp, houseyp, cardw, cardh);
        housexp = housexp + 20;
        hi++;
    }
}
//双倍赌注
function doublebet() {
    bankmoney -= betmoney;
    betmoney *= 2;
    $("#bankmoney").html(bankmoney);
    $("#betmoney").html(betmoney);
    deal();
}

function more_to_house() { //计算庄家手中的牌的点数和是否小于17
    var ac = 0;
    var i;
    var sumup = 0;
    for (i = 0; i < hi; i++) {
        sumup += househand[i].value;
        if (househand[i].value == 1) {
            ac++;
        }
    }
    // if aces, check if ace as 11 takes hand over
    if (ac > 0) { //有A牌则可以当11所以加10
        if ((sumup + 10) <= 21) {
            sumup += 10;
        }
    }
    // 计算庄家手中的点数和
    housetotal = sumup;
    // console.log(housetotal-househand[0].value)
    $(".housesum").html(housetotal - househand[0].value);
    if (sumup < 17)
        return true;
    else
        return false;
}

function add_up_player() { //计算玩家手中的点数
    var ac = 0;
    var i;
    var sumup = 0;
    for (i = 0; i < pi; i++) {
        sumup += playerhand[i].value;
        if (playerhand[i].value == 1) {
            ac++;
        }
    }
    // A作为软牌
    if (ac > 0) {
        if ((sumup + 10) <= 21) {
            sumup += 10;
        }
    }
    if (sumup > 21) {
        // console
        $(".playerbust").slideDown();
        // 提示音
        $("#tishi")[0].play();
        betmoney = 0;
        $("#betmoney").html(betmoney);
        // 时间不起作用？？
        if (bankmoney == 0) {
            clearTimeout(timer);
            timer = setTimeout(anothermon(), 6000);
        }
    }
    $(".playersum").html(sumup);
    return sumup;
}
// STAND停牌
function playerdone() { //玩家按了键，不要牌了。
    while (more_to_house()) { //只要庄家手中的点数小于17，庄家就不停的要牌
        househand[hi] = puke.dealfromdeck(2);
        ctx.drawImage(back, housexp, houseyp, cardw, cardh);
        housexp = housexp + 20;
        hi++;
    }
    showhouse(); //显示庄家的所有牌
    playertotal = add_up_player(); //玩家的总点数
    if (playertotal > 21) {
        $(".playerbust").slideDown();
        bankmoney -= betmoney;
    } else if (housetotal > 21) {
        // ctx.fillText("你赢了，庄家胀死了.", 30, 250);
        $(".dealerbust").slideDown();
        // 赌注加上本金
        bankmoney += betmoney * 2;
    } else if (playertotal >= housetotal) {
        if (playertotal > housetotal) {
            // ctx.fillText("你赢了. ", 30, 250);
            $(".playerwin").slideDown();
            bankmoney += betmoney * 2;
        } else {
            // ctx.fillText("平局!", 30, 250);
            $(".push").slideDown();
            bankmoney += betmoney;
        }
    } else {
        // ctx.fillText("你输了. ", 30, 250);
        $(".dealerwin").slideDown();
    }
    // 结果提示
    $("#tishi")[0].play();
    betmoney = 0;
    $("#bankmoney").html(bankmoney);
    $("#betmoney").html(betmoney);
    if (bankmoney == 0) {
        clearTimeout(timer);
        timer = setTimeout(anothermon(), 2000);
    }
}

// 跳出补充钱的提示
function anothermon() {
    $(".another").fadeIn();
    bankmoney=1000;
    $("#bankmoney").html(bankmoney);
    
}
//showhouse()显示庄家手中所有的牌。
function showhouse() {
    var i;
    housexp = 20;
    for (i = 0; i < hi; i++) {
        ctx.drawImage(househand[i].picture, housexp, houseyp, cardw, cardh);
        housexp = housexp + 20;
    }
}
// 重新开始按钮
function restart() {
    ctx.clearRect(0, 0, cwidth, cheight); //清屏
    pi = 0;
    hi = 0;
    playerxp = 20;
    housexp = 20;
    $(".housesum").html(0);
    $(".playersum").html(0);
    // 提示上去 
    $(".playerbust").slideUp();
    $(".dealerbust").slideUp();
    $(".playerwin").slideUp();
    $(".dealerwin").slideUp();
    $(".push").slideUp();
    // 底部操作隐藏
    $(".pukeaction").hide();
    $(".bet").show();
    // 出牌显示
    $(".deal").show();
    // bank重置
    bankmoney=1000;
    betmoney=0;
    $("#bankmoney").html(bankmoney);
    $("#betmoney").html(betmoney);

}
// 点击提示牌后
function restart2() {
    ctx.clearRect(0, 0, cwidth, cheight); //清屏
    pi = 0;
    hi = 0;
    playerxp = 20;
    housexp = 20;
    $(".housesum").html(0);
    $(".playersum").html(0);
    // 提示上去 
    $(".playerbust").slideUp();
    $(".dealerbust").slideUp();
    $(".playerwin").slideUp();
    $(".dealerwin").slideUp();
    $(".push").slideUp();
    // 底部操作隐藏
    $(".pukeaction").hide();
    $(".bet").show();
    // 出牌显示
    $(".deal").show();
    $(".another").hide();
    // bank重置
    // $("#bankmoney").html(1000);
    // $("#betmoney").html(0);
}
// 游戏开始界面
$(".play").click(function () {
    $(".start").fadeOut();
    $(".pukeaction").hide();
})
// 后退按钮，画布清空
$(".back").click(function () {
    $(".start").fadeIn();
    restart();
})
$(".deal").click(function () {
    $(".pukeaction").slideDown();
    $(".bet").hide();
    $(".deal").fadeOut();
})
// 发牌，要牌按钮按下并各自计算点数
$(".deal ,.hit,.double").click(function () {
    add_up_player();
    more_to_house();

})
// 停牌按钮按下并各自计算点数
$(".stand").click(function () {
    $(".housesum").html(housetotal);

})

// function bet(this){
//     switch($(this).attr(className)){
//         case bet25:{
//             if(bankmoney>25){
//                 betmoney+=25;
//                 bankmoney-=25;
//                 $("#bankmoney").html(bankmoney);
//                 $("#betmoney").html(betmoney);
//             }
//         };break;
//         case bet100:{
//             if(bankmoney>25){
//                 betmoney+=25;
//                 bankmoney-=25;
//                 $("#bankmoney").html(bankmoney);
//                 $("#betmoney").html(betmoney);
//             }
//         };break;
//         case bet500:{
//             if(bankmoney>25){
//                 betmoney+=25;
//                 bankmoney-=25;
//                 $("#bankmoney").html(bankmoney);
//                 $("#betmoney").html(betmoney);
//             }
//         };break;
//         case bet1000:{
//             if(bankmoney>25){
//                 betmoney+=25;
//                 bankmoney-=25;
//                 $("#bankmoney").html(bankmoney);
//                 $("#betmoney").html(betmoney);
//             }
//         };break;
//     }
// }
// 玩家钱和赌注
var betmoney = Number($("#betmoney").html());
var bankmoney = Number($("#bankmoney").html());
$(".bet25").click(function () {
    if (bankmoney >= 25) {
        betmoney += 25;
        bankmoney -= 25;
        $("#bankmoney").html(bankmoney);
        $("#betmoney").html(betmoney);
    }
})
$(".bet100").click(function () {
    if (bankmoney >= 100) {
        betmoney += 100;
        bankmoney -= 100;
        $("#bankmoney").html(bankmoney);
        $("#betmoney").html(betmoney);
    }
})
$(".bet500").click(function () {
    if (bankmoney >= 500) {
        betmoney += 500;
        bankmoney -= 500;
        $("#bankmoney").html(bankmoney);
        $("#betmoney").html(betmoney);
    }
})
$(".bet1000").click(function () {
    if (bankmoney >= 1000) {
        betmoney += 1000;
        bankmoney -= 1000;
        $("#bankmoney").html(bankmoney);
        $("#betmoney").html(betmoney);
    }
})
$(".music").click(function () {
    var bg = $("#bg")[0];
    if (bg.paused) {
        bg.play();
        $(".music").toggleClass("music2");
    } else {
        $(".music").toggleClass("music2");
        bg.pause();
    }
})
// function showSound(audioSrc) {
//     // 因为
//     $("#hint").remove();
//     var audio = $("<audio src='" + audioSrc + "' autoplay id='hint'></audio>");
//    console.log(audio);
//     audio.appendTo("body");
// }
// 音效1
$('.bet25,.bet100,.bet500,.bet1000').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/bet.mp3",
    eventType: "click" // or "click"
});
$('.bet25,.bet100,.bet500,.bet1000').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/bet.mp3",
    eventType: "click" // or "click"
});
//  音效2
$('.deal,.double,.stand,.hit').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/puke.mp3",
    eventType: "click" // or "click"
});
$('.deal,.double,.stand,.hit').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/button2.mp3",
    eventType: "hover" // or "click"
});
//  音效3
$('.playerbust,.dealerbust,.playerwin,.dealerwin').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/tishi.mp3",
    eventType: "click" // or "click"
});
$('.back,.music,.restart').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/button.mp3",
    eventType: "click" // or "click"
});
$('.play').easyAudioEffects({
    // ogg : "./path/to/sound.ogg",
    // 路径只能这样
    mp3: "audios/start.mp3",
    eventType: "click" // or "click"
});