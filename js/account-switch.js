/**
 * ACCOUNT SWITCH — Click avatar in header to switch Parent/Children/Family
 * Child to Parent requires OTP 7890
 */
(function(){
'use strict';
var C=function(n){if(n>=1e7)return'₹'+(n/1e7).toFixed(2)+'Cr';if(n>=1e5)return'₹'+(n/1e5).toFixed(1)+'L';return'₹'+n.toLocaleString('en-IN');};
var CUR='parent',PEND=null,OTP='7890';
var FAM=[{id:'parent',name:'Rahul Sharma',role:'Parent',a:'RS',c:'#0B1D3A',bal:4520000},{id:'kid1',name:'Arjun Sharma',role:'Child',age:14,a:'AS',c:'#3B82F6',bal:3500,allow:500,lim:500},{id:'kid2',name:'Ananya Sharma',role:'Child',age:10,a:'AN',c:'#EC4899',bal:1200,allow:200,lim:200}];

window.switchAcct=function(id){
  var m=FAM.find(function(x){return x.id===id});if(!m)return;
  if(CUR===id){var d=document.getElementById('acct-dd');if(d)d.classList.add('hidden');return}
  if(CUR!=='parent'&&id==='parent'){PEND=id;var dd=document.getElementById('acct-dd');if(dd)dd.classList.add('hidden');_showOTP();return}
  _doSwitch(id);
};
window.verifyAcctOTP=function(){
  var v='';document.querySelectorAll('#acct-ob input').forEach(function(b){v+=b.value});
  if(v===OTP){document.getElementById('acct-om').classList.add('hidden');_doSwitch(PEND);if(window.App&&App.showToast)App.showToast('Verified!','success')}
  else{if(window.App&&App.showToast)App.showToast('Wrong OTP','error')}
};
function _doSwitch(id){
  var m=FAM.find(function(x){return x.id===id});if(!m)return;CUR=id;
  var ik=m.role==='Child';
  var dn=document.getElementById('acct-name');if(dn)dn.textContent=m.name;
  var dr=document.getElementById('acct-role');if(dr)dr.textContent=ik?'Child':'Private Client';
  var av=document.getElementById('acct-av');if(av){av.textContent=m.a;av.style.background='linear-gradient(135deg,'+m.c+','+m.c+'dd)';av.style.border=ik?'3px solid #10B981':'none'}
  ['parent','kid1','kid2'].forEach(function(aid){var e=document.getElementById('acct-ck-'+aid);if(e)e.className=(aid===id)?'text-emerald-500':'hidden'});
  var d=document.getElementById('acct-dd');if(d)d.classList.add('hidden');
  if(window.App&&App.showToast)App.showToast(ik?m.name:'Parent','info');
  if(window.App)App.renderView('dashboard');
}
function _showOTP(){
  var h='';for(var i=0;i<4;i++)h+='<input type="text" maxlength="1" class="w-10 h-12 bg-white border border-slate-200 rounded-lg text-center text-lg font-bold" data-oi="'+i+'">';
  var ob=document.getElementById('acct-ob');if(ob)ob.innerHTML=h;
  document.getElementById('acct-om').classList.remove('hidden');
  setTimeout(function(){var b=document.querySelector('#acct-ob input');if(b)b.focus()},200);
  document.querySelectorAll('#acct-ob input').forEach(function(b){b.addEventListener('input',function(){if(b.value&&b.dataset.oi<3){var n=document.querySelector('#acct-ob input[data-oi="'+(parseInt(b.dataset.oi)+1)+'"]');if(n)n.focus()}});b.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!b.value&&b.dataset.oi>0){var p=document.querySelector('#acct-ob input[data-oi="'+(parseInt(b.dataset.oi)-1)+'"]');if(p)p.focus()}})});
}
function _renderFam(ct){
  var cards='';FAM.forEach(function(m){var ia=m.id===CUR;cards+='<div class="fb-card p-5 cursor-pointer hover:shadow-md transition-all '+(ia?'border-l-4 border-emerald-400':'')+'" onclick="switchAcct(\''+m.id+'\')"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background:'+m.c+';">'+m.a+'</div><div class="flex-1"><p class="font-semibold text-sm">'+m.name+(ia?' <span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">ACTIVE</span>':'')+'</p><p class="text-xs text-slate-500">'+m.role+(m.role==='Child'?' Age '+m.age+' '+C(m.allow)+'/wk':' Private Client')+'</p></div>'+(m.role==='Child'?'<div class="text-right"><p class="font-bold text-sm">'+C(m.bal)+'</p><p class="text-[10px] text-slate-400">Limit: '+C(m.lim)+'</p></div>':'<div class="text-right"><p class="font-bold text-sm">'+C(m.bal)+'</p></div>')+'</div></div>'});
  var ik=CUR!=='parent';
  var kc=ik?'<div class="fb-card p-5 text-center border-2 border-blue-200" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);"><div class="text-6xl mb-3">Piggy Bank</div><h3 class="text-lg font-bold text-blue-900">Kids Mode</h3><p class="text-3xl font-bold text-blue-700">'+C(FAM.find(function(m){return m.id===CUR}).bal)+'</p><p class="text-xs text-blue-500 mt-1">Ask parent to increase allowance!</p><div class="mt-4"><button onclick="switchAcct(\'parent\')" class="fb-btn fb-btn-primary fb-btn-sm">Switch to Parent (OTP: '+OTP+')</button></div></div>':'<div class="fb-card p-5"><h3 class="text-sm font-semibold mb-3"><i class="fas fa-shield-halved mr-2"></i>Parent Controls</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"><div class="p-4 bg-blue-50 rounded-xl"><p class="font-semibold mb-1">OTP Gated</p><p class="text-xs text-slate-500">Child to Parent needs OTP</p></div><div class="p-4 bg-amber-50 rounded-xl"><p class="font-semibold mb-1">Monitor</p><p class="text-xs text-slate-500">Real-time spend alerts</p></div><div class="p-4 bg-emerald-50 rounded-xl"><p class="font-semibold mb-1">Allowance</p><p class="text-xs text-slate-500">Weekly limits for kids</p></div></div><p class="text-xs text-slate-400 mt-3">Tap a member to switch. Child to Parent needs OTP <b>'+OTP+'</b>.</p></div>';
  ct.innerHTML='<div class="space-y-6 pb-8 fb-animate-in"><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold text-slate-800 dark:text-white">Family Dashboard</h2><p class="text-sm text-slate-500 mt-1">Manage family accounts with OTP-gated switching</p></div></div><div class="space-y-3">'+cards+'</div>'+kc+'</div>';
}
function _injectHeader(){
  var hr=document.querySelector('.fb-header-right');if(!hr)return setTimeout(_injectHeader,300);
  var ex=hr.querySelector('.fb-header-user');if(ex)ex.remove();
  var div=document.createElement('div');div.className='fb-header-user';div.style.position='relative';
  div.innerHTML='<div class="fb-header-user-info hidden sm:block"><p class="name" id="acct-name">Rahul Sharma</p><p class="tier" id="acct-role">Private Client</p></div><div class="fb-avatar" id="acct-av" style="cursor:pointer;" onclick="document.getElementById(\'acct-dd\').classList.toggle(\'hidden\')" title="Switch Account">RS</div><div id="acct-dd" class="hidden absolute top-12 right-0 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"><div class="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"><p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Switch Account</p></div><div class="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700" onclick="switchAcct(\'parent\')"><div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:#0B1D3A;">RS</div><div class="flex-1"><p class="text-sm font-semibold">Rahul Sharma</p><p class="text-[10px] text-slate-400">Parent Private Client</p></div><span id="acct-ck-parent" class="text-emerald-500"><i class="fas fa-check-circle"></i></span></div><div class="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700" onclick="switchAcct(\'kid1\')"><div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:#3B82F6;">AS</div><div class="flex-1"><p class="text-sm font-semibold">Arjun Sharma</p><p class="text-[10px] text-slate-400">Child Age 14 500/wk</p></div><span id="acct-ck-kid1" class="hidden text-emerald-500"><i class="fas fa-check-circle"></i></span></div><div class="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700" onclick="switchAcct(\'kid2\')"><div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:#EC4899;">AN</div><div class="flex-1"><p class="text-sm font-semibold">Ananya Sharma</p><p class="text-[10px] text-slate-400">Child Age 10 200/wk</p></div><span id="acct-ck-kid2" class="hidden text-emerald-500"><i class="fas fa-check-circle"></i></span></div><div class="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700" onclick="App.renderView(\'family-mode\');document.getElementById(\'acct-dd\').classList.add(\'hidden\')"><i class="fas fa-people-roof text-amber-500"></i><div class="flex-1"><p class="text-sm font-semibold">Family Dashboard</p><p class="text-[10px] text-slate-400">Manage all accounts</p></div></div><div class="p-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" onclick="if(confirm(\'Logout?\')){localStorage.clear();location.reload()}"><i class="fas fa-sign-out-alt text-red-400"></i><p class="text-sm text-red-500 font-medium">Logout</p></div></div>';
  hr.appendChild(div);
  var mod=document.createElement('div');mod.id='acct-om';mod.className='hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4';
  mod.innerHTML='<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"><div class="text-5xl mb-4">OTP Lock</div><h3 class="text-lg font-bold mb-2">Parent Verification</h3><p class="text-sm text-slate-500 mb-4">OTP required to switch to parent account</p><div class="bg-slate-100 dark:bg-slate-700 rounded-xl p-3 mb-4"><p class="text-xs text-slate-500 mb-2">Enter 4-digit OTP</p><div class="flex gap-2 justify-center" id="acct-ob"></div><p class="text-[10px] text-slate-400 mt-2">Demo OTP: <b>7890</b></p></div><div class="flex gap-2"><button onclick="document.getElementById(\'acct-om\').classList.add(\'hidden\')" class="flex-1 py-2.5 bg-slate-200 dark:bg-slate-600 rounded-lg text-sm font-medium">Cancel</button><button onclick="verifyAcctOTP()" class="flex-1 py-2.5 text-white rounded-lg text-sm font-semibold" style="background:linear-gradient(135deg,#0B1D3A,#132D52);">Verify</button></div></div>';
  document.body.appendChild(mod);
}
function _wait(cb,r){r=r||100;if(window.App&&window.App.renderView)cb();else if(r>0)setTimeout(function(){_wait(cb,r-1)},100);}
_wait(function(){
  _injectHeader();
  var o=App.renderView.bind(App);App.renderView=function(v){var ct=document.getElementById('main-content');if(!ct)return o(v);if(v==='family-mode'){_renderFam(ct);document.querySelectorAll('.nav-item').forEach(function(e){e.classList.remove('active');if(e.dataset.view===v)e.classList.add('active')});document.getElementById('page-title').textContent='Family Dashboard'}else o(v)};
  setTimeout(function(){var n=document.querySelector('.fb-nav, #sidebar-nav');if(n&&!document.querySelector('[data-view="family-mode"]')){var d=document.createElement('div');d.className='fb-nav-section';d.textContent='Family';n.appendChild(d);var a=document.createElement('a');a.href='#';a.dataset.view='family-mode';a.className='fb-nav-item nav-item';a.innerHTML='<i class="fas fa-people-roof"></i><span class="flex-1">Family Dashboard</span><span class="nav-badge">FAMILY</span>';a.addEventListener('click',function(e){e.preventDefault();App.renderView('family-mode')});n.appendChild(a)}},600);
});
})();
