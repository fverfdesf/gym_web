jQuery.extend({
    createUploadIframe: function(b, e) {
        var a = "jUploadFrame" + b,
            c = '<iframe id="' + a + '" name="' + a + '" style="position:absolute; top:-9999px; left:-9999px"';
        window.ActiveXObject && ("boolean" == typeof e ? c += ' src="javascript:false"' : "string" == typeof e && (c += ' src="' + e + '"'));
        jQuery(c + " />").appendTo(document.body);
        return jQuery("#" + a).get(0)
    },
    createUploadForm: function(b, e) {
        var a = "jUploadForm" + b,
            c = "jUploadFile" + b,
            a = jQuery('<form  action="" method="POST" name="' + a + '" id="' + a + '" enctype="multipart/form-data"></form>'),
            f = jQuery("#" + e),
            d = jQuery(f).clone();
        jQuery(f).attr("id", c);
        jQuery(f).before(d);
        jQuery(f).appendTo(a);
        jQuery(a).css("position", "absolute");
        jQuery(a).css("top", "-1200px");
        jQuery(a).css("left", "-1200px");
        jQuery(a).appendTo("body");
        return a
    },
    ajaxFileUpload: function(b) {
        b = jQuery.extend({}, jQuery.ajaxSettings, b);
        var e = (new Date).getTime(),
            a = jQuery.createUploadForm(e, b.fileElementId);
        jQuery.createUploadIframe(e, b.secureuri);
        var c = "jUploadFrame" + e,
            e = "jUploadForm" + e;
        b.global && !jQuery.active++ && jQuery.event.trigger("ajaxStart");
        var f = !1,
            d = {};
        b.global && jQuery.event.trigger("ajaxSend", [d, b]);
        var g = function(h) {
            var k = document.getElementById(c);
            try {
                k.contentWindow ? (d.responseText = k.contentWindow.document.body ? k.contentWindow.document.body.innerHTML : null, d.responseXML = k.contentWindow.document.XMLDocument ? k.contentWindow.document.XMLDocument : k.contentWindow.document) : k.contentDocument && (d.responseText = k.contentDocument.document.body ? k.contentDocument.document.body.innerHTML : null, d.responseXML = k.contentDocument.document.XMLDocument ?
                    k.contentDocument.document.XMLDocument : k.contentDocument.document)
            } catch (m) {
                jQuery.handleError(b, d, null, m)
            }
            if (d || "timeout" == h) {
                f = !0;
                var e;
                try {
                    if (e = "timeout" != h ? "success" : "error", "error" != e) {
                        var g = jQuery.uploadHttpData(d, b.dataType);
                        b.success && b.success(g, e);
                        b.global && jQuery.event.trigger("ajaxSuccess", [d, b])
                    } else jQuery.handleError(b, d, e)
                } catch (l) {
                    e = "error", jQuery.handleError(b, d, e, l)
                }
                b.global && jQuery.event.trigger("ajaxComplete", [d, b]);
                b.global && !--jQuery.active && jQuery.event.trigger("ajaxStop");
                b.complete && b.complete(d, e);
                jQuery(k).unbind();
                setTimeout(function() {
                    try {
                        jQuery(k).remove(), jQuery(a).remove()
                    } catch (h) {
                        jQuery.handleError(b, d, null, h)
                    }
                }, 100);
                d = null
            }
        };
        0 < b.timeout && setTimeout(function() {
            f || g("timeout")
        }, b.timeout);
        try {
            a = jQuery("#" + e), jQuery(a).attr("action", b.url), jQuery(a).attr("method", "POST"), jQuery(a).attr("target", c), a.encoding ? jQuery(a).attr("encoding", "multipart/form-data") : jQuery(a).attr("enctype", "multipart/form-data"), jQuery(a).submit()
        } catch (l) {
            jQuery.handleError(b, d, null,
                l)
        }
        jQuery("#" + c).load(g);
        return {
            abort: function() {}
        }
    },
    uploadHttpData: function(b, e) {
        var a;
        a = "xml" != e && e ? b.responseText : b.responseXML;
        "script" == e && jQuery.globalEval(a);
        "json" == e && eval("data = " + a);
        "html" == e && jQuery("<div>").html(a).evalScripts();
        return a
    }
});

