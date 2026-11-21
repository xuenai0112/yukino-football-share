function referenceSlots(rows,now){
 const seats=[null,null,null],replacements=[];
 for(const row of rows){
  if(!(Date.parse(row.kickoff)>now)||(row.expires&&!(Date.parse(row.expires)>now)))continue;
  if(row.slot>=0)seats[row.slot]=row;
  else replacements.push(row);
 }
 let next=0;
 return seats.map(row=>row||replacements[next++]).filter(Boolean);
}
function referenceCounts(rows){
 const formal=rows.filter(row=>row.type==='formal').length;
 return '当前推荐：正式'+formal+'场＋保底'+(rows.length-formal)+'场'+(rows.length<3?'（不足三场，不凑数）':'');
}
function referenceClock(){
 const now=Date.now();
 document.querySelectorAll('[data-reference-top3]').forEach(box=>{
  const list=box.querySelector('[data-reference-rows]');
  const rows=[...list.querySelectorAll('[data-reference-candidate]')].map(node=>({
    node,type:node.dataset.type,kickoff:node.dataset.referenceKickoff,expires:node.dataset.referenceExpires,
    slot:Number(node.dataset.referenceSlot),rank:Number(node.dataset.referenceRank),
  })).sort((a,b)=>a.rank-b.rank);
  const visible=referenceSlots(rows,now),shown=new Set(visible.map(row=>row.node));
  for(const row of rows)row.node.hidden=!shown.has(row.node);
  let anchor=list.firstElementChild;
  for(const row of visible){
    if(anchor!==row.node)list.insertBefore(row.node,anchor);
    anchor=row.node.nextElementSibling;
  }
  box.querySelector('[data-reference-counts]').textContent=referenceCounts(visible);
  box.querySelector('[data-reference-empty]').hidden=visible.length>0;
 });
}
referenceClock();setInterval(referenceClock,1000);const choose=document.querySelector('#date-choice');choose?.addEventListener('change',()=>location.assign(choose.value));const mark=document.querySelector('[data-revision]');function clock(){document.querySelectorAll('[data-kickoff]').forEach(e=>{if(e.dataset.final==='true')return;e.textContent=Date.now()<Date.parse(e.dataset.kickoff)?'尚未到计划开球时间':'已到计划开球时间，赛况待核验';});}clock();setInterval(clock,60000);const root=new URL('.',document.currentScript.src);async function check(){try{const r=await fetch(new URL('site-manifest.json?t='+Date.now(),root),{cache:'no-store'});if(!r.ok)return;const m=await r.json();if(mark?.dataset.latest==='true'&&m.revision!==mark.dataset.revision){const u=new URL('index.html',root);u.searchParams.set('v',m.revision);location.replace(u);}}catch{}}setInterval(check,60000);