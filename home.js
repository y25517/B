// home.js

const Jsonfile = "./eq.json";

  if (!localStorage.getItem("maxRank")) {
    localStorage.setItem("maxRank", localStorage.getItem("rank") || 0);
  }

//初期装備
  if (!localStorage.getItem("owned")) {
    const starterItems = [
      { id: 0 },     // 檜の棒
      { id: 28 }    // 布の服
    ];
    localStorage.setItem("owned", JSON.stringify(starterItems));
  }

  /* =============================
     初期設定（ランク・コイン）
  ============================== */

  if (!localStorage.getItem("isDone")) {
    localStorage.setItem("rank", 0);
    localStorage.setItem("isDone", JSON.stringify(true));
  }

  if (!localStorage.getItem("isFought")) {
    localStorage.setItem("isFought", "true");  // 変更by伊藤　戦闘終了検知のキーがセットされてなかった場合の初期設定(true)
  }
  const rankSelect = document.getElementById("rank-select");

  

// // 保存されているランクを反映
// const currentRank = Number(localStorage.getItem("rank"));
// const maxRank = Number(localStorage.getItem("maxRank"));

// // いったん中身を空にする
// rankSelect.innerHTML = "";

// // 0〜maxRankまで追加
// for (let i = 0; i <= maxRank; i++) {
//   const option = document.createElement("option");
//   option.value = i;
//   option.textContent = i;
//   rankSelect.appendChild(option);
// }

// // 現在選択中のランクを反映
// rankSelect.value = currentRank;

rankSelect.value = localStorage.getItem("rank");

// 変更されたら保存
rankSelect.addEventListener("change", () => {
  localStorage.setItem("rank", rankSelect.value);
  updateStatus();
});

  const owned = JSON.parse(localStorage.getItem("owned")) || [];
  console.log("owned:", owned);

  let CoinNow = Number(localStorage.getItem("Coin"));
  if (isNaN(CoinNow) || CoinNow <= 0) {
    CoinNow = 0;
    localStorage.setItem("Coin", CoinNow);
  }

  document.querySelector("#coin-count").textContent =
    localStorage.getItem("Coin");

/*タイトル画面
--------------------------------------------------------*/
const titleScreen = document.querySelector("#title_screen");
const homeBody = document.querySelector("#home_body");
const hajimeBtn = document.querySelector("#hajimebtn");
const tudukiBtn = document.querySelector("#tudukibtn");
const ha_dokoaBtn = document.querySelector("#ha-dokoabtn");

function start(){
  titleScreen.style.display = "none";
  homeBody.style.display = "block";
}

hajimeBtn.addEventListener("click", () => {
  const isReset = reset();
  if(isReset){
    console.log("リセット");
    start();
  }
});
tudukiBtn.addEventListener("click", start);


/*ホーム画面の背景
--------------------------------------------------------*/


const newImageUrl = `url('images/home_background/home${rankSelect.value}.jpg')`;
console.log("読み込む画像のパス:", newImageUrl);
homeBody.style.setProperty('--bg-image', newImageUrl);