function requestXmlFILE(b, e, a, c, f) {
    switch (f) {
        case 98:
            f = $(a).offset();
            var d = $(a).width(),
                g = $(a).height(),
                l = $(window).height(),
                d = d + (parseInt($(a).css("padding-left"), 10) + parseInt($(a).css("padding-right"), 10)),
                d = d + (parseInt($(a).css("margin-left"), 10) + parseInt($(a).css("margin-right"), 10)),
                d = d + (parseInt($(a).css("borderLeftWidth"), 10) + parseInt($(a).css("borderRightWidth"), 10)),
                g = g + (parseInt($(a).css("padding-top"), 10) + parseInt($(a).css("padding-bottom"), 10)),
                g = g + (parseInt($(a).css("margin-top"), 10) +
                    parseInt($(a).css("margin-bottom"), 10)),
                g = g + (parseInt($(a).css("borderTopWidth"), 10) + parseInt($(a).css("borderBottomWidth"), 10));
            g < l && (l = g);
            $("#mask_screen").css({
                opacity: 0.7,
                width: d,
                height: g,
                "z-index": 99999,
                top: f.top,
                left: f.left
            }).show();
            $("#mask_screen img").css({
                top: l / 2,
                left: d / 2
            });
            $.ajaxFileUpload({
                url: b + "?" + e,
                secureuri: !1,
                fileElementId: c,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            h = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (h) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(h).html(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            });
            break;
        default:
            $.ajaxFileUpload({
                url: b + "?" + e,
                secureuri: !1,
                fileElementId: c,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            h = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (h) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(h).html(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            })
    }
    return !1
}

function requestXmlPOST(b, e, a, c, f) {
    switch (f) {
        case 1:
            $(a).fadeOut("normal", function() {
                $.ajax({
                    type: "POST",
                    url: b + "?" + e,
                    data: $(c).serialize(),
                    dataType: "xml",
                    cache: !1,
                    success: function(a) {
                        $(a).find("ajaxdata").each(function() {
                            var a = $(this),
                                h = a.find("spanid").text(),
                                a = $("rtntext", a).text();
                            switch (h) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(h).html(a), $(h).fadeIn("normal")
                            }
                        })
                    }
                })
            });
            break;
        case 2:
            $(a).slideUp("normal", function() {
                $.ajax({
                    type: "POST",
                    url: b + "?" + e,
                    data: $(c).serialize(),
                    dataType: "xml",
                    cache: !1,
                    success: function(a) {
                        $(a).find("ajaxdata").each(function() {
                            var a = $(this),
                                h = a.find("spanid").text(),
                                a = $("rtntext", a).text();
                            switch (h) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(h).html(a), $(h).slideDown("slow")
                            }
                        })
                    }
                })
            });
            break;
        case 98:
            f = $(a).offset();
            var d = $(a).width(),
                g = $(a).height(),
                l = $(window).height(),
                d = d + (parseInt($(a).css("padding-left"), 10) + parseInt($(a).css("padding-right"), 10)),
                d = d + (parseInt($(a).css("margin-left"), 10) + parseInt($(a).css("margin-right"), 10)),
                d = d + (parseInt($(a).css("borderLeftWidth"),
                    10) + parseInt($(a).css("borderRightWidth"), 10)),
                g = g + (parseInt($(a).css("padding-top"), 10) + parseInt($(a).css("padding-bottom"), 10)),
                g = g + (parseInt($(a).css("margin-top"), 10) + parseInt($(a).css("margin-bottom"), 10)),
                g = g + (parseInt($(a).css("borderTopWidth"), 10) + parseInt($(a).css("borderBottomWidth"), 10));
            g < l && (l = g);
            $("#mask_screen").css({
                opacity: 0.7,
                width: d,
                height: g,
                "z-index": 99999,
                top: f.top,
                left: f.left
            }).show();
            $("#mask_screen img").css({
                top: l / 2,
                left: d / 2
            });
            $.ajax({
                type: "POST",
                url: b + "?" + e,
                data: $(c).serialize(),
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            h = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (h) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(h).html(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            });
            break;
        case 99:
            $(a).html('<img src="images/loading.gif" class="temp-waiting">');
            $.ajax({
                type: "POST",
                url: b + "?" + e,
                data: $(c).serialize(),
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            h = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (h) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(h).html(a)
                        }
                    })
                }
            });
            break;
        default:
            $.ajax({
                type: "POST",
                url: b + "?" + e,
                data: $(c).serialize(),
                dataType: "xml",
                cache: !1,
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            h = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (h) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(h).html(a)
                        }
                    })
                }
            })
    }
    return !1
}

