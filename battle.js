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

/*戦闘背景
--------------------------------------------------------*/
let BattleBody = document.querySelector("#battlebody");
if(type === 0)
{
    switch(rank){
        case 1:
            BattleBody.style.url = "";
            break;
    }
}
if(type === 1)
{
    switch(rank){
        case 1:
            BattleBody.style.url = "";
            break;
    }
}

/*戦闘開始
--------------------------------------------------------*/
StartBtn.addEventListener("click", async function(){
    if (!localStorage.getItem("SpaceAlert")) {
        alert("　　　【チュートリアル】\nSpaceキーでもストップできます！");
        localStorage.setItem("SpaceAlert", "true"); // 見たという目印を保存
    }
    StartBtn.style.display = "none";
    const AtcMark = document.querySelector("#atcmark");
    const AtcClitical = document.querySelector("#atcclitical");
    const StopBar = document.querySelector("#stopbar");
    let i = 0;
    let timer;
    let RivalAtk;
    let RivalHP;
    let RivalName; 
    let animationId;
    let speed = 1; // 基本のスピード

    /* 鬼畜モードか通常モードかの判定
    --------------------------------------------------------*/
    if(localStorage.getItem("kichikuon") === "on")
        StopBar.classList.add('is-kichiku');
    else if(localStorage.getItem("kichikuon") === "off")
        StopBar.classList.remove('is-kichiku');

    /* ストップバー
    -------------------------------------------------*/
    function StopBar_move() {
        let randomPos = Math.floor(Math.random() * 380);
        AtcMark.style.left = randomPos + "px";

        function update() {
            // 鬼畜モード
            if (StopBar.classList.contains('is-kichiku')) 
            {
                // 0.5%の確率でスピード変更
                if (Math.random() < 0.005) 
                { 
                    let r = Math.random();
                    
                    if (r < 0.2) {
                        speed = 0; // 20%の確率で停止
                    } else if (r < 0.4) {
                        // 20%の確率で逆走（-1.0 〜 -2.0 のスピード）
                        speed = -(1 + Math.random());
                    } else {
                        // 残り60%は正方向への加速（1.0 〜 2.0 のスピード）
                        speed = 1 + Math.random(); 
                    }
                }
                i += speed;
            } 
            else
                i += 1;

            // ループ処理（右端に行ったら左から出す）
            if (i >= 396)
                i = 0;
            else if (i < 0)
                i = 396; // 逆走

            StopBar.style.left = i + "px";
            animationId = requestAnimationFrame(update);
        }
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(update);
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
        function Stop(){
            if(StopBtn.style.display === "none") return;
            cancelAnimationFrame(animationId);
            const RivalLifeMark = document.querySelector("#rival_lifemark"); //ボスの体力状態
            const MyLifeMark = document.querySelector("#my_lifemark");       //自分の体力
            let ATKTimes = Math.round((1 + Math.random() * 0.4) * 10) / 10;     //攻撃上乗せをどのくらい倍にするか

            StopBar.classList.add('is-stop');
            
            //　ストップした位置がどこかで判定を変える
            if(isColliding(StopBar, AtcMark)) {
                ATKTimes = 1.5   
            }
            if(isColliding(StopBar, AtcClitical)) {
                console.log("clitical!!!!!!!!!");
                ATKTimes = 2.0;
            }
            StopBtn.style.display = "none";

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

            /*勝ち判定
            ---------------------------------------------*/
            if(RivalHP_now < 1)   //勝ち
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

                    switch(rank){
                        case 0:
                            message = "<ruby>\"This is the Generation of that great Leviathan, or rather (to speake more reverently) <rp>(</rp><rt>これこそが、かの偉大なりしレヴィアタンの――より畏敬の念を込めて語るならば――、</rt><rp>)</rp></ruby><br><ruby>of that Mortall God, to which wee owe under the Immortall God, our peace and defence. \"<rp>(</rp><rt>可死の神の誕生である。我らが平和と防衛を、不死の神に次いで依存するところのものである。</rt><rp>)</rp></ruby> <br>Thomas Hobbes, LEVIATHAN, OR The Matter, Forme, & Power OF A COMMON-WEALTH ECCLESIASTICALL AND CIVILL. Chap. 17, Page. 87<br>死すべき神という「恐怖」は死んだ。暴力のコモディティ化が再び始まる。<br>";
                            break;
                        case 1:
                            message = "<ruby>\"तस्स सोकपरेतस्स वीणा कच्छा अभस्सथ, ततो सो दुम्मनो यक्खो तत्थेव अन्तरधायथा ति।\"<rp>(</rp><rt>悲しみに打ちひしがれた彼の脇から、琵琶が落ちた。その意気消沈した夜叉は、その場から姿を消した。</rt><rp>)</rp></ruby> <br>Sutta Nipāta, 449<br>変化と停滞の「恐怖」は六道の何処かに転生したようだ。悟りを拒む衆生は、いずれまた別の姿で現れることだろう。<br>";
                            break;
                        case 2:
                            message = "<ruby>\"Tod! Sterben … Einz'ge Gnade! <rp>(</rp><rt>死よ!死の眠りこそ唯一の救い!</rt><rp>)</rp></ruby><br><ruby>Die schreckliche Wunde, das Gift, ersterbe, <rp>(</rp><rt>この身を穢し蝕む毒よ、</rt><rp>)</rp></ruby><br><ruby>das es zernagt, erstarre das Herz!\" <rp>(</rp><rt>我が心の臓の鼓動と共に、永久に凍てつき靜まるが良い!</rt><rp>)</rp></ruby> <br>Richard Wagner, Parsifal Act 3, Scene 2<br>死への「恐怖」は沈黙した。遍く生命は刹那ではなく、悠久を生きていくこととなる。<br>";
                            break;
                        case 3:
                            message = "<ruby>\"Putatis quia pacem veni dare in terram ? non, dico vobis, sed separationem : <rp>(</rp><rt>汝ら、我が地に平和を齎さんとして来たと思うか? 我、汝らに告ぐ、然らず、寧ろ爭いなり。</rt><rp>)</rp></ruby><br><ruby>erunt enim ex hoc quinque in domo una divisi, tres in duos, et duo in tres <rp>(</rp><rt>今より後一家に五人あらば、三人は二人、二人は三人に分かれて爭わん。</rt><rp>)</rp></ruby><br><ruby>dividentur : pater in filium, et filius in patrem suum, mater in filiam, et filia in matrem... \"<rp>(</rp><rt>父は子に、子は父に、母は娘に、娘は母に。</rt><rp>)</rp></ruby> <br>Lucas 12, 51-53<br>恐怖への「恐怖」は霧散した。されど、未だ嵐は荒野に吹き荒れる。<br>";
                            break;
                    }
                    showResult(message + "<br>Coin " + data.Boss[rank].coin + "枚獲得！");
                    document.querySelector("#coinimg").style.opacity = '0';
                    rank++;
                    if(rank > data.Boss.length - 1) //ランクを3で固定にする
                        rank = data.Boss.length - 1;
                    localStorage.setItem("rank", rank);
                }
                 return;
            }

            MyHP_now = MyHP_now - RivalAtk;
            let MyRate = Math.round(MyHP_now / MyHP * 100);
            console.log("自分のHPの状態" +MyRate);

            // 負け判定
            if(MyRate < 1)
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


            /*リザルト表示
            -----------------------------------------------------*/
            function showResult(text)
            {
                const modal = document.getElementById("resultModal");
                const resultText = document.getElementById("resultText");
                
                resultText.innerHTML = text;
                modal.style.opacity = "0";
                modal.style.display = "flex";

                setTimeout(() => {
                    modal.style.opacity = "1";
                },20);
            }
        }
        // Stopbtnを押したときの判定
        StopBtn.addEventListener("mousedown", function(){
            Stop();
        });
        // 押されたキーが「Space（スペースキー）」だったら
        document.addEventListener("keydown", function(e){
            if (e.code === "Space") {
                e.preventDefault();
                Stop();
            }
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
async function updateMessage(messageText) {
    textElement.textContent = "";

    for (let char of messageText) {
        textElement.textContent += char;
        await sleep(speed);
    }
}

// リザルトのボタンを押されたら遷移する
document.querySelector("#resultbtn").addEventListener("click", function(){
    localStorage.setItem("isFought", "true");
    window.location.href = "index.html";
})
           
//戦闘を開始する前
function main()
{
    RivalImg.style.opacity = "0";
    AtcBar.style.display = "none";
    StopBtn.style.display = "none";
}

main();


