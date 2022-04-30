$(function(){
    var content='';
    content +='<!-- 客服动态内容 开始 -->';
     content +='<div class="main-im">';
    content +='<div id="open_im" class="open-im">&nbsp;</div><div class="close-ball">x</div>';
    content +='<div class="im_main" id="im_main">';
    content +='<div id="close_im" class="close-im"><a href="javascript:void(0);" title="点击关闭">&nbsp;</a></div>';
    content +='<a href="https://qm.qq.com/cgi-bin/qm/qr?k=tCJDY9A6mYcHFtdu13CrU8OqepUIwR-j&jump_from=webapi" target="_blank" class="im-qq qq-a" title="猫国建设者交流群:499256691">';
    content +='<div class="qq-container"></div>';
    content +='<div class="qq-hover-c"><img class="img-qq" src="https://p.qlogo.cn/gh/499256691/499256691/?v= ' + new Date().getDate() + '" width="60px" height="80px"></div>';
    content +='<span>点击加群</span>';
    content +='</a>';
    content +='<div class="im-tel">';
    content +='<div>猫国QQ群:</div>';
    content +='<div class="tel-num">499256691</div>';
    content +='<div>更多同类游戏:</div>';
    content +='<div class="tel-num"><a href="http://www.gityx.com" target="_blank" title="Git游戏：gityx.com~">Git游戏</a><a href="http://g8hh.com" target="_blank" style="margin-left:5px;" title="锅巴汉化：g8hh.com">锅巴汉化</a><br /><a href="http://bbs.gityx.com/" target="_blank" style="margin-left:5px;" title="点击查看游戏攻略">游戏攻略交流论坛</a></div>';
    content +='</div>';
    content +='<div class="im-footer" style="position:relative">';
    content +='<div class="weixing-container">';
    content +='<div class="weixing-show">';
    content +='<div class="weixing-txt" style="font-size:13px;">打开微信扫一扫<br>关注公众号<br><br><a href="http://shang.qq.com/wpa/qunwpa?idkey=d10d784492d5e73cca25ff48f4763bdc14f698ffdbf42adbb0e9304495cb0387" target="_blank" title="点击加入 - Git游戏交流群:627141737">Git游戏</a></div>';
    content +='<img class="weixing-ma" src="https://cdn.jsdelivr.net/gh/g8hh/g8hh.github.io/static/images/kf/weixing-ma.jpg">';
    content +='<div class="weixing-sanjiao"></div>';
    content +='<div class="weixing-sanjiao-big"></div>';
    content +='</div>';
    content +='</div>';
    content +='<div class="go-top"><a href="javascript:;" title="返回顶部"></a> </div>';
    content +='<div style="clear:both"></div>';
    content +='</div>';
    content +='</div>';
    content +='</div>';
    content +='<!-- 客服动态内容 结束 -->';
    $("body").append(content);
    $('#close_im').bind('click',function(){
        $('#main-im').css("height","0");
        $('#im_main').hide();
        $('#open_im').show();
    });
    $('#open_im').bind('click',function(e){
        $('#main-im').css("height","272");
        $('#im_main').show();
        $(this).hide();
    });
    $('.go-top').bind('click',function(){
        $(window).scrollTop(0);
    });
    $(".weixing-container").bind('mouseenter',function(){
        $('.weixing-show').show();
    })
    $(".weixing-container").bind('mouseleave',function(){        
        $('.weixing-show').hide();
    });

//  定时关闭
  setTimeout(function () {
    $('#im_main').hide();
  },5000);
    //    关闭小球，防止遮挡
  $('.close-ball').bind('click', function() {
    if ($('.close-ball').hasClass('show')) {
      $('#open_im').show()
      $('.close-ball').removeClass('show')
    } else {
      $('.close-ball').addClass('show')
      $('.im_main').hide()
      $('#open_im').hide()
    }
  })
});