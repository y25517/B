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

// コインとランク（今は仮状態です）
let coin=0;
let rank=1;
let soubi = {"weapon":{"id":0,"name": "檜の棒","rank":0,"atk":10.0, "desc":"何の変哲もない、ただの木の棒。とはいえ檜製なので高級感がある。", "price":1}, "armor":{"id":28,"name": "布の服","rank":0,"hp":5, "desc":"ただの布切れを縫い合わせた服。<ruby>全裸<rp>(</rp><rt>フル・フロンタル</rt><rp>)</rp></ruby>よりかはマシ。", "price":1}}
localStorage.setItem("equipped", JSON.stringify(soubi));

let selectedItem = null;

// 店主のメッセージ一覧
let message = 
{
    "welcome":[
        "おや、客か。……ふむ、悪くない目をしているな。",
        "武器を見るのか？ それとも防具か？ 命を守るか、奪うか。好きな方を選びな。",
        "ここは武器屋だ。……そう、ただの武器屋だよ。深くは気にするな。",
        "いらっしゃい。ここに来たってことは、元よりその手の運命とやらに魅入られているわけか。"
    ],
    "purchase":[
        "毎度あり。大事に使いな。",
        "いい買い物だ。それがお前の寿命を延ばしてくれるといいがな。",
        "返品は受け付けないぞ。……やられちまったら使い道もないだろうしな。",
        "契約成立だ。持って行け。",
        "ほう、それを選ぶとはな。存外に見る目はあるようだな。"
    ],
    "no_money": [
        "金が足りないな。出直してきな。",
        "冷や出しか？ 金のない奴に売る武器はないよ。",
        "おいおい、値切ろうなんて思うなよ。命の値段だぞ。",
        "ツケは効かない。ここはそういう店じゃないんだ。"
    ],
    "leave": [
        "じゃあな。また顔を見せに来いよ。",
        "外は物騒だ。背中には気をつけな。",
        "次に来る時まで、店があればいいがな。"
    ]
}

// 入店時のメッセージ表示
let messageArea = document.querySelector("#messageArea");
messageArea.innerHTML = randomPick(message.welcome, 1);

let itemDetailsArea = document.querySelector("#itemDetailsArea");
let statusDifferenceArea = document.querySelector("#statusDifferenceArea");

// 販売する装備を並べる
let itemsArea = document.querySelector("#itemsArea");
function renderItems(e) {
    let itemRank = rank;
    let weapons = randomPick(e.weapon.filter(item => item.rank == itemRank), 2);
    let armors = randomPick(e.armor.filter(item => item.rank == itemRank), 2);
    let displayItem = weapons.concat(armors);
    itemsArea.innerHTML = "";

    displayItem.forEach(i => {
        let div = document.createElement("div");
        div.className = "itemCard";
        div.innerHTML = `
            <h4>${i.name}</h4>
            <p>金額: ${i.price}</p>
            <button type="button" onclick="showDetails(${i.id})">詳細を見る</button>
        `;
        itemsArea.appendChild(div);
    });
}

// 詳細を見るボタンを押すと、装備の詳細情報を出す
function showDetails(itemId) {
    let allEqs = eqs.weapon.concat(eqs.armor);
    
    selectedItem = allEqs.find(i=>i.id==itemId);

    itemDetailsArea.classList.remove("hidden");

    // 攻撃力（ATK）が存在するかどうかで武器か防具かを判断
    if (selectedItem.atk) {
        itemDetailsArea.innerHTML=`
            <h3>${selectedItem.name}</h3>
            <p>${selectedItem.desc}</p>
            <p>攻撃力: ${selectedItem.atk}</p>
            <button type="button">購入する</button>
        `;
    } else {
        itemDetailsArea.innerHTML=`
            <h3>${selectedItem.name}</h3>
            <p>${selectedItem.desc}</p>
            <p>HP: ${selectedItem.hp}</p>
            <button type="button">購入する</button>
        `;
    }
    compareEquipment();
}

function compareEquipment() {
    let equipped = JSON.parse(localStorage.getItem("equipped"));
    let eId;
    let diff;
    statusDifferenceArea.innerHTML = "<h3>ステータス比較</h3>";
    if (selectedItem.id < 28) {
        eId = equipped.weapon.id;
        diff = (selectedItem.atk - equipped.weapon.atk);
        statusDifferenceArea.innerHTML += `
            <p>現在: ${equipped.weapon.atk}</p>
            <p>選択: ${selectedItem.atk}</p>
            <p>差分: ${diff}</p>
        `
    } else {
        eId = equipped.armor.id;
        diff = (selectedItem.hp - equipped.armor.hp);
        statusDifferenceArea.innerHTML += `
            <p>現在: ${equipped.armor.hp}</p>
            <p>選択: ${selectedItem.hp}</p>
            <p>差分: ${diff}</p>
        `;
    }
    statusDifferenceArea.classList.remove("hidden");
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