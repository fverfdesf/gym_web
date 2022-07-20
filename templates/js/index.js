// JavaScript Document
var countdownid;
var is_bet_now = 0;//現在是否正在下注中
var g_events_sort_type = {};
//該參數用來讓單式display_betting_div和下注後依照提示訊息 更改該參數的值 來決定下注視窗是否保留
//但過關因為室多選  因此在執行display_cross_betting_div或是按下投注後 不論什麼提示訊息 下注視窗是否留著取決於 當前是否有一個以上的選擇注還在 有的話下注視窗也會保留 因此該參數在這邊時是設定無效
//日後單式改多選 該參數就完全無效了 看是要保留 只是設定無效還是直接拿掉該參數判斷
var is_keep_betting_div = -1; //-1:不保留 , >0:要保留, -100:不做任何判定
$(function(){
	//視窗縮放事件 相關元件寬度高度自動調整
	$(window).bind('resize', function () {
		resize_events_div_height();
	});
	
	//預設點擊賽前
	$('#events-type-area .game-before').click();
});

//中間賽事高度自動調整
function resize_events_div_height(){
	var use_height = $(window).height() - $('#header').outerHeight() - $('#top-bar').outerHeight() - $('#footer').outerHeight();
	$("#events-div").height(use_height + "px");
}

function events_type_btn_click(e, show_events_type){
	clearInterval(countdownid);
	$("#events-type-area .btn").removeClass("active");
	$(e).addClass("active");
	layer_loading({'type':1});
	requestJSON("index_op.php", "pdisplay=events_type_btn_click", "show_events_type=" + show_events_type);
}

function gc_menu_item_click(e, game_category){
	$("#gc-menu-list .item").removeClass("active");
	$(e).addClass("active");
	
	$("#gtype-menu-list-area .gtype-menu-list:not(.hidden)").addClass("hidden");
	$("#" + game_category + "-gtype-menu-list").removeClass("hidden");
	$("#" + game_category + "-gtype-menu-list").first().find(".item").each(function(){
		var this_e = $(this);
		if(parseInt(this_e.find(".game-count").text()) > 0){
			clearInterval(countdownid);
			this_e.click();
			return false;
		}
	});
}

function show_events(e, game_category, game_type, billing_date){
	clearInterval(countdownid);
	$('#game-category').val(game_category);
	$('#game-type').val(game_type);
	$('#billing-date').val(billing_date);
	
	$("#" + game_category + "-gtype-menu-list .item").removeClass("active");
	$(e).addClass("active");
	layer_loading({'type':1});
	requestJSON("index_op.php", "pdisplay=show_events", "game_category=" + game_category + "&game_type=" + game_type + "&billing_date=" + billing_date);
}

function show_events_initial_js(){
	initial_odds_click();
	var game_category = $('#game-category').val();
	var use_sort_type = 1;
	if(g_events_sort_type[game_category])
		use_sort_type = g_events_sort_type[game_category];
	$('#events-sort-type-select').val(use_sort_type);	
	$('#events-sort-type-select').niceSelect();
	resize_events_div_height();
	$('#events-reload-icon').removeClass('active');
	$('#events-reload-second').text('10');
	event_reload_second_countdown_start();
	close_layer({'type':1});
}

function ck_wait_order_btn(wait_order_num){
	var game_type = $('#game-type').val();
	
	if(game_type == "7"){
		wait_order_num = parseInt(wait_order_num);
		if(isNaN(wait_order_num))
			wait_order_num = 0;
		$('#wait-order-num').removeClass('on').text(wait_order_num);
		if(wait_order_num > 0)
			$('#wait-order-num').addClass('on');
		$('#wait-order-btn').removeClass('hidden');
	}else{
		$('#wait-order-btn').addClass('hidden');
		$('#wait-order-num').removeClass('on').text("0");
	}
	
}

function set_events_sort_type(data){
	g_events_sort_type = data;
}

