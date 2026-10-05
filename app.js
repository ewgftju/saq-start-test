const paths = {
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  building:'<path d="m3 9 9-6 9 6M4 10h16M3 21h18M5 18v-5m5 5v-5m4 5v-5m5 5v-5"/>',
  audit:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8m-8 5 2 2 5-5"/>',
  shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  risk:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 7-7M12 3v2M3 12h2m14 0h2m-9 7v2"/>',
  message:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-9.5A8.5 8.5 0 0 1 10.5 4H13"/><path d="M7 10h7m-7 5h9M18 3v6m-3-3h6"/>',
  chart:'<path d="M4 3v18h17M8 16v-5m5 5V7m5 9V4"/>',
  layers:'<path d="m3 7 9-5 9 5-9 5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
const modules = [
  {id:'evga',name:'ЭВГА',code:'ЭВГА',description:'Электронный внутренний государственный аудит',icon:'building',primary:true,url:'https://saq-evga-test.vercel.app/#/cases'},
  {id:'sva',name:'СВА',code:'СВА',description:'Службы внутреннего аудита',icon:'audit',primary:true,url:'https://saq-sva-test.vercel.app/'},
  {id:'prof',name:'Профилактический контроль',code:'ПК',description:'Проведение контроля и исполнение решений',icon:'shield',primary:true,url:'https://saq-prof-test.vercel.app/'},
  {id:'sur',name:'СУР',description:'Система управления рисками',icon:'risk',url:'https://saq-sur-test.vercel.app/'},
  {id:'objections',name:'Возражения',description:'Рассмотрение возражений',icon:'message',url:'https://saq-objections-test.vercel.app/'},
  {id:'analytics',name:'Аналитика',description:'Аналитические данные и отчётность',icon:'chart'},
  {id:'obm',name:'ОБМ',description:'Переход в модуль ОБМ',icon:'layers'}
];
const userSelect=document.getElementById('demo-user');
try { userSelect.value=localStorage.getItem('saq.demo.user.v1')==='saq-demo-superuser'?'saq-demo-superuser':'standard'; } catch {}
const destination = module => {
  if(!module.url)return `#${module.id}`;
  const url=new URL(module.url);
  if(userSelect.value==='saq-demo-superuser')url.searchParams.set('demoUser',userSelect.value);
  return url.href;
};
userSelect.addEventListener('change',()=>{
  try { localStorage.setItem('saq.demo.user.v1',userSelect.value); } catch {}
  document.querySelectorAll('a[data-module]').forEach(link=>{
    const module=modules.find(item=>item.id===link.dataset.module);
    if(module)link.href=destination(module);
  });
});
for(const module of modules.filter(module => module.url)){
  const card=document.createElement('a');
  card.className=`module-card${module.primary?'':' secondary-card'}`;
  card.href=destination(module);
  card.dataset.module=module.id;
  card.innerHTML=`<div class="card-top"><span class="module-icon">${icon(module.icon)}</span>${module.primary?`<span class="module-code">${module.code}</span>`:''}</div><h3>${module.name}</h3><p>${module.description}</p><span class="card-link">Перейти в раздел ${icon('arrow')}</span>`;
  document.getElementById(module.primary?'primary-modules':'secondary-modules').append(card);
  const nav=document.createElement('a');
  nav.className='nav-module';nav.href=destination(module);nav.dataset.module=module.id;nav.title=module.name;nav.setAttribute('aria-label',module.name);
  nav.innerHTML=`${icon(module.icon)}<span class="nav-label">${module.name}</span>`;
  document.getElementById('nav-modules').append(nav);
}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const shell=document.getElementById('shell');
const toggle=document.getElementById('sidebar-toggle');
toggle.addEventListener('click',()=>{
  const expanded=shell.classList.toggle('expanded');
  toggle.setAttribute('aria-expanded',String(expanded));
  toggle.setAttribute('aria-label',expanded?'Свернуть меню':'Развернуть меню');
  toggle.textContent=expanded?'‹':'›';
});
const dialog=document.getElementById('module-dialog');
document.querySelectorAll('[data-module]').forEach(link=>link.addEventListener('click',event=>{
  const module=modules.find(item=>item.id===link.dataset.module);
  if(module.url)return;
  event.preventDefault();
  document.getElementById('dialog-title').textContent=module.name;
  document.getElementById('dialog-icon').innerHTML=icon(module.icon);
  dialog.showModal();
}));
document.getElementById('dialog-close').addEventListener('click',()=>dialog.close());
document.getElementById('dialog-back').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
});
