// home.js
export let HP = 100; // デフォHP
export let ATK = 0;  // デフォ攻撃力

const Jsonfile = './eq.json'; // 
const owned = JSON.parse(localStorage.getItem("owned")) || [];
console.log("owned:", owned);

let CoinNow = 100;
// コインをローカルストレージに入れる
    localStorage.setItem("Coin", CoinNow);
    const CoinCnt = document.querySelector("#coin-count");
    CoinCnt.textContent = localStorage.getItem("Coin");

// 戦闘かボスのaタグを押したときの判定をlocalStorageに保存
document.getElementById("rival").addEventListener("click", function(e){
    e.preventDefault();     //動作を止める
    localStorage.setItem("RivalType", 0);
    window.location.href = "battle.html"; 
});
document.getElementById("boss").addEventListener("click", function(e){
    e.preventDefault();
    localStorage.setItem("RivalType", 1);
    window.location.href = "battle.html"; 
});


fetch(Jsonfile)
.then(response => response.json())
.then(data => {
    // constで新しい変数を作ってjsonファイルの武器、防具を反映させる
    const equippedWeapon = data.weapon[3];
    const equippedArmor = data.armor[29];

    // constで新しい変数を作ってjsonファイルの攻撃力、hpを反映させたのを、デフォに足す
    const totalATK = ATK + equippedWeapon.atk;
    const totalHP = HP + equippedArmor.hp;

    // HTMLに反映
    document.getElementById("hp").textContent = totalHP;
    document.getElementById("kougeki").textContent = totalATK;

    //ローカルストレージに保存
    localStorage.setItem("avatarHP", totalHP);
    localStorage.setItem("avatarATK", totalATK);

    console.log(`装備中: ${equippedWeapon.name}, ${equippedArmor.name}`);
    console.log(`HP: ${totalHP},攻撃力: ${totalATK}`);
})
.catch(error => console.error("データの読み込みに失敗したにょ:", error));


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

// optionにある武器、防具とownedにある武器、防具と一致したら表示させる

document.addEventListener("DOMContentLoaded", () => {

    const owned = JSON.parse(localStorage.getItem("owned")) || [];
  
    const weaponSelect = document.getElementById("weaponpuru");
    const armorSelect = document.getElementById("armorpuru");
  
    // 武器のoption整理
    Array.from(weaponSelect.options).forEach(option => {
  
      const hasItem = owned.some(o => o.id == option.value);
  
      if (!hasItem) {
        option.remove();
      }
  
    });
  
    // 防具のoption整理
    Array.from(armorSelect.options).forEach(option => {
  
      const hasItem = owned.some(o => o.id == option.value);
  
      if (!hasItem) {
        option.remove();
      }
  
    });
  
  });