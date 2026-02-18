let eqs = [];

let url = "eq.json";
async function loadEqs() {
    try {
        let response = await fetch(url);
        eqs = await response.json();
    } catch (error) {
        console.log("読み込みエラー");
    }
}