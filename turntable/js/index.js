// 检查移动设备
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true: false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true: false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true: false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true: false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

var turnWheel = {
    rewardNames:[],				
    colors:[],					
    outsideRadius:192,			
    textRadius:155,				
    insideRadius:68,		
    startAngle:0,				
    bRotate:false			
};

var imgQb = new Image();
imgQb.src = "~/../images/qb.png";
var imgSorry = new Image();
imgSorry.src = "~/../images/2.png";

$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: "~/../json/data.json",
        data: null,
        async:false,
        dataType:"json", 
        success: function(data){
            turnWheel.rewardNames = data["rewardNames"];
            turnWheel.colors = data["colors"];
        },
        error: function(data){
            alert("数据提取错误");
            $("#tip").text("请求数据失败");
        }
    });
    

/*    turnWheel.rewardNames = [
        "奖品1（0%）",
        "奖品2（25%）",
        "奖品3（25%）",
        "奖品4（25%）",
        "奖品5（25%）"];
    turnWheel.colors = [
        "#feeec4",
        "#FFFFFF",
        "#fdf6e5",
        "#FFFFFF",
        "#fdf6e5"];*/


    var rotateFunc = function (item, tip,count){
        var baseAngle = 360 / count;
        angles = 360 * 3 / 4 - ( item * baseAngle) - baseAngle / 2;
        $('#wheelCanvas').stopRotate();
        $('#wheelCanvas').rotate({
            angle:0,
            animateTo:angles + 360 * 5, 
            duration:8000,
            callback:function (){ 
                $("#tip").text(tip);
                turnWheel.bRotate = !turnWheel.bRotate;
                /*if(isMobile.any()){
                    window.location.href = "turntable://test.com?"+ "index=" + item +"&tip=" + tip ;
                }*/
            }
        });
    };

    $('.pointer').click(function (){
        // 正在转动，直接返回
        if(turnWheel.bRotate) return;

        turnWheel.bRotate = !turnWheel.bRotate;
        var count = turnWheel.rewardNames.length;
        var item = randomNum(1,count);
        rotateFunc(item, turnWheel.rewardNames[item],count);
    });

});

function randomNum(n, m){
    var random = Math.floor(Math.random()*(m-n)) + n;
    return random;
}



function drawWheelCanvas(){
    var canvas = document.getElementById("wheelCanvas");
    var baseAngle = Math.PI * 2 / (turnWheel.rewardNames.length);
    var ctx=canvas.getContext("2d");

    var canvasW = canvas.width;
    var canvasH = canvas.height; 
   
    ctx.clearRect(0,0,canvasW,canvasH);
    ctx.strokeStyle = "#FFBE04";
    ctx.font = '16px Microsoft YaHei';

    for(var index = 0 ; index < turnWheel.rewardNames.length ; index++){
        var angle = turnWheel.startAngle + index * baseAngle;

        ctx.fillStyle = turnWheel.colors[index];
        ctx.beginPath();
        ctx.arc(canvasW * 0.5, canvasH * 0.5, turnWheel.outsideRadius, angle, angle + baseAngle, false);
        ctx.arc(canvasW * 0.5, canvasH * 0.5, turnWheel.insideRadius, angle + baseAngle, angle, true);
        ctx.stroke();
        ctx.fill();
        ctx.save();
        ctx.fillStyle = "#E5302F";

        var rewardName = turnWheel.rewardNames[index];
        var line_height = 17;
        var translateX =  canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * turnWheel.textRadius;
        var translateY =  canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * turnWheel.textRadius;

        ctx.translate(translateX,translateY);
        ctx.rotate(angle + baseAngle / 2 + Math.PI / 2);
        ctx.fillText(rewardName, -ctx.measureText(rewardName).width / 2, 0);
       
        /*if(rewardName.indexOf("0%")>0){
            imgQb.onload=function(){
                ctx.drawImage(imgQb,-15,10);
            };
            ctx.drawImage(imgQb,-15,10);

        }else if(rewardName.indexOf("25%")>=0){
            imgSorry.onload=function(){
                ctx.drawImage(imgSorry,-15,10);
            };
            ctx.drawImage(imgSorry,-15,10);
        }*/
        ctx.restore();
    }
}
window.onload=function(){
    drawWheelCanvas();
};