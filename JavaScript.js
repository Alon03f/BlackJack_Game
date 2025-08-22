/* ===========================
   קונפיג – החלף לנתיבים שלך
   =========================== */
const ASSETS = {
  // 1) כרטיסי משחק
  // ברירת מחדל:  "assets/cards/{RANK}{SUIT}.png" למשל AS, TD, 5H, QC...
  // SUIT: S=Spades, H=Hearts, D=Diamonds, C=Clubs
  cardBasePath: "./assets/cards/",
  cardFilename: ({ rank, suit }) => `${rank}${suit}.png`,
  // אם שמות הקבצים אצלך שונים (למשל "5_of_hearts.png") השתמש ב:
  // cardFilename: ({rank, suitFull}) => `${rank}_of_${suitFull}.png`,

  // גב קלף:
  back: "./assets/cards/back.png",

  // 2) צ'יפים (שים את התמונות שלך כאן)
  chips: {
    5:  "./assets/chips/5.png",
    10: "./assets/chips/10.png",
    25: "./assets/chips/25.png",
    50: "./assets/chips/50.png",
    100:"./assets/chips/100.png",
    500:"./assets/chips/500.png",
  }
};

// ======= הגדרות כללים של המשחק =======
const GAME_CFG = {
  startingBankroll: 500,
  blackjackPayout: 1.5,   // 3:2 על בלאקג'ק טבעי
  dealerStandSoft17: true,// דילר עומד על 17 (כולל רך)
  maxStatRows: 10,
  maxSplits: 1,           // פיצול אחד (שתי ידיים בסה"כ)
};

// ======= דגל איפוס יתרה בכל טעינה =======
const RESET_ON_RELOAD = true; // שנה ל-true אם תרצה להתחיל תמיד מ-$500

// ======= משתני DOM =======
const els = {
  bankrollAmount: document.getElementById("bankrollAmount"),
  statsRows: document.getElementById("statsRows"),

  dealerCards: document.getElementById("dealerCards"),
  dealerScore: document.getElementById("dealerScore"),
  dealerTag: document.getElementById("dealerTag"),

  playerArea: document.getElementById("playerArea"),
  playerHand1: document.getElementById("playerHand1"),
  playerCards0: document.getElementById("playerCards0"),
  playerCards1: document.getElementById("playerCards1"),
  playerScore0: document.getElementById("playerScore0"),
  playerScore1: document.getElementById("playerScore1"),
  playerTag0: document.getElementById("playerTag0"),
  playerTag1: document.getElementById("playerTag1"),

  betChips: document.getElementById("betChips"),
  betAmount: document.getElementById("betAmount"),

  chipRow: document.getElementById("chipRow"),
  chipsBar: document.getElementById("chipsBar"),

  dealBtn: document.getElementById("dealBtn"),
  clearBetBtn: document.getElementById("clearBetBtn"),
  rebetBtn: document.getElementById("rebetBtn"),

  hitBtn: document.getElementById("hitBtn"),
  standBtn: document.getElementById("standBtn"),
  doubleBtn: document.getElementById("doubleBtn"),
  splitBtn: document.getElementById("splitBtn"),
  newRoundBtn: document.getElementById("newRoundBtn"),

  toast: document.getElementById("toast"),
};

// ======= נתונים נשמרים =======
const LS_KEYS = {
  BANKROLL: "bj_bankroll_v1",
  STATS: "bj_stats_v1",
  LASTBET: "bj_lastbet_v1",
};

// ======= מודל המשחק =======
let state = {
  bankroll: GAME_CFG.startingBankroll,
  shoe: [],
  dealer: { cards: [], hidden: true },
  players: [
    { cards: [], bet: 0, done: false, busted: false, doubled: false, splitAces: false },
  ],
  activeHandIndex: 0,
  roundOver: false,
  betPhase: true,
  lastBetBreakdown: [], // צ'יפים לפי ערכים
  stats: { rows: [] },  // מערך של 'P','D','Push'
};

