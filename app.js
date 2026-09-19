const steps = [...document.querySelectorAll('.step')];
const panels = [...document.querySelectorAll('.panel')];
const toast = document.getElementById('toast');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

function showStep(id){
  steps.forEach(step => step.classList.toggle('active', step.dataset.step === String(id)));
  panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === String(id)));
  if(window.innerWidth < 1020){
    document.querySelector('.panel-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  try{ localStorage.setItem('vision-current-step', String(id)); }catch(e){}
}

steps.forEach(step => step.addEventListener('click', () => showStep(step.dataset.step)));

function notify(text='Copiado ✓'){
  if(!toast) return;
  toast.textContent=text;
  toast.classList.add('show');
  clearTimeout(window.__visionToastTimer);
  window.__visionToastTimer=setTimeout(()=>toast.classList.remove('show'),1500);
}

async function copyText(id){
  const el=document.getElementById(id);
  if(!el) return;
  const value=el.innerText.trim();
  try{
    await navigator.clipboard.writeText(value);
    notify();
  }catch(e){
    const area=document.createElement('textarea');
    area.value=value;
    area.style.position='fixed';
    area.style.opacity='0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    notify();
  }
}

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',()=>copyText(btn.dataset.copy));
});

function openModal(){
  if(!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeModal(){
  if(!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

document.querySelectorAll('[data-open-note]').forEach(btn=>btn.addEventListener('click',openModal));
modalClose?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal) closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});

let saved='1';
try{ saved=localStorage.getItem('vision-current-step') || '1'; }catch(e){}
showStep(saved);