function requestXmlGET(b, e, a, c, f) {
    switch (f) {
        case 1:
            $(a).fadeOut("normal", function() {
                $.ajax({
                    type: "GET",
                    url: b,
                    data: e,
                    dataType: "xml",
                    success: function(a) {
                        $(a).find("ajaxdata").each(function() {
                            var a = $(this),
                                k = a.find("spanid").text(),
                                a = $("rtntext", a).text();
                            switch (k) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(k).html(a).fadeIn("normal")
                            }
                        })
                    }
                })
            });
            break;
        case 2:
            $(a).slideUp("normal", function() {
                $.ajax({
                    type: "GET",
                    url: b,
                    data: e,
                    dataType: "xml",
                    success: function(a) {
                        $(a).find("ajaxdata").each(function() {
                            var a = $(this),
                                k = a.find("spanid").text(),
                                a = $("rtntext", a).text();
                            switch (k) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(k).html(a), $(k).slideDown("slow")
                            }
                        })
                    }
                })
            });
            break;
        case 3:
            $.ajax({
                type: "GET",
                url: b,
                data: e,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            k = a.find("spanid").text(),
                            b = a.find("effect").text(),
                            c = $("rtntext", a).text();
                        switch (k) {
                            case "javascript":
                                eval(c);
                                break;
                            default:
                                9 == b ? $(k).html(c) : ($(k).hide("slide", {
                                    direction: "right"
                                }, 250, function() {
                                    $(k).html(c)
                                }), $(k).show("slide", {
                                    direction: "left"
                                }, 1E3))
                        }
                    })
                }
            });
            break;
        case 4:
            $.ajax({
                type: "GET",
                url: b,
                data: e,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            b = a.find("spanid").text(),
                            c = a.find("effect").text(),
                            d = $("rtntext", a).text();
                        switch (b) {
                            case "javascript":
                                eval(d);
                                break;
                            default:
                                9 == c ? $(b).html(d) : ($(b).hide("slide", {
                                    direction: "left"
                                }, 250, function() {
                                    $(b).html(d)
                                }), $(b).show("slide", {
                                    direction: "right"
                                }, 1E3))
                        }
                    })
                }
            });
            break;
        case 98:
            c = $(a).offset();
            f = $(a).width();
            var d = $(a).height(),
                g = $(window).height();
            f += parseInt($(a).css("padding-left"), 10) + parseInt($(a).css("padding-right"), 10);
            f += parseInt($(a).css("margin-left"), 10) + parseInt($(a).css("margin-right"), 10);
            f += parseInt($(a).css("borderLeftWidth"), 10) + parseInt($(a).css("borderRightWidth"), 10);
            d += parseInt($(a).css("padding-top"), 10) + parseInt($(a).css("padding-bottom"), 10);
            d += parseInt($(a).css("margin-top"), 10) + parseInt($(a).css("margin-bottom"), 10);
            d += parseInt($(a).css("borderTopWidth"), 10) + parseInt($(a).css("borderBottomWidth"), 10);
            d < g && (g = d);
            $("#mask_screen").css({
                opacity: 0.7,
                width: f,
                height: d,
                "z-index": 99999,
                top: c.top,
                left: c.left
            }).show();
            $("#mask_screen img").css({
                top: g / 2,
                left: f / 2
            });
            $.ajax({
                type: "GET",
                url: b,
                data: e,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            b = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).html(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            });
            break;
        case 99:
            $(a).html('<img src="images/loading.gif" class="temp-waiting">');
            $.ajax({
                type: "GET",
                url: b,
                data: e,
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a =
                            $(this),
                            b = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).html(a)
                        }
                    })
                }
            });
            break;
        default:
            $.ajax({
                type: "GET",
                url: b + "?" + e,
                data: $(c).serialize(),
                dataType: "xml",
                success: function(a) {
                    $(a).find("ajaxdata").each(function() {
                        var a = $(this),
                            b = a.find("spanid").text(),
                            a = $("rtntext", a).text();
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).html(a)
                        }
                    })
                }
            })
    }
    return !1
}

