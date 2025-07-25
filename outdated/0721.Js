const scrollBox = document.querySelector('.gridframe');
const icons = document.querySelectorAll(".icon");
const listtxt = document.querySelector(".listtxtin");
const swipertop = document.querySelector(".gridbox");
const pcount = document.querySelector('.pcount p');

let slideDataLoaded = false;
let slideData = [];

fetch('slideData.json')
  .then(res => res.json())
  .then(data => {
    slideData = data;
    slideDataLoaded = true;
    generateSlides(slideData);
    randomPosi();
    applyFilter('all');
    attachSlideEvents();
  });

function generateSlides(dataList) {
  swipertop.innerHTML = ''; // 기존 삭제
  dataList.forEach(data => {
    const el = document.createElement('div');
    el.classList.add('gridframe');
    el.innerHTML = `
    <div class = gridpost>
      <div class="pleft" style="background-color: ${data.backgroundColor}">
        <div class="pinfo">
          <div class="pyear"><h1>${data.year}</h1></div>
          <div class="ptitle">
            <h1>${data.titleKor}</h1>
            <h2>${data.titleEng}</h2>
          </div>
        </div>
        <div class="pimg">
          <div class="pthumb"><img src="${data.thumb}" class="${data.thumbClass}" loading="lazy"></div>
          <div class="pimgrest">
            ${data.pleft.join("")}
          </div>
        </div>
      </div>
      <div class="pcateimg">
        ${data.categories.map(cat => `<img src="${cat.emoji}" data-category="${cat.category}" alt="">`).join('')}
      </div>
      <div class="pright">
        <div class="xbtn"><img src="img/emoji/okay.png" alt=""></div>
        <div class="wordblock">
          ${data.description.join("")}
        </div>
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
      </div></div>
    `;
    swipertop.appendChild(el);
  });
}

function randomPosi() {
  const boxes = document.querySelectorAll('.gridframe');
  const isMobile = window.innerWidth <= 740;

  boxes.forEach(box => {
    const slide = box.querySelector('.gridpost');
    const deg = Math.floor(Math.random() * 11) - 5;

    if (isMobile) {
      slide.style.transform = `rotate(${deg}deg)`;
    } else {
      const boxWidth = box.clientWidth;
      const slideWidth = slide.clientWidth;
      const maxX = boxWidth - slideWidth;
      const offsetX = Math.floor(Math.random() * maxX) - (maxX / 2);
      const offsetY = Math.floor(Math.random() * 40) - 20;

      slide.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${deg}deg)`;
    }
  });
}

function applyFilter(filter) {
  const scrollBoxes = document.querySelectorAll('.gridframe');
  let count = 0;
  scrollBoxes.forEach(box => {
    const categories = box.querySelectorAll('.pcateimg img');
    const match = [...categories].some(img => img.dataset.category === filter);
    const shouldShow = match || filter === 'all';
    box.classList.toggle('hidden', !shouldShow);
    if (shouldShow) count++;
  });
  pcount.innerText = `(${count})`;
}

function attachSlideEvents() {
  const slides = document.querySelectorAll('.gridpost');
  const xbtns = document.querySelectorAll('.xbtn');
  const scrollBoxes = document.querySelectorAll('.gridframe');

  // iframe src 초기 저장
  document.querySelectorAll('.gridpost iframe').forEach(iframe => {
    iframe.dataset.originalSrc = iframe.src;
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    listtxt.innerText = 'all';
    applyFilter('all');
    randomPosi();
    generateSlides(slideData); // 혹시 필요하면 추가
    attachSlideEvents();
  
    // 필터 적용 후 첫 보이는 슬라이드에 click 클래스 주기
    const firstVisibleBox = [...document.querySelectorAll('.gridframe')].find(box => !box.classList.contains('hidden'));
    if (firstVisibleBox) {
      firstVisibleBox.classList.add('click');
      const slideInBox = firstVisibleBox.querySelector('.gridpost');
      if (slideInBox) slideInBox.classList.add('click');
  
      const iframe = firstVisibleBox.querySelector('iframe');
      if (iframe) iframe.src = iframe.dataset.originalSrc;
    }
  });
  slides.forEach(slide => {
    const iframe = slide.querySelector('iframe');
    if (iframe) {
      iframe.dataset.originalSrc = iframe.src;
      iframe.src = '';  // 초기엔 빈값으로 세팅
    }
    const activeSlide = document.querySelector('.gridpost.click');
    if (activeSlide) {
      const iframe = activeSlide.querySelector('iframe');
      if (iframe) {
        iframe.src = iframe.dataset.originalSrc;
      }
    }
    slide.addEventListener('click', () => {
      const parentBox = slide.closest('.gridframe');

      scrollBoxes.forEach(box => {
        const isActive = box === parentBox;
        const slideInBox = box.querySelector('.gridpost');

        box.classList.toggle('hidden', !isActive);
        box.classList.toggle('click', isActive);
        slide.style.transform = `translate(0px, 0px) rotate(0deg)`;

        if (slideInBox) {
          slideInBox.classList.toggle('click', isActive);
        }

        const iframe = box.querySelector('iframe');
        if (iframe) {
          if (isActive) {
            iframe.src = iframe.dataset.originalSrc;
          } else {
            iframe.src = '';
          }
        }
      });

      swipertop.classList.add('click');
    });
  });

  xbtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      scrollBoxes.forEach(box => {
        box.classList.remove('click', 'hidden');
        const slideInBox = box.querySelector('.gridpost');
        if (slideInBox) {
          slideInBox.classList.remove('click');
        }

        const iframe = box.querySelector('iframe');
        if (iframe) {
          iframe.src = '';
        }
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
    aboutbttn.innerHTML = `about <i class="fas fa-arrow-alt-circle-right"></i>`;

    swipertop.classList.remove('click');
    document.querySelectorAll('.gridpost').forEach(s => s.classList.remove('click'));
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

window.addEventListener('DOMContentLoaded', () => {
  listtxt.innerText = 'all';
  applyFilter('all');
  randomPosi();
  attachSlideEvents();
});

const pimgList = document.querySelectorAll('.pleft');

pimgList.forEach(pimg => {
  pimg.addEventListener('scroll', () => {
    const slide = pimg.closest('.gridpost');
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

aboutbttn.addEventListener('click', () => {
  if (about.classList.contains('on')) {
    about.classList.remove('on');
    aboutbttn.innerHTML = `about <i class="fas fa-arrow-alt-circle-right"></i>`;
  } else {
    about.classList.add('on');
    aboutbttn.innerHTML = `<i class="fas fa-arrow-alt-circle-left"></i>`;
  }
});
