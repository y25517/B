const JsonFile = './battle.json'                        //bttle.jsonファイルの読み込み
const AtcBar = document.querySelector("#atcbar");       //アタックバー
const StopBtn = document.querySelector("#stopbtn");     //ストップボタン
const StartBtn = document.querySelector("#strbtn");     //スタートボタン
const RivalImg = document.querySelector("#rival_img")   //敵の写真
const overlay = document.getElementById("overlay");     //ボス戦が始まる前
const textElement = document.getElementById("text");    //ボス戦が始まる前の文章
// 指定した時間待機する（メッセージ更新用の補助）
let sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
/*  現在のステータス (ランク、自分のHPと攻撃力)
----------------------------------------*/
let rank = parseInt(localStorage.getItem("rank"));                  //現在のランク
let MyHP = Math.floor(Number(localStorage.getItem("avatarHP")));    //自分のHP
let MyATK = Math.floor(Number(localStorage.getItem("avatarATK")));  //自分の攻撃力

let MyHP_now = MyHP;                            //現在自分のHP状態
let type = localStorage.getItem("RivalType");   //モブ戦かボス戦か
/*BGM
-----------------------------------------*/
// モブ戦BGM
const mobBGM = new Audio(`ME/mobuBGM${rank}.m4a`);
mobBGM.loop = true;
mobBGM.volume = 0.5;
// ボス戦BGM
const bossBGM = new Audio(`ME/bossBGM${rank}.m4a`);
bossBGM.loop = true;
bossBGM.volume = 0.6;

console.log("ランク：" +rank);
console.log("タイプ：" +type)
console.log("自分のHP:"+MyHP);
console.log("自分のATK:"+MyATK);

