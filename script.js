
(()=>{
 const root=document.getElementById('ev-white'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const design={motion:true,lines:75,strength:55};let page=root.querySelector('[data-page].is-active')?.dataset.page || 'home',width=1000,height=690,px=0,py=0,tx=0,ty=0,phase=0,last=0,visible=true;
 function resize(){width=root.clientWidth;height=root.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
 // A perspective landscape drawn from contour lines. Its folds travel slowly as one surface.
 function draw(){ctx.clearRect(0,0,width,height);const scale=width/1000;const strength=design.strength/100;const opacity=page==='home'?1:.32;const rows=design.lines;for(let j=0;j<rows;j++){const v=j/(rows-1);ctx.beginPath();for(let i=0;i<=125;i++){const u=i/125;const x=(u-.5)*1320;const z=(v-.5)*660;const swell=78*Math.sin(x*.0048+z*.006+phase*.26)+46*Math.cos(x*.008-z*.003-phase*.19);const peak=125*Math.exp(-Math.pow((x+175)/230,2)-Math.pow((z+70)/260,2));const dip=-55*Math.exp(-Math.pow((x-270)/170,2)-Math.pow((z-120)/230,2));const h=swell+peak+dip;const depth=1+z*.00045;const sx=width/2+(x*.84+z*.22)/depth*scale+px*(12+v*12);const sy=height*.54+(z*.43-h*.98)/depth+py*(6+v*10);if(i===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy)}const edge=Math.sin(v*Math.PI);ctx.strokeStyle=`rgba(92,101,103,${(.075+edge*.26)*strength*opacity})`;ctx.lineWidth=.65;ctx.stroke()}
 // Sparse cross-contours give the landscape depth without turning it into a grid.
 for(let i=0;i<34;i++){const u=i/33;ctx.beginPath();for(let j=0;j<=80;j++){const v=j/80,x=(u-.5)*1320,z=(v-.5)*660;const h=78*Math.sin(x*.0048+z*.006+phase*.26)+46*Math.cos(x*.008-z*.003-phase*.19)+125*Math.exp(-Math.pow((x+175)/230,2)-Math.pow((z+70)/260,2))-55*Math.exp(-Math.pow((x-270)/170,2)-Math.pow((z-120)/230,2));const depth=1+z*.00045;const sx=width/2+(x*.84+z*.22)/depth*scale+px*(12+v*12);const sy=height*.54+(z*.43-h*.98)/depth+py*(6+v*10);j?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy)}ctx.strokeStyle=`rgba(111,119,121,${.07*strength*opacity})`;ctx.lineWidth=.5;ctx.stroke()}}
 function animate(t){if(!root.isConnected)return;if(visible&&t-last>32){const dt=Math.min((t-last)/1000,.1);last=t;if(design.motion&&!reduced)phase+=dt;px+=(tx-px)*.045;py+=(ty-py)*.045;draw()}requestAnimationFrame(animate)}
 root.addEventListener('pointermove',e=>{if(reduced)return;const r=root.getBoundingClientRect();tx=(e.clientX-r.left)/width-.5;ty=(e.clientY-r.top)/height-.5});root.addEventListener('pointerleave',()=>{tx=ty=0});
 const pages=Array.from(root.querySelectorAll('[data-page]'));
 function switchPage(next){
  if(!pages.some(el=>el.dataset.page===next))return;
  page=next;
  pages.forEach(el=>{const active=el.dataset.page===next;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active));el.inert=!active});
  root.querySelectorAll('.ew-nav [data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.view===next)));
  const more=root.querySelector('.ew-scroll');
  if(more){more.style.opacity=next==='home'?'1':'0';more.inert=next!=='home'}
  draw();
 }
 // Hash links make sections shareable and allow browser Back/Forward navigation.
 function navigate(next){if(location.hash.slice(1)===next)switchPage(next);else location.hash=next}
 root.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.view)));
 if(pages.some(el=>el.dataset.page==='home')){
  const syncLocation=()=>switchPage(pages.some(el=>el.dataset.page===location.hash.slice(1))?location.hash.slice(1):'home');
  addEventListener('hashchange',syncLocation);
  root.addEventListener('keydown',e=>{if(e.key==='Escape')navigate('home')});
  syncLocation();
 }
 const words="i like making things.",typed=root.querySelector('.ew-typed');let count=0;if(typed&&!reduced){typed.textContent='';const typeNext=()=>{if(!root.isConnected)return;typed.textContent=words.slice(0,++count);if(count<words.length)setTimeout(typeNext,words[count-1]===' '?145:65+Math.random()*55)};setTimeout(typeNext,600)}
 new ResizeObserver(resize).observe(root);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting}).observe(root);resize();requestAnimationFrame(animate);

})();
