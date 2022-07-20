$(function(){
	/*畫面大小需改變的預設值*/
	reset_font_size();
	reset_footer_fixed_height();
	resize_main_content();
	$(window).resize(function() {
		reset_font_size();
		reset_footer_fixed_height();
		resize_main_content();
	});
	
	//拉出選單 初始化
	$('#general-menu').Pushy({
		button: "general-menu-btn",
		container: "wrapper",
		containerPush: false,
		//containerClass: "test",
		menuPosition: "right",
		menuOpen: false,
		overlayShow: true
	});
	$('#general-menu').removeClass("hidden");
});

/*設定整個畫面的font_size*/
function reset_font_size(){
	var width = $(window).width();
	if(width > 800){
	   width = 800;
   	}
	var now_size = parseInt(width / 7.5);
	
	$("html").css("font-size", now_size);
}

/*設定footer-fixed-heigh(假設有footer的高度)的高度*/
function reset_footer_fixed_height(){
	$("#footer-fixed-height").css("height", $("#footer").height());
}

/*設定main-content的高度*/
function resize_main_content(){
	var window_height = $(window).height();
	var use_height = $(window).height() - $('#header').outerHeight() - $('#menu-bar').outerHeight() - $('#footer').outerHeight();
	$("#main-content").css("height", use_height);
}

function change_lang(lang){
	requestJSON("sty1_general1_op.php", "pdisplay=change_lang", "lang=" + lang, "");
}

/*for transfer_quota*/
//點數全數轉回主帳戶
var return_to_main_account_flag = 1;
function return_to_main_account(is_home){
	if(return_to_main_account_flag == 0){
		pop_msg((change_lang_txt({"org_txt" : "請稍候"}) + "!"));
	}else{
		return_to_main_account_flag = 0;
		customize_layer_open({
			skin: "skin-2",
			title: change_lang_txt({"org_txt" : '訊息'}),
			content: change_lang_txt({"org_txt" : '確定要將點數全數轉回主帳戶'}) + "?",
			closeBtn: false,
			area: ['90%'],
			btn: [change_lang_txt({"org_txt" : '取消'}), change_lang_txt({"org_txt" : '確認'})],
			yes: function(index, layero){
				return_to_main_account_flag = 1;
				close_layer({'type':1});
			},
			btn2:function(index, layero){
				layer_loading({'type': 1});
				requestJSON("transfer_quota_op.php", "pdisplay=return_to_main_account", "is_home=" + is_home, "");
			}
		});
	}
	
}
/*for transfer_quota*/