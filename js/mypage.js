     // ============================================================
        // 좋아요(즐겨찾기) - 상세페이지의 하트 버튼과 로컬스토리지로 상태를 공유한다.
        // 상세페이지에서 좋아요를 누르면 여기 MY FAVORITE에 나타나고,
        // 여기서 취소하면 상세페이지 하트도 다시 빈 하트로 돌아간다.
        // ============================================================

        const FAVORITES_KEY = 'liked_icecreams';

        // 상세페이지가 이 마이페이지와 다른 폴더에 있다면, 즐겨찾기 이미지가
        // 깨질 수 있어요. 그때는 상세페이지 폴더 기준 상대경로를 넣어주세요.
        // (예: 상세페이지 폴더가 옆에 있다면 '../상세페이지/')
        const FAVORITE_IMAGE_BASE = '';

        function getFavorites() {
            try {
                const raw = localStorage.getItem(FAVORITES_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        }

        function setFavorites(list) {
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경(프라이빗 브라우징 등) 대비
            }
        }

        // MY FAVORITE 안의 실제 슬라이드 HTML만 새로 그린다 (Swiper 갱신은 별도)
        function paintFavoritesHtml() {
            const wrapper = document.querySelector('.favoriteSwiper .swiper-wrapper');
            if (!wrapper) return;

            const favorites = getFavorites();

            if (favorites.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide like_empty">좋아요한 아이스크림이 없어요!<br>아이스크림 하트를 눌러보세요!</div>';
                return;
            }

            wrapper.innerHTML = favorites.map((item) => `
                <div class="swiper-slide like">
                    <button type="button" class="like_remove_btn" data-id="${item.id}" aria-label="좋아요 취소">
                        <img src="./images/heart_fill.png" alt="좋아요_취소_아이콘">
                    </button>
                    <a href="#"><img src="${FAVORITE_IMAGE_BASE}${item.image}" alt="${item.name}"></a>
                </div>
            `).join('');
        }

        // 초기 렌더링: Swiper가 초기화되기 전에 실제 슬라이드를 먼저 채워둔다
        paintFavoritesHtml();

        // ============================================================
        // 포인트 / 쿠폰 - 상세페이지 구매하기 모달과 로컬스토리지로 상태를 공유한다.
        // 상세페이지에서 결제할 때 포인트를 쓰거나 쿠폰을 쓰면 여기 값도 함께 줄어들고,
        // 여기서 쿠폰을 "사용하러가기"로 없애면 상세페이지 쿠폰 목록에서도 사라진다.
        // ============================================================

        const POINTS_KEY = 'user_points';
        const COUPONS_KEY = 'user_coupons';
        const COUPONS_VERSION_KEY = 'user_coupons_version';

        // DEFAULT_COUPONS의 내용(할인율, 이미지, 색상 등)을 바꿀 때마다 이 숫자를 1씩 올려주세요.
        // 브라우저에 예전 버전이 이미 저장돼 있어도, 버전이 다르면 자동으로 새 기본값으로 덮어씁니다.
        // (반대로 버전이 같으면, 사용자가 "사용하러가기"로 지운 쿠폰은 그대로 유지됩니다)
        const COUPONS_VERSION = 1;

        // 처음 방문 시 한 번만 저장되는 기본 쿠폰 3종 (기존에 하드코딩돼 있던 값과 동일)
        //
        // [중요] 예전엔 쿠폰마다 배경(coupon1/2/3.png)과 아이콘(cake/party/crown_icon.png)을
        // 서로 다른 이미지 "파일"로만 표현했다. 그런데 실제 배포 환경(모바일/카카오톡 브라우저)에서
        // coupon2.png, coupon3.png, party_icon.png, crown_icon.png 요청이 실패하면서
        // (예전 onerror 처리 때문에) 전부 coupon1.png + cake_icon.png로 조용히 대체되어
        // "쿠폰 3개가 색깔도 아이콘도 다 똑같이" 보이는 문제가 있었다.
        //
        // 이번엔 원본 이미지 파일(bg/icon)만 그대로 쓴다. 다른 에셋(Font Awesome 등)으로
        // 바꿔치기하지 않는다. 대신 이미지가 실패하면 loadImageWithRetry()가 자동으로
        // 몇 번 더 재시도한다 (모바일 통신 끊김, 카카오톡 인앱브라우저 특유의 첫 로딩
        // 지연 같은 "일시적인" 네트워크 문제는 이 재시도로 대부분 해결된다).
        // 재시도를 다 해도 계속 실패하면 그건 파일이 실제로 없거나 대소문자가 틀린
        // "영구적인" 문제라는 뜻이라, 재시도로는 못 고친다 -> 그 이미지만 조용히 숨기고
        // (다른 쿠폰과 똑같아 보이는 이상한 상태를 만들지 않고) 카드 고유 색만 남긴 뒤,
        // 브라우저 콘솔에 정확히 어떤 파일이 최종 실패했는지 로그를 남겨서
        // 직접 그 주소를 열어보고 서버 쪽 문제를 확인할 수 있게 했다.
        const DEFAULT_COUPONS = [
            { id: 'coupon-20', percent: 20, title: '생일 할인 쿠폰', expiry: '2026.08.22', bg: './images/coupon1.png', icon: './images/cake_icon.png', color: '#70CFE6' },
            { id: 'coupon-30', percent: 30, title: '이벤트 담청 쿠폰', expiry: '2026.08.22', bg: './images/coupon2.png', icon: './images/party_icon.png', color: '#FF8FC2' },
            { id: 'coupon-50', percent: 50, title: 'BEST BUYER 쿠폰', expiry: '2026.08.22', bg: './images/coupon3.png', icon: './images/crown_icon.png', color: '#FFD37F' },
        ];

        function getPoints() {
            try {
                const raw = localStorage.getItem(POINTS_KEY);
                if (raw === null) {
                    setPoints(1000);
                    return 1000;
                }
                const value = Number(raw);
                return Number.isFinite(value) ? value : 0;
            } catch (e) {
                return 1000;
            }
        }

        function setPoints(value) {
            try {
                localStorage.setItem(POINTS_KEY, String(Math.max(0, Math.round(value))));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        // localStorage를 기본값으로 리셋하고 현재 버전 번호도 함께 저장한다.
        function resetCouponsToDefault() {
            setCoupons(DEFAULT_COUPONS);
            try {
                localStorage.setItem(COUPONS_VERSION_KEY, String(COUPONS_VERSION));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        function getCoupons() {
            try {
                const raw = localStorage.getItem(COUPONS_KEY);
                const storedVersion = localStorage.getItem(COUPONS_VERSION_KEY);

                // 처음 방문이거나, 코드의 기본 데이터 버전이 올라갔다면 새 기본값으로 갱신한다.
                if (raw === null || storedVersion !== String(COUPONS_VERSION)) {
                    resetCouponsToDefault();
                    return DEFAULT_COUPONS.slice();
                }

                const parsed = JSON.parse(raw);

                // 예전 버전에서 저장된 쿠폰 데이터는 지금 스키마(bg/icon/color)와
                // 필드가 안 맞을 수 있다. 그대로 쓰면 일부 값이 undefined가 되어 깨질 수 있으니,
                // 저장된 값이 지금 스키마와 다르면 기본 쿠폰으로 되돌린다.
                const isValidShape = Array.isArray(parsed) && parsed.every((c) =>
                    c && typeof c.id === 'string' &&
                    typeof c.bg === 'string' && c.bg &&
                    typeof c.icon === 'string' && c.icon &&
                    typeof c.color === 'string' && c.color
                );

                if (!isValidShape) {
                    resetCouponsToDefault();
                    return DEFAULT_COUPONS.slice();
                }

                return parsed;
            } catch (e) {
                return DEFAULT_COUPONS.slice();
            }
        }

        function setCoupons(list) {
            try {
                localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        function paintPointsHtml() {
            const el = document.getElementById('user_points_display');
            if (!el) return;
            el.textContent = getPoints().toLocaleString('ko-KR');
        }

        // 이미지 하나를 최대 maxRetries번까지 자동으로 다시 시도해서 불러온다.
        // - 재시도할 때마다 살짝 대기 시간을 두고, 캐시가 깨진 응답을 다시 안 물게
        //   주소 뒤에 매번 다른 값(_retry=시각)을 붙여서 강제로 새로 요청한다.
        // - 모바일 통신 끊김/카카오톡 인앱브라우저 첫 로딩 지연처럼 "일시적인" 실패는
        //   대부분 이 재시도 안에서 회복된다.
        // - 재시도를 다 썼는데도 실패하면(=파일이 실제로 없거나 경로가 틀린 "영구적인"
        //   문제) 콘솔에 정확한 실패 주소를 남기고, 그 이미지 요소를 조용히 숨긴다.
        function loadImageWithRetry(imgEl, src, maxRetries, onFinalFail) {
            if (!imgEl || !src) return;

            let attempt = 0;

            function tryLoad(url) {
                imgEl.onerror = () => {
                    attempt += 1;

                    if (attempt <= maxRetries) {
                        const delay = attempt * 800; // 800ms, 1600ms ...
                        console.warn(`[이미지] 로드 실패, ${delay}ms 후 재시도 (${attempt}/${maxRetries}):`, src);

                        setTimeout(() => {
                            const bust = (src.includes('?') ? '&' : '?') + '_retry=' + Date.now();
                            tryLoad(src + bust);
                        }, delay);
                    } else {
                        imgEl.onerror = null;
                        imgEl.style.display = 'none';

                        console.error(
                            `[이미지] 최종 로드 실패 (${maxRetries}번 재시도 후 포기): ${src}\n` +
                            `-> 이 주소를 브라우저 주소창에 직접 입력해서 열어보세요. 열리지 않는다면 ` +
                            `서버에 파일이 실제로 없거나, 파일명 대소문자가 다르거나, 업로드가 ` +
                            `누락된 것입니다. (로컬 폴더 기준 경로: ${src})`
                        );

                        if (onFinalFail) onFinalFail();
                    }
                };

                imgEl.src = url;
            }

            tryLoad(src);
        }

        // MY COUPON 안의 실제 슬라이드 HTML만 새로 그린다 (Swiper 갱신은 별도)
        function paintCouponsHtml() {
            const wrapper = document.querySelector('.couponSwiper .swiper-wrapper');
            if (!wrapper) return;

            const coupons = getCoupons();

            if (coupons.length === 0) {
                wrapper.innerHTML = '<div class="swiper-slide coupon_empty_slide">사용 가능한 쿠폰이 없어요.</div>';
                return;
            }

            // 이미지 src는 여기서 바로 넣지 않는다. innerHTML로 넣으면 브라우저가
            // 곧바로 요청을 보내버려서, 실패했을 때 재시도를 붙일 시점을 놓치기 쉽다.
            // 대신 data-bg / data-icon에 경로만 담아두고, 아래에서 loadImageWithRetry로
            // 하나씩 직접 로드시킨다.
            wrapper.innerHTML = coupons.map((c) => `
                <div class="swiper-slide coupon_box" style="--coupon-color:${c.color};" data-bg="${c.bg}" data-icon="${c.icon}">
                    <img class="coupon_bg_img" alt="쿠폰_배경">
                    <div class="coupon_text_group1">
                        <span class="icon">
                            <img class="coupon_icon_img" alt="쿠폰_아이콘">
                        </span>
                        <a href="#">${c.percent}% 할인</a>
                        <em>${c.title}</em>
                    </div>
                    <span class="coupon_divider" aria-hidden="true"></span>
                    <div class="coupon_text_group2">
                        <em>유효기간 : ${c.expiry}</em>
                        <strong>사용기간이 지나면 사용할 수 없습니다</strong>
                        <a href="#" class="coupon_use_link" data-id="${c.id}">사용하러가기 ></a>
                    </div>
                </div>
            `).join('');

            wrapper.querySelectorAll('.coupon_box').forEach((box) => {
                const bgImg = box.querySelector('.coupon_bg_img');
                const iconImg = box.querySelector('.coupon_icon_img');

                loadImageWithRetry(bgImg, box.dataset.bg, 2, () => {
                    box.classList.add('bg_failed');
                });
                loadImageWithRetry(iconImg, box.dataset.icon, 2, () => {
                    box.querySelector('.icon').classList.add('icon_failed');
                });
            });
        }

        // ============================================================
        // 리뷰 - 로컬스토리지에 데이터로 저장해서 자바스크립트로 관리한다.
        // (수정/삭제 시 DOM을 직접 고치지 않고, 항상 이 배열을 갱신 → 다시 그리는 방식)
        // 각 리뷰는 keyword(검색용 태그: 소다냥/딸기냥/레몬냥/청포도냥/포도냥/오렌지냥)를
        // 가지고 있고, 검색창이나 태그 버튼으로 keyword를 필터링해서 보여준다.
        // ============================================================

        const REVIEWS_KEY = 'user_reviews';
        const REVIEWS_VERSION_KEY = 'user_reviews_version';

        // DEFAULT_REVIEWS의 내용(이미지 경로, 텍스트 등)을 바꿀 때마다 이 숫자를 1씩 올려주세요.
        // 브라우저에 예전 버전이 이미 저장돼 있어도, 버전이 다르면 자동으로 새 기본값으로 덮어씁니다.
        // (반대로 버전이 같으면, 사용자가 화면에서 직접 수정/삭제한 리뷰는 그대로 유지됩니다)
        const REVIEWS_VERSION = 2;

        // 키워드(맛)별 구분 색상 - 리뷰 카드 배경과 검색 태그 버튼이 이 값을 함께 쓴다.
        const REVIEW_KEYWORD_COLORS = {
            '소다냥': '#6ECAE0',   // 하늘색
            '딸기냥': '#FF8FC2',   // 분홍색
            '레몬냥': '#FFD966',   // 노란색
            '청포도냥': '#A9E065', // 연두색
            '포도냥': '#B48EE0',   // 보라색
            '오렌지냥': '#FFA45C', // 오렌지색
        };

        const DEFAULT_REVIEWS = [
            { id: 'review-1', keyword: '소다냥', image: './images/icecream1.png', stars: 5, text: '고양이 모양이 정말 귀엽고 아이스크림이 정말 맛있어요! 다음에도 또 사먹고 싶습니다' },
            { id: 'review-2', keyword: '딸기냥', image: './images/icecream2.png', stars: 5, text: '딸기 향이 진하게 나서 상큼했어요. 고양이 발바닥 모양도 너무 귀여워요!' },
            { id: 'review-3', keyword: '레몬냥', image: './images/icecream3.png', stars: 4, text: '새콤달콤 레몬맛이 여름에 딱이에요. 시원하게 잘 먹었습니다!' },
            { id: 'review-4', keyword: '청포도냥', image: './images/icecream5.png', stars: 5, text: '청포도 향이 은은하게 나고 너무 안 달아서 좋았어요. 재구매 의사 있어요!' },
            { id: 'review-5', keyword: '포도냥', image: './images/icecream6.png', stars: 5, text: '진짜 포도를 먹는 느낌이에요! 알갱이 씹히는 식감도 재밌어요.' },
            { id: 'review-6', keyword: '오렌지냥', image: './images/icecream4.png', stars: 4, text: '오렌지 과즙이 팡팡 터지는 느낌! 상큼해서 자꾸 손이 가요.' },
        ];

        // localStorage를 기본값으로 리셋하고 현재 버전 번호도 함께 저장한다.
        function resetReviewsToDefault() {
            setReviews(DEFAULT_REVIEWS);
            try {
                localStorage.setItem(REVIEWS_VERSION_KEY, String(REVIEWS_VERSION));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        function getReviews() {
            try {
                const raw = localStorage.getItem(REVIEWS_KEY);
                const storedVersion = localStorage.getItem(REVIEWS_VERSION_KEY);

                // 처음 방문이거나, 코드의 기본 데이터 버전이 올라갔다면 새 기본값으로 갱신한다.
                if (raw === null || storedVersion !== String(REVIEWS_VERSION)) {
                    resetReviewsToDefault();
                    return DEFAULT_REVIEWS.slice();
                }

                const parsed = JSON.parse(raw);

                // 예전 스키마로 저장된 데이터가 있으면(keyword 필드가 없는 등) 기본값으로 되돌린다.
                const isValidShape = Array.isArray(parsed) && parsed.every((r) =>
                    r && typeof r.id === 'string' &&
                    typeof r.keyword === 'string' && r.keyword &&
                    typeof r.image === 'string' && r.image &&
                    typeof r.text === 'string' &&
                    typeof r.stars === 'number'
                );

                if (!isValidShape) {
                    resetReviewsToDefault();
                    return DEFAULT_REVIEWS.slice();
                }

                return parsed;
            } catch (e) {
                return DEFAULT_REVIEWS.slice();
            }
        }

        function setReviews(list) {
            try {
                localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        // 별점 개수(count)에 맞는 별 5개 마크업을 만든다.
        // count보다 순번이 큰 별에는 star_empty 클래스를 붙여 빈 별로 표시한다.
        function renderReviewStars(count) {
            let html = '';
            for (let i = 1; i <= 5; i++) {
                const emptyClass = i > count ? ' star_empty' : '';
                html += `<span class="review_star review_star${i}"><img src="./images/star_full.png" class="${emptyClass.trim()}" alt=" 별점가득"></span>`;
            }
            return html;
        }

        // 현재 검색창/태그 버튼으로 선택된 검색어 (빈 문자열이면 전체 표시)
        let currentReviewSearch = '';

        // MY REVIEW 안의 실제 슬라이드 HTML만 새로 그린다 (Swiper 갱신은 별도)
        function paintReviewsHtml() {
            const wrapper = document.querySelector('.reviewSwiper .swiper-wrapper');
            if (!wrapper) return;

            const keyword = currentReviewSearch.trim();
            const all = getReviews();
            const filtered = keyword
                ? all.filter((r) => r.keyword.includes(keyword))
                : all;

            if (filtered.length === 0) {
                wrapper.innerHTML = keyword
                    ? `<div class="swiper-slide review_empty_slide">'${escapeHtml(keyword)}' 키워드의 리뷰가 없어요.</div>`
                    : '<div class="swiper-slide review_empty_slide">작성된 리뷰가 없어요.</div>';
                return;
            }

            wrapper.innerHTML = filtered.map((r) => {
                const color = REVIEW_KEYWORD_COLORS[r.keyword] || '';
                return `
                <div class="swiper-slide review_box" data-id="${r.id}" style="--review-color:${color};">
                    <figure class="review_img"><img src="${r.image}" alt="리뷰이미지"></figure>
                    <span class="review_keyword" style="background-color:${color || 'var(--accent-color)'};">#${escapeHtml(r.keyword)}</span>

                    <span class="review_text_box">

                        <div class="edit_group">
                            <span class="rewrite"><img src="./images/pensil.png" alt="수정_아이콘"></span>
                            <span class="delete"><img src="./images/delet.png" alt="삭제_아이콘"></span>
                        </div>
                        <div class="review_stars">
                            ${renderReviewStars(r.stars)}
                        </div>
                        <div class="review_text">
                            <p>${escapeHtml(r.text)}</p>
                        </div>
                    </span>

                </div>
            `;
            }).join('');
        }

        // ============================================================
        // 최근 구매내역 (MY ORDER) - 리뷰/쿠폰과 동일하게 localStorage 배열로 관리한다.
        // 이미지-맛 매칭은 리뷰(REVIEW_KEYWORD_COLORS와 짝을 이루는 이미지)와 동일하게 맞췄다:
        // 소다냥→icecream1, 딸기냥→icecream2, 레몬냥→icecream3,
        // 청포도냥→icecream5, 포도냥→icecream6, 오렌지냥→icecream4
        // ============================================================

        const ORDERS_KEY = 'user_orders';
        const ORDERS_VERSION_KEY = 'user_orders_version';

        // DEFAULT_ORDERS의 내용(이미지, 수량, 날짜 등)을 바꿀 때마다 이 숫자를 1씩 올려주세요.
        // 브라우저에 예전 버전이 이미 저장돼 있어도, 버전이 다르면 자동으로 새 기본값으로 덮어씁니다.
        const ORDERS_VERSION = 1;

        const DEFAULT_ORDERS = [
            { id: 'order-1', keyword: '소다냥', image: './images/icecream1.png', quantity: 1, date: '2026.07.20 PM 14:00' },
            { id: 'order-2', keyword: '딸기냥', image: './images/icecream2.png', quantity: 2, date: '2026.07.18 PM 19:20' },
            { id: 'order-3', keyword: '레몬냥', image: './images/icecream3.png', quantity: 1, date: '2026.07.15 PM 11:05' },
            { id: 'order-4', keyword: '청포도냥', image: './images/icecream5.png', quantity: 1, date: '2026.07.12 PM 16:40' },
            { id: 'order-5', keyword: '포도냥', image: './images/icecream6.png', quantity: 2, date: '2026.07.09 PM 20:10' },
            { id: 'order-6', keyword: '오렌지냥', image: './images/icecream4.png', quantity: 1, date: '2026.07.05 PM 13:25' },
        ];

        // localStorage를 기본값으로 리셋하고 현재 버전 번호도 함께 저장한다.
        function resetOrdersToDefault() {
            setOrders(DEFAULT_ORDERS);
            try {
                localStorage.setItem(ORDERS_VERSION_KEY, String(ORDERS_VERSION));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        function getOrders() {
            try {
                const raw = localStorage.getItem(ORDERS_KEY);
                const storedVersion = localStorage.getItem(ORDERS_VERSION_KEY);

                // 처음 방문이거나, 코드의 기본 데이터 버전이 올라갔다면 새 기본값으로 갱신한다.
                if (raw === null || storedVersion !== String(ORDERS_VERSION)) {
                    resetOrdersToDefault();
                    return DEFAULT_ORDERS.slice();
                }

                const parsed = JSON.parse(raw);

                const isValidShape = Array.isArray(parsed) && parsed.every((o) =>
                    o && typeof o.id === 'string' &&
                    typeof o.keyword === 'string' && o.keyword &&
                    typeof o.image === 'string' && o.image &&
                    typeof o.quantity === 'number' &&
                    typeof o.date === 'string'
                );

                if (!isValidShape) {
                    resetOrdersToDefault();
                    return DEFAULT_ORDERS.slice();
                }

                return parsed;
            } catch (e) {
                return DEFAULT_ORDERS.slice();
            }
        }

        function setOrders(list) {
            try {
                localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
            } catch (e) {
                // localStorage를 쓸 수 없는 환경 대비
            }
        }

        function paintOrdersHtml() {
            const wrapper = document.getElementById('recent_group');
            if (!wrapper) return;

            const orders = getOrders();

            if (orders.length === 0) {
                wrapper.innerHTML = '<p class="recent_empty">구매 내역이 없어요.</p>';
                return;
            }

            wrapper.innerHTML = orders.map((o) => `
                <div class="recent_box" data-id="${o.id}">
                    <span class="recent_icon"><img src="${o.image}" alt="구매상품_이미지"></span>
                    <span class="recet_text">
                        <p>하드냥 ${escapeHtml(o.keyword)} 아이스바 ${o.quantity}개를 구매했어요!</p>
                        <em>${escapeHtml(o.date)}</em>
                    </span>
                </div>
            `).join('');
        }

        // ============================================================
        // 적립내역 (MY STAMP > "적립내역 >" 클릭 시 모달로 표시)
        // - 적립 기준: 아이스크림을 구매하고 리뷰를 작성하면 스탬프 1개가 적립된다.
        // - 지금은 화면에서 직접 추가/삭제하는 기능은 없고, 이 배열이 곧 적립 이력이다.
        //   (실제 서비스라면 주문+리뷰 완료 시 서버에서 이 이력을 만들어줘야 한다)
        // ============================================================

        const STAMP_HISTORY = [
            { id: 'stamp-1', flavor: '오리지널', date: '2026.07.05 PM 15:20' },
            { id: 'stamp-2', flavor: '소다냥', date: '2026.07.08 PM 19:10' },
            { id: 'stamp-3', flavor: '딸기냥', date: '2026.07.11 PM 13:40' },
            { id: 'stamp-4', flavor: '레몬냥', date: '2026.07.15 PM 11:05' },
            { id: 'stamp-5', flavor: '청포도냥', date: '2026.07.18 PM 19:20' },
            { id: 'stamp-6', flavor: '포도냥', date: '2026.07.19 PM 20:30' },
            { id: 'stamp-7', flavor: '소다냥', date: '2026.07.20 PM 14:00' },
        ];

        function paintStampHistoryHtml() {
            const wrapper = document.getElementById('stamp_history_list');
            if (!wrapper) return;

            if (STAMP_HISTORY.length === 0) {
                wrapper.innerHTML = '<p class="stamp_history_empty">아직 적립된 스탬프가 없어요.</p>';
                return;
            }

            wrapper.innerHTML = STAMP_HISTORY.map((s) => `
                <div class="stamp_history_item">
                    <span class="stamp_history_icon"><img src="./images/stamp_img.png" alt="스탬프_이미지"></span>
                    <span class="stamp_history_text">
                        <p>하드냥 ${escapeHtml(s.flavor)} 구매 + 리뷰 작성 완료!</p>
                        <em>${escapeHtml(s.date)}</em>
                    </span>
                </div>
            `).join('');
        }

        // 초기 렌더링: Swiper가 초기화되기 전에 실제 슬라이드를 먼저 채워둔다
        paintPointsHtml();
        paintCouponsHtml();
        paintReviewsHtml();
        paintOrdersHtml();
        paintStampHistoryHtml();

        // 카드(이미지) 크기를 기존의 절반으로 줄이기 위해, 한 화면에 보이는
        // 슬라이드 개수(slidesPerView)를 기존 값의 2배로 늘렸다.
        // (슬라이드 폭 = 컨테이너 폭 / slidesPerView 이므로, 개수가 2배가 되면
        // 카드 하나의 크기는 절반이 된다)
        const swiper = new Swiper(".favoriteSwiper", {
            slidesPerView: 8,
            spaceBetween: 10,

            breakpoints: {
                320: {
                    slidesPerView: 2.4,
                },
                768: {
                    slidesPerView: 5,
                },
                1024: {
                    slidesPerView: 7,
                },
            },
        });

        // Coupon
        const couponSwiper = new Swiper(".couponSwiper", {
            slidesPerView: 6,
            spaceBetween: 10,

            breakpoints: {
                320: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
            }
        });

        // Review
        const reviewSwiper = new Swiper(".reviewSwiper", {
            slidesPerView: 3,
            spaceBetween: 20,

            breakpoints: {
                320: { slidesPerView: 1 },
                768: { slidesPerView: 1.5 },
                1024: { slidesPerView: 2.5 },
            }
        });

        // ============================================================
        // MY FAVORITE / MY COUPON / MY REVIEW 접기·펼치기
        // - 기본은 접힘: 타이틀 + "클릭하시면 내용을 보여드립니다" 안내문구만 노출
        // - 헤더(타이틀+안내문구) 클릭 시 펼침/접힘 토글
        // - 펼치면 안내문구는 사라지고 내용이 보이며, 다시 접으면 안내문구가 재등장
        // - 헤더에 마우스를 올리면 ▼ 화살표가 나타남 (열려있을 때는 항상 노출)
        // ============================================================

        document.querySelectorAll('.collapsible > .toggle_header').forEach((header) => {
            header.addEventListener('click', () => {
                const section = header.closest('.collapsible');
                const isOpening = !section.classList.contains('open');

                section.classList.toggle('open');

                // 접혀있는 동안 스와이퍼 폭 계산이 틀어졌을 수 있어서,
                // 펼치는 순간에만 해당 스와이퍼를 갱신해준다.
                if (isOpening) {
                    requestAnimationFrame(() => {
                        if (section.classList.contains('my_favorit')) swiper.update();
                        if (section.classList.contains('my_coupon')) couponSwiper.update();
                        if (section.classList.contains('my_review')) reviewSwiper.update();
                    });
                }
            });
        });

        // 즐겨찾기 다시 그리기 (슬라이드 HTML을 새로 채운 뒤 swiper에 반영)
        function renderFavorites() {
            paintFavoritesHtml();
            swiper.update();
        }

        function removeFavorite(id) {
            const list = getFavorites().filter((item) => item.id !== id);
            setFavorites(list);
            renderFavorites();
        }

        // 좋아요 취소 버튼 클릭 (동적으로 생기는 카드라 이벤트 위임 사용)
        document.querySelector('.favoriteSwiper').addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.like_remove_btn');
            if (!removeBtn) return;

            e.preventDefault();
            removeFavorite(removeBtn.dataset.id);
        });

        // ============================================================
        // Modal
        // ============================================================

        function openModal(id) {
            const overlay = document.getElementById(id);
            if (!overlay) return;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(overlay) {
            if (!overlay) return;

            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 버튼 클릭 → 해당 모달 열기
        // (적립내역처럼 <a href="#"> 태그도 트리거로 쓰이므로, 페이지가
        // 위로 점프하지 않도록 기본 동작을 막아준다)
        document.querySelectorAll('[data-modal-open]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(btn.dataset.modalOpen);
            });
        });

        // 닫기 버튼(X, 취소) 클릭 → 모달 닫기
        document.querySelectorAll('[data-modal-close]').forEach((btn) => {
            btn.addEventListener('click', () => {
                closeModal(btn.closest('.modal_overlay'));
            });
        });

        // 어두운 배경(overlay) 클릭 시 닫기
        document.querySelectorAll('.modal_overlay').forEach((overlay) => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(overlay);
            });
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal_overlay.active').forEach(closeModal);
            }
        });

        // 개인정보변경 / 결제수단변경 폼 제출 (1:1문의는 별도 처리)
        document.querySelectorAll('.modal_form').forEach((form) => {
            if (form.id === 'inquiry_form') return;
            if (form.id === 'review_edit_form') return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('저장되었습니다!');
                closeModal(form.closest('.modal_overlay'));
            });
        });

        // 회원탈퇴 확정
        document.getElementById('withdraw_confirm').addEventListener('click', () => {
            alert('탈퇴가 완료되었습니다.');
            closeModal(document.getElementById('modal_withdraw'));
        });

        // ============================================================
        // 리뷰 수정 / 삭제
        // - 이제 리뷰는 DOM이 아니라 getReviews()/setReviews() 배열이 원본이다.
        //   수정/삭제 시 배열을 먼저 바꾸고, renderReviews()로 다시 그린다.
        // - 카드가 검색 결과에 따라 매번 새로 그려지는(동적) 요소라서, 개별 아이콘에
        //   직접 리스너를 다는 대신 reviewSwiper 전체에 이벤트 위임을 사용한다.
        // ============================================================

        let targetReviewId = null; // 현재 수정/삭제 대상 리뷰의 id

        const reviewEditPreviewImg = document.getElementById('review_edit_preview_img');
        const reviewEditPhotoInput = document.getElementById('review_edit_photo');
        const reviewEditContent = document.getElementById('review_edit_content');
        const reviewEditKeywordSelect = document.getElementById('review_edit_keyword');
        const reviewEditForm = document.getElementById('review_edit_form');
        const starButtons = document.querySelectorAll('#review_edit_stars .star_btn');
        let selectedStarCount = 5;

        function setStarDisplay(count) {
            selectedStarCount = count;
            starButtons.forEach((btn) => {
                const val = Number(btn.dataset.star);
                btn.querySelector('img').classList.toggle('star_empty', val > count);
            });
        }

        starButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                setStarDisplay(Number(btn.dataset.star));
            });
        });

        // 리뷰 다시 그리기 (검색 필터 반영 + Swiper 갱신)
        function renderReviews() {
            paintReviewsHtml();
            reviewSwiper.update();
        }

        // 수정 아이콘 / 삭제 아이콘 클릭 (동적으로 생기는 카드라 이벤트 위임 사용)
        document.querySelector('.reviewSwiper').addEventListener('click', (e) => {
            const rewriteBtn = e.target.closest('.rewrite');
            if (rewriteBtn) {
                const slideEl = rewriteBtn.closest('.review_box');
                if (!slideEl) return;

                targetReviewId = slideEl.dataset.id;

                const review = getReviews().find((r) => r.id === targetReviewId);
                if (!review) return;

                reviewEditPreviewImg.src = review.image;
                reviewEditContent.value = review.text;
                reviewEditKeywordSelect.value = review.keyword;
                reviewEditPhotoInput.value = '';
                setStarDisplay(review.stars);

                openModal('modal_review_edit');
                return;
            }

            const deleteBtn = e.target.closest('.delete');
            if (deleteBtn) {
                const slideEl = deleteBtn.closest('.review_box');
                if (!slideEl) return;

                targetReviewId = slideEl.dataset.id;
                openModal('modal_review_delete');
            }
        });

        // 사진 변경 버튼
        // label + hidden input 방식 대신 JS로 직접 파일 선택창을 열어
        // 모바일 브라우저/인앱 브라우저에서도 안정적으로 동작하도록 처리한다.
        const reviewEditPhotoBtn = document.getElementById('review_edit_photo_btn');

        if (reviewEditPhotoBtn && reviewEditPhotoInput) {
            reviewEditPhotoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                reviewEditPhotoInput.click();
            });
        }

        // 사진 변경 미리보기
        reviewEditPhotoInput.addEventListener('change', () => {
            const file = reviewEditPhotoInput.files && reviewEditPhotoInput.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 선택할 수 있어요.');
                reviewEditPhotoInput.value = '';
                return;
            }

            // blob: URL은 (1) 저장 직후 revoke하면 다시 그릴 때 바로 깨지고,
            // (2) revoke를 안 해도 새로고침하면 사라지는 임시 주소라 localStorage에
            // 저장해두면 다음 방문 때 엑박이 뜬다. 프로필 이미지 변경과 동일하게
            // FileReader로 base64 data URL을 만들어서, 계속 유효한 문자열로 저장한다.
            const reader = new FileReader();
            reader.onload = () => {
                reviewEditPreviewImg.src = reader.result;
            };
            reader.readAsDataURL(file);
        });

        // 리뷰 수정 저장 → 배열(localStorage)을 갱신하고 다시 그린다
        reviewEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!targetReviewId) return;

            const reviews = getReviews();
            const idx = reviews.findIndex((r) => r.id === targetReviewId);
            if (idx === -1) return;

            reviews[idx] = {
                ...reviews[idx],
                image: reviewEditPreviewImg.src,
                text: reviewEditContent.value.trim(),
                stars: selectedStarCount,
                keyword: reviewEditKeywordSelect.value,
            };

            setReviews(reviews);
            renderReviews();

            alert('리뷰가 수정되었습니다!');
            closeModal(document.getElementById('modal_review_edit'));
            targetReviewId = null;
        });

        // 삭제 확정 → 배열에서 제거하고 다시 그린다
        document.getElementById('review_delete_confirm').addEventListener('click', () => {
            if (!targetReviewId) return;

            const remaining = getReviews().filter((r) => r.id !== targetReviewId);
            setReviews(remaining);
            renderReviews();

            alert('리뷰가 삭제되었습니다.');
            closeModal(document.getElementById('modal_review_delete'));
            targetReviewId = null;
        });

        // ============================================================
        // 리뷰 검색 - 검색창 입력 또는 키워드 태그 버튼 클릭으로 필터링한다.
        // (소다냥 / 딸기냥 / 레몬냥 / 청포도냥 / 포도냥 / 오렌지냥)
        // ============================================================

        const reviewSearchInput = document.getElementById('review_search_input');
        const reviewSearchClearBtn = document.getElementById('review_search_clear');
        const reviewTagButtons = document.querySelectorAll('.review_tag_btn');

        // 태그 버튼도 리뷰 카드와 같은 색상표를 써서 통일감 있게 색을 입힌다.
        reviewTagButtons.forEach((btn) => {
            const color = REVIEW_KEYWORD_COLORS[btn.dataset.keyword];
            if (color) {
                btn.style.setProperty('--tag-color', color);
            }
        });

        function setReviewSearch(keyword) {
            currentReviewSearch = keyword;
            reviewSearchInput.value = keyword;

            reviewTagButtons.forEach((btn) => {
                btn.classList.toggle('active', keyword !== '' && btn.dataset.keyword === keyword);
            });

            renderReviews();
        }

        reviewSearchInput.addEventListener('input', () => {
            setReviewSearch(reviewSearchInput.value);
        });

        reviewSearchClearBtn.addEventListener('click', () => {
            setReviewSearch('');
        });

        reviewTagButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const keyword = btn.dataset.keyword;
                // 이미 선택된 태그를 다시 누르면 검색을 해제한다.
                setReviewSearch(currentReviewSearch === keyword ? '' : keyword);
            });
        });

        // ============================================================
        // 1:1 문의 → 답변 알림
        // ============================================================

        const inquiries = [];

        const alarmBtn = document.getElementById('alarm_btn');
        const alarmLink = document.getElementById('alarm_link');
        const alarmBadge = document.getElementById('alarm_badge');
        const replyList = document.getElementById('reply_list');

        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function renderReplyList() {
            const answered = inquiries.filter((item) => item.reply);

            if (answered.length === 0) {
                replyList.innerHTML = '<p class="reply_empty">아직 도착한 답변이 없어요.</p>';
                return;
            }

            replyList.innerHTML = answered.map((item) => `
                <div class="reply_item">
                    <p class="reply_q_title">Q. ${escapeHtml(item.title)}</p>
                    <p class="reply_q_content">${escapeHtml(item.content)}</p>
                    <div class="reply_a">
                        <span class="reply_a_label">A. 하드냥 매니저</span>
                        <p>${escapeHtml(item.reply)}</p>
                    </div>
                </div>
            `).join('');
        }

        function notifyNewReply() {
            alarmBadge.classList.add('show');

            alarmBtn.classList.remove('shake');
            void alarmBtn.offsetWidth;
            alarmBtn.classList.add('shake');
        }

        alarmBtn.addEventListener('animationend', () => {
            alarmBtn.classList.remove('shake');
        });

        alarmLink.addEventListener('click', (e) => {
            e.preventDefault();

            renderReplyList();
            openModal('modal_reply');

            alarmBadge.classList.remove('show');
            alarmBtn.classList.remove('shake');
        });

        const inquiryForm = document.getElementById('inquiry_form');

        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('inquiry_title');
            const contentInput = document.getElementById('inquiry_content');

            const title = titleInput.value.trim() || '제목 없음';
            const content = contentInput.value.trim() || '(내용 없음)';

            inquiries.push({ title, content, reply: null });
            const targetIndex = inquiries.length - 1;

            alert('문의가 접수되었습니다! 답변이 오면 알림으로 알려드릴게요.');
            closeModal(inquiryForm.closest('.modal_overlay'));
            inquiryForm.reset();

            setTimeout(() => {
                inquiries[targetIndex].reply = '안녕하세요! 문의주신 내용 확인했습니다. 빠른 시일 내에 자세히 답변드릴게요 :)';
                notifyNewReply();
            }, 4000);
        });

        // ============================================================
        // 설정 아이콘 → 테마 색상 변경
        // ============================================================

        const THEMES = {
            blue: { accent: '#6ECAE0', bg: '#EAF8FC', soft: '#B8EBF5' },
            pink: { accent: '#FFA8D0', bg: '#FFE6F1', soft: '#FFC2DE' },
            yellow: { accent: '#FFEFBC', bg: '#FFFFE9', soft: '#FFF6A8' },
            green: { accent: '#C3F2E3', bg: '#F9FFEB', soft: '#EAFFEA' },
            orange: { accent: '#FFBC8D', bg: '#FFF1E2', soft: '#FFDAB0' },
            purple: { accent: '#B79CE0', bg: '#F3EDFB', soft: '#DCC9F5' },
        };

        function applyTheme(themeName) {
            const theme = THEMES[themeName];
            if (!theme) return;

            const root = document.documentElement;
            root.style.setProperty('--accent-color', theme.accent);
            root.style.setProperty('--accent-bg', theme.bg);
            root.style.setProperty('--accent-soft', theme.soft);

            document.querySelectorAll('.theme_swatch').forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.theme === themeName);
            });
        }

        document.querySelectorAll('.theme_swatch').forEach((btn) => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });

        document.querySelector('.theme_swatch[data-theme="blue"]').classList.add('active');

        document.getElementById('option_link').addEventListener('click', (e) => {
            e.preventDefault();
            openModal('modal_theme');
        });

        // ============================================================
        // 프로필 이미지 직접 변경
        // ============================================================

        const profileImg = document.getElementById('profile_img');
        const profileImgEditBtn = document.getElementById('profile_img_edit_btn');
        const profileImgInput = document.getElementById('profile_img_input');

        profileImgEditBtn.addEventListener('click', () => {
            profileImgInput.click();
        });

        profileImgInput.addEventListener('change', () => {
            const file = profileImgInput.files && profileImgInput.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 등록할 수 있어요.');
                profileImgInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                profileImg.src = reader.result;
            };
            reader.readAsDataURL(file);

            profileImgInput.value = '';
        });

        // ============================================================
        // 쿠폰 개수 ↔ 보유 쿠폰 카드 숫자 동기화 / 쿠폰 사용(취소) 처리
        // ============================================================

        const couponCountEl = document.getElementById('coupon_count');

        function updateCouponCount() {
            couponCountEl.textContent = `${getCoupons().length}개`;
        }

        updateCouponCount();

        function renderCoupons() {
            paintCouponsHtml();
            couponSwiper.update();
            updateCouponCount();
        }

        document.querySelector('.couponSwiper').addEventListener('click', (e) => {
            const link = e.target.closest('.coupon_use_link');
            if (!link) return;

            e.preventDefault();

            const confirmed = confirm('이 쿠폰을 사용하시겠어요? 사용 후에는 목록에서 사라져요.');
            if (!confirmed) return;

            const remaining = getCoupons().filter((c) => c.id !== link.dataset.id);
            setCoupons(remaining);
            renderCoupons();

            alert('쿠폰이 사용되었습니다!');
        });

        // ============================================================
        // 스탬프 호버 애니메이션 (GSAP)
        // - .stamp_empty(no_stmap_img, 아직 안 모은 칸)는 효과에서 제외
        // - mouseenter: 위아래로 살짝 둥실둥실
        // - mouseleave: 진행 중인 트윈을 끊고 통통 튀며 제자리로
        // ============================================================

        function initStampHover() {
            if (typeof gsap === 'undefined') return;

            const stampImages = document.querySelectorAll('.stamp:not(.stamp_empty) > img');

            stampImages.forEach((img) => {
                img.addEventListener('mouseenter', () => {
                    gsap.to(img, {
                        y: -6,
                        duration: 0.35,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
                });

                img.addEventListener('mouseleave', () => {
                    gsap.killTweensOf(img);

                    gsap.to(img, {
                        y: 0,
                        duration: 0.3,
                        ease: 'bounce.out'
                    });
                });
            });
        }

        initStampHover();

        