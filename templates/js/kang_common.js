// JavaScript Document
var is_layer_loading = -1;//用來判斷當前是否已經有呼叫layer_loading且未關閉的，以免同個流程呼叫兩次layer_loading 會閃爍畫面
function isset(variable){
	if(typeof(variable) != "undefined" && variable !== null) {
		return true;
	}
	return false;
}

function change_lang_txt(args){
	if(typeof lang_obj !== 'undefined' && lang_obj[args["org_txt"]])
		return lang_obj[args["org_txt"]];

	return args["org_txt"];
}

function padLeft(str,lenght){
	if(str.length >= lenght)
		return str;
	else
		return padLeft("0" +str,lenght);
}

function floor_dec(v, precision){
	var c = Math.pow(10, precision);
	var e = Math.abs(v) * c;
	if(v < 0)
		return -1 * Math.floor(e) / c;
	else	
		return Math.floor(e) / c;
}

function check_is_mobile(){
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var is_mobile = false;
	for(var v = 0; v < Agents.length; v++){
		if(userAgentInfo.indexOf(Agents[v]) > 0){
			is_mobile = true;
			break;
		}
	}
	return is_mobile;
}

function customize_layer_open(opt_obj){
	layer.open(opt_obj);
}

function close_layer(opt_obj){
	//opt_obj key 
	//=>type:1 關掉全部layer
	if(opt_obj['type'] == 1){
		layer.closeAll();
		$(".layui-layer-shade").remove();
	}
	is_layer_loading = -1;
}

function layer_loading(opt_obj){
	if(is_layer_loading == -1){
		is_layer_loading = 1;
		if(!opt_obj['msg'])
			opt_obj['msg'] = change_lang_txt({"org_txt" : '載入中'});

		if(opt_obj['type'] == 1){
			customize_layer_open({
				title: false,
				content: (opt_obj['msg'] + "..."),
				closeBtn: false,
				shade: 0.5,
				btn: false,
				type: 0,
				icon: 16
			});
		}
	}
}

function reset_font_size(){
	var max_size = 106;
	var now_size = parseInt($(window).width() / 7.5);
	if (now_size > max_size)
		now_size = max_size;
	
	$("html").css("font-size", now_size);
}

function pop_msg(msg, pop_type){
	if(!pop_type)
		pop_type = 1;
		
	switch(pop_type){
		case 1://一般提示訊息用(不能重疊跳出)
			customize_layer_open({
				skin: "skin-1",
				title: change_lang_txt({"org_txt" : '訊息'}),
				content: msg,
				closeBtn: false,
				area: ['90%'],
				btn: change_lang_txt({"org_txt" : '確定'}),
				//shadeClose: true,
			});
			break;
		case 2://一般提示訊息用(可重疊跳出 給比如公告彈窗用)
			customize_layer_open({
				skin: "skin-1",
				title: change_lang_txt({"org_txt" : '訊息'}),
				content: msg,
				closeBtn: false,
				area: ['90%'],
				btn: change_lang_txt({"org_txt" : '確定'}),
				type: 1
				//shadeClose: true,
			});
			break;
		case 3://有關要投注的操作流程 有任何提示訊息用
			customize_layer_open({
				skin: "skin-1",
				title: change_lang_txt({"org_txt" : '訊息'}),
				content: msg,
				closeBtn: false,
				area: ['90%'],
				btn: change_lang_txt({"org_txt" : '確定'}),
				yes: function(index, layero){
					ck_betting_div_display_status();
					close_layer({'type':1});
				}
			});
			break;
		case 4://投注成功跳出用
			customize_layer_open({
				skin: "skin-3",
				title: change_lang_txt({"org_txt" : '下注成功'}),
				content: msg,
				closeBtn: false,
				area: ['90%'],
				btn: change_lang_txt({"org_txt" : '確定'}),
				yes: function(index, layero){
					hide_betting_div();
					close_layer({'type':1});
				}
			});
			break;	
	}
}

