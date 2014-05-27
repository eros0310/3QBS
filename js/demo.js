$(document).ready(function(){
	//for new users
	$('#regForm').on('submit', function (e){
		e.preventDefault();
		//serverside account validation
		//Clientside validation handled automatically
		var	username = $('#regEmail').val();
		var	password = $('#regPassword').val();
		//Server script to process data
		$.ajax({
			url: 'register.php',
			type: 'POST',
			success: function(response){
				if(response == 0){
					alert('user already existed !!');
				}
				else{
					//start-up function for every user
					boot(username);
				}
			},
			error: function(response){
				alert('An error has occurred, please refresh your page and try again.');
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
		//Server script to process data
		$.ajax({
			url: 'userValidation.php',
			type: 'POST',
			success: function(response){
				//check validation
				if(response == 0){
					alert('User does not exist !!');
				}
				else if (response == 1){
					alert('Password does not match !!');
				}
				else{
					//start-up function for every user
					boot(username);
				}
			},
			error: function(response){
				alert('An error has occurred, please refresh your page and try again.');
			},
			cache: false,
			data:{name:username, pwd:password}
		});
	});
	//start up function for every user
	function boot(username){
		$.ajax({
			url: 'demo3.html',
			success: function(response){
				$('#content').html(response);
				$('#form').fadeOut();
				$('#content').fadeIn();
				loadContent(username);
			},
			error: function(response){
				alert('An error has occurred, please refresh your page and try again.');
			}
		});
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
				alert('An error has occurred, please refresh your page and try again.');
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
	//Hide lesson
	$('body').on('click', '.glyphicon-chevron-up', function(){
		$(this).closest('section').find('.courseContent').slideUp()
	});
	//Display lesson
	$('body').on('click', '.glyphicon-chevron-down', function(){
		$(this).closest('section').find('.courseContent').slideDown()
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
			alert('You might want to elaborate on your anwser first ??');
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
			alert('You might want to elaborate on your anwser first ??');
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
				alert('An error has occurred, please refresh your page and try again.');
			},
			cache: false,
			data:{data:content, name:username},
			complete: function(){
				alert('Saving completed.');
			}
		});
	});
	//on exit save progress
	$(window).bind('beforeunload', function(){
		return 'Make sure you save your progress before exiting.';
	});
})