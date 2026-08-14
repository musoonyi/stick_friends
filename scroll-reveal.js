/* ==========================================================
   STICK FRIENDS — 스크롤 리빌
   .reveal 요소가 화면에 들어올 때마다 .is-visible을 붙여서
   통통 튀며 나타나고, 화면에서 벗어나면 다시 숨겨져서
   재진입할 때 또 통통거리도록 처리 (반복형)
   ========================================================== */
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // 모션을 줄여야 하는 환경이거나 IntersectionObserver 미지원 시 바로 노출(반복 없이)
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // 화면을 벗어나면 다시 숨김 상태로 돌려서,
          // 재진입 시 애니메이션이 처음부터 다시 재생되게 함
          entry.target.classList.remove('is-visible');
        }
      });
    },
    {
      threshold: 0.15,       // 요소가 15% 보이면 트리거
      rootMargin: '0px 0px -60px 0px' // 화면 하단에 살짝 못 미쳐도 미리 시작
    }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();