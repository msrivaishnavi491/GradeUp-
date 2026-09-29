const KEY="gradeup_growth_v2";
const defaults={
  skills:[
    {id:1,name:"Java",level:50,target:"Build 2 projects + practice core concepts"},
    {id:2,name:"DSA",level:25,target:"Solve 100 problems"},
    {id:3,name:"SQL / MySQL",level:50,target:"Complete 50 SQL practice questions"},
    {id:4,name:"HTML / CSS / JavaScript",level:75,target:"Build 3 polished frontend projects"}
  ],
  weekly:[
    {id:1,name:"DSA problems",target:10,done:0},
    {id:2,name:"Java practice hours",target:5,done:0},
    {id:3,name:"SQL practice",target:3,done:0},
    {id:4,name:"Project work hours",target:4,done:0}
  ],
  semesters:[],
  career:"Software Developer",
  placement:[
    {id:1,name:"DSA & problem solving",desc:"Regular coding practice and core DSA topics.",done:false},
    {id:2,name:"Technical skills",desc:"Strong fundamentals in your chosen development stack.",done:false},
    {id:3,name:"Projects",desc:"At least one project you can explain end-to-end.",done:false},
    {id:4,name:"Aptitude",desc:"Quantitative, logical and verbal practice.",done:false},
    {id:5,name:"Communication",desc:"Self-introduction, HR answers and technical explanation.",done:false},
    {id:6,name:"Resume & GitHub",desc:"Truthful resume, organized repositories and project evidence.",done:false}
  ]
};
let data=load();
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY))}}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function avg(a){return a.length?a.reduce((s,x)=>s+x,0)/a.length:0}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function skillAvg(){return Math.round(avg(data.skills.map(s=>s.level)))}
function weeklyAvg(){return Math.round(avg(data.weekly.map(x=>Math.min(100,(x.done/x.target)*100))))}
function placementAvg(){return Math.round(avg(data.placement.map(x=>x.done?100:0)))}
function cgpa(){return data.semesters.length?avg(data.semesters.map(x=>x.sgpa)).toFixed(2):"—"}