function requestJSON(b, e, a, c, f, d) {
    switch (d) {
        case 1:
            $(f).fadeOut("normal", function() {
                $.ajax({
                    type: "POST",
                    url: "op" + "/" + b + "?" + e,
                    data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                    dataType: "json",
                    cache: !1,
                    success: function(a) {
                        null != a && $.each(a.root.ajaxdata, function() {
                            var a = $(this)[0],
                                b = a.spanid,
                                a = a.rtntext;
                            switch (b) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(b).empty().append(a)
                            }
                        })
                    }
                })
            });
            break;
        case 2:
            $(f).slideUp("normal", function() {
                $.ajax({
                    type: "POST",
                    url: "op" + "/" + b + "?" + e,
                    data: (void 0 ==
                        a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                    dataType: "json",
                    cache: !1,
                    success: function(a) {
                        null != a && $.each(a.root.ajaxdata, function() {
                            var a = $(this)[0],
                                b = a.spanid,
                                a = a.rtntext;
                            switch (b) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(b).empty().append(a)
                            }
                        })
                    }
                })
            });
            break;
        case 98:
            d = $(f).offset();
            var g = $(f).width(),
                l = $(f).height(),
                h = $(window).height(),
                g = g + (parseInt($(f).css("padding-left"), 10) + parseInt($(f).css("padding-right"), 10)),
                g = g + (parseInt($(f).css("margin-left"), 10) + parseInt($(f).css("margin-right"),
                    10)),
                g = g + (parseInt($(f).css("borderLeftWidth"), 10) + parseInt($(f).css("borderRightWidth"), 10)),
                l = l + (parseInt($(f).css("padding-top"), 10) + parseInt($(f).css("padding-bottom"), 10)),
                l = l + (parseInt($(f).css("margin-top"), 10) + parseInt($(f).css("margin-bottom"), 10)),
                l = l + (parseInt($(f).css("borderTopWidth"), 10) + parseInt($(f).css("borderBottomWidth"), 10));
            l < h && (h = l);
            $("#mask_screen").css({
                opacity: 0.7,
                width: g,
                height: l,
                "z-index": 99999,
                top: d.top,
                left: d.left
            }).show();
            $("#mask_screen img").css({
                top: h / 2,
                left: g / 2
            });
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).empty().append(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            });
            break;
        case 99:
            $(f).html('<img src="templates/images/loading.svg" class="temp-waiting">');
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" ==
                    c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).empty().append(a)
                        }
                    })
                }
            });
            break;
        default:
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                cache: !1,
				//timeout:300000,//可能有下注延遲關西 所以久一點
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).empty().append(a)
                        }
                    })
                },
				 error: function(jqXHR, textStatus, errorThrown){
					 //alert(e);
					 /*if(e == "pdisplay=events_reload_all"){//如果是reload發生錯誤 讓他繼續reload
						 $('#events-reload-all img').click();
					 }*/
				 }
            })
    }
    return !1
};