document.addEventListener("DOMContentLoaded", async () => {
  


  /* =============================
     ページ遷移系
  ============================== */

  document.getElementById("rival").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("RivalType", 0);
    window.location.href = "battle.html";
  });

  document.getElementById("boss").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("RivalType", 1);
    window.location.href = "battle.html";
  });

  document.getElementById("soubi").addEventListener("click", () => {
    window.location.href = "equipment.html";
  });


  /* =============================
     装備プルダウン取得
  ============================== */

  const weaponSelect = document.getElementById("weaponpuru");
  const armorSelect  = document.getElementById("armorpuru");

  const weaponImg = document.getElementById("weaponimg");
  const armorImg  = document.getElementById("armorimg");

  const avatarWeapon = document.getElementById("avatarWeapon");
  const avatarArmor  = document.getElementById("avatarArmor");


  /* =============================
     所持装備のみ表示　　一時的にここコメントアウトしてます　用が終わったら直します　廣田
  ============================== */

  Array.from(weaponSelect.options).forEach(option => {
    if (!owned.some(o => o.id == option.value)) {
      option.remove();
    }
  });

  Array.from(armorSelect.options).forEach(option => {
    if (!owned.some(o => o.id == option.value)) {
      option.remove();
    }
  });


  /* =============================
     保存済み装備復元
  ============================== */

  const savedEquip = JSON.parse(localStorage.getItem("equipped"));
  if (savedEquip) {
    weaponSelect.value = savedEquip.weapon;
    armorSelect.value  = savedEquip.armor;
  }


  /* =============================
     eq.json読み込み
  ============================== */

  const response = await fetch(Jsonfile);
  const data = await response.json();


  /* =============================
     ステータス更新処理
  ============================== */

  const HP_BASE  = 100;
  const ATK_BASE = 0;

  function updateStatus() {

    const weaponId = Number(weaponSelect.value);
    const armorId  = Number(armorSelect.value);

    const weapon = data.weapon.find(w => w.id === weaponId);
    const armor  = data.armor.find(a => a.id === armorId);

    const totalATK = ATK_BASE + (weapon ? weapon.atk : 0);
    const totalHP  = HP_BASE  + (armor  ? armor.hp  : 0);

    document.getElementById("hp").textContent = totalHP;
    document.getElementById("kougeki").textContent = totalATK;

    // 横の装備画像変更
    weaponImg.src = `./images/equipments_img/e${weaponId}.JPG`;
    armorImg.src  = `./images/equipments_img/e${armorId}.JPG`;

    const avatar = document.getElementById("avatarComplete");

avatar.src = `./images/wear_img/a${armorId}_w${weaponId}-removebg-preview.png`;  //ここでアバターの画像を装備に合わせて変更してます。wear_imgに画像が全部あります。ぉーかるストレージにはまだ入れてないです。
localStorage.setItem("avatarimg", avatar.src);  //笹森加えたとこ

    localStorage.setItem("avatarHP", totalHP);
    localStorage.setItem("avatarATK", totalATK);

    localStorage.setItem("equipped", JSON.stringify({
      weapon: weaponId,
      armor: armorId
    }));
  }

  updateStatus();

  weaponSelect.addEventListener("change", updateStatus);
  armorSelect.addEventListener("change", updateStatus);


  /* =============================
     プルダウン開閉処理
  ============================== */

  weaponImg.addEventListener("click", (e) => {
    e.stopPropagation();
    weaponSelect.classList.toggle("active");
    armorSelect.classList.remove("active");
  });

  armorImg.addEventListener("click", (e) => {
    e.stopPropagation();
    armorSelect.classList.toggle("active");
    weaponSelect.classList.remove("active");
  });

  document.addEventListener("click", () => {
    weaponSelect.classList.remove("active");
    armorSelect.classList.remove("active");
  });

});

// // 武器防具微調整
// const avatar = document.getElementById("avatarComplete");

// avatar.src = `./images/wear_img/a${armorId}_w${weaponId}.png`;

/* 鬼畜ボタンを押したら
--------------------------------------------------------*/
const kichikuBtn = document.querySelector("#kichikubtn");
if(!localStorage.getItem("kichikuon"))
{
  localStorage.setItem("kichikuon", "off");
}
// ホームページ表示の参照
if(localStorage.getItem("kichikuon") === "on")
  kichikuBtn.textContent = "鬼畜モード";
else if(localStorage.getItem("kichikuon") === "off")
  kichikuBtn.textContent = "通常モード";
//  鬼畜モードか通常モードかの判定
kichikuBtn.addEventListener("click", function(){
    if(localStorage.getItem("kichikuon") === "on")
    {
      localStorage.setItem("kichikuon", "off");
      kichikuBtn.textContent = "通常モード";
    }
    else
    {
      localStorage.setItem("kichikuon","on");
      kichikuBtn.textContent = "鬼畜モード";
    }  
});

// リセット
function reset(){
  let msg = "本当にリセットしますか？";
  let res = confirm(msg);
  if (res) {
    localStorage.removeItem("Coin");
    localStorage.removeItem("avatarATK");
    localStorage.removeItem("avatarHP");
    localStorage.removeItem("avatarimg");
    localStorage.removeItem("equipped");
    localStorage.removeItem("isDone");
    localStorage.removeItem("isFought");
    localStorage.removeItem("kichikuon");
    localStorage.removeItem("maxRank");
    localStorage.removeItem("owned");
    localStorage.removeItem("rank");
    alert("リセットしました");
    return true;
  }
  else{
    alert("リセットしませんでした。")
    return false;
  }
}