function renderDashboard(){
  const s=skillAvg(), w=weeklyAvg(), p=placementAvg();
  document.getElementById("statCgpa").textContent=cgpa();
  document.getElementById("statSkill").textContent=s+"%";
  document.getElementById("statSkillSub").textContent=data.skills.length+" skills tracked";
  document.getElementById("statWeekly").textContent=w+"%";
  document.getElementById("statPlacement").textContent=p+"%";
  document.getElementById("heroReadiness").textContent=p+"%";
  const weakest=[...data.skills].sort((a,b)=>a.level-b.level)[0];
  document.getElementById("nextFocus").innerHTML=weakest?
    `<strong>Focus on ${esc(weakest.name)}</strong><span>Your current level is ${weakest.level}%. Target: ${esc(weakest.target)}.</span>`:
    `<strong>Add your first skill</strong><span>Start by tracking the skills you want to develop.</span>`;
  document.getElementById("weeklySnapshot").innerHTML=data.weekly.map(x=>
    `<div class="snapshot-row"><span>${esc(x.name)}</span><strong>${Math.min(x.done,x.target)}/${x.target}</strong></div>`).join("");
  document.getElementById("dashboardSkills").innerHTML=data.skills.slice(0,8).map(s=>
    `<div class="skill-mini"><strong>${esc(s.name)}</strong><div class="bar"><span style="width:${s.level}%"></span></div><small>${s.level}%</small></div>`).join("");
}
function renderSkills(){
  document.getElementById("skillsGrid").innerHTML=data.skills.map(s=>{
    const level=s.level===25?"Beginner":s.level===50?"Learning":s.level===75?"Comfortable":"Strong";
    return `<article class="skill-card"><div class="skill-head"><strong>${esc(s.name)}</strong><span class="level">${level}</span></div><div class="bar"><span style="width:${s.level}%"></span></div><div class="evidence"><b>Target:</b> ${esc(s.target)}</div><input class="skill-range" data-id="${s.id}" type="range" min="25" max="100" step="25" value="${s.level}"><button class="delete" data-delete-skill="${s.id}">Remove skill</button></article>`
  }).join("");
  document.querySelectorAll(".skill-range").forEach(el=>el.oninput=e=>{data.skills.find(s=>s.id==e.target.dataset.id).level=+e.target.value;save()});
  document.querySelectorAll("[data-delete-skill]").forEach(b=>b.onclick=()=>{data.skills=data.skills.filter(s=>s.id!=b.dataset.deleteSkill);save()});
}
function renderWeekly(){
  const pct=weeklyAvg(); document.getElementById("weeklyPercent").textContent=pct+"%";
  document.getElementById("weeklyList").innerHTML=data.weekly.map(x=>`
    <div class="weekly-row"><strong>${esc(x.name)}</strong><span>Target ${x.target}</span>
    <input type="number" min="0" value="${x.done}" data-week="${x.id}">
    <b>${Math.min(100,Math.round(x.done/x.target*100))}%</b>
    <button class="mini-delete" data-delete-week="${x.id}">×</button></div>`).join("");
  document.querySelectorAll("[data-week]").forEach(el=>el.onchange=e=>{data.weekly.find(x=>x.id==e.target.dataset.week).done=Math.max(0,+e.target.value);save()});
  document.querySelectorAll("[data-delete-week]").forEach(b=>b.onclick=()=>{data.weekly=data.weekly.filter(x=>x.id!=b.dataset.deleteWeek);save()});
}
function renderAcademics(){
  document.getElementById("semesterList").innerHTML=data.semesters.length?data.semesters.map(x=>
    `<div class="semester-row"><strong>${esc(x.sem)}</strong><span>SGPA</span><strong>${x.sgpa.toFixed(2)}</strong><button class="mini-delete" data-delete-sem="${x.id}">×</button></div>`).join(""):
    `<p class="muted">No semester results yet. Add your SGPA above.</p>`;
  document.querySelectorAll("[data-delete-sem]").forEach(b=>b.onclick=()=>{data.semesters=data.semesters.filter(x=>x.id!=b.dataset.deleteSem);save()});
}
const roadmaps={
"Software Developer":[["Java / C++","Build strong programming fundamentals."],["DSA","Practice arrays, strings, searching, sorting and core patterns."],["CS Fundamentals","Revise DBMS, OS, CN and OOP."],["Projects","Build and explain real applications."]],
"Full Stack Developer":[["Frontend","HTML, CSS, JavaScript and React."],["Backend","Node, Express and REST APIs."],["Database","SQL/MySQL and data modeling."],["Projects","Build and deploy useful full-stack apps."]],
"Data Analyst":[["Excel","Formulas, cleaning and dashboards."],["SQL","Queries, joins, aggregation and analysis."],["Python","Pandas, NumPy and data handling."],["Visualization","Power BI/Tableau and storytelling."]],
"QA / Test Engineer":[["Testing","SDLC, STLC and test cases."],["Automation","Learn a testing framework."],["API Testing","Understand requests, responses and validation."],["Projects","Document testing work and defects."]],
"Undecided":[["Explore","Try small projects in different areas."],["Fundamentals","Strengthen programming and CS basics."],["Evidence","Track what you enjoy and what you can build."],["Decide","Choose a direction based on experience."]]
};
function renderCareer(){
  const r=roadmaps[data.career]||roadmaps.Undecided;
  document.getElementById("careerRoadmap").innerHTML=r.map((x,i)=>`<div class="road-step"><b>${i+1}. ${x[0]}</b><span>${x[1]}</span></div>`).join("");
  document.getElementById("careerSelect").value=data.career;
}
function renderPlacement(){
  const p=placementAvg(); document.getElementById("placementBig").textContent=p+"%";document.getElementById("placementBar").style.width=p+"%";
  document.getElementById("placementList").innerHTML=data.placement.map(x=>`<article class="check-card"><label><input type="checkbox" data-place="${x.id}" ${x.done?"checked":""}><span><strong>${esc(x.name)}</strong><p>${esc(x.desc)}</p></span></label></article>`).join("");
  document.querySelectorAll("[data-place]").forEach(c=>c.onchange=e=>{data.placement.find(x=>x.id==e.target.dataset.place).done=e.target.checked;save()});
}
function renderAll(){renderDashboard();renderSkills();renderWeekly();renderAcademics();renderCareer();renderPlacement()}
document.querySelectorAll(".nav-link").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".page-section").forEach(x=>x.classList.remove("active-section"));document.getElementById(btn.dataset.section).classList.add("active-section")});
document.getElementById("skillForm").onsubmit=e=>{e.preventDefault();data.skills.push({id:Date.now(),name:skillName.value.trim(),level:+skillLevel.value,target:skillTarget.value.trim()});e.target.reset();save()};
document.getElementById("weeklyForm").onsubmit=e=>{e.preventDefault();data.weekly.push({id:Date.now(),name:activityName.value.trim(),target:+activityTarget.value,done:0});e.target.reset();save()};
document.getElementById("semesterForm").onsubmit=e=>{e.preventDefault();data.semesters.push({id:Date.now(),sem:semester.value.trim(),sgpa:+sgpa.value});e.target.reset();save()};
document.getElementById("careerSelect").onchange=e=>{data.career=e.target.value;save()};
document.getElementById("resetData").onclick=()=>{if(confirm("Reset all GradeUp data?")){localStorage.removeItem(KEY);data=structuredClone(defaults);renderAll()}};
renderAll();