function event_reload_second_countdown_start(){
	clearInterval(countdownid);
	countdownid = window.setInterval(event_reload_second_countdown, 1000);
}

function event_reload_second_countdown(){
	var el = $('#events-reload-second');
	if(el.length > 0){
		var now_second = el.text();
		now_second -= 1;
		el.text(now_second);
		if(now_second == 0){
			//$("#events-reload-icon").click();//這邊用click的話 footer排序下拉式剛好打開時 會被關掉
			events_reload_all();
		}
	}
}

function events_reload_all(){
	clearInterval(countdownid);
	$('#events-reload-icon').addClass("active");
	var game_category = $('#game-category').val();
	var game_type = $('#game-type').val();
	var billing_date = $('#billing-date').val();
	requestJSON("index_op.php", "pdisplay=events_reload_all", "game_category=" + game_category + "&game_type=" + game_type + "&billing_date=" + billing_date, "");
	
}

function events_reload_all_initial_js(){
	initial_odds_click();
	$('#events-reload-icon').removeClass('active');
	$('#events-reload-second').text('10');
	event_reload_second_countdown_start();
}

function req_events_league_select_content(){
	var game_category = $('#game-category').val();
	var game_type = $('#game-type').val();
	var billing_date = $('#billing-date').val();
	requestJSON("index_op.php", "pdisplay=req_events_league_select_content", "game_category=" + game_category + "&game_type=" + game_type + "&billing_date=" + billing_date, "");
}

function show_events_league_select_content(){
	var league_select_all_el = $('#league-content-div input[name=league_select_all]');
	var league_select_el = $('#league-content-div input[name="league_select[]"]');
	var game_category = $('#game-category').val();
	var game_type = $('#game-type').val();
	var billing_date = $('#billing-date').val();
	
	league_select_all_el.click(function(){
		if($(this).prop("checked")){
			league_select_el.prop("checked",true);	
		}else{
			league_select_el.prop("checked",false);
		}
	});
	league_select_el.change(function(){
		if($('#league-content-div input[name="league_select[]"]:checked').length == league_select_el.length){
			league_select_all_el.prop("checked",true);
		}
		else{
			league_select_all_el.prop("checked",false);
		}
	});
	
	$('#league-submit').click(function(){
		clearInterval(countdownid);
		requestJSON("index_op.php", "pdisplay=league_select_action", "game_category=" + game_category + "&game_type=" + game_type + "&billing_date=" + billing_date, "#league-select-form");
	});
	
	customize_layer_open({title: false,
						  type: 1,
						  skin: 'layui-layer-rim', //加上邊框
						  area: ['90%'],
						  content: $('#league-content-div'),
						  scrollbar: false,
						  cancel: function(){ //右上角關閉
							$('#league-content-div').html('');
						  }
						});
}

function events_change_sort_type(e){
	clearInterval(countdownid);
	var game_category = $('#game-category').val();
	var game_type = $('#game-type').val();
	var billing_date = $('#billing-date').val();
	var sort_type = $(e).val();
	requestJSON("index_op.php", "pdisplay=events_change_sort_type", "game_category=" + game_category + "&game_type=" + game_type + "&sort_type=" + sort_type + "&billing_date=" + billing_date, "");
}

function initial_odds_click(){
	$('#events-div .odds-click').click(function(){
		var el_this = $(this);
		display_betting_div(el_this.attr("eid"), el_this.attr("gc"), el_this.attr("gtype"), el_this.attr("btype"), el_this.attr("bindex"), el_this.attr("bhd"), el_this.attr("bodds"));
	});
	
	$('#events-div .cross-odds-click').click(function(){
		var el_this = $(this);
		var check = el_this.attr('check');
		var eid = el_this.attr('eid'); 
		var gc = el_this.attr('gc'); 
		var gtype = el_this.attr('gtype'); 
		var btype = el_this.attr('btype'); 
		var bindex = el_this.attr('bindex'); 
		var bhd = el_this.attr('bhd'); 
		var bodds = el_this.attr("bodds");
		bhd = bhd.replace("+", "%2B");
		
		requestJSON("index_op.php", "pdisplay=select_cross",'eid=' + eid+ '&gc=' + gc +'&gtype=' +gtype +'&btype=' + btype +'&bindex=' + bindex +'&bhd=' + bhd +'&bodds=' + bodds);	
	});
	
}

