// 全ての装備をjsonファイルから取得
let eqs = [];
let url = "eq.json";
window.addEventListener("load", async () => {
    try {
        let response = await fetch(url);
        eqs = await response.json();
        renderItems(eqs);
        
    } catch (error) {
        console.log("読み込みエラー");
    }
});

// localStorageから「現在の装備」「所持している装備」「現在のランク」「現在のコイン所持数」を取得
let equipped = JSON.parse(localStorage.getItem("equipped")) || [];
let owned = JSON.parse(localStorage.getItem("owned")) || [];
let rank = parseInt(localStorage.getItem("rank")) || 0;
let coins = parseInt(localStorage.getItem("Coin")) || 0;

// 指定した時間待機する（メッセージ更新用の補助）
let sleep = (ms) => new Promise(resolve => setTimeout(resolve,ms));
let messageTxt = "";
let isProcessing = false;

// 店主のメッセージ一覧
let message = 
{
    // 入店時
    "welcome":[
        "おや、客か。……ふむ、悪くない目をしているな。",
        "武器を見るのか？ それとも防具か？ 命を守るか、奪うか。好きな方を選びな。",
        "ここは武器屋だ。……そう、ただの武器屋だよ。深くは気にするな。",
        "いらっしゃい。ここに来たってことは、元よりその手の運命とやらに魅入られているわけか。"
    ],
    
    // 購入時
    "purchase":[
        "毎度あり。大事に使いな。",
        "いい買い物だ。それがお前の寿命を延ばしてくれるといいがな。",
        "返品は受け付けないぞ。……やられちまったら使い道もないだろうしな。",
        "契約成立だ。持って行け。",
        "ほう、それを選ぶとはな。存外に見る目はあるようだな。"
    ],
    
    // 再購入を試みたとき
    "sold_out": [
        "悪いがそいつは売り切れだ。お前さんが買っちまったからな。",
        "お前さんは同じものを何度も買おうとするのか? ……本当に?"
    ],

    // コイン不足時
    "no_money": [
        "金が足りないな。出直してきな。",
        "冷やかしか？ 金のない奴に売る武器はないよ。",
        "おいおい、値切ろうなんて思うなよ。命の値段だぞ。",
        "ツケは効かない。ここはそういう店じゃないんだ。"
    ],

    // 退店時
    "leave": [
        "じゃあな。また顔を見せに来いよ。",
        "外は物騒だ。背中には気をつけな。",
        "次に来る時まで、店があればいいがな。"
    ],

    // 店主クリック時
    "chats": {
        // ランク0
        0: [
            "……サメク。あれは60を意味する。所謂ゲマトリア、というやつだな。全部集めて足せば、何かわかるかもしれないな。",
            "アヴァターラってのは昔の噂話だ。だが今は違う。人が忘れ、覚え続けた恐れが、肉を得ただけさ。",
            "死の舞踏――絵画の比喩に過ぎなかったんだが。まさか本当に人骨が狂喜乱舞して練り歩くとはな。",
            "世界が壊れてから、国境は意味を失った。恐怖も同じだ。",
            "まだ世界は浅い。恐怖は形を試している段階だ。……お前さんも、俺も、まだ試されている。"
        ],

        // ランク1
        1: [
            "ヴァーヴ。これは6だ。ひょっとしたら、AEMAETHの謎が解けるかもな。",
            "人祖の元嫁、その夜の子らが地を歩く時代か……アレに仕組まれているとて、とんだ女に引っかかったものだな。",
            "シー、ってのは妖精のことだ。ケット・シー、クー・シー、バーヴァン・シー、バン・シー……様々な美麗なるシーがいるわけだが、これらは皆没落した神々の成れの果てさ。",
            "アシャに背き、ドゥルジに随う不義者ドルグワント。それに対抗するのが義者アシャワン。だがアヴァターラの出現は、アシャ――宇宙秩序の意思そのものだ。それを考えれば、お前さんは果たしてアシャワンに相応しいと言えるのかな? ",
            "この辺りからだ。武器がただの鉄ではなくなる。お前さんの意志が、質量に干渉する。"
        ],

        // ランク2
        2: [
            "レーシュ。意味は200。言ってなかったが、ゴーレムってのは本来は人祖と同じく土塊だ。字義通りに捉えるなら、「未完成の無形」。額に刻まれた真理と死によって、主人の命令の通り動く。原罪の穢れなきアーダーム・ハ=リショーンを人工的に再現しようとするラビの傲慢、その極みだよ。",
            "古代の国家においては、過去の栄光に化石みたいなイデオロギー――そういう干からびた死装束を必死に噛み締めていた。同時に、自分の国家を豊かにするために、自国の若人を食らっていた。墓の中で自分の手足を貪るナハツェーラーとは、とかくそういうものだ。",
            "暴君というのは、二つのケースがある。一つは、本気で自分のことを疑わない元首による圧政というケース。もう一つは、後の民意がそいつを暴君にしたというケースだ。……絶対に間違わない独裁政権がないように、歴史もまた、虚偽と欺瞞のインクで編纂されているのさ。",
            "実に滑稽だろう。同じ色と形をした獣は、かたや誇りと崇められ、かたや邪悪と蔑まれる。人は赤い竜という記号の持つ一側面をそれぞれで見ているんだ。……これって、アヴァターラの縮図だとは思わないか? ",
            "ここから先は、ただの怪物じゃない。概念そのものと戦うことになる。覚悟はあるか？"
        ],

        // ランク3
        3: [
            "タヴ……その意味は400、だな。これでカバリストごっこも終いだ。意味ありげに見えて、その実、待っていたのは凡庸で大したことのない真実――AEMAETHだ。往々にしてMAETHは、これに与えられることはないだろうよ。",
            "七つの印は、劇的な崩壊によって解かれるんじゃない。利便性、効率、そして自己の正当化を、生きていく中で累積していくその中で、人と共に四騎士は来るんだよ。",
            "アエーシュマに関しては、語ることも少ない。あれは怒りそのものだ。世界大戦が七度もあれば、至極当然だな。",
            "アリフ・ラーム・ミーム……その意味は、もはや誰にも分からない。どれほど初志が高邁なものであろうと、長すぎる歳月の堆積はそこに歪みを齎す。アブラハムの教えを正確に継ぐ者がどこにも存在しないのと同じように。自然に、或いは恣意的に、複合的な要素が複雑に絡み合い、遍く事象は不可逆的な変質を起こしていくものさ。",
            "リヴァイアサンも、マハーマーラも、冥王も没した。最後に事象地平戦線に立つのは、一体誰になるんだろうな? ",
            "お前さんが勝てば、恐怖は一瞬だけ沈黙する。だが消えはしない、人がいる限り決して嵐が止むことはないんだよ。……それでも行くか、サバイバー。"
        ]
    }
}

