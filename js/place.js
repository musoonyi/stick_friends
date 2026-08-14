//지도
    const map = new maplibregl.Map({
        container: "map",
        style: {
            version: 8,
            sources: {
                osm: {
                    type: "raster",
                    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    tileSize: 256
                }
            },
            layers: [
                {
                    id: "osm",
                    type: "raster",
                    source: "osm"
                }
            ]
        },

        // 화곡점 위치
        center: [126.840450, 37.541120],
            zoom: 16,
        });

        map.on("load", () => {
            map.getCanvas().style.filter =
                "grayscale(0.2) contrast(1.1) brightness(1.05)";
            map.resize();
        });
        new ResizeObserver(() => {
            map.resize();
        }).observe(document.getElementById("map"));


    // 화곡점 마커
    const markerEl = document.createElement("div");

    markerEl.className = "iceMarker";

    markerEl.innerHTML = `
        <img src="./images/mapicon2.png" alt="아이스크림 매장">
    `;


    const marker = new maplibregl.Marker({
        element: markerEl
    })
    .setLngLat([126.840450, 37.541120])
    .addTo(map);


    //지도검색창
    const stateBtn = document.querySelector(".state");
    const cityBtn = document.querySelector(".city");
    const townBtn = document.querySelector(".town");
    const searchBtn = document.querySelector(".search");

    const stateList = document.querySelector(".stateList");
    const cityList = document.querySelector(".cityList");
    const townList = document.querySelector(".townList");


    let selectedState = "";
    let selectedCity = "";
    let selectedTown = "";


     // ★ 다른 목록 닫기
    function closeAllLists(except = null) {
        [stateList, cityList, townList].forEach(list => {
            if (list !== except) {
                list.classList.remove("active");
            }
        });
    }


    // 도/시 목록 생성
    Object.keys(locationData).forEach(state => {
        stateList.innerHTML += `
            <li>${state}</li>
        `;
    });


    // 도/시 선택
    stateBtn.addEventListener("click", () => {
        // ★ 추가
        closeAllLists(stateList);

        stateList.classList.toggle("active");
    });

    stateList.addEventListener("click", e => {
        if(!e.target.matches("li")) return;

        selectedState = e.target.textContent;
        stateBtn.querySelector("span").textContent = selectedState;

        cityBtn.disabled = false;
        cityList.innerHTML = "";

        Object.keys(locationData[selectedState])
        .forEach(city => {
            cityList.innerHTML += `
                <li>${city}</li>
            `;
        });

        stateList.classList.remove("active");
    });


    // 구/군 선택
    cityBtn.addEventListener("click", () => {
        // ★ 추가
        closeAllLists(cityList);

        cityList.classList.toggle("active");
    });

    cityList.addEventListener("click", e => {
        if(!e.target.matches("li")) return;

        selectedCity = e.target.textContent;
        cityBtn.querySelector("span").textContent = selectedCity;

        townBtn.disabled = false;
        townList.innerHTML = "";

        Object.keys(locationData[selectedState][selectedCity])
        .forEach(town => {

            townList.innerHTML += `
                <li>${town}</li>
            `;
        });

        cityList.classList.remove("active");
    });


    // 동 선택
    townBtn.addEventListener("click", () => {
        // ★ 추가
        closeAllLists(townList);

        townList.classList.toggle("active");
    });

    townList.addEventListener("click", e => {
        if(!e.target.matches("li")) return;

        selectedTown = e.target.textContent;
        townBtn.querySelector("span").textContent = selectedTown;

        searchBtn.disabled = false;
        townList.classList.remove("active");
    });


    // 검색 버튼
    searchBtn.addEventListener("click", () => {
        const store = locationData[selectedState][selectedCity][selectedTown];

        map.flyTo({
            center: [
                store.lng,
                store.lat
            ],
            zoom: 17
        });

        marker.setLngLat([
            store.lng,
            store.lat
        ]);
    });


   

    // 스와이퍼
    
     var swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 4,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
            delay: 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        breakpoints: {
            380: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
            780: {
                slidesPerView: 3,
                spaceBetween: 60,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 80,
            },
        },
      });


    // 매장 프로모션

    const placePR = document.querySelector(".placePR");
    const placeBtn = document.querySelector(".placePR_btn");

    placeBtn.addEventListener("click", () => {
        placePR.classList.toggle("active");
    });