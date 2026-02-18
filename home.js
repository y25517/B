let HP = 100; //デフォルトHP
let ATK = 0;  //デフォルト攻撃力


const Jsonfile = './wq.json';
fetch (Jsonfile)
.then(Response => {
    return Response.json();
})
.then(function (data){
    console.log(data)
});