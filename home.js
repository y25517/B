export let HP = 100; //デフォルトHP 
export let ATK = 1;  //デフォルト攻撃力


const Jsonfile = './wq.json';
fetch (Jsonfile)
.then(Response => {
    return Response.json();
})
.then(function (data){

    const Weapon = data.weapon[27]; //Weaponという変数を作ってjsonの武器を反映
    const Armor = data.armor[15];   //Armorという変数を作ってjsonの防具を反映

    const TotalHP = HP + Weapon.atk;    //TotalHPという変数を作ってデフォHPに反映した武器の攻撃力をプラスする
    const TotalATK = ATK + Armor.hp;    //TotalATKという変数を作ってデフォATKに反映した防具のhpをプラスする

    document.getElementById("hp").textContent = TotalHP;    //HTMLのステータスに反映させる
    document.getElementById("kougeki").textContent = TotalATK;

    HP = TotalHP;
    ATK = TotalATK; //りょうまの方に反映させる

});