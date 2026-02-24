const JsonFile = './battle.json'

const AtcBar = document.querySelector("#atcbar"); //アタックバー
const StopBtn = document.querySelector("#stopbtn"); //ストップボタン
const StartBtn = document.querySelector("#strbtn"); //スタートボタン
const RivalImg = document.querySelector("#rival_img")   //敵の写真
const overlay = document.getElementById("overlay");
const textElement = document.getElementById("text");
// 指定した時間待機する（メッセージ更新用の補助）
let sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
let rank = parseInt(localStorage.getItem("rank")); //現在のランク
let MyHP = Math.floor(Number(localStorage.getItem("avatarHP")));   //自分のHP
let MyHP_now = MyHP;    //現在自分のHP

let MyATK = Math.floor(Number(localStorage.getItem("avatarATK")));  //自分の攻撃
let type = localStorage.getItem("RivalType");
let BossCnt = Number(localStorage.getItem("bosscnt"));  //ボスカウント

console.log("ランク：" +rank);
console.log("タイプ：" +type)

//ボスカウントがまだセットされていなければBossCntに0を代入
if (isNaN(BossCnt)) {
    BossCnt = 0;
    localStorage.setItem("bosscnt", BossCnt);
}
console.log("自分のHP:"+MyHP);
console.log("自分のATK:"+MyATK);

//戦闘開始したら
StartBtn.addEventListener("click", async function(){
    StartBtn.style.display = "none";

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
        .then(async function(data){
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
                RivalAtk = Mobu.atk;    //敵の攻撃力
                RivalHP = Mobu.HP;      //敵のHP
                RivalName = Mobu.name;  //敵の名前

                AtcBar.style.display = "block";
                StopBtn.style.display = "block";
                RivalImg.style.opacity = "1";

                RivalImg.src = Mobu.image;
                console.log("モブのimgタグ" + Mobu.image)
                console.log("敵の攻撃力:"+RivalAtk);
                console.log("敵のHP:"+RivalHP);
                // 敵の名前を出力
                const RivalNameFrame = document.querySelector("#rival_name");
                RivalNameFrame.textContent = "敵の名前："+RivalName;

            }

            //ボスを取得           
            else if(type === "1")
            {
                await showMessageEffect(data.Boss[BossCnt].txt);
                console.log("ボスカウント：" + BossCnt);
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
                StopBtn.style.display = "none";
                clearInterval(timer);

                // 敵の体力状態変化
                RivalHP_now = RivalHP_now - MyATK * ATKTimes;
                let RivalRate= Math.round(RivalHP_now / RivalHP * 100);
                console.log("敵のHP状態:"+ RivalRate);
                RivalLifeMark.style.width = RivalRate + "%";

                if(RivalRate >= 70) // 体力状態の色の変化
                    RivalLifeMark.style.backgroundColor = "limegreen";
                else if(RivalRate > 20)
                    RivalLifeMark.style.backgroundColor = "yellow";    
                else
                    RivalLifeMark.style.backgroundColor = "red";

                MyHP_now = MyHP_now - RivalAtk;
                let MyRate = Math.round(MyHP_now / MyHP * 100);
                console.log("自分のHPの状態" +MyRate);
                //　敵からの反撃（少し時間がたってから自分の体力が減る）
                timer = setTimeout(() => {
                    if(MyRate >= 70) // 体力状態の色の変化
                        MyLifeMark.style.backgroundColor = "limegreen";
                    else if(MyRate > 20)
                        MyLifeMark.style.backgroundColor = "yellow";    
                    else
                        MyLifeMark.style.backgroundColor = "red";

                    MyLifeMark.style.width = MyRate + "%";
                    StopBtn.style.display = "block";
                    StopBar_move();
                }, 1000);
            // 勝ち負けの判定
                if(MyRate < 1)
                {
                    MyLifeMark.style.opacity = "0";
                    clearTimeout(timer);
                    document.querySelector("#coinimg").style.opacity = '0';
                    AtcBar.style.display = "none";
                    StopBtn.style.display = "none";
                    if(type === "0")
                    {
                    showResult("あなたは力尽きた…");
                    }
                    if(type === "1")
                    {
                    showResult("深淵があなたを呑み込む。")
                    }
                    return;
                }
                else  if(RivalHP_now < 1)
                {
                    RivalLifeMark.style.opacity = "0";
                    clearTimeout(timer);
                    AtcBar.style.display = "none";
                    StopBtn.style.display = "none";
                    if(type === "0")
                    {
                        let Coin = Number(localStorage.getItem("Coin"));
                        Coin = Coin + Number(data.Rival[MobuRondom].coin);
                        localStorage.setItem("Coin", Coin); 
                        showResult("Coin" + Number(data.Rival[MobuRondom].coin) + "枚獲得！");
                        const CoinImg = document.querySelector("#coinimg");
                        CoinImg.src = "./images/resultmoney.png";
                    }   
                    else if(type === "1")
                    {
                        BossCnt++;
                        rank++;
                        localStorage.setItem("rank", rank);
                        if(BossCnt >= data.Boss.length)
                        {
                            BossCnt = 0;
                        }
                        localStorage.setItem("bosscnt", BossCnt);

                        let Coin = Number(localStorage.getItem("Coin"));
                        Coin = Coin + Number(data.Boss[BossCnt-1].coin);
                        localStorage.setItem("Coin", Coin); 
                        showResult("Coin" + Number(data.Rival[MobuRondom].coin) + "枚獲得！");
                        const CoinImg = document.querySelector("#coinimg");
                        CoinImg.src = "./images/resultmoney.png";
                    }
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
                return;
            });
        });

});

//　ボスのメッセージ
const speed = 15;
const afterDelay = 1500;
const fadeDuration = 2000;


async function showMessageEffect(message) {
    StartBtn.disabled = true;

    try {
        await fadeIn();
        await updateMessage(message);
        await sleep(afterDelay);
        await fadeOut();
    } catch (err) {
        console.error(err);
    } finally {
        StartBtn.disabled = false;
    }
}

function fadeIn() {
    return new Promise(resolve => {
        overlay.style.opacity = "1";
        setTimeout(resolve, fadeDuration);
    });
}

function fadeOut() {
    return new Promise(resolve => {
        overlay.style.opacity = "0";

        setTimeout(() => {
            AtcBar.style.display = "block";
            StopBtn.style.display = "block";
            RivalImg.style.opacity = "1";
            textElement.textContent = "";
            resolve();
        }, fadeDuration);
    });
}

async function updateMessage(messageText) {
    textElement.textContent = "";

    for (let char of messageText) {
        textElement.textContent += char;
        await sleep(speed);
    }
}

//戦闘を開始する前
function main()
{
    RivalImg.style.opacity = "0";
    AtcBar.style.display = "none";
    StopBtn.style.display = "none";
}

main();


