$(function (){
	(function(){
		
		$(".loginmyac").click(function (){
			if($(".myac-details").css("display") == "none"){
				$(".myaca").css("color","#da3715");
				$(".pulldown").addClass("pulldowna");
				$(".myac-details").css("display","block");
				$(".loginmyac").addClass("boxs");
			} else {

				$(".myaca").css("color","#383838");
				$(".pulldown").removeClass("pulldowna");
				$(".myac-details").css("display","none");
				$(".loginmyac").removeClass("boxs");
			}
		});


        $(".loginmyacv").mouseleave(function (){
            $(".myaca").css("color","#383838");
            $(".pulldown").removeClass("pulldowna");
            $(".myac-details").hide(100);
            $(".loginmyac").removeClass("boxs");

        });
    })()

    var main = {
        init: function(){
            this.scroll();
        },
        scroll: function(){
          
            //$(".suspend").capacityFixed();
            $(window).scroll(
                function(){
                    var A = $(window).scrollTop();
                    if(A>=300){
                        $(".suspend").slideDown(30);
                        $(".back-top a").slideDown(30);
                    }else{
                        $(".suspend").slideUp(30);
                        $(".back-top a").slideUp(30);
                    }
                }
            );
			$(".back-top a").click(function(){if(scroll=="off") return;$("html,body").animate({scrollTop: 0}, 600);})

        }
    };

    main.init();



});