// ======= עזר – דפוס קלפים =======
const RANKS = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"];
const SUITS = [
  {s:"S", full:"spades"},
  {s:"H", full:"hearts"},
  {s:"D", full:"diamonds"},
  {s:"C", full:"clubs"},
];

// בניית חפיסה של 6 דקים
function buildShoe(decks=6){
  const cards = [];
  for(let d=0; d<decks; d++){
    for(const r of RANKS){
      for(const su of SUITS){
        const value = r==="A" ? 11 : (r==="T"||r==="J"||r==="Q"||r==="K" ? 10 : parseInt(r,10));
        cards.push({
          rank: r,
          value,
          suit: su.s,
          suitFull: su.full,
          img: ASSETS.cardBasePath + ASSETS.cardFilename({ rank:r, suit:su.s, suitFull: su.full }),
        });
      }
    }
  }
  // ערבוב
  for(let i=cards.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function drawCard(){
  if(state.shoe.length < 40){ // רענון כשנשאר מעט
    state.shoe = buildShoe();
  }
  return state.shoe.pop();
}

// ======= לוגיקת יד =======
function handValue(cards){
  let total = 0, aces = 0;
  for(const c of cards){
    total += c.value;
    if(c.rank==="A") aces++;
  }
  // הורדת אסים מ-11 ל-1 לפי הצורך
  while(total>21 && aces>0){
    total -= 10;
    aces--;
  }
  const soft = aces>0; // נשאר אס כ־11
  return { total, soft };
}
function isBlackjack(cards){
  return cards.length===2 && handValue(cards).total===21;
}
function canSplit(hand){
  return hand.cards.length===2 && hand.cards[0].rank===hand.cards[1].rank;
}
function canDouble(hand){
  return hand.cards.length===2 && !hand.doubled;
}

// ======= UI כללי =======
function el(tag, cls){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  return e;
}
function renderCard(card, who){ // who: 'player' / 'dealer'
  const c = el("div", "card");
  c.style.backgroundImage = `url("${card.img}")`;
  c.classList.add(who==="dealer" ? "deal-dealer" : "deal-player");
  return c;
}
function renderHiddenCard(){ // קלף הפוך לדילר
  const c = el("div", "card back");
  c.classList.add("deal-dealer");
  return c;
}
function showToast(type, txt){
  const t = els.toast;
  t.textContent = txt;
  t.className = "toast show";
  if(type==="win") t.classList.add("toast--win");
  else if(type==="lose") t.classList.add("toast--lose");
  else if(type==="bj") t.classList.add("toast--bj");
  t.hidden = false;
  setTimeout(()=>{ t.classList.remove("show"); t.hidden=true; }, 2000);
}
function showTag(targetEl, text, type){
  targetEl.textContent = text;
  targetEl.className = "tag show" + (type ? ` ${type}` : "");
}

// ספירת יתרה מונפשת
let animTimer=null;
function animateBankroll(from, to, ms=450){
  if(animTimer) cancelAnimationFrame(animTimer);
  const start = performance.now();
  const step = (now)=>{
    const p = Math.min(1, (now-start)/ms);
    const val = Math.round(from + (to-from)*p);
    els.bankrollAmount.textContent = `$${val}`;
    if(p<1) animTimer = requestAnimationFrame(step);
  };
  animTimer = requestAnimationFrame(step);
}

// ======= לוקאל סטורג' =======
function loadState(){
  if (RESET_ON_RELOAD) {
    state.bankroll = GAME_CFG.startingBankroll;
    state.stats = { rows: [] };
    state.lastBetBreakdown = [];
    persist(); // כתוב ערכי התחלה תמידיים
    return;
  }
  const b = +localStorage.getItem(LS_KEYS.BANKROLL);
  if (!isNaN(b)) state.bankroll = b;
  else state.bankroll = GAME_CFG.startingBankroll;

  const st = localStorage.getItem(LS_KEYS.STATS);
  if (st) state.stats = JSON.parse(st);
  if (!state.stats.rows) state.stats.rows = [];

  const lb = localStorage.getItem(LS_KEYS.LASTBET);
  if (lb) state.lastBetBreakdown = JSON.parse(lb);
}
function persist(){
  localStorage.setItem(LS_KEYS.BANKROLL, String(state.bankroll));
  localStorage.setItem(LS_KEYS.STATS, JSON.stringify(state.stats));
  localStorage.setItem(LS_KEYS.LASTBET, JSON.stringify(state.lastBetBreakdown));
}

// ======= רנדר ראשוני =======
function renderBankroll(){
  els.bankrollAmount.textContent = `$${state.bankroll}`;
}
function renderStats(){
  els.statsRows.innerHTML = "";
  for(const r of state.stats.rows){
    const row = el("div", "stats__row");
    const p = el("div");
    const d = el("div");
    if(r==="P"){ p.classList.add("win"); p.textContent="✓"; d.textContent=""; }
    else if(r==="D"){ d.classList.add("win"); d.textContent="✓"; p.textContent=""; }
    else { p.classList.add("push"); d.classList.add("push"); p.textContent="—"; d.textContent="—"; }
    row.append(p,d);
    els.statsRows.prepend(row); // חדש למעלה
  }
}
function renderChipsBar(){
  els.chipsBar.innerHTML = "";
  const denoms = [5,10,25,50,100,500]; // משמאל לימין קטן לגדול
  for(const v of denoms){
    const chip = el("div", "chip");
    chip.style.backgroundImage = `url("${ASSETS.chips[v]}")`;
    chip.setAttribute("data-v", `$${v}`);
    chip.title = `$${v}`;
    chip.addEventListener("click", ()=>addChip(v));
    els.chipsBar.appendChild(chip);
  }
}

function renderHands(){
  // Dealer
  els.dealerCards.innerHTML = "";
  els.dealerTag.className = "tag";
  const d = state.dealer;
  d.cards.forEach((card, idx)=>{
    if(idx===1 && d.hidden){
      els.dealerCards.appendChild(renderHiddenCard());
    }else{
      els.dealerCards.appendChild(renderCard(card, "dealer"));
    }
  });
  if(d.hidden){
    const first = handValue([d.cards[0]]).total;
    els.dealerScore.textContent = `${first}+`;
  }else{
    els.dealerScore.textContent = handValue(d.cards).total;
  }

  // Players
  for(let i=0;i<2;i++){
    const hand = state.players[i];
    const cardsEl = i===0 ? els.playerCards0 : els.playerCards1;
    const scoreEl = i===0 ? els.playerScore0 : els.playerScore1;
    const tagEl = i===0 ? els.playerTag0 : els.playerTag1;
    if(!hand){ // יד שניה לא קיימת
      if(i===1) document.getElementById("playerHand1").hidden = true;
      continue;
    }
    if(i===1) document.getElementById("playerHand1").hidden = false;
    cardsEl.innerHTML = "";
    tagEl.className = "tag";
    hand.cards.forEach(c=>cardsEl.appendChild(renderCard(c, "player")));
    const val = handValue(hand.cards).total;
    scoreEl.textContent = val;
  }

  // הדגשת היד הפעילה
  document.querySelectorAll(".player-area .hand").forEach(h=>h.classList.remove("active"));
  const activeEl = document.querySelector(`.player-area .hand[data-index="${state.activeHandIndex}"]`);
  if(activeEl && !state.betPhase) activeEl.classList.add("active");
}

function setButtons(){
  const playing = !state.betPhase && !state.roundOver;
  const active = state.players[state.activeHandIndex];
  els.hitBtn.disabled   = !playing;
  els.standBtn.disabled = !playing;

  // דאבל – רק בתחילת יד (2 קלפים) ויש יתרה מספיקה
  const canDbl = playing && canDouble(active) && state.bankroll >= active.bet;
  els.doubleBtn.disabled = !canDbl;
  els.doubleBtn.style.opacity = canDbl?1:0.4;

  // ספליט – שני קלפים שווים, עדיין לא פוצלנו מעבר למותר, ויש יתרה מספיקה
  const haveSecondHand = !!state.players[1];
  const maySplitMore = !haveSecondHand && GAME_CFG.maxSplits>0;
  const canSplt = playing && maySplitMore && canSplit(active) && state.bankroll >= active.bet;
  els.splitBtn.disabled = !canSplt;
  els.splitBtn.style.opacity = canSplt?1:0.4;

  // שלב הימור
  els.dealBtn.disabled = !(state.betPhase && state.players[0].bet>0);
  els.clearBetBtn.disabled = state.players[0].bet===0;
}

function addBetChipVisual(v){
  // מוסיף צ'יפ למרכז (עם מעט סטייה יפה)
  const chip = el("div", "chip");
  chip.style.backgroundImage = `url("${ASSETS.chips[v]}")`;
  chip.style.position = "absolute";
  chip.style.left = (Math.random()*40+30) + "px";
  chip.style.top  = (Math.random()*20) + "px";
  chip.title = `$${v} (לחץ להסרה)`;
  chip.addEventListener("click", ()=>{
    removeOneChip(v, chip);
  });
  els.betChips.appendChild(chip);
}

function removeOneChip(v, chipEl){
  // מסיר צ'יפ אחד בערך הנתון
  const idx = state.lastBetBreakdown.lastIndexOf(v);
  if(idx>-1){
    state.lastBetBreakdown.splice(idx,1);
    state.players[0].bet -= v;
    animateBankroll(state.bankroll, state.bankroll+v);
    state.bankroll += v;
    chipEl.remove();
    els.betAmount.textContent = `$${state.players[0].bet}`;
    persist();
    setButtons();
  }
}

function addChip(v){
  if(!state.betPhase) return;
  if(state.bankroll < v) return;
  state.bankroll -= v;
  state.players[0].bet += v;
  state.lastBetBreakdown.push(v);
  addBetChipVisual(v);
  els.betAmount.textContent = `$${state.players[0].bet}`;
  animateBankroll(state.bankroll+v, state.bankroll);
  persist();
  setButtons();
}

function clearBet(){
  if(!state.betPhase) return;
  // החזר צ'יפים
  const refund = state.players[0].bet;
  state.bankroll += refund;
  state.players[0].bet = 0;
  state.lastBetBreakdown = [];
  els.betChips.innerHTML = "";
  els.betAmount.textContent = "$0";
  animateBankroll(state.bankroll-refund, state.bankroll);
  persist();
  setButtons();
}

// Rebet – מוסיף שוב את ההימור האחרון
function handleRebet(){
  if(!state.betPhase) return;
  if(!state.lastBetBreakdown.length) return;
  const prev = [...state.lastBetBreakdown];
  clearBet();
  for(const v of prev){
    if(state.bankroll >= v){
      state.bankroll -= v;
      state.players[0].bet += v;
      state.lastBetBreakdown.push(v);
      addBetChipVisual(v);
    }
  }
  els.betAmount.textContent = `$${state.players[0].bet}`;
  animateBankroll(state.bankroll+prev.reduce((a,b)=>a+b,0), state.bankroll);
  persist();
  setButtons();
}

// ======= שלב "התחל משחק" =======
function deal(){
  if(!state.betPhase || state.players[0].bet<=0) return;

  // הסתרת שורת צ'יפים עד סוף סיבוב
  els.chipRow.style.display = "none";

  state.betPhase = false;
  state.roundOver = false;
  state.activeHandIndex = 0;
  state.dealer = { cards: [], hidden: true };
  state.players[0].cards = [];
  state.players[0].done = false;
  state.players[0].busted = false;
  state.players[0].doubled = false;
  state.players[0].splitAces = false;
  state.players[1] = undefined; // הסתר יד שניה אם הייתה

  // חלוקה – P, D, P, D(חבוי)
  state.players[0].cards.push(drawCard());
  state.dealer.cards.push(drawCard());
  state.players[0].cards.push(drawCard());
  state.dealer.cards.push(drawCard()); // חבוי

  renderHands();
  setButtons();

  // בדיקת בלאקג'ק
  const playerBJ = isBlackjack(state.players[0].cards);
  const dealerBJ = isBlackjack(state.dealer.cards);

  if(playerBJ || dealerBJ){
    state.dealer.hidden = false;
    renderHands();
    resolveRound(true);
    return;
  }
}

function currentHand(){ return state.players[state.activeHandIndex]; }

function hit(){
  if(state.betPhase || state.roundOver) return;
  const hand = currentHand();
  // אם אסים מפוצלים – רבים מהקזינו מתירים רק קלף אחד ליד. נכבד את זה:
  if(hand.splitAces && hand.cards.length>=2){
    stand(); return;
  }
  hand.cards.push(drawCard());
  renderHands();

  const v = handValue(hand.cards).total;
  if(v>21){
    hand.busted = true;
    const tagEl = state.activeHandIndex===0? els.playerTag0 : els.playerTag1;
    showTag(tagEl, "BUST", "tag--bust");
    nextHandOrDealer();
  }
  setButtons();
}

function stand(){
  if(state.betPhase || state.roundOver) return;
  currentHand().done = true;
  nextHandOrDealer();
}

function doubleDown(){
  const hand = currentHand();
  if(els.doubleBtn.disabled) return;
  // הורדת הימור שני
  state.bankroll -= hand.bet;
  animateBankroll(state.bankroll+hand.bet, state.bankroll);
  hand.bet *= 2;
  hand.doubled = true;
  persist();
  // קלף אחד וסיום היד
  hit();
  if(!hand.busted){
    stand();
  }
}

function split(){
  const hand = currentHand();
  if(els.splitBtn.disabled) return;

  // גבה עוד הימור
  state.bankroll -= hand.bet;
  animateBankroll(state.bankroll+hand.bet, state.bankroll);
  persist();

  // פיצול ליד 2
  const [c1, c2] = hand.cards;
  state.players[0] = { cards:[c1], bet: hand.bet, done:false, busted:false, doubled:false, splitAces:(c1.rank==="A") };
  state.players[1] = { cards:[c2], bet: hand.bet, done:false, busted:false, doubled:false, splitAces:(c2.rank==="A") };
  state.activeHandIndex = 0;

  // אם פיצול אסים – ברוב המקומות מקבלים רק קלף אחד לכל יד
  if(c1.rank==="A" && c2.rank==="A"){
    state.players[0].cards.push(drawCard());
    state.players[1].cards.push(drawCard());
    state.players[0].done = true;
    state.players[1].done = true;
  }

  renderHands();
  setButtons();

  // אם שני הידיים של אסים – נעבור ישר לדילר
  if(state.players[0].done && state.players[1].done){
    dealerTurn();
  }
}

function nextHandOrDealer(){
  // עבור ליד הבאה אם קיימת
  if(state.players[1] && state.activeHandIndex===0){
    state.activeHandIndex = 1;
    renderHands();
    setButtons();
    return;
  }
  // כולם סיימו – דילר
  dealerTurn();
}

function dealerTurn(){
  state.dealer.hidden = false;
  renderHands();

  // אם כל הידיים באסט – אין צורך לשחק לדילר
  const hasLiveHand = state.players.some(h=>h && !h.busted);
  if(!hasLiveHand){
    resolveRound();
    return;
  }

  // משחק דילר
  while(true){
    const v = handValue(state.dealer.cards);
    const stopAt = 17;
    if(v.total > 21) break;
    if(v.total > 17) break;
    if(v.total === 17){
      if(GAME_CFG.dealerStandSoft17 || !v.soft) break;
    }
    state.dealer.cards.push(drawCard());
    renderHands();
  }

  // בסט לדילר?
  const v = handValue(state.dealer.cards).total;
  if(v>21){
    showTag(els.dealerTag, "BUST", "tag--bust");
  }
  resolveRound();
}

function resolveRound(initialBlackjackCheck=false){
  state.roundOver = true;

  const dealerV = handValue(state.dealer.cards).total;
  const dealerBust = dealerV>21;
  let roundResult = "Push"; // לשורה בסטטיסטיקה בסוף נקבע מי ניצח יותר (או תיקו)

  let playerWins=0, dealerWins=0;

  for(let i=0;i<state.players.length;i++){
    const hand = state.players[i];
    if(!hand) continue;

    const playerV = handValue(hand.cards).total;
    let payout = 0;
    let outcome = "";

    if(initialBlackjackCheck){
      const pBJ = isBlackjack(hand.cards);
      const dBJ = isBlackjack(state.dealer.cards);
      if(pBJ && dBJ){ payout = hand.bet; outcome="Push"; }
      else if(pBJ){ payout = hand.bet*(1+GAME_CFG.blackjackPayout); outcome="PlayerBJ"; }
      else if(dBJ){ payout = 0; outcome="DealerBJ"; }
    }else{
      if(hand.busted){ payout = 0; outcome="Dealer"; }
      else if(dealerBust){ payout = hand.bet*2; outcome="Player"; }
      else {
        if(playerV>dealerV){ payout = hand.bet*2; outcome="Player"; }
        else if(playerV<dealerV){ payout = 0; outcome="Dealer"; }
        else { payout = hand.bet; outcome="Push"; }
      }
    }

    // עדכון יתרה
    const before = state.bankroll;
    state.bankroll += payout;
    animateBankroll(before, state.bankroll);

    // טוסטר ליד הראשונה
    if(i===0){
      if(outcome==="PlayerBJ") showToast("bj","BlackJack!!!");
      else if(outcome==="Player") showToast("win","ניצחת!");
      else if(outcome==="Dealer" || outcome==="DealerBJ") showToast("lose","הפסדת..");
      else showToast(null,"Push");
    }

    // סטטוס לספירה
    if(outcome==="Player"||outcome==="PlayerBJ") playerWins++;
    else if(outcome==="Dealer"||outcome==="DealerBJ") dealerWins++;
  }

  // הוספת שורת סטטיסטיקה (מי ניצח יותר ידיים)
  if(playerWins>dealerWins) roundResult = "P";
  else if(dealerWins>playerWins) roundResult = "D";
  else roundResult = "Push";

  state.stats.rows.push(roundResult);
  if(state.stats.rows.length>GAME_CFG.maxStatRows){
    state.stats.rows = state.stats.rows.slice(-GAME_CFG.maxStatRows);
  }
  renderStats();
  persist();

  // סוף – הצגת כפתור "יד חדשה", החזרת שורת הצ'יפים
  els.newRoundBtn.hidden = false;
  setButtons();
}

function newRound(){
  els.newRoundBtn.hidden = true;
  els.chipRow.style.display = "";
  els.betChips.innerHTML = ""; // לאחר סיבוב – מנקים את מרכז השולחן
  els.betAmount.textContent = "$0";
  state.players[0].bet = 0;
  state.lastBetBreakdown = [];
  state.betPhase = true;
  state.roundOver = false;
  state.dealer = { cards: [], hidden: true };
  state.players = [{ cards:[], bet:0, done:false, busted:false, doubled:false, splitAces:false }];
  state.activeHandIndex = 0;
  renderHands();
  setButtons();
}

// ======= חיבור אירועים =======
function wire(){
  // כפתורים
  els.dealBtn.addEventListener("click", deal);
  els.clearBetBtn.addEventListener("click", clearBet);
  els.rebetBtn.addEventListener("click", handleRebet);

  els.hitBtn.addEventListener("click", hit);
  els.standBtn.addEventListener("click", stand);
  els.doubleBtn.addEventListener("click", doubleDown);
  els.splitBtn.addEventListener("click", split);
  els.newRoundBtn.addEventListener("click", newRound);
}

// ======= אתחול =======
function init(){
  // קבע את תמונת גב הקלף מהקונפיג (ל‑CSS)
  document.documentElement.style.setProperty("--card-back-url", `url("${ASSETS.back}")`);

  loadState();
  renderBankroll();
  renderStats();
  renderChipsBar();

  // בונה חפיסה
  state.shoe = buildShoe();

  // מצב התחלתי
  state.betPhase = true;
  setButtons();
  wire();
}

init();
