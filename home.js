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
     所持装備のみ表示
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
  0: { top: "50%", left: "39%", width: "8%" },
  1: { top: "50%", left: "42%", width: "5%" },
  2: { top: "50%", left: "42%", width: "5%" },
  3: { top: "50%", left: "42%", width: "5%" },
  4: { top: "50%", left: "42%", width: "5%" },
  5: { top: "50%", left: "37%", width: "10%" },
  6: { top: "50%", left: "40%", width: "7%" },
  7: { top: "47%", left: "40%", width: "7%" },
  8: { top: "50%", left: "42%", width: "5%" },
  9: { top: "50%", left: "42%", width: "5%" },
 10: { top: "50%", left: "42%", width: "5%" },
 11: { top: "50%", left: "42%", width: "5%" },
 12: { top: "50%", left: "42%", width: "5%" },
 13: { top: "50%", left: "42%", width: "5%" },
 14: { top: "50%", left: "42%", width: "5%" },
 15: { top: "50%", left: "42%", width: "5%" },
 16: { top: "50%", left: "42%", width: "5%" },
 17: { top: "50%", left: "42%", width: "5%" },
 18: { top: "50%", left: "42%", width: "5%" },
 19: { top: "50%", left: "42%", width: "5%" },
 20: { top: "50%", left: "42%", width: "5%" },
 21: { top: "50%", left: "42%", width: "5%" },
 22: { top: "50%", left: "42%", width: "5%" },
 23: { top: "50%", left: "42%", width: "5%" },
 24: { top: "50%", left: "42%", width: "5%" },
 25: { top: "50%", left: "42%", width: "5%" },
 26: { top: "50%", left: "42%", width: "5%" },
 27: { top: "50%", left: "42%", width: "5%" },
};

const armorPosition = {
  28: { top: "25%", left: "20%", width: "60%" },
  29: { top: "24%", left: "18%", width: "65%" }
};


