const swiperWrapper = document.querySelector('.swiper-wrapper');
const icons = document.querySelectorAll(".icon");
const listtxt = document.querySelector(".listtxtin");
const swipertop = document.querySelector(".swiper");
const pcount = document.querySelector('.pcount p');


      
      fetch('slideData.json')
      .then(res => res.json())
      .then(data => {
        generateSlides(data);
        randomPosi();
        applyFilter('all');
        attachSlideEvents(); // 클릭 이벤트 등 연결
      });

function generateSlides(dataList) {
  swiperWrapper.innerHTML = ''; // 기존 삭제
  dataList.forEach(data => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `
      <div class="pleft" style="background-color: ${data.backgroundColor}">
        <div class="pinfo">
          <div class="pyear"><h1>${data.year}</h1></div>
          <div class="pin"><img src="img/emoji/clip.png" alt=""></div>
          <div class="ptitle">
            <h1>${data.titleKor}  </h1>
            <h1>${data.titleEng}</h1>
          </div>
        </div>
        <div class="pimg">
          <div class="pthumb"><img src="${data.thumb}" alt=""></div>
          <div class="pimgrest">
          ${data.pleft.join("")}
          
          </div>
        </div>
      </div>
      <div class="pcateimg">
        ${data.categories.map(cat => `<img src="${cat.emoji}" data-category="${cat.category}" alt="">`).join('')}
      </div>
      <div class="pright">
        <div class="xbtn"><i class="fas fa-arrow-alt-circle-left"></i></div>
        <div class="wordblock">
        ${data.description.join("")}
      </div>
        <div class="grada"></div>
        <div class="info">
        ${data.info.map(info => `
        <div class="infobox">
          <div class="infoicon"><img src="img/emoji/box.png" alt=""></div>
          <div class="infoletter"><h1>${info.output}</h1></div>
        </div>
        <div class="infobox">
          <div class="infoicon"><img src="img/emoji/tool.png" alt=""></div>
          <div class="infoletter"><h1>${info.tool}</h1></div>
        </div>
        <div class="infobox">
          <div class="infoicon"><img src="img/emoji/time.png" alt=""></div>
          <div class="infoletter"><h1>${info.time}</h1></div>
        </div>
      `).join('')}
        </div>
      </div>
    `;
    swiperWrapper.appendChild(slide);
  });
}

function randomPosi() {
  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach(slide => {
    const top = Math.floor(Math.random() * 200) - 5;
    const deg = Math.floor(Math.random() * 11) - 5;
    slide.style.top = `${top}px`;
    slide.style.transform = `rotate(${deg}deg)`;
  });
}

function applyFilter(filter) {
  const slides = document.querySelectorAll('.swiper-slide');
  let count = 0;
  slides.forEach(slide => {
    const categories = slide.querySelectorAll('.pcateimg img');
    const match = [...categories].some(img => img.dataset.category === filter);
    const shouldShow = match || filter === 'all';
    slide.classList.toggle('hidden', !shouldShow);
    if (shouldShow) count++;
  });
  pcount.innerText = `(${count})`;
  swiper.update();
}

function attachSlideEvents() {
  const slides = document.querySelectorAll('.swiper-slide');
  const xbtns = document.querySelectorAll('.xbtn');
 
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      slides.forEach(s => {
        const isActive = s === slide;
        s.classList.toggle('click', isActive);
        s.classList.toggle('hidden', !isActive);
        if (isActive) {
          s.style.top = `0px`;
          s.style.transform = `rotate(0deg)`;

        }
      });
      swipertop.classList.add('click');
      swiperWrapper.style.transform = 'translate3d(0px, 0px, 0px)';

    });
  });

  xbtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      slides.forEach(s => {
        s.classList.remove('click', 'hidden');
      });
      swipertop.classList.remove('click');
      const current = document.querySelector('.icon.on');
      const filter = current ? current.dataset.filter : 'all';
      applyFilter(filter);
    });
  });
}

icons.forEach(icon => {
  icon.addEventListener("click", () => {
    
        
    const filter = icon.dataset.filter;
    icons.forEach(i => i.classList.toggle("on", i === icon));
    listtxt.innerText = icon.dataset.filter;
    about.classList.remove('on');
    aboutbttn.innerHTML=`about <i class="fas fa-arrow-alt-circle-right"></i>`;


    swipertop.classList.remove('click');
    document.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('click'));
    applyFilter(filter);
    randomPosi();
  });

  icon.addEventListener('mouseenter', () => {
    listtxt.innerText = icon.dataset.filter;
  });
  icon.addEventListener('mouseleave', () => {
    const current = document.querySelector('.icon.on');
    if (current) listtxt.innerText = current.dataset.filter;
  });
});


// 초기화
window.addEventListener('DOMContentLoaded', () => {
  listtxt.innerText = 'all';
  applyFilter('all');
  randomPosi();
  attachSlideEvents();
});

const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,                // 루프 모드 활성화
        centeredSlides: false,      // 현재 슬라이드를 가운데 정렬
        slidesPerView: 'auto',     // 슬라이드 크기 자동 설정
        spaceBetween: 0,          // 슬라이드 간격
        grabCursor: true,
     
});



const pimgList = document.querySelectorAll('.pleft');

pimgList.forEach(pimg => {
  pimg.addEventListener('scroll', () => {
    const slide = pimg.closest('.swiper-slide'); // 상위 slide 요소
    const pinfo = slide.querySelector('.pinfo');

    if (pimg.scrollTop > 5) {
      pinfo.classList.add('shrink');
    } else {
      pinfo.classList.remove('shrink');
    }
  });
});

const about = document.querySelector(".about");
const aboutbttn = document.querySelector(".aboutbttn");

aboutbttn.addEventListener('click', ()=>{
       

        if (about.classList.contains('on')) {
                about.classList.remove('on');

                aboutbttn.innerHTML=`about <i class="fas fa-arrow-alt-circle-right"></i>`;
              } else {
                about.classList.add('on');
                aboutbttn.innerHTML=`<i class="fas fa-arrow-alt-circle-left"></i>`;
                // 첫 클릭 시 동작
              }
})
