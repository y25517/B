const JsonFile = './eq.json'


const AtackBtn = document.querySelector("#atcbar"); //アタックボタン
const StopBtn = document.querySelector("#stopbtn"); //ストップボタン
const StartBtn = document.querySelector("#strbtn"); //スタートボタン
import {HP,ATK} from './home.js';
let BossHP = 500;

//戦闘開始したら
StartBtn.addEventListener("click", function(){
    StartBtn.style.display = "none";
    AtackBtn.style.display = "block";
    StopBtn.style.display = "block";

    const AtcMark = document.querySelector("#atcmark");
    const StopBar = document.querySelector("#stopbar");
    let i = 0;
    let timer;

    let random = Math.floor(Math.random() * 380); //1~10のランダムな数字
    AtcMark.style.left = random + "px";

    function StopBar_move(){
        timer = setInterval(() => {
            i++;
            StopBar.style.left = i + "px";

            if(i == 396)
            {
                i = 0;     
            }
        }, 0);
    }
    StopBar_move();

    StopBtn.addEventListener("click", function(){
        StopBtn.style.display = "none";
        clearInterval(timer);

        console.log(HP);
        console.log(ATK);

        const RivalBar = document.querySelector("#rivalbar");
        const RivalLifeMark = document.querySelector("#rival_lifemark");

        BossHP = BossHP - ATK;
        RivalLifeMark.style.width = BossHP + "px";

        
        
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
    AtackBtn.style.display = "none";
    StopBtn.style.display = "none";
}

main();