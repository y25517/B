// home.js
export let HP = 100; // デフォHP
export let ATK = 0;  // デフォ攻撃力

const Jsonfile = './eq.json'; // 

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
    const equippedWeapon = data.weapon[0];
    const equippedArmor = data.armor[3];

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

// ローカルストレージから所持している武器、防具を取得
const displayData = document.querySelector('.display-data');
const data = localStorage.getItem('owned');
displayData.innerText = data;