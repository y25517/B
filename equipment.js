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
    ]
}

// SEとME一覧
let sounds = {
    me:{},
    se:{
        texts: Array.from({length:5}, () => new Audio("./SE/text.mp3"))
    }
}
let currentIndex = 0;

// 入店時のメッセージ表示、コイン表示
let messageArea = document.querySelector("#messageArea");
messageTxt = randomPick(message.welcome, 1);
updateMessage(messageTxt[0]);
updateCoins();

let button = document.querySelector(".button-style");
button.addEventListener("click", async () => {
    messageTxt = randomPick(message.leave, 1);
    updateMessage(messageTxt[0]);
    await sleep(1000);
    window.location.href = "index.html";
})

let itemDetailsArea = document.querySelector("#itemDetailsArea");
let statusDifferenceArea = document.querySelector("#statusDifferenceArea");

// 販売する装備を並べる
let itemsArea = document.querySelector("#itemsArea");
function renderItems(e) {
    let itemRank = rank;
    
    let weapons = randomPick(e.weapon.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
    let armors = randomPick(e.armor.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
    let displayItem = weapons.concat(armors);
    itemsArea.innerHTML = "";

    displayItem.forEach(i => {
        let div = document.createElement("div");
        div.className = "itemCard";
        div.innerHTML = `
            <h4>${i.name}</h4>
            <img src="./images/equipments_img/e${i.id}.JPG" alt="${i.name}" width="75rem" height="75rem">
            <p>金額: ${i.price} コイン</p>
            <button type="button" onclick="showDetails(${i.id})" class="showDetails">詳細を見る</button>
        `;
        itemsArea.appendChild(div);
    });
}

// 詳細を見るボタンを押すと、装備の詳細情報を出す
let selectedItem = null;
function showDetails(itemId) {
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
    console.log(equipped);

        if (selectedItem.id < 28) {
            if (equipped.weapon = "") {
                statusDifferenceArea.innerHTML += `
                    <p>選択した武器の攻撃力: ${selectedItem.atk}</p>
                    <p>攻撃力差分: ${selectedItem.atk}</p>
                `;
            } else {
                diff = (selectedItem.atk - equipped.weapon.atk);
                statusDifferenceArea.innerHTML += `
                    <p>装備中の武器の攻撃力: ${equipped.weapon.atk}</p>
                    <p>選択した武器の攻撃力: ${selectedItem.atk}</p>
                    <p>攻撃力差分: ${diff}</p>
                `;
            }
        } else {
            if (equipped.armor == "") {
                statusDifferenceArea.innerHTML += `
                    <p>選択した防具のHP: ${selectedItem.hp}</p>
                    <p>HP差分: ${selectedItem.hp}</p>
                `;
            } else {
                diff = (selectedItem.hp - equipped.armor.hp);
                statusDifferenceArea.innerHTML += `
                    <p>装備中の防具のHP: ${equipped.armor.hp}</p>
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
            messageTxt = randomPick(message.sold_out, 1);
            updateMessage(messageTxt[0]);
            return;
        }
    }

    // コインが足らなかったら専用のメッセージを表示して戻る
    if (coins<selectedItem.price) {
        messageTxt = randomPick(message.no_money, 1);
        updateMessage(messageTxt[0]);
        return;
    }
    
    // コインの枚数と所持状況を更新
    coins-=selectedItem.price;
    localStorage.setItem("Coin", coins);

    owned.push(selectedItem);
    localStorage.setItem("owned", JSON.stringify(owned));
    
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
    let speed = 15;
    
    messageArea.textContent = "";

    for (let char of mes) {
        messageArea.textContent += char;
        soundEffect("texts");
        await sleep(speed);
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
    let pool = sounds.se[key];

    // currentindexに対応するAudioオブジェクトを取得
    let se = pool[currentIndex];
    if (se) {
        // 再生位置を0.0秒にする
        se.currentTime = 0.0;
        se.play().catch(e => console.log(e));
    } else {
        console.log("見つかりませんでした");
    }

    // indexを更新
    currentIndex = (currentIndex+1)%pool.length;
}