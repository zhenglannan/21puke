var LOADER_WIDTH = 500;
var percentLoaded = 0; //注意这是百分比
var loaderBar = new createjs.Shape();
var Bar = new createjs.Shape();
// var image = new Image();
// image.src = "../images/load.png";
// var bitmap = new createjs.Bitmap(image);
var stage;

//  function init() {
//      stage = new createjs.Stage("myca");
//      buildLoaderBar(); //创建加载条
//      startLoad(); //用定时器累加加载条长度
//      createjs.Ticker.setFPS(60);
//      createjs.Ticker.addEventListener("tick", stage);
//  }
function buildLoaderBar() {
    // bitmap.x=canvas.width-bitmap.getBounds().width>>1;
    // bitmap.y=canvas.height-bitmap.getBounds().height>>1;
    loaderBar.graphics.beginFill('#ffffff')
        // 绘制复杂的带圆角矩形
        .drawRect(0, 100, LOADER_WIDTH, 10).endFill();
    loaderBar.x = loaderBar.y = (stage.canvas.width / 2) - (LOADER_WIDTH / 2);
    Bar.graphics.setStrokeStyle(2)
        .beginStroke("#2da1db")
        .drawRect(0, 100, LOADER_WIDTH, 10).endStroke();
    Bar.x = Bar.y = (stage.canvas.width / 2) - (LOADER_WIDTH / 2);
    // 先进度条设为0
    loaderBar.scaleX = 0;
    // 先加载进度条，后加载边框就不会被覆盖
    stage.addChild(loaderBar, Bar);
}

function startLoad() {
    createjs.Tween.get(loaderBar)
        .to({
            // x轴缩放为1，填满
            scaleX: 1
        }, 1000);

}