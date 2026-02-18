const AtackBtn = document.querySelector("#atcbar");
const StopBtn = document.querySelector("#stopbtn");
const StartBtn = document.querySelector("#strbtn");


//戦闘開始したら
StartBtn.addEventListener("click", function(){
    StartBtn.style.display = "none";
    AtackBtn.style.display = "block";
    StopBtn.style.display = "block";
   
});

//戦闘を開始する前
function main()
{
    AtackBtn.style.display = "none";
    StopBtn.style.display = "none";
}

main();