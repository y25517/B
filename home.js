// home.js

// eq.jsonファイルを取得
const Jsonfile = "./eq.json";


document.addEventListener("DOMContentLoaded", async () => {
  // ランクの初期設定（ランクがセットされていなかった場合）
  if (!localStorage.getItem("isDone")) {
    localStorage.setItem("rank", 0);
    localStorage.setItem("isDone", JSON.stringify(true));
  }
  const RankCnt = document.querySelector("#rank-count");  //笹森（変更）
  RankCnt.textContent = localStorage.getItem("rank");     //笹森

  //ローカルストレージのownedを配列として取り出す
  const owned = JSON.parse(localStorage.getItem("owned")) || [];
  console.log("owned:", owned);

  let CoinNow = Number(localStorage.getItem("Coin"));
  // コインをローカルストレージに入れる
  if (isNaN(CoinNow) || CoinNow <= 0) {
    CoinNow = 100;
    localStorage.setItem("Coin", CoinNow);
  }
  console.log(CoinNow);
  const CoinCnt = document.querySelector("#coin-count");
  CoinCnt.textContent = localStorage.getItem("Coin");

  // 戦闘かボスのaタグを押したときの判定をlocalStorageに保存
  document.getElementById("rival").addEventListener("click", function (e) {
    e.preventDefault(); //動作を止める
    localStorage.setItem("RivalType", 0);
    window.location.href = "battle.html";
  });
  document.getElementById("boss").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("RivalType", 1);
    window.location.href = "battle.html";
  });
  document.getElementById("soubi").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("RivalType", 1);
    window.location.href = "battle.html";
  });

  // 今の装備のところ
  const weaponImg = document.getElementById("weaponimg");
  const weaponMenu = document.getElementById("weaponpuru");

  const armorImg = document.getElementById("armorimg");
  const armorMenu = document.getElementById("armorpuru");

  weaponImg.addEventListener("click", (e) => {
    e.stopPropagation();
    weaponMenu.classList.toggle("active");
    armorMenu.classList.remove("active");
  });

  armorImg.addEventListener("click", (e) => {
    e.stopPropagation();
    armorMenu.classList.toggle("active");
    weaponMenu.classList.remove("active");
  });

  // 外をクリックしたら閉じる
  document.addEventListener("click", () => {
    weaponMenu.classList.remove("active");
    armorMenu.classList.remove("active");
  });

});

// optionにある武器、防具とownedにある武器、防具と一致したら表示させる

document.addEventListener("DOMContentLoaded", () => {
  const owned = JSON.parse(localStorage.getItem("owned")) || [];

  const weaponSelect = document.getElementById("weaponpuru");
  const armorSelect = document.getElementById("armorpuru");

  // 武器のoption整理
  Array.from(weaponSelect.options).forEach((option) => {
    const hasItem = owned.some((o) => o.id == option.value);

    if (!hasItem) {
      option.remove();
    }
  });

  // ownedにない武器、防具はselectから消す
  Array.from(armorSelect.options).forEach((option) => {
    const hasItem = owned.some((o) => o.id == option.value);

    if (!hasItem) {
      option.remove();
    }
  });
});

//プルダウンで設定した武器、防具をステータスに反映
document.addEventListener("DOMContentLoaded", async () => {

  const HP_BASE = 100;
  const ATK_BASE = 0;

  const weaponSelect = document.getElementById("weaponpuru");
  const armorSelect = document.getElementById("armorpuru");

  const owned = JSON.parse(localStorage.getItem("owned")) || [];

  // 所持していないoptionを削除
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

  // 保存済み装備を復元
  const savedEquip = JSON.parse(localStorage.getItem("equipped"));
  if (savedEquip) {
      weaponSelect.value = savedEquip.weapon;
      armorSelect.value = savedEquip.armor;
  }

  // eq.json取得
  const response = await fetch("./eq.json");
  const data = await response.json();

  function updateStatus() {
    //プルダウンの選択をステータスに反映
      const weaponId = Number(weaponSelect.value);
      const armorId = Number(armorSelect.value);

      const weapon = data.weapon.find(w => w.id === weaponId);
      const armor = data.armor.find(a => a.id === armorId);

      const totalATK = ATK_BASE + (weapon ? weapon.atk : 0);
      const totalHP = HP_BASE + (armor ? armor.hp : 0);

      document.getElementById("hp").textContent = totalHP;
      document.getElementById("kougeki").textContent = totalATK;

      // 武器防具変更の写真変更
      weaponImg.src = `./images/equipments_img/e${weaponId}.JPG`;
      armorImg.src  = `./images/equipments_img/e${armorId}.JPG`;

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

});

// imageを取得

const weaponImg = document.getElementById("weaponimg");
const armorImg  = document.getElementById("armorimg");