 'use strict';

        /* ===================================================
           리뷰 데이터
           review_box 카드 하나 = 객체 하나.
           이 배열에 항목을 추가/삭제하면 카드도 그만큼 늘어나거나 줄어듭니다.
        =================================================== */

        // 이미지는 나중에 실제 사진으로 교체할 예정이라, 우선 개수만
        // 다양하게 맞춰서 같은 자리표시자 이미지를 반복해 채운다.
        function placeholderImages(count) {
            return Array(count).fill('./images/icecream1.png');
        }

        // 리뷰 9개, 별점 평균이 정확히 4.5가 되도록 맞췄어요.
        // (5점 x5 + 4점 x2 + 3점 x1 + 4.5점 x1 = 40.5, 40.5 / 9 = 4.5)
        // 정수 별점 9개만으로는 평균이 정확히 4.5가 나올 수 없어서(4.4나 4.6으로만 떨어짐),
        // 리뷰 하나를 4.5점으로 둬서 정확히 맞췄어요. 화면에는 반올림돼서 별 5개로 보여요.
        const reviewData = [
            {
                nickname: '뀨루뀨루 님',
                rating: 5,
                date: '2026.06.10 PM 7:20',
                images: placeholderImages(6),
                text: '고양이 모양이 너무 귀여워서 먹기 아까웠어요! 소다향도 진하고 시원해서 여름에 딱이에요.',
            },
            {
                nickname: '소다중독자 님',
                rating: 5,
                date: '2026.06.15 AM 10:05',
                images: placeholderImages(3),
                text: '매번 재구매하는 최애템이에요. 맛도 비주얼도 다 만족스러워요!',
            },
            {
                nickname: '고양이집사 님',
                rating: 4,
                date: '2026.06.19 PM 2:40',
                images: placeholderImages(2),
                text: '디자인은 정말 예쁜데 가격 대비 양이 조금 적은 느낌이에요. 맛은 아주 좋았어요.',
            },
            {
                nickname: '여름별사탕 님',
                rating: 5,
                date: '2026.06.24 PM 6:15',
                images: placeholderImages(8),
                text: '귀 부분 초코가 진짜 쫀득해서 좋았어요! 조카가 너무 좋아해서 하나 더 주문했어요.',
            },
            {
                nickname: '얼음공주 님',
                rating: 3,
                date: '2026.06.29 AM 11:30',
                images: placeholderImages(1),
                text: '생각보다 많이 달아서 반 정도만 먹고 남겼어요. 눈 모양은 정교해서 신기했어요.',
            },
            {
                nickname: '하늘냥냥 님',
                rating: 4,
                date: '2026.07.03 PM 4:50',
                images: placeholderImages(5),
                text: '소다맛이 살짝 약한 느낌은 있지만 전체적으로 만족스러운 비주얼이었어요.',
            },
            {
                nickname: '민트파도 님',
                rating: 5,
                date: '2026.07.08 AM 9:10',
                images: placeholderImages(4),
                text: '포장도 꼼꼼하고 배송도 빨랐어요. 모양도 안 뭉개지고 예쁘게 왔어요!',
            },
            {
                nickname: '딸기라떼 님',
                rating: 5,
                date: '2026.07.13 PM 7:25',
                images: placeholderImages(7),
                text: '여름 간식으로 최고예요! 친구들 모임에 사갔더니 다들 사진부터 찍었어요.',
            },
            {
                nickname: '바다표범군 님',
                rating: 4.5,
                date: '2026.07.18 AM 11:05',
                images: placeholderImages(3),
                text: '이 정도면 거의 완벽한데 조금만 더 부드러웠으면 좋겠어요. 그래도 재구매 확정!',
            },
        ];

        /* 카드 하나에 실제로 보여줄 최대 이미지 수 (CSS의 grid-template-columns: repeat(7,1fr) 와 짝) */
        const MAX_VISIBLE_IMAGES = 6;

        /* ===================================================
           상품 정보 / 공용 상태
           number_box(수량), 장바구니 뱃지, 구매 모달이 모두 같은
           quantity 값을 참조한다.
        =================================================== */

        const PRODUCT_NAME = '소다냥';
        const PRODUCT_PRICE = 1500;

        let quantity = 1;
        let cartCount = 0;

        function formatPrice(value) {
            return `${value.toLocaleString('ko-KR')}원`;
        }

        /* ===================================================
           좋아요(즐겨찾기) - 마이페이지와 로컬스토리지로 상태를 공유한다.
           마이페이지의 MY FAVORITE 영역이 이 값을 읽어서 그려주고,
           마이페이지에서 좋아요를 취소하면 여기 하트도 다시 빈 하트로 바뀐다.
        =================================================== */

        const FAVORITES_KEY = 'liked_icecreams';
        const PRODUCT_ID = 'soda-nyang';
        const PRODUCT_IMAGE = './images/icecream1.png';

        // 마이페이지가 이 상세페이지와 다른 폴더에 있다면, 즐겨찾기 이미지 경로 앞에
        // 붙는 접두사가 서로 달라질 수 있어요. 실제 폴더 구조에 맞게 필요하면 조정하세요.

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

        function isFavorited() {
            return getFavorites().some((item) => item.id === PRODUCT_ID);
        }

        function addFavorite() {
            const list = getFavorites();
            if (list.some((item) => item.id === PRODUCT_ID)) return;

            list.push({ id: PRODUCT_ID, name: PRODUCT_NAME, image: PRODUCT_IMAGE });
            setFavorites(list);
        }

        function removeFavoriteHere() {
            const list = getFavorites().filter((item) => item.id !== PRODUCT_ID);
            setFavorites(list);
        }

        function initLikeButton() {
            const likeBtn = document.getElementById('like_btn');
            const likeIcon = document.getElementById('like_icon');
            if (!likeBtn || !likeIcon) return;

            function syncIcon() {
                likeIcon.src = isFavorited() ? './images/heart_fill.png' : './images/heart.png';
            }

            // 하트가 채워질 때 재생하는 귀여운 "두근" 모션 (짧게 두 번 튀는 하트비트 느낌)
            function bounceHeart() {
                if (typeof gsap === 'undefined') return;

                gsap.timeline()
                    .to(likeIcon, { scale: 1.4, duration: 0.15, ease: 'power1.out' })
                    .to(likeIcon, { scale: 0.85, duration: 0.15, ease: 'power1.inOut' })
                    .to(likeIcon, { scale: 1.15, duration: 0.12, ease: 'power1.out' })
                    .to(likeIcon, { scale: 1, duration: 0.15, ease: 'power1.inOut' });
            }

            function toggleLike() {
                if (isFavorited()) {
                    removeFavoriteHere();
                    syncIcon();
                } else {
                    addFavorite();
                    syncIcon();
                    bounceHeart();
                }
            }

            syncIcon();

            likeBtn.addEventListener('click', toggleLike);
            likeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleLike();
                }
            });
        }

        /* ===================================================
           포인트 / 쿠폰 - 마이페이지와 로컬스토리지로 상태를 공유한다.
           구매하기 모달에서 할인에 사용하면 여기서 잔액/보유 쿠폰이 줄어들고,
           마이페이지의 POINT / MY COUPON 영역도 다음에 열 때 그 값을 그대로 읽는다.
        =================================================== */

        const POINTS_KEY = 'user_points';
        const COUPONS_KEY = 'user_coupons';

        // 마이페이지의 기존 쿠폰 3종과 동일한 기본값. 처음 방문 시 한 번만 저장된다.
        const DEFAULT_COUPONS = [
            { id: 'coupon-20', percent: 20, title: '생일 할인 쿠폰', expiry: '2026.08.22', icon: './imges/cake_icon.png', bg: './imges/coupon1.png' },
            { id: 'coupon-30', percent: 30, title: '이벤트 담청 쿠폰', expiry: '2026.08.22', icon: './imges/party_icon.png', bg: './imges/coupon2.png' },
            { id: 'coupon-50', percent: 50, title: 'BEST BUYER 쿠폰', expiry: '2026.08.22', icon: './imges/crown_icon.png', bg: './imges/coupon3.png' },
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

        function getCoupons() {
            try {
                const raw = localStorage.getItem(COUPONS_KEY);
                if (raw === null) {
                    setCoupons(DEFAULT_COUPONS);
                    return DEFAULT_COUPONS.slice();
                }
                return JSON.parse(raw);
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

        /* ===================================================
           문자열 조립 함수들
        =================================================== */

        // rating 개수만큼 별 이미지 태그 생성
        function createStarsHtml(rating) {
            let html = '';
            for (let i = 0; i < rating; i++) {
                html += '<img src="./images/star_full.png" alt="별_이미지">';
            }
            return html;
        }

        // 이미지 6장까지만 노출, 남는 개수는 "+ N" 으로 표시
        // data-review-index / data-image-index 를 심어두면, 클릭했을 때
        // reviewData[review-index].images 전체(숨겨진 이미지 포함)를
        // image-index 부터 모달에서 넘겨볼 수 있다.
        function createReviewImagesHtml(images, reviewIndex) {
            const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
            const remainingCount = images.length - visibleImages.length;

            const imagesHtml = visibleImages
                .map((src, i) => `<img src="${src}" alt="아이스크림_이미지" data-review-index="${reviewIndex}" data-image-index="${i}">`)
                .join('');

            const moreHtml = remainingCount > 0
                ? `<span data-review-index="${reviewIndex}" data-image-index="${MAX_VISIBLE_IMAGES}">더보기</span>`
                : '';

            return imagesHtml + moreHtml;
        }

        // 리뷰 데이터 객체 하나 -> review_box article 마크업
        function createReviewBoxHtml(review, reviewIndex) {
            return `
                <article class="review_box review_box1">
                    <div class="box_info_group">
                        <a href="#" class="nickname">${review.nickname}</a>
                        <span class="stars">
                            ${createStarsHtml(review.rating)}
                        </span>
                        <em class="time">${review.date}</em>
                        <span class="icon_group">
                            <a href="#" class="icon1"><img src="./images/heart_icon.png" alt="하트_아이콘"></a>
                            <a href="#" class="icon2"><img src="./images/broken_heart_icon.png" alt="깨진하트_아이콘"></a>
                        </span>
                    </div>

                    <figure class="reviwe_img">
                        ${createReviewImagesHtml(review.images, reviewIndex)}
                    </figure>

                    <div class="review_text_box">
                        <p>${review.text}</p>
                    </div>
                </article>
            `;
        }

        /* ===================================================
           렌더링: .review_group 안에 데이터 배열을 그려 넣기
           entries는 {review, reviewIndex} 쌍의 배열이다.
           reviewIndex는 항상 reviewData 안에서의 원래 위치를 가리켜야
           reviwe_img 클릭 시 reviewData[review-index]로 정확히
           되찾아올 수 있다 (정렬로 화면 순서가 바뀌어도 유지).
        =================================================== */

        function renderReviews(entries) {
            const container = document.querySelector('.review_group');
            if (!container) return;

            container.innerHTML = entries
                .map(({ review, reviewIndex }) => createReviewBoxHtml(review, reviewIndex))
                .join('');
        }

        /* ===================================================
           리뷰 정렬 (최신순 / 오래된순 / 별점높은순 / 별점낮은순)
        =================================================== */

        // "2026.07.22 PM 18:32" 같은 문자열을 Date로 변환
        function parseReviewDate(dateStr) {
            const match = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})\s+(AM|PM)\s+(\d{1,2}):(\d{2})/);
            if (!match) return new Date(0);

            const [, year, month, day, meridiem, hourStr, minute] = match;
            let hour = Number(hourStr);

            if (meridiem === 'PM' && hour < 12) hour += 12;
            if (meridiem === 'AM' && hour === 12) hour = 0;

            return new Date(Number(year), Number(month) - 1, Number(day), hour, Number(minute));
        }

        const REVIEW_SORTERS = {
            newest: (a, b) => parseReviewDate(b.date) - parseReviewDate(a.date),
            oldest: (a, b) => parseReviewDate(a.date) - parseReviewDate(b.date),
            ratingHigh: (a, b) => b.rating - a.rating,
            ratingLow: (a, b) => a.rating - b.rating,
        };

        let currentReviewSort = 'newest';

        // reviewData 원본은 건드리지 않고, {review, reviewIndex(원래 위치)}
        // 쌍으로 복사해서 정렬한다. 정렬값이 같으면 원래 순서를 유지한다.
        function getSortedReviewEntries() {
            const sorter = REVIEW_SORTERS[currentReviewSort] || REVIEW_SORTERS.newest;

            return reviewData
                .map((review, reviewIndex) => ({ review, reviewIndex }))
                .sort((a, b) => sorter(a.review, b.review) || a.reviewIndex - b.reviewIndex);
        }

        function initReviewSort() {
            const dropdown = document.querySelector('.review_sort_dropdown');
            const summaryEl = document.querySelector('.review_sort_summary');
            const options = document.querySelectorAll('.review_sort_menu a');

            if (!dropdown || !summaryEl) return;

            options.forEach((option) => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();

                    const sortKey = option.dataset.sort;
                    if (sortKey && sortKey !== currentReviewSort) {
                        currentReviewSort = sortKey;
                        summaryEl.textContent = option.textContent;

                        options.forEach((opt) => {
                            opt.classList.toggle('is_active', opt === option);
                        });

                        currentReviewPage = 1;
                        renderReviewPage();
                    }

                    dropdown.removeAttribute('open');
                });
            });

            // 드롭다운 바깥을 클릭하면 닫기
            document.addEventListener('click', (e) => {
                if (dropdown.open && !dropdown.contains(e.target)) {
                    dropdown.removeAttribute('open');
                }
            });
        }

        /* ===================================================
           리뷰 페이지네이션 (3개씩 보기)
        =================================================== */

        const REVIEWS_PER_PAGE = 3;
        let currentReviewPage = 1;

        function renderReviewPage() {
            const allEntries = getSortedReviewEntries();
            const totalPages = Math.max(1, Math.ceil(allEntries.length / REVIEWS_PER_PAGE));

            if (currentReviewPage > totalPages) currentReviewPage = totalPages;
            if (currentReviewPage < 1) currentReviewPage = 1;

            const start = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
            renderReviews(allEntries.slice(start, start + REVIEWS_PER_PAGE));

            const numberItems = document.querySelectorAll('.review_number_btn_group > li');
            if (!numberItems.length) return;

            const prevBtn = numberItems[0].querySelector('a');
            const nextBtn = numberItems[numberItems.length - 1].querySelector('a');
            const pageLiList = Array.from(numberItems).slice(1, numberItems.length - 1);

            pageLiList.forEach((li, index) => {
                const pageNum = index + 1;
                const link = li.querySelector('a');

                if (pageNum > totalPages) {
                    li.style.display = 'none';
                } else {
                    li.style.display = '';
                    link.classList.toggle('active', pageNum === currentReviewPage);
                }
            });

            if (prevBtn) prevBtn.classList.toggle('disabled', currentReviewPage === 1);
            if (nextBtn) nextBtn.classList.toggle('disabled', currentReviewPage === totalPages);
        }

        function initReviewPager() {
            const numberItems = document.querySelectorAll('.review_number_btn_group > li');
            if (!numberItems.length) return;

            const prevBtn = numberItems[0].querySelector('a');
            const nextBtn = numberItems[numberItems.length - 1].querySelector('a');
            const pageLiList = Array.from(numberItems).slice(1, numberItems.length - 1);
            const pageLinks = pageLiList.map((li) => li.querySelector('a'));

            pageLinks.forEach((link, index) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentReviewPage = index + 1;
                    renderReviewPage();
                });
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentReviewPage > 1) {
                        currentReviewPage -= 1;
                        renderReviewPage();
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const totalPages = Math.max(1, Math.ceil(getSortedReviewEntries().length / REVIEWS_PER_PAGE));
                    if (currentReviewPage < totalPages) {
                        currentReviewPage += 1;
                        renderReviewPage();
                    }
                });
            }
        }

        /* ===================================================
           평점 요약 (box1 별점 분포 + box2 평균/추천 문구)
        =================================================== */

        function renderRatingSummary(data) {
            const totalReviews = data.length;

            const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let ratingSum = 0;

            data.forEach((review) => {
                const bucket = Math.round(review.rating);
                if (ratingCounts[bucket] !== undefined) {
                    ratingCounts[bucket] += 1;
                }
                ratingSum += review.rating;
            });

            for (let star = 5; star >= 1; star--) {
                const li = document.querySelector(`.star_number > .star_${star}`);
                if (!li) continue;

                const count = ratingCounts[star];
                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                const countEl = li.querySelector('em');
                const gaugeEl = li.querySelector('.gauge');

                if (countEl) countEl.textContent = count;
                if (gaugeEl) gaugeEl.style.setProperty('--gauge-width', `${percent}%`);
            }

            const average = totalReviews > 0 ? ratingSum / totalReviews : 0;

            const averageEl = document.querySelector('.box2_avg');
            if (averageEl) {
                averageEl.textContent = average.toFixed(1);
            }

            const recommendEl = document.querySelector('.box2_recommend');
            if (recommendEl) {
                const recommendOutOf10 = totalReviews > 0
                    ? Math.max(0, Math.min(10, Math.round((average / 5) * 10)))
                    : 0;
                recommendEl.textContent = `10명중 ${recommendOutOf10}명이 추천!`;
            }
        }

        /* ===================================================
           이미지 확대 모달 (갤러리형)
        =================================================== */

        function initImgModal() {
            const modal = document.querySelector('.img_modal');
            const modalImg = document.querySelector('.img_modal_img');
            const closeBtn = document.querySelector('.img_modal_close');
            const prevBtn = document.querySelector('.img_modal_prev');
            const nextBtn = document.querySelector('.img_modal_next');
            const counterEl = document.querySelector('.img_modal_counter');
            const dim = document.querySelector('.img_modal_dim');
            const reviewGroup = document.querySelector('.review_group');
            const imgGroupImages = document.querySelectorAll('.img_group > img');

            if (!modal || !modalImg) return;

            let gallery = [];
            let currentIndex = 0;

            function updateModalImage() {
                modalImg.src = gallery[currentIndex];
                modalImg.alt = `이미지 ${currentIndex + 1} / ${gallery.length}`;
                counterEl.textContent = `${currentIndex + 1} / ${gallery.length}`;

                const hasMultiple = gallery.length > 1;
                prevBtn.classList.toggle('is_hidden', !hasMultiple);
                nextBtn.classList.toggle('is_hidden', !hasMultiple);
            }

            function openModal(images, startIndex) {
                gallery = images;
                currentIndex = startIndex;
                updateModalImage();
                modal.classList.add('is_open');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                modal.classList.remove('is_open');
                document.body.style.overflow = '';
            }

            function showPrev() {
                if (gallery.length <= 1) return;
                currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
                updateModalImage();
            }

            function showNext() {
                if (gallery.length <= 1) return;
                currentIndex = (currentIndex + 1) % gallery.length;
                updateModalImage();
            }

            const imgGroupSrcs = Array.from(imgGroupImages).map((img) => img.src);
            imgGroupImages.forEach((img, index) => {
                img.addEventListener('click', () => {
                    openModal(imgGroupSrcs, index);
                });
            });

            if (reviewGroup) {
                reviewGroup.addEventListener('click', (e) => {
                    const target = e.target.closest('.reviwe_img > img, .reviwe_img > span');
                    if (!target) return;

                    const reviewIndex = Number(target.dataset.reviewIndex);
                    const review = reviewData[reviewIndex];
                    if (!review) return;

                    let imageIndex = Number(target.dataset.imageIndex);

                    if (target.tagName === 'SPAN') {
                        const figure = target.closest('.reviwe_img');
                        const visibleCount = Array.from(figure.querySelectorAll('img'))
                            .filter((img) => getComputedStyle(img).display !== 'none')
                            .length;
                        imageIndex = visibleCount;
                    }

                    openModal(review.images, imageIndex);
                });
            }

            closeBtn.addEventListener('click', closeModal);
            dim.addEventListener('click', closeModal);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);

            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('is_open')) return;

                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            });

            let touchStartX = 0;
            const SWIPE_THRESHOLD = 40;

            modalImg.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            });

            modalImg.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(diff) < SWIPE_THRESHOLD) return;
                if (diff > 0) showPrev();
                else showNext();
            });
        }

        /* ===================================================
           수량 선택 (number_box)
        =================================================== */

        function initQuantityControl() {
            const numberBox = document.querySelector('.number_box');
            if (!numberBox) return;

            const minusBtn = numberBox.querySelector('.qty_minus');
            const plusBtn = numberBox.querySelector('.qty_plus');
            const countEl = numberBox.querySelector('.qty_count');

            const MIN_QUANTITY = 1;
            const MAX_QUANTITY = 99;

            function setQuantity(value) {
                quantity = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value));
                countEl.textContent = quantity;
            }

            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                setQuantity(quantity - 1);
            });

            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                setQuantity(quantity + 1);
            });
        }

        /* ===================================================
           장바구니 담김 표시 (플로팅 아이콘 + 뱃지)
        =================================================== */

        function updateCartBadge() {
            const cartFloat = document.querySelector('.cart_float');
            const cartBadge = document.querySelector('.cart_float_badge');
            if (!cartFloat || !cartBadge) return;

            cartBadge.textContent = cartCount;
            cartFloat.classList.toggle('is_visible', cartCount > 0);
        }

        function bumpCartIcon() {
            const cartFloat = document.querySelector('.cart_float');
            if (!cartFloat) return;

            cartFloat.classList.remove('is_bump');
            void cartFloat.offsetWidth;
            cartFloat.classList.add('is_bump');
        }

        function initCartButton() {
            const cartBtn = document.querySelector('.dibs_btn');
            if (!cartBtn) return;

            cartBtn.addEventListener('click', () => {
                cartCount += quantity;
                updateCartBadge();
                bumpCartIcon();
            });
        }

        /* ===================================================
           장바구니 아이콘 클릭 -> 담긴 수량 조절 모달
        =================================================== */

        function initCartModal() {
            const cartFloat = document.querySelector('.cart_float');
            const modal = document.querySelector('.cart_modal');
            const dim = document.querySelector('.cart_modal_dim');
            const closeBtn = document.querySelector('.cart_modal_close');
            const confirmBtn = document.querySelector('.cart_modal_confirm');
            const buyBtn = document.querySelector('.cart_modal_buy');
            const minusBtn = document.querySelector('.cart_modal_minus');
            const plusBtn = document.querySelector('.cart_modal_plus');
            const qtyEl = document.querySelector('.cart_modal_qty_count');
            const totalEl = document.querySelector('.cart_modal_total_price');

            if (!cartFloat || !modal) return;

            const MIN_CART = 0;
            const MAX_CART = 99;

            function syncModalDisplay() {
                qtyEl.textContent = cartCount;
                totalEl.textContent = formatPrice(PRODUCT_PRICE * cartCount);
            }

            function setCartCount(value) {
                cartCount = Math.min(MAX_CART, Math.max(MIN_CART, value));
                syncModalDisplay();
                updateCartBadge();
            }

            function openModal() {
                syncModalDisplay();
                modal.classList.add('is_open');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                modal.classList.remove('is_open');
                document.body.style.overflow = '';
            }

            cartFloat.addEventListener('click', openModal);

            minusBtn.addEventListener('click', () => setCartCount(cartCount - 1));
            plusBtn.addEventListener('click', () => setCartCount(cartCount + 1));

            closeBtn.addEventListener('click', closeModal);
            dim.addEventListener('click', closeModal);
            confirmBtn.addEventListener('click', closeModal);

            if (buyBtn) {
                buyBtn.addEventListener('click', () => {
                    if (cartCount <= 0) return;
                    closeModal();
                    openBuyModal(cartCount);
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('is_open')) {
                    closeModal();
                }
            });
        }

        /* ===================================================
           구매하기 상세 모달
        =================================================== */

        let buyModalQty = 1;
        let discountMode = 'none';
        let selectedCouponId = '';

        function calcDiscount(subtotal) {
            if (discountMode === 'points') {
                return Math.min(getPoints(), subtotal);
            }

            if (discountMode === 'coupon' && selectedCouponId) {
                const coupon = getCoupons().find((c) => c.id === selectedCouponId);
                if (coupon) {
                    return Math.floor(subtotal * (coupon.percent / 100));
                }
            }

            return 0;
        }

        function updateBuyModalPrices() {
            const subtotal = PRODUCT_PRICE * buyModalQty;
            const discount = calcDiscount(subtotal);
            const total = Math.max(0, subtotal - discount);

            document.querySelector('.buy_modal_subtotal').textContent = formatPrice(subtotal);
            document.querySelector('.buy_modal_discount_price').textContent = discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0);
            document.querySelector('.buy_modal_total_price').textContent = formatPrice(total);
        }

        function populateCouponSelect() {
            const select = document.getElementById('discount_coupon_select');
            if (!select) return;

            const coupons = getCoupons();

            if (coupons.length === 0) {
                select.innerHTML = '<option value="">사용 가능한 쿠폰이 없어요</option>';
                select.disabled = true;
                return;
            }

            select.disabled = false;
            select.innerHTML = '<option value="">사용할 쿠폰을 선택해주세요</option>'
                + coupons.map((c) => `<option value="${c.id}">${c.percent}% 할인 - ${c.title}</option>`).join('');
        }

        function resetDiscountUI() {
            discountMode = 'none';
            selectedCouponId = '';

            document.querySelectorAll('input[name="discount_mode"]').forEach((radio) => {
                radio.checked = radio.value === 'none';
            });

            const couponSelect = document.getElementById('discount_coupon_select');
            if (couponSelect) {
                couponSelect.hidden = true;
                couponSelect.value = '';
            }

            const pointsAvailableEl = document.getElementById('discount_points_available');
            if (pointsAvailableEl) {
                pointsAvailableEl.textContent = `(${getPoints().toLocaleString('ko-KR')}pt 보유)`;
            }

            populateCouponSelect();
        }

        function initDiscountControls() {
            document.querySelectorAll('input[name="discount_mode"]').forEach((radio) => {
                radio.addEventListener('change', () => {
                    discountMode = radio.value;

                    const couponSelect = document.getElementById('discount_coupon_select');
                    if (couponSelect) {
                        couponSelect.hidden = discountMode !== 'coupon';
                        if (discountMode !== 'coupon') {
                            selectedCouponId = '';
                            couponSelect.value = '';
                        }
                    }

                    updateBuyModalPrices();
                });
            });

            const couponSelect = document.getElementById('discount_coupon_select');
            if (couponSelect) {
                couponSelect.addEventListener('change', () => {
                    selectedCouponId = couponSelect.value;
                    updateBuyModalPrices();
                });
            }
        }

        function openBuyModal(qty) {
            const modal = document.querySelector('.buy_modal');
            const qtyEl = document.querySelector('.buy_modal_qty');
            if (!modal) return;

            buyModalQty = qty;
            qtyEl.textContent = `${buyModalQty}개`;

            resetDiscountUI();
            updateBuyModalPrices();

            modal.classList.add('is_open');
            document.body.style.overflow = 'hidden';
        }

        function closeBuyModal() {
            const modal = document.querySelector('.buy_modal');
            if (!modal) return;

            modal.classList.remove('is_open');
            document.body.style.overflow = '';
        }

        function initBuyModal() {
            const buyBtn = document.querySelector('.buy_btn');
            const modal = document.querySelector('.buy_modal');
            const dim = document.querySelector('.buy_modal_dim');
            const closeBtn = document.querySelector('.buy_modal_close');
            const confirmBtn = document.querySelector('.buy_modal_confirm');

            if (!buyBtn || !modal) return;

            initDiscountControls();

            buyBtn.addEventListener('click', () => openBuyModal(quantity));
            closeBtn.addEventListener('click', closeBuyModal);
            dim.addEventListener('click', closeBuyModal);

            confirmBtn.addEventListener('click', () => {
                const subtotal = PRODUCT_PRICE * buyModalQty;
                const discount = calcDiscount(subtotal);
                const total = Math.max(0, subtotal - discount);

                if (discountMode === 'points' && discount > 0) {
                    setPoints(getPoints() - discount);
                } else if (discountMode === 'coupon' && selectedCouponId) {
                    setCoupons(getCoupons().filter((c) => c.id !== selectedCouponId));
                }

                alert(`${PRODUCT_NAME} ${buyModalQty}개, ${formatPrice(total)} 결제가 완료되었습니다.`);
                closeBuyModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('is_open')) {
                    closeBuyModal();
                }
            });
        }


        document.addEventListener('DOMContentLoaded', () => {
            renderReviewPage();
            renderRatingSummary(reviewData);
            initImgModal();
            initReviewSort();
            initReviewPager();
            initQuantityControl();
            initCartButton();
            initCartModal();
            initBuyModal();
            initLikeButton();
        });