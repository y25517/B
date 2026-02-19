const JsonFile = './eq.json'

const AtcBar = document.querySelector("#atcbar"); //アタックバー
const StopBtn = document.querySelector("#stopbtn"); //ストップボタン
const StartBtn = document.querySelector("#strbtn"); //スタートボタン
// let HP =  Number(localStorage.getItem("avatarHP"));
// let ATK =  Number(localStorage.getItem("avatarATK"));
let RivalHP = 100;   //自分のHP
let MyHP = 100;     //敵のHP
let MyHP_now = 100;    //現在自分のHP
let RivalHP_now = 100;  //現在の敵のHp
let MyATK = 10;             //自分の攻撃
let RivalATK = 5;            //敵の攻撃

//戦闘開始したら
StartBtn.addEventListener("click", function(){
    StartBtn.style.display = "none";
    AtcBar.style.display = "block";
    StopBtn.style.display = "block";

    const AtcMark = document.querySelector("#atcmark");
    const StopBar = document.querySelector("#stopbar");
    let i = 0;
    let timer;

    function StopBar_move(){
        let random = Math.floor(Math.random() * 380); //1~10のランダムな数字
        AtcMark.style.left = random + "px";
        timer = setInterval(() => {
            i++;
            StopBar.style.left = i + "px";

            if(i == 396)
                i = 0;     
        }, 0);
    }
    StopBar_move();

    //ストップした場所の判定
    function isColliding(a, b) {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();

        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right
        );
    }
    

    StopBtn.addEventListener("click", function(){
        const RivalLifeMark = document.querySelector("#rival_lifemark"); //ボスの体力状態
        const MyLifeMark = document.querySelector("#my_lifemark");       //自分の体力
        let ATKTimes = Math.round((1 + Math.random() * 0.4) * 10) / 10;     //攻撃上乗せをどのくらい倍にするか

        //　ストップした位置がどこかで判定を変える
        if(isColliding(StopBar, AtcMark)) {
            ATKTimes = 1.5   
        }
        console.log(ATKTimes);
        StopBtn.style.display = "none";
        clearInterval(timer);

        // 敵の体力状態変化
        RivalHP_now = RivalHP_now - MyATK * ATKTimes;
        let RivalRate= Math.round(RivalHP_now / RivalHP * 100);
        console.log(RivalRate);

        RivalLifeMark.style.width = RivalRate + "%";

        //　敵からの反撃（自分の体力が減る）
        timer = setTimeout(() => {
            MyHP_now = MyHP_now - RivalATK;
            let MyRate = Math.round(MyHP_now / MyHP * 100);
            console.log(MyRate);

            MyLifeMark.style.width = MyRate + "%";
            StopBtn.style.display = "block";
            StopBar_move();
        }, 1000);
        if(MyHP_now < 1)
        {
            alert("あなたの負け");  
            window.location.href = 'index.html';
        }
        else  if(RivalHP_now < 1)
        {
            alert("あなたの勝ち");
            window.location.href = 'index.html';
        }
        

       
        

        
        
        // fetch(JsonFile)
        // .then(Response => {
        //     return Response.json();
        // })
        // .then(function(data){
        //     console.log(data)
        // });
    });

});

//戦闘を開始する前
function main()
{
    AtcBar.style.display = "none";
    StopBtn.style.display = "none";
}

main();