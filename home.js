// home.js

const Jsonfile = "./eq.json";

document.addEventListener("DOMContentLoaded", async () => {

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
  const RankCnt = document.querySelector("#rank-count");
  RankCnt.textContent = localStorage.getItem("rank");

  document.querySelector("#rank-count").textContent =
    localStorage.getItem("rank");

  const owned = JSON.parse(localStorage.getItem("owned")) || [];
  console.log("owned:", owned);

  let CoinNow = Number(localStorage.getItem("Coin"));
  if (isNaN(CoinNow) || CoinNow <= 0) {
    CoinNow = 100;
    localStorage.setItem("Coin", CoinNow);
  }

  document.querySelector("#coin-count").textContent =
    localStorage.getItem("Coin");


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

  // Array.from(weaponSelect.options).forEach(option => {
  //   if (!owned.some(o => o.id == option.value)) {
  //     option.remove();
  //   }
  // });

  // Array.from(armorSelect.options).forEach(option => {
  //   if (!owned.some(o => o.id == option.value)) {
  //     option.remove();
  //   }
  // });


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

    // アバター重ね画像変更
    // 画像変更
avatarWeapon.src = `./images/wear_img/e${weaponId}.png`;
avatarArmor.src  = `./images/wear_img/e${armorId}.png`;

// 武器位置適用
if (weaponPosition[weaponId]) {
  avatarWeapon.style.top = weaponPosition[weaponId].top;
  avatarWeapon.style.left = weaponPosition[weaponId].left;
  avatarWeapon.style.width = weaponPosition[weaponId].width;
}

// 防具位置適用
if (armorPosition[armorId]) {
  avatarArmor.style.top = armorPosition[armorId].top;
  avatarArmor.style.left = armorPosition[armorId].left;
  avatarArmor.style.width = armorPosition[armorId].width;
}

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

// 武器防具微調整
const weaponPosition = {
  0: { top: "50%", left: "39%", width: "8%" },  //檜の棒
  1: { top: "50%", left: "42%", width: "5%" },  //礫石器
  2: { top: "50%", left: "42%", width: "5%" },  //剥片石器
  3: { top: "50%", left: "42%", width: "5%" },  //磨製石器
  4: { top: "50%", left: "42%", width: "5%" },  //黒曜の鋒鋩
  5: { top: "50%", left: "37%", width: "10%" }, //銅剣
  6: { top: "50%", left: "40%", width: "7%" },  //青銅の剣
  7: { top: "47%", left: "40%", width: "7%" },  //グラディウス
  8: { top: "45%", left: "38%", width: "9%" },  //鐵の戦斧
  9: { top: "50%", left: "40%", width: "7%" },  //ウォーハンマー
 10: { top: "49%", left: "39%", width: "8%" },  //エペ
 11: { top: "50%", left: "38%", width: "9%" },  //シミター
 12: { top: "49%", left: "39%", width: "8%" },  //ロングソード
 13: { top: "42%", left: "38%", width: "10%" },  //黒鉄の戟
 14: { top: "46%", left: "39%", width: "8%" },  //ハルペー
 15: { top: "46%", left: "39%", width: "9%" },  //クレイモア
 16: { top: "47%", left: "39%", width: "8.5%" },  //ツヴァイヘンダー
 17: { top: "46%", left: "39%", width: "9%" },  //フランベルジュ
 18: { top: "46%", left: "39%", width: "9%" },  //ファルシオン
 19: { top: "40%", left: "34%", width: "15%" },  //トライデント
 20: { top: "45%", left: "39%", width: "9%" },  //エストック
 21: { top: "45%", left: "38%", width: "10%" },  //バルディッシュ
 22: { top: "48%", left: "37%", width: "10%" },  //長曽祢虎徹
 23: { top: "45%", left: "36%", width: "12%" },  //第二法・申命の言剣
 24: { top: "45%", left: "36%", width: "12%" },  //天地開闢の黎明剣
 25: { top: "45%", left: "37%", width: "11%" },  //汝を呼ばわる天帝の剣
 26: { top: "45%", left: "37%", width: "11%" },  //事象地平の終焉を刻む剣
 27: { top: "45%", left: "36%", width: "12%" },  //十の災禍・存在論・解脱の名
};

const armorPosition = {
  28: { top: "25%", left: "20%", width: "60%" },
  29: { top: "24%", left: "18%", width: "65%" }
};


