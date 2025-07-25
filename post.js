const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const filter = urlParams.get('filter') || 'all';
const listtxt = document.querySelector(".listtxtin");
fetch(`json/post/${projectId}.json`)
  .then(res => res.json())
  .then(data => {
    const project = data[0];
    const container = document.querySelector('.gridframe');

    // 아이콘 필터 클릭 이벤트 & 초기 활성화 상태 세팅
    const icons = document.querySelectorAll(".icon");
    icons.forEach(icon => {
      // 필터 값에 따라 .on 클래스 토글
      icon.classList.toggle('on', icon.dataset.filter === filter);
      listtxt.innerText = filter;
      icon.addEventListener('click', () => {
        const newFilter = icon.dataset.filter;
        window.location.href = `index.html?filter=${newFilter}`;
      });

      icon.addEventListener("mouseenter", () => {
        const listtxt = document.querySelector(".listtxtin");
        if (listtxt) listtxt.innerText = icon.dataset.filter;
      });

      icon.addEventListener("mouseleave", () => {
        const listtxt = document.querySelector(".listtxtin");
        if (!listtxt) return;
        const current = document.querySelector(".icon.on");
        listtxt.innerText = current ? current.dataset.filter : 'all';
      });
    });

    container.innerHTML = `
      <div class="gridpost">
        <div class="pleft" style="background-color: ${project.backgroundColor}">
          <div class="pinfo">
            <div class="pyear"><h1>${project.year}</h1></div>
            <div class="ptitle">
              <h1>${project.titleKor}</h1>
              <h2>${project.titleEng}</h2>
            </div>
          </div>
          <div class="pimg">
            <div class="pimgrest">
              ${(project.pleft || []).join('')}
            </div>
          </div>
        </div>
        <div class="pright">
          <div class="xbtn"><img src="img/emoji/okay.png" alt=""></div>
          <div class="wordblock">
            ${(project.description || []).join('')}
          </div>
          <div class="info">
            ${project.info.map(info => `
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
      </div>
    `;

    // 뒤로가기 버튼(xbtn) 이벤트
    const xbtn = document.querySelector('.xbtn');
    if (xbtn) {
      xbtn.addEventListener('click', () => {
        if (document.referrer && document.referrer.startsWith(location.origin)) {
          history.back();  // 이전 페이지로 돌아가기 (필터 포함 URL 유지)
        } else {
          window.location.href = `index.html?filter=${filter}`; // referrer 없으면 필터 쿼리 포함해서 이동
        }
      });
    }

    const nl = document.getElementById('works');
    nl.addEventListener('click', () => {
        window.location.href = `index.html`;
    });

  })
  .catch(err => {
    console.error('JSON 파일을 불러오지 못했습니다:', err);
    const container = document.querySelector('.gridframe');
    if (container) container.innerHTML = `<h1>프로젝트를 불러올 수 없습니다.</h1>`;
  });
