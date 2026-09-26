import * as THREE from './assets/vendor/three.module.js';

export function mountStarfield(host,weeks,motion=true){
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return {destroy(){},setMotion(){}};}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);host.append(renderer.domElement);
  const card=host.closest('.scene-card'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.1,100);
  camera.position.set(0,4.8,7.4);camera.lookAt(0,0,0);const group=new THREE.Group();scene.add(group);
  const fog=new THREE.FogExp2('#edf0e3',.025);scene.fog=fog;
  const geometries=[],materials=[],textures=[],nodes=[];
  const geometry=g=>(geometries.push(g),g),material=m=>(materials.push(m),m);
  const starGeo=geometry(new THREE.SphereGeometry(.068,12,8));
  const active=material(new THREE.MeshBasicMaterial({color:'#356e59'})),done=material(new THREE.MeshBasicMaterial({color:'#a48544'}));
  const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
  const ctx=glowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.15,'rgba(255,255,255,.55)');gradient.addColorStop(.5,'rgba(255,255,255,.12)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  const glowTexture=new THREE.CanvasTexture(glowCanvas);textures.push(glowTexture);
  const phaseColors=['#56806a','#6f8e66','#93a06e','#a5a077','#b69a7e','#bb9c5b','#7a946b'];
  const phaseMaterials=phaseColors.map(color=>material(new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8})));
  const positions=[];
  weeks.forEach((w,i)=>{const a=i/(weeks.length-1)*Math.PI*3.6-.8,r=1.05+i*.047;const p=new THREE.Vector3(Math.cos(a)*r,Math.sin(i*.39)*.23,Math.sin(a)*r*.65);positions.push(p);
    const node=new THREE.Mesh(starGeo,w.current?active:w.done?done:phaseMaterials[w.phase-1]);node.position.copy(p);node.scale.setScalar(w.current?1.9:w.done?1.35:1);node.userData=w;group.add(node);nodes.push(node);
    if(w.current||i===0||weeks[i-1].phase!==w.phase){const glow=new THREE.Sprite(material(new THREE.SpriteMaterial({map:glowTexture,color:w.done?'#a48544':phaseColors[w.phase-1],transparent:true,opacity:w.current?.75:.35,depthWrite:false,blending:THREE.NormalBlending})));glow.position.copy(p);glow.scale.setScalar(w.current?.85:.6);group.add(glow);}
    if(w.current){const halo=new THREE.Mesh(geometry(new THREE.RingGeometry(.14,.16,42)),material(new THREE.MeshBasicMaterial({color:'#356e59',side:THREE.DoubleSide,transparent:true,opacity:.65})));halo.position.copy(p);halo.rotation.x=-Math.PI/2;group.add(halo);}
  });
  const pathGeo=geometry(new THREE.BufferGeometry().setFromPoints(positions));group.add(new THREE.Line(pathGeo,material(new THREE.LineBasicMaterial({color:'#8b9d7c',transparent:true,opacity:.8}))));
  for(let r=1.4;r<=3.6;r+=.7){const ring=new THREE.Mesh(geometry(new THREE.RingGeometry(r,r+.003,100)),material(new THREE.MeshBasicMaterial({color:'#9aa58b',transparent:true,opacity:.3,side:THREE.DoubleSide})));ring.rotation.x=-Math.PI/2;ring.position.y=-.45;group.add(ring);}
  // 固定伪随机星尘，不因刷新改变课程节点位置。
  let seed=82;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const points=[];for(let i=0;i<430;i++)points.push((rand()-.5)*17,(rand()-.5)*7-1,(rand()-.5)*12);
  const dust=geometry(new THREE.BufferGeometry());dust.setAttribute('position',new THREE.Float32BufferAttribute(points,3));scene.add(new THREE.Points(dust,material(new THREE.PointsMaterial({color:'#8b9e7c',size:.026,transparent:true,opacity:.72,depthWrite:false}))));
  const tooltip=document.createElement('div');tooltip.className='star-tooltip';tooltip.hidden=true;card.append(tooltip);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();ray.params.Points.threshold=.2;
  const hit=e=>{const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(nodes)[0]?.object;};
  function onMove(e){const node=hit(e);renderer.domElement.style.cursor=node?'pointer':'default';tooltip.hidden=!node;if(node)tooltip.textContent=`第 ${node.userData.week} 周 · ${node.userData.title}`;}
  function onLeave(){tooltip.hidden=true;}
  function onClick(e){const node=hit(e);if(node)location.hash=`week/${node.userData.week}`;}
  renderer.domElement.addEventListener('pointermove',onMove);renderer.domElement.addEventListener('pointerleave',onLeave);renderer.domElement.addEventListener('click',onClick);
  let frame=0,visible=true,disposed=false,start=performance.now();
  function draw(now){frame=0;if(disposed)return;if(motion&&!document.hidden&&visible)group.rotation.y=Math.sin((now-start)/14000)*.07;renderer.render(scene,camera);if(motion&&!document.hidden&&visible)frame=requestAnimationFrame(draw);}
  function schedule(){cancelAnimationFrame(frame);frame=0;if(!disposed&&!document.hidden&&visible)frame=requestAnimationFrame(draw);}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();schedule();}
  const observer=new ResizeObserver(resize);observer.observe(host);const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});intersection.observe(host);document.addEventListener('visibilitychange',schedule);
  function contextLost(e){e.preventDefault();card.classList.remove('ready');cancelAnimationFrame(frame);tooltip.hidden=true;}
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  resize();card.classList.add('ready');
  return {setMotion(value){motion=value;schedule();},destroy(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',schedule);renderer.domElement.removeEventListener('pointermove',onMove);renderer.domElement.removeEventListener('pointerleave',onLeave);renderer.domElement.removeEventListener('click',onClick);renderer.domElement.removeEventListener('webglcontextlost',contextLost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();tooltip.remove();card.classList.remove('ready');}};
}
