        /* ===================================================
           헤더 모바일 내비게이션 (처음 올린 헤더/푸터 코드와 동일 동작)
        =================================================== */

        function initMobileNav() {
            const menuBtn = document.querySelector(".mnav_btn");
            const menu = document.querySelector(".mnav_menu");
            if (!menuBtn || !menu) return;

            menuBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle("active");
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    menu.classList.remove("active");
                }
            });
        }

        /* ===================================================
           헤더 모바일 PRODUCT 하위 카테고리 토글 (탭하면 펼침/접힘)
        =================================================== */

        function initMobileProductDropdown() {
            const productLink = document.querySelector(".mnav_product_link");
            const productDropdown = document.querySelector(".mnav_product_dropdown");
            if (!productLink || !productDropdown) return;

            productLink.addEventListener("click", (e) => {
                e.preventDefault();
                productDropdown.classList.toggle("open");
            });
        }

         document.addEventListener('DOMContentLoaded', () => {
            initMobileNav();
            initMobileProductDropdown();
        });