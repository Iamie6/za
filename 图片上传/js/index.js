
$(function (){




	

   
	
    var main = {
        init: function(){



            var $percentage = $('.percentage-circular');
            var that = this;
            $percentage.each(function(index, value){
                that.percentage($(value));
            })






            this.scroll();

            //banner轮播
            this.$flexslider = $('.flexslider');
            this.slider();
            this.scrollRoll();
        },

        scrollRoll: function() { //合作机构
            //合作机构左右轮播

            var $cooperation = $('.cooperation-l');
            var $btnNext = $cooperation.find('.next');
            var $btnPrev = $cooperation.find('.prev');

            var $scrollContent = $cooperation.find('.clogo-main');

            var $scrollContentUl =  $scrollContent.find('>ul');
            var html = $scrollContentUl.html();
            $scrollContentUl.html( html + html);

            var scrollContentUlWidthValue = $scrollContentUl.width();
            var scrollContentLiLength = $scrollContent.find('li').length;

            var $scrollItem = $scrollContent.find('li').eq(0);
            var itemWidth = $scrollItem.width() + parseInt($scrollItem.css('margin-right'));
            var flagIndex = 0;
            var isMove = false;
            $scrollContentUl.css({
                width: scrollContentLiLength*itemWidth
            });

            $cooperation.on('click', '.next',  function() {
                if (isMove) {
                    return;
                }
                isMove = true;
                next();
            });

            $cooperation.on('click', '.prev',  function() {
                if (isMove) {
                    return;
                }
                isMove = true;
                prev();
            });

            function next() {
                flagIndex ++;
                move(flagIndex);
;            }
            function prev(){
                flagIndex --;
                move(flagIndex);
            }


            function move(index){
                //
                if (index < 0) {
                    //
                    $scrollContentUl.css({
                        left: -$scrollContentUl.width()/2
                    });
                    flagIndex = scrollContentLiLength/2;
                    flagIndex--;
                    index = flagIndex;

                }

                if (index > (scrollContentLiLength/2) ){
                    //
                    $scrollContentUl.css({
                        left: 0
                    });
                    flagIndex = 0;
                    flagIndex ++;

                    index = flagIndex;
                }


                $scrollContentUl.animate({
                    left: - (index * itemWidth)
                }, function(){
                    isMove = false;
                })
            }



        },

        slider: function(){
            this.$flexslider.flexslider({
                directionNav: true,
                pauseOnAction: false
            });
        },
        scroll: function() {
            //导航悬浮
            //$(".suspend").capacityFixed();
            $(window).scroll(
                function(){
                    var A = $(window).scrollTop();
					console.log(A);
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

        },
        percentage: function($percentage){

            var percentageValue = +$percentage.data('percentage');
            $percentage.html( percentageValue + '%');
            $percentage.css({
                'background-position-x': -160*percentageValue
            });
        }
    };


    main.init();

	$(".news-main ul li:even").addClass("fl");
	$(".news-main ul li:odd").addClass("fr");
	
    $(".project-main ul li").eq(3).addClass("fr");
	 //推荐轮播
		$(".recommend-main").on("mouseenter",".recommend-nav ul li",function (){
			var $recommendLi = $(".recommend-nav ul li");
			var $recContenta = $('.rec-contenta');
			var $index = $recommendLi.index($(this));
			$recContenta.hide();
			$recContenta.eq($index).show();
			$recommendLi.removeClass("active");
			$(this).addClass("active");
		});


		//项目进度条--百分比
		$(".schedule").each(function (){
			var $index = $(".schedule").index($(this));
			var $schedule = $(".schedule").eq($index).html();
			$(".project-barn").eq($index).css("width",$schedule)
		});


		//我的帐户点击
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
		//项目详情页JS
		
		$(".information").on("mouseenter",".tab-btn ul li",function (){
			alert("aa");
			var $recommendLi = $(".tab-btn ul li");
			var $recContenta = $('.rec-contenta');
			var $index = $recommendLi.index($(this));
			$recContenta.hide();
			$recContenta.eq($index).show();
			$recommendLi.removeClass("active");
			$(this).addClass("active");
		});
});






