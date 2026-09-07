const stories=[
{topic:"FOOTBALL",title:"The Strangest Corner Kick",text:`The score was 2–2 and there were only thirty seconds left. Jay's team had one final corner. Instead of crossing the ball into the crowded box, Jay spotted his goalkeeper jogging forward. He whispered a plan to Mia, who took the corner quickly. The ball rolled along the ground, Mia sprinted after it and passed to the goalkeeper. He took one touch, looked up and shot. The ball flew past three defenders and into the net. Everyone stared for a second. Then the referee blew the whistle. Jay's team had won 3–2 — and the goalkeeper celebrated by pretending to faint!`,words:["crowded","whispered","sprinted","defenders","celebrated"],
questions:[
["Why did Jay whisper a plan to Mia?",["Because they wanted to surprise the defenders","Because Mia was too far away","Because the referee told them to","Because Jay had forgotten the score"],0],
["What can you infer about the goalkeeper? ",["He never trains","He was willing to take a risk","He disliked football","He was the referee"],1],
["Which event happened immediately before the goalkeeper scored?",["The referee blew the whistle","Mia took the corner","The goalkeeper took one touch and looked up","Jay left the pitch"],2]
]},
{topic:"GAMING",title:"The Glitch That Saved the Game",text:`Noah was one level away from completing his favourite game when something bizarre happened. A tiny robot appeared inside a wall. It could not move, but every time Noah pressed the jump button, the robot made a ridiculous trumpet noise. Noah laughed so hard that he nearly dropped the controller. Then he noticed something useful: the robot's trumpet blast pushed nearby objects backwards. He used the glitch to move a giant crate away from a hidden doorway. Behind it was the key he needed. Noah completed the level and decided not to report the glitch until after his victory screen appeared.`,words:["bizarre","ridiculous","controller","nearby","victory"],
questions:[
["Why was the robot useful?",["It gave Noah extra lives","Its trumpet blast moved objects","It repaired the controller","It opened every doorway"],1],
["What does 'bizarre' most nearly mean here?",["Ordinary","Confusing or strange","Dangerous","Quiet"],1],
["Why did Noah wait before reporting the glitch?",["He wanted to finish the level first","He was scared of the robot","He forgot how to report it","He wanted to quit"],0]
]},
{topic:"TECH",title:"The Homework Bot",text:`Aisha built a small homework bot from spare parts, an old tablet and far too much tape. The bot could read questions aloud and flash a light when it thought an answer was wrong. Unfortunately, its first test was not exactly successful. When Aisha asked it to check a maths problem, it announced, “ERROR: HUMAN IS CONFUSED!” and rolled in a circle. Her little brother laughed. Aisha changed the program so that the bot would give a helpful hint instead of shouting. On the second test, it said, “Try checking your calculation.” Aisha grinned. The bot was finally learning how to be a better helper.`,words:["unfortunately","announced","calculation","helpful","program"],
questions:[
["What was wrong with the bot's first response?",["It gave no sound","It was unhelpful and rude","It solved the problem","It turned itself off"],1],
["Why did Aisha change the program?",["To make the bot more helpful","To make it roll faster","To remove the tablet","To make her brother laugh"],0],
["What is the main idea of the story?",["Robots are always perfect","Building something means never making mistakes","Aisha improved a bot by learning from its mistake","Maths is impossible"],2]
]}
];