// SEとME一覧
let sounds = {
    me: "./ME/equipment.m4a",
    se:{
        choice: {audio: Array.from({length:5}, () => new Audio("./SE/choice.mp3")), volume: 0.3},
        deal: {audio: Array.from({length:5}, () => new Audio("./SE/deal.mp3")), volume: 0.4},
        exit: {audio: Array.from({length:5}, () => new Audio("./SE/exit.mp3")), volume: 0.5},
        deny: {audio: Array.from({length:5}, () => new Audio("./SE/deny.mp3")), volume: 0.15},
        texts: {audio: Array.from({length:5}, () => new Audio("./SE/text.mp3")), volume: 0.1}
    }
}
let currentIndex = 0;
let bgm = new Audio(sounds.me);
bgm.volume = 0.5;
bgm.loop=true;
bgm.play().catch(e => console.log(e));

// 入店時のメッセージ表示、コイン表示
let messageArea = document.querySelector("#messageArea");
messageTxt = randomPick(message.welcome, 1);
updateMessage(messageTxt[0]);
updateCoins();

// 戻るボタン
let button = document.querySelector(".button-style");
button.addEventListener("click", async () => {
    messageTxt = randomPick(message.leave, 1);
    updateMessage(messageTxt[0]);
    soundEffect("exit");
    await sleep(2000);
    window.location.href = "index.html";
})

// 店主をクリックすると会話可能
let shopkeeper = document.querySelector("#shopkeeper");
shopkeeper.addEventListener("click", () => {
    messageTxt = randomPick(message.chats[rank],1);
    updateMessage(messageTxt[0]);
})

let itemDetailsArea = document.querySelector("#itemDetailsArea");
let statusDifferenceArea = document.querySelector("#statusDifferenceArea");

