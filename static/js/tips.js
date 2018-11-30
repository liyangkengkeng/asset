(function(){
	var userAgent=window.navigator.userAgent

	function con(a){
		var r=confirm('温馨提示\n部分版本的IE浏览器可能会导致页面崩溃无法打开的问题 \n我们推荐您使用更方便快捷的谷歌浏览器\n如果您使用的是360浏览器，我们建议您打开360浏览器左上角选择极速模式；');
		if (r==true){
			if(userAgent.indexOf('win64')>-1){
				window.location.href='http://139.159.177.203/upload/GoogleChromev70.0.3538.77_64.exe'
			}else{
				window.location.href='http://139.159.177.203/upload/GoogleChromev70.0.3538.77_32.exe'
			}
		  
		}
	}

// 	if(userAgent.indexOf('Edge')>-1){

// // 　　　　return 'Edge'　　
// 		con('Edge')

// 　　}

// 　　if(userAgent.indexOf('Firefox')>-1){

// // 　　　　return 'Firefox'
// 		con('Firefox')
// 　　}

// 　　if(userAgent.indexOf('Chrome')>-1){

// // 　　　　return 'Chrome'
// 		con('Chrome')
// 　　}

　　if(userAgent.indexOf('.NET')>-1){

// 　　　　return 'IE'
		con('IE')
　　}
  
})()