/*戦闘開始
--------------------------------------------------------*/
StartBtn.addEventListener("click", async function(){
    StartBtn.style.display = "none";
    const AtcMark = document.querySelector("#atcmark");
    const StopBar = document.querySelector("#stopbar");
    let i = 0;
    let timer;
    let RivalAtk;
    let RivalHP;
    let RivalName; 

    /* ストップバー
    -------------------------------------------------*/
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
    //ストップした場所の判定
    function isColliding(a, b) {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right
        );
    }
    StopBar_move();
            
    // 敵の情報を取得           
    fetch(JsonFile)
    .then(Response => {
        return Response.json();
    })
    .then(async function(data){

        //モブ敵をランダム取得
        const SameID = data.Rival.filter(rival => rival.id === rank);
        const MobuRondom = Math.floor(Math.random() * SameID.length);
        
        let Mobu = SameID[MobuRondom];
        console.log("モブ："+Mobu.name);

        if(type === "0")
        {
            RivalAtk = Mobu.atk;    //敵の攻撃力
            RivalHP = Mobu.HP;      //敵のHP
            RivalName = Mobu.name;  //敵の名前
            AtcBar.style.display = "block";
            StopBtn.style.display = "block";
            RivalImg.style.opacity = "1";
            RivalImg.src = Mobu.image;
            mobBGM.currentTime = 0; //BGM再生
            mobBGM.play();
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
            await showMessageEffect(data.Boss[rank].txt);
            bossBGM.currentTime = 0;     //BGM再生
            bossBGM.play();
            RivalAtk = data.Boss[rank].atk;   //敵の攻撃力
            RivalHP = data.Boss[rank].HP;     //敵のHP
            RivalName = data.Boss[rank].name;
            RivalImg.src = data.Boss[rank].image;
            console.log("ボスカウント：" + rank);
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

            /*勝ち負けの判定
            ---------------------------------------------*/
            if(MyRate < 1)  //負け
            {
                MyLifeMark.style.opacity = "0";
                clearTimeout(timer);
                document.querySelector("#coinimg").style.opacity = '0';
                AtcBar.style.display = "none";
                StopBtn.style.display = "none";
                if(type === "0")
                    showResult("あなたは力尽きた…");
                else if(type === "1")
                    showResult("深淵があなたを呑み込む。")
                return;
            }
            else  if(RivalHP_now < 1)   //勝ち
            {
                RivalLifeMark.style.opacity = "0";
                clearTimeout(timer);
                AtcBar.style.display = "none";
                StopBtn.style.display = "none";
                if(type === "0") //モブ
                {
                    let Coin = Number(localStorage.getItem("Coin"));
                    Coin = Coin + Number(Mobu.coin);
                    localStorage.setItem("Coin", Coin); 
                    showResult("Coin" + Number(Mobu.coin) + "枚獲得！");
                    const CoinImg = document.querySelector("#coinimg");
                    CoinImg.src = "./images/resultmoney.png";
                }   
                else if(type === "1") //ボス
                {
                    let Coin = Number(localStorage.getItem("Coin"));
                    Coin = Coin + Number(data.Boss[rank].coin);
                    localStorage.setItem("Coin", Coin);

                    let message = "";

                    // 変更by伊藤　メッセージを変更しています（現段階では一部）
                    switch(rank){
                        case 0:
                            message = "\"<ruby>This is the Generation of that great Leviathan, or rather (to speake more <br>reverently) of that Mortall God, to which wee owe under the Immortall God, <br>our peace and defence. <rp>(</rp><rt>これこそが、かの偉大なりしレヴィアタンの――より畏敬の念を込めて語るならば――、可死の神の誕生である。我らが平和と防衛を、不死の神に次いで依存するところのものである。</rt><rp>)</rp></ruby>\" <br>Thomas Hobbes, LEVIATHAN, OR The Matter, Forme, & Power OF A COMMON-WEALTH ECCLESIASTICALL AND CIVILL. Chap. 17, Page. 87<br>";
                            break;
                        case 1:
                            message = "\"<ruby>तस्स सोकपरेतस्स वीणा कच्छा अभस्सथ, ततो सो दुम्मनो यक्खो तत्थेव अन्तरधायथा ति।<rp>(</rp><rt>悲しみに打ちひしがれた彼の脇から、琵琶が落ちた。その意気消沈した夜叉は、その場から姿を消した。</rt><rp>)</rp></ruby>\" <br>Sutta Nipāta, 449";
                            break;
                        case 2:
                            message = "\"<ruby>Tod! Sterben … Einz'ge Gnade! Die schreckliche Wunde, das Gift, ersterbe, das es zernagt, erstarre das Herz! <rp>(</rp><rt>死よ!死の眠りこそ唯一の救い!この身を穢し蝕む毒よ、我が心の臓の鼓動と共に、永久に凍てつき靜まるが良い!</rt><rp>)</rp></ruby>\" <br>Richard Wagner, Parsifal Act 3, Scene 2<br>";
                            break;
                        case 3:
                            message = "「最後のボスを撃破！」<br>すべての脅威は消え去った。<br>世界に、静かな光が戻る。<br>";
                            break;
                    }

                    showResult(message + "Coin " + data.Boss[rank].coin + "枚獲得！");
                    document.querySelector("#coinimg").style.opacity = '0';
                    rank++;
                    if(rank > data.Boss.length - 1) //ランクを3で固定にする
                        rank = data.Boss.length - 1;
                    localStorage.setItem("rank", rank);
                }
            }

            /*リザルト表示
            -----------------------------------------------------*/
            function showResult(text)
            {
                const modal = document.getElementById("resultModal");
                const resultText = document.getElementById("resultText");
                
                resultText.innerHTML = text;
                modal.style.display = "flex";
            }
            // リザルトのボタンを押されたら遷移する
            document.querySelector("#resultbtn").addEventListener("click", function(){
                localStorage.setItem("isFought", "true");   // 変更by伊藤　戦闘終了を検知します
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
// ボス戦で戦闘開始ボタンを押した時の文字
async function showMessageEffect(message) 
{
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
// フェイドインとフェイドアウト関数
function fadeIn() 
{
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

// 
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


