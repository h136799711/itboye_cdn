/**
 * 微信js分享设置js文件，单独文件，不依赖jquery
 * 
 */
function wxready() {
	console.log("weixinready");
	window.isWxReady = true;
		var title = document.getElementById("wxshareTitle").value;
		var link = document.getElementById("wxshareLink").value;
		var imgUrl = document.getElementById("wxshareImgUrl").value;
		var desc = document.getElementById("wxshareDesc").value;
		wx.onMenuShareTimeline({
			title: title,
			link: link,
			imgUrl: imgUrl,
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				//					alert("取消分享到朋友圈");
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareAppMessage({

			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareQQ({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareWeibo({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});

}

function wxerror(res) {
	console.log(res);
}

wx.ready(function() {
	wxready();
    //时差设置
    if(window.itboye && !window.itboye.setCookies){
        window.itboye.setCookies = function(name,value,days)
        {
            var exp = new Date();
            exp.setTime(exp.getTime() + days*24*60*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        }
    }
    if(window.itboye && window.itboye.setCookies){
        //设置时区
        var timezone = (0-((new Date()).getTimezoneOffset()) / 60);
        window.itboye.setCookies('timezone',timezone,180);
        console.log("时差",timezone,'小时');

    }
})
wx.error(function(res) {
	wxerror(res);
});

