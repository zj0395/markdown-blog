// 代码高亮
hljs.initHighlightingOnLoad();

/**
 * 判断鼠标从哪个方向进入和离开容器
 * @param {Object} tag JQuery对象，事件绑定的主体
 * @param {Object} e event对象
 * @return {Number} direction 值为“0,1,2,3”分别对应着“上，右，下，左”
 */
function moveDirection( tag, e )
{
    var w = $(tag).width();
    var h = $(tag).height();
    var x = (e.pageX - tag.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
    var y = (e.pageY - tag.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
    var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    return direction;
}

$(function(){

    /******************* functions **********************/
    // 目录高度的动态变化
    function set_category_height()
    {
        var article_height = $("#article-content").height() - 200 + 40; // 40 为araticle的padding值
        var window_height = $(window).height() - 200 - 53;
        // 取两者的较小者 作为目录的高度
        var height = window_height < article_height ? window_height : article_height;
        $("#main-category-content").css("height", height + 'px');
    }

    // 设置 目录 按钮的 left 属性值
    function set_category_button_left(){
        var left = $("#article").css('marginLeft');
        $("#article-category-button").css("left", left );
    }




    /******************* bind event *********************/
    // 异步加载文章
    $('#main_category a').on('click',function(){//{{{
        $("#main_category a").removeClass('active');
        $(this).addClass('active');
        var href = $(this).attr('href');
        $.ajax({
            url:href + "?ajax=1",
            type:'GET',
            data:{},
            dataType:'html',
            timeout:5000,
            success:function(data){
                $("#article-content").empty().append($(data)).find('pre code').each(function(i,block){
                    hljs.highlightBlock(block);
                });

                // 修改浏览器的 url 显示
                var title = href;
                var new_url = href;
                history.pushState( {}, title, new_url );

                // 修改浏览器的 标题 显示
                var old_title    = document.title;
                var article_name = title.split("/").reverse()[0];
                var blog_name    = old_title.replace( /^.* \| /im, "" );
                document.title   = article_name + " | " + blog_name;

                // 设置目录 标题 高亮
                set_category_height();
				
				/*
				 * 动态加载的文章，里面的事件绑定这里重新做了一遍，这样不好
				 * 网上有为动态加载的DOM绑定事件的方法
				 * @todo 下次有空研究JS的时候改造下
				 * */
				// markdown生成的所有a链接全在新标签页打开 
				$("#article-content a").attr("target","_blank");

				// 点击h2标签后，与下一个h2标签中间的内容收起来
				$("#article-content h2").on("click",function(){
					$(this).nextUntil("h2").toggle();
				});

            }
        });
        return false; // 阻止冒泡 阻止事件
    });//}}}

    // 目录折叠
    $("#main-category-content>ul h2").on('click',function () {//{{{
        if($(this).next().hasClass('hide')){
            $(this).next().removeClass('hide').hasClass('show');
        }else{
            $(this).next().removeClass('show').addClass('hide');
        }
    });//}}}

    // 点击显示目录
    $("#article-category-button").on("click",function(){//{{{
        $('#main_category').animate({width:'toggle'},300);
    });//}}}

    // 鼠标移出目录div
    $("#main_category").on( "mouseleave", function(e){//{{{
        var eType = e.type;
        var direction = moveDirection( this, e );
        // 从右边移出目录，则目录收起来
        if( direction == 1 )
            $('#main_category').animate({width:'toggle'},300);
    });//}}}

    // 浏览器宽度发生变化时
    $(window).on('resize', function() {//{{{
        set_category_height();
        set_category_button_left();
    });//}}}

    // 浏览器滚动时
    $(window).scroll(function(){//{{{
        var topp = $(document).scrollTop();
        
        // 目录两个字的 top 的变化
        var top = topp + 20;
        // $("#article-category-button").css("top",top + "px");

        // 目录 div 本身的变化
        var div_top = topp;
        // 为了解决在移动超过 10px 时， 目录 div 没有对其顶部的 bug
        if( topp >= 10 )
            div_top = topp - 10;
        $("#main_category").css("top",div_top + "px");
    });//}}}

	// 点击h2标签后，与下一个h2标签中间的内容收起来
	$("#article-content h2").on("click",function(){//{{{
		$(this).nextUntil("h2").toggle();
	});//}}}



    /************** run when document loaded ************/
    // markdown生成的所有a链接全在新标签页打开 
    $("#article-content a").attr("target","_blank");

    // 设置目录的高
    set_category_height();

    // 设置目录按钮的 left 属性
    set_category_button_left();

});
