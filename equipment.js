// localStorageから「現在の装備」「所持している装備」「現在のランク」「現在のコイン所持数」を取得
let equipped = JSON.parse(localStorage.getItem("equipped")) || {};
let owned = JSON.parse(localStorage.getItem("owned")) || [];
let rank = parseInt(localStorage.getItem("rank")) || 0;
let coins = parseInt(localStorage.getItem("Coin")) || 0;
// 指定した時間待機する（メッセージ更新用の補助）
let sleep = (ms) => new Promise(resolve => setTimeout(resolve,ms));
// メッセージリセット
let messageTxt = "";

// メッセージ更新用の関数が実行中かを検知する
let isProcessing = false;

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
soundEffect("exit");
// BGMを鳴らしておく
let bgm = new Audio(sounds.me);
bgm.volume = 0.5;
bgm.loop=true;
bgm.play().catch(e => console.log(e));

// 全ての装備と店主のメッセージをjsonファイルから同時に取得
let eqs = [];
let msg = [];
let urlEqs = "eq.json";
let urlMsg = "msg.json";
let welcomeMsg, purchaseMsg, soldOutMsg, noMoneyMsg, leaveMsg, chatsMsg;
let selectedItem = null;
// メッセージ表示、装備詳細表示、ステータス比較表示、商品表示、戻るボタン、店主のDOM取得用の変数を用意しておく
let messageArea, itemDetailsArea, statusDifferenceArea, itemsArea, button, shopkeeper;
window.addEventListener("load", async () => {
    try {
        
        let [responseEqs, responseMsg] = await Promise.all([
            fetch(urlEqs),
            fetch(urlMsg)
        ]);

        eqs = await responseEqs.json();
        msg = await responseMsg.json();
        
        welcomeMsg = msg.welcome;
        purchaseMsg = msg.purchase;
        soldOutMsg = msg.sold_out;
        noMoneyMsg = msg.no_money;
        leaveMsg = msg.leave;
        chatsMsg = msg.chats;

        messageArea = document.querySelector("#messageArea");
        button = document.querySelector(".button-style");
        itemsArea = document.querySelector("#itemsArea");
        itemDetailsArea = document.querySelector("#itemDetailsArea");
        statusDifferenceArea = document.querySelector("#statusDifferenceArea");
        shopkeeper = document.querySelector("#shopkeeper");

        // 入店時のメッセージ表示、コイン表示
        messageTxt = randomPick(welcomeMsg, 1);
        updateMessage(messageTxt[0]);
        updateCoins();

        renderItems(eqs);

        // 戻るボタンの挙動
        button.addEventListener("click", async () => {
            messageTxt = randomPick(leaveMsg, 1);
            updateMessage(messageTxt[0]);
            soundEffect("exit");
            await sleep(2000);
            window.location.href = "index.html";
        })

        // 店主をクリックすると会話可能
        shopkeeper.addEventListener("click", () => {
            messageTxt = randomPick(chatsMsg[rank], 1);
            updateMessage(messageTxt[0]);
        });

    } catch (error) {
        console.log("読み込みエラー");
    }
});

// 販売する装備を並べる
function renderItems(e) {
    let itemRank = rank;
    let weapons;
    let armors;
    // 戦闘が終了しているかどうかを判断する
    let isFought = localStorage.getItem("isFought");
    // 戦闘を終えた後なら、新しく仕入れる
    if (isFought === "true") {
        weapons = randomPick(e.weapon.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
        armors = randomPick(e.armor.filter(item => item.rank <= itemRank && !owned.some(o => o.id == item.id)), 2);
        localStorage.setItem("isFought", "false");
    } else {
        weapons = JSON.parse(localStorage.getItem("shop_weapon")) || [];
        armors = JSON.parse(localStorage.getItem("shop_armor"))  || [];  
    }
    localStorage.setItem("shop_weapon", JSON.stringify(weapons));
    localStorage.setItem("shop_armor", JSON.stringify(armors));

    // weaponsにarmorsを結合したものを商品として並べる
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
            <button type="button" class="buy_button" onClick="buyItem()">購入する</button>
        `;
    } else {
        itemDetailsArea.innerHTML=`
            <h3>${selectedItem.name}</h3>
            <p>${selectedItem.desc}</p>
            <p>HP: ${selectedItem.hp}</p>
            <button type="button" class="buy_button" onClick="buyItem()">購入する</button>
        `;
    }
    compareEquipment();
}

// ステータス比較
function compareEquipment() {
    let diff;
    statusDifferenceArea.innerHTML = "<h3>ステータス比較</h3>";

    // こちらでもidで武器か防具かを判断
    if (selectedItem.id < 28) {
        let ew = eqs.weapon.find(w => w.id == equipped.weapon);
        if (!ew) {
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
        let ea = eqs.armor.find(a => a.id == equipped.armor);
        if (!ea) {
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
    let buyBtn = document.querySelector(".buy_button");
    // すでに所持しているものを購入しようとすると、売り切れ用のメッセージを表示して戻る あとボタンも震える
    for (let i = 0; i < owned.length; i++) {
        if (owned[i].id == selectedItem.id) {
            buyBtn.classList.remove("isShaking");
            void buyBtn.offsetWidth;
            buyBtn.classList.add("isShaking");
            soundEffect("deny");
            messageTxt = randomPick(soldOutMsg, 1);
            updateMessage(messageTxt[0]);
            return;
        }
    }

    // コインが足らなかったら専用のメッセージを表示して戻る　あとボタンも震える
    if (coins<selectedItem.price) {
        buyBtn.classList.remove("isShaking");
        void buyBtn.offsetWidth;
        buyBtn.classList.add("isShaking");
        soundEffect("deny");
        messageTxt = randomPick(noMoneyMsg, 1);
        updateMessage(messageTxt[0]);
        return;
    }
    
    // コインの枚数と所持状況を更新
    coins-=selectedItem.price;
    localStorage.setItem("Coin", coins);

    owned.push(selectedItem);
    localStorage.setItem("owned", JSON.stringify(owned));
    
    soundEffect("deal");
    messageTxt = randomPick(purchaseMsg, 1);
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
    // 実行中ならそのまま戻る
    if (isProcessing) {
        return;
    }
    // 一文字表示するのにかかる時間(ms)
    let speed = 16;
    
    messageArea.textContent = "";
    isProcessing = true;
    // 何かしら不具合があろうと、必ずisProcessingを偽にする(実行していないことを示す)
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