let state={story:null,q:0,correct:0,readingStart:0,readingSeconds:0,spellIndex:0,spellCorrect:false,recognition:null};
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0)}
function loadStats(){const h=JSON.parse(localStorage.getItem("rs20_history")||"[]");$("streak").textContent=calcStreak(h);$("bestWpm").textContent=h.length?Math.max(...h.map(x=>x.wpm)):"—";const s=h.filter(x=>x.spelling!=null);$("spellingScore").textContent=s.length?Math.round(s.reduce((a,x)=>a+x.spelling,0)/s.length)+"%":"—"}
function calcStreak(h){if(!h.length)return 0;let days=[...new Set(h.map(x=>x.date))].sort().reverse(),n=0,d=new Date();for(const day of days){const target=d.toISOString().slice(0,10);if(day===target){n++;d.setDate(d.getDate()-1)}else break}return n}
function speak(text){if("speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.88;speechSynthesis.speak(u)}}
function start(){state.story=stories[Math.floor(Math.random()*stories.length)];state.q=0;state.correct=0;state.spellIndex=0;state.spellCorrect=false;$("storyTitle").textContent=state.story.title;$("storyText").textContent=state.story.text;$("topicBadge").textContent=state.story.topic;$("timer").textContent="00:00";$("recordStatus").textContent="";$("warmWords").innerHTML=state.story.words.map((w,i)=>`<button class="word" data-word="${w}">${w}<small>tap to hear</small></button>`).join("");document.querySelectorAll(".word").forEach(b=>b.onclick=()=>speak(b.dataset.word));show("warmup")}
$("startBtn").onclick=start;
$("warmNext").onclick=()=>{state.readingStart=Date.now();show("reading");tick()};
function tick(){if(!$("reading").classList.contains("active"))return;let s=Math.floor((Date.now()-state.readingStart)/1000);state.readingSeconds=s;$("timer").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;setTimeout(tick,500)}
$("listenBtn").onclick=()=>speak(state.story.text);
$("recordBtn").onclick=()=>{
 if(!("SpeechRecognition"in window||"webkitSpeechRecognition"in window)){ $("recordStatus").textContent="Voice reading isn't supported by this browser. You can still read aloud and tap 'I've finished reading'.";return}
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new R();state.recognition=r;r.lang="en-GB";r.continuous=true;r.interimResults=false;$("recordStatus").textContent="🎙️ Listening… read the story aloud, then tap Stop.";r.start();
 r.onresult=e=>{let heard=[...e.results].map(x=>x[0].transcript).join(" ");state.heard=heard};
 r.onerror=()=>{$("recordStatus").textContent="I couldn't hear that clearly. You can try again or continue."};
 r.onend=()=>{$("recordStatus").textContent="Voice check finished. Great effort!"};
 $("recordBtn").textContent="⏹️ Stop listening";$("recordBtn").onclick=()=>{r.stop();$("recordBtn").textContent="🎙️ Read aloud";};
};
$("readingDone").onclick=()=>{if(state.recognition)try{state.recognition.stop()}catch(e){};showQuestion()};
function showQuestion(){const q=state.story.questions[state.q];$("questionCounter").textContent=`Question ${state.q+1} of ${state.story.questions.length}`;$("question").textContent=q[0];$("answers").innerHTML=q[1].map((a,i)=>`<button class="answer" data-i="${i}">${a}</button>`).join("");$("feedback").textContent="";$("nextQuestion").disabled=true;document.querySelectorAll(".answer").forEach(b=>b.onclick=()=>answer(+b.dataset.i));show("detective")}
function answer(i){const q=state.story.questions[state.q];document.querySelectorAll(".answer").forEach(b=>b.disabled=true);if(i===q[2]){state.correct++;$("feedback").textContent="✅ Nice detective work!";$("feedback").style.color="#15803d";document.querySelectorAll(".answer")[i].classList.add("correct")}else{$("feedback").textContent="Not quite. The story gives us a clue — have another look in your head.";document.querySelectorAll(".answer")[i].classList.add("wrong");document.querySelectorAll(".answer")[q[2]].classList.add("correct");$("feedback").style.color="#b45309"}$("nextQuestion").disabled=false}
$("nextQuestion").onclick=()=>{state.q++;if(state.q<state.story.questions.length)showQuestion();else startSpelling()};
function startSpelling(){state.spellIndex=0;state.spellCorrect=false;show("spelling");speak(state.story.words[0]);$("spellInput").value="";$("spellFeedback").textContent=""}
$("spellHear").onclick=()=>speak(state.story.words[state.spellIndex]);
$("spellCheck").onclick=()=>{const got=$("spellInput").value.trim().toLowerCase();const want=state.story.words[state.spellIndex].toLowerCase();if(got===want){state.spellCorrect=true;$("spellFeedback").textContent="✅ Correct!";$("spellFeedback").style.color="#15803d"}else{$("spellFeedback").textContent=`The spelling is “${want}”. Type it once more.`;$("spellFeedback").style.color="#b45309";state.spellCorrect=false}setTimeout(()=>finish(),650)};
function finish(){const wc=state.story.text.split(/\s+/).filter(Boolean).length;const minutes=Math.max(state.readingSeconds/60,.25);const wpm=Math.round(wc/minutes);const accuracy=Math.round(state.correct/state.story.questions.length*100);const spelling=state.spellCorrect?100:0;const item={date:new Date().toISOString().slice(0,10),wpm,accuracy,spelling,topic:state.story.topic};const h=JSON.parse(localStorage.getItem("rs20_history")||"[]");h.push(item);localStorage.setItem("rs20_history",JSON.stringify(h.slice(-30)));$("resultWpm").textContent=wpm;$("resultAccuracy").textContent=accuracy+"%";$("resultSpelling").textContent=spelling+"%";$("finishMessage").textContent=wpm>120?"🔥 Brilliant pace! Keep your accuracy high as you speed up.":"💪 Great work. Focus on smooth, accurate reading — speed will grow with practice.";loadStats();show("finish")}
$("homeBtn").onclick=()=>show("home");
$("parentBtn").onclick=()=>{renderDashboard();show("parent")};
$("parentBack").onclick=()=>show("home");
function renderDashboard(){const h=JSON.parse(localStorage.getItem("rs20_history")||"[]");$("dashSessions").textContent=h.length;$("dashWpm").textContent=h.length?h.at(-1).wpm:"—";$("dashAccuracy").textContent=h.length?h.at(-1).accuracy+"%":"—";$("history").innerHTML=h.slice().reverse().slice(0,10).map(x=>`<div class="history-row"><span>${x.date} · ${x.topic}</span><b>${x.wpm} WPM · ${x.accuracy}%</b></div>`).join("")||"<p>No missions yet.</p>"}
$("resetBtn").onclick=()=>{if(confirm("Reset all ReadSmart progress?")){localStorage.removeItem("rs20_history");loadStats();renderDashboard()}};
loadStats();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
