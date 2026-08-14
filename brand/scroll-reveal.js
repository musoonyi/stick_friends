/* ==========================================================
   STICK FRIENDS — 스크롤 리빌
   .reveal 요소가 화면에 들어오면 .is-visible을 붙여서
   아래 → 위로 올라오며 페이드인 되도록 처리
   ========================================================== */
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // 모션을 줄여야 하는 환경이거나 IntersectionObserver 미지원 시 바로 노출
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
          observer.unobserve(entry.target); // 한 번 나타난 뒤엔 다시 관찰하지 않음
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
