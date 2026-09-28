import fs from 'node:fs';
import path from 'node:path';

let cache='';
export function baliGuideKnowledge(){
  if(cache) return cache;
  try{
    cache=fs.readFileSync(path.join(process.cwd(),'bali-guide-knowledge.txt'),'utf8').trim();
  }catch(err){
    console.error('Bali guide knowledge unavailable',err);
    cache='';
  }
  return cache;
}

export function baliGuideReference(query,maxChars=18000){
  const text=baliGuideKnowledge();
  if(!text) return '';
  const blocks=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const terms=String(query||'').toLowerCase().match(/[a-z0-9]{3,}/g)||[];
  const useful=new Set(terms.filter(x=>!['what','where','when','which','with','that','this','from','have','about','your','need','want','bali'].includes(x)));
  const scored=blocks.map((b,i)=>{
    const low=b.toLowerCase();
    let score=0;
    for(const t of useful) if(low.includes(t)) score+=3;
    if(/live updates|official|government|airline|medical|legal|visa|entry|levy|arrival|weather|volcan|ceremon|public holiday/.test(low)) score+=1;
    return {b,i,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i-b.i);
  const picks=[]; const seen=new Set();
  for(const hit of scored.slice(0,60)){
    for(let j=Math.max(0,hit.i-2);j<=Math.min(blocks.length-1,hit.i+3);j++){
      if(!seen.has(j)){seen.add(j);picks.push({i:j,b:blocks[j]});}
    }
  }
  picks.sort((a,b)=>a.i-b.i);
  let out='';
  for(const x of picks){
    if((out+x.b+'\n').length>maxChars) break;
    out+=x.b+'\n';
  }
  // Broad questions should still get useful guide context even without keyword matches.
  if(!out){
    out=blocks.slice(0,180).join('\n').slice(0,maxChars);
  }
  return out.trim();
}
