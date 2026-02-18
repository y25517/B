// home.js
export let HP = 100; // デフォHP
export let ATK = 0;  // デフォ攻撃力

const Jsonfile = './eq.json'; // 

fetch(Jsonfile)
.then(response => response.json())
.then(data => {
    // constで新しい変数を作ってjsonファイルの武器、防具を反映させる
    const equippedWeapon = data.weapon[0];
    const equippedArmor = data.armor[0];

    // constで新しい変数を作ってjsonファイルの攻撃力、hpを反映させたのを、デフォに足す
    const totalATK = ATK + equippedWeapon.atk;
    const totalHP = HP + equippedArmor.hp;

    // HTMLに反映
    document.getElementById("hp").textContent = totalHP;
    document.getElementById("kougeki").textContent = totalATK;

    // りょうまのやつに反映するためのやつ
    HP = totalHP;
    ATK = totalATK;

    console.log(`装備中: ${equippedWeapon.name}, ${equippedArmor.name}`);
})
.catch(error => console.error("データの読み込みに失敗しました:", error));