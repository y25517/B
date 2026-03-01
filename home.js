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
  const rankSelect = document.getElementById("rank-select");

// 保存されているランクを反映
rankSelect.value = localStorage.getItem("rank");

// 変更されたら保存
rankSelect.addEventListener("change", () => {
  localStorage.setItem("rank", rankSelect.value);
});

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

    const avatar = document.getElementById("avatarComplete");

avatar.src = `./images/wear_img/a${armorId}_w${weaponId}.png`;  //ここでアバターの画像を装備に合わせて変更してます。wear_imgに画像が全部あります。ぉーかるストレージにはまだ入れてないです。

    // アバター重ね画像変更
    // 画像変更
// avatarWeapon.src = `./images/wear_img/e${weaponId}.png`;
// avatarArmor.src  = `./images/wear_img/e${armorId}.png`;

// // 武器位置適用
// if (weaponPosition[weaponId]) {
//   avatarWeapon.style.top = weaponPosition[weaponId].top;
//   avatarWeapon.style.left = weaponPosition[weaponId].left;
//   avatarWeapon.style.width = weaponPosition[weaponId].width;
// }

// // 防具位置適用
// if (armorPosition[armorId]) {
//   avatarArmor.style.top = armorPosition[armorId].top;
//   avatarArmor.style.left = armorPosition[armorId].left;
//   avatarArmor.style.width = armorPosition[armorId].width;
// }

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


const resetBtn = document.getElementById("risetto");

resetBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});