function show_msg(msg_code, args){
	var msg = "";
	var target = args.target;
	if(args !== null){
		if(args.hasOwnProperty('m1'))
			args.m1 = '<span class="warning-txt">' + args.m1 + '</span>';
		else
			args.m1 = "";
			
		if(args.hasOwnProperty('m2'))
			args.m2 = '<span class="warning-txt">' + args.m2 + '</span>';
		else
			args.m2 = "";
			
		if(args.hasOwnProperty('m3'))
			args.m3 = '<span class="warning-txt">' + args.m3 + '</span>';
		else
			args.m3 = "";
	}
	
	switch(target) {
		case "kangIndex":
            if(msg_code == -1){
				msg = change_lang_txt({"org_txt" : "下注成功，請至投注明細查詢"}) + "!";
			}else if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "系統忙碌中"}) + "!";
			}else if(msg_code == 2){
				msg = change_lang_txt({"org_txt" : "多人下注中，請稍候"}) + "!";
			}else if(msg_code == 3){
				msg = change_lang_txt({"org_txt" : "盤口已關閉"}) + "!";
			}else if(msg_code == 4){
				msg = change_lang_txt({"org_txt" : "盤口已變動"}) + "!";
			}else if(msg_code == 5){
				msg = change_lang_txt({"org_txt" : "賠率已變動"}) + "!";
			}else if(msg_code == 6){
				msg = change_lang_txt({"org_txt" : "盤口賠率已變動"}) + "!";
			}else if(msg_code == 7){
				msg = change_lang_txt({"org_txt" : "賽事已關閉"}) + "!";
			}else if(msg_code == 8){
				msg = change_lang_txt({"org_txt" : "請重新下注"}) + "!";
			}else if(msg_code == 9){
				msg = change_lang_txt({"org_txt" : "請稍後"}) + "!";
			}else if(msg_code == 10){
				msg = change_lang_txt({"org_txt" : "下注金額不可低於100"}) + "!";
			}else if(msg_code == 11){
				msg = change_lang_txt({"org_txt" : "系統忙碌中"}) + "!";
			}else if(msg_code == 12){
				msg = change_lang_txt({"org_txt" : "下注金額已超過單注上限"}) + "!";
			}else if(msg_code == 13){
				msg = change_lang_txt({"org_txt" : "下注金額已超過單隊上限"}) + "!";
			}else if(msg_code == 14){
				msg = change_lang_txt({"org_txt" : "下注金額已超過單邊上限"}) + "!";
			}else if(msg_code == 15){
				msg = change_lang_txt({"org_txt" : "賽事資訊錯誤"}) + "!";
			}else if(msg_code == 16){
				msg = change_lang_txt({"org_txt" : "您目前沒有足夠的額度可以進行下注"}) + "!";
			}else if(msg_code == 17){
				msg = change_lang_txt({"org_txt" : "[盤口]已變動為"}) + " " + args.m1;
			}else if(msg_code == 18){
				msg = change_lang_txt({"org_txt" : "[賠率]已變動為"}) + " " + args.m1;
			}else if(msg_code == 19){
				msg = change_lang_txt({"org_txt" : "[盤口]已變動為"}) + " " + args.m1 + " " + change_lang_txt({"org_txt" : "[賠率]已變動為"}) + " " + args.m2;
			}else if(msg_code == 20){
				msg = change_lang_txt({"org_txt" : "已超過最大串關數"}) + "!";
			}else if(msg_code == 21){
				msg = change_lang_txt({"org_txt" : "至少選擇兩關"}) + "!";
			}else if(msg_code == 22){
				msg = change_lang_txt({"org_txt" : "不同帳務日期賽事無法進行串關"}) + "!";
			}else if(msg_code == 23){
				msg = change_lang_txt({"org_txt" : "投注功能已停用"}) + "!";
			}else if(msg_code == 'default'){
				msg = args.m1 + "!";
			}
            break;
		case "kangLoginPass":
            if(msg_code == -1){
				msg = change_lang_txt({"org_txt" : "操作成功"}) + "!";
			}else if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "操作失敗"}) + "!";
			}else if(msg_code == 2){
				msg = change_lang_txt({"org_txt" : "舊密碼不能為空"}) + "!";
			}else if(msg_code == 3){
                msg = change_lang_txt({"org_txt" : "新密碼不能為空"}) + "!";    
            }else if(msg_code == 4){
                msg = change_lang_txt({"org_txt" : "新密碼只能英文數字組合"}) + "!";    
            }else if(msg_code == 5){
                msg = change_lang_txt({"org_txt" : "新密碼與確認密碼不一樣"}) + "!";    
            }else if(msg_code == 6){
                msg = change_lang_txt({"org_txt" : "新密碼長度須為3 - 12位"}) + "!";    
            }else if(msg_code == 7){
                msg = change_lang_txt({"org_txt" : "輸入舊密碼錯誤，請重新輸入"}) + "!";    
            }
            break;
		case "kangNews":
			if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "操作失敗"}) + "!";
			}
			break;
		case "kangTodayMemberOrder":
		case "kangHistoryMemberOrder":
			if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "錯誤"}) + "!" + "(Error -> " + args.m1 + " )";
			}
			break;
		case "kangFeatures":
			if(msg_code == -1){
				msg = change_lang_txt({"org_txt" : "修改成功"}) + "!";
			}else if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "請輸入快速下注金額"}) + "!";
			}else if(msg_code == 2){
				msg = change_lang_txt({"org_txt" : "請輸入預設金額"}) + "!";
			}else if(msg_code == 3){
				msg = change_lang_txt({"org_txt" : "預設金額不得小於100"}) + "!";
			}
			break;
		case "kangTransferQuota":
            if(msg_code == -1){
				msg = change_lang_txt({"org_txt" : "操作成功"}) + "!";
			}else if(msg_code == -2){
				msg = change_lang_txt({"org_txt" : "轉回主帳戶成功"}) + "!";
			}else if(msg_code == -3){
				msg = change_lang_txt({"org_txt" : "轉回主帳戶成功"}) + "!<br/>" + change_lang_txt({"org_txt" : "除了"}) + "<br/>";
			}else if(msg_code == 1){
				msg = change_lang_txt({"org_txt" : "操作失敗"}) + "!";
			}else if(msg_code == 2){
				msg = change_lang_txt({"org_txt" : "請輸入大於0的整數金額"}) + "!";
			}else if(msg_code == 3){
                msg = args.m1 + " - " + change_lang_txt({"org_txt" : "維護中"}) + "!";    
            }else if(msg_code == 4){
                msg = args.m1 + " - " + change_lang_txt({"org_txt" : "讀取異常"}) + "!";    
            }else if(msg_code == 5){
                msg = args.m1 + " - " + change_lang_txt({"org_txt" : "額度不足"}) + "!";    
            }else if(msg_code == 6){
                msg = change_lang_txt({"org_txt" : "主帳戶額度不足"}) + "!";    
            }else if(msg_code == 7){
                msg = args.m1 + " - " + change_lang_txt({"org_txt" : "剩餘額度大於限制，目前無法進行點數提取"}) + "!";    
            }else if(msg_code == 8){
                msg = args.m1 + " - " + change_lang_txt({"org_txt" : "轉點失敗"}) + "!";    
            }else if(msg_code == 9){
                msg = change_lang_txt({"org_txt" : "此帳號已被停押"}) + "!";    
            }else if(msg_code == 10){
                msg = change_lang_txt({"org_txt" : "無法轉入"}) + " - " + args.m1 + "!, <br />" + change_lang_txt({"org_txt" : "轉帳金額退回主帳戶"}) + "!";    
            }
            break;
		default:
			msg = change_lang_txt({"org_txt" : "未知錯誤"}) + "!";
	} 
	return msg;
}