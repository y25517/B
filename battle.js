const JsonFile = './battle.json'

const AtcBar = document.querySelector("#atcbar"); //アタックバー
const StopBtn = document.querySelector("#stopbtn"); //ストップボタン
const StartBtn = document.querySelector("#strbtn"); //スタートボタン

let rank = parseInt(localStorage.getItem("rank"));  //現在のランク
let MyHP = Math.floor(Number(localStorage.getItem("avatarHP")));   //自分のHP
let MyHP_now = MyHP;    //現在自分のHP
let MyATK = Math.floor(Number(localStorage.getItem("avatarATK")));  //自分の攻撃
let type = localStorage.getItem("RivalType");
let BossCnt = Number(localStorage.getItem("bosscnt"));  //ボスカウント

//ボスカウントがまだセットされていなければBossCntに0を代入
if (isNaN(BossCnt)) {
    BossCnt = 0;
    localStorage.setItem("bosscnt", BossCnt);
}
console.log("自分のHP:"+MyHP);
console.log("自分のATK:"+MyATK);

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
            
        // 敵の情報を取得           
        fetch(JsonFile)
        .then(Response => {
            return Response.json();
        })
        .then(function(data){
            console.log(data);

            
            let RivalAtk;
            let RivalHP;
            let RivalName;
           

            //モブ敵をランダム取得
            const SameID = data.Rival.filter(rival => rival.id === rank);
            const MobuRondom = Math.floor(Math.random() * SameID.length);
            
            let Mobu = SameID[MobuRondom];
            console.log("モブ："+Mobu.name);

            if(type === "0"){
                RivalAtk = Mobu.atk;   //敵の攻撃力
                RivalHP = Mobu.HP;     //敵のHP
                RivalName = Mobu.name;
                
                console.log("敵の攻撃力:"+RivalAtk);
                console.log("敵のHP:"+RivalHP);
                // 敵の名前を出力
                const RivalNameFrame = document.querySelector("#rival_name");
                RivalNameFrame.textContent = "敵の名前："+RivalName;
            }

            //ボスを取得           
            else if(type === "1"){
                console.log(BossCnt);
                RivalAtk = data.Boss[BossCnt].atk;   //敵の攻撃力
                RivalHP = data.Boss[BossCnt].HP;     //敵のHP
                RivalName = data.Boss[BossCnt].name;
                
                console.log("ボスの攻撃力:"+RivalAtk);
                console.log("ボスのHP:"+RivalHP);
                // ボスの名前を出力
                const RivalNameFrame = document.querySelector("#rival_name");
                RivalNameFrame.textContent = "敵の名前："+RivalName;
            }
            let RivalHP_now = RivalHP;  //現在の敵のHp
            
            //ストップボタンを押されたら
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
                console.log("敵のHP状態:"+ RivalRate);

                RivalLifeMark.style.width = RivalRate + "%";

                //　敵からの反撃（自分の体力が減る）
                timer = setTimeout(() => {
                    MyHP_now = MyHP_now - RivalAtk;
                    let MyRate = Math.round(MyHP_now / MyHP * 100);
                    console.log("自分のHPの状態" +MyRate);

                    MyLifeMark.style.width = MyRate + "%";
                    StopBtn.style.display = "block";
                    StopBar_move();
                }, 1000);

            // 勝ち負けの判定
                if(MyHP_now < 1)
                {
                    clearTimeout(timer);
                    AtcBar.style.display = "none";
                    StopBtn.style.display = "none";
                    showResult("あなたの負け");
                }
                else  if(RivalHP_now < 1)
                {
                    clearTimeout(timer);
                    AtcBar.style.display = "none";
                    StopBtn.style.display = "none";
                    if(type === "0")
                    {
                        let Coin = Number(localStorage.getItem("Coin"));
                        Coin = Coin + Number(data.Rival[MobuRondom].coin);
                        console.log("コイン"+Coin);
                        localStorage.setItem("Coin", Coin); 
                        showResult("Coin" + Number(data.Rival[MobuRondom].coin) + "枚獲得！");
                        const CoinImg = document.querySelector("#coinimg");
                        CoinImg.src = "./images/resultmoney.png";
                    }   
                    else if(type === "1")
                    {
                        BossCnt++;

                        if(BossCnt >= data.Boss.length)
                        {
                            BossCnt = 0;
                        }
                        localStorage.setItem("bosscnt", BossCnt);

                        let Coin = Number(localStorage.getItem("Coin"));
                        Coin = Coin + Number(data.Rival[MobuRondom].coin);
                        console.log("コイン"+Coin);
                        localStorage.setItem("Coin", Coin); 
                        showResult("Coin" + Number(data.Rival[MobuRondom].coin) + "枚獲得！");
                        const CoinImg = document.querySelector("#coinimg");
                        CoinImg.src = "./images/resultmoney.png";
                    }

                    // リザルト表示
                    function showResult(text)
                    {
                        const modal = document.getElementById("resultModal");
                        const resultText = document.getElementById("resultText");
                      
                        resultText.textContent = text;
                        modal.style.display = "flex";
                    }
                    // リザルトのボタンを押されたら遷移する
                    document.querySelector("#resultbtn").addEventListener("click", function(){
                        window.location.href = "index.html";
                        document.getElementById("resultModal").style.display = "none";
                    })
                }
            });
        });

});

//戦闘を開始する前
function main()
{
    AtcBar.style.display = "none";
    StopBtn.style.display = "none";
}

main();

