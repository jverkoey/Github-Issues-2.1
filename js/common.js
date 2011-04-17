var GitHub = {
  assetHost: 'https://d3nwyuy0nl342s.cloudfront.net'
};

var github_user = 'jverkoey';

(function(a) {
    a.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"],
    function(d, f) {
        a.fx.step[f] = function(g) {
            if (g.state == 0) {
                g.start = e(g.elem, f);
                g.end = c(g.end)
            }
            g.elem.style[f] = "rgb(" + [Math.max(Math.min(parseInt(g.pos * (g.end[0] - g.start[0]) + g.start[0]), 255), 0), Math.max(Math.min(parseInt(g.pos * (g.end[1] - g.start[1]) + g.start[1]), 255), 0), Math.max(Math.min(parseInt(g.pos * (g.end[2] - g.start[2]) + g.start[2]), 255), 0)].join(",") + ")"
        }
    });
    function c(d) {
        var f;
        if (d && d.constructor == Array && d.length == 3) return d;
        if (f = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(d)) return [parseInt(f[1]), parseInt(f[2]), parseInt(f[3])];
        if (f = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(d)) return [parseFloat(f[1]) * 2.55, parseFloat(f[2]) * 2.55, parseFloat(f[3]) * 2.55];
        if (f = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(d)) return [parseInt(f[1], 16), parseInt(f[2], 16), parseInt(f[3], 16)];
        if (f = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(d)) return [parseInt(f[1] +
        f[1], 16), parseInt(f[2] + f[2], 16), parseInt(f[3] + f[3], 16)];
        return b[a.trim(d).toLowerCase()]
    }
    function e(d, f) {
        var g;
        do {
            g = a.curCSS(d, f);
            if (g != "" && g != "transparent" || a.nodeName(d, "body")) break;
            f = "backgroundColor"
        }
        while (d = d.parentNode);
        return c(g)
    }
    var b = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85,
        107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    }
})(jQuery);
jQuery.cookie = function(a, c, e) {
    if (typeof c != "undefined") {
        e = e || {};
        if (c === null) {
            c = "";
            e.expires = -1
        }
        var b = "";
        if (e.expires && (typeof e.expires == "number" || e.expires.toUTCString)) {
            if (typeof e.expires == "number") {
                b = new Date;
                b.setTime(b.getTime() + e.expires * 24 * 60 * 60 * 1000)
            } else b = e.expires;
            b = "; expires=" + b.toUTCString()
        }
        var d = e.path ? "; path=" + e.path: "",
        f = e.domain ? "; domain=" + e.domain: "";
        e = e.secure ? "; secure": "";
        document.cookie = [a, "=", encodeURIComponent(c), b, d, f, e].join("")
    } else {
        c = null;
        if (document.cookie && document.cookie !=
        "") {
            e = document.cookie.split(";");
            for (b = 0; b < e.length; b++) {
                d = jQuery.trim(e[b]);
                if (d.substring(0, a.length + 1) == a + "=") {
                    c = decodeURIComponent(d.substring(a.length + 1));
                    break
                }
            }
        }
        return c
    }
};
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(a, c, e, b, d) {
        return jQuery.easing[jQuery.easing.def](a, c, e, b, d)
    },
    easeInQuad: function(a, c, e, b, d) {
        return b * (c /= d) * c + e
    },
    easeOutQuad: function(a, c, e, b, d) {
        return - b * (c /= d) * (c - 2) + e
    },
    easeInOutQuad: function(a, c, e, b, d) {
        if ((c /= d / 2) < 1) return b / 2 * c * c + e;
        return - b / 2 * (--c * (c - 2) - 1) + e
    },
    easeInCubic: function(a, c, e, b, d) {
        return b * (c /= d) * c * c + e
    },
    easeOutCubic: function(a, c, e, b, d) {
        return b * ((c = c / d - 1) * c * c + 1) + e
    },
    easeInOutCubic: function(a, c, e, b, d) {
        if ((c /= d / 2) < 1) return b /
        2 * c * c * c + e;
        return b / 2 * ((c -= 2) * c * c + 2) + e
    },
    easeInQuart: function(a, c, e, b, d) {
        return b * (c /= d) * c * c * c + e
    },
    easeOutQuart: function(a, c, e, b, d) {
        return - b * ((c = c / d - 1) * c * c * c - 1) + e
    },
    easeInOutQuart: function(a, c, e, b, d) {
        if ((c /= d / 2) < 1) return b / 2 * c * c * c * c + e;
        return - b / 2 * ((c -= 2) * c * c * c - 2) + e
    },
    easeInQuint: function(a, c, e, b, d) {
        return b * (c /= d) * c * c * c * c + e
    },
    easeOutQuint: function(a, c, e, b, d) {
        return b * ((c = c / d - 1) * c * c * c * c + 1) + e
    },
    easeInOutQuint: function(a, c, e, b, d) {
        if ((c /= d / 2) < 1) return b / 2 * c * c * c * c * c + e;
        return b / 2 * ((c -= 2) * c * c * c * c + 2) + e
    },
    easeInSine: function(a,
    c, e, b, d) {
        return - b * Math.cos(c / d * (Math.PI / 2)) + b + e
    },
    easeOutSine: function(a, c, e, b, d) {
        return b * Math.sin(c / d * (Math.PI / 2)) + e
    },
    easeInOutSine: function(a, c, e, b, d) {
        return - b / 2 * (Math.cos(Math.PI * c / d) - 1) + e
    },
    easeInExpo: function(a, c, e, b, d) {
        return c == 0 ? e: b * Math.pow(2, 10 * (c / d - 1)) + e
    },
    easeOutExpo: function(a, c, e, b, d) {
        return c == d ? e + b: b * ( - Math.pow(2, -10 * c / d) + 1) + e
    },
    easeInOutExpo: function(a, c, e, b, d) {
        if (c == 0) return e;
        if (c == d) return e + b;
        if ((c /= d / 2) < 1) return b / 2 * Math.pow(2, 10 * (c - 1)) + e;
        return b / 2 * ( - Math.pow(2, -10 * --c) + 2) + e
    },
    easeInCirc: function(a, c, e, b, d) {
        return - b * (Math.sqrt(1 - (c /= d) * c) - 1) + e
    },
    easeOutCirc: function(a, c, e, b, d) {
        return b * Math.sqrt(1 - (c = c / d - 1) * c) + e
    },
    easeInOutCirc: function(a, c, e, b, d) {
        if ((c /= d / 2) < 1) return - b / 2 * (Math.sqrt(1 - c * c) - 1) + e;
        return b / 2 * (Math.sqrt(1 - (c -= 2) * c) + 1) + e
    },
    easeInElastic: function(a, c, e, b, d) {
        a = 1.70158;
        var f = 0,
        g = b;
        if (c == 0) return e;
        if ((c /= d) == 1) return e + b;
        f || (f = d * 0.3);
        if (g < Math.abs(b)) {
            g = b;
            a = f / 4
        } else a = f / (2 * Math.PI) * Math.asin(b / g);
        return - (g * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * d - a) * 2 * Math.PI / f)) + e
    },
    easeOutElastic: function(a,
    c, e, b, d) {
        a = 1.70158;
        var f = 0,
        g = b;
        if (c == 0) return e;
        if ((c /= d) == 1) return e + b;
        f || (f = d * 0.3);
        if (g < Math.abs(b)) {
            g = b;
            a = f / 4
        } else a = f / (2 * Math.PI) * Math.asin(b / g);
        return g * Math.pow(2, -10 * c) * Math.sin((c * d - a) * 2 * Math.PI / f) + b + e
    },
    easeInOutElastic: function(a, c, e, b, d) {
        a = 1.70158;
        var f = 0,
        g = b;
        if (c == 0) return e;
        if ((c /= d / 2) == 2) return e + b;
        f || (f = d * 0.3 * 1.5);
        if (g < Math.abs(b)) {
            g = b;
            a = f / 4
        } else a = f / (2 * Math.PI) * Math.asin(b / g);
        if (c < 1) return - 0.5 * g * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * d - a) * 2 * Math.PI / f) + e;
        return g * Math.pow(2, -10 * (c -= 1)) * Math.sin((c *
        d - a) * 2 * Math.PI / f) * 0.5 + b + e
    },
    easeInBack: function(a, c, e, b, d, f) {
        if (f == undefined) f = 1.70158;
        return b * (c /= d) * c * ((f + 1) * c - f) + e
    },
    easeOutBack: function(a, c, e, b, d, f) {
        if (f == undefined) f = 1.70158;
        return b * ((c = c / d - 1) * c * ((f + 1) * c + f) + 1) + e
    },
    easeInOutBack: function(a, c, e, b, d, f) {
        if (f == undefined) f = 1.70158;
        if ((c /= d / 2) < 1) return b / 2 * c * c * (((f *= 1.525) + 1) * c - f) + e;
        return b / 2 * ((c -= 2) * c * (((f *= 1.525) + 1) * c + f) + 2) + e
    },
    easeInBounce: function(a, c, e, b, d) {
        return b - jQuery.easing.easeOutBounce(a, d - c, 0, b, d) + e
    },
    easeOutBounce: function(a, c, e, b, d) {
        return (c /=
        d) < 1 / 2.75 ? b * 7.5625 * c * c + e: c < 2 / 2.75 ? b * (7.5625 * (c -= 1.5 / 2.75) * c + 0.75) + e: c < 2.5 / 2.75 ? b * (7.5625 * (c -= 2.25 / 2.75) * c + 0.9375) + e: b * (7.5625 * (c -= 2.625 / 2.75) * c + 0.984375) + e
    },
    easeInOutBounce: function(a, c, e, b, d) {
        if (c < d / 2) return jQuery.easing.easeInBounce(a, c * 2, 0, b, d) * 0.5 + e;
        return jQuery.easing.easeOutBounce(a, c * 2 - d, 0, b, d) * 0.5 + b * 0.5 + e
    }
}); (function(a) {
    a.fn.enhancedField = function(c) {
        a.extend({},
        a.fn.enhancedField.defaults, c);
        var e = "placeholder" in document.createElement("input");
        return this.each(function() {
            var b = a(this);
            e || b.addClass("notnative");
            b.bind("blur keyup",
            function() {
                a(this).val() == "" ? a(this).addClass("placeholder") : a(this).removeClass("placeholder")
            }).blur();
            b.focus(function() {
                a(this).removeClass("placeholder")
            })
        })
    };
    a.fn.enhancedField.defaults = {}
})(jQuery); (function(a) {
    a.facebox = function(h, k) {
        a.facebox.loading();
        if (h.ajax) i(h.ajax, k);
        else if (h.image) g(h.image, k);
        else if (h.div) f(h.div, k);
        else a.isFunction(h) ? h.call(a) : a.facebox.reveal(h, k)
    };
    a.extend(a.facebox, {
        settings: {
            opacity: 0.2,
            overlay: true,
            loadingImage: "/facebox/loading.gif",
            closeImage: "/facebox/closelabel.png",
            imageTypes: ["png", "jpg", "jpeg", "gif"],
            faceboxHtml: '    <div id="facebox" style="display:none;">       <div class="popup">         <div class="content">         </div>         <a href="#" class="close"></a>       </div>     </div>'
        },
        loading: function() {
            c();
            if (a("#facebox .loading").length == 1) return true;
            m();
            a("#facebox .content").empty().append('<div class="loading"><img src="' + a.facebox.settings.loadingImage + '"/></div>');
            a("#facebox").show().css({
                top: e()[1] + b() / 10,
                left: a(window).width() / 2 - a("#facebox .popup").outerWidth() / 2
            });
            a(document).bind("keydown.facebox",
            function(h) {
                h.keyCode == 27 && a.facebox.close();
                return true
            });
            a(document).trigger("loading.facebox")
        },
        reveal: function(h, k) {
            a(document).trigger("beforeReveal.facebox");
            k &&
            a("#facebox .content").addClass(k);
            a("#facebox .content").append(h);
            a("#facebox .loading").remove();
            a("#facebox .popup").children().fadeIn("normal");
            a("#facebox").css("left", a(window).width() / 2 - a("#facebox .popup").outerWidth() / 2);
            a(document).trigger("reveal.facebox").trigger("afterReveal.facebox")
        },
        close: function() {
            a(document).trigger("close.facebox");
            return false
        }
    });
    a.fn.facebox = function(h) {
        if (a(this).length != 0) {
            function k() {
                a.facebox.loading(true);
                var l = this.rel.match(/facebox\[?\.(\w+)\]?/);
                if (l) l =
                l[1];
                f(this.href, l);
                return false
            }
            c(h);
            return this.bind("click.facebox", k)
        }
    };
    function c(h) {
        if (a.facebox.settings.inited) return true;
        else a.facebox.settings.inited = true;
        a(document).trigger("init.facebox");
        d();
        var k = a.facebox.settings.imageTypes.join("|");
        a.facebox.settings.imageTypesRegexp = new RegExp(".(" + k + ")$", "i");
        h && a.extend(a.facebox.settings, h);
        a("body").append(a.facebox.settings.faceboxHtml);
        var l = [new Image, new Image];
        l[0].src = a.facebox.settings.closeImage;
        l[1].src = a.facebox.settings.loadingImage;
        a("#facebox").find(".b:first, .bl").each(function() {
            l.push(new Image);
            l.slice( - 1).src = a(this).css("background-image").replace(/url\((.+)\)/, "$1")
        });
        a("#facebox .close").click(a.facebox.close).append('<img src="' + a.facebox.settings.closeImage + '" class="close_image" title="close">')
    }
    function e() {
        var h,
        k;
        if (self.pageYOffset) {
            k = self.pageYOffset;
            h = self.pageXOffset
        } else if (document.documentElement && document.documentElement.scrollTop) {
            k = document.documentElement.scrollTop;
            h = document.documentElement.scrollLeft
        } else if (document.body) {
            k =
            document.body.scrollTop;
            h = document.body.scrollLeft
        }
        return new Array(h, k)
    }
    function b() {
        var h;
        if (self.innerHeight) h = self.innerHeight;
        else if (document.documentElement && document.documentElement.clientHeight) h = document.documentElement.clientHeight;
        else if (document.body) h = document.body.clientHeight;
        return h
    }
    function d() {
        var h = a.facebox.settings;
        h.loadingImage = h.loading_image || h.loadingImage;
        h.closeImage = h.close_image || h.closeImage;
        h.imageTypes = h.image_types || h.imageTypes;
        h.faceboxHtml = h.facebox_html || h.faceboxHtml
    }
    function f(h, k) {
        if (h.match(/#/)) {
            var l = window.location.href.split("#")[0];
            h = h.replace(l, "");
            h != "#" && a.facebox.reveal(a(h).html(), k)
        } else h.match(a.facebox.settings.imageTypesRegexp) ? g(h, k) : i(h, k)
    }
    function g(h, k) {
        var l = new Image;
        l.onload = function() {
            a.facebox.reveal('<div class="image"><img src="' + l.src + '" /></div>', k)
        };
        l.src = h
    }
    function i(h, k) {
        a.get(h,
        function(l) {
            a.facebox.reveal(l, k)
        })
    }
    function j() {
        return a.facebox.settings.overlay == false || a.facebox.settings.opacity === null
    }
    function m() {
        if (!j()) {
            a("#facebox_overlay").length ==
            0 && a("body").append('<div id="facebox_overlay" class="facebox_hide"></div>');
            a("#facebox_overlay").hide().addClass("facebox_overlayBG").css("opacity", a.facebox.settings.opacity).click(function() {
                a(document).trigger("close.facebox")
            }).fadeIn(200);
            return false
        }
    }
    function n() {
        if (!j()) {
            a("#facebox_overlay").fadeOut(200,
            function() {
                a("#facebox_overlay").removeClass("facebox_overlayBG");
                a("#facebox_overlay").addClass("facebox_hide");
                a("#facebox_overlay").remove()
            });
            return false
        }
    }
    a(document).bind("close.facebox",
    function() {
        a(document).unbind("keydown.facebox");
        a("#facebox").fadeOut(function() {
            a("#facebox .content").removeClass().addClass("content");
            a("#facebox .loading").remove();
            a(document).trigger("afterClose.facebox")
        });
        n()
    })
})(jQuery); (function(a) {
    a.fn.ajaxSubmit = function(b) {
        if (typeof b == "function") b = {
            success: b
        };
        b = a.extend({
            url: this.attr("action") || window.location.toString(),
            type: this.attr("method") || "GET"
        },
        b || {});
        var d = {};
        a.event.trigger("form.pre.serialize", [this, b, d]);
        if (d.veto) return this;
        var f = this.formToArray(b.semantic);
        if (b.data) for (var g in b.data) f.push({
            name: g,
            value: b.data[g]
        });
        if (b.beforeSubmit && b.beforeSubmit(f, this, b) === false) return this;
        a.event.trigger("form.submit.validate", [f, this, b, d]);
        if (d.veto) return this;
        d =
        a.param(f);
        if (b.type.toUpperCase() == "GET") {
            b.url += (b.url.indexOf("?") >= 0 ? "&": "?") + d;
            b.data = null
        } else b.data = d;
        var i = this,
        j = [];
        b.resetForm && j.push(function() {
            i.resetForm()
        });
        b.clearForm && j.push(function() {
            i.clearForm()
        });
        if (!b.dataType && b.target) {
            var m = b.success ||
            function() {};
            j.push(function(h) {
                this.evalScripts ? a(b.target).attr("innerHTML", h).evalScripts().each(m, arguments) : a(b.target).html(h).each(m, arguments)
            })
        } else b.success && j.push(b.success);
        b.success = function(h, k) {
            for (var l = 0, s = j.length; l < s; l++) j[l](h,
            k, i)
        };
        d = a("input:file", this).fieldValue();
        f = false;
        for (g = 0; g < d.length; g++) if (d[g]) f = true;
        if (b.iframe || f) a.browser.safari && b.closeKeepAlive ? a.get(b.closeKeepAlive, n) : n();
        else a.ajax(b);
        a.event.trigger("form.submit.notify", [this, b]);
        return this;
        function n() {
            var h = i[0],
            k = a.extend({},
            a.ajaxSettings, b),
            l = "jqFormIO" + a.fn.ajaxSubmit.counter++,
            s = a('<iframe id="' + l + '" name="' + l + '" />'),
            p = s[0],
            y = a.browser.opera && window.opera.version() < 9;
            if (a.browser.msie || y) p.src = 'javascript:false;document.write("");';
            s.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            });
            var q = {
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {},
                getResponseHeader: function() {},
                setRequestHeader: function() {}
            },
            u = k.global;
            u && !a.active++&&a.event.trigger("ajaxStart");
            u && a.event.trigger("ajaxSend", [q, k]);
            var z = 0,
            w = 0;
            setTimeout(function() {
                var t = h.encoding ? "encoding": "enctype",
                o = i.attr("target"),
                r = i.attr("action");
                i.attr({
                    target: l,
                    method: "POST",
                    action: k.url
                });
                h[t] = "multipart/form-data";
                k.timeout && setTimeout(function() {
                    w =
                    true;
                    v()
                },
                k.timeout);
                s.appendTo("body");
                p.attachEvent ? p.attachEvent("onload", v) : p.addEventListener("load", v, false);
                h.submit();
                i.attr({
                    action: r,
                    target: o
                })
            },
            10);
            function v() {
                if (!z++) {
                    p.detachEvent ? p.detachEvent("onload", v) : p.removeEventListener("load", v, false);
                    var t = true;
                    try {
                        if (w) throw "timeout";
                        var o,
                        r;
                        r = p.contentWindow ? p.contentWindow.document: p.contentDocument ? p.contentDocument: p.document;
                        q.responseText = r.body ? r.body.innerHTML: null;
                        q.responseXML = r.XMLDocument ? r.XMLDocument: r;
                        if (k.dataType == "json" ||
                        k.dataType == "script") {
                            var x = r.getElementsByTagName("textarea")[0];
                            o = x ? x.value: q.responseText;
                            k.dataType == "json" ? eval("data = " + o) : a.globalEval(o)
                        } else if (k.dataType == "xml") {
                            o = q.responseXML;
                            if (!o && q.responseText != null) o = A(q.responseText)
                        } else o = q.responseText
                    } catch(B) {
                        t = false;
                        a.handleError(k, q, "error", B)
                    }
                    if (t) {
                        k.success(o, "success");
                        u && a.event.trigger("ajaxSuccess", [q, k])
                    }
                    u && a.event.trigger("ajaxComplete", [q, k]);
                    u && !--a.active && a.event.trigger("ajaxStop");
                    if (k.complete) k.complete(q, t ? "success": "error");
                    setTimeout(function() {
                        s.remove();
                        q.responseXML = null
                    },
                    100)
                }
            }
            function A(t, o) {
                if (window.ActiveXObject) {
                    o = new ActiveXObject("Microsoft.XMLDOM");
                    o.async = "false";
                    o.loadXML(t)
                } else o = (new DOMParser).parseFromString(t, "text/xml");
                return o && o.documentElement && o.documentElement.tagName != "parsererror" ? o: null
            }
        }
    };
    a.fn.ajaxSubmit.counter = 0;
    a.fn.ajaxForm = function(b) {
        return this.ajaxFormUnbind().submit(e).each(function() {
            this.formPluginId = a.fn.ajaxForm.counter++;
            a.fn.ajaxForm.optionHash[this.formPluginId] = b;
            a(":submit,input:image",
            this).click(c)
        })
    };
    a.fn.ajaxForm.counter = 1;
    a.fn.ajaxForm.optionHash = {};
    function c(b) {
        var d = this.form;
        d.clk = this;
        if (this.type == "image") if (b.offsetX != undefined) {
            d.clk_x = b.offsetX;
            d.clk_y = b.offsetY
        } else if (typeof a.fn.offset == "function") {
            var f = a(this).offset();
            d.clk_x = b.pageX - f.left;
            d.clk_y = b.pageY - f.top
        } else {
            d.clk_x = b.pageX - this.offsetLeft;
            d.clk_y = b.pageY - this.offsetTop
        }
        setTimeout(function() {
            d.clk = d.clk_x = d.clk_y = null
        },
        10)
    }
    function e() {
        var b = this.formPluginId;
        b = a.fn.ajaxForm.optionHash[b];
        a(this).ajaxSubmit(b);
        return false
    }
    a.fn.ajaxFormUnbind = function() {
        this.unbind("submit", e);
        return this.each(function() {
            a(":submit,input:image", this).unbind("click", c)
        })
    };
    a.fn.formToArray = function(b) {
        var d = [];
        if (this.length == 0) return d;
        var f = this[0],
        g = b ? f.getElementsByTagName("*") : f.elements;
        if (!g) return d;
        for (var i = 0, j = g.length; i < j; i++) {
            var m = g[i],
            n = m.name;
            if (n) if (b && f.clk && m.type == "image") ! m.disabled && f.clk == m && d.push({
                name: n + ".x",
                value: f.clk_x
            },
            {
                name: n + ".y",
                value: f.clk_y
            });
            else if ((m = a.fieldValue(m, true)) && m.constructor ==
            Array) for (var h = 0, k = m.length; h < k; h++) d.push({
                name: n,
                value: m[h]
            });
            else m !== null && typeof m != "undefined" && d.push({
                name: n,
                value: m
            })
        }
        if (!b && f.clk) {
            b = f.getElementsByTagName("input");
            i = 0;
            for (j = b.length; i < j; i++) {
                g = b[i]; (n = g.name) && !g.disabled && g.type == "image" && f.clk == g && d.push({
                    name: n + ".x",
                    value: f.clk_x
                },
                {
                    name: n + ".y",
                    value: f.clk_y
                })
            }
        }
        return d
    };
    a.fn.formSerialize = function(b) {
        return a.param(this.formToArray(b))
    };
    a.fn.fieldSerialize = function(b) {
        var d = [];
        this.each(function() {
            var f = this.name;
            if (f) {
                var g = a.fieldValue(this,
                b);
                if (g && g.constructor == Array) for (var i = 0, j = g.length; i < j; i++) d.push({
                    name: f,
                    value: g[i]
                });
                else g !== null && typeof g != "undefined" && d.push({
                    name: this.name,
                    value: g
                })
            }
        });
        return a.param(d)
    };
    a.fn.fieldValue = function(b) {
        for (var d = [], f = 0, g = this.length; f < g; f++) {
            var i = this[f];
            i = a.fieldValue(i, b);
            i === null || typeof i == "undefined" || i.constructor == Array && !i.length || (i.constructor == Array ? a.merge(d, i) : d.push(i))
        }
        return d
    };
    a.fieldValue = function(b, d) {
        var f = b.name,
        g = b.type,
        i = b.tagName.toLowerCase();
        if (typeof d == "undefined") d =
        true;
        if (d && (!f || b.disabled || g == "reset" || g == "button" || (g == "checkbox" || g == "radio") && !b.checked || (g == "submit" || g == "image") && b.form && b.form.clk != b || i == "select" && b.selectedIndex == -1)) return null;
        if (i == "select") {
            i = b.selectedIndex;
            if (i < 0) return null;
            d = [];
            b = b.options;
            f = (g = g == "select-one") ? i + 1: b.length;
            for (i = g ? i: 0; i < f; i++) {
                var j = b[i];
                if (j.selected) {
                    j = a.browser.msie && !j.attributes.value.specified ? j.text: j.value;
                    if (g) return j;
                    d.push(j)
                }
            }
            return d
        }
        return b.value
    };
    a.fn.clearForm = function() {
        return this.each(function() {
            a("input,select,textarea",
            this).clearFields()
        })
    };
    a.fn.clearFields = a.fn.clearInputs = function() {
        return this.each(function() {
            var b = this.type,
            d = this.tagName.toLowerCase();
            if (b == "text" || b == "password" || d == "textarea") this.value = "";
            else if (b == "checkbox" || b == "radio") this.checked = false;
            else if (d == "select") this.selectedIndex = -1
        })
    };
    a.fn.resetForm = function() {
        return this.each(function() {
            if (typeof this.reset == "function" || typeof this.reset == "object" && !this.reset.nodeType) this.reset()
        })
    };
    a.fn.enable = function(b) {
        if (b == undefined) b = true;
        return this.each(function() {
            this.disabled =
            !b
        })
    };
    a.fn.select = function(b) {
        if (b == undefined) b = true;
        return this.each(function() {
            var d = this.type;
            if (d == "checkbox" || d == "radio") this.checked = b;
            else if (this.tagName.toLowerCase() == "option") {
                d = a(this).parent("select");
                b && d[0] && d[0].type == "select-one" && d.find("option").select(false);
                this.selected = b
            }
        })
    }
})(jQuery); (function(a) {
    a.fn.editableComment = function(c) {
        a.extend({},
        a.fn.editableComment.defaults, c);
        function e() {
            try {
                window.document.createEvent("TouchEvent");
                return true
            } catch(b) {
                return false
            }
        }
        return this.each(function() {
            var b = a(this);
            if (!b.hasClass("editable-comment-form-attached")) {
                b.addClass("editable-comment-form-attached");
                var d = b.find(".formatted-content"),
                f = b.find(".content-title"),
                g = b.find(".infobar"),
                i = b.find(".form-content"),
                j = b.find(".context-loader"),
                m = i.find("form"),
                n = b.find(".error");
                if (! (i.length <=
                0)) {
                    var h = function() {
                        n.hide();
                        d.hide();
                        f.hide();
                        g.hide();
                        i.show();
                        i.find(".js-autosize").trigger("resize.dynSiz")
                    },
                    k = function() {
                        i.hide();
                        i.css("opacity", 1);
                        n.hide();
                        j.hide();
                        d.show();
                        f.show();
                        g.show()
                    };
                    if (e()) {
                        b.bind("touchstart", a.noop);
                        b.bind("touchend", a.noop)
                    }
                    b.find(".edit-button").click(function() {
                        h();
                        return false
                    });
                    b.find(".delete-button").click(function() {
                        if (confirm("Are you sure you want to delete this?")) {
                            j.show();
                            n.hide();
                            a.del(m.attr("action"), {
                                success: function() {
                                    j.hide();
                                    b.fadeOut()
                                },
                                error: function() {
                                    j.hide();
                                    n.show()
                                }
                            })
                        }
                        return false
                    });
                    b.find(".cancel").click(function() {
                        k();
                        return false
                    });
                    m.submit(function() {
                        i.css("opacity", 0.5);
                        j.show();
                        n.hide();
                        return false
                    });
                    m.ajaxForm({
                        type: "PUT",
                        dataType: "json",
                        success: function(l) {
                            l.title && b.find(".content-title").html(l.title);
                            d.find(".content-body").html(l.body);
                            k()
                        },
                        error: function() {
                            j.hide();
                            i.css("opacity", 1);
                            n.show()
                        }
                    })
                }
            }
        })
    };
    a.fn.editableComment.defaults = {}
})(jQuery); (function(a) {
    a.fn.previewableCommentForm = function(c) {
        var e = a.extend({},
        a.fn.previewableCommentForm.defaults, c);
        return this.each(function() {
            var b = a(this);
            if (!b.hasClass("previewable-comment-form-attached")) {
                b.addClass("previewable-comment-form-attached");
                var d = b.find("textarea"),
                f = b.find(".content-body"),
                g = b.prev(".comment-form-error"),
                i = b.find(".form-actions button"),
                j = d.val(),
                m = b.attr("data-repository"),
                n = false,
                h = null,
                k = a.merge(b.find(".preview-dirty"), d);
                k.blur(function() {
                    if (j != d.val()) {
                        n = true;
                        j = d.val()
                    }
                    l()
                });
                var l = function() {
                    if (n) if (a.trim(j) == "") f.html("<p>Nothing to preview</p>");
                    else {
                        f.html("<p>Loading preview&hellip;</p>");
                        h && h.abort();
                        var s = a.extend({
                            text: j,
                            repository: m
                        },
                        e.previewOptions);
                        h = a.post(e.previewUrl, s,
                        function(p) {
                            f.html(p);
                            e.onSuccess.call(f)
                        })
                    }
                };
                a.trim(j) == "" && f.html("<p>Nothing to preview</p>");
                g.length > 0 && b.closest("form").submit(function() {
                    g.hide();
                    if (a.trim(d.val()) == "") {
                        g.show();
                        return false
                    }
                    i.attr("disabled", "disabled")
                })
            }
        })
    };
    a.fn.previewableCommentForm.defaults =
    {
        previewUrl: "/preview",
        previewOptions: {},
        onSuccess: function() {}
    }
})(jQuery); (function(a) {
    function c(d) {
        return a.hotkeys.special[d] == null ? d.charCodeAt(0) : a.hotkeys.special[d]
    }
    a.hotkeys = function(d) {
        for (key in d) a.hotkey(key, d[key]);
        return this
    };
    a.hotkey = function(d, f) {
        a.hotkeys.cache[c(d)] = f;
        return this
    };
    function e(d, f) {
        if (! (d.ctrlKey || d.altKey || d.metaKey)) {
            var g = d.shiftKey ? d.keyCode: d.keyCode + 32;
            if (f = f[g]) if (a.isFunction(f)) {
                d = f.call(this, d);
                return this == document ? false: d
            } else {
                window.location = f;
                return false
            }
        }
    }
    a.fn.hotkeys = function(d) {
        var f = {};
        for (key in d) f[c(key)] = d[key];
        return this.bind("keydown.hotkey",
        function(g) {
            return e.call(this, g, f)
        })
    };
    a.hotkeys.cache = {};
    a.hotkeys.special = {
        enter: 45,
        esc: 59,
        "?": 191,
        "/": 223,
        "\\": 252,
        "`": 224,
        up: 70,
        down: 72
    };
    if (a.browser.mozilla) a.hotkeys.special["?"] = 0;
    a(document).bind("keydown.hotkey",
    function(d) {
        if (!a(d.target).is(":input")) return e.call(this, d, a.hotkeys.cache)
    });
    a(function() {
        a("a[hotkey]").each(function() {
            a.hotkey(a(this).attr("hotkey"), a(this).attr("href"))
        })
    });
    var b;
    a("#facebox").live("focus",
    function(d) {
        b = d.target
    }).live("blur",
    function() {
        b = null
    });
    a(document).bind("close.facebox",
    function() {
        if (b) try {
            b.blur()
        } catch(d) {}
    })
})(jQuery); (function(a) {
    a.keys = {
        escape: 27,
        tab: 9,
        space: 32,
        enter: 13,
        backspace: 8,
        scroll: 145,
        capslock: 20,
        numlock: 144,
        pause: 19,
        insert: 45,
        home: 36,
        del: 46,
        end: 35,
        pageup: 33,
        pagedown: 34,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        "-": 109,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
        "/": 191
    }
})(jQuery); (function(a) {
    a.fn.relatizeDate = function() {
        return a(this).each(function() {
            a(this).hasClass("relatized") || a(this).text(a.relatizeDate(this)).addClass("relatized")
        })
    };
    a.relatizeDate = function(c) {
        c = a(c).text();
        var e = new Date(c);
        if (isNaN(e)) {
            e = /(\d\d:\d\d:\d\d [+-]\d{4}) (\d{4})$/;
            e = new Date(c.replace(e, "$2 $1"));
            if (isNaN(e)) return c
        }
        return a.relatizeDate.timeAgoInWords(e)
    };
    $r = a.relatizeDate;
    a.extend(a.relatizeDate, {
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        days: ["Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        strftime: function(c, e) {
            var b = c.getDay(),
            d = c.getMonth(),
            f = c.getHours(),
            g = c.getMinutes();
            function i(j) {
                j = j.toString(10);
                return (new Array(2 - j.length + 1)).join("0") + j
            }
            return e.replace(/\%([aAbBcdHImMpSwyY])/g,
            function(j) {
                switch (j.substr(1, 1)) {
                case "a":
                    return $r.shortDays[b];
                case "A":
                    return $r.days[b];
                case "b":
                    return $r.shortMonths[d];
                case "B":
                    return $r.months[d];
                case "c":
                    return c.toString();
                case "d":
                    return i(c.getDate());
                case "H":
                    return i(f);
                case "I":
                    return i((f + 12) % 12);
                case "m":
                    return i(d + 1);
                case "M":
                    return i(g);
                case "p":
                    return f > 12 ? "PM": "AM";
                case "S":
                    return i(c.getSeconds());
                case "w":
                    return b;
                case "y":
                    return i(c.getFullYear() % 100);
                case "Y":
                    return c.getFullYear().toString()
                }
            })
        },
        timeAgoInWords: function(c, e) {
            return $r.distanceOfTimeInWords(c, new Date, e)
        },
        distanceOfTimeInWords: function(c,
        e, b) {
            e = parseInt((e.getTime() - c.getTime()) / 1000);
            if (e < 60) return "just now";
            else if (e < 120) return "about a minute ago";
            else if (e < 2700) return parseInt(e / 60).toString() + " minutes ago";
            else if (e < 7200) return "about an hour ago";
            else if (e < 86400) return "about " + parseInt(e / 3600).toString() + " hours ago";
            else if (e < 172800) return "1 day ago";
            else {
                e = parseInt(e / 86400).toString();
                if (e > 5) {
                    e = "%B %d, %Y";
                    if (b) e += " %I:%M %p";
                    return $r.strftime(c, e)
                } else return e + " days ago"
            }
        }
    })
})(jQuery); (function(a) {
    a.put = function(c, e, b, d) {
        var f = null;
        if (jQuery.isFunction(e)) {
            b = e;
            e = {}
        }
        if (jQuery.isPlainObject(b)) {
            f = b.error;
            b = b.success
        }
        return jQuery.ajax({
            type: "PUT",
            url: c,
            data: e,
            success: b,
            error: f,
            dataType: d
        })
    };
    a.del = function(c, e, b, d) {
        var f = null;
        if (jQuery.isFunction(e)) {
            b = e;
            e = {}
        }
        if (jQuery.isPlainObject(b)) {
            f = b.error;
            b = b.success
        }
        return jQuery.ajax({
            type: "DELETE",
            url: c,
            data: e,
            success: b,
            error: f,
            dataType: d
        })
    }
})(jQuery);
jQuery.fn.tabs = function() {
    function a(e) {
        return /#([a-z][\w.:-]*)$/i.exec(e)[1]
    }
    var c = window.location.hash.substr(1);
    return this.each(function() {
        var e = null,
        b = null;
        $(this).find("li a").each(function() {
            var d = $("#" + a(this.href));
            if (d != []) {
                d.hide();
                $(this).click(function() {
                    var f = $(this);
                    function g() {
                        b && b.hide();
                        e && e.removeClass("selected");
                        e = f.addClass("selected");
                        b = d.show().trigger("tabChanged", {
                            link: e
                        })
                    }
                    if (f.attr("ajax")) {
                        f.addClass("loading");
                        $.ajax({
                            url: f.attr("ajax"),
                            success: function(i) {
                                d.html(i);
                                f.removeClass("loading");
                                f[0].removeAttribute("ajax");
                                g()
                            },
                            failure: function() {
                                alert("An error occured, please reload the page")
                            }
                        })
                    } else g();
                    return false
                });
                $(this).hasClass("selected") && $(this).click()
            }
        });
        $(this).find("li a[href='#" + c + "']").click();
        b == null && $($(this).find("li a")[0]).click()
    })
};
$(function() {
    var a = false,
    c = false,
    e = false;
    function b() {
        if (!e) if (a && c) {
            e = true;
            $(document.body).addClass("usingMouse")
        }
    }
    $(document).mousemove(function() {
        a = true;
        b()
    });
    $(document).mousedown(function() {
        c = true;
        b()
    });
    $("button.classy, a.button.classy").mousedown(function() {
        $(this).addClass("mousedown")
    }).bind("mouseup mouseleave",
    function() {
        $(this).removeClass("mousedown")
    })
});
$.extend($.facebox.settings, {
    loadingImage: (GitHub.assetHost || "") + "/images/modules/facebox/loading.gif",
    closeImage: (GitHub.assetHost || "") + "/images/modules/facebox/closelabel.png"
});
Date._isoRegexp = /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;
Date.parseISO8601 = function(a) {
    a += "";
    if (typeof a != "string" || a.length === 0) return null;
    a = a.match(Date._isoRegexp);
    if (typeof a == "undefined" || a === null) return null;
    var c,
    e,
    b,
    d,
    f,
    g,
    i;
    c = parseInt(a[1], 10);
    if (typeof a[2] == "undefined" || a[2] === "") return new Date(c);
    e = parseInt(a[2], 10) - 1;
    b = parseInt(a[3], 10);
    if (typeof a[4] == "undefined" || a[4] === "") return new Date(c, e, b);
    d = parseInt(a[4], 10);
    f = parseInt(a[5], 10);
    g = typeof a[6] != "undefined" && a[6] !== "" ? parseInt(a[6], 10) : 0;
    i = typeof a[7] != "undefined" && a[7] !== "" ? Math.round(1000 *
    parseFloat("0." + a[7])) : 0;
    if ((typeof a[8] == "undefined" || a[8] === "") && (typeof a[9] == "undefined" || a[9] === "")) return new Date(c, e, b, d, f, g, i);
    var j;
    if (typeof a[9] != "undefined" && a[9] !== "") {
        j = parseInt(a[10], 10) * 3600000;
        if (typeof a[11] != "undefined" && a[11] !== "") j += parseInt(a[11], 10) * 60000;
        if (a[9] == "-") j = -j
    } else j = 0;
    return new Date(Date.UTC(c, e, b, d, f, g, i) - j)
};
$(function() {
    var a = $(".github-jobs-promotion");
    if (a.get(0) != null) {
        a.css({
            visibility: "hidden"
        });
        window.jobsWidgetCallback = function(c) {
            var e = Math.floor(Math.random() * c.jobs.length);
            c = c.jobs[e];
            a.find(".job-link").attr("href", c.url);
            a.find(".job-company").text(c.company);
            a.find(".job-position").text(c.position);
            a.find(".job-location").text(c.location);
            a.css({
                visibility: "visible"
            })
        };
        $.getScript(a.attr("url"))
    }
});
$(function() {
    var a = $.cookie("tracker"),
    c = null;
    if (a == null) c = document.referrer ? document.referrer: "direct";
    a = getParams();
    if (a.utm_campaign && $.trim(a.utm_campaign) != "") c = a.utm_campaign;
    if (a.referral_code && $.trim(a.referral_code) != "") c = a.referral_code;
    c != null && $.cookie("tracker", c, {
        expires: 7,
        path: "/"
    })
});
function getParams(a, c) {
    if (arguments.length < 2) c = location.href;
    if (arguments.length > 0 && a != "") {
        var e = a == "#" ? /[#]([^$]*)/: a == "?" ? /[?]([^#$]*)/: new RegExp("[?&]" + a + "=([^&#]*)"),
        b = e.exec(c);
        return b == null ? "": b[1]
    } else {
        c = c.split("?");
        b = {};
        if (c.length > 1) {
            c = c[1].split("#");
            if (c.length > 1) b.hash = c[1];
            $.each(c[0].split("&"),
            function(d, f) {
                f = f.split("=");
                b[f[0]] = f[1]
            })
        }
        return b
    }
};
