// 상품 렌더링 + 탭 필터 + 페이지네이션
        document.addEventListener('DOMContentLoaded', () => {

            const ITEMS_PER_PAGE = 6;

            /* =====================================================
               0) 상품 데이터
               - 보더 색깔 / 이미지 배경 색 / 이름 / 설명만 여기서 관리
               - 상품을 추가·수정하고 싶으면 이 배열만 건드리면 됨
            ===================================================== */
            const products = [
                {
                    img: './images/icecream1.png',
                    alt: '소다맛_아이스크림',
                    borderColor: '#70CFE6',
                    bgColor: '#EAF8FC',
                    name: '소다냥',
                    desc: ['톡 터지는 달콤함을', '담은 시원한 맛'],
                    badges: ['best']
                },
                {
                    img: './images/icecream2.png',
                    alt: '딸기맛_아이스크림',
                    borderColor: '#FFC0DB',
                    bgColor: '#FFF0F6',
                    name: '딸기냥',
                    desc: ['딸기의 새콤달콤함', '가득 담긴 맛'],
                    badges: ['best']
                },
                {
                    img: './images/icecream3.png',
                    alt: '레몬맛_아이스크림',
                    borderColor: '#FFDE97',
                    bgColor: '#FFFCE4',
                    name: '레몬냥',
                    desc: ['상콤상쾌 레몬의', '프레시한 맛'],
                    badges: ['best']
                },
                {
                    img: './images/icecream5.png',
                    alt: '청포도_아이스크림',
                    borderColor: '#CFF8C2',
                    bgColor: '#F6FCEA',
                    name: '청포도냥',
                    desc: ['연두빛 달콤함이', '입속에서 팡팡'],
                    badges: ['best']
                },
                {
                    img: './images/icecream4.png',
                    alt: '오렌지맛_아이스크림',
                    borderColor: '#FFB18F',
                    bgColor: '#FFF0DF',
                    name: '오렌지냥',
                    desc: ['상큼발랄함 오렌지', '맛을 가득'],
                    badges: ['best']
                },
                {
                    img: './images/icecream6.png',
                    alt: '포도맛_아이스크림',
                    borderColor: '#D6B6EF',
                    bgColor: '#FFEFFE',
                    name: '포도냥',
                    desc: ['포도의 보라색을', '담은 달콤한 맛'],
                    badges: ['best']
                },
                {
                    img: './images/icecream7.png',
                    alt: '탄지로_아이스크림',
                    borderColor: '#BDE5E6',
                    bgColor: '#DBE9E9',
                    name: '탄지로냥',
                    desc: ['탄지로가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream8.png',
                    alt: '네즈코_아이스크림',
                    borderColor: '#FF77AD',
                    bgColor: '#F9EDF1',
                    name: '네즈코냥',
                    desc: ['네즈코가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream9.png',
                    alt: '이노스케_아이스크림',
                    borderColor: '#7287B4',
                    bgColor: '#FEF9F2',
                    name: '이노스케냥',
                    desc: ['이노스케가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream10.png',
                    alt: '피카츄_아이스크림',
                    borderColor: '#FED17F',
                    bgColor: '#FFF6C4',
                    name: '피카츄냥',
                    desc: ['피카츄가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream11.png',
                    alt: '이브이_아이스크림',
                    borderColor: '#BA8384',
                    bgColor: '#FFF2E0',
                    name: '이브이냥',
                    desc: ['이브이가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream12.png',
                    alt: '헬로키티_아이스크림',
                    borderColor: '#EF6B95',
                    bgColor: '#FFF5F7',
                    name: '헬로키티냥',
                    desc: ['헬로키티가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream13.png',
                    alt: '쿠로미_아이스크림',
                    borderColor: '#594767',
                    bgColor: '#E5D9EE',
                    name: '쿠로미냥',
                    desc: ['쿠로미가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream14.png',
                    alt: '한교동_아이스크림',
                    borderColor: '#A2D2FF',
                    bgColor: '#E9FAFF',
                    name: '한교동냥',
                    desc: ['한교동이', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream15.png',
                    alt: '카드캡터체리_아이스크림',
                    borderColor: '#F896B5',
                    bgColor: '#FFF3F7',
                    name: '체리냥 ver.1',
                    desc: ['체리가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
                {
                    img: './images/icecream16.png',
                    alt: '카드캡터체리_아이스크림',
                    borderColor: '#FFCAE0',
                    bgColor: '#E6FFE6',
                    name: '체리냥 ver.2',
                    desc: ['체리가', '귀여운 아이스크림으로!'],
                    badges: ['new', 'collab']
                },
            ];

            const badgeLabel = {
                new: 'NEW',
                best: 'BEST',
                collab: 'COLLAB'
            };

            /* 상품 데이터 1개 -> <article class="product_box"> DOM으로 변환 */
            function createProductBox(product, index) {
                const article = document.createElement('article');
                article.className = `product_box product_box${index + 1}`;
                article.style.borderColor = product.borderColor;

                const figure = document.createElement('figure');
                figure.className = 'product_img';

                // 배경색 전용 컨테이너: 크기 고정, GSAP 대상 아님
                const imgBg = document.createElement('div');
                imgBg.className = 'img_bg';
                imgBg.style.backgroundColor = product.bgColor;

                // 실제 그림(캐릭터)만 GSAP로 확대/축소되는 대상
                const img = document.createElement('img');
                img.src = product.img;
                img.alt = product.alt;
                imgBg.appendChild(img);

                figure.appendChild(imgBg);

                const textGroup = document.createElement('div');
                textGroup.className = 'box_text_group';

                const btnGroup = document.createElement('div');
                btnGroup.className = 'btn_gruop';
                product.badges.forEach((badge) => {
                    const span = document.createElement('span');
                    span.className = `${badge}_btn`;
                    span.textContent = badgeLabel[badge] || badge.toUpperCase();
                    btnGroup.appendChild(span);
                });

                const titleDiv = document.createElement('div');
                titleDiv.className = 'product_title';
                const titleLink = document.createElement('a');
                titleLink.href = 'detail.html';
                titleLink.textContent = product.name;
                titleDiv.appendChild(titleLink);

                const textDiv = document.createElement('div');
                textDiv.className = 'product_text';
                product.desc.forEach((line) => {
                    const p = document.createElement('p');
                    p.textContent = line;
                    textDiv.appendChild(p);
                });

                textGroup.appendChild(btnGroup);
                textGroup.appendChild(titleDiv);
                textGroup.appendChild(textDiv);

                article.appendChild(figure);
                article.appendChild(textGroup);

                // 카드 어디를 클릭해도(이미지·설명 포함) 상세페이지로 이동
                article.style.cursor = 'pointer';
                article.addEventListener('click', () => {
                    window.location.href = 'detail.html';
                });

                return article;
            }

            /* products 배열 전체를 .product_group 안에 렌더링 */
            function renderProducts() {
                const container = document.querySelector('.product_group');
                if (!container) return;

                container.innerHTML = '';
                products.forEach((product, index) => {
                    container.appendChild(createProductBox(product, index));
                });
            }

            renderProducts();

            /* =====================================================
               0-1) 상품 이미지 호버 애니메이션 (GSAP)
               - .product_img .img_bg > img는 renderProducts()가
                 실행되어야 실제로 DOM에 생성됨. 그래서 이 코드는
                 반드시 renderProducts() 호출 "다음"에 와야 함.
               - 스크립트 맨 아래(파일 끝)에 두면 그 시점엔 아직
                 이미지가 생성되기 전이라 querySelectorAll이 빈 목록을
                 반환하고, forEach가 아무 것도 안 붙여서 호버가
                 조용히(에러 없이) 동작하지 않게 됨.
               - img_bg(배경색 박스)는 GSAP 대상에서 제외했기 때문에
                 배경색 크기는 그대로 고정되고, 안쪽 img(그림)만
                 커졌다 작아짐.
               - 상품은 탭 필터/페이지네이션 때 다시 만들어지는 게 아니라
                 display만 껐다 켰다 하는 구조라, 여기서 한 번만
                 붙여줘도 계속 정상 동작함.
            ===================================================== */
            const productImages = document.querySelectorAll('.product_img .img_bg > img');

            productImages.forEach((img) => {
                img.addEventListener('mouseenter', () => {
                    gsap.to(img, {
                        scale: 1.15,
                        duration: 0.3,
                        ease: 'back.out(2)'
                    });
                });

                img.addEventListener('mouseleave', () => {
                    gsap.to(img, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });


            /* =====================================================
               1) 상품 필터 (ALL / NEW / BEST / COLLAB)
            ===================================================== */
            const tabLinks = document.querySelectorAll('.tab_btn_group > li > a');
            const productBoxes = Array.from(document.querySelectorAll('.product_box'));
            const productGroupEl = document.querySelector('.product_group');

            const badgeSelector = {
                NEW: '.new_btn',
                BEST: '.best_btn',
                COLLAB: '.collab_btn'
            };

            const numberItems = document.querySelectorAll('.number_btn_group > li');
            const prevBtn = numberItems[0] ? numberItems[0].querySelector('a') : null;
            const nextBtn = numberItems.length
                ? numberItems[numberItems.length - 1].querySelector('a')
                : null;
            const pageLiList = Array.from(numberItems).slice(1, numberItems.length - 1);
            const pageLinks = pageLiList.map((li) => li.querySelector('a'));

            let currentCategory = 'ALL';
            let currentPage = 1;

            /* =====================================================
               1-1) 그리드 높이 고정
               - 상품이 6개(3줄) 꽉 찼을 때의 높이를 기억해뒀다가
                 min-height로 고정 -> 상품이 적게 보여도 그 아래
                 페이지네이션/배너 위치가 절대 위로 올라오지 않음
               - .product_group에 align-content: start가 있어서
                 남는 공간은 하단 여백으로만 남고 박스 크기는
                 그대로 유지됨
            ===================================================== */
            let lockedGridHeight = 0;

            function lockGridHeight(visibleCount) {
                if (!productGroupEl) return;

                if (visibleCount >= ITEMS_PER_PAGE) {
                    productGroupEl.style.minHeight = '';
                    const measured = productGroupEl.offsetHeight;
                    if (measured > lockedGridHeight) {
                        lockedGridHeight = measured;
                    }
                }

                productGroupEl.style.minHeight = lockedGridHeight
                    ? `${lockedGridHeight}px`
                    : '';
            }

            function getFilteredProducts() {
                if (currentCategory === 'ALL') return productBoxes;
                return productBoxes.filter((box) => box.querySelector(badgeSelector[currentCategory]));
            }

            function renderPage() {
                const filtered = getFilteredProducts();
                const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

                if (currentPage > totalPages) currentPage = totalPages;

                productBoxes.forEach((box) => {
                    box.style.display = 'none';
                });

                const start = (currentPage - 1) * ITEMS_PER_PAGE;
                const currentItems = filtered.slice(start, start + ITEMS_PER_PAGE);
                currentItems.forEach((box) => {
                    box.style.display = '';
                });

                lockGridHeight(currentItems.length);

                pageLinks.forEach((link, index) => {
                    const pageNum = index + 1;
                    const li = pageLiList[index];

                    if (pageNum > totalPages) {
                        li.style.display = 'none';
                    } else {
                        li.style.display = '';
                        link.classList.toggle('active', pageNum === currentPage);
                    }
                });

                if (prevBtn) prevBtn.classList.toggle('disabled', currentPage === 1);
                if (nextBtn) nextBtn.classList.toggle('disabled', currentPage === totalPages);
            }

            /* =====================================================
               1-2) 헤더 PRODUCT 드롭다운 연동
               - menu.html?cat=new 처럼 쿼리스트링을 달고 들어오면
                 그 값에 맞는 탭을 자동으로 활성화해줌
               - cat 값과 탭버튼 텍스트(ALL/NEW/BEST/COLLAB)를
                 대문자로 비교하기 때문에 대소문자 상관없이 동작함
               - 해당 카테고리가 없으면(오타 등) 아무 것도 안 하고
                 기본값(ALL)으로 유지됨
            ===================================================== */
            function applyCategoryFromURL() {
                const params = new URLSearchParams(window.location.search);
                const cat = params.get('cat');
                if (!cat) return;

                const targetCategory = cat.trim().toUpperCase();
                const targetLink = Array.from(tabLinks).find(
                    (link) => link.textContent.trim().toUpperCase() === targetCategory
                );
                if (!targetLink) return;

                currentCategory = targetCategory;
                currentPage = 1;

                tabLinks.forEach((l) => l.classList.remove('active'));
                targetLink.classList.add('active');
            }

            tabLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    currentCategory = link.textContent.trim().toUpperCase();
                    currentPage = 1;

                    tabLinks.forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');

                    renderPage();
                });
            });

            pageLinks.forEach((link, index) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = index + 1;
                    renderPage();
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        currentPage -= 1;
                        renderPage();
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filtered = getFilteredProducts();
                    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
                    if (currentPage < totalPages) {
                        currentPage += 1;
                        renderPage();
                    }
                });
            }


            applyCategoryFromURL();
            renderPage();

        });



        // ----------------------------------------------------------------------
        // GSAP


        // 탭버튼들
        const tabButtons = document.querySelectorAll(".tab_btn_group li a");

        tabButtons.forEach((button) => {

            button.addEventListener("mouseenter", () => {

                gsap.timeline()
                    .to(button, {
                        y: -8,
                        scale: 1.08,
                        duration: 0.2,
                        ease: "power2.out"
                    })
                    .to(button, {
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: "bounce.out"
                    });

            });

        });

       