// 스와이퍼
        var swiper = new Swiper(".mySwiper", {
            slidesPerView:4,
            freeMode:true,
            watchSlidesProgress:true,

            breakpoints:{
                0:{
                    slidesPerView:1,
                },
                480:{
                    slidesPerView:2,
                },
                780:{
                    slidesPerView:3,
                },
                1040:{
                    slidesPerView:4,
                }
            }
        });
        var swiper2 = new Swiper('.mySwiper2', {
            thumbs: {
            swiper: swiper,
            },
        });

        // Collabo Goods 스와이퍼
        // ⚠ nextEl/prevEl/pagination.el을 .swiper_box 안으로 스코프해야
        //    아래 카드 팝업 swiper(.swiper-button-next/prev 동일 클래스 사용)와
        //    버튼을 서로 뺏는 충돌이 안 생깁니다.
        const goodsSwiper = new Swiper(".goodsSwiper", {
            slidesPerView: 5,
            slidesPerGroup: 5,
            speed: 800,
            observer: true,
            observeParents: true,
            pagination: {
                el: ".swiper_box .swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper_box .swiper-button-next",
                prevEl: ".swiper_box .swiper-button-prev",
            },
            breakpoints: {
                300: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                600: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                },
                920: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                },
                1300: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                },
                1500: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                },
            },
        });



        //체리카드 스와이퍼
        $(function(){
            let cardSwiper;
            $(".cardBtn").click(function(){
                $(".cardPopup").addClass("active");
                if(!cardSwiper){
                    cardSwiper = new Swiper(".cardSwiper",{
                        slidesPerView:5,
                        spaceBetween: 20,
                        speed:1000,
                        autoplay:{
                            delay:4000,
                            disableOnInteraction:false,
                        },
                        loop:true,
                        cssMode:false,
                        navigation:{
                            nextEl:".cardSwiper .swiper-button-next",
                            prevEl:".cardSwiper .swiper-button-prev",
                        },
                        breakpoints:{
                            0:{
                                slidesPerView:0,
                            },
                            780:{
                                slidesPerView:4,
                            },
                            1040:{
                                slidesPerView:5,
                            }
                        }
                    });
                }else{
                    cardSwiper.update();
                }
            });
        });

        //체리스와이퍼 열고닫기
        $(function(){
            function closeCardPopup(){
                $(".cardPopup").removeClass("active");
                $("body").removeClass("noScroll");
            }
            // 카드 버튼 클릭 → 팝업 열기
            $(".cardBtn").click(function(){
                $(".cardPopup").addClass("active");
                $("body").addClass("noScroll");
            });
            // 닫기 버튼
            $(".cardClose").click(function(){
                closeCardPopup();
            });
            // ESC 키 닫기
            $(document).keydown(function(e){
                if(e.key === "Escape"){
                    closeCardPopup();
                }
            });
        });


        // 카드클릭
        const cardBtn = document.querySelector('.swiperBox .cardBtn');
        cardBtn.addEventListener('click', function(){
            this.classList.add('click');
            setTimeout(() => {
                this.classList.remove('click');
            }, 200);
        });


       

        // 배너 GSAP 애니메이션
        gsap.to(".banner_rainbow", { y: 50, duration: 2.5, repeat: -1, yoyo: true });
        gsap.to(".banner_icecreams", { y: 50, duration: 3, repeat: -1, yoyo: true });
        gsap.to(".banner_logo_img", { y: 30, duration: 2, repeat: -1, yoyo: true });
        gsap.to(".cloude_1, .cloude_2", { y: 30, duration: 2.5, repeat: -1, yoyo: true });
        gsap.to(".cloude_3, .cloude_4", { y: 30, duration: 2, repeat: -1, yoyo: true });
        gsap.to(".star1_1, .star1_2, .star1_3, .star2_1, .star2_2", { rotation: 360, duration: 3, repeat: -1, ease: "none" });
        gsap.to(".star3_1, .star3_2", { rotation: -360, duration: 3, repeat: -1, ease: "none" });
        gsap.to(".cat", { scale: 1.1, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" });
        gsap.to(".cat_foot1, .cat_foot2", { scale: 1.5, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" });
        gsap.to(".cat_foot1", { rotation: -25, duration: 3, repeat: -1, ease: "none" });
        gsap.to(".cat_foot2", { rotation: 25, duration: 3, repeat: -1, ease: "none" });