function display_betting_div(eid, gc, gtype, btype, bindex, bhd, bodds){
	if(btype != 1 && btype != 2)
		bhd = "";
	else
		bhd = bhd.replace("+", "%2B");	
	requestJSON("index_op.php", "pdisplay=display_betting_div", "eid=" + eid + "&gc=" + gc + "&gtype=" + gtype + "&btype=" + btype + "&bindex=" + bindex + "&bhd=" + bhd + "&bodds=" + bodds);
}

function initial_betting_div(){
	var now_gtype = $("#betting-form input[name=gtype]").val();
	
	$('#bet-amount').change(function(){
		//如果是過關 可贏金額最多1000000
		var v = $(this).val() * $('#betting-form input[name=bodds]').val();
		if(now_gtype == 7 && v > 1000000){
			v = 1000000;
		}
		$('#can-win-amount-txt').text(v.toFixed(2));
	});
	
	//快速投注
	$('#betting-div .quick-betting-confirm').click(function(){
		var change_amount = parseInt($(this).attr('amount'));
		var old_bamount = parseInt($('#bet-amount').val());
		change_amount = (isNaN(change_amount) ? 0 : change_amount);
		old_bamount = (isNaN(old_bamount) ? 0 : old_bamount);
		
		var new_bamount = change_amount + old_bamount;
		$('#bet-amount').val(new_bamount).change();
	});
	
	$('#betting-confirm').click(function(){
		//判斷是否低於100 或超過剩餘額度或單注限額
		var bet_amount = parseInt($('#bet-amount').val());
		var single_bet_limit = parseInt($('#single-bet-limit').text());
		
		var error_msg = "";
		if(isNaN(bet_amount)){
			error_msg = change_lang_txt({"org_txt" : '請輸入正確的下注金額'}) + '!';
		}else if(bet_amount < 100){
			error_msg = change_lang_txt({"org_txt" : '下注金額不可低於100'}) + '!';
		}else if(bet_amount > single_bet_limit){
			error_msg = change_lang_txt({"org_txt" : '下注金額已超過單注上限'}) + '!';
		}
		
		if(error_msg != ""){
			is_keep_betting_div = 1;
			pop_msg(error_msg + '!', 3);
		}else{
			if(is_bet_now == 0){
				is_bet_now = 1;
				layer_loading({'type':1,
							'msg': change_lang_txt({"org_txt" : '投注中'})});
				requestJSON("index_op.php", "pdisplay=bet_action", "", "#betting-form");
			}
		}
	});
	
	$('#betting-cancel').click(function(){
		hide_betting_div();
	});
	
	//過關 刪除 某一筆 注單
	$("#betting-div .cancel-btn").click(function(){
		var eid = $(this).attr("eid");
		var gc =  $(this).attr("gc");
		requestJSON("index_op.php", "pdisplay=delete_cross_info",'eid=' + eid + '&gc=' + gc);
	});
	
	$('#cross-betting-confirm').click(function(){
		//判斷是否低於100 或超過剩餘額度或單注限額
		var bet_amount = parseInt($('#bet-amount').val());
		var single_bet_limit = parseInt($('#single-bet-limit').text());
		
		var error_msg = "";
		if(isNaN(bet_amount)){
			error_msg = change_lang_txt({"org_txt" : '請輸入正確的下注金額'}) + '!';
		}else if(bet_amount < 100){
			error_msg = change_lang_txt({"org_txt" : '下注金額不可低於100'}) + '!';
		}else if(bet_amount > single_bet_limit){
			error_msg = change_lang_txt({"org_txt" : '下注金額已超過單注上限'}) + '!';
		}
		
		if(error_msg != ""){
			is_keep_betting_div = 1;
			pop_msg(error_msg + '!', 3);
		}else{
			if(is_bet_now == 0){
				is_bet_now = 1;
				layer_loading({'type':1,
							'msg': change_lang_txt({"org_txt" : '投注中'})});
				requestJSON("index_op.php", "pdisplay=cross_bet_action", "", "#betting-form");
			}
		}
	});
	
	$('#cross-betting-clear').click(function(){
		requestJSON("index_op.php", "pdisplay=clear_cross_info","");
	});
	
	//初始化數字鍵盤
	initial_number_input_click();
	
	show_betting_div();
}

