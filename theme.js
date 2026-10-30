(function(){
  'use strict';
  var root=document.documentElement;
  var key='feecut-theme';
  var choice='auto';
  try { var saved=localStorage.getItem(key); if(['auto','light','dark'].indexOf(saved)!==-1) choice=saved; } catch(e) {}
  var override=new URLSearchParams(location.search).get('theme');
  if(['auto','light','dark'].indexOf(override)!==-1) choice=override;
  var media=window.matchMedia('(prefers-color-scheme: dark)');
  function apply(){
    root.dataset.theme=choice;
    root.dataset.resolvedTheme=choice==='auto'?(media.matches?'dark':'light'):choice;
  }
  apply();
  if(media.addEventListener) media.addEventListener('change',apply); else if(media.addListener) media.addListener(apply);
  function setup(){
    var header=document.querySelector('header .wrap');
    if(!header||header.querySelector('.theme-switch')) return;
    var wrap=document.createElement('div'); wrap.className='theme-switch';
    var trigger=document.createElement('button');trigger.type='button';trigger.className='theme-trigger';
    trigger.setAttribute('aria-label','Тема оформления');trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');
    var symbol=document.createElement('img');symbol.width=22;symbol.height=22;symbol.alt='';trigger.appendChild(symbol);
    var menu=document.createElement('div');menu.className='theme-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','Тема оформления');menu.hidden=true;
    var modes=[['auto','Как в системе'],['light','Светлая'],['dark','Тёмная']];
    var buttons=[];
    function close(focus){menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
    function update(){
      symbol.src='/assets/'+(choice==='auto'?'auto':choice==='light'?'sun':'moon')+'.svg';
      buttons.forEach(function(b){b.setAttribute('aria-checked',b.dataset.mode===choice?'true':'false');});
    }
    modes.forEach(function(mode){
      var b=document.createElement('button');b.type='button';b.dataset.mode=mode[0];b.setAttribute('role','menuitemradio');
      var icon=document.createElement('img');icon.alt='';icon.width=19;icon.height=19;icon.src='/assets/'+(mode[0]==='auto'?'auto':mode[0]==='light'?'sun':'moon')+'.svg';
      var label=document.createElement('span');label.textContent=mode[1];b.appendChild(icon);b.appendChild(label);
      b.addEventListener('click',function(){choice=mode[0];try{localStorage.setItem(key,choice);}catch(e){}apply();update();close(true);
        var url=new URL(location.href);url.searchParams.delete('theme');history.replaceState({},'',url);
      });
      menu.appendChild(b);buttons.push(b);
    });
    trigger.addEventListener('click',function(){var open=menu.hidden;menu.hidden=!open;trigger.setAttribute('aria-expanded',open?'true':'false');if(open)buttons[modes.findIndex(function(m){return m[0]===choice;})].focus();});
    wrap.addEventListener('keydown',function(e){
      if(e.key==='Escape'){close(true);return;}
      if(menu.hidden) return;
      var i=buttons.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();}
      if(e.key==='Home'){e.preventDefault();buttons[0].focus();}
      if(e.key==='End'){e.preventDefault();buttons[buttons.length-1].focus();}
    });
    document.addEventListener('click',function(e){if(!wrap.contains(e.target))close(false);});
    document.addEventListener('focusin',function(e){if(!wrap.contains(e.target))close(false);});
    wrap.appendChild(trigger);wrap.appendChild(menu);header.appendChild(wrap);
    var cta=document.createElement('a');cta.className='header-cta';cta.href='https://t.me/FeeCutEnergyBot?start=p_CALC';cta.textContent='Открыть бот';header.appendChild(cta);
    update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
