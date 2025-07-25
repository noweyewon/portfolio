const swipertop = document.querySelector('.gridbox');
const icons = document.querySelectorAll(".icon");
const listtxt = document.querySelector(".listtxtin");
const pcount = document.querySelector('.pcount p');
const about = document.querySelector(".about");
const aboutbttn = document.querySelector(".aboutbttn");

fetch('json/index.json')
  .then(res => res.json())
  .then(projects => {
    generateThumbnails(projects, () => {
      // URL에서 filter 쿼리 읽기
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter') || 'all';
  
      icons.forEach(icon => {
        icon.classList.toggle('on', icon.dataset.filter === filter);
      });
  
      listtxt.innerText = filter;
      applyFilter(filter);
      randomPosi();
  
      attachFilterEvents(projects);
    });
  });

  function generateThumbnails(dataList, callback) {
    swipertop.innerHTML = '';
    dataList.forEach((data, index) => {
      const el = document.createElement('div');
      el.classList.add('gridframe');
      el.innerHTML = `
        <div class="gridpost" data-id="${data.id}">
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
            </div>
          </div> 
          <div class="pcateimg">
            ${data.categories.map(cat => `<img src="${cat.emoji}" data-category="${cat.category}" alt="">`).join('')}
          </div>
        </div>
      `;
  
      el.querySelector('.gridpost').addEventListener('click', () => {
        // 현재 URL에서 필터 쿼리 가져오기
        const currentFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
        window.location.href = `post.html?id=${data.id}&filter=${currentFilter}`;
      });
  
      swipertop.appendChild(el);
    });
  
    pcount.innerText = `(${dataList.length})`;
  
    if (callback) callback();
  }
  

function applyFilter(filter) {
  const frames = document.querySelectorAll('.gridframe');
  let count = 0;
  frames.forEach(frame => {
    const categories = frame.querySelectorAll('.pcateimg img');
    const match = [...categories].some(img => img.dataset.category === filter);
    const shouldShow = match || filter === 'all';
    frame.classList.toggle('hidden', !shouldShow);
    if (shouldShow) count++;
  });
  pcount.innerText = `(${count})`;
}

function attachFilterEvents(projects) {
  icons.forEach(icon => {
    icon.addEventListener("click", () => {
      const filter = icon.dataset.filter;
      // sessionStorage 대신 URL 쿼리 변경
      const url = new URL(window.location);
      url.searchParams.set('filter', filter);
      window.history.pushState({}, '', url); // 주소만 변경(페이지 이동 X)

      icons.forEach(i => i.classList.toggle("on", i === icon));
      listtxt.innerText = filter;
      applyFilter(filter);
      randomPosi();
    });

    icon.addEventListener("mouseenter", () => {
      listtxt.innerText = icon.dataset.filter;
    });

    icon.addEventListener("mouseleave", () => {
      const current = document.querySelector(".icon.on");
      if (current) listtxt.innerText = current.dataset.filter;
    });
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

// about 버튼
aboutbttn.addEventListener('click', () => {
  if (about.classList.contains('on')) {
    about.classList.remove('on');
    aboutbttn.innerHTML = `about <i class="fas fa-arrow-alt-circle-right"></i>`;
  } else {
    about.classList.add('on');
    aboutbttn.innerHTML = `<i class="fas fa-arrow-alt-circle-left"></i>`;
  }
});