function initial_number_input_click(){
	$('#betting-div .number-input-area .number').click(function(){
		var input_v = $(this).attr('spot');
		var old_bamount = $('#bet-amount').val();
		//在投注額還沒有東輸入東西的時候 點擊0或刪除 不做任何處理
		if(old_bamount.length <= 0 && (input_v == '0' || input_v == 'del'))
			return ;
			
		var new_bamount = "";
		if(input_v == 'del'){
			new_bamount = old_bamount.substr(0, old_bamount.length - 1);
		}else{
			new_bamount = old_bamount + input_v;
		}
		
		$('#bet-amount').val(new_bamount).change();
	});
}

function show_betting_div(){
	$('#betting-div-mask').addClass('on');
	$('#betting-div').addClass('on');
}

function hide_betting_div(){
	//關閉下注視窗
	var target_e = $('#betting-div');
	target_e.html('');
	target_e.removeClass('on');
	$('#betting-div-mask').removeClass('on');
}

function ck_betting_div_display_status(){
	if(is_keep_betting_div != -100){
		if(is_keep_betting_div == -1){
			hide_betting_div();
		}
	}
	is_keep_betting_div = -1;
}

function display_cross_betting_div(){
	var game_category = $('#game-category').val();
	var wait_order_num = parseInt($('#wait-order-num').text());
	if(isNaN(wait_order_num))
		wait_order_num = 0;
	
	if(wait_order_num > 1){
		requestJSON("index_op.php", "pdisplay=display_cross_betting_div", "game_category=" + game_category);
	}else{
		pop_msg(show_msg(21, {'target': 'kangIndex'}));
	}
}

function confirm_hd_odds_change(msg, new_hd, new_odds){
	customize_layer_open({
		skin: "skin-2",
		area: ['90%'],
		title: change_lang_txt({"org_txt" : '訊息'}),
		content: msg + ", " + change_lang_txt({"org_txt" : '是否繼續下注'}) + "!",
		closeBtn: false,
		btn: [change_lang_txt({"org_txt" : '取消'}), change_lang_txt({"org_txt" : '下注'})],
		yes: function(index, layero){
			close_layer({'type':1});
			$('#betting-cancel').click();
		},
		btn2:function(index, layero){
			$('#betting-form input[name=bhd]').val(new_hd);
			$('#betting-form input[name=bodds]').val(new_odds);
			close_layer({'type':1});
			$('#betting-confirm').click();
		},
	});
}

function cross_confirm_hd_odds_change(msg, gc, eid, new_hd, new_odds){
	customize_layer_open({
		skin: "skin-2",
		area: ['90%'],
		title: change_lang_txt({"org_txt" : '訊息'}),
		content: msg + ", " + change_lang_txt({"org_txt" : '是否繼續下注'}) + "!",
		closeBtn: false,
		btn: [change_lang_txt({"org_txt" : '取消'}), change_lang_txt({"org_txt" : '下注'})],
		yes: function(index, layero){
			close_layer({'type':1});
			$('#cross-betting-cancel').click();
		},
		btn2:function(index, layero){
			close_layer({'type':1});
			new_hd = new_hd.replace("+", "%2B");				
			requestJSON("index_op.php", "pdisplay=update_cross_info", "gc=" + gc + "&eid=" + eid + "&new_hd=" + new_hd + "&new_odds=" + new_odds);
		},
	});
}
