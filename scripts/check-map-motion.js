async page=>{
 await page.goto('http://127.0.0.1:5173/login');
 await page.evaluate(()=>{localStorage.setItem('fitjoy.lang','vi');localStorage.setItem('fitjoy.profile',JSON.stringify({username:'motion-preview',role:'admin',gameOnboarded:true,checkPostponed:true}));localStorage.setItem('fitjoy.completed','[1,2,3,4,5]');localStorage.setItem('fitjoy.activeDates','[]')});
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:5173/');
 await page.locator('.journey-map').waitFor();
 const first=page.locator('.adventure-map').first(),last=page.locator('.adventure-map').last();
 await first.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.adventure-map').dataset.moving==='true');
 const before=await first.locator('.island-boat-body').evaluate(el=>getComputedStyle(el).transform);
 await page.waitForFunction(before=>getComputedStyle(document.querySelector('.island-boat-body')).transform!==before,before);
 if(await last.getAttribute('data-moving')!=='false')throw Error('Offscreen map animates');
 await page.getByRole('button',{name:'Chạm ngôi nhà bên bến',exact:true}).first().click();
 await page.getByRole('status').filter({hasText:'Lời chào từ bến cảng!'}).waitFor();
 await page.screenshot({path:'output/living-map.png',scale:'css'});
 await page.emulateMedia({reducedMotion:'reduce'});
 if(await first.locator('.island-boat-body').evaluate(el=>getComputedStyle(el).animationName)!=='none')throw Error('Reduced motion failed');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await last.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.adventure-map').dataset.moving==='false');
 if(await first.locator('.island-tree-crown').first().evaluate(el=>getComputedStyle(el).animationPlayState)!=='paused')throw Error('Offscreen animation not paused');
 await page.locator('.is-current button').scrollIntoViewIfNeeded();
 await page.locator('.is-current button').click();
 await page.getByRole('progressbar').waitFor();
}
