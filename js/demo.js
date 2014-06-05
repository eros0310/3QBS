$(document).ready(function(){
	//on page load first to check if cookie exists
	getCookie();
	//click sections on dropdwon list will jump the current window to that section
	$('.sublist').on('click', 'a', function(e){
		e.preventDefault();
		var target = $(this).attr('href').trim();
		if(!($(target)).is(':visible')){
			$(target).closest('.courseContent').show(400, function(){
				window.location.hash = target.substring(1);
			});
		}
	})
	//set cookie containing username and password
	function setCookie(name, val) {
		var d = new Date();
		d.setTime(d.getTime() + (3*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = name + "=" + val + "; " + expires;
	}
	//get cookie if any exists
	function getCookie() {
		var name = 'biblestudy=';
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0){
				cookieContent = c.substring(name.length,c.length).split('===');
				boot(cookieContent[0].trim());
			}
		}
	}
	//for password retrieval
	$('#retrievePwd').on('click', function(){
		var address = prompt("請輸入你的電子郵箱地址");
		if (address != null){
			//Server script to process data
			$.ajax({
				url: 'pwdRecover.php',
				type: 'POST',
				success: function(response){
					if(response == 0){
						alert('用戶名不存在！');
					}
					else{
						alert("請注意查收郵件。");
					}
				},
				error: function(response){
					alert('有錯誤發生，請刷新頁面后重試。');
				},
				cache: false,
				data:{add:address}
			});
		}
	})
	//for new users
	$('#regForm').on('submit', function (e){
		e.preventDefault();
		//serverside account validation
		//Clientside validation handled automatically
		var	username = $('#regEmail').val();
		var	password = $('#regPassword').val();
		setCookie('biblestudy', username+'==='+password);
		//Server script to process data
		$.ajax({
			url: 'register.php',
			type: 'POST',
			success: function(response){
				console.log(response);
				if(response == 0){
					alert('用戶名已存在！');
				}
				else{
					//start-up function for every user
					boot(username);
				}
			},
			error: function(response){
				alert('有錯誤發生，請刷新頁面后重試。');
			},
			cache: false,
			data:{name:username, pwd:password}
		});
	});
	//dropdown
	$('body').on('mouseenter', '.list', function(){
		$(this).find('.sublist').stop().slideDown();
	});
	$('body').on('mouseleave', '.list', function(){
		$(this).find('.sublist').stop().slideUp();
	});
	$('body').on('mouseenter', 'a', function(){
		$(this).stop().addClass('active');
	});
	$('body').on('mouseleave', 'a', function(){
		$(this).stop().removeClass('active');
	});
	//for old users
	$('#logForm').on('submit', function (e){
		e.preventDefault();
		//serverside account validation
		//Clientside validation handled automatically
		var	username = $('#logEmail').val();
		var	password = $('#logPassword').val();
		setCookie('biblestudy', username+'==='+password);
		//Server script to process data
		$.ajax({
			url: 'userValidation.php',
			type: 'POST',
			success: function(response){
				//check validation
				if(response == 0){
					alert('用戶名不存在！');
				}
				else if (response == 1){
					alert('密碼和用戶名不符合！');
				}
				else{
					//start-up function for every user
					boot(username);
				}
			},
			error: function(response){
				alert('有錯誤發生，請刷新頁面后重試。');
			},
			cache: false,
			data:{name:username, pwd:password}
		});
	});
	//start up function for every user
	function boot(username){
		$('.jumbotron').fadeOut();
		$('#content').fadeIn();
		loadContent(username);
	}
	//display progress
	function loadContent(username){
		$('body').find('.navbar-brand').text(username);
		$.ajax({
			url: 'loadProgress.php',
			type: 'POST',
			success: function(response){
				var raw = response.split('\n');
				var lessonId = '';
				var QId = '';
				for(var i = 0; i < raw.length;i++){
					var secondary = raw[i].split('--');
					if(secondary[0]=='lesson'){
						lessonId = secondary[0]+secondary[1];
						var progress = secondary[2];
						$('body').find("#"+lessonId).find('.progress-bar-info').attr('aria-valuenow', progress);
						$('body').find("#"+lessonId).find('.progress-bar-info').css('width', progress+'%');
					}
					else if(secondary[0]=='q'){
						var answer = secondary[2];
						QId = lessonId+'Q'+secondary[1];
						if(answer != 'N/A'){
							$('body').find("#"+QId).closest('.panel-default').find('textarea')[secondary[1]-1].value=answer;
							$('body').find("."+QId).addClass('submitted');
						}
						
					}
				}
			},
			error: function(){
				alert('有錯誤發生，請刷新頁面后重試。');
			},
			cache: false,
			data:{name:username}
		});
	}
	//show register form
	$('#logIcon').on('click', function(){
		$('#logForm').fadeToggle();
	});
	//show register form
	$('#registerIcon').on('click', function(){
		$('#regForm').fadeToggle();
	});
	//Display/Hide lesson
	$('body').on('click', '.page-header', function(){
		$(this).closest('section').find('.courseContent').slideToggle()
	});
	//dropdown
	$('body').on('click', '#lessonList', function(){
		$('body').find('.dropdown-toggle').dropdown();
	});
	//show answer
	$('body').on('click','#showAnswer', function(e){
		e.stopPropagation();
		var target = $(this).closest('.panel-body');
		var userAnwser = target.find('textarea')[0].value.length;
		var answer = target.find('.answer').text().length;
		if(answer*0.6 >= userAnwser){
			alert('請先完善你的答案');
		}
		else{
			$(this).closest('.panel-body').find('.answer').slideToggle();
		}
	});
	//update progress bar
	$('body').on('click', '#submit', function(e){
		e.stopPropagation();
		var target1 = $(this).closest('.panel-body');
		var userAnwser = target1.find('textarea')[0].value.length;
		var answer = target1.find('.answer').text().length;
		if(answer*0.6 >= userAnwser){
			alert('請先完善你的答案');
		}
		else{
			var target2 = $(this).closest('.courseContent');
			var target3 = $(this).closest('section');
			target1.addClass('submitted');
			var total = target2.find('textarea').length;
			var completed = target2.find('.submitted').length;
			var percentage = completed/total*100;
			target3.find('.progress-bar-info').attr('aria-valuenow', percentage);
			target3.find('.progress-bar-info').css('width', percentage+'%');
		}
	});
	//save
	$('body').on('click', '#save', function(e){
		e.preventDefault();
		var username = $('body').find('.navbar-brand').text();
		var lessonCount = 0;
		var QCount = 0;
		var content = '';
		$('body').find('.page-header').each(function(){
			lessonCount++;
			QCount = 0;
			content = content + 'lesson--' + lessonCount + '--' + $(this).find('.progress-bar-info').attr('aria-valuenow')+'split';
			$(this).closest('section').find('textarea').each(function(){
				QCount++;
				var answer = $(this).val();
				content = content + 'q--' + QCount + '--';
				if(answer != ''){
					content = content + answer + 'split';
				}
				else{
					content = content + 'N/Asplit';
				}
			});
		});
		//Server script to process data
		$.ajax({
			url: 'saveProgress.php',
			type: 'POST',
			success: function(response){
			},
			error: function(response){
				alert('有錯誤發生，請刷新頁面后重試。');
			},
			cache: false,
			data:{data:content, name:username},
			complete: function(){
				alert('保存成功。');
			}
		});
	});
	//on exit save progress
	$(window).on('beforeunload', function(){
		return '離開頁面之前請確認已經保存';
	});
})