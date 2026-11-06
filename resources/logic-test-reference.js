const stub=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':stub(),apply:()=>stub(),set:()=>true});
const blk=require('fs').readFileSync('/tmp/blk.js','utf8');
const body=`let lang='fr';const TX=a=>a[lang=='en'?1:0];const $=()=>stub(),$$=()=>stub(),beep=()=>{},seen={},seg=()=>{},document={querySelector:()=>stub(),body:{classList:{contains:()=>false}}},matchMedia=()=>({matches:true});
${blk}
return {H,Q,DISC,P,deal,reset,draw,discard,get A(){return A},get F(){return F}};`;
const m=new Function('stub',body)(stub);
const j=x=>JSON.stringify(x);let ok=true;const t=(n,c)=>{console.log(c?'OK ':'KO ',n);ok=ok&&c};
t('départ : main = stages',j(m.H)=='[0,1]'&&j(m.Q.sco)=='[2,3,4,"soon"]');
m.deal('sReact',p=>p.k.some(k=>k.includes('React')));
t('filtre React → Open Cowork + AudioNote',j(m.H)=='[0,5]'&&j(m.Q.pro)=='[1]'&&j(m.Q.perso)=='["soon"]'&&m.F=='sReact');
m.deal('f1',p=>p.cat==1);t('famille Scolaires → 3 cartes, stages dans la pioche Stages',j(m.H)=='[2,3,4]'&&j(m.Q.pro)=='[0,1]');
m.reset();t('reset → état initial',j(m.H)=='[0,1]'&&m.F===null&&m.DISC.length==0);
m.draw('sco');
setTimeout(()=>{t('pioche scolaire → bridge en main',j(m.H)=='[0,1,2]'&&j(m.Q.sco)=='[3,4,"soon"]'&&m.A==2);
m.discard(1);setTimeout(()=>{t('défausse Lunio',j(m.H)=='[0,2]'&&j(m.DISC)=='[1]');
m.draw('disc');t('reprise depuis la défausse',j(m.H)=='[0,2,1]'&&m.DISC.length==0);
m.deal('f3',()=>true);t('Tous → 6 cartes en main',m.H.length==6);
m.discard(0);m.discard(1);setTimeout(()=>{t('défausse multiple + A borné',m.H.length==4&&m.DISC.length==2&&m.A<=3);process.exit(ok?0:1)},20)},20)},800);