// 販売する装備を並べる
let itemsArea = document.querySelector("#itemsArea");
function renderItems(e) {
    let itemRank = rank;
    let weapons;
    let armors;
    // 戦闘が終了しているかどうかを判断する
    let isFought = localStorage.getItem("isFought");
    console.log(isFought);
    
    if (isFought === "true") {
        weapons = randomPick(e.weapon.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
        armors = randomPick(e.armor.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
        localStorage.setItem("isFought", "false");
    } else {
        weapons = JSON.parse(localStorage.getItem("shop_weapon"));
        armors = JSON.parse(localStorage.getItem("shop_armor"));  
    }
    localStorage.setItem("shop_weapon", JSON.stringify(weapons));
    localStorage.setItem("shop_armor", JSON.stringify(armors));
    let displayItem = weapons.concat(armors);
    itemsArea.innerHTML = "";

    displayItem.forEach(i => {
        let div = document.createElement("div");
        div.className = "itemCard";
        div.innerHTML = `
            <label onclick="showDetails(${i.id})">
            <h4>${i.name}</h4>
            <img src="./images/equipments_img/e${i.id}.JPG" alt="${i.name}" width="75rem" height="75rem">
            <p>金額: ${i.price} コイン</p>
            </label>
        `;
        itemsArea.appendChild(div);
    });
}

// 装備をクリックすると、装備の詳細情報を出す
let selectedItem = null;
function showDetails(itemId) {
    soundEffect("choice");
    let allEqs = eqs.weapon.concat(eqs.armor);
    
    selectedItem = allEqs.find(i=>i.id==itemId);

    // idの値で武器か防具かを判断
    if (selectedItem.id < 28) {
        itemDetailsArea.innerHTML=`
            <h3>${selectedItem.name}</h3>
            <p>${selectedItem.desc}</p>
            <p>攻撃力: ${selectedItem.atk}</p>
            <button type="button" onClick="buyItem()">購入する</button>
        `;
    } else {
        itemDetailsArea.innerHTML=`
            <h3>${selectedItem.name}</h3>
            <p>${selectedItem.desc}</p>
            <p>HP: ${selectedItem.hp}</p>
            <button type="button" onClick="buyItem()">購入する</button>
        `;
    }
    compareEquipment();
}

// ステータス比較
function compareEquipment() {
    let diff;
    statusDifferenceArea.innerHTML = "<h3>ステータス比較</h3>";

        if (selectedItem.id < 28) {
            console.log(equipped.weapon);
            let ew = eqs.weapon.find(w => w.id == equipped.weapon);
            if (ew == "undefined") {
                statusDifferenceArea.innerHTML += `
                    <p>選択した武器の攻撃力: ${selectedItem.atk}</p>
                    <p>攻撃力差分: ${selectedItem.atk}</p>
                `;
            } else {
                diff = (selectedItem.atk - ew.atk);
                statusDifferenceArea.innerHTML += `
                    <p>装備中の武器の攻撃力: ${ew.atk}</p>
                    <p>選択した武器の攻撃力: ${selectedItem.atk}</p>
                    <p>攻撃力差分: ${diff}</p>
                `;
            }
        } else {

            console.log(equipped.armor);
            let ea = eqs.armor.find(a => a.id == equipped.armor);
            if (ea == "undefined") {
                statusDifferenceArea.innerHTML += `
                    <p>選択した防具のHP: ${selectedItem.hp}</p>
                    <p>HP差分: ${selectedItem.hp}</p>
                `;
            } else {
                diff = (selectedItem.hp - ea.hp);
                statusDifferenceArea.innerHTML += `
                    <p>装備中の防具のHP: ${ea.hp}</p>
                    <p>選択した防具のHP: ${selectedItem.hp}</p>
                    <p>HP差分: ${diff}</p>
            `;
            }
        }
}

// 購入時の挙動
function buyItem() {
    // すでに所持しているものを購入しようとすると、売り切れ用のメッセージを表示して戻る
    for (let i = 0; i < owned.length; i++) {
        if (owned[i].id == selectedItem.id) {
            soundEffect("deny");
            messageTxt = randomPick(message.sold_out, 1);
            updateMessage(messageTxt[0]);
            return;
        }
    }

    // コインが足らなかったら専用のメッセージを表示して戻る
    if (coins<selectedItem.price) {
        soundEffect("deny");
        messageTxt = randomPick(message.no_money, 1);
        updateMessage(messageTxt[0]);
        return;
    }
    
    // コインの枚数と所持状況を更新
    coins-=selectedItem.price;
    localStorage.setItem("Coin", coins);

    owned.push(selectedItem);
    localStorage.setItem("owned", JSON.stringify(owned));
    
    soundEffect("deal");
    messageTxt = randomPick(message.purchase, 1);
    updateMessage(messageTxt[0]);
    updateCoins();
}

// コインの所持数の表示
function updateCoins() {
    let coinArea = document.querySelector(".coinArea");
    coinArea.innerHTML = `
        <p>所持コイン: ${coins}<p>
    `;
}

// 店主のメッセージ更新
async function updateMessage(mes) {
    if (isProcessing) {
        return;
    }
    let speed = 16;
    
    messageArea.textContent = "";
    isProcessing = true;
    try {
        for (let char of mes) {
            messageArea.textContent += char;
            soundEffect("texts");
            await sleep(speed);
        }
    } finally {
        isProcessing = false;
    }
}

// 配列からのランダム取得用の関数(配列と取り出したい要素の数を引数に)
function randomPick(array, n) {
    let result = [];
    let copy = [...array];
    for (let i = 0; i < n; i++) {
        let index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index,1)[0]);
    }
    return result;
}

// 効果音を鳴らす
function soundEffect(key) {
    // 指定されたキーの効果音を取得
    let pool = sounds.se[key].audio;
    let volume = sounds.se[key].volume;
    // currentindexに対応するAudioオブジェクトを取得
    let se = pool[currentIndex];
    if (se) {
        // 再生位置を0.0秒にする
        se.currentTime = 0.0;
        se.volume = volume;
        se.play().catch(e => console.log(e));
    } else {
        console.log("見つかりませんでした");
    }

    // indexを更新
    currentIndex = (currentIndex+1)%pool.length;
}