const machines = {
  small: { image: "./assets/small-scene.jpg", title: "小型｜掌中亭", meta: "一人快玩／雙人輪替", alt: "小型布袋戲機台使用情境" },
  medium: { image: "./assets/medium-scene.jpg", title: "中型｜雙雄台", meta: "雙人即時競合", alt: "中型雙人布袋戲機台使用情境" },
  large: { image: "./assets/large-scene.jpg", title: "大型｜掌中劇場", meta: "玩家＋AI＋觀眾共演", alt: "大型沉浸式布袋戲劇場使用情境" }
};

document.querySelectorAll("[data-machine]").forEach((button) => {
  button.addEventListener("click", () => {
    const machine = machines[button.dataset.machine];
    const image = document.querySelector("#hero-image");
    image.src = machine.image;
    image.alt = machine.alt;
    document.querySelector("#hero-title").textContent = machine.title;
    document.querySelector("#hero-meta").textContent = machine.meta;
    document.querySelectorAll("[data-machine]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

const roles = [
  { name: "墨雨孤鋒", intro: "為尋失落戲譜，踏入風雨戲台。", special: "墨雨斷江" },
  { name: "赤焰狂生", intro: "為證拳宗之名，向宿敵下戰帖。", special: "赤焰震嶽" },
  { name: "玄羽策士", intro: "為揭開魔王陰謀，布下玄羽之陣。", special: "玄羽封界" }
];

const state = { role: 0, active: false, playerHp: 100, enemyHp: 100, qi: 20, audience: 32, mode: "VS" };
const $ = (selector) => document.querySelector(selector);
const actionButtons = [...document.querySelectorAll("[data-action]")];
const voteButtons = [...document.querySelectorAll("[data-vote]")];

function clamp(value) { return Math.max(0, Math.min(100, value)); }

function setInteractive(enabled) {
  actionButtons.forEach((button) => { button.disabled = !enabled; });
  voteButtons.forEach((button) => { button.disabled = !enabled; });
  document.querySelectorAll("[data-role]").forEach((button) => { button.disabled = enabled; });
}

function renderGame() {
  $("#player-name").textContent = roles[state.role].name;
  $("#player-hp").textContent = state.playerHp;
  $("#enemy-hp").textContent = state.enemyHp;
  $("#player-hp-bar").style.width = `${state.playerHp}%`;
  $("#enemy-hp-bar").style.width = `${state.enemyHp}%`;
  $("#qi-value").textContent = `${state.qi}%`;
  $("#qi-bar").style.width = `${state.qi}%`;
  $("#audience-value").textContent = `${state.audience}%`;
  $("#audience-bar").style.width = `${state.audience}%`;
  $("#battle-mode").textContent = state.mode;
  const special = $("[data-action='special']");
  special.classList.toggle("ready", state.qi >= 100);
  $("#special-hint").textContent = state.qi >= 100 ? `${roles[state.role].special}・準備完成` : "需要 100% 氣勢";
}

function announce(message) { $("#ai-log").textContent = message; }

document.querySelectorAll("[data-role]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.active) return;
    state.role = Number(button.dataset.role);
    document.querySelectorAll("[data-role]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    announce(`角色確認：${roles[state.role].name}。AI 正在生成登場詩與宿敵關係……`);
    renderGame();
  });
});

$("#start-game").addEventListener("click", () => {
  if (state.active) {
    state.active = false;
    setInteractive(false);
    $("#start-game").textContent = "布幕開啟・開始對決";
    $("#start-game").classList.remove("running");
    announce("已返回選角。選擇新的門派，AI 將重新生成故事。");
    return;
  }
  Object.assign(state, { active: true, playerHp: 100, enemyHp: 100, qi: 20, audience: 32, mode: "VS" });
  setInteractive(true);
  $("#start-game").textContent = "結束本局・重新選角";
  $("#start-game").classList.add("running");
  announce(`AI 生成劇情：${roles[state.role].name}${roles[state.role].intro}宿敵「夜羅剎」已登台！`);
  renderGame();
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.active) return;
    const action = button.dataset.action;
    let damage = 0;
    let counter = 0;
    let gain = 0;
    let message = "";
    if (action === "attack") {
      damage = 14; counter = 8; gain = 18;
      message = "揮偶突進命中！AI 分析你的揮動節奏並立即反擊。";
    } else if (action === "defend") {
      damage = 3; counter = 2; gain = 12;
      message = "橫偶架勢成功，完美防禦轉化為氣勢值。";
    } else if (action === "voice") {
      damage = 5; counter = 5; gain = 28;
      message = "語音辨識成功！AI 將台詞轉為角色聲線與招式光效。";
    } else if (state.qi >= 100) {
      damage = 38; gain = -100;
      message = `必殺技「${roles[state.role].special}」發動！動作、台詞與觀眾聲勢共同決定演出強度。`;
    } else {
      announce("氣勢尚未全滿。繼續攻防、說出台詞，或請觀眾助陣。");
      return;
    }
    state.enemyHp = clamp(state.enemyHp - damage);
    state.playerHp = clamp(state.playerHp - counter);
    state.qi = clamp(state.qi + gain);
    announce(message);
    if (state.enemyHp === 0 || state.playerHp === 0) {
      state.active = false;
      setInteractive(false);
      $("#start-game").textContent = "再次登台・重新選角";
      $("#start-game").classList.remove("running");
      announce(state.enemyHp === 0 ? "AI 生成結局：宿敵收劍立誓，下一回將帶著新招再次挑戰。" : "本回合落幕。AI 已記住你的攻防節奏，準備下一次宗師試煉。即使落敗，也能生成不同的故事結局。");
    }
    renderGame();
  });
});

voteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.active) return;
    const choice = button.dataset.vote;
    state.audience = clamp(state.audience + 12);
    state.qi = clamp(state.qi + 10);
    if (choice === "暫時結盟") state.mode = "共鬥";
    if (choice === "繼續對決") state.mode = "VS";
    announce(`觀眾選擇「${choice}」：氣勢提升，AI 將投票寫入下一幕劇情。`);
    renderGame();
  });
});

setInteractive(false);
renderGame();