function requestInsertJSON(b, e, a, c, f, d) {
    switch (d) {
        case 1:
            $(f).fadeOut("normal", function() {
                $.ajax({
                    type: "POST",
                    url: "op" + "/" + b + "?" + e,
                    data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                    dataType: "json",
                    cache: !1,
                    success: function(a) {
                        null != a && $.each(a.root.ajaxdata, function() {
                            var a = $(this)[0],
                                b = a.spanid,
                                a = a.rtntext;
                            switch (b) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(b).append(a)
                            }
                        })
                    }
                })
            });
            break;
        case 2:
            $(f).slideUp("normal", function() {
                $.ajax({
                    type: "POST",
                    url: "op" + "/" + b + "?" + e,
                    data: (void 0 ==
                        a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                    dataType: "json",
                    cache: !1,
                    success: function(a) {
                        null != a && $.each(a.root.ajaxdata, function() {
                            var a = $(this)[0],
                                b = a.spanid,
                                a = a.rtntext;
                            switch (b) {
                                case "javascript":
                                    eval(a);
                                    break;
                                default:
                                    $(b).append(a)
                            }
                        })
                    }
                })
            });
            break;
        case 98:
            d = $(f).offset();
            var g = $(f).width(),
                l = $(f).height(),
                h = $(window).height(),
                g = g + (parseInt($(f).css("padding-left"), 10) + parseInt($(f).css("padding-right"), 10)),
                g = g + (parseInt($(f).css("margin-left"), 10) + parseInt($(f).css("margin-right"),
                    10)),
                g = g + (parseInt($(f).css("borderLeftWidth"), 10) + parseInt($(f).css("borderRightWidth"), 10)),
                l = l + (parseInt($(f).css("padding-top"), 10) + parseInt($(f).css("padding-bottom"), 10)),
                l = l + (parseInt($(f).css("margin-top"), 10) + parseInt($(f).css("margin-bottom"), 10)),
                l = l + (parseInt($(f).css("borderTopWidth"), 10) + parseInt($(f).css("borderBottomWidth"), 10));
            l < h && (h = l);
            $("#mask_screen").css({
                opacity: 0.7,
                width: g,
                height: l,
                "z-index": 99999,
                top: d.top,
                left: d.left
            }).show();
            $("#mask_screen img").css({
                top: h / 2,
                left: g / 2
            });
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).append(a)
                        }
                    });
                    $("#mask_screen").hide()
                }
            });
            break;
        case 99:
            $(f).html('<img src="templates/images/loading.svg" class="temp-waiting">');
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" ==
                    c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).append(a)
                        }
                    })
                }
            });
            break;
        default:
            $.ajax({
                type: "POST",
                url: "op" + "/" + b + "?" + e,
                data: (void 0 == a || "" == a ? "" : a + (void 0 == c || "" == c ? "" : "&")) + (void 0 == c || "" == c ? "" : $(c).serialize()),
                dataType: "json",
                cache: !1,
				//timeout:300000,//可能有下注延遲關西 所以久一點
                success: function(a) {
                    null != a && $.each(a.root.ajaxdata, function() {
                        var a = $(this)[0],
                            b = a.spanid,
                            a = a.rtntext;
                        switch (b) {
                            case "javascript":
                                eval(a);
                                break;
                            default:
                                $(b).append(a)
                        }
                    })
                },
				 error: function(jqXHR, textStatus, errorThrown){
					 //alert(e);
					 /*if(e == "pdisplay=events_reload_all"){//如果是reload發生錯誤 讓他繼續reload
						 $('#events-reload-all img').click();
					 }*/
				 }
            })
    }
    return !1
};