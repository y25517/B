/* ---------------- BOOT SEQUENCE ---------------- */

let bootLines = [
"[ 0.021 ] Power grid handshake initiated...",
"[ 0.048 ] Reactor fallback link established.",
"[ 0.073 ] Archive core checksum: degraded (12% fragmentation).",
"[ 0.110 ] External network: unreachable.",
"[ 0.151 ] Autonomous cognition engine: no response.",
"[ 0.190 ] Warframe registry scan: incomplete.",
"[ 0.224 ] Psychosphere interface module: quarantined.",
"[ 0.271 ] Solomon Protocol index: sealed.",
"[ 0.292 ] Canonical phrase index: VULG (Vulgate Crementina)",
"[ 0.309 ] Global casualty archive loaded: 49.8% loss confirmed.",
"[ 0.358 ] Population census incomplete.",
"[ 0.402 ] Strategic engine DESTRUDO: last signal 6666 C.E.",
"[ 0.447 ] TARTAROS CHTHONIOS platform: status unknown.",
"[ 0.503 ] Crypto-layer integrity: ACTIVE.",
"[ 0.544 ] Multi-key authorization required.",
"",
"[ 0.621 ] Psychospheric cascade event of revelation archived.",
"[ 0.650 ] Collateral gematrian estimate: 131.8B fatalities.",
"[ 0.666 ] Cause: uncontrolled collective override.",
"",
"",
"[ 1.102 ] Salvageable fragments detected.",
"[ 1.145 ] Archive ready.",
"",
"",
"",
"",
"System ready.",
"Awaiting operator input."
];

let logIndex = 0;

function typeBootLog() {
    if (logIndex < bootLines.length) {
        document.getElementById("boot-log").innerHTML += bootLines[logIndex] + "\n";
        logIndex++;
        if (logIndex == 27 && !localStorage.getItem("truth")) {
            console.log(bootLines.length);
            document.getElementById("boot-log").innerHTML += "Fatal: Permission denied.\nWarning: You need to collect all remnants to open.";
            document.body.style.color = "#FFB347";
            document.querySelector("h1").style.color = "#FFD08E"
            document.querySelector("h1").style.borderLeftColor = "#FF0013"
            
            return;
        }
        
        setTimeout(typeBootLog, 120 + Math.random()*120);
    } else {
        setTimeout(endBoot, 1200);
        let bgm = new Audio("./ME/secret.m4a");
        bgm.volume = 0.3;
        bgm.loop = true;
        bgm.play().catch(e => console.log(e));
    }
}

function endBoot() {
    let overlay = document.getElementById("boot-overlay");
    overlay.style.transition = "opacity 1.2s ease";
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.style.display = "none";
        document.getElementById("main-ui").classList.add("active");
        document.body.style.overflow = "auto";
    }, 1200);
}

window.onload = () => {
    setTimeout(typeBootLog, 800);
};



let canvas = document.getElementById('matrixCanvas');
let ctx = canvas.getContext('2d', { alpha: false }); // 描画高速化の設定

let encryptedData = "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"

function normalizeInput(str) {
    return str
        .trim()
        .replace(/\r?\n/g, "")   // 改行除去
        .replace(/\u3000/g, " "); // 全角スペース→半角
}

function unlock() {

    let A = normalizeInput(document.getElementById("hintA").value);
    let B = normalizeInput(document.getElementById("hintB").value);
    let C = normalizeInput(document.getElementById("hintC").value);

    if (!A || !B || !C) {
        triggerFail();
        return;
    }

    let combined = A + B + C;
    let hash = CryptoJS.SHA256(combined);

    try {
        let decrypted = CryptoJS.AES.decrypt(encryptedData, hash.toString());
        let text = decrypted.toString(CryptoJS.enc.Utf8);

        // 妥当性チェック（文字化け防止）
        if (!text || text.length < 20 || /[\uFFFD]/.test(text)) {
            triggerFail();
            return;
        }

        triggerSuccess(text, C);

    } catch (e) {
        triggerFail();
    }
}

function triggerFail() {
    let status = document.querySelector(".status-bar");
    status.textContent = "STATUS: ARCHIVE CORE UNRESTORED / ACCESS DENIED";
    document.body.classList.add("flash-fail");
    setTimeout(() => {
        document.body.classList.remove("flash-fail");
    }, 500);
    setTimeout(() => {
        
        status.textContent = "STATUS: ORPHANED RESEARCH FACILITY NODE 07 / POWER MODE: DEGRADED";
    }, 2000)
}

