        // 탭버튼
        $(".event_tab").hide();
        $(".event_tab").eq(0).show();

        $(".tab_btn").click(function () {

            $(".tab_btn").removeClass("active");
            $(this).addClass("active");

            $(".event_tab").hide();
            $(".event_tab").eq($(this).index()).show();

        });