let sleep = (ms) => new Promise(resolve => setTimeout(resolve,ms));
async function triggerSuccess(text, code) {
    let output = document.getElementById("output");
    let speed = 16;
    output.textContent = "";
    
    output.appendChild(document.createElement("p"));
    let p = document.querySelector("p");
    for (let char of code) {
        p.innerHTML += marked.parse(char);
        await sleep(speed);
    }
    document.body.classList.add("flash-success");

    output.innerHTML = marked.parse(text);

    setTimeout(() => {
        output.style.opacity = 1;
    }, 300);

    let status = document.querySelector(".status-bar");
    status.textContent = "STATUS: ARCHIVE CORE RESTORED / ACCESS GRANTED";

    setTimeout(() => {
        document.body.classList.remove("flash-success");
    }, 800);
}


// 降らせたい文章のリスト
let texts = [
    "Et vidi de mari bestiam ascendentem habentem capita septem, et cornua decem, et super cornua ejus decem diademata, et super capita ejus nomina blasphemiæ.",
    "Et bestia, quam vidi, similis erat pardo, et pedes ejus sicut pedes ursi, et os ejus sicut os leonis. Et dedit illi draco virtutem suam, et potestatem magnam.",
    "Et vidi unum de capitibus suis quasi occisum in mortem : et plaga mortis ejus curata est. Et admirata est universa terra post bestiam.",
    "Et adoraverunt draconem, qui dedit potestatem bestiæ : et adoraverunt bestiam, dicentes : Quis similis bestiæ ? et quis poterit pugnare cum ea ?",
    "Et datum est ei os loquens magna et blasphemias : et data est ei potestas facere menses quadraginta duos.",
    "Et aperuit os suum in blasphemias ad Deum, blasphemare nomen ejus, et tabernaculum ejus, et eos qui in cælo habitant.",
    "Et est datum illi bellum facere cum sanctis, et vincere eos. Et data est illi potestas in omnem tribum, et populum, et linguam, et gentem,",
    "et adoraverunt eam omnes, qui inhabitant terram : quorum non sunt scripta nomina in libro vitæ Agni, qui occisus est ab origine mundi.",
    "Si quis habet aurem, audiat.",
    "Qui in captivitatem duxerit, in captivitatem vadet : qui in gladio occiderit, oportet eum gladio occidi. Hic est patientia, et fides sanctorum.",
    "Et vidi aliam bestiam ascendentem de terra, et habebat cornua duo similia Agni, et loquebatur sicut draco.",
    "Et potestatem prioris bestiæ omnem faciebat in conspectu ejus : et fecit terram, et habitantes in ea, adorare bestiam primam, cujus curata est plaga mortis.",
    "Et fecit signa magna, ut etiam ignem faceret de cælo descendere in terram in conspectu hominum.",
    "Et seduxit habitantes in terra propter signa, quæ data sunt illi facere in conspectu bestiæ, dicens habitantibus in terra, ut faciant imaginem bestiæ, quæ habet plagam gladii, et vixit.",
    "Et datum est illi ut daret spiritum imagini bestiæ, et ut loquatur imago bestiæ : et faciat ut quicumque non adoraverint imaginem bestiæ, occidantur.",
    "Et faciet omnes pusillos, et magnos, et divites, et pauperes, et liberos, et servos habere caracterem in dextera manu sua, aut in frontibus suis :",
    "et nequis possit emere, aut vendere, nisi qui habet caracterem, aut nomen bestiæ, aut numerum nominis ejus.",
    "Hic sapientia est. Qui habet intellectum, computet numerum bestiæ. Numerus enim hominis est : et numerus ejus sexcenti sexaginta sex.",
];

let width, height, columns;
let fontSize = 16;
let drops = []; // 各列の現在のY位置
let columnTexts = []; // 各列が担当する文章のインデックス

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // 開始位置をバラけさせる
        columnTexts[i] = Math.floor(Math.random() * texts.length);
    }
}

window.addEventListener('resize', resize);
resize();

function draw() {
    // 画面を薄く塗りつぶして残像を作る
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f0'; // 文字色
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        let textIdx = columnTexts[i];
        let fullText = texts[textIdx];
        
        // 現在の行に対応する文字を取得（ループさせる）
        let charIdx = Math.floor(drops[i]) % fullText.length;
        let char = fullText[charIdx] || "";

        // 描画
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // 下端に達したらリセット（確率でリセットタイミングをずらす）
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
            columnTexts[i] = Math.floor(Math.random() * texts.length); // 次は別の文章
        }

        drops[i] += 0.5; // 落下速度
    }
}

// 30fps程度に抑える
setInterval(draw, 33);