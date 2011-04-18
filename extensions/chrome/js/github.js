if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.getImageData) {
    var defaultOffsets = {
        destX: 0,
        destY: 0,
        sourceX: 0,
        sourceY: 0,
        width: "auto",
        height: "auto"
    };
    CanvasRenderingContext2D.prototype.blendOnto = function(a, d, b) {
        var c = {};
        for (var e in defaultOffsets) if (defaultOffsets.hasOwnProperty(e)) c[e] = b && b[e] || defaultOffsets[e];
        if (c.width == "auto") c.width = this.canvas.width;
        if (c.height == "auto") c.height = this.canvas.height;
        c.width = Math.min(c.width, this.canvas.width - c.sourceX, a.canvas.width - c.destX);
        c.height = Math.min(c.height, this.canvas.height - c.sourceY, a.canvas.height - c.destY);
        e = this.getImageData(c.sourceX, c.sourceY, c.width, c.height);
        b = a.getImageData(c.destX, c.destY, c.width, c.height);
        e = e.data;
        for (var f = b.data, g, h, j = f.length, l, k, m, n, q, s, w, t, o = 0; o < j; o += 4) {
            g = e[o + 3] / 255;
            h = f[o + 3] / 255;
            w = g + h - g * h;
            f[o + 3] = w * 255;
            l = e[o] / 255 * g;
            n = f[o] / 255 * h;
            k = e[o + 1] / 255 * g;
            q = f[o + 1] / 255 * h;
            m = e[o + 2] / 255 * g;
            s = f[o + 2] / 255 * h;
            t = 255 / w;
            switch (d) {
            case "normal":
            case "src-over":
                f[o] = (l + n - n * g) * t;
                f[o + 1] = (k + q - q * g) * t;
                f[o + 2] = (m + s - s * g) * t;
                break;
            case "screen":
                f[o] = (l + n - l * n) * t;
                f[o + 1] = (k + q - k * q) * t;
                f[o + 2] = (m + s - m * s) * t;
                break;
            case "multiply":
                f[o] = (l * n + l * (1 - h) + n * (1 - g)) * t;
                f[o + 1] = (k * q + k * (1 - h) + q * (1 - g)) * t;
                f[o + 2] = (m * s + m * (1 - h) + s * (1 - g)) * t;
                break;
            case "difference":
                f[o] = (l + n - 2 * Math.min(l * h, n * g)) * t;
                f[o + 1] = (k + q - 2 * Math.min(k * h, q * g)) * t;
                f[o + 2] = (m + s - 2 * Math.min(m * h, s * g)) * t;
                break;
            case "src-in":
                w = g * h;
                t = 255 / w;
                f[o + 3] = w * 255;
                f[o] = l * h * t;
                f[o + 1] = k * h * t;
                f[o + 2] = m * h * t;
                break;
            case "plus":
            case "add":
                w = Math.min(1, g + h);
                f[o + 3] = w * 255;
                t = 255 / w;
                f[o] = Math.min(l + n, 1) * t;
                f[o + 1] = Math.min(k +
                q, 1) * t;
                f[o + 2] = Math.min(m + s, 1) * t;
                break;
            case "overlay":
                f[o] = n <= 0.5 ? 2 * e[o] * n / h: 255 - (2 - 2 * n / h) * (255 - e[o]);
                f[o + 1] = q <= 0.5 ? 2 * e[o + 1] * q / h: 255 - (2 - 2 * q / h) * (255 - e[o + 1]);
                f[o + 2] = s <= 0.5 ? 2 * e[o + 2] * s / h: 255 - (2 - 2 * s / h) * (255 - e[o + 2]);
                break;
            case "hardlight":
                f[o] = l <= 0.5 ? 2 * f[o] * l / h: 255 - (2 - 2 * l / g) * (255 - f[o]);
                f[o + 1] = k <= 0.5 ? 2 * f[o + 1] * k / h: 255 - (2 - 2 * k / g) * (255 - f[o + 1]);
                f[o + 2] = m <= 0.5 ? 2 * f[o + 2] * m / h: 255 - (2 - 2 * m / g) * (255 - f[o + 2]);
                break;
            case "colordodge":
            case "dodge":
                f[o] = e[o] == 255 && n == 0 ? 255: Math.min(255, f[o] / (255 - e[o])) * t;
                f[o + 1] = e[o + 1] == 255 &&
                q == 0 ? 255: Math.min(255, f[o + 1] / (255 - e[o + 1])) * t;
                f[o + 2] = e[o + 2] == 255 && s == 0 ? 255: Math.min(255, f[o + 2] / (255 - e[o + 2])) * t;
                break;
            case "colorburn":
            case "burn":
                f[o] = e[o] == 0 && n == 0 ? 0: (1 - Math.min(1, (1 - n) / l)) * t;
                f[o + 1] = e[o + 1] == 0 && q == 0 ? 0: (1 - Math.min(1, (1 - q) / k)) * t;
                f[o + 2] = e[o + 2] == 0 && s == 0 ? 0: (1 - Math.min(1, (1 - s) / m)) * t;
                break;
            case "darken":
            case "darker":
                f[o] = (l > n ? n: l) * t;
                f[o + 1] = (k > q ? q: k) * t;
                f[o + 2] = (m > s ? s: m) * t;
                break;
            case "lighten":
            case "lighter":
                f[o] = (l < n ? n: l) * t;
                f[o + 1] = (k < q ? q: k) * t;
                f[o + 2] = (m < s ? s: m) * t;
                break;
            case "exclusion":
                f[o] =
                (n + l - 2 * n * l) * t;
                f[o + 1] = (q + k - 2 * q * k) * t;
                f[o + 2] = (s + m - 2 * s * m) * t;
                break;
            default:
                f[o] = f[o + 3] = 255;
                f[o + 1] = o % 8 == 0 ? 255: 0;
                f[o + 2] = o % 8 == 0 ? 0: 255
            }
        }
        a.putImageData(b, c.destX, c.destY)
    };
    for (var modes = CanvasRenderingContext2D.prototype.blendOnto.supportedBlendModes = "normal src-over screen multiply difference src-in plus add overlay hardlight colordodge dodge colorburn burn darken lighten exclusion".split(" "), supports = CanvasRenderingContext2D.prototype.blendOnto.supports = {},
    i = 0, len = modes.length; i < len; ++i) supports[modes[i]] =
    true
}; (function(a) {
    a.fn.autoResize = function(d) {
        var b = a.extend({
            onResize: function() {},
            animate: true,
            animateDuration: 150,
            animateCallback: function() {},
            extraSpace: 20,
            limit: 1000
        },
        d);
        this.filter("textarea").each(function() {
            var c = a(this),
            e = 0,
            f = function() {
                var j = ["height", "width", "lineHeight", "textDecoration", "letterSpacing"],
                l = {};
                a.each(j,
                function(k, m) {
                    l[m] = c.css(m)
                });
                return c.clone().removeAttr("id").removeAttr("name").css({
                    position: "absolute",
                    top: 0,
                    left: -9999
                }).css(l).attr("tabIndex", "-1").insertBefore(c)
            } (),
            g = null;
            function h() {
                f.height(0).val(a(this).val()).scrollTop(10000);
                if (e == 0) e = c.height();
                var j = Math.max(f.scrollTop() + b.extraSpace, e),
                l = a(this).add(f);
                if (g !== j) {
                    g = j;
                    if (j >= b.limit) a(this).css("overflow-y", "");
                    else {
                        b.onResize.call(this);
                        b.animate && c.css("display") === "block" ? l.stop().animate({
                            height: j
                        },
                        b.animateDuration, b.animateCallback) : l.height(j)
                    }
                }
            }
            c.unbind(".dynSiz").bind("resize.dynSiz", h)
        });
        return this
    }
})(jQuery); (function(a) {
    a.fn.extend({
        autocomplete: function(d, b) {
            var c = typeof d == "string";
            b = a.extend({},
            a.Autocompleter.defaults, {
                url: c ? d: null,
                data: c ? null: d,
                delay: c ? a.Autocompleter.defaults.delay: 10,
                max: b && !b.scroll ? 10: 150
            },
            b);
            b.highlight = b.highlight ||
            function(e) {
                return e
            };
            b.formatMatch = b.formatMatch || b.formatItem;
            return this.each(function() {
                new a.Autocompleter(this, b)
            })
        },
        result: function(d) {
            return this.bind("result", d)
        },
        search: function(d) {
            return this.trigger("search", [d])
        },
        flushCache: function() {
            return this.trigger("flushCache")
        },
        setOptions: function(d) {
            return this.trigger("setOptions", [d])
        },
        unautocomplete: function() {
            return this.trigger("unautocomplete")
        }
    });
    a.Autocompleter = function(d, b) {
        var c = {
            UP: 38,
            DOWN: 40,
            DEL: 46,
            TAB: 9,
            RETURN: 13,
            ESC: 27,
            COMMA: 188,
            PAGEUP: 33,
            PAGEDOWN: 34,
            BACKSPACE: 8
        },
        e = a(d).attr("autocomplete", "off").addClass(b.inputClass),
        f,
        g = "",
        h = a.Autocompleter.Cache(b),
        j = 0,
        l,
        k = {
            mouseDownOnSelect: false
        },
        m = a.Autocompleter.Select(b, d, q, k),
        n;
        a.browser.opera && a(d.form).bind("submit.autocomplete",
        function() {
            if (n) return n = false
        });
        e.bind((a.browser.opera ? "keypress": "keydown") + ".autocomplete",
        function(u) {
            j = 1;
            l = u.keyCode;
            switch (u.keyCode) {
            case c.UP:
                u.preventDefault();
                m.visible() ? m.prev() : s(0, true);
                break;
            case c.DOWN:
                u.preventDefault();
                m.visible() ? m.next() : s(0, true);
                break;
            case c.PAGEUP:
                u.preventDefault();
                m.visible() ? m.pageUp() : s(0, true);
                break;
            case c.PAGEDOWN:
                u.preventDefault();
                m.visible() ? m.pageDown() : s(0, true);
                break;
            case b.multiple && a.trim(b.multipleSeparator) == "," && c.COMMA: case c.TAB:
            case c.RETURN:
                if (q()) {
                    u.preventDefault();
                    n = true;
                    return false
                }
                break;
            case c.ESC:
                m.hide();
                break;
            default:
                clearTimeout(f);
                f = setTimeout(s, b.delay);
                break
            }
        }).focus(function() {
            j++
        }).blur(function() {
            j = 0;
            k.mouseDownOnSelect || v()
        }).click(function() {
            j++>1 && !m.visible() && s(0, true)
        }).bind("search",
        function() {
            var u = arguments.length > 1 ? arguments[1] : null;
            function x(G, A) {
                var D;
                if (A && A.length) for (var B = 0; B < A.length; B++) if (A[B].result.toLowerCase() == G.toLowerCase()) {
                    D = A[B];
                    break
                }
                typeof u == "function" ? u(D) : e.trigger("result", D && [D.data, D.value])
            }
            a.each(w(e.val()),
            function(G, A) {
                y(A, x, x)
            })
        }).bind("flushCache",
        function() {
            h.flush()
        }).bind("setOptions",
        function(u, x) {
            a.extend(b, x);
            "data" in x && h.populate()
        }).bind("unautocomplete",
        function() {
            m.unbind();
            e.unbind();
            a(d.form).unbind(".autocomplete")
        });
        function q() {
            var u = m.selected();
            if (!u) return false;
            var x = u.result;
            g = x;
            if (b.multiple) {
                var G = w(e.val());
                if (G.length > 1) {
                    var A = b.multipleSeparator.length,
                    D = a(d).selection().start,
                    B,
                    E = 0;
                    a.each(G,
                    function(F, H) {
                        E += H.length;
                        if (D <= E) {
                            B = F;
                            return false
                        }
                        E += A
                    });
                    G[B] = x;
                    x = G.join(b.multipleSeparator)
                }
                x +=
                b.multipleSeparator
            }
            e.val(x);
            C();
            e.trigger("result", [u.data, u.value]);
            return true
        }
        function s(u, x) {
            if (l == c.DEL) m.hide();
            else {
                u = e.val();
                if (! (!x && u == g)) {
                    g = u;
                    u = t(u);
                    if (u.length >= b.minChars) {
                        e.addClass(b.loadingClass);
                        b.matchCase || (u = u.toLowerCase());
                        y(u, J, C)
                    } else {
                        K();
                        m.hide()
                    }
                }
            }
        }
        function w(u) {
            if (!u) return [""];
            if (!b.multiple) return [a.trim(u)];
            return a.map(u.split(b.multipleSeparator),
            function(x) {
                return a.trim(u).length ? a.trim(x) : null
            })
        }
        function t(u) {
            if (!b.multiple) return u;
            var x = w(u);
            if (x.length == 1) return x[0];
            x = a(d).selection().start;
            x = x == u.length ? w(u) : w(u.replace(u.substring(x), ""));
            return x[x.length - 1]
        }
        function o(u, x) {
            if (b.autoFill && t(e.val()).toLowerCase() == u.toLowerCase() && l != c.BACKSPACE) {
                e.val(e.val() + x.substring(t(g).length));
                a(d).selection(g.length, g.length + x.length)
            }
        }
        function p(u, x) {
            if (b.autoResult && x.length) {
                u = x[0];
                var G = u.result;
                if (t(e.val()).toLowerCase() == G.toLowerCase()) {
                    e.trigger("result", [u.data, u.value]);
                    x.length == 1 && v()
                }
            }
        }
        var r = false;
        function v() {
            clearTimeout(f);
            f = setTimeout(C, 200);
            r =
            true
        }
        function C() {
            m.visible();
            m.hide();
            clearTimeout(f);
            K();
            b.mustMatch && e.search(function(u) {
                if (!u) if (b.multiple) {
                    u = w(e.val()).slice(0, -1);
                    e.val(u.join(b.multipleSeparator) + (u.length ? b.multipleSeparator: ""))
                } else {
                    e.val("");
                    e.trigger("result", null)
                }
            })
        }
        function J(u, x) {
            if (x && x.length && j) {
                K();
                r = false;
                m.display(x, u);
                o(u, x[0].value);
                p(u, x);
                r || m.show()
            } else C()
        }
        function y(u, x, G) {
            b.matchCase || (u = u.toLowerCase());
            var A = h.load(u);
            if (A && A.length) x(u, A);
            else if (typeof b.url == "string" && b.url.length > 0) {
                var D = {
                    timestamp: +new Date
                };
                a.each(b.extraParams,
                function(B, E) {
                    D[B] = typeof E == "function" ? E() : E
                });
                a.ajax({
                    mode: "abort",
                    port: "autocomplete" + d.name,
                    dataType: b.dataType,
                    url: b.url,
                    data: a.extend({
                        q: t(u),
                        limit: b.max
                    },
                    D),
                    success: function(B) {
                        B = b.parse && b.parse(B) || z(B);
                        h.add(u, B);
                        x(u, B)
                    }
                })
            } else {
                m.emptyList();
                G(u)
            }
        }
        function z(u) {
            var x = [];
            u = u.split("\n");
            for (var G = 0; G < u.length; G++) {
                var A = a.trim(u[G]);
                if (A) {
                    A = A.split("|");
                    x[x.length] = {
                        data: A,
                        value: A[0],
                        result: b.formatResult && b.formatResult(A, A[0]) || A[0]
                    }
                }
            }
            return x
        }
        function K() {
            e.removeClass(b.loadingClass)
        }
    };
    a.Autocompleter.defaults = {
        inputClass: "ac_input",
        resultsClass: "ac_results",
        loadingClass: "ac_loading",
        minChars: 1,
        delay: 400,
        matchCase: false,
        matchSubset: true,
        matchContains: false,
        cacheLength: 10,
        max: 100,
        mustMatch: false,
        extraParams: {},
        selectFirst: true,
        formatItem: function(d) {
            return d[0]
        },
        formatMatch: null,
        autoFill: false,
        autoResult: true,
        width: 0,
        multiple: false,
        multipleSeparator: ", ",
        highlight: function(d, b) {
            return d.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + b.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,
            "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>")
        },
        scroll: true,
        scrollHeight: 180
    };
    a.Autocompleter.Cache = function(d) {
        var b = {},
        c = 0;
        function e(j, l) {
            d.matchCase || (j = j.toLowerCase());
            var k = j.indexOf(l);
            if (d.matchContains == "word") k = j.toLowerCase().search("\\b" + l.toLowerCase());
            if (k == -1) return false;
            return k == 0 || d.matchContains
        }
        function f(j, l) {
            c > d.cacheLength && h();
            b[j] || c++;
            b[j] = l
        }
        function g() {
            if (!d.data) return false;
            var j = {},
            l = 0;
            if (!d.url) d.cacheLength = 1;
            j[""] = [];
            for (var k = 0, m = d.data.length; k <
            m; k++) {
                var n = d.data[k];
                n = typeof n == "string" ? [n] : n;
                var q = d.formatMatch(n, k + 1, d.data.length);
                if (q !== false) {
                    var s = q.charAt(0).toLowerCase();
                    j[s] || (j[s] = []);
                    n = {
                        value: q,
                        data: n,
                        result: d.formatResult && d.formatResult(n) || q
                    };
                    j[s].push(n);
                    l++<d.max && j[""].push(n)
                }
            }
            a.each(j,
            function(w, t) {
                d.cacheLength++;
                f(w, t)
            })
        }
        setTimeout(g, 25);
        function h() {
            b = {};
            c = 0
        }
        return {
            flush: h,
            add: f,
            populate: g,
            load: function(j) {
                if (!d.cacheLength || !c) return null;
                if (!d.url && d.matchContains) {
                    var l = [];
                    for (var k in b) if (k.length > 0) {
                        var m = b[k];
                        a.each(m,
                        function(n, q) {
                            e(q.value, j) && l.push(q)
                        })
                    }
                    return l
                } else if (b[j]) return b[j];
                else if (d.matchSubset) for (k = j.length - 1; k >= d.minChars; k--) if (m = b[j.substr(0, k)]) {
                    l = [];
                    a.each(m,
                    function(n, q) {
                        if (e(q.value, j)) l[l.length] = q
                    });
                    return l
                }
                return null
            }
        }
    };
    a.Autocompleter.Select = function(d, b, c, e) {
        var f = {
            ACTIVE: "ac_over"
        },
        g,
        h = -1,
        j,
        l = "",
        k = true,
        m,
        n;
        function q() {
            if (k) {
                m = a("<div/>").hide().addClass(d.resultsClass).css("position", "absolute").appendTo(document.body);
                n = a("<ul/>").appendTo(m).mouseover(function(r) {
                    if (s(r).nodeName &&
                    s(r).nodeName.toUpperCase() == "LI") {
                        h = a("li", n).removeClass(f.ACTIVE).index(s(r));
                        a(s(r)).addClass(f.ACTIVE)
                    }
                }).click(function(r) {
                    a(s(r)).addClass(f.ACTIVE);
                    c();
                    b.focus();
                    return false
                }).mousedown(function() {
                    e.mouseDownOnSelect = true
                }).mouseup(function() {
                    e.mouseDownOnSelect = false
                });
                d.width > 0 && m.css("width", d.width);
                k = false
            }
        }
        function s(r) {
            for (r = r.target; r && r.tagName != "LI";) r = r.parentNode;
            if (!r) return [];
            return r
        }
        function w(r) {
            g.slice(h, h + 1).removeClass(f.ACTIVE);
            t(r);
            r = g.slice(h, h + 1).addClass(f.ACTIVE);
            if (d.scroll) {
                var v = 0;
                g.slice(0, h).each(function() {
                    v += this.offsetHeight
                });
                if (v + r[0].offsetHeight - n.scrollTop() > n[0].clientHeight) n.scrollTop(v + r[0].offsetHeight - n.innerHeight());
                else v < n.scrollTop() && n.scrollTop(v)
            }
        }
        function t(r) {
            h += r;
            if (h < 0) h = g.size() - 1;
            else if (h >= g.size()) h = 0
        }
        function o(r) {
            return d.max && d.max < r ? d.max: r
        }
        function p() {
            n.empty();
            for (var r = o(j.length), v = 0; v < r; v++) if (j[v]) {
                var C = d.formatItem(j[v].data, v + 1, r, j[v].value, l);
                if (C !== false) {
                    C = a("<li/>").html(d.highlight(C, l)).addClass(v % 2 ==
                    0 ? "ac_even": "ac_odd").appendTo(n)[0];
                    a.data(C, "ac_data", j[v])
                }
            }
            g = n.find("li");
            if (d.selectFirst) {
                g.slice(0, 1).addClass(f.ACTIVE);
                h = 0
            }
            a.fn.bgiframe && n.bgiframe()
        }
        return {
            display: function(r, v) {
                q();
                j = r;
                l = v;
                p()
            },
            next: function() {
                w(1)
            },
            prev: function() {
                w( - 1)
            },
            pageUp: function() {
                h != 0 && h - 8 < 0 ? w( - h) : w( - 8)
            },
            pageDown: function() {
                h != g.size() - 1 && h + 8 > g.size() ? w(g.size() - 1 - h) : w(8)
            },
            hide: function() {
                m && m.hide();
                g && g.removeClass(f.ACTIVE);
                h = -1
            },
            visible: function() {
                return m && m.is(":visible")
            },
            current: function() {
                return this.visible() &&
                (g.filter("." + f.ACTIVE)[0] || d.selectFirst && g[0])
            },
            show: function() {
                var r = a(b).offset();
                m.css({
                    width: typeof d.width == "string" || d.width > 0 ? d.width: a(b).width(),
                    top: r.top + b.offsetHeight,
                    left: r.left
                }).show();
                if (d.scroll) {
                    n.scrollTop(0);
                    n.css({
                        maxHeight: d.scrollHeight,
                        overflow: "auto"
                    });
                    if (a.browser.msie && typeof document.body.style.maxHeight === "undefined") {
                        var v = 0;
                        g.each(function() {
                            v += this.offsetHeight
                        });
                        r = v > d.scrollHeight;
                        n.css("height", r ? d.scrollHeight: v);
                        r || g.width(n.width() - parseInt(g.css("padding-left")) -
                        parseInt(g.css("padding-right")))
                    }
                }
            },
            selected: function() {
                var r = g && g.filter("." + f.ACTIVE).removeClass(f.ACTIVE);
                return r && r.length && a.data(r[0], "ac_data")
            },
            emptyList: function() {
                n && n.empty()
            },
            unbind: function() {
                m && m.remove()
            }
        }
    };
    a.fn.selection = function(d, b) {
        if (d !== undefined) return this.each(function() {
            if (this.createTextRange) {
                var j = this.createTextRange();
                if (b === undefined || d == b) j.move("character", d);
                else {
                    j.collapse(true);
                    j.moveStart("character", d);
                    j.moveEnd("character", b)
                }
                j.select()
            } else if (this.setSelectionRange) this.setSelectionRange(d,
            b);
            else if (this.selectionStart) {
                this.selectionStart = d;
                this.selectionEnd = b
            }
        });
        var c = this[0];
        if (c.createTextRange) {
            var e = document.selection.createRange(),
            f = c.value,
            g = "<->",
            h = e.text.length;
            e.text = g;
            e = c.value.indexOf(g);
            c.value = f;
            this.selection(e, e + h);
            return {
                start: e,
                end: e + h
            }
        } else if (c.selectionStart !== undefined) return {
            start: c.selectionStart,
            end: c.selectionEnd
        }
    }
})(jQuery); (function(a) {
    a.fn.autocompleteField = function(d) {
        var b = a.extend({
            searchVar: "q",
            url: null,
            delay: 250,
            useCache: false,
            extraParams: {},
            autoClearResults: true,
            dataType: "html",
            minLength: 1
        },
        d);
        return a(this).each(function() {
            var c = a(this),
            e,
            f,
            g,
            h = {};
            function j(k) {
                e && e.readyState < 4 && e.abort();
                if (b.useCache && h[k]) c.trigger("autocomplete.finish", h[k]);
                else {
                    var m = {};
                    m[b.searchVar] = k;
                    m = a.extend(true, b.extraParams, m);
                    c.trigger("autocomplete.beforesend");
                    e = a.get(b.url, m,
                    function(n) {
                        if (b.useCache) h[k] = n;
                        c.val() === k &&
                        c.trigger("autocomplete.finish", n)
                    },
                    b.dataType)
                }
            }
            function l(k) {
                if (k.length >= b.minLength) {
                    if (g != k) {
                        j(k);
                        g = k
                    }
                } else c.trigger("autocomplete.clear")
            }
            if (b.url != null) {
                c.attr("autocomplete", "off");
                c.keyup(function(k) {
                    k.preventDefault();
                    clearTimeout(f);
                    f = setTimeout(function() {
                        clearTimeout(f);
                        l(c.val())
                    },
                    b.delay)
                });
                c.blur(function() {
                    g = null
                })
            }
        })
    }
})(jQuery); (function(a) {
    a.fn.autosaveField = function(d) {
        var b = a.extend({},
        a.fn.autosaveField.defaults, d);
        return this.each(function() {
            var c = a(this),
            e = c.find(":text"),
            f = c.find(".error"),
            g = c.find(".success"),
            h = c.attr("data-action"),
            j = c.attr("data-name"),
            l = e.val();
            function k() {
                e.spin();
                a.ajax({
                    url: h,
                    type: "POST",
                    data: {
                        _method: b.method,
                        field: j,
                        value: e.val()
                    },
                    success: function() {
                        e.stopSpin();
                        g.show();
                        l = e.val()
                    },
                    error: function() {
                        e.stopSpin();
                        c.attr("data-reset-on-error") && e.val(l);
                        f.show()
                    }
                })
            }
            e.blur(function() {
                a(this).val() !=
                l && k()
            });
            e.keyup(function() {
                f.hide();
                g.hide()
            })
        })
    };
    a.fn.autosaveField.defaults = {
        method: "put"
    }
})(jQuery); (function(a) {
    BaconPlayer = {
        sound: null,
        playing: false,
        sm2: "/js/soundmanager2.js",
        flashURL: "/flash/",
        playOrPause: function(c) {
            this.initSound(c,
            function() {
                this.playing ? this.pause() : this.play()
            })
        },
        play: function() {
            if (this.sound) {
                this.playing = true;
                this.sound.play();
                a(".baconplayer .play, .baconplayer .pause").toggle();
                return "playing"
            }
        },
        pause: function() {
            if (this.sound) {
                this.playing = false;
                this.sound.pause();
                a(".baconplayer .play, .baconplayer .pause").toggle();
                return "paused"
            }
        },
        initSound: function(c, e) {
            if (!window.soundManager) return a.getScript(this.sm2,
            function() {
                soundManager.url = BaconPlayer.flashURL;
                soundManager.debugMode = false;
                soundManager.onready(function() {
                    BaconPlayer.initSound(c, e)
                })
            });
            this.sound = soundManager.createSound({
                id: "baconplayer",
                url: c,
                whileplaying: function() {
                    BaconPlayer.moveProgressBar(this);
                    BaconPlayer.setPositionTiming(this)
                },
                whileloading: function() {
                    BaconPlayer.moveLoadingBar(this);
                    BaconPlayer.setDurationTiming(this)
                },
                onload: function() {
                    BaconPlayer.setDurationTiming(this, true)
                }
            });
            e.call(this)
        },
        moveProgressBar: function(c) {
            c = c.position /
            c.durationEstimate;
            a(".baconplayer .inner-progress").width(this.progressBar().width() * c)
        },
        moveLoadingBar: function(c) {
            c = c.bytesLoaded / c.bytesTotal;
            a(".baconplayer .loading-progress").width(this.progressBar().width() * c)
        },
        setPositionTiming: function(c) {
            c = d(c.position);
            a(".baconplayer .position").text(c)
        },
        setDurationTiming: function(c, e) {
            if (! (!e && this.durationTimingTimer)) {
                this.durationTimingTimer = setTimeout(function() {
                    BaconPlayer.setDurationTiming(c);
                    BaconPlayer.durationTimingTimer = null
                },
                2000);
                e = d(c.durationEstimate);
                a(".baconplayer .duration").text(e)
            }
        },
        progressBar: function() {
            return a(".baconplayer .progress")
        },
        setPosition: function(c) {
            var e = this.progressBar()[0],
            f = this.sound;
            c = parseInt(c.clientX);
            e = Math.floor((c - b(e) - 4) / e.offsetWidth * f.durationEstimate);
            isNaN(e) || (e = Math.min(e, f.duration));
            isNaN(e) || f.setPosition(e)
        },
        startDrag: function(c) {
            if (! (this.dragging || !this.sound)) {
                this.attachDragHandlers();
                this.dragging = true;
                this.pause();
                this.setPosition(c)
            }
        },
        drag: function(c) {
            this.setPosition(c)
        },
        stopDrag: function(c) {
            this.removeDragHandlers();
            this.dragging = false;
            this.setPosition(c);
            this.play()
        },
        attachDragHandlers: function() {
            a(document).bind("mousemove.baconplayer",
            function(c) {
                BaconPlayer.drag(c)
            });
            a(document).bind("mouseup.baconplayer",
            function(c) {
                BaconPlayer.stopDrag(c)
            })
        },
        removeDragHandlers: function() {
            a(document).unbind("mousemove.baconplayer");
            a(document).unbind("mouseup.baconplayer")
        }
    };
    function d(c) {
        c = Math.floor(c / 1000);
        var e = Math.floor(c / 60);
        c %= 60;
        c = c < 10 ? "0" + c: c;
        return e + ":" + c
    }
    function b(c) {
        var e = 0;
        if (c.offsetParent) for (; c.offsetParent;) {
            e +=
            c.offsetLeft;
            c = c.offsetParent
        } else if (c.x) e += c.x;
        return e
    }
    a(function() {
        a(".baconplayer .play, .baconplayer .pause").click(function() {
            BaconPlayer.playOrPause(this.href);
            return false
        });
        a(".baconplayer .progress").mousedown(function(c) {
            BaconPlayer.startDrag(c)
        })
    })
})(jQuery);
DateInput = function(a) {
    function d(b, c) {
        if (typeof c != "object") c = {};
        a.extend(this, d.DEFAULT_OPTS, c);
        this.input = a(b);
        this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
        this.build();
        this.selectDate();
        this.hide();
        this.input.data("datePicker", this)
    }
    d.DEFAULT_OPTS = {
        month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
        "Dec"],
        short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        start_of_week: 1
    };
    d.prototype = {
        build: function() {
            var b = a('<p class="month_nav"><span class="button prev" title="[Page-Up]">&#171;</span> <span class="month_name"></span> <span class="button next" title="[Page-Down]">&#187;</span></p>');
            this.monthNameSpan = a(".month_name", b);
            a(".prev", b).click(this.bindToObj(function() {
                this.moveMonthBy( - 1)
            }));
            a(".next", b).click(this.bindToObj(function() {
                this.moveMonthBy(1)
            }));
            var c = a('<p class="year_nav"><span class="button prev" title="[Ctrl+Page-Up]">&#171;</span> <span class="year_name"></span> <span class="button next" title="[Ctrl+Page-Down]">&#187;</span></p>');
            this.yearNameSpan = a(".year_name", c);
            a(".prev", c).click(this.bindToObj(function() {
                this.moveMonthBy( - 12)
            }));
            a(".next", c).click(this.bindToObj(function() {
                this.moveMonthBy(12)
            }));
            b = a('<div class="nav"></div>').append(b, c);
            var e = "<table><thead><tr>";
            a(this.adjustDays(this.short_day_names)).each(function() {
                e += "<th>" + this + "</th>"
            });
            e += "</tr></thead><tbody></tbody></table>";
            this.dateSelector = this.rootLayers = a('<div class="date_selector"></div>').append(b, e).insertAfter(this.input);
            if (a.browser.msie && a.browser.version <
            7) {
                this.ieframe = a('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
                this.rootLayers = this.rootLayers.add(this.ieframe);
                a(".button", b).mouseover(function() {
                    a(this).addClass("hover")
                });
                a(".button", b).mouseout(function() {
                    a(this).removeClass("hover")
                })
            }
            this.tbody = a("tbody", this.dateSelector);
            this.input.change(this.bindToObj(function() {
                this.selectDate()
            }));
            this.selectDate()
        },
        selectMonth: function(b) {
            var c = new Date(b.getFullYear(), b.getMonth(), 1);
            if (!this.currentMonth ||
            !(this.currentMonth.getFullYear() == c.getFullYear() && this.currentMonth.getMonth() == c.getMonth())) {
                this.currentMonth = c;
                c = this.rangeStart(b);
                var e = this.rangeEnd(b);
                e = this.daysBetween(c, e);
                for (var f = "", g = 0; g <= e; g++) {
                    var h = new Date(c.getFullYear(), c.getMonth(), c.getDate() + g, 12, 0);
                    if (this.isFirstDayOfWeek(h)) f += "<tr>";
                    f += h.getMonth() == b.getMonth() ? '<td class="selectable_day" date="' + this.dateToString(h) + '">' + h.getDate() + "</td>": '<td class="unselected_month" date="' + this.dateToString(h) + '">' + h.getDate() +
                    "</td>";
                    if (this.isLastDayOfWeek(h)) f += "</tr>"
                }
                this.tbody.empty().append(f);
                this.monthNameSpan.empty().append(this.monthName(b));
                this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
                a(".selectable_day", this.tbody).click(this.bindToObj(function(j) {
                    this.changeInput(a(j.target).attr("date"))
                }));
                a("td[date=" + this.dateToString(new Date) + "]", this.tbody).addClass("today");
                a("td.selectable_day", this.tbody).mouseover(function() {
                    a(this).addClass("hover")
                });
                a("td.selectable_day", this.tbody).mouseout(function() {
                    a(this).removeClass("hover")
                })
            }
            a(".selected",
            this.tbody).removeClass("selected");
            a("td[date=" + this.selectedDateString + "]", this.tbody).addClass("selected")
        },
        selectDate: function(b) {
            if (typeof b == "undefined") b = this.stringToDate(this.input.val());
            b || (b = new Date);
            this.selectedDate = b;
            this.selectedDateString = this.dateToString(this.selectedDate);
            this.selectMonth(this.selectedDate)
        },
        changeInput: function(b) {
            this.input.val(b).change();
            this.hide()
        },
        show: function() {
            this.rootLayers.css("display", "block");
            a([window, document.body]).click(this.hideIfClickOutside);
            this.input.unbind("focus", this.show);
            this.rootLayers.keydown(this.keydownHandler);
            this.setPosition()
        },
        hide: function() {
            this.rootLayers.css("display", "none");
            a([window, document.body]).unbind("click", this.hideIfClickOutside);
            this.input.focus(this.show);
            this.rootLayers.unbind("keydown", this.keydownHandler)
        },
        hideIfClickOutside: function(b) {
            b.target != this.input[0] && !this.insideSelector(b) && this.hide()
        },
        insideSelector: function(b) {
            var c = this.dateSelector.position();
            c.right = c.left + this.dateSelector.outerWidth();
            c.bottom = c.top + this.dateSelector.outerHeight();
            return b.pageY < c.bottom && b.pageY > c.top && b.pageX < c.right && b.pageX > c.left
        },
        keydownHandler: function(b) {
            switch (b.keyCode) {
            case 9:
            case 27:
                this.hide();
                return;
            case 13:
                this.changeInput(this.selectedDateString);
                break;
            case 33:
                this.moveDateMonthBy(b.ctrlKey ? -12: -1);
                break;
            case 34:
                this.moveDateMonthBy(b.ctrlKey ? 12: 1);
                break;
            case 38:
                this.moveDateBy( - 7);
                break;
            case 40:
                this.moveDateBy(7);
                break;
            case 37:
                this.moveDateBy( - 1);
                break;
            case 39:
                this.moveDateBy(1);
                break;
            default:
                return
            }
            b.preventDefault()
        },
        stringToDate: function(b) {
            var c;
            return (c = b.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/)) ? new Date(c[3], this.shortMonthNum(c[2]), c[1], 12, 0) : null
        },
        dateToString: function(b) {
            return b.getDate() + " " + this.short_month_names[b.getMonth()] + " " + b.getFullYear()
        },
        setPosition: function() {
            var b = this.input.offset();
            this.rootLayers.css({
                top: b.top + this.input.outerHeight(),
                left: b.left
            });
            this.ieframe && this.ieframe.css({
                width: this.dateSelector.outerWidth(),
                height: this.dateSelector.outerHeight()
            })
        },
        moveDateBy: function(b) {
            b = new Date(this.selectedDate.getFullYear(),
            this.selectedDate.getMonth(), this.selectedDate.getDate() + b);
            this.selectDate(b)
        },
        moveDateMonthBy: function(b) {
            var c = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + b, this.selectedDate.getDate());
            c.getMonth() == this.selectedDate.getMonth() + b + 1 && c.setDate(0);
            this.selectDate(c)
        },
        moveMonthBy: function(b) {
            b = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + b, this.currentMonth.getDate());
            this.selectMonth(b)
        },
        monthName: function(b) {
            return this.month_names[b.getMonth()]
        },
        bindToObj: function(b) {
            var c = this;
            return function() {
                return b.apply(c, arguments)
            }
        },
        bindMethodsToObj: function() {
            for (var b = 0; b < arguments.length; b++) this[arguments[b]] = this.bindToObj(this[arguments[b]])
        },
        indexFor: function(b, c) {
            for (var e = 0; e < b.length; e++) if (c == b[e]) return e
        },
        monthNum: function(b) {
            return this.indexFor(this.month_names, b)
        },
        shortMonthNum: function(b) {
            return this.indexFor(this.short_month_names, b)
        },
        shortDayNum: function(b) {
            return this.indexFor(this.short_day_names, b)
        },
        daysBetween: function(b, c) {
            b =
            Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            c = Date.UTC(c.getFullYear(), c.getMonth(), c.getDate());
            return (c - b) / 86400000
        },
        changeDayTo: function(b, c, e) {
            b = e * (Math.abs(c.getDay() - b - e * 7) % 7);
            return new Date(c.getFullYear(), c.getMonth(), c.getDate() + b)
        },
        rangeStart: function(b) {
            return this.changeDayTo(this.start_of_week, new Date(b.getFullYear(), b.getMonth()), -1)
        },
        rangeEnd: function(b) {
            return this.changeDayTo((this.start_of_week - 1) % 7, new Date(b.getFullYear(), b.getMonth() + 1, 0), 1)
        },
        isFirstDayOfWeek: function(b) {
            return b.getDay() ==
            this.start_of_week
        },
        isLastDayOfWeek: function(b) {
            return b.getDay() == (this.start_of_week - 1) % 7
        },
        adjustDays: function(b) {
            for (var c = [], e = 0; e < b.length; e++) c[e] = b[(e + this.start_of_week) % 7];
            return c
        }
    };
    a.fn.date_input = function(b) {
        return this.each(function() {
            new d(this, b)
        })
    };
    a.date_input = {
        initialize: function(b) {
            a("input.date_input").date_input(b)
        }
    };
    return d
} (jQuery); (function(a) {
    a.fn.gfmPreview = function(d) {
        d = d || {};
        var b = a("<div>").attr("class", "gfm-preview").text("Preview goes here"),
        c = this;
        c.after(b);
        var e = false;
        c.keyup(function() {
            e = true
        });
        setInterval(function() {
            if (e) {
                e = false;
                var f = c.val();
                a.post("/preview", {
                    text: f
                },
                function(g) {
                    b.html(g)
                })
            }
        },
        2000)
    }
})(jQuery);
 (function(a) {
    a.fn.gfmPreview = function(d) {
        var b = a.extend({},
        a.fn.gfmPreview.defaults, d);
        return this.each(function() {
            var c = false,
            e = a(this),
            f = a("<div>").attr("class", "gfm-preview").text("Preview goes here"),
            g = b.outputContainer || f;
            b.outputContainer == null && e.after(f);
            var h = false;
            e.keyup(function() {
                h = true;
                if (!c) {
                    b.onInit.call(this);
                    c = true
                }
            });
            setInterval(function() {
                if (h) {
                    h = false;
                    var j = e.val();
                    a.post("/preview", {
                        text: j
                    },
                    function(l) {
                        g.html(l)
                    })
                }
            },
            b.refresh)
        })
    };
    a.fn.gfmPreview.defaults = {
        outputContainer: null,
        refresh: 2000,
        onInit: function() {}
    }
})(jQuery); (function(a) {
    a.fn.assigneeFilter = function(d) {
        var b = this,
        c = b.find("li"),
        e = c.map(function() {
            return a(this).text().toLowerCase()
        });
        b.find(".js-assignee-filter-submit").live("click",
        function(g) {
            d(g);
            g.preventDefault()
        });
        b.find(".js-assignee-filter").keydown(function(g) {
            switch (g.which) {
            case 9:
            case 38:
            case 40:
                return false;
            case 13:
                d(g);
                return false
            }
        }).keyup(function(g) {
            b.find(".selected").removeClass("selected");
            var h = b.find(".current:visible"),
            j = null;
            switch (g.which) {
            case 9:
            case 16:
            case 17:
            case 18:
            case 91:
            case 93:
            case 13:
                b.find(".current label").trigger("click");
                return false;
            case 38:
            case 40:
                if (h.length == 0) {
                    f(b.find("li:visible:first"));
                    return false
                }
                j = g.which == 38 ? h.prevAll(":visible:first") : h.nextAll(":visible:first");
                j.length && f(j);
                return false
            }
            var l = a.trim(a(this).val().toLowerCase()),
            k = [];
            if (!l) {
                b.find(".current").removeClass("current");
                return c.show()
            }
            c.hide();
            e.each(function(m) {
                var n = this.score(l);
                n > 0 && k.push([n, m])
            });
            a.each(k.sort(function(m, n) {
                return n[0] - m[0]
            }),
            function() {
                a(c[this[1]]).show()
            });
            b.find(".current:visible").length == 0 && f(b.find("li:visible:first"))
        });
        function f(g) {
            b.find(".current").removeClass("current");
            b.find(":checked").removeAttr("checked");
            g.addClass("current");
            g.find(":radio").attr("checked", "checked")
        }
        return b
    }
})(jQuery); (function(a) {
    a.fn.cardsSelect = function(d) {
        a.extend({},
        a.fn.cardsSelect.defaults, d);
        return this.each(function() {
            var b = a(this),
            c = b.next("dl.form").find("input[type=text]"),
            e = b.find(".card"),
            f = b.find("input[name='billing[type]']");
            function g(h) {
                e.each(function() {
                    var j = a(this);
                    j.attr("data-name") == h ? j.removeClass("disabled") : j.addClass("disabled");
                    f.val(h)
                })
            }
            c.bind("keyup blur",
            function() {
                var h = a(this).val();
                if (h.match(/^5[1-5]/)) g("master");
                else if (h.match(/^4/)) g("visa");
                else if (h.match(/^3(4|7)/)) g("american_express");
                else if (h.match(/^6011/)) g("discover");
                else if (h.match(/^(3|2131|1800)/)) g("jcb");
                else if (h.match(/^(30[0-5]|36|38)/)) g("diners");
                else {
                    e.removeClass("disabled");
                    f.val("")
                }
            }).keyup()
        })
    };
    a.fn.cardsSelect.defaults = {}
})(jQuery);
$.fn.contextButton = function(a, d) {
    return $(this).each(function() {
        var b = $(this),
        c = $.extend({
            contextPaneSelector: null,
            anchorTo: "left"
        },
        d);
        if (c.contextPaneSelector == null) c.contextPaneSelector = self.attr("data-context-pane");
        function e() {
            $(document).unbind("keydown.context-button");
            $("#context-overlay").remove();
            $(c.contextPaneSelector).hide();
            b.find(a).removeClass("selected")
        }
        b.delegate(a, "click",
        function() {
            var f = b.find(a);
            contextPane = $(c.contextPaneSelector);
            if (contextPane.is(":visible")) e();
            else {
                var g =
                f.offset(),
                h;
                if (c.anchorTo == "left") h = {
                    left: g.left,
                    top: g.top + f.outerHeight(true) + 5
                };
                else if (c.anchorTo == "right") h = {
                    left: g.left - (contextPane.outerWidth(true) - f.outerWidth(true)),
                    top: g.top + f.outerHeight(true) + 5
                };
                contextPane.css(h);
                $(document).bind("keydown.context-button",
                function(j) {
                    j.keyCode == 27 && f.click()
                });
                $("body").append('<div id="context-overlay"></div>');
                $("#context-overlay").click(e).css("position", "fixed").css("top", 0).css("left", 0).css("height", "100%").css("width", "100%");
                contextPane.show();
                f.addClass("selected");
                f.trigger("show.context-button")
            }
            $(c.contextPaneSelector).find("a.close").live("click", e);
            $(c.contextPaneSelector).bind("close.context-button", e)
        })
    })
}; (function(a, d) {
    function b(c) {
        return ! a(c).parents().andSelf().filter(function() {
            return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
        }).length
    }
    a.ui = a.ui || {};
    if (!a.ui.version) {
        a.extend(a.ui, {
            version: "1.8.10",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        a.fn.extend({
            _focus: a.fn.focus,
            focus: function(c, e) {
                return typeof c === "number" ? this.each(function() {
                    var f = this;
                    setTimeout(function() {
                        a(f).focus();
                        e && e.call(f)
                    },
                    c)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function() {
                var c;
                c = a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test(a.curCSS(this,
                    "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                }).eq(0);
                return /fixed/.test(this.css("position")) || !c.length ? a(document) : c
            },
            zIndex: function(c) {
                if (c !== d) return this.css("zIndex", c);
                if (this.length) {
                    c = a(this[0]);
                    for (var e; c.length && c[0] !== document;) {
                        e = c.css("position");
                        if (e === "absolute" || e === "relative" || e === "fixed") {
                            e = parseInt(c.css("zIndex"), 10);
                            if (!isNaN(e) && e !== 0) return e
                        }
                        c = c.parent()
                    }
                }
                return 0
            },
            disableSelection: function() {
                return this.bind((a.support.selectstart ? "selectstart": "mousedown") + ".ui-disableSelection",
                function(c) {
                    c.preventDefault()
                })
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            }
        });
        a.each(["Width", "Height"],
        function(c, e) {
            function f(l, k, m, n) {
                a.each(g,
                function() {
                    k -= parseFloat(a.curCSS(l, "padding" + this, true)) || 0;
                    if (m) k -= parseFloat(a.curCSS(l,
                    "border" + this + "Width", true)) || 0;
                    if (n) k -= parseFloat(a.curCSS(l, "margin" + this, true)) || 0
                });
                return k
            }
            var g = e === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
            h = e.toLowerCase(),
            j = {
                innerWidth: a.fn.innerWidth,
                innerHeight: a.fn.innerHeight,
                outerWidth: a.fn.outerWidth,
                outerHeight: a.fn.outerHeight
            };
            a.fn["inner" + e] = function(l) {
                if (l === d) return j["inner" + e].call(this);
                return this.each(function() {
                    a(this).css(h, f(this, l) + "px")
                })
            };
            a.fn["outer" + e] = function(l, k) {
                if (typeof l !== "number") return j["outer" + e].call(this, l);
                return this.each(function() {
                    a(this).css(h,
                    f(this, l, true, k) + "px")
                })
            }
        });
        a.extend(a.expr[":"], {
            data: function(c, e, f) {
                return !! a.data(c, f[3])
            },
            focusable: function(c) {
                var e = c.nodeName.toLowerCase(),
                f = a.attr(c, "tabindex");
                if ("area" === e) {
                    e = c.parentNode;
                    f = e.name;
                    if (!c.href || !f || e.nodeName.toLowerCase() !== "map") return false;
                    c = a("img[usemap=#" + f + "]")[0];
                    return !! c && b(c)
                }
                return (/input|select|textarea|button|object/.test(e) ? !c.disabled: "a" == e ? c.href || !isNaN(f) : !isNaN(f)) && b(c)
            },
            tabbable: function(c) {
                var e = a.attr(c, "tabindex");
                return (isNaN(e) || e >= 0) && a(c).is(":focusable")
            }
        });
        a(function() {
            var c = document.body,
            e = c.appendChild(e = document.createElement("div"));
            a.extend(e.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            });
            a.support.minHeight = e.offsetHeight === 100;
            a.support.selectstart = "onselectstart" in e;
            c.removeChild(e).style.display = "none"
        });
        a.extend(a.ui, {
            plugin: {
                add: function(c, e, f) {
                    c = a.ui[c].prototype;
                    for (var g in f) {
                        c.plugins[g] = c.plugins[g] || [];
                        c.plugins[g].push([e, f[g]])
                    }
                },
                call: function(c, e, f) {
                    if ((e = c.plugins[e]) && c.element[0].parentNode) for (var g = 0; g < e.length; g++) c.options[e[g][0]] &&
                    e[g][1].apply(c.element, f)
                }
            },
            contains: function(c, e) {
                return document.compareDocumentPosition ? c.compareDocumentPosition(e) & 16: c !== e && c.contains(e)
            },
            hasScroll: function(c, e) {
                if (a(c).css("overflow") === "hidden") return false;
                e = e && e === "left" ? "scrollLeft": "scrollTop";
                var f = false;
                if (c[e] > 0) return true;
                c[e] = 1;
                f = c[e] > 0;
                c[e] = 0;
                return f
            },
            isOverAxis: function(c, e, f) {
                return c > e && c < e + f
            },
            isOver: function(c, e, f, g, h, j) {
                return a.ui.isOverAxis(c, f, h) && a.ui.isOverAxis(e, g, j)
            }
        })
    }
})(jQuery);
 (function(a, d) {
    if (a.cleanData) {
        var b = a.cleanData;
        a.cleanData = function(e) {
            for (var f = 0, g; (g = e[f]) != null; f++) a(g).triggerHandler("remove");
            b(e)
        }
    } else {
        var c = a.fn.remove;
        a.fn.remove = function(e, f) {
            return this.each(function() {
                if (!f) if (!e || a.filter(e, [this]).length) a("*", this).add([this]).each(function() {
                    a(this).triggerHandler("remove")
                });
                return c.call(a(this), e, f)
            })
        }
    }
    a.widget = function(e, f, g) {
        var h = e.split(".")[0],
        j;
        e = e.split(".")[1];
        j = h + "-" + e;
        if (!g) {
            g = f;
            f = a.Widget
        }
        a.expr[":"][j] = function(l) {
            return !! a.data(l,
            e)
        };
        a[h] = a[h] || {};
        a[h][e] = function(l, k) {
            arguments.length && this._createWidget(l, k)
        };
        f = new f;
        f.options = a.extend(true, {},
        f.options);
        a[h][e].prototype = a.extend(true, f, {
            namespace: h,
            widgetName: e,
            widgetEventPrefix: a[h][e].prototype.widgetEventPrefix || e,
            widgetBaseClass: j
        },
        g);
        a.widget.bridge(e, a[h][e])
    };
    a.widget.bridge = function(e, f) {
        a.fn[e] = function(g) {
            var h = typeof g === "string",
            j = Array.prototype.slice.call(arguments, 1),
            l = this;
            g = !h && j.length ? a.extend.apply(null, [true, g].concat(j)) : g;
            if (h && g.charAt(0) === "_") return l;
            h ? this.each(function() {
                var k = a.data(this, e),
                m = k && a.isFunction(k[g]) ? k[g].apply(k, j) : k;
                if (m !== k && m !== d) {
                    l = m;
                    return false
                }
            }) : this.each(function() {
                var k = a.data(this, e);
                k ? k.option(g || {})._init() : a.data(this, e, new f(g, this))
            });
            return l
        }
    };
    a.Widget = function(e, f) {
        arguments.length && this._createWidget(e, f)
    };
    a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function(e, f) {
            a.data(f, this.widgetName, this);
            this.element = a(f);
            this.options = a.extend(true, {},
            this.options,
            this._getCreateOptions(), e);
            var g = this;
            this.element.bind("remove." + this.widgetName,
            function() {
                g.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function() {
            return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function() {},
        _init: function() {},
        destroy: function() {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function() {
            return this.element
        },
        option: function(e, f) {
            var g = e;
            if (arguments.length === 0) return a.extend({},
            this.options);
            if (typeof e === "string") {
                if (f === d) return this.options[e];
                g = {};
                g[e] = f
            }
            this._setOptions(g);
            return this
        },
        _setOptions: function(e) {
            var f = this;
            a.each(e,
            function(g, h) {
                f._setOption(g, h)
            });
            return this
        },
        _setOption: function(e, f) {
            this.options[e] = f;
            if (e === "disabled") this.widget()[f ? "addClass": "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", f);
            return this
        },
        enable: function() {
            return this._setOption("disabled", false)
        },
        disable: function() {
            return this._setOption("disabled", true)
        },
        _trigger: function(e, f, g) {
            var h = this.options[e];
            f = a.Event(f);
            f.type = (e === this.widgetEventPrefix ? e: this.widgetEventPrefix + e).toLowerCase();
            g = g || {};
            if (f.originalEvent) {
                e = a.event.props.length;
                for (var j; e;) {
                    j = a.event.props[--e];
                    f[j] = f.originalEvent[j]
                }
            }
            this.element.trigger(f, g);
            return ! (a.isFunction(h) && h.call(this.element[0], f, g) === false || f.isDefaultPrevented())
        }
    }
})(jQuery);
 (function(a) {
    a.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var d = this;
            this.element.bind("mousedown." + this.widgetName,
            function(b) {
                return d._mouseDown(b)
            }).bind("click." + this.widgetName,
            function(b) {
                if (true === a.data(b.target, d.widgetName + ".preventClickEvent")) {
                    a.removeData(b.target, d.widgetName + ".preventClickEvent");
                    b.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function(d) {
            d.originalEvent =
            d.originalEvent || {};
            if (!d.originalEvent.mouseHandled) {
                this._mouseStarted && this._mouseUp(d);
                this._mouseDownEvent = d;
                var b = this,
                c = d.which == 1,
                e = typeof this.options.cancel == "string" ? a(d.target).parents().add(d.target).filter(this.options.cancel).length: false;
                if (!c || e || !this._mouseCapture(d)) return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) this._mouseDelayTimer = setTimeout(function() {
                    b.mouseDelayMet = true
                },
                this.options.delay);
                if (this._mouseDistanceMet(d) && this._mouseDelayMet(d)) {
                    this._mouseStarted =
                    this._mouseStart(d) !== false;
                    if (!this._mouseStarted) {
                        d.preventDefault();
                        return true
                    }
                }
                this._mouseMoveDelegate = function(f) {
                    return b._mouseMove(f)
                };
                this._mouseUpDelegate = function(f) {
                    return b._mouseUp(f)
                };
                a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                d.preventDefault();
                return d.originalEvent.mouseHandled = true
            }
        },
        _mouseMove: function(d) {
            if (a.browser.msie && !(document.documentMode >= 9) && !d.button) return this._mouseUp(d);
            if (this._mouseStarted) {
                this._mouseDrag(d);
                return d.preventDefault()
            }
            if (this._mouseDistanceMet(d) && this._mouseDelayMet(d))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, d) !== false) ? this._mouseDrag(d) : this._mouseUp(d);
            return ! this._mouseStarted
        },
        _mouseUp: function(d) {
            a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                d.target == this._mouseDownEvent.target && a.data(d.target, this.widgetName + ".preventClickEvent",
                true);
                this._mouseStop(d)
            }
            return false
        },
        _mouseDistanceMet: function(d) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - d.pageX), Math.abs(this._mouseDownEvent.pageY - d.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return true
        }
    })
})(jQuery);
 (function(a) {
    a.ui = a.ui || {};
    var d = /left|center|right/,
    b = /top|center|bottom/,
    c = a.fn.position,
    e = a.fn.offset;
    a.fn.position = function(f) {
        if (!f || !f.of) return c.apply(this, arguments);
        f = a.extend({},
        f);
        var g = a(f.of),
        h = g[0],
        j = (f.collision || "flip").split(" "),
        l = f.offset ? f.offset.split(" ") : [0, 0],
        k,
        m,
        n;
        if (h.nodeType === 9) {
            k = g.width();
            m = g.height();
            n = {
                top: 0,
                left: 0
            }
        } else if (h.setTimeout) {
            k = g.width();
            m = g.height();
            n = {
                top: g.scrollTop(),
                left: g.scrollLeft()
            }
        } else if (h.preventDefault) {
            f.at = "left top";
            k = m = 0;
            n = {
                top: f.of.pageY,
                left: f.of.pageX
            }
        } else {
            k = g.outerWidth();
            m = g.outerHeight();
            n = g.offset()
        }
        a.each(["my", "at"],
        function() {
            var q = (f[this] || "").split(" ");
            if (q.length === 1) q = d.test(q[0]) ? q.concat(["center"]) : b.test(q[0]) ? ["center"].concat(q) : ["center", "center"];
            q[0] = d.test(q[0]) ? q[0] : "center";
            q[1] = b.test(q[1]) ? q[1] : "center";
            f[this] = q
        });
        if (j.length === 1) j[1] = j[0];
        l[0] = parseInt(l[0], 10) || 0;
        if (l.length === 1) l[1] = l[0];
        l[1] = parseInt(l[1], 10) || 0;
        if (f.at[0] === "right") n.left += k;
        else if (f.at[0] === "center") n.left += k / 2;
        if (f.at[1] === "bottom") n.top +=
        m;
        else if (f.at[1] === "center") n.top += m / 2;
        n.left += l[0];
        n.top += l[1];
        return this.each(function() {
            var q = a(this),
            s = q.outerWidth(),
            w = q.outerHeight(),
            t = parseInt(a.curCSS(this, "marginLeft", true)) || 0,
            o = parseInt(a.curCSS(this, "marginTop", true)) || 0,
            p = s + t + (parseInt(a.curCSS(this, "marginRight", true)) || 0),
            r = w + o + (parseInt(a.curCSS(this, "marginBottom", true)) || 0),
            v = a.extend({},
            n),
            C;
            if (f.my[0] === "right") v.left -= s;
            else if (f.my[0] === "center") v.left -= s / 2;
            if (f.my[1] === "bottom") v.top -= w;
            else if (f.my[1] === "center") v.top -=
            w / 2;
            v.left = Math.round(v.left);
            v.top = Math.round(v.top);
            C = {
                left: v.left - t,
                top: v.top - o
            };
            a.each(["left", "top"],
            function(J, y) {
                a.ui.position[j[J]] && a.ui.position[j[J]][y](v, {
                    targetWidth: k,
                    targetHeight: m,
                    elemWidth: s,
                    elemHeight: w,
                    collisionPosition: C,
                    collisionWidth: p,
                    collisionHeight: r,
                    offset: l,
                    my: f.my,
                    at: f.at
                })
            });
            a.fn.bgiframe && q.bgiframe();
            q.offset(a.extend(v, {
                using: f.using
            }))
        })
    };
    a.ui.position = {
        fit: {
            left: function(f, g) {
                var h = a(window);
                h = g.collisionPosition.left + g.collisionWidth - h.width() - h.scrollLeft();
                f.left =
                h > 0 ? f.left - h: Math.max(f.left - g.collisionPosition.left, f.left)
            },
            top: function(f, g) {
                var h = a(window);
                h = g.collisionPosition.top + g.collisionHeight - h.height() - h.scrollTop();
                f.top = h > 0 ? f.top - h: Math.max(f.top - g.collisionPosition.top, f.top)
            }
        },
        flip: {
            left: function(f, g) {
                if (g.at[0] !== "center") {
                    var h = a(window);
                    h = g.collisionPosition.left + g.collisionWidth - h.width() - h.scrollLeft();
                    var j = g.my[0] === "left" ? -g.elemWidth: g.my[0] === "right" ? g.elemWidth: 0,
                    l = g.at[0] === "left" ? g.targetWidth: -g.targetWidth,
                    k = -2 * g.offset[0];
                    f.left +=
                    g.collisionPosition.left < 0 ? j + l + k: h > 0 ? j + l + k: 0
                }
            },
            top: function(f, g) {
                if (g.at[1] !== "center") {
                    var h = a(window);
                    h = g.collisionPosition.top + g.collisionHeight - h.height() - h.scrollTop();
                    var j = g.my[1] === "top" ? -g.elemHeight: g.my[1] === "bottom" ? g.elemHeight: 0,
                    l = g.at[1] === "top" ? g.targetHeight: -g.targetHeight,
                    k = -2 * g.offset[1];
                    f.top += g.collisionPosition.top < 0 ? j + l + k: h > 0 ? j + l + k: 0
                }
            }
        }
    };
    if (!a.offset.setOffset) {
        a.offset.setOffset = function(f, g) {
            if (/static/.test(a.curCSS(f, "position"))) f.style.position = "relative";
            var h = a(f),
            j = h.offset(),
            l = parseInt(a.curCSS(f, "top", true), 10) || 0,
            k = parseInt(a.curCSS(f, "left", true), 10) || 0;
            j = {
                top: g.top - j.top + l,
                left: g.left - j.left + k
            };
            "using" in g ? g.using.call(f, j) : h.css(j)
        };
        a.fn.offset = function(f) {
            var g = this[0];
            if (!g || !g.ownerDocument) return null;
            if (f) return this.each(function() {
                a.offset.setOffset(this, f)
            });
            return e.call(this)
        }
    }
})(jQuery);
 (function(a) {
    a.widget("ui.draggable", a.ui.mouse, {
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false
        },
        _create: function() {
            if (this.options.helper ==
            "original" && !/^(?:r|a|f)/.test(this.element.css("position"))) this.element[0].style.position = "relative";
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._mouseInit()
        },
        destroy: function() {
            if (this.element.data("draggable")) {
                this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
                this._mouseDestroy();
                return this
            }
        },
        _mouseCapture: function(d) {
            var b =
            this.options;
            if (this.helper || b.disabled || a(d.target).is(".ui-resizable-handle")) return false;
            this.handle = this._getHandle(d);
            if (!this.handle) return false;
            return true
        },
        _mouseStart: function(d) {
            var b = this.options;
            this.helper = this._createHelper(d);
            this._cacheHelperProportions();
            if (a.ui.ddmanager) a.ui.ddmanager.current = this;
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top -
                this.margins.top,
                left: this.offset.left - this.margins.left
            };
            a.extend(this.offset, {
                click: {
                    left: d.pageX - this.offset.left,
                    top: d.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this.position = this._generatePosition(d);
            this.originalPageX = d.pageX;
            this.originalPageY = d.pageY;
            b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt);
            b.containment && this._setContainment();
            if (this._trigger("start", d) === false) {
                this._clear();
                return false
            }
            this._cacheHelperProportions();
            a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, d);
            this.helper.addClass("ui-draggable-dragging");
            this._mouseDrag(d, true);
            return true
        },
        _mouseDrag: function(d, b) {
            this.position = this._generatePosition(d);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!b) {
                b = this._uiHash();
                if (this._trigger("drag", d, b) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = b.position
            }
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis ||
            this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            a.ui.ddmanager && a.ui.ddmanager.drag(this, d);
            return false
        },
        _mouseStop: function(d) {
            var b = false;
            if (a.ui.ddmanager && !this.options.dropBehaviour) b = a.ui.ddmanager.drop(this, d);
            if (this.dropped) {
                b = this.dropped;
                this.dropped = false
            }
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original") return false;
            if (this.options.revert == "invalid" && !b || this.options.revert == "valid" && b || this.options.revert === true || a.isFunction(this.options.revert) &&
            this.options.revert.call(this.element, b)) {
                var c = this;
                a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10),
                function() {
                    c._trigger("stop", d) !== false && c._clear()
                })
            } else this._trigger("stop", d) !== false && this._clear();
            return false
        },
        cancel: function() {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        },
        _getHandle: function(d) {
            var b = !this.options.handle || !a(this.options.handle, this.element).length ? true: false;
            a(this.options.handle, this.element).find("*").andSelf().each(function() {
                if (this ==
                d.target) b = true
            });
            return b
        },
        _createHelper: function(d) {
            var b = this.options;
            d = a.isFunction(b.helper) ? a(b.helper.apply(this.element[0], [d])) : b.helper == "clone" ? this.element.clone() : this.element;
            d.parents("body").length || d.appendTo(b.appendTo == "parent" ? this.element[0].parentNode: b.appendTo);
            d[0] != this.element[0] && !/(fixed|absolute)/.test(d.css("position")) && d.css("position", "absolute");
            return d
        },
        _adjustOffsetFromHelper: function(d) {
            if (typeof d == "string") d = d.split(" ");
            if (a.isArray(d)) d = {
                left: +d[0],
                top: +d[1] ||
                0
            };
            if ("left" in d) this.offset.click.left = d.left + this.margins.left;
            if ("right" in d) this.offset.click.left = this.helperProportions.width - d.right + this.margins.left;
            if ("top" in d) this.offset.click.top = d.top + this.margins.top;
            if ("bottom" in d) this.offset.click.top = this.helperProportions.height - d.bottom + this.margins.top
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var d = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0],
            this.offsetParent[0])) {
                d.left += this.scrollParent.scrollLeft();
                d.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie) d = {
                top: 0,
                left: 0
            };
            return {
                top: d.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: d.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var d = this.element.position();
                return {
                    top: d.top -
                    (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: d.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var d = this.options;
            if (d.containment ==
            "parent") d.containment = this.helper[0].parentNode;
            if (d.containment == "document" || d.containment == "window") this.containment = [(d.containment == "document" ? 0: a(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left, (d.containment == "document" ? 0: a(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top, (d.containment == "document" ? 0: a(window).scrollLeft()) + a(d.containment == "document" ? document: window).width() - this.helperProportions.width - this.margins.left, (d.containment == "document" ?
            0: a(window).scrollTop()) + (a(d.containment == "document" ? document: window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(d.containment) && d.containment.constructor != Array) {
                var b = a(d.containment)[0];
                if (b) {
                    d = a(d.containment).offset();
                    var c = a(b).css("overflow") != "hidden";
                    this.containment = [d.left + (parseInt(a(b).css("borderLeftWidth"), 10) || 0) + (parseInt(a(b).css("paddingLeft"), 10) || 0) - this.margins.left, d.top + (parseInt(a(b).css("borderTopWidth"),
                    10) || 0) + (parseInt(a(b).css("paddingTop"), 10) || 0) - this.margins.top, d.left + (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(a(b).css("borderLeftWidth"), 10) || 0) - (parseInt(a(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, d.top + (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(a(b).css("borderTopWidth"), 10) || 0) - (parseInt(a(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
                }
            } else if (d.containment.constructor ==
            Array) this.containment = d.containment
        },
        _convertPositionTo: function(d, b) {
            if (!b) b = this.position;
            d = d == "absolute" ? 1: -1;
            var c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent: this.scrollParent,
            e = /(html|body)/i.test(c[0].tagName);
            return {
                top: b.top + this.offset.relative.top * d + this.offset.parent.top * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() :
                e ? 0: c.scrollTop()) * d),
                left: b.left + this.offset.relative.left * d + this.offset.parent.left * d - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0: c.scrollLeft()) * d)
            }
        },
        _generatePosition: function(d) {
            var b = this.options,
            c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent: this.scrollParent,
            e = /(html|body)/i.test(c[0].tagName),
            f = d.pageX,
            g = d.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (d.pageX - this.offset.click.left < this.containment[0]) f = this.containment[0] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top < this.containment[1]) g = this.containment[1] + this.offset.click.top;
                    if (d.pageX - this.offset.click.left > this.containment[2]) f = this.containment[2] + this.offset.click.left;
                    if (d.pageY - this.offset.click.top > this.containment[3]) g = this.containment[3] + this.offset.click.top
                }
                if (b.grid) {
                    g = this.originalPageY + Math.round((g - this.originalPageY) /
                    b.grid[1]) * b.grid[1];
                    g = this.containment ? !(g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3]) ? g: !(g - this.offset.click.top < this.containment[1]) ? g - b.grid[1] : g + b.grid[1] : g;
                    f = this.originalPageX + Math.round((f - this.originalPageX) / b.grid[0]) * b.grid[0];
                    f = this.containment ? !(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f: !(f - this.offset.click.left < this.containment[0]) ? f - b.grid[0] : f + b.grid[0] : f
                }
            }
            return {
                top: g - this.offset.click.top -
                this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0: c.scrollTop()),
                left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0: c.scrollLeft())
            }
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] !=
            this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        },
        _trigger: function(d, b, c) {
            c = c || this._uiHash();
            a.ui.plugin.call(this, d, [b, c]);
            if (d == "drag") this.positionAbs = this._convertPositionTo("absolute");
            return a.Widget.prototype._trigger.call(this, d, b, c)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    a.extend(a.ui.draggable, {
        version: "1.8.10"
    });
    a.ui.plugin.add("draggable",
    "connectToSortable", {
        start: function(d, b) {
            var c = a(this).data("draggable"),
            e = c.options,
            f = a.extend({},
            b, {
                item: c.element
            });
            c.sortables = [];
            a(e.connectToSortable).each(function() {
                var g = a.data(this, "sortable");
                if (g && !g.options.disabled) {
                    c.sortables.push({
                        instance: g,
                        shouldRevert: g.options.revert
                    });
                    g._refreshItems();
                    g._trigger("activate", d, f)
                }
            })
        },
        stop: function(d, b) {
            var c = a(this).data("draggable"),
            e = a.extend({},
            b, {
                item: c.element
            });
            a.each(c.sortables,
            function() {
                if (this.instance.isOver) {
                    this.instance.isOver =
                    0;
                    c.cancelHelperRemoval = true;
                    this.instance.cancelHelperRemoval = false;
                    if (this.shouldRevert) this.instance.options.revert = true;
                    this.instance._mouseStop(d);
                    this.instance.options.helper = this.instance.options._helper;
                    c.options.helper == "original" && this.instance.currentItem.css({
                        top: "auto",
                        left: "auto"
                    })
                } else {
                    this.instance.cancelHelperRemoval = false;
                    this.instance._trigger("deactivate", d, e)
                }
            })
        },
        drag: function(d, b) {
            var c = a(this).data("draggable"),
            e = this;
            a.each(c.sortables,
            function() {
                this.instance.positionAbs =
                c.positionAbs;
                this.instance.helperProportions = c.helperProportions;
                this.instance.offset.click = c.offset.click;
                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    if (!this.instance.isOver) {
                        this.instance.isOver = 1;
                        this.instance.currentItem = a(e).clone().appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper;
                        this.instance.options.helper = function() {
                            return b.helper[0]
                        };
                        d.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(d,
                        true);
                        this.instance._mouseStart(d, true, true);
                        this.instance.offset.click.top = c.offset.click.top;
                        this.instance.offset.click.left = c.offset.click.left;
                        this.instance.offset.parent.left -= c.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= c.offset.parent.top - this.instance.offset.parent.top;
                        c._trigger("toSortable", d);
                        c.dropped = this.instance.element;
                        c.currentItem = c.element;
                        this.instance.fromOutside = c
                    }
                    this.instance.currentItem && this.instance._mouseDrag(d)
                } else if (this.instance.isOver) {
                    this.instance.isOver =
                    0;
                    this.instance.cancelHelperRemoval = true;
                    this.instance.options.revert = false;
                    this.instance._trigger("out", d, this.instance._uiHash(this.instance));
                    this.instance._mouseStop(d, true);
                    this.instance.options.helper = this.instance.options._helper;
                    this.instance.currentItem.remove();
                    this.instance.placeholder && this.instance.placeholder.remove();
                    c._trigger("fromSortable", d);
                    c.dropped = false
                }
            })
        }
    });
    a.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var d = a("body"),
            b = a(this).data("draggable").options;
            if (d.css("cursor")) b._cursor =
            d.css("cursor");
            d.css("cursor", b.cursor)
        },
        stop: function() {
            var d = a(this).data("draggable").options;
            d._cursor && a("body").css("cursor", d._cursor)
        }
    });
    a.ui.plugin.add("draggable", "iframeFix", {
        start: function() {
            var d = a(this).data("draggable").options;
            a(d.iframeFix === true ? "iframe": d.iframeFix).each(function() {
                a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1000
                }).css(a(this).offset()).appendTo("body")
            })
        },
        stop: function() {
            a("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            })
        }
    });
    a.ui.plugin.add("draggable", "opacity", {
        start: function(d, b) {
            d = a(b.helper);
            b = a(this).data("draggable").options;
            if (d.css("opacity")) b._opacity = d.css("opacity");
            d.css("opacity", b.opacity)
        },
        stop: function(d, b) {
            d = a(this).data("draggable").options;
            d._opacity && a(b.helper).css("opacity", d._opacity)
        }
    });
    a.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var d = a(this).data("draggable");
            if (d.scrollParent[0] !=
            document && d.scrollParent[0].tagName != "HTML") d.overflowOffset = d.scrollParent.offset()
        },
        drag: function(d) {
            var b = a(this).data("draggable"),
            c = b.options,
            e = false;
            if (b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML") {
                if (!c.axis || c.axis != "x") if (b.overflowOffset.top + b.scrollParent[0].offsetHeight - d.pageY < c.scrollSensitivity) b.scrollParent[0].scrollTop = e = b.scrollParent[0].scrollTop + c.scrollSpeed;
                else if (d.pageY - b.overflowOffset.top < c.scrollSensitivity) b.scrollParent[0].scrollTop = e = b.scrollParent[0].scrollTop -
                c.scrollSpeed;
                if (!c.axis || c.axis != "y") if (b.overflowOffset.left + b.scrollParent[0].offsetWidth - d.pageX < c.scrollSensitivity) b.scrollParent[0].scrollLeft = e = b.scrollParent[0].scrollLeft + c.scrollSpeed;
                else if (d.pageX - b.overflowOffset.left < c.scrollSensitivity) b.scrollParent[0].scrollLeft = e = b.scrollParent[0].scrollLeft - c.scrollSpeed
            } else {
                if (!c.axis || c.axis != "x") if (d.pageY - a(document).scrollTop() < c.scrollSensitivity) e = a(document).scrollTop(a(document).scrollTop() - c.scrollSpeed);
                else if (a(window).height() -
                (d.pageY - a(document).scrollTop()) < c.scrollSensitivity) e = a(document).scrollTop(a(document).scrollTop() + c.scrollSpeed);
                if (!c.axis || c.axis != "y") if (d.pageX - a(document).scrollLeft() < c.scrollSensitivity) e = a(document).scrollLeft(a(document).scrollLeft() - c.scrollSpeed);
                else if (a(window).width() - (d.pageX - a(document).scrollLeft()) < c.scrollSensitivity) e = a(document).scrollLeft(a(document).scrollLeft() + c.scrollSpeed)
            }
            e !== false && a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(b, d)
        }
    });
    a.ui.plugin.add("draggable",
    "snap", {
        start: function() {
            var d = a(this).data("draggable"),
            b = d.options;
            d.snapElements = [];
            a(b.snap.constructor != String ? b.snap.items || ":data(draggable)": b.snap).each(function() {
                var c = a(this),
                e = c.offset();
                this != d.element[0] && d.snapElements.push({
                    item: this,
                    width: c.outerWidth(),
                    height: c.outerHeight(),
                    top: e.top,
                    left: e.left
                })
            })
        },
        drag: function(d, b) {
            for (var c = a(this).data("draggable"), e = c.options, f = e.snapTolerance, g = b.offset.left, h = g + c.helperProportions.width, j = b.offset.top, l = j + c.helperProportions.height, k =
            c.snapElements.length - 1; k >= 0; k--) {
                var m = c.snapElements[k].left,
                n = m + c.snapElements[k].width,
                q = c.snapElements[k].top,
                s = q + c.snapElements[k].height;
                if (m - f < g && g < n + f && q - f < j && j < s + f || m - f < g && g < n + f && q - f < l && l < s + f || m - f < h && h < n + f && q - f < j && j < s + f || m - f < h && h < n + f && q - f < l && l < s + f) {
                    if (e.snapMode != "inner") {
                        var w = Math.abs(q - l) <= f,
                        t = Math.abs(s - j) <= f,
                        o = Math.abs(m - h) <= f,
                        p = Math.abs(n - g) <= f;
                        if (w) b.position.top = c._convertPositionTo("relative", {
                            top: q - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (t) b.position.top = c._convertPositionTo("relative",
                        {
                            top: s,
                            left: 0
                        }).top - c.margins.top;
                        if (o) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: m - c.helperProportions.width
                        }).left - c.margins.left;
                        if (p) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: n
                        }).left - c.margins.left
                    }
                    var r = w || t || o || p;
                    if (e.snapMode != "outer") {
                        w = Math.abs(q - j) <= f;
                        t = Math.abs(s - l) <= f;
                        o = Math.abs(m - g) <= f;
                        p = Math.abs(n - h) <= f;
                        if (w) b.position.top = c._convertPositionTo("relative", {
                            top: q,
                            left: 0
                        }).top - c.margins.top;
                        if (t) b.position.top = c._convertPositionTo("relative", {
                            top: s - c.helperProportions.height,
                            left: 0
                        }).top - c.margins.top;
                        if (o) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: m
                        }).left - c.margins.left;
                        if (p) b.position.left = c._convertPositionTo("relative", {
                            top: 0,
                            left: n - c.helperProportions.width
                        }).left - c.margins.left
                    }
                    if (!c.snapElements[k].snapping && (w || t || o || p || r)) c.options.snap.snap && c.options.snap.snap.call(c.element, d, a.extend(c._uiHash(), {
                        snapItem: c.snapElements[k].item
                    }));
                    c.snapElements[k].snapping = w || t || o || p || r
                } else {
                    c.snapElements[k].snapping && c.options.snap.release && c.options.snap.release.call(c.element,
                    d, a.extend(c._uiHash(), {
                        snapItem: c.snapElements[k].item
                    }));
                    c.snapElements[k].snapping = false
                }
            }
        }
    });
    a.ui.plugin.add("draggable", "stack", {
        start: function() {
            var d = a(this).data("draggable").options;
            d = a.makeArray(a(d.stack)).sort(function(c, e) {
                return (parseInt(a(c).css("zIndex"), 10) || 0) - (parseInt(a(e).css("zIndex"), 10) || 0)
            });
            if (d.length) {
                var b = parseInt(d[0].style.zIndex) || 0;
                a(d).each(function(c) {
                    this.style.zIndex = b + c
                });
                this[0].style.zIndex = b + d.length
            }
        }
    });
    a.ui.plugin.add("draggable", "zIndex", {
        start: function(d,
        b) {
            d = a(b.helper);
            b = a(this).data("draggable").options;
            if (d.css("zIndex")) b._zIndex = d.css("zIndex");
            d.css("zIndex", b.zIndex)
        },
        stop: function(d, b) {
            d = a(this).data("draggable").options;
            d._zIndex && a(b.helper).css("zIndex", d._zIndex)
        }
    })
})(jQuery);
 (function(a) {
    a.widget("ui.droppable", {
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function() {
            var d = this.options,
            b = d.accept;
            this.isover = 0;
            this.isout = 1;
            this.accept = a.isFunction(b) ? b: function(c) {
                return c.is(b)
            };
            this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            };
            a.ui.ddmanager.droppables[d.scope] = a.ui.ddmanager.droppables[d.scope] || [];
            a.ui.ddmanager.droppables[d.scope].push(this);
            d.addClasses && this.element.addClass("ui-droppable")
        },
        destroy: function() {
            for (var d = a.ui.ddmanager.droppables[this.options.scope], b = 0; b < d.length; b++) d[b] == this && d.splice(b, 1);
            this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
            return this
        },
        _setOption: function(d, b) {
            if (d == "accept") this.accept = a.isFunction(b) ? b: function(c) {
                return c.is(b)
            };
            a.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function(d) {
            var b = a.ui.ddmanager.current;
            this.options.activeClass &&
            this.element.addClass(this.options.activeClass);
            b && this._trigger("activate", d, this.ui(b))
        },
        _deactivate: function(d) {
            var b = a.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            b && this._trigger("deactivate", d, this.ui(b))
        },
        _over: function(d) {
            var b = a.ui.ddmanager.current;
            if (! (!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.addClass(this.options.hoverClass);
                this._trigger("over", d, this.ui(b))
            }
        },
        _out: function(d) {
            var b = a.ui.ddmanager.current;
            if (! (!b || (b.currentItem || b.element)[0] == this.element[0])) if (this.accept.call(this.element[0], b.currentItem || b.element)) {
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("out", d, this.ui(b))
            }
        },
        _drop: function(d, b) {
            var c = b || a.ui.ddmanager.current;
            if (!c || (c.currentItem || c.element)[0] == this.element[0]) return false;
            var e = false;
            this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
                var f =
                a.data(this, "droppable");
                if (f.options.greedy && !f.options.disabled && f.options.scope == c.options.scope && f.accept.call(f.element[0], c.currentItem || c.element) && a.ui.intersect(c, a.extend(f, {
                    offset: f.element.offset()
                }), f.options.tolerance)) {
                    e = true;
                    return false
                }
            });
            if (e) return false;
            if (this.accept.call(this.element[0], c.currentItem || c.element)) {
                this.options.activeClass && this.element.removeClass(this.options.activeClass);
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("drop",
                d, this.ui(c));
                return this.element
            }
            return false
        },
        ui: function(d) {
            return {
                draggable: d.currentItem || d.element,
                helper: d.helper,
                position: d.position,
                offset: d.positionAbs
            }
        }
    });
    a.extend(a.ui.droppable, {
        version: "1.8.10"
    });
    a.ui.intersect = function(d, b, c) {
        if (!b.offset) return false;
        var e = (d.positionAbs || d.position.absolute).left,
        f = e + d.helperProportions.width,
        g = (d.positionAbs || d.position.absolute).top,
        h = g + d.helperProportions.height,
        j = b.offset.left,
        l = j + b.proportions.width,
        k = b.offset.top,
        m = k + b.proportions.height;
        switch (c) {
        case "fit":
            return j <=
            e && f <= l && k <= g && h <= m;
        case "intersect":
            return j < e + d.helperProportions.width / 2 && f - d.helperProportions.width / 2 < l && k < g + d.helperProportions.height / 2 && h - d.helperProportions.height / 2 < m;
        case "pointer":
            return a.ui.isOver((d.positionAbs || d.position.absolute).top + (d.clickOffset || d.offset.click).top, (d.positionAbs || d.position.absolute).left + (d.clickOffset || d.offset.click).left, k, j, b.proportions.height, b.proportions.width);
        case "touch":
            return (g >= k && g <= m || h >= k && h <= m || g < k && h > m) && (e >= j && e <= l || f >= j && f <= l || e < j && f > l);
        default:
            return false
        }
    };
    a.ui.ddmanager = {
        current: null,
        droppables: {
            "default": []
        },
        prepareOffsets: function(d, b) {
            var c = a.ui.ddmanager.droppables[d.options.scope] || [],
            e = b ? b.type: null,
            f = (d.currentItem || d.element).find(":data(droppable)").andSelf(),
            g = 0;
            a: for (; g < c.length; g++) if (! (c[g].options.disabled || d && !c[g].accept.call(c[g].element[0], d.currentItem || d.element))) {
                for (var h = 0; h < f.length; h++) if (f[h] == c[g].element[0]) {
                    c[g].proportions.height = 0;
                    continue a
                }
                c[g].visible = c[g].element.css("display") != "none";
                if (c[g].visible) {
                    c[g].offset =
                    c[g].element.offset();
                    c[g].proportions = {
                        width: c[g].element[0].offsetWidth,
                        height: c[g].element[0].offsetHeight
                    };
                    e == "mousedown" && c[g]._activate.call(c[g], b)
                }
            }
        },
        drop: function(d, b) {
            var c = false;
            a.each(a.ui.ddmanager.droppables[d.options.scope] || [],
            function() {
                if (this.options) {
                    if (!this.options.disabled && this.visible && a.ui.intersect(d, this, this.options.tolerance)) c = c || this._drop.call(this, b);
                    if (!this.options.disabled && this.visible && this.accept.call(this.element[0], d.currentItem || d.element)) {
                        this.isout = 1;
                        this.isover = 0;
                        this._deactivate.call(this, b)
                    }
                }
            });
            return c
        },
        drag: function(d, b) {
            d.options.refreshPositions && a.ui.ddmanager.prepareOffsets(d, b);
            a.each(a.ui.ddmanager.droppables[d.options.scope] || [],
            function() {
                if (! (this.options.disabled || this.greedyChild || !this.visible)) {
                    var c = a.ui.intersect(d, this, this.options.tolerance);
                    if (c = !c && this.isover == 1 ? "isout": c && this.isover == 0 ? "isover": null) {
                        var e;
                        if (this.options.greedy) {
                            var f = this.element.parents(":data(droppable):eq(0)");
                            if (f.length) {
                                e = a.data(f[0], "droppable");
                                e.greedyChild = c == "isover" ? 1: 0
                            }
                        }
                        if (e && c == "isover") {
                            e.isover = 0;
                            e.isout = 1;
                            e._out.call(e, b)
                        }
                        this[c] = 1;
                        this[c == "isout" ? "isover": "isout"] = 0;
                        this[c == "isover" ? "_over": "_out"].call(this, b);
                        if (e && c == "isout") {
                            e.isout = 0;
                            e.isover = 1;
                            e._over.call(e, b)
                        }
                    }
                }
            })
        }
    }
})(jQuery); (function(a) {
    a.fn.enticeToAction = function(d) {
        var b = a.extend({},
        a.fn.enticeToAction.defaults, d);
        return this.each(function() {
            var c = a(this);
            c.addClass("entice");
            c.attr("title", b.title);
            switch (b.direction) {
            case "downwards":
                var e = "n";
            case "upwards":
                e = "s";
            case "rightwards":
                e = "w";
            case "leftwards":
                e = "e"
            }
            c.tipsy({
                gravity: e
            });
            this.onclick = function() {
                return false
            }
        })
    };
    a.fn.enticeToAction.defaults = {
        title: "You must be logged in to use this feature",
        direction: "downwards"
    }
})(jQuery); (function(a) {
    a.fn.errorify = function(d, b) {
        a.extend({},
        a.fn.errorify.defaults, b);
        return this.each(function() {
            var c = a(this);
            c.addClass("error");
            c.find("p.note").hide();
            c.find("dd.error").remove();
            var e = a("<dd>").addClass("error").text(d);
            c.append(e)
        })
    };
    a.fn.errorify.defaults = {};
    a.fn.unErrorify = function(d) {
        a.extend({},
        a.fn.unErrorify.defaults, d);
        return this.each(function() {
            var b = a(this);
            b.removeClass("error");
            b.find("p.note").show();
            b.find("dd.error").remove()
        })
    };
    a.fn.unErrorify.defaults = {}
})(jQuery); (function(a) {
    a.fn.redirector = function(d) {
        var b = a.extend({},
        a.fn.redirector.defaults, d);
        this.length != 0 && a.smartPoller(b.time,
        function(c) {
            a.getJSON(b.url,
            function(e) {
                if (e) c();
                else window.location = b.to
            })
        })
    };
    a.fn.redirector.defaults = {
        time: 100,
        url: null,
        to: "/"
    }
})(jQuery); (function(a) {
    a.fn.repoInlineEdit = function(d) {
        var b = a.extend({},
        a.fn.repoInlineEdit.defaults, d);
        return this.each(function() {
            var c = a(this),
            e = a("#" + c.attr("rel"));
            function f() {
                if (a.trim(c.text()) == "") b.is_owner ? c.html(a("#pl-" + b.name).html()) : c.remove();
                else b.is_owner && c.find("p:last-child").append(' <em class="placeholder edit-text">click to edit</em>')
            }
            f();
            if (b.is_owner) {
                c.addClass("editable-text");
                c.click(function(g) {
                    if (!a(g.target).is("a")) {
                        c.hide();
                        e.show().find("input").focus()
                    }
                });
                e.find(".cancel").click(function() {
                    c.show();
                    e.hide();
                    return false
                });
                e.find("form").submit(function() {
                    a.fn.repoInlineEdit.load();
                    e.css({
                        opacity: 0.4
                    });
                    var g = a(this),
                    h = g.serialize();
                    a.post(g.attr("action"), h,
                    function(j, l) {
                        if (l == "success") {
                            if (b.name == "homepage") {
                                l = j.match(/^https?:/) ? j: "http://" + j;
                                c.html(a('<a rel="nofollow"/>').attr("href", l).text(j))
                            } else c.html(a.simpleFormat(j));
                            f();
                            e.hide();
                            c.show();
                            a.fn.repoInlineEdit.endLoad()
                        }
                        e.css({
                            opacity: 1
                        })
                    });
                    return false
                })
            }
        })
    };
    a.fn.repoInlineEdit.defaults = {
        is_owner: false,
        name: "description"
    };
    a.fn.repoInlineEdit.load =
    function() {
        a("#repo_details_loader").show()
    };
    a.fn.repoInlineEdit.endLoad = function() {
        a("#repo_details_loader").hide()
    };
    a.simpleFormat = function(d) {
        d = a("<div>").text(d).html();
        d = d.replace(/\r\n?/, "\n");
        d = d.replace(/\n\n+/, "</p>\n\n<p>");
        d = d.replace(/([^\n]\n)(?=[^\n])/, "<br />");
        return "<p>" + d + "</p>"
    }
})(jQuery); (function(a) {
    a.fn.repoList = function(d) {
        var b = a.extend({},
        a.fn.repoList.defaults, d);
        return this.each(function() {
            var c = a(this),
            e = c.find(".repo_list"),
            f = c.find(".show-more"),
            g = c.find(".filter_input").val(""),
            h = g.val(),
            j = f.length == 0 ? true: false,
            l = null,
            k = false;
            g[0] && typeof g[0].onsearch == "object" && g.addClass("native");
            f.click(function() {
                if (k) return false;
                var s = f.spin();
                k = true;
                a(b.selector).load(b.ajaxUrl,
                function() {
                    j = true;
                    s.parents(".repos").find(".filter_selected").click();
                    s.stopSpin()
                });
                s.hide();
                return false
            });
            function m() {
                var s = e.find("li");
                if (l) {
                    s.hide();
                    e.find("li." + l).show()
                } else s.show();
                g.val() != "" && s.filter(":not(:Contains('" + g.val() + "'))").hide()
            }
            c.find(".repo_filter").click(function() {
                var s = a(this);
                c.find(".repo_filterer a").removeClass("filter_selected");
                s.addClass("filter_selected");
                l = s.attr("rel");
                j ? m() : f.click();
                return false
            });
            var n = "placeholder" in document.createElement("input");
            function q() {
                n || (g.val() == "" ? g.addClass("placeholder") : g.removeClass("placeholder"))
            }
            g.bind("keyup blur click",
            function() {
                if (this.value != h) {
                    h = this.value;
                    j ? m() : f.click();
                    q()
                }
            });
            q()
        })
    };
    a.fn.repoList.defaults = {
        selector: "#repo_listing",
        ajaxUrl: "/dashboard/ajax_your_repos"
    }
})(jQuery);
$.fn.selectableList = function(a, d) {
    return $(this).each(function() {
        var b = $(this),
        c = $.extend({
            toggleClassName: "selected",
            wrapperSelector: "a",
            mutuallyExclusive: false,
            itemParentSelector: "li",
            enableShiftSelect: false,
            ignoreLinks: false
        },
        d);
        b.delegate(a + " " + c.itemParentSelector + " " + c.wrapperSelector, "click",
        function(e) {
            if (e.which > 1 || e.metaKey || c.ignoreLinks && $(e.target).closest("a").length) return true;
            var f = $(this),
            g = f.find(":checkbox, :radio"),
            h = b.find(a + " ." + c.toggleClassName),
            j = b.find(a + " *[data-last]");
            if (!f.is(":checkbox, :radio") && e.target != g[0]) g.attr("checked") && !g.is(":radio") ? g.attr("checked", false) : g.attr("checked", true);
            c.mutuallyExclusive && h.removeClass(c.toggleClassName);
            f.toggleClass(c.toggleClassName);
            g.change();
            if (c.enableShiftSelect && e.shiftKey && h.length > 0) if (j.length > 0) {
                e = j.offset().top;
                g = f.offset().top;
                h = "#" + f.attr("id");
                var l = $,
                k = $,
                m = $;
                if (e > g) l = j.prevUntil(h);
                else if (e < g) l = j.nextUntil(h);
                k = l.find(":checkbox");
                m = l.find(":checked");
                if (m.length == k.length) {
                    l.removeClass(c.toggleClassName);
                    k.attr("checked", false)
                } else {
                    l.addClass(c.toggleClassName);
                    k.attr("checked", true)
                }
            }
            j.removeAttr("data-last");
            f.attr("data-last", true)
        });
        b.delegate(a + " li :checkbox," + a + " li :radio", "change",
        function() {
            var e = $(this);
            e = e.closest(c.wrapperSelector);
            c.mutuallyExclusive && b.find(a + " ." + c.toggleClassName).removeClass(c.toggleClassName);
            $(this).attr("checked") ? e.addClass(c.toggleClassName) : e.removeClass(c.toggleClassName)
        });
        return b.find(a)
    })
};
$.fn.sortableHeader = function(a, d) {
    return $(this).each(function() {
        var b = $(this),
        c = $.extend({
            itemSelector: "li",
            ascendingClass: "asc",
            descendingClass: "desc"
        },
        d);
        b.delegate(a + " " + c.itemSelector, "click",
        function(e) {
            e.preventDefault();
            e = $(this);
            if (e.hasClass(c.ascendingClass)) {
                e.removeClass(c.ascendingClass);
                e.addClass(c.descendingClass)
            } else if (e.hasClass(c.descendingClass)) {
                e.removeClass(c.descendingClass);
                e.addClass(c.ascendingClass)
            } else {
                e.parent().find("." + c.ascendingClass + ", ." + c.descendingClass).removeClass(c.ascendingClass +
                " " + c.descendingClass);
                e.addClass(c.descendingClass)
            }
        })
    })
}; (function(a) {
    a.fn.hardTabs = function(d) {
        var b = a.extend({},
        a.fn.hardTabs.defaults, d);
        if (a(this).hasClass("js-large-data-tabs")) b.optimizeLargeContents = true;
        function c(f) {
            if (b.optimizeLargeContents) {
                if (f[0] == null) return a();
                f.is(":visible") && !f[0].style.width && f.css({
                    width: f.width() + "px"
                });
                return f.css({
                    position: "absolute",
                    left: "-9999px"
                })
            } else return f.hide()
        }
        function e(f) {
            if (b.optimizeLargeContents) {
                if (f[0] == null) return a();
                f.is(":visible") || f.show();
                return f.css({
                    position: "",
                    left: ""
                })
            } else return f.show()
        }
        return this.each(function() {
            var f = a(this),
            g = a(),
            h = a();
            f.find("a.selected").length == 0 && a(f.find("a")[0]).addClass("selected");
            f.find("a").each(function() {
                var j = a(this),
                l = a.fn.hardTabs.findLastPathSegment(j.attr("href")),
                k = j.attr("data-container-id") ? j.attr("data-container-id") : l,
                m = a("#" + k);
                c(m);
                function n(q) {
                    if (q.which == 2 || q.metaKey) return true;
                    m = a("#" + k);
                    if (m.length == 0) return true;
                    c(h);
                    g.removeClass("selected");
                    h = e(m);
                    g = j.addClass("selected");
                    "replaceState" in window.history && q != "stop-url-change" &&
                    window.history.replaceState(null, document.title, j.attr("href"));
                    f.trigger("tabChanged", {
                        link: j
                    });
                    return false
                }
                j.click(n);
                a('.js-secondary-hard-link[href="' + j.attr("href") + '"]').click(n);
                j.hasClass("selected") && n("stop-url-change")
            })
        })
    };
    a.fn.hardTabs.defaults = {
        optimizeLargeContents: false
    };
    a.fn.hardTabs.findLastPathSegment = function(d) {
        if (d == null) d = document.location.pathname;
        d = d.replace(/\?.+|#.+/, "");
        d = d.match(/[^\/]+\/?$/);
        d.length == 0 && alert("Invalid tab link!");
        return d[0].replace("/", "")
    }
})(jQuery); (function(a) {
    a.fn.editable = function(d, b) {
        var c = {
            target: d,
            name: "value",
            id: "id",
            type: "text",
            width: "auto",
            height: "auto",
            event: "click",
            onblur: "cancel",
            loadtype: "GET",
            loadtext: "Loading...",
            placeholder: "Click to edit",
            submittype: "post",
            loaddata: {},
            submitdata: {}
        };
        b && a.extend(c, b);
        var e = a.editable.types[c.type].plugin ||
        function() {},
        f = a.editable.types[c.type].submit ||
        function() {},
        g = a.editable.types[c.type].buttons || a.editable.types.defaults.buttons,
        h = a.editable.types[c.type].content || a.editable.types.defaults.content,
        j = a.editable.types[c.type].element || a.editable.types.defaults.element,
        l = c.callback ||
        function() {};
        a.isFunction(a(this)[c.event]) || (a.fn[c.event] = function(k) {
            return k ? this.bind(c.event, k) : this.trigger(c.event)
        });
        a(this).attr("title", c.tooltip);
        c.autowidth = "auto" == c.width;
        c.autoheight = "auto" == c.height;
        return this.each(function() {
            a.trim(a(this).html()) || a(this).html(c.placeholder);
            a(this)[c.event](function() {
                var k = this;
                if (!k.editing) {
                    function m() {
                        a(k).html(k.revert);
                        k.editing = false;
                        a.trim(a(k).html()) ||
                        a(k).html(c.placeholder)
                    }
                    a(k).css("visibility", "hidden");
                    if (c.width != "none") c.width = c.autowidth ? a(k).width() : c.width;
                    if (c.height != "none") c.height = c.autoheight ? a(k).height() : c.height;
                    a(this).css("visibility", "");
                    a(this).html().toLowerCase().replace(/;/, "") == c.placeholder.toLowerCase().replace(/;/, "") && a(this).html("");
                    k.editing = true;
                    k.revert = a(k).html();
                    a(k).html("");
                    var n = a("<form/>");
                    if (c.cssclass)"inherit" == c.cssclass ? n.attr("class", a(k).attr("class")) : n.attr("class", c.cssclass);
                    if (c.style) if ("inherit" ==
                    c.style) {
                        n.attr("style", a(k).attr("style"));
                        n.css("display", a(k).css("display"))
                    } else n.attr("style", c.style);
                    var q = j.apply(n, [c, k]),
                    s;
                    if (c.loadurl) {
                        var w = setTimeout(function() {
                            q.disabled = true;
                            h.apply(n, [c.loadtext, c, k])
                        },
                        100),
                        t = {};
                        t[c.id] = k.id;
                        a.isFunction(c.loaddata) ? a.extend(t, c.loaddata.apply(k, [k.revert, c])) : a.extend(t, c.loaddata);
                        a.ajax({
                            type: c.loadtype,
                            url: c.loadurl,
                            data: t,
                            async: false,
                            success: function(o) {
                                window.clearTimeout(w);
                                s = o;
                                q.disabled = false
                            }
                        })
                    } else if (c.data) {
                        s = c.data;
                        if (a.isFunction(c.data)) s =
                        c.data.apply(k, [k.revert, c])
                    } else s = k.revert;
                    h.apply(n, [s, c, k]);
                    q.attr("name", c.name);
                    g.apply(n, [c, k]);
                    e.apply(n, [c, k]);
                    a(k).append(n);
                    a(":input:visible:enabled:first", n).focus();
                    c.select && q.select();
                    q.keydown(function(o) {
                        if (o.keyCode == 27) {
                            q.blur();
                            o.preventDefault();
                            m()
                        }
                    });
                    if ("cancel" == c.onblur) q.blur(function() {
                        w = setTimeout(m, 500)
                    });
                    else if ("submit" == c.onblur) q.blur(function() {
                        n.submit()
                    });
                    else a.isFunction(c.onblur) ? q.blur(function() {
                        c.onblur.apply(k, [q.val(), c])
                    }) : q.blur(function() {});
                    n.submit(function(o) {
                        w &&
                        clearTimeout(w);
                        o.preventDefault();
                        f.apply(n, [c, k]);
                        if (a.isFunction(c.target)) {
                            o = c.target.apply(k, [q.val(), c]);
                            a(k).html(o);
                            k.editing = false;
                            l.apply(k, [k.innerHTML, c]);
                            a.trim(a(k).html()) || a(k).html(c.placeholder)
                        } else {
                            o = {};
                            o[c.name] = q.val();
                            o[c.id] = k.id;
                            a.isFunction(c.submitdata) ? a.extend(o, c.submitdata.apply(k, [k.revert, c])) : a.extend(o, c.submitdata);
                            a(k).html(c.indicator);
                            a.ajax({
                                type: c.submittype,
                                url: c.target,
                                data: o,
                                success: function(p) {
                                    a(k).html(p);
                                    k.editing = false;
                                    l.apply(k, [k.innerHTML, c]);
                                    a.trim(a(k).html()) ||
                                    a(k).html(c.placeholder)
                                }
                            })
                        }
                        return false
                    });
                    a(k).bind("reset", m)
                }
            })
        })
    };
    a.editable = {
        types: {
            defaults: {
                element: function() {
                    var d = a('<input type="hidden">');
                    a(this).append(d);
                    return d
                },
                content: function(d) {
                    a(":input:first", this).val(d)
                },
                buttons: function(d, b) {
                    if (d.submit) {
                        var c = a('<input type="submit">');
                        c.val(d.submit);
                        a(this).append(c)
                    }
                    if (d.cancel) {
                        c = a('<input type="button">');
                        c.val(d.cancel);
                        a(this).append(c);
                        a(c).click(function() {
                            a(b).html(b.revert);
                            b.editing = false
                        })
                    }
                }
            },
            text: {
                element: function(d) {
                    var b =
                    a("<input>");
                    d.width != "none" && b.width(d.width);
                    d.height != "none" && b.height(d.height);
                    b.attr("autocomplete", "off");
                    a(this).append(b);
                    return b
                }
            },
            textarea: {
                element: function(d) {
                    var b = a("<textarea>");
                    d.rows ? b.attr("rows", d.rows) : b.height(d.height);
                    d.cols ? b.attr("cols", d.cols) : b.width(d.width);
                    a(this).append(b);
                    return b
                }
            },
            select: {
                element: function() {
                    var d = a("<select>");
                    a(this).append(d);
                    return d
                },
                content: function(d) {
                    if (String == d.constructor) {
                        eval("var json = " + d);
                        for (var b in json) if (json.hasOwnProperty(b)) if ("selected" !=
                        b) {
                            d = a("<option>").val(b).append(json[b]);
                            a("select", this).append(d)
                        }
                    }
                    a("select", this).children().each(function() {
                        a(this).val() == json.selected && a(this).attr("selected", "selected")
                    })
                }
            }
        },
        addInputType: function(d, b) {
            a.editable.types[d] = b
        }
    }
})(jQuery); (function(a) {
    a(".js-oneclick").live("click",
    function() {
        var d = a(this),
        b = d.attr("data-afterclick") || "Loading\u2026";
        if (d.attr("disabled")) return false;
        d.attr("disabled", "disabled");
        setTimeout(function() {
            d.find("span").length > 0 ? d.find("span").text(b) : d.text(b)
        },
        50);
        a(this).parents("form").submit();
        return true
    })
})(jQuery);
jQuery.fn.pjax = function(a, d) {
    var b = jQuery;
    if (d) d.container = a;
    else d = b.isPlainObject(a) ? a: {
        container: a
    };
    return this.live("click",
    function(c) {
        if (c.which == 2 || c.metaKey) return true;
        var e = {
            url: this.href,
            container: b(this).attr("data-pjax")
        };
        b.pjax(b.extend({},
        e, d));
        c.preventDefault()
    })
};
var lastPjax = null;
jQuery.pjax = function(a) {
    var d = jQuery,
    b = d(a.container),
    c = {
        timeout: 650,
        push: true,
        replace: false,
        type: "GET",
        dataType: "html",
        beforeSend: function(f) {
            b.trigger("start.pjax");
            f.setRequestHeader("X-PJAX", "true")
        },
        error: function() {
            window.location = a.url
        },
        complete: function() {
            b.trigger("end.pjax")
        },
        success: function(f) {
            if (!d.trim(f) || /<html/i.test(f)) return window.location = a.url;
            b.html(f);
            if (!d.pjax.active) {
                d.pjax.active = true;
                window.history.replaceState({
                    pjax: true
                },
                document.title, location.pathname)
            }
            var g = d.trim(b.find("title").remove().text());
            if (g) document.title = g;
            g = {
                pjax: typeof a.container == "object" ? a.container.selector: a.container,
                timeout: a.timeout
            };
            if (a.data) g.url = a.url + "?" + d.param(a.data);
            if (a.replace) window.history.replaceState(g, document.title, a.url);
            else a.push && window.history.pushState(g, document.title, a.url);
            if ((a.replace || a.push) && window._gaq) _gaq.push(["_trackPageview"]);
            e.apply(this, arguments)
        }
    },
    e = a.success || d.noop;
    delete a.success;
    a = d.extend(true, {},
    c, a);
    if (d.isFunction(a.url)) a.url = a.url.call();
    if (lastPjax && lastPjax.readyState <
    4) {
        lastPjax.onreadystatechange = d.noop;
        lastPjax.abort()
    }
    lastPjax = d.ajax(a);
    d(document).trigger("pjax", lastPjax, a);
    return lastPjax
};
jQuery.pjax.active = false;
jQuery.pjax.firstLoad = true;
if (jQuery.browser.webkit && parseInt(jQuery.browser.version) < 534) jQuery.pjax.firstLoad = false;
jQuery(window).bind("popstate",
function(a) {
    if (jQuery.pjax != jQuery.noop) {
        if (jQuery.pjax.firstLoad) return jQuery.pjax.firstLoad = false;
        a = a.state;
        if (jQuery.pjax.active || a && a.pjax) {
            var d = $(a.pjax + "");
            if (d.length) jQuery.pjax({
                url: a.url || location.href,
                container: d,
                push: false,
                timeout: a.timeout
            });
            else window.location = location.href
        }
    }
});
jQuery.event.props.push("state");
if (!window.history || !window.history.pushState) {
    jQuery.pjax = jQuery.noop;
    jQuery.fn.pjax = function() {
        return this
    }
};
function definePrimer(a) {
    function d(b, c, e, f) {
        this.container = b;
        this.width = c;
        this.height = e;
        this.primer = this;
        this.useGlobalMouseMove = f;
        this.actions = [];
        this.init();
        this.autoDraw = true
    }
    d.prototype = {
        init: function() {
            a("html head").append("<style>.primer_text { position: absolute; margin: 0; padding: 0; line-height: normal; z-index: 0;}</style>");
            var b = a(this.container).eq(0);
            b.append('<div id="primer_text"></div>');
            var c = a("#primer_text", b).eq(0);
            c.css("position", "relative");
            this.element = c;
            c = document.createElement("canvas");
            c.width = this.width;
            c.height = this.height;
            c.style.zIndex = "0";
            if (c.getContext) b.append(c);
            else window.G_vmlCanvasManager && window.G_vmlCanvasManager.initElement(a(c).appendTo(b).get(0));
            b = a("canvas", b);
            var e = b[0];
            this.context = e.getContext("2d");
            this.root = new d.Layer;
            this.root.bind(this);
            this.setupExt();
            var f = this;
            this.useGlobalMouseMove ? a("body").bind("mousemove",
            function(g) {
                if (a(g.target).parents().find(this.container)) {
                    var h = a(e);
                    h = h.offset();
                    g.localX = g.pageX - h.left;
                    g.localY = g.pageY - h.top;
                    f.ghost(g)
                } else f.outOfBounds()
            }) :
            b.eq(0).bind("mousemove",
            function(g) {
                var h = a(g.currentTarget).offset();
                g.localX = g.pageX - h.left;
                g.localY = g.pageY - h.top;
                f.ghost(g)
            })
        },
        getX: function() {
            return 0
        },
        getY: function() {
            return 0
        },
        getGlobalX: function() {
            return 0
        },
        getGlobalY: function() {
            return 0
        },
        addChild: function(b) {
            b.bind(this);
            this.root.addChild(b);
            this.draw()
        },
        removeChild: function(b) {
            this.root.removeChild(b);
            this.draw()
        },
        draw: function(b) {
            if (b || this.autoDraw) {
                this.context.clearRect(0, 0, this.width, this.height);
                a(".primer_text", this.element).remove();
                this.setupExt();
                this.root.draw()
            }
        },
        ghost: function(b) {
            this.root.ghost(b);
            for (var c in this.actions) {
                b = this.actions[c];
                b[0](b[1])
            }
            this.actions = []
        },
        outOfBounds: function() {},
        setupExt: function() {
            this.context.ext = {
                textAlign: "left",
                font: "10px sans-serif"
            }
        }
    };
    d.Layer = function() {
        this.element = this.context = this.primer = null;
        this.children = [];
        this.calls = [];
        this.yVal = this.xVal = 0;
        this.visibleVal = true;
        this.mouseoverVal = function() {};
        this.mouseoutVal = function() {};
        this.mouseWithin = false
    };
    d.Layer.prototype = {
        bind: function(b) {
            this.parent =
            b;
            this.primer = b.primer;
            this.context = this.primer.context;
            this.element = this.primer.element;
            for (var c in this.children) this.children[c].bind(this)
        },
        getX: function() {
            return this.xVal
        },
        setX: function(b) {
            this.xVal = b;
            this.primer && this.primer.draw()
        },
        getY: function() {
            return this.yVal
        },
        setY: function(b) {
            this.yVal = b;
            this.primer && this.primer.draw()
        },
        getGlobalX: function() {
            return this.getX() + this.parent.getGlobalX()
        },
        getGlobalY: function() {
            return this.getY() + this.parent.getGlobalY()
        },
        getVisible: function() {
            return this.visibleVal
        },
        setVisible: function(b) {
            this.visibleVal = b;
            this.primer && this.primer.draw()
        },
        addChild: function(b) {
            b.bind(this);
            this.children.push(b);
            this.primer && this.primer.draw()
        },
        removeChild: function(b) {
            for (var c = [], e = 0; e < this.children.length; e++) {
                var f = this.children[e];
                f != b && c.push(f)
            }
            this.children = c
        },
        mouseover: function(b) {
            this.mouseoverVal = b
        },
        mouseout: function(b) {
            this.mouseoutVal = b
        },
        setFillStyle: function(b) {
            this.calls.push(["fillStyle", b])
        },
        setStrokeStyle: function(b) {
            this.calls.push(["strokeStyle", b])
        },
        setLineWidth: function(b) {
            this.calls.push(["lineWidth",
            b])
        },
        beginPath: function() {
            this.calls.push(["beginPath"])
        },
        moveTo: function(b, c) {
            this.calls.push(["moveTo", b, c])
        },
        lineTo: function(b, c) {
            this.calls.push(["lineTo", b, c])
        },
        quadraticCurveTo: function(b, c, e, f) {
            this.calls.push(["quadraticCurveTo", b, c, e, f])
        },
        arc: function(b, c, e, f, g, h) {
            this.calls.push(["arc", b, c, e, f, g, h])
        },
        fill: function() {
            this.calls.push(["fill"])
        },
        stroke: function() {
            this.calls.push(["stroke"])
        },
        fillRect: function(b, c, e, f) {
            this.calls.push(["fillRect", b, c, e, f])
        },
        fillText: function(b, c, e, f, g) {
            this.calls.push(["fillText",
            b, c, e, f, g])
        },
        setTextAlign: function(b) {
            this.calls.push(["textAlign", b])
        },
        setFont: function(b) {
            this.calls.push(["font", b])
        },
        rect: function(b, c, e, f) {
            this.beginPath();
            this.moveTo(b, c);
            this.lineTo(b + e, c);
            this.lineTo(b + e, c + f);
            this.lineTo(b, c + f);
            this.lineTo(b, c)
        },
        roundedRect: function(b, c, e, f, g) {
            this.beginPath();
            this.moveTo(b, c + g);
            this.lineTo(b, c + f - g);
            this.quadraticCurveTo(b, c + f, b + g, c + f);
            this.lineTo(b + e - g, c + f);
            this.quadraticCurveTo(b + e, c + f, b + e, c + f - g);
            this.lineTo(b + e, c + g);
            this.quadraticCurveTo(b + e, c, b + e - g, c);
            this.lineTo(b + g, c);
            this.quadraticCurveTo(b, c, b, c + g)
        },
        fillRoundedRect: function(b, c, e, f, g) {
            this.roundedRect(b, c, e, f, g);
            this.fill()
        },
        draw: function() {
            if (this.getVisible()) {
                this.context.save();
                this.context.translate(this.getX(), this.getY());
                for (var b in this.calls) {
                    var c = this.calls[b];
                    switch (c[0]) {
                    case "strokeStyle":
                        this.context.strokeStyle = c[1];
                        break;
                    case "lineWidth":
                        this.context.lineWidth = c[1];
                        break;
                    case "fillStyle":
                        this.context.fillStyle = c[1];
                        break;
                    case "fillRect":
                        this.context.fillRect(c[1], c[2], c[3],
                        c[4]);
                        break;
                    case "beginPath":
                        this.context.beginPath();
                        break;
                    case "moveTo":
                        this.context.moveTo(c[1], c[2]);
                        break;
                    case "lineTo":
                        this.context.lineTo(c[1], c[2]);
                        break;
                    case "quadraticCurveTo":
                        this.context.quadraticCurveTo(c[1], c[2], c[3], c[4]);
                        break;
                    case "arc":
                        this.context.arc(c[1], c[2], c[3], c[4], c[5], c[6]);
                        break;
                    case "fill":
                        this.context.fill();
                        break;
                    case "stroke":
                        this.context.stroke();
                        break;
                    case "fillText":
                        this.extFillText(c[1], c[2], c[3], c[4], c[5]);
                        break;
                    case "textAlign":
                        this.context.ext.textAlign = c[1];
                    case "font":
                        this.context.ext.font = c[1]
                    }
                }
                for (b = 0; b < this.children.length; b++) this.children[b].draw();
                this.context.restore()
            }
        },
        extFillText: function(b, c, e, f, g) {
            var h = "";
            h += "left: " + (this.getGlobalX() + c) + "px;";
            h += "top: " + (this.getGlobalY() + e) + "px;";
            h += "width: " + f + "px;";
            h += "text-align: " + this.context.ext.textAlign + ";";
            h += "color: " + this.context.fillStyle + ";";
            h += "font: " + this.context.ext.font + ";";
            this.element.append('<p class="primer_text ' + g + '" style="' + h + '">' + b + "</p>")
        },
        ghost: function(b) {
            if (this.getVisible()) {
                this.context.save();
                this.context.translate(this.getX(), this.getY());
                for (var c in this.calls) {
                    var e = this.calls[c];
                    switch (e[0]) {
                    case "fillRect":
                        this.ghostFillRect(b, e[1], e[2], e[3], e[4]);
                        break;
                    case "beginPath":
                        this.context.beginPath();
                        break;
                    case "moveTo":
                        this.context.moveTo(e[1], e[2]);
                        break;
                    case "lineTo":
                        this.context.lineTo(e[1], e[2]);
                        break;
                    case "quadraticCurveTo":
                        this.context.quadraticCurveTo(e[1], e[2], e[3], e[4]);
                        break;
                    case "arc":
                        this.context.arc(e[1], e[2], e[3], e[4], e[5], e[6]);
                        break;
                    case "fill":
                        this.ghostFill(b);
                        break
                    }
                }
                if (!jQuery.browser.safari) {
                    b.localX -=
                    this.getX();
                    b.localY -= this.getY()
                }
                for (c in this.children) this.children[c].ghost(b);
                if (!jQuery.browser.safari) {
                    b.localX += this.getX();
                    b.localY += this.getY()
                }
                this.context.restore()
            }
        },
        ghostDetect: function(b) {
            if (jQuery.browser.safari) {
                testX = b.localX;
                testY = b.localY
            } else {
                testX = b.localX - this.getX();
                testY = b.localY - this.getY()
            }
            if (this.context.isPointInPath(testX, testY)) {
                this.mouseWithin || this.primer.actions.push([this.mouseoverVal, b]);
                this.mouseWithin = true
            } else {
                this.mouseWithin && this.primer.actions.push([this.mouseoutVal,
                b]);
                this.mouseWithin = false
            }
        },
        ghostFillRect: function(b, c, e, f, g) {
            this.context.beginPath();
            this.context.moveTo(c, e);
            this.context.lineTo(c + f, e);
            this.context.lineTo(c + f, e + g);
            this.context.lineTo(c, e + g);
            this.context.lineTo(c, e);
            this.ghostDetect(b)
        },
        ghostFill: function(b) {
            this.ghostDetect(b)
        }
    };
    return d
}
var Primer = definePrimer(window.jQuery); (function(a) {
    function d(b, c) {
        b = b.find("a");
        if (b.length > 1) {
            var e = b.filter(".selected"),
            f = b.get().indexOf(e.get(0));
            f += c;
            if (f >= b.length) f = 0;
            else if (f < 0) f = b.length - 1;
            e.removeClass("selected");
            b.eq(f).addClass("selected");
            return true
        }
    }
    a.fn.quicksearch = function(b) {
        var c = a.extend({
            url: null,
            delay: 150,
            spinner: null,
            insertSpinner: null,
            loading: a(".quicksearch-loading")
        },
        b);
        if (c.insertSpinner && !c.spinner) c.spinner = a('<img src="' + GitHub.Ajax.spinner + '" alt="" class="spinner" />');
        function e(f) {
            return c.results.html(f).show()
        }
        c.results.delegate("a", "mouseover",
        function() {
            var f = a(this);
            if (!f.hasClass("selected")) {
                c.results.find("a.selected").removeClass("selected");
                f.addClass("selected")
            }
        });
        return this.each(function() {
            var f = a(this);
            function g() {
                if (c.insertSpinner) {
                    c.spinner.parent().length || c.insertSpinner.call(f, c.spinner);
                    c.spinner.show()
                }
                f.trigger("quicksearch.loading");
                c.loading && e(c.loading.html())
            }
            function h() {
                c.insertSpinner && c.spinner.hide();
                f.trigger("quicksearch.loaded")
            }
            f.autocompleteField({
                url: c.url || f.attr("data-url"),
                dataType: c.dataType,
                delay: c.delay,
                useCache: true,
                minLength: 2
            }).bind("keyup",
            function(j) {
                j.which != 13 && f.val().length >= 2 && c.results.is(":empty") && g()
            }).bind("autocomplete.beforesend",
            function() {
                g()
            }).bind("autocomplete.finish",
            function(j, l) {
                e(l || {});
                h()
            }).bind("autocomplete.clear",
            function() {
                c.results.html("").hide();
                h()
            }).bind("focus",
            function() {
                f.val() && f.trigger("keyup")
            }).bind("blur",
            function() {
                setTimeout(function() {
                    f.trigger("autocomplete.clear")
                },
                150)
            }).hotkeys({
                up: function() {
                    if (d(c.results, -1)) return false
                },
                down: function() {
                    if (d(c.results, 1)) return false
                },
                enter: function() {
                    var j = c.results.find("a.selected");
                    if (j.length) {
                        a(this).blur();
                        if (j.hasClass("initial")) j.closest("form").submit();
                        else window.location = j.attr("href");
                        return false
                    } else a(this).trigger("autocomplete.clear")
                },
                esc: function() {
                    a(this).blur();
                    return false
                }
            })
        })
    }
})(jQuery); (function(a) {
    a.smartPoller = function(d, b) {
        if (a.isFunction(d)) {
            b = d;
            d = 1000
        } (function c() {
            setTimeout(function() {
                b.call(this, c)
            },
            d);
            d *= 1.1
        })()
    }
})(jQuery); (function(a) {
    var d = function() {
        var b = typeof document.selection !== "undefined" && typeof document.selection.createRange !== "undefined";
        return {
            getSelectionRange: function(c) {
                var e,
                f,
                g;
                c.focus();
                if (typeof c.selectionStart !== "undefined") {
                    e = c.selectionStart;
                    f = c.selectionEnd
                } else if (b) {
                    e = document.selection.createRange();
                    f = e.text.length;
                    if (e.parentElement() !== c) throw "Unable to get selection range.";
                    if (c.type === "textarea") {
                        g = e.duplicate();
                        g.moveToElementText(c);
                        g.setEndPoint("EndToEnd", e);
                        e = g.text.length - f
                    } else {
                        c =
                        c.createTextRange();
                        c.setEndPoint("EndToStart", e);
                        e = c.text.length
                    }
                    f = e + f
                } else throw "Unable to get selection range.";
                return {
                    start: e,
                    end: f
                }
            },
            getSelectionStart: function(c) {
                return this.getSelectionRange(c).start
            },
            getSelectionEnd: function(c) {
                return this.getSelectionRange(c).end
            },
            setSelectionRange: function(c, e, f) {
                var g;
                c.focus();
                if (typeof f === "undefined") f = e;
                if (typeof c.selectionStart !== "undefined") c.setSelectionRange(e, f);
                else if (b) {
                    g = c.value;
                    c = c.createTextRange();
                    f -= e + g.slice(e + 1, f).split("\n").length -
                    1;
                    e -= g.slice(0, e).split("\n").length - 1;
                    c.move("character", e);
                    c.moveEnd("character", f);
                    c.select()
                } else throw "Unable to set selection range.";
            },
            getSelectedText: function(c) {
                var e = this.getSelectionRange(c);
                return c.value.substring(e.start, e.end)
            },
            insertText: function(c, e, f, g, h) {
                g = g || f;
                var j = e.length;
                j = f + j;
                var l = c.value.substring(0, f);
                g = c.value.substr(g);
                c.value = l + e + g;
                h === true ? this.setSelectionRange(c, f, j) : this.setSelectionRange(c, j)
            },
            replaceSelectedText: function(c, e, f) {
                var g = this.getSelectionRange(c);
                this.insertText(c, e, g.start, g.end, f)
            },
            wrapSelectedText: function(c, e, f, g) {
                e = e + this.getSelectedText(c) + f;
                this.replaceSelectedText(c, e, g)
            }
        }
    } ();
    window.Selection = d;
    a.fn.extend({
        getSelectionRange: function() {
            return d.getSelectionRange(this[0])
        },
        getSelectionStart: function() {
            return d.getSelectionStart(this[0])
        },
        getSelectionEnd: function() {
            return d.getSelectionEnd(this[0])
        },
        getSelectedText: function() {
            return d.getSelectedText(this[0])
        },
        setSelectionRange: function(b, c) {
            return this.each(function() {
                d.setSelectionRange(this,
                b, c)
            })
        },
        insertText: function(b, c, e, f) {
            return this.each(function() {
                d.insertText(this, b, c, e, f)
            })
        },
        replaceSelectedText: function(b, c) {
            return this.each(function() {
                d.replaceSelectedText(this, b, c)
            })
        },
        wrapSelectedText: function(b, c, e) {
            return this.each(function() {
                d.wrapSelectedText(this, b, c, e)
            })
        }
    })
})(jQuery); (function(a) {
    a.fn.tipsy = function(d) {
        d = a.extend({
            fade: false,
            gravity: "n",
            title: "title",
            fallback: ""
        },
        d || {});
        this.hover(function() {
            a.data(this, "cancel.tipsy", true);
            var b = a.data(this, "active.tipsy");
            if (!b) {
                b = a('<div class="tipsy"><div class="tipsy-inner"/></div>');
                b.css({
                    position: "absolute",
                    zIndex: 100000
                });
                a.data(this, "active.tipsy", b)
            }
            if (this.hasAttribute("title") || !this.hasAttribute("original-title")) a(this).attr("original-title", a(this).attr("title") || "").removeAttr("title");
            var c;
            if (typeof d.title ==
            "string") c = a(this).attr(d.title == "title" ? "original-title": d.title);
            else if (typeof d.title == "function") c = d.title.call(this);
            b.find(".tipsy-inner").html(c || d.fallback);
            c = a.extend({},
            a(this).offset(), {
                width: this.offsetWidth,
                height: this.offsetHeight
            });
            b.get(0).className = "tipsy";
            b.remove().css({
                top: 0,
                left: 0,
                visibility: "hidden",
                display: "block"
            }).appendTo(document.body);
            var e = b[0].offsetWidth,
            f = b[0].offsetHeight,
            g = typeof d.gravity == "function" ? d.gravity.call(this) : d.gravity;
            switch (g.charAt(0)) {
            case "n":
                b.css({
                    top:
                    c.top +
                    c.height,
                    left: c.left + c.width / 2 - e / 2
                }).addClass("tipsy-north");
                break;
            case "s":
                b.css({
                    top:
                    c.top - f,
                    left: c.left + c.width / 2 - e / 2
                }).addClass("tipsy-south");
                break;
            case "e":
                b.css({
                    top:
                    c.top + c.height / 2 - f / 2,
                    left: c.left - e
                }).addClass("tipsy-east");
                break;
            case "w":
                b.css({
                    top:
                    c.top + c.height / 2 - f / 2,
                    left: c.left + c.width
                }).addClass("tipsy-west");
                break
            }
            d.fade ? b.css({
                opacity: 0,
                display: "block",
                visibility: "visible"
            }).animate({
                opacity: 0.8
            }) : b.css({
                visibility: "visible"
            })
        },
        function() {
            a.data(this, "cancel.tipsy", false);
            var b = this;
            setTimeout(function() {
                if (!a.data(this, "cancel.tipsy")) {
                    var c = a.data(b, "active.tipsy");
                    d.fade ? c.stop().fadeOut(function() {
                        a(this).remove()
                    }) : c.remove()
                }
            },
            100)
        });
        this.bind("tipsy.reload",
        function() {
            if (this.hasAttribute("title")) a(this).attr("original-title", a(this).attr("title") || "").removeAttr("title");
            var b;
            if (typeof d.title == "string") b = a(this).attr(d.title == "title" ? "original-title": d.title);
            else if (typeof d.title == "function") b = d.title.call(this);
            var c = a.data(this, "active.tipsy");
            c.find(".tipsy-inner").text(b ||
            d.fallback);
            b = a.extend({},
            a(this).offset(), {
                width: this.offsetWidth,
                height: this.offsetHeight
            });
            var e = c[0].offsetWidth,
            f = c[0].offsetHeight,
            g = typeof d.gravity == "function" ? d.gravity.call(this) : d.gravity;
            switch (g.charAt(0)) {
            case "n":
                c.css({
                    top:
                    b.top + b.height,
                    left: b.left + b.width / 2 - e / 2
                });
                break;
            case "s":
                c.css({
                    top:
                    b.top - f,
                    left: b.left + b.width / 2 - e / 2
                });
                break;
            case "e":
                c.css({
                    top:
                    b.top + b.height / 2 - f / 2,
                    left: b.left - e
                });
                break;
            case "w":
                c.css({
                    top:
                    b.top + b.height / 2 - f / 2,
                    left: b.left + b.width
                });
                break
            }
        })
    };
    a.fn.tipsy.autoNS =
    function() {
        return a(this).offset().top > a(document).scrollTop() + a(window).height() / 2 ? "s": "n"
    }
})(jQuery);
jQuery.fn.truncate = function(a, d) {
    d = jQuery.extend({
        chars: /\s/,
        trail: ["...", ""]
    },
    d);
    var b = {},
    c = $.browser.msie;
    function e(f) {
        c && f.style.removeAttribute("filter")
    }
    return this.each(function() {
        for (var f = jQuery(this), g = f.html().replace(/\r\n/gim, ""), h = g, j = /<\/?[^<>]*\/?>/gim, l, k = {},
        m = $("*").index(this); (l = j.exec(h)) != null;) k[l.index] = l[0];
        h = jQuery.trim(h.split(j).join(""));
        if (h.length > a) {
            for (; a < h.length;) {
                l = h.charAt(a);
                if (l.match(d.chars)) {
                    h = h.substring(0, a);
                    break
                }
                a--
            }
            if (g.search(j) != -1) {
                j = 0;
                for (eachEl in k) {
                    h =
                    [h.substring(0, eachEl), k[eachEl], h.substring(eachEl, h.length)].join("");
                    if (eachEl < h.length) j = h.length
                }
                f.html([h.substring(0, j), h.substring(j, h.length).replace(/<(\w+)[^>]*>.*<\/\1>/gim, "").replace(/<(br|hr|img|input)[^<>]*\/?>/gim, "")].join(""))
            } else f.html(h);
            b[m] = g;
            f.html(["<div class='truncate_less'>", f.html(), d.trail[0], "</div>"].join("")).find(".truncate_show", this).click(function() {
                f.find(".truncate_more").length == 0 && f.append(["<div class='truncate_more' style='display: none;'>", b[m], d.trail[1],
                "</div>"].join("")).find(".truncate_hide").click(function() {
                    f.find(".truncate_more").css("background", "#fff").fadeOut("normal",
                    function() {
                        f.find(".truncate_less").css("background", "#fff").fadeIn("normal",
                        function() {
                            e(this);
                            $(this).css("background", "none")
                        });
                        e(this)
                    });
                    return false
                });
                f.find(".truncate_less").fadeOut("normal",
                function() {
                    f.find(".truncate_more").fadeIn("normal",
                    function() {
                        e(this)
                    });
                    e(this)
                });
                jQuery(".truncate_show", f).click(function() {
                    f.find(".truncate_less").css("background", "#fff").fadeOut("normal",
                    function() {
                        f.find(".truncate_more").css("background", "#fff").fadeIn("normal",
                        function() {
                            e(this);
                            $(this).css("background", "none")
                        });
                        e(this)
                    });
                    return false
                });
                return false
            })
        }
    })
};
String.prototype.score = function(a, d) {
    var b = 0,
    c = a.length,
    e = this,
    f = e.length,
    g,
    h = 1;
    if (e == a) return 1;
    for (var j = 0, l, k, m, n; j < c; ++j) {
        m = a[j];
        l = e.indexOf(m.toLowerCase());
        k = e.indexOf(m.toUpperCase());
        n = Math.min(l, k);
        k = n > -1 ? n: Math.max(l, k);
        if (k === -1) if (d) {
            h += 1 - d;
            break
        } else return 0;
        else l = 0.1;
        if (e[k] === m) l += 0.1;
        if (k === 0) {
            l += 0.6;
            if (j === 0) g = 1
        }
        if (e.charAt(k - 1) === " ") l += 0.8;
        e = e.substring(k + 1, f);
        b += l
    }
    a = b / c;
    c = (a * (c / f) + a) / 2;
    c /= h;
    if (g && c + 0.15 < 1) c += 0.15;
    return c
};
GitHub.gravatar = function(a, d) {
    d = d || 35;
    var b = location.protocol == "https:" ? "https://secure.gravatar.com": "http://gravatar.com",
    c = location.protocol == "https:" ? "https": "http";
    return '<img src="' + b + "/avatar/" + a + "?s=" + d + "&d=" + c + "%3A%2F%2Fgithub.com%2Fimages%2Fgravatars%2Fgravatar-" + d + '.png" />'
};
function debug(a, d) {
    if (GitHub.debug && console && console.log) d ? console.log(a, d) : console.log(a)
}
Function.prototype.delay = function(a) {
    return setTimeout(this, a)
};
String.prototype.capitalize = function() {
    return this.replace(/\w+/g,
    function(a) {
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase()
    })
};
jQuery.expr[":"].Contains = function(a, d, b) {
    return (a.textContent || a.innerText || "").toLowerCase().indexOf(b[3].toLowerCase()) >= 0
};
$.fn.scrollTo = function(a, d) {
    var b;
    if (typeof a == "number" || !a) {
        d = a;
        b = this;
        a = "html,body"
    } else {
        b = a;
        a = this
    }
    b = $(b).offset().top - 30;
    $(a).animate({
        scrollTop: b
    },
    d || 1000);
    return this
};
$.gitbox = function(a) {
    $.facebox(function() {
        $.get(a,
        function(d) {
            $.facebox(d);
            $("#facebox .footer").hide()
        })
    })
};
$.fn.spin = function() {
    return this.after('<img src="' + GitHub.Ajax.spinner + '" id="spinner"/>')
};
$.fn.stopSpin = function() {
    $("#spinner").remove();
    return this
};
$.fn.contextLoader = function(a) {
    var d = '<div class="context-loader">Sending Request&hellip;</div>';
    return this.after($(d).css("top", a))
};
GitHub.Ajax = {};
GitHub.Ajax.spinner = (GitHub.assetHost || "") + "/images/modules/ajax/indicator.gif";
GitHub.Ajax.error = (GitHub.assetHost || "") + "/images/modules/ajax/error.png";
$(function() {
    $(".previewable-comment-form").previewableCommentForm();
    $(".cards_select").cardsSelect();
    $(document).bind("reveal.facebox",
    function() {
        $(".cards_select").cardsSelect()
    });
    $(".js-entice").each(function() {
        $(this).enticeToAction({
            title: $(this).attr("data-entice")
        })
    });
    $("textarea.js-autosize").autoResize({
        animateDuration: 300,
        extraSpace: 10
    });
    $(".flash .close").click(function() {
        $(this).closest(".flash").fadeOut(300)
    });
    $(".tooltipped").each(function() {
        var e = $(this),
        f = e.hasClass("downwards") ? "n":
        "s";
        f = e.hasClass("rightwards") ? "w": f;
        f = e.hasClass("leftwards") ? "e": f;
        e.tipsy({
            gravity: f
        })
    });
    $(".toggle_link").click(function() {
        $($(this).attr("href")).toggle();
        return false
    });
    $(".hide_alert").live("click",
    function() {
        $("#site_alert").slideUp();
        $.cookie("hide_alert_vote", "t", {
            expires: 7,
            path: "/"
        });
        return false
    });
    $(".hide_div").click(function() {
        $(this).parents("div:first").fadeOut();
        return false
    });
    var a = $("#login_field");
    if (a.val()) a.length && $("#password").focus();
    else a.focus();
    $("#versions_select").change(function() {
        location.href =
        this.value
    });
    $(document).bind("loading.facebox",
    function() {
        $(".clippy").hide()
    });
    $(document).bind("reveal.facebox",
    function() {
        $("#facebox .clippy").show()
    });
    $(document).bind("close.facebox",
    function() {
        $(".clippy").show()
    });
    $.fn.facebox && $("a[rel*=facebox]").facebox();
    $(".pjax a").pjax(".site:first");
    $(".js-date-input").date_input();
    $.fn.truncate && $(".truncate").bind("truncate",
    function() {
        $(this).truncate(50, {
            chars: /.*/
        })
    }).trigger("truncate");
    $.fn.relatizeDate && $(".relatize").relatizeDate();
    $.hotkeys({
        s: function() {
            d.focus()
        },
        "?": function() {
            $(document).one("reveal.facebox",
            function() {
                $(".js-see-all-keyboard-shortcuts").click(function() {
                    $(this).remove();
                    $("#facebox :hidden").show();
                    return false
                })
            });
            $.facebox({
                div: "#keyboard_shortcuts_pane"
            },
            "shortcuts")
        }
    });
    var d = $(".topsearch input[name=q]").enhancedField();
    if ("_auth_token" in window) {
        a = window.location.pathname;
        var b = window._auth_token,
        c = "&request_uri=" + encodeURIComponent(a) + "&authenticity_token=" + encodeURIComponent(b);
        $.ajaxSetup({
            beforeSend: function(e, f) {
                e.setRequestHeader("Accept",
                "text/javascript");
                if (f.data) f.data += c;
                else if (!f.data) {
                    f.data = c;
                    e.setRequestHeader("Content-Type", f.contentType)
                }
            }
        })
    } else $.ajaxSetup({
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "text/javascript")
        }
    });
    $("button, .minibutton").live("mousedown",
    function() {
        $(this).addClass("mousedown")
    }).live("mouseup mouseleave",
    function() {
        $(this).removeClass("mousedown")
    });
    $("ul.inline-tabs").tabs();
    $(".js-hard-tabs").hardTabs();
    BaconPlayer.sm2 = "/javascripts/soundmanager/sm2.js";
    $(".js-all-locales").click(function() {
        $(".locales").addClass("showing-all-locales");
        $(document).scrollTop(9999);
        return false
    })
});
function clippyCopiedCallback(a) {
    var d = $("#clippy_tooltip_" + a);
    if (d.length != 0) {
        d.attr("title", "copied!").trigger("tipsy.reload");
        setTimeout(function() {
            d.attr("title", "copy to clipboard")
        },
        500)
    }
};
GitHub.Autocomplete = function() {};
GitHub.Autocomplete.gravatars = {};
GitHub.Autocomplete.visibilities = {};
GitHub.Autocomplete.acceptable = function(a) {
    a.result(function() {
        var d = $(this);
        setTimeout(function() {
            if (d.val()) {
                d.addClass("ac-accept");
                d.data("accept-val", d.val())
            }
        },
        30)
    });
    a.keypress(function() {
        $(this).data("accept-val") != $(this).val() && $(this).removeClass("ac-accept")
    });
    a.keydown(function() {
        $(this).data("accept-val") != $(this).val() && $(this).removeClass("ac-accept")
    });
    a.keyup(function() {
        $(this).data("accept-val") != $(this).val() && $(this).removeClass("ac-accept")
    });
    a.parents("form:first").submit(function() {
        $(this).removeClass("ac-accept")
    })
};
GitHub.Autocomplete.prototype = {
    usersURL: "/autocomplete/users",
    reposURL: "/autocomplete/repos",
    myReposURL: "/autocomplete/repos/mine",
    branchesURL: "/autocomplete/branches",
    settings: {},
    repos: function(a) {
        a = $(a);
        if (!$.fn.autocomplete || a.length == 0) return a;
        a = a.autocomplete(this.reposURL, $.extend({
            delay: 10,
            width: 210,
            minChars: 2,
            selectFirst: false,
            formatItem: function(d) {
                d = d[0].split(" ");
                var b = d[0];
                d = d[1];
                GitHub.Autocomplete.visibilities[b] = d;
                return b
            },
            formatResult: function(d) {
                return d[0].split(" ")[0]
            },
            autoResult: true
        },
        this.settings));
        GitHub.Autocomplete.acceptable(a);
        return a
    },
    myRepos: function(a) {
        a = $(a);
        if (!$.fn.autocomplete || a.length == 0) return a;
        if (!github_user) return a;
        return a.autocomplete(this.myReposURL, $.extend({
            delay: 10,
            width: 210,
            selectFirst: false,
            formatItem: function(d) {
                d = d[0].split(" ");
                var b = d[0];
                d = d[1];
                GitHub.Autocomplete.visibilities[b] = d;
                return b
            },
            formatResult: function(d) {
                return d[0].split(" ")[0]
            }
        },
        this.settings)).result(function(d, b) {
            window.location = "/" + b[0].split(" ")[0];
            return false
        }).keydown(function(d) {
            if (!/\//.test(a.val()) &&
            d.keyCode == 9) if (d = $(".ac_results li:first").text()) {
                a.val(d);
                window.location = "/" + d;
                return false
            }
        }).end()
    },
    users: function(a) {
        a = $(a);
        if (!$.fn.autocomplete || a.length == 0) return a;
        a = a.autocomplete(this.usersURL, $.extend({
            delay: 10,
            minChars: 1,
            formatItem: function(d) {
                d = d[0].split(" ");
                var b = d[0];
                d = GitHub.gravatar(d[1], 24);
                GitHub.Autocomplete.gravatars[b] = d;
                return d + " " + b
            },
            formatResult: function(d) {
                return d[0].split(" ")[0]
            },
            autoResult: true
        },
        this.settings));
        GitHub.Autocomplete.acceptable(a);
        return a
    },
    branches: function(a,
    d) {
        a = $(a);
        if (!$.fn.autocomplete || a.length == 0) return a;
        d || (d = {});
        d = $.extend({
            extraParams: {
                repository: GitHub.nameWithOwner,
                current: GitHub.currentRef
            },
            matchCase: true,
            minChars: 0,
            matchContains: true,
            selectFirst: true,
            autoResult: true
        },
        d);
        a = a.autocomplete(this.branchesURL, $.extend(this.settings, d));
        GitHub.Autocomplete.acceptable(a);
        return a
    }
};
$.userAutocomplete = function() {
    $(".autocompleter, .user-autocompleter").userAutocomplete()
};
$.fn.userAutocomplete = function() {
    return (new GitHub.Autocomplete).users(this)
};
$.repoAutocomplete = function() {};
$.fn.repoAutocomplete = function() {
    return (new GitHub.Autocomplete).repos(this)
};
$.myReposAutocomplete = function() {
    $(".my_repos_autocompleter").myReposAutocomplete()
};
$.fn.myReposAutocomplete = function() {
    return (new GitHub.Autocomplete).myRepos(this)
};
$.fn.branchesAutocomplete = function(a) {
    return (new GitHub.Autocomplete).branches(this, a)
};
$(function() {
    $.userAutocomplete();
    $.myReposAutocomplete()
});
GitHub || (GitHub = {});
if (!GitHub.Blob) GitHub.Blob = {};
GitHub.Blob.highlightLines = function(a) {
    var d;
    $(".line").css("background-color", "transparent");
    if (a) {
        d = $(this).attr("rel");
        if (a.shiftKey) d = window.location.hash.replace(/-\d+/, "") + "-" + d.replace(/\D/g, "");
        window.location.hash = d
    } else d = window.location.hash;
    if (a = d.match(/#?(?:L|-)(\d+)/g)) {
        a = $.map(a,
        function(b) {
            return parseInt(b.replace(/\D/g, ""))
        });
        if (a.length == 1) return $("#LC" + a[0]).css("background-color", "#ffc");
        for (d = a[0]; d <= a[1]; d++) $("#LC" + d).css("background-color", "#ffc");
        $("#LC" + a[0]).scrollTo(1)
    }
    return false
};
GitHub.Blob.scrollToHilightedLine = function() {
    var a;
    a = window.location.hash;
    if (a = a.match(/^#?(?:L|-)(\d+)$/g)) {
        a = $.map(a,
        function(d) {
            return parseInt(d.replace(/\D/g, ""))
        });
        $("#L" + a[0]).scrollTo(1)
    }
};
GitHub.Blob.show = function() {
    $.hotkeys({
        l: function() {
            $(document).one("reveal.facebox",
            function() {
                var d = $("#facebox").find(":text");
                d.focus();
                $("#facebox form").submit(function() {
                    window.location = "#L" + parseInt(d.val());
                    GitHub.Blob.highlightLines();
                    d.blur();
                    $(document).trigger("close.facebox");
                    return false
                })
            });
            $.facebox({
                div: "#jump-to-line"
            })
        }
    });
    if (!GitHub.hasWriteAccess || !GitHub.currentRef) $(".file-edit-link").enticeToAction({
        title: "You don't have commit access to this repository",
        direction: "leftwards"
    });
    else if (GitHub.hasWriteAccess && GitHub.currentRef) {
        var a = $(".file-edit-link")[0];
        if (a) a.href = a.href.replace("__current_ref__", GitHub.currentRef)
    }
};
$(function() {
    if ($(".page-blob").length > 0) {
        GitHub.Blob.scrollToHilightedLine();
        GitHub.Blob.highlightLines();
        GitHub.Blob.show()
    }
    $(".line_numbers span").live("mousedown", GitHub.Blob.highlightLines);
    $(".file-edit-link").live("click",
    function() {
        if ($(this).hasClass("entice")) return false;
        return true
    });
    $("#cancel-blob-editing").live("click",
    function() {
        $(".blob-editor").remove();
        $("#readme").show();
        $("#files").children().show();
        return false
    });
    $(".file").delegate(".linkable-line-number", "click",
    function() {
        document.location.hash =
        this.id;
        return false
    });
    $(".commit-message").live("focus",
    function() {
        $(this).attr("value", "")
    })
});
$(function() {
    var a = 2,
    d = 7,
    b = 30;
    $(".diverge-widget").each(function() {
        var c = $(this),
        e = new Date(c.attr("last-updated"));
        e = (new Date - e) / 1000 / 3600 / 24;
        if (e <= a) c.addClass("hot");
        else if (e <= d) c.addClass("fresh");
        else e <= b ? c.addClass("stale") : c.addClass("old")
    })
});
Comment = {
    enhanceAll: function() {
        $(".new-comments .comment .cmeta p.author").each(function() {
            var a = $(this).next(".info"),
            d = $(this).closest(".cmeta");
            $(a).find(".relatize").relatizeDate();
            $(this).width(d.width() - a.width() - 10)
        })
    },
    enhanceEmailToggles: function() {
        $(".email-hidden-toggle").each(function() {
            var a = $(this),
            d = a.find("a"),
            b = a.next(".email-hidden-reply");
            d.click(function() {
                if (b.is(":visible")) {
                    b.hide();
                    d.html("Show quoted text")
                } else {
                    b.show();
                    d.html("Hide quoted text")
                }
                return false
            })
        })
    }
};
$(Comment.enhanceAll);
$(Comment.enhanceEmailToggles);
GitHub.Commit = {
    dumpEmptyClass: function() {
        $(this).removeClass("empty")
    },
    addEmptyClass: function() { ! $(this).data("clicked") && $(this).text() == "0" && $(this).addClass("empty")
    },
    highlightLine: function() {
        $(this).parent().css("background", "#ffc")
    },
    unhighlightLine: function() {
        $(this).data("clicked") || $(this).parent().css("background", "")
    },
    jumpToHashFile: function() {
        if (window.location.hash) {
            var a,
            d,
            b = window.location.hash.substr(1);
            if (!/^diff-\d+$/.test(b)) if (b.match(/^r\d+$/) && (d = $("#files #" + b)).length > 0) {
                console.log("jumping to review comment",
                d);
                $(d).addClass("selected");
                $("html,body").animate({
                    scrollTop: d.offset().top - 200
                },
                1)
            } else if ((a = b.match(/(.+)-P(\d+)$/) || b.match(/(.+)/)) && (d = GitHub.Commit.files[a[1]])) if (a[2]) {
                d = $(d).closest(".file").find('tr[data-position="' + a[2] + '"] pre');
                if (d.length > 0) {
                    d.scrollTo(1);
                    setTimeout(function() {
                        GitHub.Commit.highlightLine.call(d)
                    },
                    50)
                }
            } else $(d).closest(".file").scrollTo(1)
        }
    },
    observeHash: function() {
        if (window.location.hash != GitHub.Commit.oldHash) {
            GitHub.Commit.oldHash = window.location.hash;
            GitHub.Commit.jumpToHashFile()
        }
    }
};
$(function() {
    var a = {};
    $("#files.diff-view > .file > .meta").each(function() {
        a[$(this).attr("data-path")] = this
    });
    GitHub.Commit.files = a;
    function d(e) {
        e.find(".relatize").relatizeDate();
        e.editableComment()
    }
    d($("#comments .comment"));
    function b(e) {
        e.find("ul.inline-tabs").tabs();
        e.find(".show-inline-comment-form a").click(function() {
            e.find(".inline-comment-form").show().find("textarea").focus();
            $(this).hide();
            return false
        });
        e.delegate(".close-form", "click",
        function() {
            e.find(".inline-comment-form").hide();
            if (e.find(".commit-comment", ".review-comment").length > 0) e.find(".show-inline-comment-form a").show();
            else {
                console.log(e);
                e.remove()
            }
            return false
        });
        var f = e.find(".previewable-comment-form").previewableCommentForm().closest("form");
        f.submit(function() {
            f.find(".ajaxindicator").show();
            f.find("button").attr("disabled", "disabled");
            f.ajaxSubmit({
                success: function(g) {
                    var h = f.closest(".clipper"),
                    j = h.find(".comment-holder");
                    if (j.length == 0) j = h.prepend($('<div class="inset comment-holder"></div>')).find(".comment-holder");
                    g = $(g);
                    j.append(g);
                    d(g);
                    f.find("textarea").val("");
                    f.find(".ajaxindicator").hide();
                    f.find("button").attr("disabled", "");
                    h.find(".inline-comment-form").hide();
                    h.find(".show-inline-comment-form a").show();
                    j = h.closest(".inline-comments").find(".comment-count .counter");
                    j.text(parseInt(j.text().replace(",", "")) + 1);
                    $(h.closest(".file-box, .file")).trigger("commentChange", g)
                }
            });
            return false
        })
    }
    setInterval(GitHub.Commit.observeHash, 50);
    $(".inline-review-comment tr.inline-comments").each(function() {
        b($(this));
        d($(this).find(".comment"))
    });
    $("#diff-comment-data > table").each(function() {
        var e = $(this).attr("data-path"),
        f = $(this).attr("data-position");
        e = $(a[e]).closest(".file");
        f = e.find('.data table tr[data-position="' + f + '"]');
        f.after($(this).find("tr").detach());
        b(f.next("tr.inline-comments"));
        d(f.next("tr.inline-comments").find(".comment"));
        e.find(".show-inline-comments-toggle").closest("li").show()
    });
    $("#diff-comment-data > div").each(function() {
        var e = $(this).attr("data-path");
        $(a[e]).closest(".file").find(".file-comments-place-holder").replaceWith($(this).detach())
    });
    function c(e) {
        e.find(".inline-comment-form").show().find("textarea").focus();
        e.find(".show-inline-comment-form a").hide()
    }
    $('.inline-comment-form div[id^="write_bucket_"]').live("tabChanged",
    function() {
        var e = $(this);
        setTimeout(function() {
            e.find("textarea").focus()
        },
        13)
    });
    $(".add-bubble").live("click",
    function() {
        var e = $(this).closest("tr"),
        f = e.next("tr.inline-comments");
        f.length > 0 ? c(f) : $.get($(this).attr("remote"),
        function(g) {
            e.after(g);
            f = e.next("tr.inline-comments");
            b(f);
            c(f)
        })
    });
    $("#files .show-inline-comments-toggle").change(function() {
        this.checked ?
        $(this).closest(".file").find("tr.inline-comments").show() : $(this).closest(".file").find("tr.inline-comments").hide()
    }).change();
    $("#inline_comments_toggle input").change(function() {
        this.checked ? $("#comments").removeClass("only-commit-comments") : $("#comments").addClass("only-commit-comments")
    }).change();
    $(".js-show-suppressed-diff").click(function() {
        $(this).parent().next().show();
        $(this).parent().hide();
        return false
    })
});
$(function() {
    if ($("#files .image").length) {
        var a = $("#files .file:has(.onion-skin)");
        $.each(a,
        function(d) {
            var b = a.eq(d),
            c = b.find(".two-up").eq(0),
            e = b.find(".swipe").eq(0),
            f = b.find(".onion-skin").eq(0),
            g = b.find(".difference").eq(0);
            d = b.find(".deleted");
            var h = b.find(".added"),
            j = d.eq(0),
            l = h.eq(0),
            k = d.eq(1),
            m = h.eq(1),
            n = d.eq(2),
            q = h.eq(2),
            s = b.find("canvas.deleted").eq(0),
            w = b.find("canvas.added").eq(0),
            t,
            o,
            p = b.find("ul.menu"),
            r = b.find(".view"),
            v = 0,
            C = b.find(".asset").length,
            J = 0,
            y = new Image,
            z = new Image;
            if (s[0].getContext) {
                t =
                s[0].getContext("2d");
                o = w[0].getContext("2d")
            } else p.children().eq(3).addClass("hidden");
            b.find(".two-up").hide();
            b.find(".two-up p").removeClass("hidden");
            b.find(".progress").removeClass("hidden");
            b.find(".view-modes").removeClass("hidden");
            y.src = b.find(".deleted").first().attr("src");
            z.src = b.find(".added").first().attr("src");
            j.attr("src", y.src).load(function() {
                K()
            });
            l.attr("src", z.src).load(function() {
                K()
            });
            k.attr("src", y.src).load(function() {
                K()
            });
            m.attr("src", z.src).load(function() {
                K()
            });
            n.attr("src",
            y.src).load(function() {
                K()
            });
            q.attr("src", z.src).load(function() {
                K()
            });
            p.children("li").click(function() {
                u($(this).index())
            });
            function K() {
                J++;
                G();
                if (J >= C) {
                    var A = b.find(".progress");
                    if (A.is(":visible")) A.fadeOut(250,
                    function() {
                        x()
                    });
                    else {
                        A.hide();
                        x()
                    }
                }
            }
            function u(A) {
                var D = p.find(".active"),
                B = p.find(".active").first().index(),
                E = r.eq(B);
                B = p.children().eq(A);
                if (B.hasClass("active") == false && B.hasClass("disabled") == false) {
                    D.removeClass("active");
                    B.addClass("active");
                    if (B.is(":visible")) {
                        D = B.position();
                        B = B.outerWidth();
                        D = String(D.left + B / 2) + "px 0px";
                        p.css("background-image", "url(/images/modules/commit/menu_arrow.gif)");
                        p.animate({
                            backgroundPosition: D
                        },
                        250, "easeOutQuart")
                    }
                    if (J >= 2) {
                        actualHeight = E.css("height");
                        animHeight = r.eq(A).css("height");
                        E.animate({
                            height: animHeight,
                            opacity: "hide"
                        },
                        250, "easeOutQuart",
                        function() {
                            E.css("height", actualHeight);
                            r.eq(A).fadeIn(250)
                        })
                    }
                }
            }
            function x() {
                var A = 858,
                D = Math.max(y.width, z.width),
                B = Math.max(y.height, z.height),
                E = 1,
                F = 1,
                H = 1,
                I = 1;
                y.marginHoriz = Math.floor((D - y.width) /
                2);
                y.marginVert = Math.floor((B - y.height) / 2);
                z.marginHoriz = Math.floor((D - z.width) / 2);
                z.marginVert = Math.floor((B - z.height) / 2);
                if (D > (A - 30) / 2) E = (A - 30) / 2 / D;
                j.attr({
                    width: y.width * E,
                    height: y.height * E
                });
                l.attr({
                    width: z.width * E,
                    height: z.height * E
                });
                c.find(".deleted-frame").css({
                    margin: y.marginVert * E + "px " + y.marginHoriz * E + "px",
                    width: y.width * E + 2,
                    height: y.height * E + 2
                });
                c.find(".added-frame").css({
                    margin: z.marginVert * E + "px " + z.marginHoriz * E + "px",
                    width: z.width * E + 2,
                    height: z.height * E + 2
                });
                c.find(".aWMeta").eq(0).text(z.width +
                "px");
                c.find(".aHMeta").eq(0).text(z.height + "px");
                c.find(".dWMeta").eq(0).text(y.width + "px");
                c.find(".dHMeta").eq(0).text(y.height + "px");
                if (z.width != y.width) {
                    c.find(".aWMeta").eq(0).addClass("a-green");
                    c.find(".dWMeta").eq(0).addClass("d-red")
                }
                if (z.height != y.height) {
                    c.find(".aHMeta").eq(0).addClass("a-green");
                    c.find(".dHMeta").eq(0).addClass("d-red")
                }
                if (D > A - 12) F = (A - 12) / D;
                k.attr({
                    width: y.width * F,
                    height: y.height * F
                });
                m.attr({
                    width: z.width * F,
                    height: z.height * F
                });
                e.find(".deleted-frame").css({
                    margin: y.marginVert *
                    F + "px " + y.marginHoriz * F + "px",
                    width: y.width * F + 2,
                    height: y.height * F + 2
                });
                e.find(".added-frame").css({
                    margin: z.marginVert * F + "px " + z.marginHoriz * F + "px",
                    width: z.width * F + 2,
                    height: z.height * F + 2
                });
                e.find(".swipe-shell").css({
                    width: D * F + 3 + "px",
                    height: B * F + 4 + "px"
                });
                e.find(".swipe-frame").css({
                    width: D * F + 18 + "px",
                    height: B * F + 30 + "px"
                });
                e.find(".swipe-bar").draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function(L, M) {
                        L = Math.round(M.position.left / (parseInt(b.find(".swipe-frame").css("width")) - 15) * 10000) / 10000;
                        M = D * F + 3;
                        b.find(".swipe .swipe-shell").css("width",
                        M - M * L)
                    }
                });
                if (D > A - 12) H = (A - 12) / D;
                n.attr({
                    width: y.width * H,
                    height: y.height * H
                });
                q.attr({
                    width: z.width * H,
                    height: z.height * H
                });
                f.find(".deleted-frame").css({
                    margin: y.marginVert * H + "px " + y.marginHoriz * H + "px",
                    width: y.width * H + 2,
                    height: y.height * H + 2
                });
                f.find(".added-frame").css({
                    margin: z.marginVert * H + "px " + z.marginHoriz * H + "px",
                    width: z.width * H + 2,
                    height: z.height * H + 2
                });
                f.find(".onion-skin-frame").css({
                    width: D * H + 4 + "px",
                    height: B * H + 30 + "px"
                });
                b.find(".dragger").css("left", "262px");
                b.find(".dragger").draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function(L, M) {
                        L = Math.round(M.position.left / 262 * 100) / 100;
                        b.find(".onion-skin .added-frame").css("opacity", L);
                        b.find(".onion-skin .added-frame img").css("opacity", L)
                    }
                });
                if (D > A - 4) I = (A - 4) / D;
                if (s[0].getContext) {
                    s.attr({
                        width: D * I,
                        height: B * I
                    });
                    w.attr({
                        width: D * I,
                        height: B * I
                    });
                    g.find(".added-frame").css({
                        width: D * I + 2,
                        height: B * I + 2
                    });
                    g.find(".deleted-frame").css({
                        width: D * I + 2,
                        height: B * I + 2
                    });
                    t.drawImage(y, y.marginHoriz * I, y.marginVert * I, y.width * I, y.height * I);
                    o.drawImage(z, z.marginHoriz *
                    I, z.marginVert * I, z.width * I, z.height * I);
                    o.blendOnto(t, "difference")
                }
                c.css("height", B * E + 30);
                e.css("height", B * F + 30);
                f.css("height", B * F + 30);
                g.css("height", B * F + 30);
                p.children().removeClass("disabled");
                u(v)
            }
            function G() {
                var A = J / C * 100 + "%";
                b.find(".progress-bar").animate({
                    width: A
                },
                250, "easeOutQuart")
            }
        })
    }
});
GitHub.Commits = {
    elements: [],
    current: null,
    selected: function() {
        return $(this.elements).eq(this.current)
    },
    select: function(a) {
        this.current = a;
        $(".selected").removeClass("selected");
        return this.elements.eq(a).addClass("selected")
    },
    next: function() {
        if (this.current !== null) {
            if (this.elements.length - 1 != this.current) {
                var a = this.select(++this.current);
                a.offset().top - $(window).scrollTop() + 50 > $(window).height() && a.scrollTo(200)
            }
        } else this.select(0)
    },
    prev: function() {
        if (!this.current) {
            this.elements.eq(0).removeClass("selected");
            return this.current = null
        }
        var a = this.select(--this.current);
        a.offset().top - $(window).scrollTop() < 0 && a.scrollTo(200)
    },
    link: function(a) {
        if (GitHub.Commits.current === null) return false;
        window.location = GitHub.Commits.selected().find("[hotkey=" + a + "]").attr("href")
    }
};
$(function() {
    GitHub.Commits.elements = $(".commit");
    $(".page-commits").length && $.hotkeys({
        c: function() {
            GitHub.Commits.link("c")
        },
        enter: function() {
            GitHub.Commits.link("c")
        },
        o: function() {
            GitHub.Commits.link("c")
        },
        p: function() {
            GitHub.Commits.link("p")
        },
        t: function() {
            GitHub.Commits.link("t")
        },
        j: function() {
            GitHub.Commits.next()
        },
        k: function() {
            GitHub.Commits.prev()
        }
    })
});
$(function() {
    $("#imma_student").click(function() {
        $("#student_contact").slideToggle();
        return false
    });
    $("#imma_teacher").click(function() {
        $("#teacher_contact").slideToggle();
        return false
    });
    $("#imma_school_admin").click(function() {
        $("#school_admin_contact").slideToggle();
        return false
    })
});
$(function() {
    $(".contextswitch").each(function() {
        var a = $(this),
        d = a.find(".toggle");
        d.click(function() {
            a.hasClass("nochoices") || a.toggleClass("activated")
        })
    })
});
$(function() {
    $("#your_repos").repoList({
        selector: "#repo_listing",
        ajaxUrl: "/dashboard/ajax_your_repos"
    });
    $("#watched_repos").repoList({
        selector: "#watched_repo_listing",
        ajaxUrl: "/dashboard/ajax_watched_repos"
    });
    $("#org_your_repos").length > 0 && $("#org_your_repos").repoList({
        selector: "#repo_listing",
        ajaxUrl: location.pathname + "/ajax_your_repos"
    });
    $(".reveal_commits, .hide_commits").live("click",
    function() {
        var a = $(this).parents(".details");
        a.find(".reveal, .hide_commits, .commits").toggle();
        return false
    });
    $(".octofication .hide a").click(function() {
        $.post(this.href, null,
        function() {
            $(".octofication").fadeOut()
        });
        return false
    });
    $(".dashboard-notice .dismiss").click(function() {
        var a = $(this).closest(".dashboard-notice");
        $.del(this.href, null,
        function() {
            a.fadeOut()
        });
        return false
    });
    $(".js-dismiss-bootcamp").click(function() {
        var a = $(this).closest(".bootcamp");
        $.post(this.href, null,
        function() {
            a.fadeOut()
        });
        return false
    })
});
$(function() {
    if ($(".repohead").length != 0) {
        $("#repo_details");
        var a = GitHub.hasAdminAccess,
        d = GitHub.watchingRepo,
        b = GitHub.hasForked,
        c = $("#repository_description"),
        e = $("#repository_homepage");
        $(".pledgie").length > 0 && $("#repo_details").addClass("pledgified");
        $(".repohead input[type=search]").enhancedField();
        if (a) {
            $(".editable-only").show();
            $(".for-owner").show()
        }
        b ? $(".for-forked").show() : $(".for-notforked").show();
        if (github_user) if (GitHub.hasForkOfRepo && GitHub.hasForkOfRepo != "") {
            $(".for-hasfork").show();
            $("#your_fork_button").attr("href", "/" + GitHub.hasForkOfRepo);
            $("ul.repo-stats li.forks").addClass("forked").find("a").attr("title", "Forks \u2014 You have a fork")
        }
        $("#download_button").attr("href", GitHub.downloadRepo);
        c.repoInlineEdit({
            name: "description",
            is_owner: a
        });
        e.repoInlineEdit({
            name: "homepage",
            is_owner: a
        });
        $(".subnav-bar").length != 0 && $(".repohead").removeClass("emptyrepohead");
        if (d) {
            $("#unwatch_button").show();
            $("ul.repo-stats li.watchers").addClass("watching").find("a").attr("title", "Watchers \u2014 You're Watching")
        } else $("#watch_button").show();
        if (!github_user) {
            $("#watch_button").enticeToAction();
            $("#fork_button").enticeToAction()
        }
        github_user && GitHub.hasWriteAccess && $("#pull_request_item").show()
    }
});
$(function() {
    var a = $("#url_box");
    if (a.length != 0) {
        a = a.find("ul.clone-urls a");
        var d = $("#url_field"),
        b = $("#url_description strong"),
        c = $("#url_box_clippy"),
        e = $();
        a.click(function() {
            var f = $(this);
            d.val(f.attr("href"));
            c.text(f.attr("href"));
            b.text(f.attr("data-permissions"));
            e.removeClass("selected");
            e = f.parent("li").addClass("selected");
            return false
        });
        $(a[0]).click();
        d.mouseup(function() {
            this.select()
        })
    }
});
GitHub.Uploader = {
    hasFlash: false,
    hasFileAPI: false,
    fallbackEnabled: true,
    fallbackFileSaved: false,
    uploadForm: null,
    defaultRow: null,
    files: {},
    init: function() {
        this.uploadForm = $("#upload_form");
        this.defaultRow = this.uploadForm.find("tr.default");
        this.uploadForm.submit(GitHub.Uploader.uploadFormSubmitted);
        GitHub.Uploader.Flash.init();
        GitHub.Uploader.File.init()
    },
    disableFallback: function() {
        if (this.fallbackEnabled) {
            this.defaultRow.addClass("fallback-disabled");
            this.defaultRow.find("input[type=text]").attr("disabled",
            "disabled");
            this.defaultRow.find("button").attr("disabled", "disabled");
            this.fallbackEnabled = false
        }
    },
    uploadFormSubmitted: function() {
        var a = GitHub.Uploader;
        if (a.fallbackEnabled) if (a.fallbackFileSaved) return true;
        else {
            var d = a.uploadForm.find(".html-file-field").val();
            d = d.replace("C:\\fakepath\\", "");
            if (d == "") return false;
            var b = "application/octet-stream";
            if (typeof FileList != "undefined") b = a.uploadForm.find("input[type=file]")[0].files[0].type;
            d = new GitHub.UploadFile({
                name: d,
                size: 1,
                type: b,
                row: a.defaultRow
            });
            a.saveFile(d);
            return false
        } else return false
    },
    addFileRow: function(a) {
        var d = this.uploadForm.find("tr.template");
        d = d.clone().css("display", "").addClass("filechosen").removeClass("template");
        a.row = d;
        this.files[a.id] = a;
        a.row.find(".js-waiting").hide();
        a.row.find(".js-filename").text(a.name.substr(0, 12)).attr("title", a.name).tipsy();
        a.row.find(".js-filesize").text(Math.round(a.size / 1048576 * 10) / 10 + "MB");
        a.row.find(".js-start-upload").click(function() {
            if (a.row.hasClass("error")) return false;
            GitHub.Uploader.saveFile(a);
            return false
        });
        this.defaultRow.before(d)
    },
    showUploadStarted: function(a) {
        a.row.find(".js-label").text("Uploading\u20260%")
    },
    showProgress: function(a, d) {
        a.row.find(".description label").text("Upload in progress\u2026 " + d + "%")
    },
    showSuccess: function(a) {
        a.row.addClass("succeeded");
        a.row.find(".js-label").text("Upload complete!");
        a.row.find("button").remove();
        $.get(document.location.href,
        function(d) {
            $(".nodownloads").fadeOut();
            $("#uploaded_downloads").hide().html(d).fadeIn()
        })
    },
    saveFile: function(a) {
        a.row.addClass("uploading");
        a.row.find(".js-label").text("Preparing upload");
        a.row.find(".js-description").attr("disabled", "disabled");
        a.row.find("button").attr("disabled", "disabled").find("span").text("Uploading\u2026");
        this.uploadForm.find(".js-not-waiting").hide();
        this.uploadForm.find(".js-waiting").show();
        var d = this.uploadForm.attr("prepare_action");
        $.ajax({
            type: "POST",
            url: d,
            data: {
                file_size: a.size,
                file_name: a.name,
                content_type: a.type,
                description: a.row.find(".js-description").val(),
                redirect: this.fallbackEnabled
            },
            datatype: "json",
            success: function(b) {
                GitHub.Uploader.fileSaveSucceeded(a, b)
            },
            error: function(b) {
                b.status == 422 ? GitHub.Uploader.fileSaveFailed(a, b.responseText) : GitHub.Uploader.fileSaveFailed(a)
            },
            complete: function() {
                GitHub.Uploader.uploadForm.find(".js-not-waiting").show();
                GitHub.Uploader.uploadForm.find(".js-waiting").hide()
            }
        })
    },
    fileSaveSucceeded: function(a, d) {
        a.params.key = d.path;
        a.params.acl = d.acl;
        a.params.Filename = a.name;
        a.params.policy = d.policy;
        a.params.AWSAccessKeyId = d.accesskeyid;
        a.params.signature = d.signature;
        a.params["Content-Type"] = d.mime_type;
        if (a.uploader == "flash") {
            a.params.success_action_status = "201";
            GitHub.Uploader.Flash.upload(a)
        }
        if (this.fallbackEnabled) {
            a.params.redirect = d.redirect;
            this.fallbackFileSaved = true;
            $("#s3_redirect").val(a.params.redirect);
            $("#s3_key").val(a.params.key);
            $("#s3_acl").val(a.params.acl);
            $("#s3_filename").val(a.params.Filename);
            $("#s3_policy").val(a.params.policy);
            $("#s3_accesskeyid").val(a.params.AWSAccessKeyId);
            $("#s3_signature").val(a.params.signature);
            $("#s3_mime_type").val(a.params["Content-Type"]);
            this.uploadForm.submit()
        }
    },
    fileSaveFailed: function(a, d) {
        if (d == null) d = "Something went wrong that shouldn't have. Please try again or contact support if the problem persists.";
        a.row.addClass("error");
        a.row.find(".js-label").text(d);
        a.row.find("button").attr("disabled", "").addClass("danger").find("span").text("Remove");
        a.row.find("button").click(function() {
            a.row.remove();
            return false
        })
    }
};
GitHub.UploadFile = function(a) {
    this.id = a.id;
    this.name = a.name;
    this.row = a.row;
    this.size = a.size;
    this.type = a.type;
    this.uploader = a.uploader;
    this.params = {}
};
GitHub.Uploader.Flash = {
    swfupload: null,
    init: function() {
        if (typeof SWFUpload == "undefined") return false;
        this.swfupload = new SWFUpload({
            upload_url: GitHub.Uploader.uploadForm.attr("action"),
            file_post_name: "file",
            flash_url: "/flash/swfupload.swf",
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_placeholder_id: "flash_choose_file_btn",
            swfupload_loaded_handler: this.flashLoaded,
            file_queued_handler: this.fileQueued,
            upload_start_handler: this.uploadStarted,
            upload_progress_handler: this.uploadProgress,
            upload_error_handler: this.uploadFailure,
            upload_success_handler: this.uploadSuccess
        })
    },
    upload: function(a) {
        this.swfupload.setPostParams(a.params);
        this.swfupload.startUpload(a.id)
    },
    flashLoaded: function() {
        GitHub.Uploader.hasFlash = true;
        GitHub.Uploader.disableFallback();
        GitHub.Uploader.uploadForm.addClass("swfupload-ready")
    },
    fileQueued: function(a) {
        a = new GitHub.UploadFile({
            id: a.id,
            name: a.name,
            size: a.size,
            type: a.type,
            uploader: "flash"
        });
        GitHub.Uploader.addFileRow(a)
    },
    uploadStarted: function(a) {
        a = GitHub.Uploader.files[a.id];
        GitHub.Uploader.showUploadStarted(a)
    },
    uploadProgress: function(a, d, b) {
        a = GitHub.Uploader.files[a.id];
        d = Math.round(d / b * 100);
        GitHub.Uploader.showProgress(a, d)
    },
    uploadSuccess: function(a) {
        a = GitHub.Uploader.files[a.id];
        GitHub.Uploader.showSuccess(a)
    },
    uploadFailure: function(a) {
        a = GitHub.Uploader.files[a.id];
        GitHub.Uploader.fileSaveFailed(a, null)
    }
};
GitHub.Uploader.File = {
    init: function() {
        if (typeof DataTransfer == "undefined") return false;
        if (! ("files" in DataTransfer.prototype)) return false;
        var a = false,
        d = document.createElement("div");
        if ("ondragenter" in d && "ondragover" in d && "ondrop" in d) a = true;
        if (!a) {
            d.setAttribute("ondragenter", "");
            d.setAttribute("ondragover", "");
            d.setAttribute("ondrop", "");
            if (typeof d.ondragenter == "function" && typeof d.ondragover == "function" && typeof d.ondrop == "function") a = true
        }
        if (!a) return false;
        GitHub.Uploader.hasFileAPI = true
    }
};
$(function() {
    GitHub.Uploader.init();
    $(".page-downloads .manage-button").live("click",
    function() {
        $("#manual_downloads").toggleClass("managing");
        return false
    })
});
GitHub.editableGenerator = function(a) {
    return function(d, b) {
        var c = {
            id: "field",
            tooltip: "Click to edit!",
            indicator: "Saving...",
            data: function(e) {
                return $(b).attr("data") || e
            },
            style: "display: inline",
            onblur: "submit",
            callback: function() { (function() {
                    $(b).attr("data") && $(b).attr("data", $(b).text());
                    $(b).trigger("truncate").next().show();
                    $(b).trigger("afterSave.editableGenerator")
                }).delay(20)
            }
        };
        return $(this).editable($(this).attr("rel"), $.extend({},
        c, a))
    }
};
$(function() {
    $(".edit_link").click(function() {
        $(this).prev().trigger("click");
        return false
    })
});
$(function() {
    $(".git_url_facebox").click(function() {
        $.facebox($($(this).attr("rel")).html(), "tip");
        return false
    });
    $(".repo span.edit").each(GitHub.editableGenerator({
        width: "350px"
    }));
    $(".repo span.editarea").each(GitHub.editableGenerator({
        type: "textarea",
        width: "550px",
        height: "100px",
        cancel: "Cancel",
        submit: "OK"
    }));
    $("span.edit, span.editarea").click(function() {
        $(this).next().hide()
    });
    $("#run_postreceive_test").click(function() {
        $.post(location.href + "/test_postreceive", {});
        $.facebox($("#postreceive_test").text());
        return false
    });
    $("#repository_postreceive_url").bind("afterSave.editableGenerator",
    function() {
        $("#repository_postreceive_url").text().slice(0, 4) == "http" ? $("#run_postreceive_test").show() : $("#run_postreceive_test").hide()
    });
    $(".toggle_watch").click(function() {
        if (!github_user) return true;
        $("#watch_button, #unwatch_button").toggle();
        $.post($(this).attr("href"), {});
        return false
    });
    $(".watch_button, .unwatch_button").click(function() {
        if (!github_user) return true;
        $.post($(this).attr("href"), {});
        $(this).parent().find(".watch_button, .unwatch_button").toggle();
        return false
    });
    $("#donation_creation_in_progress").length > 0 && $("#activate_pledgie_button").attr("title", "We're creating your Pledgie account. We'll PM you when it's ready!").find("span").text("Creating account...");
    $(".pagehead .nspr .btn-pull-request").click(function() {
        GitHub.metric("Hit Pull Request Button", {
            "Pull Request Type": "New School",
            Action: GitHub.currentAction,
            "Ref Type": GitHub.revType
        });
        return true
    });
    $(".test_hook").click(function() {
        var f = $(this),
        g = f.prev(".test_hook_message");
        g.text("Sending payload...");
        var h = f.attr("href");
        $.post(h, {
            name: f.attr("rel") || ""
        },
        function() {
            g.text("Payload deployed")
        });
        return false
    });
    $(".add_postreceive_url").click(function() {
        var f = $(this).prev("dl.form").clone();
        console.log(f);
        f.find("input").val("");
        $(this).before(f);
        return false
    });
    $(".remove_postreceive_url").live("click",
    function() {
        if ($(this).closest(".fields").find("dl.form").length < 2) {
            alert("You cannot remove the last post-receive URL");
            return false
        }
        $(this).closest("dl.form").remove();
        return false
    });
    $(".unlock_branch").click(function() {
        var f =
        location.pathname.split("/");
        f = "/" + f[1] + "/" + f[2] + "/unlock_branch/" + f[4];
        var g = $(this).parents(".notification");
        $(this).spin().remove();
        $.post(f,
        function() {
            g.hide()
        });
        return false
    });
    if ($("#edit_repo").length > 0) {
        var a = $("#change_default_branch"),
        d = a.find("select"),
        b = d.val();
        d.change(function() {
            a.removeClass("success").removeClass("error").addClass("loading");
            $.put(a.closest("form").attr("action"), {
                field: "repository_master_branch",
                value: d.val()
            },
            {
                success: function() {
                    a.removeClass("loading").addClass("success");
                    b = d.val()
                },
                error: function() {
                    d.val(b);
                    a.removeClass("loading").addClass("error")
                }
            })
        });
        $(".addon.feature").each(function() {
            var f = $(this);
            f.find(":checkbox").change(function() {
                var g = this;
                f.removeClass("success").removeClass("error").addClass("loading");
                $.put(f.closest("form").attr("action"), {
                    field: g.name,
                    value: g.checked ? 1: 0
                },
                {
                    success: function() {
                        f.removeClass("loading").addClass("success")
                    },
                    error: function() {
                        g.checked = !g.checked;
                        f.removeClass("loading").addClass("error")
                    }
                })
            })
        });
        $("#pages_toggle :checkbox").change(function() {
            $.facebox({
                div: "#pages_box"
            });
            this.checked = !this.checked
        });
        $("#autoresponse_toggle :checkbox").change(function() {
            if (this.checked) {
                $.facebox({
                    div: "#auto_response_editor"
                });
                this.checked = !this.checked
            } else {
                var f = $(this).closest(".addon");
                f.removeClass("success").removeClass("error").addClass("loading");
                $.put(window.location.pathname.replace("edit", "update_pull_request_auto_response"), {
                    success: function() {
                        f.removeClass("loading").addClass("success");
                        f.find(".editlink").remove()
                    }
                })
            }
        });
        var c = function() {
            debug("Setting data.completed to %s",
            $(this).val());
            $(this).data("completed", $(this).val())
        };
        $("#push_pull_collabs input.ac-add-user-input").userAutocomplete().result(c);
        $("#push_pull_collabs form").submit(function() {
            var f = $(this).find(":text"),
            g = f.val();
            debug("Trying to add %s...", g);
            if (!g || !f.data("completed")) return false;
            function h(j) {
                j != null ? $("#push_pull_collabs .error").text(j).show() : $("#push_pull_collabs .error").hide()
            }
            h();
            $.ajax({
                url: this.action,
                data: {
                    member: g
                },
                type: "POST",
                dataType: "json",
                success: function(j) {
                    f.val("").removeClass("ac-accept");
                    j.error ? h(j.error) : $("#push_pull_collabs ul.usernames").append(j.html)
                },
                error: function() {
                    h("An unidentfied error occurred, try again?")
                }
            });
            return false
        });
        $("#push_pull_collabs .remove-user").live("click",
        function() {
            $.del(this.href);
            $(this).closest("li").remove();
            return false
        });
        $("#teams form").submit(function() {
            var f = $(this).find("select"),
            g = f.val();
            function h(j) {
                j != null ? $("#push_pull_collabs .error").text(j).show() : $("#push_pull_collabs .error").hide()
            }
            if (g == "") {
                h("You must select a team");
                return false
            }
            h();
            $.ajax({
                url: this.action,
                data: {
                    team: g
                },
                type: "POST",
                dataType: "json",
                success: function(j) {
                    f.val("");
                    j.error ? h(j.error) : $("#teams ul.teams").append(j.html)
                },
                error: function() {
                    h("An unidentfied error occurred, try again?")
                }
            });
            return false
        });
        $("#teams .remove-team").live("click",
        function() {
            $.del(this.href);
            $(this).closest("li").remove();
            return false
        });
        $(".repohead").is(".vis-public") ? $(".private-only").hide() : $(".public-only").hide();
        c = $("#toggle_visibility");
        c.find("input[type=radio]").change(function(f) {
            if ($(this).attr("value") ==
            "public") {
                f.preventDefault();
                $("input[value=private]").attr("checked", "checked");
                $.facebox({
                    div: "#gopublic_confirm"
                });
                $("#facebox .gopublic_button").click(function() {
                    var g = $("#toggle_visibility input[value=public]");
                    g.attr("checked", "checked");
                    e(g);
                    $.facebox.close()
                });
                $("#facebox .footer").hide();
                return false
            }
            if ($(this).attr("value") == "private") if (confirm("Are you POSITIVE you want to make this public repository private?  All public watchers will be removed.")) e($(this));
            else {
                $("input[value=public]").attr("checked",
                "checked");
                return false
            }
        });
        var e = function(f) {
            var g = $("#toggle_visibility");
            g.removeClass("success").removeClass("error").addClass("loading");
            $.ajax({
                type: "POST",
                url: g.closest("form").attr("action"),
                success: function() {
                    if ($(".repohead").is(".vis-public")) {
                        $(".repohead").removeClass("vis-public").addClass("vis-private");
                        $(".private-only").show();
                        $(".public-only").hide()
                    } else {
                        $(".repohead").removeClass("vis-private").addClass("vis-public");
                        $(".private-only").hide();
                        $(".public-only").show()
                    }
                    g.removeClass("loading").addClass("success")
                },
                error: function() {
                    f.checked = false;
                    g.removeClass("loading").addClass("error")
                }
            })
        };
        $("#copy_permissions ul li a").click(function() {
            $(this).parents("form").submit();
            return false
        });
        $("#delete_repo").click(function() {
            var f = "Are you sure you want to delete this repository?  There is no going back.";
            return confirm(f)
        });
        $("#reveal_delete_repo_info").click(function() {
            $(this).toggle();
            $("#delete_repo_info").toggle();
            return false
        });
        $(document).bind("reveal.facebox",
        function() {
            $("#facebox .renaming_to_field").val($("#rename_field").val())
        })
    }
});
Gollum = {
    encloseStrategy: function(a, d, b) {
        return {
            type: "enclose",
            content: d,
            prefix: a,
            suffix: b
        }
    },
    prefixStrategy: function(a, d, b) {
        return {
            type: "prefixLine",
            prefix: a,
            content: d,
            newline: b
        }
    },
    enclose: function(a, d, b) {
        d = Gollum.Formats[d][b];
        b = a.getSelectionRange();
        if (b.start == b.end) {
            a.insertText(d.prefix + d.content + d.suffix, b.start, b.start, false);
            a.setSelectionRange(b.start + d.prefix.length, b.start + d.prefix.length + d.content.length)
        } else a.insertText(d.prefix + a.getSelectedText() + d.suffix, b.start, b.end, false)
    },
    prefix: function(a,
    d, b) {
        d = Gollum.Formats[d][b];
        b = a.getSelectionRange();
        var c = a.getSelectedText(),
        e = d.prefix;
        if (d.newline) {
            a.setSelectionRange(b.start - 1, b.start);
            var f = a.getSelectedText();
            if (f != "\n") e = "\n" + e
        }
        if (b.start == b.end) {
            a.insertText(e + d.content, b.start, b.start, false);
            a.setSelectionRange(b.start + e.length, b.start + e.length + d.content.length)
        } else a.insertText(e + c + "\n", b.start, b.end, false)
    }
};
Gollum.Formats = {
    asciidoc: {
        bold: Gollum.encloseStrategy("*", "bold text", "*"),
        italic: Gollum.encloseStrategy("_", "italic text", "_"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy(". ", "Numbered list item", true)
    },
    creole: {
        bold: Gollum.encloseStrategy("**", "bold text", "**"),
        italic: Gollum.encloseStrategy("//", "italic text", "//"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("# ", "Numbered list item", true)
    },
    gollum: {
        link: Gollum.encloseStrategy("[[",
        "Page Name", "]]"),
        image: Gollum.encloseStrategy("[[", "/path/to/image.png", "]]")
    },
    markdown: {
        bold: Gollum.encloseStrategy("**", "bold text", "**"),
        italic: Gollum.encloseStrategy("*", "italic text", "*"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("1. ", "Numbered list item", true)
    },
    org: {
        bold: Gollum.encloseStrategy("*", "bold text", "*"),
        italic: Gollum.encloseStrategy("/", "italic text", "/"),
        ul: Gollum.prefixStrategy("- ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("1. ",
        "Numbered list item", true)
    },
    pod: {
        bold: Gollum.encloseStrategy("B<", "bold text", ">"),
        italic: Gollum.encloseStrategy("I<", "italic text", ">"),
        ul: Gollum.prefixStrategy("=item * ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("=item 1. ", "Numbered list item", true)
    },
    rest: {
        bold: Gollum.encloseStrategy("**", "bold text", "**"),
        italic: Gollum.encloseStrategy("*", "italic text", "*"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("1. ", "Numbered list item", true)
    },
    rdoc: {
        bold: Gollum.encloseStrategy("*",
        "bold text", "*"),
        italic: Gollum.encloseStrategy("_", "italic text", "_"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("1. ", "Numbered list item", true)
    },
    textile: {
        bold: Gollum.encloseStrategy("*", "bold text", "*"),
        italic: Gollum.encloseStrategy("_", "italic text", "_"),
        ul: Gollum.prefixStrategy("* ", "Bullet list item", true),
        ol: Gollum.prefixStrategy("# ", "Numbered list item", true)
    }
};
$(function() {
    $("#editbar .link").click(function() {
        var b = $("#guides .write textarea");
        d();
        Gollum.enclose(b, "gollum", "link")
    });
    $("#editbar .image").click(function() {
        var b = $("#guides .write textarea");
        d();
        Gollum.enclose(b, "gollum", "image")
    });
    $("#editbar .bold").click(function() {
        var b = $("#guides .write textarea"),
        c = $("#guides .write select#wiki_format option:selected").attr("value");
        Gollum.enclose(b, c, "bold")
    });
    $("#editbar .italic").click(function() {
        var b = $("#guides .write textarea"),
        c = d();
        Gollum.enclose(b,
        c, "italic")
    });
    $("#editbar .ul").click(function() {
        var b = $("#guides .write textarea"),
        c = d();
        Gollum.prefix(b, c, "ul")
    });
    $("#editbar .ol").click(function() {
        var b = $("#guides .write textarea"),
        c = d();
        Gollum.prefix(b, c, "ol")
    });
    $("#editbar .tab.help a").click(function() {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $("#editbar .sections").slideUp()
        } else {
            $(this).addClass("open");
            if (!$("#editbar .sections .toc .current").get(0)) {
                var b = $("#editbar .sections .toc .headers").get(0);
                a.call(b)
            }
            $("#editbar .sections").slideDown()
        }
        return false
    });
    $("#guides .write select#wiki_format").change(function() {
        var b = $("#editbar .sections .toc div.current").get(0);
        a.call(b)
    });
    function a() {
        $("#editbar .sections .toc div").removeClass("current");
        $(this).addClass("current");
        $("#editbar .sections .page").removeClass("current");
        var b = $(this).attr("class").split(" ");
        b = b[0];
        var c = d();
        $(this).hasClass("gollum") ? $("#editbar .sections .page." + b).addClass("current") : $("#editbar .sections .page." + b + "." + c).addClass("current");
        return false
    }
    function d() {
        return $("#guides .write select#wiki_format option:selected").val()
    }
    $("#editbar .sections .toc div").click(a)
});
$(function() {
    $(".ejection").each(function() {
        var a = $(this),
        d = a.find(".confirming"),
        b = a.find(".ejecting").hide();
        d.find("button, .button").click(function() {
            d.hide();
            b.show();
            return false
        });
        b.find(".cancel").click(function() {
            b.hide();
            d.show();
            return false
        })
    })
});
$(function() {
    $(".trending-repositories .times a").live("click",
    function(a) {
        $(".trending-repositories .ranked-repositories").fadeTo(200, 0.5);
        $(".trending-repositories .trending-heading").contextLoader(28);
        a.preventDefault()
    }).pjax(".trending-repositories", {
        data: {
            trending: true
        },
        timeout: null,
        error: function(a, d) {
            $(".trending-repositories .context-loader").remove();
            $(".trending-repositories .ranked-repositories").fadeTo(0, 1);
            $(".trending-repositories ol").empty().append("<li>Something went wrong: " + d +
            "</li>")
        }
    })
});
$(function() {
    var a = $(".community .bigcount");
    function d() {
        var g = a.width() + parseInt(a.css("padding-left")) + parseInt(a.css("padding-right"));
        a.css("margin-left", "-" + g / 2 + "px");
        a.fadeIn()
    }
    a.length > 0 && setTimeout(d, 500);
    var b = $(".js-slidy-highlight");
    if (b.length > 0) {
        var c = b.find("li.highlight"),
        e = c.width() / 2;
        e += -1;
        var f = function(g) {
            g = g.closest("li");
            var h = g.position();
            h = h.left + g.width() / 2 - e;
            h += parseInt(g.css("margin-left"));
            return h
        };
        b.bind("tabChanged",
        function(g, h) {
            g = f(h.link);
            c.animate({
                left: g
            },
            300)
        });
        b = f(b.find(".selected"));
        c.css({
            left: b
        })
    }
});
$(function() {
    $("#forkqueue #head-sha").text();
    $("#forkqueue .untested:first").each(function() {
        a()
    });
    function a() {
        var c = $("#forkqueue .untested").length,
        e = $("#head-sha").text();
        if (c > 0) {
            var f = $("#forkqueue .untested:first");
            c = f.attr("name");
            $(".icons", f).html('<img src="/images/modules/ajax/indicator.gif" alt="Processing" />');
            $.get("forkqueue/applies/" + e + "/" + c,
            function(g) {
                f.removeClass("untested");
                if (g == "NOPE") {
                    f.addClass("unclean");
                    $(".icons", f).html("")
                } else if (g == "YUP") {
                    f.addClass("clean");
                    $(".icons",
                    f).html("")
                } else $(".icons", f).html("err");
                a()
            })
        }
    }
    $(".action-choice").change(function() {
        var c = $(this).attr("value");
        if (c == "ignore") {
            c = $(this).parents("form");
            var e = c.find("tr:not(:first)"),
            f = c.find("input:checked");
            f.each(function(g, h) {
                g = $(h).attr("ref");
                $(h).parents("tr").children(".icons").html("ignoring...");
                $.post("forkqueue/ignore/" + g, {})
            });
            c = e.length == f.length ? c: f.parents("tr");
            c.fadeOut("normal",
            function() {
                $(this).remove()
            })
        } else if (c == "apply") {
            c = $(this).parents("form");
            c.submit()
        }
        $(this).children(".default").attr("selected",
        1)
    });
    var d = [];
    $("#forkqueue input[type=checkbox]").click(function(c) {
        var e = $(this).attr("class").match(/^r-(\d+)-(\d+)$/),
        f = parseInt(e[1]);
        e = parseInt(e[2]);
        if (c.shiftKey && d.length > 0) {
            c = d[d.length - 1];
            var g = c.match(/^r-(\d+)-(\d+)$/);
            c = parseInt(g[1]);
            g = parseInt(g[2]);
            if (f == c) {
                c = $(this).attr("checked") == true;
                g = [e, g].sort();
                e = g[0];
                g = g[1];
                for (e = e; e < g; e++) c == true ? $("#forkqueue input.r-" + f + "-" + e).attr("checked", "true") : $("#forkqueue input.r-" + f + "-" + e).removeAttr("checked")
            }
        }
        d.push($(this).attr("class"))
    });
    $("#forkqueue a.select_all").click(function() {
        $(this).removeClass("select_all");
        var c = $(this).attr("class");
        $(this).addClass("select_all");
        $("#forkqueue tr." + c + " input[type=checkbox]").attr("checked", "true");
        d = [];
        return false
    });
    $("#forkqueue a.select_none").click(function() {
        $(this).removeClass("select_none");
        var c = $(this).attr("class");
        $(this).addClass("select_none");
        $("#forkqueue tr." + c + " input[type=checkbox]").removeAttr("checked");
        d = [];
        return false
    });
    $("table#queue tr.not-applied:first").each(function() {
        b()
    });
    $("#change-branch").click(function() {
        $("#int-info").hide();
        $("#int-change").show();
        return false
    });
    $("#change-branch-nevermind").click(function() {
        $("#int-change").hide();
        $("#int-info").show();
        return false
    });
    function b() {
        var c = $("table#queue tr.not-applied").length,
        e = $("#head-sha").text();
        if (c > 0) {
            var f = $("#total-commits").text();
            $("#current-commit").text(f - c + 1);
            var g = $("table#queue tr.not-applied:first");
            c = g.attr("name");
            $(".date", g).html("applying");
            $(".icons", g).html('<img src="/images/modules/ajax/indicator.gif" alt="Processing" />');
            $.post("patch/" + e + "/" + c,
            function(h) {
                g.removeClass("not-applied");
                if (h == "NOPE") {
                    g.addClass("unclean_failure");
                    $(".date", g).html("failed");
                    $(".icons", g).html('<img src="/images/icons/exclamation.png" alt="Failed" />')
                } else {
                    $("#head-sha").text(h);
                    g.addClass("clean");
                    $(".date", g).html("applied");
                    $(".apply-status", g).attr("value", "1");
                    $(".icons", g).html('<img src="/images/modules/dashboard/news/commit.png" alt="Applied" />')
                }
                b()
            })
        } else {
            $("#new-head-sha").attr("value", e);
            $("#finalize").show()
        }
    }
    $(".js-fq-new-version").each(function() {
        var c =
        $("#fq-repo").text();
        console.log("repo:", c);
        var e = $(this).hasClass("reload");
        $.smartPoller(function(f) {
            $.getJSON("/cache/network_current/" + c,
            function(g) {
                if (g && g.current) {
                    e && window.location.reload(true);
                    $(".js-fq-polling").hide();
                    $(".js-fq-new-version").show()
                } else f()
            })
        })
    })
});
$(function() {
    if ($(".business .logos").length > 0) {
        var a = [["Shopify", "shopify.png", "http://shopify.com/"], ["CustomInk", "customink.png", "http://customink.com/"], ["Pivotal Labs", "pivotallabs.png", "http://pivotallabs.com/"], ["FiveRuns", "fiveruns.png", "http://fiveruns.com/"], ["PeepCode", "peepcode.png", "http://peepcode.com/"], ["Frogmetrics", "frogmetrics.png", "http://frogmetrics.com/"], ["Upstream", "upstream.png", "http://upstream-berlin.com/"], ["Terralien", "terralien.png", "http://terralien.com/"], ["Planet Argon",
        "planetargon.png", "http://planetargon.com/"], ["Tightrope Media Systems", "tightropemediasystems.png", "http://trms.com/"], ["Rubaidh", "rubaidh.png", "http://rubaidh.com/"], ["Iterative Design", "iterativedesigns.png", "http://iterativedesigns.com/"], ["GiraffeSoft", "giraffesoft.png", "http://giraffesoft.com/"], ["Evil Martians", "evilmartians.png", "http://evilmartians.com/"], ["Crimson Jet", "crimsonjet.png", "http://crimsonjet.com/"], ["Alonetone", "alonetone.png", "http://alonetone.com/"], ["EntryWay", "entryway.png",
        "http://entryway.net/"], ["Fingertips", "fingertips.png", "http://fngtps.com/"], ["Run Code Run", "runcoderun.png", "http://runcoderun.com/"], ["Be a Magpie", "beamagpie.png", "http://be-a-magpie.com/"], ["Rocket Rentals", "rocketrentals.png", "http://rocket-rentals.de/"], ["Connected Flow", "connectedflow.png", "http://connectedflow.com/"], ["Dwellicious", "dwellicious.png", "http://dwellicious.com/"], ["Assay Depot", "assaydepot.png", "http://www.assaydepot.com/"], ["Centro", "centro.png", "http://www.centro.net/"], ["Debuggable Ltd.",
        "debuggable.png", "http://debuggable.com/"], ["Blogage.de", "blogage.png", "http://blogage.de/"], ["ThoughtBot", "thoughtbot.png", "http://www.thoughtbot.com/"], ["Viget Labs", "vigetlabs.png", "http://www.viget.com/"], ["RateMyArea", "ratemyarea.png", "http://www.ratemyarea.com/"], ["Abloom", "abloom.png", "http://abloom.at/"], ["LinkingPaths", "linkingpaths.png", "http://www.linkingpaths.com/"], ["MIKAMAI", "mikamai.png", "http://mikamai.com/"], ["BEKK", "bekk.png", "http://www.bekk.no/"], ["Reductive Labs", "reductivelabs.png",
        "http://www.reductivelabs.com/"], ["Sexbyfood", "sexbyfood.png", "http://www.sexbyfood.com/"], ["Factorial, LLC", "yfactorial.png", "http://yfactorial.com/"], ["SnapMyLife", "snapmylife.png", "http://www.snapmylife.com/"], ["Scrumy", "scrumy.png", "http://scrumy.com/"], ["TinyMassive", "tinymassive.png", "http://www.tinymassive.com/"], ["SOCIALTEXT", "socialtext.png", "http://www.socialtext.com/"], ["All-Seeing Interactive", "allseeinginteractive.png", "http://allseeing-i.com/"], ["Howcast", "howcast.png", "http://www.howcast.com/"],
        ["Relevance Inc", "relevance.png", "http://thinkrelevance.com/"], ["Nitobi Software Inc", "nitobi.png", "http://www.nitobi.com/"], ["99designs", "99designs.png", "http://99designs.com/"], ["EdgeCase, LLC", "edgecase.png", "http://edgecase.com"], ["Plinky", "plinky.png", "http://www.plinky.com/"], ["One Design Company", "onedesigncompany.png", "http://onedesigncompany.com/"], ["CollectiveIdea", "collectiveidea.png", "http://collectiveidea.com/"], ["Stateful Labs", "statefullabs.png", "http://stateful.net/"], ["High Groove Studios",
        "highgroove.png", "http://highgroove.com/"], ["Exceptional", "exceptional.png", "http://www.getexceptional.com/"], ["DealBase", "dealbase.png", "http://www.dealbase.com/"], ["Silver Needle", "silverneedle.png", "http://silverneedlesoft.com/"], ["No Kahuna", "nokahuna.png", "http://nokahuna.com/"], ["Double Encore", "doubleencore.png", "http://www.doubleencore.com/"], ["Yahoo", "yahoo.gif", "http://yahoo.com/"], ["EMI Group Limited", "emi.png", "http://emi.com/"], ["TechCrunch", "techcrunch.png", "http://techcrunch.com/"],
        ["WePlay", "weplay.png", "http://weplay.com/"]],
        d = function() {
            var b = $(".business .logos table");
            $.each(a,
            function(g, h) {
                b.append('<tr><td><a href="' + h[2] + '" rel="nofollow"><img src="http://assets' + g % 4 + ".github.com/images/modules/home/customers/" + h[1] + '" alt="' + h[0] + '" /></a></td></tr>')
            });
            parseInt($(".business .slide").css("top"));
            var c = $(".business .logos td").length - 4,
            e = 0;
            function f() {
                e += 1;
                var g = parseInt($(".business .slide").css("top"));
                if (Math.abs(g + c * 75) < 25) {
                    $(".business .slide").css("top", 0);
                    e =
                    0
                } else $(".business .slide").animate({
                    top: "-" + e * 75 + "px"
                },
                1500)
            }
            setInterval(f, 3000)
        };
        setTimeout(d, 1000)
    }
});
$(function() {
    var a = {
        success: function() {
            $.smartPoller(3000,
            function(d) {
                $.getJSON($("#new_import").attr("action") + "/grab_authors", {},
                function(b) {
                    if (b == false) return d();
                    if (b.length == 0) {
                        $("#new_import input[type=submit]").attr("disabled", "").val("Import SVN Authors").show();
                        alert("No authors were returned, please try a different URL")
                    } else {
                        $.each(b,
                        function(c, e) {
                            c = $('<tr><td><input type="text" readonly="readonly" value="' + e + '" name="svn_authors[]" /></td><td><input type="text" class="git_author" name="git_authors[]"/></td></tr>');
                            c.appendTo("#authors-list")
                        });
                        $("#import-submit").show()
                    }
                    $("#wait").slideUp();
                    $("#import_repo").show();
                    $("#author_entry").slideDown()
                })
            })
        },
        beforeSubmit: function(d, b) {
            d = $("#svn_url").val();
            if (!d.match(/^https?:\/\//) && !d.match(/^svn:\/\//)) {
                alert("Please enter a valid subversion url");
                return false
            }
            b.find("input[type=submit]").hide();
            $("#authors").slideDown()
        }
    };
    $("#new_import").ajaxForm(a);
    $("#import-submit").click(function() {
        $(this).attr("disabled", "disabled");
        var d = false,
        b = $("#authors-list input.git_author[value=]").size(),
        c = $("#authors-list input.git_author").size() - b;
        if (b > 0 && c > 0) {
            alert("You must either fill in all author names or none.");
            d = true
        }
        $("#authors-list input.git_author").each(function() {
            var e = $(this).val();
            if (!d && e != "" && !/^[^<]+<[^>]+>$/.test(e)) {
                alert("'" + e + "' is not a valid git author.  Authors must match the format 'User Name <user@domain>'");
                d = true
            }
        });
        if (d) {
            $("#import-submit").attr("disabled", "");
            return false
        } else $("form#new_repository").submit()
    })
});
$(function() {
    $(".cancel-compose").click(function() {
        window.location = "/inbox";
        return false
    });
    $("#inbox .del a").click(function() {
        var a = $(this),
        d = a.parents(".item"),
        b = d.attr("data-type") == "message" ? "inbox": "notification",
        c = ".js-" + b + "-count";
        a.find("img").attr("src", GitHub.Ajax.spinner);
        $.ajax({
            type: "DELETE",
            url: a.attr("rel"),
            error: function() {
                a.find("img").attr("src", GitHub.Ajax.error)
            },
            success: function() {
                if (d.is(".unread")) {
                    var e = parseInt($(c + ":first").text());
                    if (e > 0) $(c).text(e -= 1);
                    e == 0 && $(c).each(function() {
                        var f =
                        $(this);
                        if (f.is(".new")) f.removeClass("new");
                        else f.parent().is(".new") && f.parent().removeClass("new")
                    })
                }
                d.remove()
            }
        });
        return false
    });
    $("#reveal_deleted").click(function() {
        $(this).parent().hide();
        $(".hidden_message").show();
        return false
    })
});
$(function() {
    $("#impact_graph").length > 0 && GitHub.ImpactGraph.drawImpactGraph()
});
GitHub.ImpactGraph = {
    colors: null,
    data: null,
    chunkVerticalSpace: 2,
    initColors: function(a) {
        seedColors = [[222, 0, 0], [255, 141, 0], [255, 227, 0], [38, 198, 0], [0, 224, 226], [0, 33, 226], [218, 0, 226]];
        this.colors = [];
        var d = 0;
        for (var b in a) {
            var c = seedColors[d % 7];
            if (d > 6) c = [this.randColorValue(c[0]), this.randColorValue(c[1]), this.randColorValue(c[2])];
            this.colors.push(c);
            d += 1
        }
    },
    drawImpactGraph: function() {
        var a = {},
        d = $("#impact_graph").attr("rel"),
        b = this;
        $.smartPoller(function(c) {
            $.getJSON("/" + d + "/graphs/impact_data",
            function(e) {
                if (e &&
                e.authors) {
                    b.initColors(e.authors);
                    var f = b.createCanvas(e);
                    e = b.padChunks(e);
                    b.data = e;
                    $.each(e.buckets,
                    function(g, h) {
                        b.drawBucket(a, h, g)
                    });
                    b.drawAll(f, e, a);
                    b.authorHint()
                } else c()
            })
        })
    },
    createCanvas: function(a) {
        var d = a.buckets.length * 50 * 2 - 50,
        b = 0;
        for (var c in a.buckets) {
            var e = a.buckets[c],
            f = 0;
            for (var g in e.i) {
                var h = e.i[g];
                f += this.normalizeImpact(h[1]) + this.chunkVerticalSpace
            }
            if (f > b) b = f
        }
        $("#impact_graph div").remove();
        a = $("#impact_graph");
        a.height(b + 50).css("border", "1px solid #aaa");
        $("#caption").show();
        a.append('<canvas width="' + d + '" height="' + (b + 30) + '"></canvas>');
        d = $("#impact_graph canvas")[0];
        return d.getContext("2d")
    },
    padChunks: function(a) {
        for (var d in a.authors) {
            var b = this.findFirst(d, a),
            c = this.findLast(d, a);
            for (b = b + 1; b < c; b++) this.bucketHasAuthor(a.buckets[b], d) || a.buckets[b].i.push([d, 0])
        }
        return a
    },
    bucketHasAuthor: function(a, d) {
        for (var b = 0; b < a.i.length; b++) if (a.i[b][0] == parseInt(d)) return true;
        return false
    },
    findFirst: function(a, d) {
        for (var b = 0; b < d.buckets.length; b++) if (this.bucketHasAuthor(d.buckets[b],
        a)) return b
    },
    findLast: function(a, d) {
        for (var b = d.buckets.length - 1; b >= 0; b--) if (this.bucketHasAuthor(d.buckets[b], a)) return b
    },
    colorFor: function(a) {
        a = this.colors[a];
        return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")"
    },
    randColorValue: function(a) {
        var d = Math.round(Math.random() * 100) - 50;
        a = a + d;
        if (a > 255) a = 255;
        if (a < 0) a = 0;
        return a
    },
    drawBucket: function(a, d, b) {
        var c = 0,
        e = this;
        $.each(d.i,
        function(f, g) {
            f = g[0];
            var h = e.normalizeImpact(g[1]);
            a[f] || (a[f] = []);
            a[f].push([b * 100, c, 50, h, g[1]]);
            c = c + h + e.chunkVerticalSpace
        })
    },
    normalizeImpact: function(a) {
        return a <=
        9 ? a + 1: a <= 5000 ? Math.round(10 + a / 50) : Math.round(100 + Math.log(a) * 10)
    },
    drawAll: function(a, d, b) {
        this.drawStreams(a, b, null);
        this.drawDates(d)
    },
    drawStreams: function(a, d, b) {
        a.clearRect(0, 0, 10000, 500);
        $(".activator").remove();
        for (var c in d) c != b && this.drawStream(c, d, a, true);
        b != null && this.drawStream(b, d, a, false)
    },
    drawStream: function(a, d, b, c) {
        b.fillStyle = this.colorFor(a);
        chunks = d[a];
        for (var e = 0; e < chunks.length; e++) {
            var f = chunks[e];
            b.fillRect(f[0], f[1], f[2], f[3]);
            c && this.placeActivator(a, d, b, f[0], f[1], f[2], f[3],
            f[4]);
            if (e != 0) {
                b.beginPath();
                b.moveTo(previousChunk[0] + 50, previousChunk[1]);
                b.bezierCurveTo(previousChunk[0] + 75, previousChunk[1], f[0] - 25, f[1], f[0], f[1]);
                b.lineTo(f[0], f[1] + f[3]);
                b.bezierCurveTo(f[0] - 25, f[1] + f[3], previousChunk[0] + 75, previousChunk[1] + previousChunk[3], previousChunk[0] + 50, previousChunk[1] + previousChunk[3]);
                b.fill()
            }
            previousChunk = f
        }
    },
    drawStats: function(a, d) {
        chunks = d[a];
        for (a = 0; a < chunks.length; a++) {
            d = chunks[a];
            var b = d[4];
            b > 10 && this.drawStat(b, d[0], d[1] + d[3] / 2)
        }
    },
    drawStat: function(a, d, b) {
        var c =
        "";
        c += "position: absolute;";
        c += "left: " + d + "px;";
        c += "top: " + b + "px;";
        c += "width: 50px;";
        c += "text-align: center;";
        c += "color: #fff;";
        c += "font-size: 9px;";
        c += "z-index: 0;";
        $("#impact_graph").append('<p class="stat" style="' + c + '">' + a + "</p>")
    },
    drawDate: function(a, d, b) {
        b += 3;
        var c = "";
        c += "position: absolute;";
        c += "left: " + d + "px;";
        c += "top: " + b + "px;";
        c += "width: 50px;";
        c += "text-align: center;";
        c += "color: #888;";
        c += "font-size: 9px;";
        $("#impact_graph").append('<p style="' + c + '">' + a + "</p>")
    },
    placeActivator: function(a,
    d, b, c, e, f, g) {
        e += 5;
        var h = "";
        h += "position: absolute;";
        h += "left: " + c + "px;";
        h += "top: " + e + "px;";
        h += "width: " + f + "px;";
        h += "height: " + g + "px;";
        h += "z-index: 100;";
        h += "cursor: pointer;";
        c = "a" + c + "-" + e;
        $("#impact_graph").append('<div class="activator" id="' + c + '" style="' + h + '">&nbsp;</div>');
        var j = this;
        $("#" + c).mouseover(function(l) {
            $(l.target).css("background-color", "black").css("opacity", "0.08");
            j.drawAuthor(a)
        }).mouseout(function(l) {
            $(l.target).css("background-color", "transparent");
            j.clearAuthor();
            j.authorHint()
        }).mousedown(function() {
            $(".stat").remove();
            j.clearAuthor();
            j.drawStreams(b, d, a);
            j.drawStats(a, d);
            j.drawSelectedAuthor(a);
            j.authorHint()
        })
    },
    drawDates: function(a) {
        var d = this;
        $.each(a.buckets,
        function(b, c) {
            var e = 0;
            $.each(c.i,
            function(h, j) {
                e += d.normalizeImpact(j[1]) + 1
            });
            var f = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
            g = new Date;
            g.setTime(c.d * 1000);
            c = "" + g.getDate() + " " + f[g.getMonth()] + " " + g.getFullYear();
            d.drawDate(c, b * 100, e + 7)
        })
    },
    authorText: function(a, d, b) {
        var c = null;
        c = b < 25 ? "selected_author_text": "author_text";
        var e = "";
        e += "position: absolute;";
        e += "left: " + d + "px;";
        e += "top: " + b + "px;";
        e += "width: 920px;";
        e += "color: #444;";
        e += "font-size: 18px;";
        $("#impact_legend").append('<p id="' + c + '" style="' + e + '">' + a + "</p>")
    },
    authorHint: function() {
        this.authorText('<span style="color: #aaa;">mouse over the graph for more details</span>', 0, 30)
    },
    drawAuthor: function(a) {
        this.clearAuthor();
        var d = $("#impact_legend canvas")[0].getContext("2d");
        d.fillStyle = this.colorFor(a);
        d.strokeStyle = "#888888";
        d.fillRect(0, 30, 20, 20);
        d.strokeRect(0.5,
        30.5, 19, 19);
        a = this.data.authors[a].n;
        this.authorText(a + ' <span style="color: #aaa;">(click for more info)</span>', 25, 30)
    },
    drawSelectedAuthor: function(a) {
        this.clearSelectedAuthor();
        var d = $("#impact_legend canvas")[0].getContext("2d");
        d.fillStyle = this.colorFor(a);
        d.strokeStyle = "#000000";
        d.fillRect(0, 0, 20, 20);
        d.strokeRect(0.5, 0.5, 19, 19);
        var b = this.data.authors[a];
        a = b.n;
        d = b.c;
        var c = b.a;
        b = b.d;
        this.authorText(a + " (" + d + " commits, " + c + " additions, " + b + " deletions)", 25, 0)
    },
    clearAuthor: function() {
        var a = $("#impact_legend canvas")[0].getContext("2d");
        a.clearRect(0, 30, 920, 20);
        $("#author_text").remove()
    },
    clearSelectedAuthor: function() {
        var a = $("#impact_legend canvas")[0].getContext("2d");
        a.clearRect(0, 0, 920, 20);
        $("#selected_author_text").remove()
    }
};
GitHub.BaseBrowser = {
    pagingLimit: 99,
    showingClosed: false,
    showingOpen: true,
    showingRead: true,
    activeSort: ["created", "desc"],
    currentPage: 1,
    initialized: false,
    errored: false,
    lastUrl: null,
    lastPage: 1,
    listings: $(),
    openListings: $(),
    closedListings: $(),
    unreadListings: $(),
    filteredListings: $(),
    activeIssue: $(),
    listingsElement: null,
    noneShownElement: null,
    errorElement: null,
    loaderElement: null,
    titleElement: null,
    footerElement: null,
    sortElements: null,
    pagingElement: null,
    init: function(a) {
        var d = this;
        this.wrapper = $(a);
        if (this.initialized) return alert("Only one IssueBrowser per page can exist");
        if (this.wrapper.length == 0) return false;
        this.listingsElement = this.wrapper.find(".listings");
        this.noneShownElement = this.wrapper.find(".none");
        this.errorElement = this.wrapper.find(".error");
        this.loaderElement = this.wrapper.find(".context-loader");
        this.titleElement = this.wrapper.find("h2");
        this.footerElement = this.wrapper.find(".footerbar-text");
        this.pagingElement = this.wrapper.find(".paging");
        $.hotkeys({
            j: function() {
                d.cursorDown()
            },
            k: function() {
                d.cursorUp()
            },
            o: function() {
                d.showIssue()
            },
            enter: function() {
                d.showIssue()
            }
        });
        a = this.wrapper.find("ul.filters li");
        a.each(function() {
            var c = $(this);
            switch (c.attr("data-filter")) {
            case "open":
                d.showingOpen && c.addClass("selected");
                c.click(function() {
                    c.toggleClass("selected");
                    d.showOpen(c.hasClass("selected"))
                });
                break;
            case "closed":
                d.showingClosed && c.addClass("selected");
                c.click(function() {
                    c.toggleClass("selected");
                    d.showClosed(c.hasClass("selected"))
                });
                break;
            case "read":
                d.showingRead && c.addClass("selected");
                c.click(function() {
                    c.toggleClass("selected");
                    d.showRead(c.hasClass("selected"))
                });
                break
            }
        });
        this.sortElements = this.wrapper.find("ul.sorts li");
        var b = null;
        this.sortElements.each(function() {
            var c = $(this);
            if (c.attr("data-sort") == d.activeSort[0]) b = c.addClass(d.activeSort[1]);
            c.click(function() {
                var e = $(this);
                b && b.attr("data-sort") != e.attr("data-sort") && b.removeClass("asc").removeClass("desc");
                if (e.hasClass("desc")) {
                    d.sortBy(e.attr("data-sort"), "asc");
                    e.removeClass("desc").addClass("asc")
                } else {
                    d.sortBy(e.attr("data-sort"), "desc");
                    e.removeClass("asc").addClass("desc")
                }
                b = e
            })
        });
        this.pagingElement.find(".button-pager").click(function() {
            d.showMore();
            return false
        });
        this.setupMouseActions();
        this.initNavigation();
        this.initialized = true;
        a = this.listingsElement.find(".preloaded-content");
        if (a.length > 0) {
            this.selectedLink = $(this.wrapper.find('a[href="' + a.attr("data-url") + '"]').get(0));
            this.selectedLink.addClass("selected");
            this.lastUrl = this.selectedLink.attr("href");
            this.render(this.listingsElement.innerHTML)
        }
    },
    setupMouseActions: function() {
        var a = this;
        this.listingsElement.delegate(".listing", "mouseover",
        function() {
            a.activeIssue.removeClass("active");
            a.activeIssue =
            $(this).addClass("active")
        })
    },
    initNavigation: function() {
        var a = this;
        this.selectedLink = null;
        this.wrapper.find("ul.bignav a, ul.smallnav a").click(function(g) {
            var h = $(this);
            if (g.which == 2 || g.metaKey) return true;
            "replaceState" in window.history && !h.hasClass("js-stateless") && window.history.replaceState(null, document.title, h.attr("href"));
            if (a.selectedLink && h.attr("href") == a.selectedLink.attr("href") && !a.errored) return false;
            a.getPulls(h.attr("href"));
            a.selectedLink && a.selectedLink.removeClass("selected");
            a.selectedLink = $(this).addClass("selected");
            return false
        });
        var d = this.wrapper.find(".filterbox input"),
        b = this.wrapper.find("ul.smallnav"),
        c = b.find("li");
        function e() {
            c.show();
            d.val() != "" && c.filter(":not(:Contains('" + d.val() + "'))").hide()
        }
        var f = d.val();
        d.bind("keyup blur click",
        function() {
            if (this.value != f) {
                f = this.value;
                e()
            }
        })
    },
    getPulls: function(a, d) {
        var b = this;
        if (d == undefined) d = {};
        if (a != this.lastUrl) this.currentPage = 1;
        this.startLoading();
        $.ajax({
            url: a,
            data: d,
            success: function(c) {
                b.errored = false;
                b.cancelLoading();
                b.errorElement.hide();
                b.lastPage == d.page || d.page == 1 || d.page == undefined ? b.render(c) : b.render(c, true);
                b.lastUrl = a;
                if (d.page) b.lastPage = d.page
            },
            error: function() {
                b.errored = true;
                b.showError()
            }
        })
    },
    startLoading: function() {
        this.listingsElement.fadeTo(200, 0.5);
        this.noneShownElement.is(":visible") && this.noneShownElement.fadeTo(200, 0.5);
        this.loaderElement.show()
    },
    cancelLoading: function() {
        this.listingsElement.fadeTo(200, 1);
        this.noneShownElement.is(":visible") && this.noneShownElement.fadeTo(200, 1);
        this.loaderElement.hide()
    },
    showError: function() {
        this.cancelLoading();
        this.listings && this.listings.hide();
        this.noneShownElement.hide();
        this.errorElement.show()
    },
    render: function(a, d) {
        if (d == undefined) d = false;
        d ? this.listingsElement.append(a) : this.listingsElement.html(a);
        this.listings = this.listingsElement.find(".listing");
        this.listings.find(".relatize").relatizeDate();
        if (this.currentPage == 1) if (this.listings.length >= this.pagingLimit) {
            this.pagingElement.show();
            $(this.listings[this.listings.length - 1]).remove();
            this.listings = this.listingsElement.find(".listing")
        }
        if (d) {
            this.pagingElement.hide();
            a = $("<div>").append(a).find(".listing");
            if (a > this.pagingLimit) {
                this.pagingElement.show();
                $(this.listings[this.listings.length - 1]).remove();
                this.listings = this.listingsElement.find(".listing")
            }
        }
        this.closedListings = this.listings.filter("[data-state=closed]");
        this.openListings = this.listings.filter("[data-state=open]");
        this.readListings = this.listings.filter("[data-read=1]");
        this.setCounts(this.openListings.length, this.closedListings.length);
        this.update()
    },
    plural: function(a) {
        return a == 1 ? "request": "requests"
    },
    setCounts: function(a, d) {
        var b = a + " open " + this.plural(a);
        a = a + " open " + this.plural(a) + " and " + d + " closed " + this.plural(d);
        this.titleElement.text(b);
        this.footerElement.text(a)
    },
    showOpen: function(a) {
        this.currentPage = 1;
        this.showingOpen = a ? true: false;
        this.remoteUpdate()
    },
    showRead: function(a) {
        this.showingRead = a ? true: false;
        this.update()
    },
    showClosed: function(a) {
        this.currentPage = 1;
        this.showingClosed = a ? true: false;
        this.remoteUpdate()
    },
    showMore: function() {
        this.currentPage++;
        this.remoteUpdate();
        return true
    },
    sortBy: function(a,
    d) {
        this.activeSort = [a, d];
        this.currentPage = 1;
        return this.remoteUpdate()
    },
    cursorToDefault: function() {
        this.activeIssue.removeClass("active");
        this.activeIssue = $(this.listings.filter(":visible").get(0)).addClass("active");
        this.adjustViewForCursor()
    },
    cursorUp: function() {
        for (var a = this.activeIssue.prev(".listing"); ! a.is(":visible") && a.length != 0;) a = a.prev(".listing");
        if (a.length != 0) {
            this.activeIssue.removeClass("active");
            this.activeIssue = a.addClass("active");
            this.adjustViewForCursor()
        }
    },
    cursorDown: function() {
        for (var a =
        this.activeIssue.next(".listing"); ! a.is(":visible") && a.length != 0;) a = a.next(".listing");
        if (a.length != 0) {
            this.activeIssue.removeClass("active");
            this.activeIssue = a.addClass("active");
            this.adjustViewForCursor()
        }
    },
    adjustViewForCursor: function() {
        var a = this.activeIssue;
        if (a.offset()) if (a.offset().top - $(window).scrollTop() + 20 > $(window).height()) a.scrollTo(10);
        else a.offset().top - $(window).scrollTop() < 0 && $("html,body").animate({
            scrollTop: a.offset().top - $(window).height()
        },
        200)
    },
    showIssue: function() {
        document.location =
        this.activeIssue.find("h3 a").attr("href")
    },
    update: function() {
        if (this.listings != null) {
            this.listings.show();
            this.showingClosed || this.closedListings.hide();
            this.showingOpen || this.openListings.hide();
            this.showingRead || this.readListings.hide();
            this.filteredListings.hide();
            var a = this.listings.filter(":visible").length;
            a == 0 ? this.noneShownElement.show() : this.noneShownElement.hide();
            this.cursorToDefault()
        }
    },
    remoteUpdate: function() {
        var a = {
            sort: this.activeSort[0],
            direction: this.activeSort[1],
            page: this.currentPage,
            exclude: ["none"]
        };
        if (!this.showingClosed || !this.showingOpen) {
            this.showingOpen || a.exclude.push("open");
            this.showingClosed || a.exclude.push("closed");
            a.exclude = a.exclude.join(",")
        }
        this.getPulls(this.lastUrl, a)
    }
};
GitHub.PullRequestBrowser = {};
jQuery.extend(true, GitHub.PullRequestBrowser, GitHub.BaseBrowser);
$(function() {
    $("#js-issue-list").length > 0 && GitHub.PullRequestBrowser.init("#js-issue-list")
});
$(function() {
    var a = $("#issues_next");
    if (a.length != 0) {
        var d = function(p, r) {
            if (window.history && window.history.pushState) $.pjax({
                container: p,
                timeout: null,
                url: r
            });
            else {
                if ($.isFunction(r)) r = r();
                window.location = r
            }
        },
        b = a.find(".js-new-label-form");
        if (b.length != 0) {
            var c = b.find(".js-label-field"),
            e = b.find(".js-color-chooser-fade-in");
            c.focus(function() {
                e.fadeIn(300)
            })
        }
        var f = function() {
            var p = a.find(".js-editable-labels-show"),
            r = a.find(".js-editable-labels-edit");
            if (p.length > 0) {
                var v = $(".js-manage-labels");
                v.bind("click",
                function(C) {
                    C.preventDefault();
                    if (p.is(":visible")) {
                        p.hide();
                        r.show();
                        v.addClass("selected");
                        $(document).bind("keydown.manage-labels",
                        function(J) {
                            J.keyCode == 27 && v.click()
                        })
                    } else {
                        r.hide();
                        p.show();
                        v.removeClass("selected");
                        $(document).unbind("keydown.manage-labels")
                    }
                });
                $(".js-custom-color-field").each(function() {
                    var C = $(this),
                    J = C.find(".field"),
                    y = C.find("a");
                    J.hide();
                    y.click(function() {
                        J.show();
                        return false
                    });
                    J.find("input[type=text]").keyup(function() {
                        var z = $(this).val();
                        if (z.length == 6) {
                            J.find("input[type=radio]").val(z).attr("checked",
                            "checked");
                            y.html("Custom color: <strong>#" + z + "</strong>")
                        }
                    })
                });
                r.find(".editable-label").each(function() {
                    var C = $(this);
                    C.contextButton(".js-color-picker", {
                        contextPaneSelector: "." + C.find(".js-color-picker").attr("data-pane-selector")
                    })
                })
            }
        };
        f();
        var g = a.find("#issues_list");
        if (g.length > 0) { (b = g.attr("data-params")) && "replaceState" in window.history && window.history.replaceState(null, document.title, location.pathname + "?" + b);
            g.bind("start.pjax",
            function() {
                if (!jQuery.pjax.firstLoad) {
                    g.find(".context-loader").show();
                    g.find(".issues").fadeTo(200, 0.5)
                }
            }).bind("end.pjax",
            function() {
                if (!jQuery.pjax.firstLoad) {
                    g.find(".issues").fadeTo(200, 1);
                    g.find(".context-loader").hide();
                    f()
                }
            });
            var h = function() {
                var p = {
                    labels: [],
                    sort: "",
                    direction: "",
                    state: "",
                    page: 1
                },
                r = g.find(".milestone-context").attr("data-selected-milestone");
                if (r != "" && r != null) p.milestone = r;
                g.find(".sidebar ul.labels").find(".selected").each(function(v, C) {
                    p.labels.push($(C).attr("data-label"))
                });
                p.labels = p.labels.join(",");
                p.labels == "" && delete p.labels;
                r = g.find(".main .filterbar ul.sorts").find(".asc, .desc");
                p.sort = r.attr("data-sort");
                p.direction = r.attr("class");
                p.state = g.find(".main .filterbar ul.filters").find(".selected").attr("data-filter");
                r = g.find("ul.bignav").find(".selected").attr("href");
                return r + "?" + $.param(p)
            };
            b = [".sidebar ul.bignav a", ".sidebar ul.labels a", ".main .filterbar ul.filters li", ".main .filterbar ul.sorts li", ".milestone-context .pane-selector .milestone"];
            g.find(b.join(",")).pjax(g.selector, {
                timeout: null,
                url: h
            });
            g.delegate(".pagination a, #clear-active-filters", "click",
            function(p) {
                p.preventDefault();
                d(g.selector, $(this).attr("href"))
            });
            g.selectableList(".sidebar ul.bignav", {
                mutuallyExclusive: true
            });
            g.selectableList(".sidebar ul.labels");
            g.selectableList(".main .filterbar ul.filters", {
                wrapperSelector: "",
                mutuallyExclusive: true
            });
            g.selectableList(".js-selectable-issues", {
                wrapperSelector: "",
                itemParentSelector: ".issue",
                enableShiftSelect: true,
                ignoreLinks: true
            });
            g.sortableHeader(".main .filterbar ul.sorts");
            g.contextButton(".sidebar .milestone .js-milestone-context", {
                contextPaneSelector: ".milestone-context"
            });
            g.delegate(".milestone-context .pane-selector .milestone", "click",
            function() {
                var p = $(this);
                p.closest(".milestone-context").attr("data-selected-milestone", p.attr("data-milestone"));
                p.closest(".milestone-context").trigger("close")
            });
            g.delegate(".issues table", "click",
            function(p) {
                var r = $(p.target);
                if (p.which > 1 || p.metaKey || r.closest("a").length) return true;
                p = $(this);
                var v = p.find(".issue.selected"),
                C = g.find(".issues .actions .buttons");
                if (v.length > 0) {
                    C.addClass("activated");
                    C.removeClass("deactivated")
                } else {
                    C.removeClass("activated");
                    C.addClass("deactivated")
                }
                p.find(".issue.active").removeClass("active");
                r.closest(".issue").addClass("active")
            });
            g.find(":checked").removeAttr("checked");
            var j = "active",
            l = function(p) {
                var r = {
                    issues: []
                };
                g.find(".issues :checked").each(function(v, C) {
                    r.issues.push($(C).val())
                });
                $.ajax({
                    url: p || g.find(".issues .btn-close").attr("data-url"),
                    method: "put",
                    data: $.param(r),
                    success: function() {
                        d(g.selector, h)
                    }
                })
            };
            c = function() {
                var p = g.find(".issues ." + j),
                r = g.find(".issues .issue:first"),
                v = g.find(".issues .issue:last");
                if (p.length > 0) if (p[0] == v[0]) {
                    p.removeClass(j);
                    r.addClass(j)
                } else p.removeClass(j).next().addClass(j);
                else g.find(".issues .issue:first").addClass("active")
            };
            var k = function() {
                var p = g.find(".issues ." + j),
                r = g.find(".issues .issue:first"),
                v = g.find(".issues .issue:last");
                if (p.length > 0) if (p[0] == r[0]) {
                    p.removeClass(j);
                    v.addClass(j)
                } else p.removeClass(j).prev().addClass(j);
                else g.find(".issues .issue:last").addClass(j)
            },
            m = function() {
                var p = g.find(".issues ." + j);
                if (p.length > 0) window.location = p.find(".info h3 a").attr("href")
            },
            n = function() {
                var p = g.find(".issues ." + j);
                p.length > 0 && p.click()
            },
            q = function() {
                window.location = a.find(".btn-new-issue").attr("href")
            },
            s = function(p) {
                p.preventDefault();
                $("#new_label_form .namefield").focus()
            };
            $.hotkeys({
                e: l,
                j: c,
                k: k,
                o: m,
                enter: m,
                x: n,
                c: q,
                l: s
            });
            var w = "#issues_list .label-context";
            g.delegate(".label-context button.update-labels", "click",
            function() {
                $(this);
                var p = {
                    labels: [],
                    issues: []
                };
                g.find(".label-context ul.labels :checked").each(function(r, v) {
                    p.labels.push($(v).val())
                });
                g.find(".issues :checked").each(function(r,
                v) {
                    p.issues.push($(v).val())
                });
                $(this).closest(".label-context").trigger("close");
                $.ajax({
                    url: g.find(".label-context ul.labels").attr("data-url"),
                    method: "put",
                    data: p,
                    complete: function() {
                        d(g.selector, h)
                    }
                })
            });
            g.selectableList(".label-context ul.labels");
            g.delegate(".issues .btn-close, .issues .btn-reopen", "click",
            function() {
                l($(this).attr("data-url"))
            });
            g.delegate(".issues .btn-label", "click",
            function() {
                var p = g.find(".issues :checked").closest(".issue").find(".label");
                a.find(w + " .label a.selected").removeClass("selected");
                a.find(w + " :checked").attr("checked", false);
                p.each(function(r, v) {
                    r = $(v).attr("data-name");
                    a.find(w + " .label[data-name=" + r + "] a").addClass("selected");
                    a.find(w + " .label[data-name=" + r + "] :checkbox").attr("checked", true)
                })
            });
            g.contextButton(".issues .btn-label", {
                contextPaneSelector: w
            });
            g.contextButton(".issues .btn-assignee", {
                contextPaneSelector: ".assignee-assignment-context"
            });
            g.contextButton(".issues .btn-milestone", {
                contextPaneSelector: ".milestone-assignment-context"
            });
            var t = function(p) {
                p = $(p.target).closest(".assignee-assignment-context").find(":checked");
                var r = {
                    issues: [],
                    assignee: p.val()
                };
                g.find(".issues :checked").each(function(v, C) {
                    r.issues.push($(C).val())
                });
                $.ajax({
                    url: p.attr("data-url"),
                    method: "put",
                    data: $.param(r),
                    success: function() {
                        d(g.selector, h)
                    }
                })
            };
            g.delegate(".issues .btn-assignee", "click",
            function() {
                var p = $(".assignee-assignment-context");
                if (p.data("applied") != true) {
                    p.data("applied", true);
                    p.assigneeFilter(t)
                }
            });
            g.delegate(".assignee-assignment-context :radio", "change", t);
            g.delegate(".milestone-assignment-context input[type=radio]", "change",
            function() {
                var p = $(this),
                r = {
                    issues: [],
                    milestone: p.val()
                };
                g.find(".issues :checked").each(function(v, C) {
                    r.issues.push($(C).val())
                });
                $.ajax({
                    url: p.attr("data-url"),
                    method: "put",
                    data: $.param(r),
                    success: function() {
                        d(g.selector, h)
                    }
                })
            });
            g.selectableList("ul.color-chooser", {
                wrapperSelector: "li.color",
                mutuallyExclusive: true
            });
            g.delegate("ul.color-chooser li.color", "click",
            function() {
                $(this).find("input[type=radio]").val();
                var p = $("#custom_label_text");
                p.text(p.attr("data-orig"))
            });
            $(document).bind("reveal.facebox",
            function() {
                var p = $("#facebox .custom-hex-value-field").val("").focus();
                if (p.length > 0) {
                    var r = $("#facebox .warning").hide();
                    $("#facebox form").submit(function(v) {
                        v.preventDefault();
                        if (p.val().length != 6) r.show();
                        else {
                            v = $("#custom_label_color_field");
                            v.val(p.val());
                            v.attr("checked", true);
                            g.find("ul.color-chooser li.selected").removeClass("selected");
                            v = $("#custom_label_text");
                            v.text(v.attr("data-orig") + ": #" + p.val());
                            $.facebox.close()
                        }
                        return false
                    })
                }
            });
            g.delegate(b.join(","), "click",
            function(p) {
                if (!window.history ||
                !window.history.pushState) {
                    p.preventDefault();
                    window.location = h()
                }
            })
        }
        var o = a.find("#milestone_list");
        if (o.length > 0) {
            o.bind("start.pjax",
            function() {
                if (!jQuery.pjax.firstLoad) {
                    o.find(".context-loader").show();
                    o.find(".milestones").fadeTo(200, 0.5)
                }
            }).bind("end.pjax",
            function() {
                if (!jQuery.pjax.firstLoad) {
                    o.find(".milestones").fadeTo(200, 1);
                    o.find(".context-loader").hide()
                }
            });
            b = [".sidebar ul.bignav a", ".main .filterbar ul.filters li", ".main .filterbar ul.sorts li"];
            o.delegate(b.join(","), "click",
            function(p) {
                if (p.which ==
                1 && !p.metaKey) {
                    p.preventDefault();
                    p = $(this).attr("href") || $(this).attr("data-href");
                    d(o.selector, p)
                }
            });
            o.selectableList(".sidebar ul.bignav", {
                mutuallyExclusive: true
            });
            o.selectableList(".main .filterbar ul.filters", {
                wrapperSelector: "",
                mutuallyExclusive: true
            });
            o.sortableHeader(".main .filterbar ul.sorts")
        }
    }
});
$(function() {
    var a = $("#issues_next #js-new-issue-form");
    if (a.length != 0) {
        a.selectableList("ul.labels");
        var d = function() {
            var g = a.find("input.title");
            if (g.val().length > 0) {
                g.addClass("valid");
                $(".js-title-missing-error").hide()
            } else {
                g.removeClass("valid");
                $(".js-title-missing-error").show()
            }
        };
        a.bind("submit",
        function() {
            d();
            if ($(".js-title-missing-error").is(":visible")) return false
        });
        a.find("input.title").keypress(d).change(d);
        a.contextButton(".js-milestone-context-button", {
            contextPaneSelector: ".js-milestone-context",
            anchorTo: "right"
        });
        var b = a.find(".js-milestone-context"),
        c = a.find(".infobar .milestone .text");
        b.find("label").click(function() {
            var g = $(this).find("input[type=radio]");
            g.val() == "" ? c.html("No milestone") : c.html("Milestone: <strong>" + $(this).find("h4").text())
        });
        a.contextButton(".js-assignee-context-button", {
            contextPaneSelector: ".js-assignee-context",
            anchorTo: "left"
        }).bind("show.context-button",
        function() {
            $(".context-pane:visible :text").focus()
        });
        var e = a.find(".js-assignee-context"),
        f = a.find(".infobar .assignee .text");
        e.assigneeFilter(function() {
            e.find(".current").click()
        });
        e.find("li").click(function() {
            var g = $(this).find("input[type=radio]");
            g.val() == "" ? f.html("No one is assigned") : f.html("Assignee: <strong>" + $(this).find("h4").html())
        });
        a.find(".js-pane-radio-selector").each(function() {
            var g = $(this),
            h = g.closest(".context-pane");
            g.find("label").click(function() {
                var j = $(this);
                g.find(".selected").removeClass("selected");
                j.addClass("selected");
                h.trigger("close")
            })
        })
    }
});
$(function() {
    var a = $("#issues_next #issues_search");
    if (a.length != 0) {
        var d = $("#js-issues-quicksearch").val();
        a.find("input[type=radio], select").change(function() {
            var b = $(this).closest("form");
            b.find("#search_q").val(d);
            b.submit()
        })
    }
});
$(function() {
    var a = $("#issues_next #show_issue");
    if (a.length != 0) {
        a.find(".avatar-bubble").editableComment();
        var d = function() {
            window.location = $("#to_isssues_list").attr("href")
        };
        $.hotkeys({
            u: d
        });
        a.contextButton(".js-assignee-context", {
            contextPaneSelector: ".assignee-context"
        }).bind("show.context-button",
        function() {
            $(".context-pane:visible :text").focus()
        });
        a.find(".assignee-context").assigneeFilter(function() {
            a.find(".assignee-context form").submit()
        });
        a.contextButton(".js-milestone-context", {
            contextPaneSelector: ".milestone-context",
            anchorTo: "right"
        });
        a.contextButton(".js-label-context", {
            contextPaneSelector: ".label-context",
            anchorTo: "right"
        });
        a.selectableList(".js-selectable-labels");
        var b = a.find(".js-filterable-labels li");
        d = a.find(".js-label-filter");
        d.keyup(function() {
            var e = $(this).val();
            e != "" && e != null ? b.each(function() {
                var f = $(this),
                g = f.text().toLowerCase();
                g.score(e) > 0 ? f.show() : f.hide()
            }) : b.each(function() {
                $(this).show()
            })
        });
        var c = a.find(".js-autosubmitting-labels");
        c.find("input[type=checkbox]").change(function() {
            $.post(c.attr("action"),
            c.serialize())
        });
        d = $(".js-pane-selector-autosubmit");
        d.delegate("input[type=radio]", "change",
        function() {
            var e = $(this);
            e.closest("form").submit()
        })
    }
});
var location_with_hash = location.pathname + location.hash,
matches = location_with_hash.match(/#issue\/(\d+)(\/comment\/(\d+))?/);
if (matches) {
    var issue_number = matches[1],
    comment_id = matches[3];
    if (issue_number) window.location = comment_id ? location_with_hash.replace(/\/?#issue\/\d+\/comment\/\d+/, "/" + issue_number + "#comment_" + comment_id) : location_with_hash.replace(/\/?#issue\/\d+/, "/" + issue_number)
}
jQuery(function(a) {
    var d = a("#issues_next");
    if (d.length != 0) {
        var b = function(f) {
            f.preventDefault();
            a("#js-issues-quicksearch").focus()
        };
        a.hotkeys({
            "/": b
        });
        var c = a("#js-issues-quicksearch");
        if (c.length > 0) {
            b = d.find(".btn-new-issue");
            var e = c.offset();
            d.find(".search .autocomplete-results").css({
                left: c.position().left,
                top: c.outerHeight(true) + 5,
                width: b.offset().left - e.left + b.outerWidth(true)
            });
            c.quicksearch({
                results: d.find(".search .autocomplete-results"),
                insertSpinner: function(f) {
                    c.closest("form").prepend(f)
                }
            }).bind("focus",
            function() {
                a(this).closest(".fieldwrap").addClass("focused")
            }).bind("blur",
            function() {
                a(this).closest(".fieldwrap").removeClass("focused")
            }).css({
                outline: "none"
            })
        }
    }
});
$(function() {
    $("#add_key_action").click(function() {
        $(this).toggle();
        $("#new_key_form_wrap").toggle().find(":text").focus();
        return false
    });
    $(".edit_key_action").live("click",
    function() {
        $.gitbox($(this).attr("href"));
        return false
    });
    $("#cancel_add_key").click(function() {
        $("#add_key_action").toggle();
        $("#new_key_form_wrap").toggle().find("textarea").val("");
        $("#new_key").find(":text").val("");
        $("#new_key .error_box").remove();
        return false
    });
    $(".cancel_edit_key").live("click",
    function() {
        $.facebox.close();
        $("#new_key .error_box").remove();
        return false
    });
    $(".delete_key").live("click",
    function() {
        if (confirm("Are you sure you want to delete this key?")) {
            $.ajax({
                type: "POST",
                data: {
                    _method: "delete"
                },
                url: $(this).attr("href")
            });
            $(this).parents("ul");
            $(this).parent().remove()
        }
        return false
    });
    $(".key_editing").live("submit",
    function() {
        var a = this;
        $(a).find(".error_box").remove();
        $(a).find(":submit").attr("disabled", true).spin();
        $(a).ajaxSubmit(function(d) {
            if (d.substring(0, 3) == "<li") {
                if ($(a).attr("id").substring(0,
                4) == "edit") {
                    $("#" + $(a).attr("id").substring(5)).replaceWith(d);
                    $.facebox.close()
                } else {
                    $("ul.public_keys").append(d);
                    $("#add_key_action").toggle();
                    $("#new_key_form_wrap").toggle()
                }
                $(a).find("textarea").val("");
                $(a).find(":text").val("")
            } else $(a).append(d);
            $(a).find(":submit").attr("disabled", false).stopSpin()
        });
        return false
    })
});
GitHub = GitHub || {};
GitHub.metric = function(a, d) {
    if (!window.mpq) return GitHub.metric = $.noop;
    d ? mpq.push([d.type || "track", a, d]) : mpq.push(["track", a])
};
GitHub.trackClick = function(a, d, b) {
    if (!window.mpq) return GitHub.trackClick = $.noop;
    $(a).click(function() {
        b = $.isFunction(b) ? b.call(this) : b;
        GitHub.metric(d, b);
        return true
    })
};
$(function() {
    var a = GitHub.trackClick;
    a("#entice-signup-button", "Entice banner clicked");
    a("#coupon-redeem-link", "Clicked Dec 2010 Sale Notice");
    a("#watch_button", "Watched Repo", {
        repo: GitHub.nameWithRepo
    });
    a("#unwatch_button", "Unwatched Repo", {
        repo: GitHub.nameWithRepo
    });
    a(".btn-follow", "Followed User",
    function() {
        return {
            user: $(this).attr("data-user")
        }
    });
    a(".btn-unfollow", "Unfollowed User",
    function() {
        return {
            user: $(this).attr("data-user")
        }
    })
});
DateInput.prototype.resetDate = function() {
    $(".date_selector .selected").removeClass("selected");
    this.changeInput("")
};
$(function() {
    $("input.js-date-input").each(function() {
        var a = new DateInput(this);
        a.hide = $.noop;
        a.show();
        $(this).hide();
        $(".date_selector").addClass("no_shadow")
    });
    $("label.js-date-input a").click(function() {
        var a = $("input.js-date-input").data("datePicker");
        a.resetDate()
    })
});
function defineNetwork(a) {
    function d(b, c, e) {
        this.container = b;
        this.width = c;
        this.height = e;
        this.loaderInterval = null;
        this.loaderOffset = 0;
        this.ctx = this.initCanvas(b, c, e);
        this.startLoader("Loading graph data");
        this.loadMeta()
    }
    d.prototype = {
        initCanvas: function(b) {
            b = a(b).find("canvas")[0];
            b.style.zIndex = "0";
            return b.getContext("2d")
        },
        startLoader: function(b) {
            this.ctx.save();
            this.ctx.font = "14px Monaco, monospace";
            this.ctx.fillStyle = "#99b2cc";
            this.ctx.textAlign = "center";
            this.ctx.fillText(b, this.width / 2, 85);
            this.ctx.restore();
            var c = this;
            this.loaderInterval = setInterval(function() {
                c.displayLoader()
            },
            75)
        },
        stopLoader: function() {
            clearInterval(this.loaderInterval)
        },
        displayLoader: function() {
            colors = ["#36689a", "#4a77a4", "#5e86ae", "#9cb4cd"];
            this.ctx.save();
            this.ctx.translate(this.width / 2 + 0.5, 50);
            this.ctx.clearRect( - 16, -16, 32, 32);
            this.ctx.rotate(this.loaderOffset * (Math.PI / 6));
            for (var b = 0; b < 12; b++) {
                this.ctx.fillStyle = colors[b] || "#c4d2e1";
                this.ctx.beginPath();
                this.ctx.moveTo( - 1.5, -8);
                this.ctx.lineTo( - 1.5, -15);
                this.ctx.lineTo(0, -16);
                this.ctx.lineTo(1.5, -15);
                this.ctx.lineTo(1.5, -8);
                this.ctx.lineTo( - 1.5, -8);
                this.ctx.fill();
                this.ctx.rotate( - Math.PI / 6)
            }
            this.ctx.restore();
            this.loaderOffset = (this.loaderOffset + 1) % 12
        },
        waitForCurrent: function(b) {
            var c = this;
            c.current ? b({
                current: true
            }) : a(".js-network-poll").each(function() {
                var e = a(this).attr("rel");
                a.smartPoller(function(f) {
                    a.getJSON("/cache/network_current/" + e,
                    function(g) {
                        if (g && g.current) {
                            c.current = true;
                            b(g)
                        } else f()
                    })
                })
            })
        },
        loadMeta: function() {
            var b = this;
            b.loaded = false;
            a.smartPoller(function(c) {
                a.ajax({
                    url: "network_meta",
                    dataType: "json",
                    success: function(e) {
                        if (e && e.nethash) {
                            b.loaded = true;
                            b.init(e)
                        } else b.waitForCurrent(function() {
                            a(".js-network-poll").hide();
                            a(".js-network-current").show();
                            b.loaded || c()
                        })
                    },
                    error: function() {
                        c()
                    }
                })
            })
        },
        init: function(b) {
            this.focus = b.focus;
            this.nethash = b.nethash;
            this.spaceMap = b.spacemap;
            this.userBlocks = b.blocks;
            this.commits = [];
            for (var c = 0; c < b.dates.length; c++) this.commits.push(new d.Commit(c, b.dates[c]));
            this.users = {};
            for (c = 0; c < b.users.length; c++) {
                var e = b.users[c];
                this.users[e.name] = e
            }
            this.chrome =
            new d.Chrome(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users);
            this.graph = new d.Graph(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash);
            this.mouseDriver = new d.MouseDriver(this.container, this.chrome, this.graph);
            this.keyDriver = new d.KeyDriver(this.container, this.chrome, this.graph);
            this.stopLoader();
            this.graph.drawBackground();
            this.chrome.draw();
            this.graph.requestInitialChunk()
        },
        initError: function() {
            this.stopLoader();
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.startLoader("Graph could not be drawn due to a network IO problem.")
        }
    };
    d.Commit = function(b, c) {
        this.time = b;
        this.date = Date.parseISO8601(c);
        this.populated = this.requested = null
    };
    d.Commit.prototype = {
        populate: function(b, c, e) {
            this.user = c;
            this.author = b.author;
            this.date = Date.parseISO8601(b.date);
            this.gravatar = b.gravatar;
            this.id = b.id;
            this.login = b.login;
            this.message = b.message;
            this.space = b.space;
            this.time = b.time;
            this.parents = this.populateParents(b.parents, e);
            this.requested = true;
            this.populated = new Date
        },
        populateParents: function(b, c) {
            for (var e = [], f = 0; f < b.length; f++) {
                var g = b[f],
                h = c[g[1]];
                h.id = g[0];
                h.space = g[2];
                e.push(h)
            }
            return e
        }
    };
    d.Chrome = function(b, c, e, f, g, h, j, l) {
        this.namesWidth = 100;
        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.userBgColors = ["#EBEBFF", "#E0E0FF"];
        this.network = b;
        this.ctx = c;
        this.width = e;
        this.height = f;
        this.commits = h;
        this.userBlocks = j;
        this.users = l;
        this.offsetX = this.namesWidth + (e - this.namesWidth) /
        2 - g * 20;
        this.offsetY = 0;
        this.contentHeight = this.calcContentHeight();
        this.graphMidpoint = this.namesWidth + (e - this.namesWidth) / 2;
        this.activeUser = null
    };
    d.Chrome.prototype = {
        moveX: function(b) {
            this.offsetX += b;
            if (this.offsetX > this.graphMidpoint) this.offsetX = this.graphMidpoint;
            else if (this.offsetX < this.graphMidpoint - this.commits.length * 20) this.offsetX = this.graphMidpoint - this.commits.length * 20
        },
        moveY: function(b) {
            this.offsetY += b;
            if (this.offsetY > 0 || this.contentHeight < this.height - 40) this.offsetY = 0;
            else if (this.offsetY <
            -this.contentHeight + this.height / 2) this.offsetY = -this.contentHeight + this.height / 2
        },
        calcContentHeight: function() {
            for (var b = 0, c = 0; c < this.userBlocks.length; c++) {
                var e = this.userBlocks[c];
                b += e.count
            }
            return b * 20
        },
        hover: function(b, c) {
            for (var e = 0; e < this.userBlocks.length; e++) {
                var f = this.userBlocks[e];
                if (b > 0 && b < this.namesWidth) if (c > 40 + this.offsetY + f.start * 20) if (c < 40 + this.offsetY + (f.start + f.count) * 20) return this.users[f.name]
            }
            return null
        },
        draw: function() {
            this.drawTimeline(this.ctx);
            this.drawUsers(this.ctx);
            this.drawFooter(this.ctx)
        },
        drawTimeline: function(b) {
            b.fillStyle = "#111111";
            b.fillRect(0, 0, this.width, 20);
            b.fillStyle = "#333333";
            b.fillRect(0, 20, this.width, 20);
            var c = parseInt((0 - this.offsetX) / 20);
            if (c < 0) c = 0;
            var e = c + parseInt(this.width / 20);
            if (e > this.commits.length) e = this.commits.length;
            b.save();
            b.translate(this.offsetX, 0);
            b.font = "10px Helvetica, sans-serif";
            var f = null,
            g = null;
            for (c = c; c < e; c++) {
                var h = this.commits[c],
                j = this.months[h.date.getMonth()];
                if (j != f) {
                    b.fillStyle = "#ffffff";
                    b.fillText(j, c * 20 - 3, 14);
                    f = j
                }
                h = parseInt(h.date.getDate());
                if (h != g) {
                    b.fillStyle = "#ffffff";
                    b.fillText(h, c * 20 - 3, 33);
                    g = h
                }
            }
            b.restore()
        },
        drawUsers: function(b) {
            b.fillStyle = "#FFFFFF";
            b.fillRect(0, 0, this.namesWidth, this.height);
            b.save();
            b.translate(0, 40 + this.offsetY);
            for (var c = 0; c < this.userBlocks.length; c++) {
                var e = this.userBlocks[c];
                b.fillStyle = this.userBgColors[c % 2];
                b.fillRect(0, e.start * 20, this.namesWidth, e.count * 20);
                if (this.activeUser && this.activeUser.name == e.name) {
                    b.fillStyle = "rgba(0, 0, 0, 0.05)";
                    b.fillRect(0, e.start * 20, this.namesWidth,
                    e.count * 20)
                }
                b.fillStyle = "#DDDDDD";
                b.fillRect(0, e.start * 20, 1, e.count * 20);
                b.fillRect(this.namesWidth - 1, e.start * 20, 1, e.count * 20);
                b.fillRect(this.width - 1, e.start * 20, 1, e.count * 20);
                b.fillRect(0, (e.start + e.count) * 20 - 1, this.namesWidth, 1);
                b.measureText(e.name);
                var f = (e.start + e.count / 2) * 20 + 3;
                b.fillStyle = "#000000";
                b.font = "12px Monaco, monospace";
                b.textAlign = "center";
                b.fillText(e.name, this.namesWidth / 2, f, 96)
            }
            b.restore();
            b.fillStyle = "#111111";
            b.fillRect(0, 0, this.namesWidth, 20);
            b.fillStyle = "#333333";
            b.fillRect(0,
            20, this.namesWidth, 20)
        },
        drawFooter: function(b) {
            b.fillStyle = "#F4F4F4";
            b.fillRect(0, this.height - 20, this.width, 20);
            b.fillStyle = "#CCCCCC";
            b.fillRect(0, this.height - 20, this.width, 1);
            b.fillStyle = "#000000";
            b.font = "11px Monaco, monospace";
            b.fillText("GitHub Network Graph Viewer v4.0.0", 5, this.height - 5)
        }
    };
    d.Graph = function(b, c, e, f, g, h, j, l, k, m) {
        this.namesWidth = 100;
        this.spaceColors = [];
        this.bgColors = ["#F5F5FF", "#F0F0FF"];
        this.spaceColors.push("#FF0000");
        this.spaceColors.push("#0000FF");
        this.spaceColors.push("#00FF00");
        this.spaceColors.push("#FF00FF");
        this.spaceColors.push("#E2EB00");
        this.spaceColors.push("#FFA600");
        this.spaceColors.push("#00FFFC");
        this.spaceColors.push("#DD458E");
        this.spaceColors.push("#AD7331");
        this.spaceColors.push("#97AD31");
        this.spaceColors.push("#51829D");
        this.spaceColors.push("#70387F");
        this.spaceColors.push("#740000");
        this.spaceColors.push("#745C00");
        this.spaceColors.push("#419411");
        this.spaceColors.push("#37BE8C");
        this.spaceColors.push("#6C5BBD");
        this.spaceColors.push("#F300AA");
        this.spaceColors.push("#586D41");
        this.spaceColors.push("#3B4E31");
        this.network = b;
        this.ctx = c;
        this.width = e;
        this.height = f;
        this.focus = g;
        this.commits = h;
        this.users = j;
        this.spaceMap = l;
        this.userBlocks = k;
        this.nethash = m;
        this.offsetX = this.namesWidth + (e - this.namesWidth) / 2 - g * 20;
        this.bgCycle = this.offsetY = 0;
        this.marginMap = {};
        this.gravatars = {};
        this.activeCommit = null;
        this.contentHeight = this.calcContentHeight();
        this.graphMidpoint = this.namesWidth + (e - this.namesWidth) / 2;
        this.showRefs = true;
        this.lastHotLoadCenterIndex = null;
        this.connectionMap = {};
        this.spaceUserMap =
        {};
        for (b = 0; b < k.length; b++) {
            e = k[b];
            for (c = e.start; c < e.start + e.count; c++) this.spaceUserMap[c] = j[e.name]
        }
        this.headsMap = {};
        for (b = 0; b < k.length; b++) {
            e = k[b];
            e = j[e.name];
            for (c = 0; c < e.heads.length; c++) {
                f = e.heads[c];
                this.headsMap[f.id] || (this.headsMap[f.id] = []);
                g = {
                    name: e.name,
                    head: f
                };
                this.headsMap[f.id].push(g)
            }
        }
    };
    d.Graph.prototype = {
        moveX: function(b) {
            this.offsetX += b;
            if (this.offsetX > this.graphMidpoint) this.offsetX = this.graphMidpoint;
            else if (this.offsetX < this.graphMidpoint - this.commits.length * 20) this.offsetX = this.graphMidpoint -
            this.commits.length * 20;
            this.hotLoadCommits()
        },
        moveY: function(b) {
            this.offsetY += b;
            if (this.offsetY > 0 || this.contentHeight < this.height - 40) this.offsetY = 0;
            else if (this.offsetY < -this.contentHeight + this.height / 2) this.offsetY = -this.contentHeight + this.height / 2
        },
        toggleRefs: function() {
            this.showRefs = !this.showRefs
        },
        calcContentHeight: function() {
            for (var b = 0, c = 0; c < this.userBlocks.length; c++) {
                var e = this.userBlocks[c];
                b += e.count
            }
            return b * 20
        },
        hover: function(b, c) {
            for (var e = this.timeWindow(), f = e.min; f <= e.max; f++) {
                var g =
                this.commits[f],
                h = this.offsetX + g.time * 20,
                j = this.offsetY + 50 + g.space * 20;
                if (b > h - 5 && b < h + 5 && c > j - 5 && c < j + 5) return g
            }
            return null
        },
        hotLoadCommits: function() {
            var b = 200,
            c = parseInt(( - this.offsetX + this.graphMidpoint) / 20);
            if (c < 0) c = 0;
            if (c > this.commits.length - 1) c = this.commits.length - 1;
            if (! (this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - c) < 10)) {
                this.lastHotLoadCenterIndex = c;
                var e = this.backSpan(c, b);
                c = this.frontSpan(c, b);
                if (e || c) {
                    b = e ? e[0] : c[0];
                    e = c ? c[1] : e[1];
                    this.requestChunk(b, e)
                }
            }
        },
        backSpan: function(b,
        c) {
            for (var e = null, f = b; f >= 0 && f > b - c; f--) if (!this.commits[f].requested) {
                e = f;
                break
            }
            if (e != null) {
                f = b = null;
                for (f = e; f >= 0 && f > e - c; f--) if (this.commits[f].requested) {
                    b = f;
                    break
                }
                if (b) f = b + 1;
                else {
                    f = e - c;
                    if (f < 0) f = 0
                }
                return [f, e]
            } else return null
        },
        frontSpan: function(b, c) {
            for (var e = null, f = b; f < this.commits.length && f < b + c; f++) if (!this.commits[f].requested) {
                e = f;
                break
            }
            if (e != null) {
                f = b = null;
                for (f = e; f < this.commits.length && f < e + c; f++) if (this.commits[f].requested) {
                    b = f;
                    break
                }
                f = b ? b - 1: e + c >= this.commits.length ? this.commits.length - 1:
                e + c;
                return [e, f]
            } else return null
        },
        requestInitialChunk: function() {
            var b = this;
            a.getJSON("network_data_chunk?nethash=" + this.nethash,
            function(c) {
                b.importChunk(c);
                b.draw();
                b.network.chrome.draw()
            })
        },
        requestChunk: function(b, c) {
            for (var e = b; e <= c; e++) this.commits[e].requested = new Date;
            var f = this;
            b = "network_data_chunk?nethash=" + this.nethash + "&start=" + b + "&end=" + c;
            a.getJSON(b,
            function(g) {
                f.importChunk(g);
                f.draw();
                f.network.chrome.draw();
                f.lastHotLoadCenterIndex = this.focus
            })
        },
        importChunk: function(b) {
            for (var c =
            0; c < b.commits.length; c++) {
                var e = b.commits[c],
                f = this.spaceUserMap[e.space],
                g = this.commits[e.time];
                g.populate(e, f, this.commits);
                for (e = 0; e < g.parents.length; e++) {
                    f = g.parents[e];
                    for (f = f.time + 1; f < g.time; f++) {
                        this.connectionMap[f] = this.connectionMap[f] || [];
                        this.connectionMap[f].push(g)
                    }
                }
            }
        },
        timeWindow: function() {
            var b = parseInt((this.namesWidth - this.offsetX + 20) / 20);
            if (b < 0) b = 0;
            var c = b + parseInt((this.width - this.namesWidth) / 20);
            if (c > this.commits.length - 1) c = this.commits.length - 1;
            return {
                min: b,
                max: c
            }
        },
        draw: function() {
            this.drawBackground();
            var b = this.timeWindow(),
            c = b.min;
            b = b.max;
            this.ctx.save();
            this.ctx.translate(this.offsetX, this.offsetY + 50);
            for (var e = {},
            f = 0; f < this.spaceMap.length; f++) for (var g = this.spaceMap.length - f - 1, h = c; h <= b; h++) {
                var j = this.commits[h];
                if (j.populated && j.space == g) {
                    this.drawConnection(j);
                    e[j.id] = true
                }
            }
            for (f = c; f <= b; f++) if (g = this.connectionMap[f]) for (h = 0; h < g.length; h++) {
                j = g[h];
                if (!e[j.id]) {
                    this.drawConnection(j);
                    e[j.id] = true
                }
            }
            for (f = 0; f < this.spaceMap.length; f++) {
                g = this.spaceMap.length - f - 1;
                for (h = c; h <= b; h++) {
                    j = this.commits[h];
                    if (j.populated && j.space == g) j == this.activeCommit ? this.drawActiveCommit(j) : this.drawCommit(j)
                }
            }
            if (this.showRefs) for (h = c; h <= b; h++) {
                j = this.commits[h];
                if (j.populated) if (c = this.headsMap[j.id]) for (f = e = 0; f < c.length; f++) {
                    g = c[f];
                    if (this.spaceUserMap[j.space].name == g.name) {
                        g = this.drawHead(j, g.head, e);
                        e += g
                    }
                }
            }
            this.ctx.restore();
            this.activeCommit && this.drawCommitInfo(this.activeCommit)
        },
        drawBackground: function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.save();
            this.ctx.translate(0, this.offsetY + 50);
            this.ctx.clearRect(0, -10, this.width, this.height);
            for (var b = 0; b < this.userBlocks.length; b++) {
                var c = this.userBlocks[b];
                this.ctx.fillStyle = this.bgColors[b % 2];
                this.ctx.fillRect(0, c.start * 20 - 10, this.width, c.count * 20);
                this.ctx.fillStyle = "#DDDDDD";
                this.ctx.fillRect(0, (c.start + c.count) * 20 - 11, this.width, 1)
            }
            this.ctx.restore()
        },
        drawCommit: function(b) {
            var c = b.time * 20,
            e = b.space * 20;
            this.ctx.strokeStyle = "#F7F7FF";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillStyle = this.spaceColor(b.space);
            this.ctx.beginPath();
            this.ctx.arc(c,
            e, 4, 0, Math.PI * 2, false);
            this.ctx.fill();
            this.ctx.stroke()
        },
        drawActiveCommit: function(b) {
            var c = b.time * 20,
            e = b.space * 20;
            this.ctx.strokeStyle = "#F7F7FF";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillStyle = this.spaceColor(b.space);
            this.ctx.beginPath();
            this.ctx.arc(c, e, 6, 0, Math.PI * 2, false);
            this.ctx.fill();
            this.ctx.stroke()
        },
        drawCommitInfo: function(b) {
            var c = this.splitLines(b.message, 54),
            e = 80 + 15 * c.length,
            f = this.offsetX + b.time * 20,
            g = 50 + this.offsetY + b.space * 20,
            h = 0,
            j = 0;
            h = f < this.graphMidpoint ? f + 10: f - 410;
            j = g < 40 + (this.height -
            40) / 2 ? g + 10: g - e - 10;
            this.ctx.save();
            this.ctx.translate(h, j);
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = "2";
            this.ctx.beginPath();
            this.ctx.moveTo(0, 5);
            this.ctx.quadraticCurveTo(0, 0, 5, 0);
            this.ctx.lineTo(395, 0);
            this.ctx.quadraticCurveTo(400, 0, 400, 5);
            this.ctx.lineTo(400, e - 5);
            this.ctx.quadraticCurveTo(400, e, 395, e);
            this.ctx.lineTo(5, e);
            this.ctx.quadraticCurveTo(0, e, 0, e - 5);
            this.ctx.lineTo(0, 5);
            this.ctx.fill();
            this.ctx.stroke();
            var l = this.gravatars[b.gravatar];
            if (l) this.drawGravatar(l,
            10, 10);
            else {
                var k = this;
                l = new Image;
                l.src = "https://secure.gravatar.com/avatar/" + b.gravatar + "?s=32&d=https%3A%2F%2Fgithub.com%2Fimages%2Fgravatars%2Fgravatar-32.png";
                l.onload = function() {
                    if (k.activeCommit == b) {
                        k.drawGravatar(l, h + 10, j + 10);
                        k.gravatars[b.gravatar] = l
                    }
                }
            }
            this.ctx.fillStyle = "#000000";
            this.ctx.font = "bold 14px Helvetica, sans-serif";
            this.ctx.fillText(b.author, 55, 32);
            this.ctx.fillStyle = "#888888";
            this.ctx.font = "12px Monaco, monospace";
            this.ctx.fillText(b.id, 12, 65);
            this.drawMessage(c, 12, 85);
            this.ctx.restore()
        },
        drawGravatar: function(b, c, e) {
            this.ctx.strokeStyle = "#AAAAAA";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.strokeRect(c + 0.5, e + 0.5, 35, 35);
            this.ctx.drawImage(b, c + 2, e + 2)
        },
        drawMessage: function(b, c, e) {
            this.ctx.font = "12px Monaco, monospace";
            this.ctx.fillStyle = "#000000";
            for (var f = 0; f < b.length; f++) {
                var g = b[f];
                this.ctx.fillText(g, c, e + f * 15)
            }
        },
        splitLines: function(b, c) {
            b = b.split(" ");
            for (var e = [], f = "", g = 0; g < b.length; g++) {
                var h = b[g];
                if (f.length + 1 + h.length < c) f = f == "" ? h: f + " " + h;
                else {
                    e.push(f);
                    f = h
                }
            }
            e.push(f);
            return e
        },
        drawHead: function(b, c, e) {
            this.ctx.font = "10.25px Monaco, monospace";
            this.ctx.save();
            var f = this.ctx.measureText(c.name).width;
            this.ctx.restore();
            var g = b.time * 20;
            b = b.space * 20 + 5 + e;
            this.ctx.save();
            this.ctx.translate(g, b);
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo( - 4, 10);
            this.ctx.quadraticCurveTo( - 9, 10, -9, 15);
            this.ctx.lineTo( - 9, 15 + f);
            this.ctx.quadraticCurveTo( - 9, 15 + f + 5, -4, 15 + f + 5);
            this.ctx.lineTo(4, 15 + f + 5);
            this.ctx.quadraticCurveTo(9, 15 + f +
            5, 9, 15 + f);
            this.ctx.lineTo(9, 15);
            this.ctx.quadraticCurveTo(9, 10, 4, 10);
            this.ctx.lineTo(0, 0);
            this.ctx.fill();
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "12px Monaco, monospace";
            this.ctx.textBaseline = "middle";
            this.ctx.scale(0.85, 0.85);
            this.ctx.rotate(Math.PI / 2);
            this.ctx.fillText(c.name, 17, -1);
            this.ctx.restore();
            return f + 20
        },
        drawConnection: function(b) {
            for (var c = 0; c < b.parents.length; c++) {
                var e = b.parents[c];
                if (c == 0) e.space == b.space ? this.drawBasicConnection(e, b) : this.drawBranchConnection(e, b);
                else this.drawMergeConnection(e,
                b)
            }
        },
        drawBasicConnection: function(b, c) {
            var e = this.spaceColor(c.space);
            this.ctx.strokeStyle = e;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(b.time * 20, c.space * 20);
            this.ctx.lineTo(c.time * 20, c.space * 20);
            this.ctx.stroke()
        },
        drawBranchConnection: function(b, c) {
            var e = this.spaceColor(c.space);
            this.ctx.strokeStyle = e;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(b.time * 20, b.space * 20);
            this.ctx.lineTo(b.time * 20, c.space * 20);
            this.ctx.lineTo(c.time * 20 - 14, c.space * 20);
            this.ctx.stroke();
            this.threeClockArrow(e,
            c.time * 20, c.space * 20)
        },
        drawMergeConnection: function(b, c) {
            var e = this.spaceColor(b.space);
            this.ctx.strokeStyle = e;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            if (b.space > c.space) {
                this.ctx.moveTo(b.time * 20, b.space * 20);
                var f = this.safePath(b.time, c.time, b.space);
                if (f) {
                    this.ctx.lineTo(c.time * 20 - 10, b.space * 20);
                    this.ctx.lineTo(c.time * 20 - 10, c.space * 20 + 15);
                    this.ctx.lineTo(c.time * 20 - 7.7, c.space * 20 + 9.5);
                    this.ctx.stroke();
                    this.oneClockArrow(e, c.time * 20, c.space * 20)
                } else {
                    f = this.closestMargin(b.time, c.time, b.space, -1);
                    if (b.space == c.space + 1 && b.space == f + 1) {
                        this.ctx.lineTo(b.time * 20, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 15, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 9.5, f * 20 + 7.7);
                        this.ctx.stroke();
                        this.twoClockArrow(e, c.time * 20, f * 20)
                    } else if (b.time + 1 == c.time) {
                        f = this.closestMargin(b.time, c.time, c.space, 0);
                        this.ctx.lineTo(b.time * 20, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 15, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 15, c.space * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 9.5, c.space * 20 + 7.7);
                        this.ctx.stroke();
                        this.twoClockArrow(e, c.time * 20, c.space * 20)
                    } else {
                        this.ctx.lineTo(b.time *
                        20 + 10, b.space * 20 - 10);
                        this.ctx.lineTo(b.time * 20 + 10, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 10, f * 20 + 10);
                        this.ctx.lineTo(c.time * 20 - 10, c.space * 20 + 15);
                        this.ctx.lineTo(c.time * 20 - 7.7, c.space * 20 + 9.5);
                        this.ctx.stroke();
                        this.oneClockArrow(e, c.time * 20, c.space * 20)
                    }
                    this.addMargin(b.time, c.time, f)
                }
            } else {
                f = this.closestMargin(b.time, c.time, c.space, -1);
                if (f < c.space) {
                    this.ctx.moveTo(b.time * 20, b.space * 20);
                    this.ctx.lineTo(b.time * 20, f * 20 + 10);
                    this.ctx.lineTo(c.time * 20 - 12.7, f * 20 + 10);
                    this.ctx.lineTo(c.time * 20 - 12.7, c.space * 20 -
                    10);
                    this.ctx.lineTo(c.time * 20 - 9.4, c.space * 20 - 7.7);
                    this.ctx.stroke();
                    this.fourClockArrow(e, c.time * 20, c.space * 20)
                } else {
                    this.ctx.moveTo(b.time * 20, b.space * 20);
                    this.ctx.lineTo(b.time * 20, f * 20 + 10);
                    this.ctx.lineTo(c.time * 20 - 12.7, f * 20 + 10);
                    this.ctx.lineTo(c.time * 20 - 12.7, c.space * 20 + 10);
                    this.ctx.lineTo(c.time * 20 - 9.4, c.space * 20 + 7.7);
                    this.ctx.stroke();
                    this.twoClockArrow(e, c.time * 20, c.space * 20)
                }
                this.addMargin(b.time, c.time, f)
            }
        },
        addMargin: function(b, c, e) {
            e = e;
            this.marginMap[e] || (this.marginMap[e] = []);
            this.marginMap[e].push([b,
            c])
        },
        oneClockArrow: function(b, c, e) {
            this.ctx.fillStyle = b;
            this.ctx.beginPath();
            this.ctx.moveTo(c - 6.3, e + 13.1);
            this.ctx.lineTo(c - 10.8, e + 9.7);
            this.ctx.lineTo(c - 2.6, e + 3.5);
            this.ctx.fill()
        },
        twoClockArrow: function(b, c, e) {
            this.ctx.fillStyle = b;
            this.ctx.beginPath();
            this.ctx.moveTo(c - 12.4, e + 6.6);
            this.ctx.lineTo(c - 9.3, e + 10.6);
            this.ctx.lineTo(c - 3.2, e + 2.4);
            this.ctx.fill()
        },
        threeClockArrow: function(b, c, e) {
            this.ctx.fillStyle = b;
            this.ctx.beginPath();
            this.ctx.moveTo(c - 14, e - 2.5);
            this.ctx.lineTo(c - 14, e + 2.5);
            this.ctx.lineTo(c -
            4, e);
            this.ctx.fill()
        },
        fourClockArrow: function(b, c, e) {
            this.ctx.fillStyle = b;
            this.ctx.beginPath();
            this.ctx.moveTo(c - 12.4, e - 6.6);
            this.ctx.lineTo(c - 9.3, e - 10.6);
            this.ctx.lineTo(c - 3.2, e - 2.4);
            this.ctx.fill()
        },
        safePath: function(b, c, e) {
            for (var f = 0; f < this.spaceMap[e].length; f++) {
                var g = this.spaceMap[e][f];
                if (this.timeInPath(b, g)) return g[1] == c
            }
            return false
        },
        closestMargin: function(b, c, e, f) {
            var g = this.spaceMap.length;
            f = f;
            for (var h = false, j = false, l = false; ! (j && h);) {
                if (e + f >= 0 && this.safeMargin(b, c, e + f)) return e + f;
                if (e +
                f < 0) h = true;
                if (e + f > g) j = true;
                if (l == false && f == 0) {
                    f = -1;
                    l = true
                } else f = f < 0 ? -f - 1: -f - 2
            }
            return e > 0 ? e - 1: 0
        },
        safeMargin: function(b, c, e) {
            e = e;
            if (!this.marginMap[e]) return true;
            e = this.marginMap[e];
            for (var f = 0; f < e.length; f++) {
                var g = e[f];
                if (this.pathsCollide([b, c], g)) return false
            }
            return true
        },
        pathsCollide: function(b, c) {
            return this.timeWithinPath(b[0], c) || this.timeWithinPath(b[1], c) || this.timeWithinPath(c[0], b) || this.timeWithinPath(c[1], b)
        },
        timeInPath: function(b, c) {
            return b >= c[0] && b <= c[1]
        },
        timeWithinPath: function(b,
        c) {
            return b > c[0] && b < c[1]
        },
        spaceColor: function(b) {
            return b == 0 ? "#000000": this.spaceColors[b % this.spaceColors.length]
        }
    };
    d.MouseDriver = function(b, c, e) {
        this.container = b;
        this.chrome = c;
        this.graph = e;
        this.dragging = false;
        this.lastPoint = {
            x: 0,
            y: 0
        };
        this.pressedUser = this.pressedCommit = this.lastHoverUser = this.lastHoverCommit = null;
        b = a(b).eq(0);
        var f = a("canvas", b)[0];
        f.style.cursor = "move";
        var g = this;
        this.up = function() {
            g.dragging = false;
            if (g.pressedCommit && g.graph.activeCommit == g.pressedCommit) window.open("/" + g.graph.activeCommit.user.name +
            "/" + g.graph.activeCommit.user.repo + "/commit/" + g.graph.activeCommit.id);
            else if (g.pressedUser && g.chrome.activeUser == g.pressedUser) window.location = "/" + g.chrome.activeUser.name + "/" + g.chrome.activeUser.repo + "/network";
            g.pressedCommit = null;
            g.pressedUser = null
        };
        this.down = function() {
            if (g.graph.activeCommit) g.pressedCommit = g.graph.activeCommit;
            else if (g.chrome.activeUser) g.pressedUser = g.chrome.activeUser;
            else g.dragging = true
        };
        this.docmove = function(h) {
            var j = h.pageX;
            h = h.pageY;
            if (g.dragging) {
                g.graph.moveX(j -
                g.lastPoint.x);
                g.graph.moveY(h - g.lastPoint.y);
                g.graph.draw();
                g.chrome.moveX(j - g.lastPoint.x);
                g.chrome.moveY(h - g.lastPoint.y);
                g.chrome.draw()
            }
            g.lastPoint.x = j;
            g.lastPoint.y = h
        };
        this.move = function(h) {
            var j = h.pageX,
            l = h.pageY;
            if (g.dragging) {
                g.graph.moveX(j - g.lastPoint.x);
                g.graph.moveY(l - g.lastPoint.y);
                g.graph.draw();
                g.chrome.moveX(j - g.lastPoint.x);
                g.chrome.moveY(l - g.lastPoint.y);
                g.chrome.draw()
            } else {
                var k = g.chrome.hover(j - h.target.offsetLeft, l - h.target.offsetTop);
                if (k != g.lastHoverUser) {
                    f.style.cursor = k ?
                    "pointer": "move";
                    g.chrome.activeUser = k;
                    g.chrome.draw();
                    g.lastHoverUser = k
                } else {
                    h = g.graph.hover(j - h.target.offsetLeft, l - h.target.offsetTop);
                    if (h != g.lastHoverCommit) {
                        f.style.cursor = h ? "pointer": "move";
                        g.graph.activeCommit = h;
                        g.graph.draw();
                        g.chrome.draw();
                        g.lastHoverCommit = h
                    }
                }
            }
            g.lastPoint.x = j;
            g.lastPoint.y = l
        };
        this.out = function() {
            g.graph.activeCommit = null;
            g.chrome.activeUser = null;
            g.graph.draw();
            g.chrome.draw();
            g.lastHoverCommit = null;
            g.lastHoverUser = null
        };
        a("body")[0].onmouseup = this.up;
        a("body")[0].onmousemove =
        this.docmove;
        f.onmousedown = this.down;
        f.onmousemove = this.move;
        f.onmouseout = this.out
    };
    d.KeyDriver = function(b, c, e) {
        this.container = b;
        this.chrome = c;
        this.graph = e;
        this.dirty = false;
        this.moveBothX = function(g) {
            this.graph.moveX(g);
            this.chrome.moveX(g);
            this.graph.activeCommit = null;
            this.dirty = true
        };
        this.moveBothY = function(g) {
            this.graph.moveY(g);
            this.chrome.moveY(g);
            this.graph.activeCommit = null;
            this.dirty = true
        };
        this.toggleRefs = function() {
            this.graph.toggleRefs();
            this.dirty = true
        };
        this.redraw = function() {
            if (this.dirty) {
                this.graph.draw();
                this.chrome.draw()
            }
            this.dirty = false
        };
        var f = this;
        this.down = function(g) {
            var h = false;
            if (g.shiftKey) switch (g.which) {
            case 37:
            case 72:
                f.moveBothX(999999);
                h = true;
                break;
            case 38:
            case 75:
                f.moveBothY(999999);
                h = true;
                break;
            case 39:
            case 76:
                f.moveBothX( - 999999);
                h = true;
                break;
            case 40:
            case 74:
                f.moveBothY( - 999999);
                h = true;
                break
            } else switch (g.which) {
            case 37:
            case 72:
                f.moveBothX(100);
                h = true;
                break;
            case 38:
            case 75:
                f.moveBothY(20);
                h = true;
                break;
            case 39:
            case 76:
                f.moveBothX( - 100);
                h = true;
                break;
            case 40:
            case 74:
                f.moveBothY( - 20);
                h = true;
                break;
            case 84:
                f.toggleRefs();
                h = true;
                break
            }
            h && f.redraw()
        };
        this.press = function(g) {
            if (a.browser.mozilla || a.browser.opera) f.down({
                shiftKey: false,
                which: g.keyCode
            })
        };
        a(document).keydown(this.down);
        a(document).keypress(this.press)
    };
    return d
}
var Network = defineNetwork(window.jQuery);
$(function() {
    $("#organization-transforming").redirector({
        url: "/organizations/transforming?user=" + github_user,
        to: "/login"
    });
    $("#members_bucket .remove-user").click(function() {
        var a,
        d = $(this),
        b = d.parents("li:first").find(".login").text();
        b = "Are you POSITIVE you want to remove " + b + " from your organization?";
        if (!confirm(b)) return false;
        d.spin().remove();
        a = $("#spinner").addClass("remove");
        $.del(d.attr("href"),
        function() {
            a.parent().remove()
        });
        return false
    })
});
$(function() {
    if (!$("body").hasClass("page-account")) return false;
    var a = $("#add_email_action a"),
    d = $("#cancel_add_email"),
    b = $("#add_email_form_wrap"),
    c = $(".add-emails-form .error_box");
    a.click(function() {
        $(this).toggle();
        b.fadeIn(200).find(":text").focus();
        return false
    });
    d.click(function() {
        a.toggle();
        b.hide().find(":text").val("");
        c.hide();
        return false
    });
    $(".delete_email").live("click",
    function() {
        if ($("ul.user_emails li.email").length == 1) {
            $.facebox("You must always have at least one email address.  If you want to delete this address, add a new one first.");
            return false
        }
        $.post($(this).attr("href"), {
            email: $(this).prev().text()
        });
        $(this).parent().remove();
        return false
    });
    $(".delete_connection").live("click",
    function() {
        $.post($(this).attr("href"), {
            _method: "delete"
        });
        $(this).parent().remove();
        return false
    });
    $("ul.user_emails li.email").length > 0 && $("#add_email_form").submit(function() {
        $("#add_email_form :submit").attr("disabled", true).spin();
        var e = this;
        $(this).ajaxSubmit(function(f) {
            f ? $("ul.user_emails").append(f) : c.show();
            $("#add_email_form :submit").attr("disabled",
            false).stopSpin();
            $(e).find(":text").val("").focus()
        });
        return false
    });
    $(".user_toggle").click(function() {
        var e = {};
        e[this.name] = this.checked ? "1": "0";
        e._method = "put";
        $.post("/account", e);
        $("#notify_save").show();
        setTimeout("$('#notify_save').fadeOut()", 1000)
    });
    $("dl.form.autosave").autosaveField();
    $("button.dummy").click(function() {
        $(this).prev(".success").show().fadeOut(5000);
        return false
    });
    $(".js-preview-job-profile").click(function() {
        $.get("/preview", {
            text: $("#user_profile_bio").val()
        },
        function(e) {
            $.facebox(e,
            "job-profile-preview")
        });
        return false
    });
    $(".js-leave-collaborated-repo", $("#facebox")[0]).live("click",
    function(e) {
        var f = $(this).parents("form").attr("data-repo"),
        g = $("ul.repositories li[data-repo=" + f + "]"),
        h = $(this).parents("div.full-button");
        h.addClass("no-bg");
        h.html('<img src="/images/modules/ajax/indicator.gif">');
        $.ajax({
            url: "/account/leave_repo/" + f,
            type: "POST",
            success: function() {
                $.facebox.close();
                g.fadeOut()
            },
            error: function() {
                h.html('<img src="/images/modules/ajax/error.png">')
            }
        });
        e.preventDefault();
        return false
    });
    $(".change-gravatar-email form").live("submit",
    function() {
        var e = $(this),
        f = e.find("button").attr("disabled", true),
        g = e.find(".spinner").html('<img src="/images/modules/ajax/indicator.gif"/>');
        $.ajax({
            url: e.attr("action"),
            type: "PUT",
            data: {
                email: e.find("input").val()
            },
            success: function(h) {
                g.html('<img src="/images/modules/ajax/success.png"/>');
                e.find(".error").text("");
                var j = $(".change-gravatar-email .gravatar img").attr("src");
                $(".change-gravatar-email .gravatar img").attr("src", j.replace(/[a-f0-9]{32}/,
                h));
                $(document).unbind("close.facebox").bind("close.facebox",
                function() {
                    window.location = window.location
                })
            },
            error: function(h) {
                g.html('<img src="/images/modules/ajax/error.png"/>');
                e.find(".error").text(h.responseText)
            },
            complete: function() {
                f.attr("disabled", false)
            }
        });
        return false
    })
});
$(function() {
    if ($(".page-billing, .page-account").length == 0) return false;
    $(".js-coupon-click-onload").click();
    $(".js-add-cc").click(function() {
        $(document).one("reveal.facebox",
        function() {
            $("#facebox .js-thanks, #facebox .rule:first").hide()
        });
        $.facebox({
            div: this.href
        });
        return false
    });
    $(".js-close-facebox").live("click",
    function() {
        $(document).trigger("close.facebox")
    });
    $(".js-edit-org-select-billing").click(function() {
        $("a[href=#billing_bucket]").click();
        return false
    });
    var a = $("table.upgrades");
    if (a.length ==
    0) return false;
    a.find(".choose_plan").click(function() {
        var d = $(this).closest("tr").attr("data-name");
        $(".js-new-plan-name-val").val(d);
        $(".js-new-plan-name").text(d);
        d == "free" ? $(".js-new-plan-card-on-file").hide() : $(".js-new-plan-card-on-file").show()
    });
    $(".js-coupon-form").live("submit",
    function() {
        $(this).find("button").attr("disabled", true).after(' <img src="/images/modules/ajax/indicator.gif">');
        $.ajax({
            url: this.action,
            type: this.method,
            data: {
                code: $(this).find(":text").val()
            },
            error: function(d) {
                $("#facebox .content").html(d.responseText)
            },
            success: function(d) {
                $("#facebox .content").html(d);
                $(document).unbind("close.facebox").bind("close.facebox",
                function() {
                    var b = window.location.pathname;
                    window.location = /organizations/.test(b) ? b: "/account/billing"
                })
            }
        });
        return false
    });
    $(".selected .choose_plan").click()
});
$(function() {
    if (!$("body").hasClass("page-compare")) return false;
    var a = null;
    $(".compare-range .commit-ref.to").click(function() {
        a = "end";
        $.facebox({
            div: "#compare_chooser"
        });
        return false
    });
    $(".compare-range .commit-ref.from").click(function() {
        a = "start";
        $.facebox({
            div: "#compare_chooser"
        });
        return false
    });
    function d() {
        var f = $("#facebox .ref-autocompleter"),
        g = $("#facebox button.choose-end");
        $("#facebox button.refresh");
        f.val(a == "start" ? comparisonBase: comparisonHead);
        $("#facebox .mode-upper").text(e(a));
        $("#facebox .mode-lower").text(a);
        a == "start" ? g.show() : g.hide()
    }
    function b() {
        var f = $("#facebox .ref-autocompleter");
        if (f.length != 0) {
            var g = $("#facebox .commit-preview-holder"),
            h = $("#facebox button.refresh"),
            j = $(".compare-range").attr("url-base");
            d();
            h.click(function() {
                if (a == "start") comparisonBase = f.val();
                else comparisonHead = f.val();
                $(document).trigger("close.facebox");
                document.location = j + comparisonBase + "..." + comparisonHead;
                return false
            });
            f.click(function() {
                this.focus();
                this.select();
                return false
            });
            var l = false,
            k = null,
            m = function() {
                l && k.abort();
                l = true;
                k = $.get(g.attr("url_base") + f.val(), null,
                function(w) {
                    if (w.length > 0) {
                        g.html(w);
                        g.find(".relatize").relatizeDate();
                        g.find("a").attr("target", "_blank")
                    }
                    l = false
                })
            };
            m();
            var n = f.val(),
            q = null,
            s = function() {
                if (n != f.val() || q == f.val()) n = f.val();
                else {
                    m();
                    q = f.val()
                }
            };
            f.keyup(function() {
                n = this.value;
                setTimeout(s, 1000)
            });
            f.click()
        }
    }
    $(document).bind("reveal.facebox", b);
    var c = window.location.hash.substr(1);
    if (/^diff-/.test(c) || /^L\d+/.test(c)) $("li a[href='#files_bucket']").click();
    function e(f) {
        return f.charAt(0).toUpperCase() + f.slice(1)
    }
});
$(function() {
    if (!$("body").hasClass("page-newpullrequest")) return false;
    $(".pull-form a[action=preview]").click(function() {
        var c = $(".pull-form .content-body"),
        e = $(".pull-form").attr("data-preview-url"),
        f = $(this).closest("form");
        c.html("<p>Loading preview ...</p>");
        $.post(e, f.serialize(),
        function(g) {
            c.html(g)
        })
    });
    var a = $(".btn-change");
    a.data("expand-text", a.text());
    a.data("collapse-text", a.attr("data-collapse-text"));
    a.data("state", "collapsed");
    $(".editor-expander").click(function() {
        if (a.data("state") ==
        "collapsed") {
            a.find("span").text(a.data("collapse-text"));
            a.data("state", "expanded");
            $(".range-editor").slideDown("fast");
            $(".pull-form-main .form-actions button").hide();
            $(".pull-tabs, .tab-content").css({
                opacity: 0.45
            })
        } else {
            a.find("span").text(a.data("expand-text"));
            a.data("state", "collapsed");
            $(".range-editor").slideUp("fast");
            $(".pull-form-main .form-actions button").show();
            $(".pull-tabs, .tab-content").css({
                opacity: 1
            })
        }
        return false
    });
    var d = $(".new-pull-request form");
    function b() {
        var c = d.find("input.title");
        if (c.val().length > 0) {
            c.addClass("valid");
            d.find(".js-title-missing-error").hide()
        } else {
            c.removeClass("valid");
            d.find(".js-title-missing-error").show()
        }
    }
    d.submit(function() {
        b();
        if ($(".js-title-missing-error").is(":visible")) return false;
        GitHub.metric("Sent Pull Request", {
            "Pull Request Type": "New School",
            Action: GitHub.currentAction,
            "Ref Type": GitHub.revType
        })
    });
    $("button#update_commit_range").click(function() {
        d.attr("action", "/" + GitHub.nameWithOwner + "/pull/new");
        d.submit()
    });
    $(".range-editor").find("input, select").keypress(function(c) {
        c.keyCode ==
        13 && c.preventDefault()
    });
    $(".js-refchooser").each(function() {
        $(this).refChooser({
            change: function() {
                $(this).attr("data-ref-valid", false);
                $("button#update_commit_range").attr("disabled", true)
            },
            found: function() {
                $(this).attr("data-ref-valid", true);
                $(".js-refchooser[data-ref-valid=false]").length == 0 && $("button#update_commit_range").removeAttr("disabled")
            }
        });
        var c = $(this).find(".js-ref"),
        e = $(this).find("select"),
        f = c.branchesAutocomplete({
            extraParams: {
                repository: e.val()
            }
        });
        e.change(function() {
            f.flushCache();
            f.setOptions({
                extraParams: {
                    repository: $(this).val()
                }
            });
            f.click()
        });
        c.focus(function() {
            window.setTimeout(function() {
                c.selection(0, c.val().length)
            },
            1)
        })
    })
});
 (function(a) {
    a.fn.refChooser = function(d) {
        var b = a.extend({},
        a.fn.refChooser.defaults, d);
        return this.each(function() {
            var c = this,
            e = a(this),
            f = e.find(".js-source"),
            g = e.find(".js-ref"),
            h = e.find(".js-commit-preview"),
            j = e.attr("data-preview-url-base"),
            l = {
                repo: e.attr("data-error-repoo")
            },
            k = false,
            m = null;
            function n() {
                if (f.val() == "") {
                    h.html('<p class="error">' + l.repo + "</p>");
                    b.missing.call(e)
                } else {
                    var w = j + f.val().split("/")[0] + ":" + g.val();
                    k && m.abort();
                    k = true;
                    m = a.get(w, null,
                    function(t) {
                        if (t.length > 0) {
                            h.html(t);
                            h.find(".relatize").relatizeDate();
                            h.find(".error").length == 0 ? b.found.call(c) : b.missing.call(c)
                        }
                        k = false
                    })
                }
            }
            var q = g.val();
            g.keyup(function() {
                if (this.value != q) {
                    b.change.call(c);
                    q = this.value;
                    n()
                }
            });
            var s = f.val();
            f.change(function() {
                if (this.value != s) {
                    b.change.call(c);
                    s = this.value;
                    n()
                }
            })
        })
    };
    a.fn.refChooser.defaults = {
        found: function() {},
        change: function() {},
        missing: function() {}
    }
})(jQuery);
$(function() {
    if (!$("body").hasClass("page-notifications")) return false;
    $("table.notifications input[type=checkbox]").change(function() {
        $.post("/account/toggle_notification", {
            _method: "put",
            enable: this.checked ? "true": "false",
            notification_action: this.value
        })
    });
    $("button.dummy").click(function() {
        $(this).prev(".success").show().fadeOut(5000);
        return false
    });
    $(".user_toggle").click(function() {
        var a = this.checked,
        d = {};
        d[this.name] = this.checked ? "1": "0";
        d._method = "put";
        $.post("/account", d,
        function() {
            a ? $("#notifications_global_wrapper").removeClass("ignored") :
            $("#notifications_global_wrapper").addClass("ignored")
        })
    })
});
$(function() {
    if (!$("body").hasClass("page-profile")) return false;
    var a = $("ul.repositories>li"),
    d = $(".repo-filter input").enhancedField().val(""),
    b = d.val();
    function c() {
        a.show();
        d.val() != "" && a.filter(":not(:Contains('" + d.val() + "'))").hide()
    }
    d.bind("keyup blur click",
    function() {
        if (this.value != b) {
            b = this.value;
            c()
        }
    });
    $("ul.repositories>li.simple").each(function() {
        var f = $(this),
        g = f.find("p.description").html();
        $.trim(g) != "" && f.find("h3").attr("title", g).tipsy({
            gravity: "w"
        })
    });
    var e = $("ul#placeholder-members li").remove();
    e.length > 0 && $("ul.org-members").prepend(e)
});
$(function() {
    if (!$("body").hasClass("page-pullrequest")) return false;
    $(".js-hard-tabs").live("tabChanged", Comment.enhanceAll);
    $(".file, .file-box").live("commentChange",
    function(f) {
        $(f.target).closest("#discussion_bucket").length > 0 ? $("#files_bucket").remove() : $("#discussion_bucket").remove()
    });
    $("#reply-to-pr").click(function() {
        $("#comment_body").focus()
    });
    $(".new-comments .comment").editableComment();
    $("#pull_closed_warning a").click(function() {
        $("#pull_closed_warning").hide();
        $("#pull_comment_form").show();
        return false
    });
    var a = [];
    if (a.length > 0) {
        var d = a.offset().top,
        b = $(window),
        c = parseInt(a.css("margin-top")),
        e = function() {
            var f = b.scrollTop() - d;
            f > 0 ? a.stop().animate({
                marginTop: f + c
            },
            250) : a.stop().animate({
                marginTop: c
            },
            250)
        };
        setInterval(function() {
            e()
        },
        500)
    }
});
$(function() {
    var a = false;
    $(".ajax_paginate a").live("click",
    function() {
        if (a) return false;
        a = true;
        var d = $(this).parent();
        $(this).html('<img src="/images/modules/ajax/indicator.gif"/>');
        $.get(this.href,
        function(b) {
            d.replaceWith(b);
            $(".relatize").relatizeDate();
            a = false
        });
        return false
    })
});
$(function() {
    $(".graph .bars").each(function() {
        var a = this;
        if ($(a).is(":visible")) {
            var d = function(c) {
                new ParticipationGraph(a, c)
            },
            b = $(this).attr("rel");
            $.get(b, null, d, "text")
        }
    })
});
ParticipationGraph = function(a, d) {
    this.BAR_WIDTH = 7;
    this.ownerCommits = this.allCommits = null;
    this.primer = new Primer(a, 416, 20);
    this.data = d;
    this.readData();
    this.draw()
};
ParticipationGraph.prototype = {
    readData: function() {
        var a = this.data.split("\n");
        this.allCommits = a[0] ? this.base64BytesToIntArray(a[0]) : "";
        this.ownerCommits = a[1] ? this.base64BytesToIntArray(a[1]) : ""
    },
    max: function(a) {
        for (var d = a[0], b = 1; b < a.length; b++) if (a[b] > d) d = a[b];
        return d
    },
    integerize: function(a) {
        for (var d = [], b = 0; b < a.length; b++) d.push(parseInt(a[b]));
        return d
    },
    base64ByteToInt: function(a) {
        var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-";
        return d.indexOf(a)
    },
    base64BytesToIntArray: function(a) {
        for (var d =
        [], b, c = 0; c < a.length; c++) if (c % 2 == 0) b = 64 * this.base64ByteToInt(a.charAt(c));
        else {
            b += this.base64ByteToInt(a.charAt(c));
            d.push(b)
        }
        return d
    },
    draw: function() {
        var a = this.max(this.allCommits);
        a = a >= 20 ? 19 / a: 1;
        var d = new Primer.Layer;
        d.bind(this.primer);
        for (var b = 0; b < this.allCommits.length; b++) {
            var c = new Primer.Layer;
            c.bind(this.primer);
            c.setFillStyle("#CACACA");
            var e = this.allCommits[b] * a;
            c.fillRect(b * (this.BAR_WIDTH + 1), 20 - e, this.BAR_WIDTH, e);
            d.addChild(c)
        }
        var f = new Primer.Layer;
        f.bind(this.primer);
        for (b = 0; b <
        this.ownerCommits.length; b++) {
            c = new Primer.Layer;
            c.bind(this.primer);
            c.setFillStyle("#336699");
            e = this.ownerCommits[b] * a;
            c.fillRect(b * (this.BAR_WIDTH + 1), 20 - e, this.BAR_WIDTH, e);
            f.addChild(c)
        }
        this.primer.addChild(d);
        this.primer.addChild(f)
    }
};
$(function() {
    var a = $("table.upgrades");
    if (a.length == 0) return false;
    a.find("tr.current");
    var d = $("#plan"),
    b = $("#credit_card_fields");
    function c(e) {
        newPlan = e;
        a.find("tr.selected").removeClass("selected");
        e.addClass("selected");
        a.addClass("selected");
        d.val(newPlan.attr("data-name"));
        newPlan.attr("data-cost") == 0 ? b.hide() : b.show()
    }
    a.find(".choose_plan").click(function() {
        c($(this).closest("tr"));
        return false
    });
    $(".selected .choose_plan").click()
});
$(function() {
    $(".plan").dblclick(function() {
        var a = $(this).find("a.classy");
        if (a.length > 0) document.location = a.attr("href")
    });
    $("#signup_form").submit(function() {
        $("#signup_button").attr("disabled", true).find("span").text("Creating your GitHub account...")
    });
    $("dl.form.autocheck").each(function() {
        var a = $(this);
        a.find("input").blur(function() {
            var d = $(this);
            if ($.trim(d.val())) {
                d.css("background-image", 'url("/images/modules/ajax/indicator.gif")');
                $.ajax({
                    url: d.attr("check-url"),
                    data: {
                        value: d.val()
                    },
                    success: function() {
                        d.next().is(".note") &&
                        d.next().find("strong").text(d.val());
                        a.unErrorify();
                        d.css("background-image", 'url("/images/modules/ajax/success.png")')
                    },
                    error: function(b) {
                        a.errorify(b.responseText);
                        d.css("background-image", 'url("/images/modules/ajax/error.png")')
                    }
                })
            }
        })
    })
});
GitHub.spy = function(a) {
    var d = {
        path: "/",
        expires: 1
    };
    a = a.repo;
    if (a != "") {
        $.cookie("spy_repo", a, d);
        $.cookie("spy_repo_at", new Date, d)
    }
};
GitHub.Team = function(a) {
    this.url = window.location.pathname;
    this.orgUrl = this.url.split(/\/(teams|invite)/)[0];
    if (a) this.url = this.orgUrl + "/teams/" + a
};
GitHub.Team.prototype = {
    name: function() {
        return $("#team-name").val()
    },
    newRecord: function() {
        return ! /\/invite/.test(location.pathname) && !/\d/.test(location.pathname)
    },
    addMember: function(a) {
        return /\//.test(a) ? this.addRepo(a) : this.addUser(a)
    },
    repos: function() {
        return $.makeArray($(".repositories li:visible a span").map(function() {
            return $(this).text()
        }))
    },
    addRepo: function(a) {
        debug("Adding repo %s", a);
        if (!a || $.inArray(a, this.repos()) > -1) return false;
        this.addRepoAjax(a);
        var d = $(".repositories").find("li:first").clone(),
        b = d.find("input[type=hidden]");
        d.find("a").attr("href", "/" + a).text(a);
        d.find(".remove-repository").attr("data-repo", a);
        GitHub.Autocomplete.visibilities[a] == "private" && d.addClass("private");
        b.length > 0 && b.val(a).attr("disabled", false);
        $(".repositories").append(d.show());
        return true
    },
    addRepoAjax: function(a) {
        if (!this.newRecord()) {
            debug("Ajaxily adding %s", a);
            $.post(this.url + "/repo/" + a)
        }
    },
    removeRepo: function(a) {
        debug("Removing %s", a);
        if (!a || $.inArray(a, this.repos()) == -1) return false;
        var d = $(".repositories li:visible a").filter(function() {
            return $(this).find("span").text() ==
            a
        });
        function b() {
            d.parents("li:first").remove()
        }
        function c() {
            d.parent().find(".remove-repository").show().removeClass("remove").html('<img class="dingus" src="/images/modules/ajax/error.png">').end().find(".spinner").hide()
        }
        if (this.newRecord()) b();
        else {
            d.parent().find(".remove-repository").after('<img class="dingus spinner" src="/images/modules/ajax/indicator.gif"/>').hide();
            this.removeRepoAjax(a, b, c)
        }
        return true
    },
    removeRepoAjax: function(a, d, b) {
        if (!this.newRecord()) {
            debug("Ajaxily removing %s", a);
            $.del(this.url + "/repo/" + a, {},
            {
                success: d,
                error: b
            })
        }
    },
    users: function() {
        return $.makeArray($(".usernames li:visible").map(function() {
            return $(this).find("a:first").text()
        }))
    },
    addUser: function(a) {
        debug("Adding %s", a);
        if (!a || $.inArray(a, this.users()) > -1) return false;
        this.addUserAjax(a);
        var d = $(".usernames").find("li:first").clone(),
        b = GitHub.Autocomplete.gravatars[a],
        c = d.find("input[type=hidden]");
        b && d.find("img").replaceWith(b);
        d.find("a").attr("href", "/" + a).text(a);
        c.length > 0 && c.val(a).attr("disabled",
        false);
        $(".usernames").append(d.show());
        return true
    },
    removeUser: function(a) {
        debug("Removing %s", a);
        if (!a || $.inArray(a, this.users()) == -1) return false;
        var d = $(".usernames li:visible a:contains(" + a + ")");
        function b() {
            d.parents("li:first").remove()
        }
        if (this.newRecord()) b();
        else {
            d.parent().find(".remove-user").spin().remove();
            $("#spinner").addClass("remove");
            this.removeUserAjax(a, b)
        }
        return true
    },
    addUserAjax: function(a) {
        if (!this.newRecord()) {
            debug("Ajaxily adding %s", a);
            $.post(this.url + "/member/" + a)
        }
    },
    removeUserAjax: function(a,
    d) {
        if (!this.newRecord()) {
            debug("Ajaxily removing %s", a);
            $.del(this.url + "/member/" + a, d)
        }
    }
};
$(function() {
    if (GitHub.currentTeam) {
        var a = function() {
            debug("Setting data.completed to %s", $(this).val());
            $(this).data("completed", $(this).val())
        },
        d = GitHub.currentTeam,
        b = new GitHub.Autocomplete;
        b.settings.selectFirst = true;
        b.reposURL = d.orgUrl + "/autocomplete/repos";
        b.repos($(".add-repository-form input")).result(a);
        $(".remove-repository").live("click",
        function() {
            d.removeRepo($(this).attr("data-repo"));
            return false
        });
        $(".add-username-form input").userAutocomplete().result(a);
        $(".remove-user").live("click",
        function() {
            d.removeUser($(this).prev().text());
            return false
        });
        $(".add-username-form button, .add-repository-form button").click(function() {
            var c = $(this).parent();
            c = c.find(":text");
            var e = c.val();
            debug("Trying to add %s...", e);
            if (!e || !c.data("completed")) return false;
            c.val("").removeClass("ac-accept");
            d.addMember(e);
            return false
        });
        $(".add-username-form :text, .add-repository-form :text").keypress(function(c) {
            if (c.keyCode == $.keys.enter) {
                $(this).next("button").click();
                return false
            }
            if (c.keyCode != $.keys.tab) {
                debug("Clearing data.completed (was %s)",
                $(this).data("completed") || "null");
                $(this).data("completed", null)
            }
        })
    }
});
$(function() {
    $(".remove-team").click(function() {
        if (!confirm("Are you POSITIVE you want to remove this team?")) return false;
        var a = $(this).parents("li.team");
        $.del(this.href,
        function() {
            a.remove()
        });
        $(this).spin().remove();
        return false
    })
});
GitHub || (GitHub = {});
if (!GitHub.Tree) GitHub.Tree = {};
GitHub.Tree.rewriteSHAsInLinksWithRef = function(a) {
    if (GitHub.currentRef) $(a || ".breadcrumb a, .tree-browser .content a").each(function() {
        if (!/skiptree/.test(this.className)) {
            this.href = this.href.replace(/[0-9a-f]{40}/, GitHub.currentRef);
            var d = "/" + GitHub.nameWithOwner + "/tree/" + GitHub.masterBranch;
            if ((new RegExp(d + "$")).test(this.href)) this.href = "/" + GitHub.nameWithOwner
        }
    })
};
GitHub.CachedCommitDataPoller = function(a, d) {
    var b = $(d || document).find(".js-loading-commit-data");
    if (b.length != 0) {
        var c,
        e,
        f = "/" + GitHub.nameWithOwner + "/commit/",
        g = "/" + GitHub.nameWithOwner + "/cache/commits/" + GitHub.currentTreeSHA + "?path=" + encodeURIComponent(GitHub.currentPath) + "&commit_sha=" + GitHub.commitSHA;
        $.smartPoller(a || 2000,
        function(h) {
            $.ajax({
                url: g,
                dataType: "json",
                error: function(j) {
                    j.status == 201 ? h() : b.html('<img src="/images/modules/ajax/error.png"> Something went wrong.')
                },
                success: function(j) {
                    debug("success: %s",
                    g);
                    for (var l in j) if ($("#" + l).length != 0) {
                        var k = $("#" + l).parents("tr:first");
                        k.find(".age").html('<span class="drelatize">' + j[l].date + "</span>");
                        c = k.find(".message");
                        c.html(j[l].message);
                        c.html().length > 50 && c.html(c.html().slice(0, 47) + "...");
                        c.html('<a href="' + f + j[l].commit + '" class="message">' + c.html() + "</a>");
                        e = j[l].login ? '<a href="/' + j[l].login + '">' + j[l].login + "</a>": j[l].author;
                        c.html(c.html() + " [" + e + "]")
                    }
                    $.fn.relatizeDate && $(".drelatize").relatizeDate()
                }
            })
        })
    }
};
$(function() {
    $("#readme").length > 0 ? $("#read_more").show() : $("#missing-readme").show();
    $("#download_button").click(function() {
        $.gitbox($(this).attr("href"));
        return false
    });
    $(".archive_link a").live("click",
    function() {
        $(".popup .inner").hide();
        $(".popup .wait").show();
        var a = $(this).attr("rel"),
        d = 0;
        $.smartPoller(function(b) {
            $.getJSON(a,
            function(c) {
                if (d > 60) return false;
                else if (c.ready) $(document).trigger("close.facebox");
                else {
                    d += 1;
                    b()
                }
            })
        })
    });
    $(".other_archive_link").live("click",
    function() {
        $.gitbox($(this).attr("href"));
        return false
    });
    GitHub.CachedCommitDataPoller();
    GitHub.Tree.rewriteSHAsInLinksWithRef()
});
GitHub || (GitHub = {});
GitHub.TreeFinder = function() {
    if ($("#slider").length != 0) {
        var a = this;
        $.hotkeys({
            t: function() {
                a.show()
            }
        });
        var d = new Image;
        d.src = GitHub.assetHost ? GitHub.assetHost + "/images/modules/ajax/spinner.gif": "/images/modules/ajax/spinner.gif"
    }
};
GitHub.TreeFinder.prototype = {
    fileList: null,
    recentFiles: [],
    currentFinder: null,
    currentInput: null,
    show: function() {
        if (!this.currentFinder) {
            var a = this,
            d;
            a.currentFinder = $(".tree-finder").clone().show();
            a.currentInput = a.currentFinder.find("input");
            slider.slideForwardToLoading();
            d = a.currentFinder.find(".breadcrumb").detach().addClass("js-tree-finder-breadcrumb");
            $("#slider .breadcrumb:visible").hide().after(d);
            $("#slider").bind("slid",
            function() {
                $("#slider .frame-center").is(":not(.tree-finder)") && a.hide()
            });
            a.attachBehaviors()
        }
    },
    hide: function() {
        if (this.currentFinder) {
            var a = this;
            a.currentInput.blur();
            a.currentFinder.remove();
            $(".js-tree-finder-breadcrumb").remove();
            a.currentFinder = a.currentInput = null;
            $("#slider").unbind("slid")
        }
    },
    attachBehaviors: function() {
        var a = this,
        d = true,
        b = null,
        c = null;
        a.loadFileList();
        $(".js-dismiss-tree-list-help").live("click",
        function() {
            $.post(this.getAttribute("href"));
            $(this).closest(".octotip").fadeOut(function() {
                $(".tree-finder .octotip").remove()
            });
            a.currentInput.focus();
            return false
        });
        $("tbody.js-results-list tr", a.currentFinder).live("mouseover",
        function() {
            if (d) {
                a.currentFinder && a.currentFinder.find("tr.current").removeClass("current");
                $(this).addClass("current")
            }
        });
        a.currentFinder.find(".js-results-list").delegate("a", "click",
        function() {
            var e = $(this).text(),
            f = $.inArray(e, a.recentFiles);
            f > -1 && a.recentFiles.splice(f, 1);
            a.recentFiles.unshift(e);
            a.currentInput.blur();
            $(document).unbind("keydown.treeFinder");
            if (slider.enabled) return true;
            else document.location = $(this).attr("href")
        });
        $("tr td.icon", a.currentFinder).live("click",
        function() {
            $(this).parents("tr:first").find("td a").click()
        });
        $(document).bind("keydown.treeFinder",
        function(e) {
            if (e.keyCode == 27) {
                if (!slider.sliding && $("#slider .frame-center").is(".tree-finder")) {
                    slider.slideBackTo(location.pathname);
                    $(document).unbind("keydown.treeFinder")
                }
                return false
            }
        });
        a.currentInput.focus().keyup(function() {
            b && clearTimeout(b);
            b = setTimeout(function() {
                b = null;
                d = true
            },
            250)
        }).keydown(function(e) {
            var f = a.currentFinder.find("tr.current"),
            g = null;
            function h(j) {
                if (f.length == 0) return false;
                g = j == "up" ? f.prev("tr") : f.next("tr");
                if (g.length) {
                    d = false;
                    f.removeClass("current");
                    g.addClass("current");
                    j = 100;
                    var l = $(window),
                    k = l.height(),
                    m = g.offset().top - j,
                    n = g.offset().top + g.outerHeight() + j;
                    if (m < l.scrollTop()) l.scrollTop() > j && l.scrollTop(m);
                    else n > l.scrollTop() + k && l.scrollTop(n - k)
                }
                return false
            }
            switch (e.which) {
            case 9:
            case 16:
            case 17:
            case 18:
            case 91:
            case 93:
                return false;
            case 78:
                if (e.ctrlKey) return h("down");
                return;
            case 80:
                if (e.ctrlKey) return h("up");
                return;
            case 38:
                return h("up");
            case 40:
                return h("down");
            case 13:
                if (f.length == 0) return false;
                f.find("a").click();
                return false
            }
            c && clearTimeout(c);
            c = setTimeout(function() {
                c = null;
                a.updateResults()
            },
            100)
        })
    },
    loadFileList: function() {
        var a = this;
        function d() {
            a.loadedFileList()
        }
        a.fileList ? d() : $.ajax({
            url: "/" + GitHub.nameWithOwner + "/tree-list/" + GitHub.commitSHA,
            error: function() {
                if (a.currentFinder) {
                    a.fileList = [];
                    a.currentFinder.find(".js-no-results th").text("Something went wrong");
                    d()
                }
            },
            success: function(b) {
                a.fileList =
                b ? $.trim(b).split("\n") : [];
                d()
            }
        })
    },
    loadedFileList: function() {
        var a = this;
        if (a.currentFinder) {
            $("#slider .frame-center").replaceWith(a.currentFinder);
            a.updateResults()
        }
    },
    updateResults: function() {
        var a = this;
        if (a.currentFinder && a.fileList) {
            var d = a.currentInput.val(),
            b = [],
            c = a.currentFinder.find(".js-results-list"),
            e = "",
            f = 0;
            if (d) b = a.findMatchingFiles(d);
            else if (a.recentFiles.length) {
                b = a.recentFiles.slice(1, 6);
                if (b.length < 20) b = b.concat(a.fileList.slice(0, 20 - b.length))
            } else b = a.fileList;
            if (b.length <= 0) {
                c[0].innerHTML =
                "";
                a.currentFinder.find(".js-no-results").show();
                a.currentFinder.find(".js-header").hide()
            } else {
                a.currentFinder.find(".js-no-results").hide();
                a.currentFinder.find(".js-header").show();
                b = b.slice(0, 50);
                d = this.regexpForQuery(d);
                var g = function(h, j) {
                    return j % 2 == 1 ? "<b>" + h + "</b>": h
                };
                for (f = 0; f < b.length; f++) {
                    a = (b[f].match(d) || []).slice(1).map(g).join("");
                    e += '<tr><td class="icon"><img src="/images/icons/txt.png"></td><td><a class="js-slide-to" href="/' + GitHub.nameWithOwner + "/blob/" + (GitHub.currentRef || GitHub.commitSHA) +
                    "/" + b[f] + '">' + a + "</a></td></tr>"
                }
                c[0].innerHTML = e;
                c.find("tr:first").addClass("current")
            }
        }
    },
    findMatchingFiles: function(a) {
        if (!a) return [];
        var d = this,
        b = [],
        c = 0,
        e,
        f,
        g,
        h;
        a = a.toLowerCase();
        e = this.regexpForQuery(a);
        for (c = 0; c < d.fileList.length; c++) {
            f = d.fileList[c];
            g = f.toLowerCase();
            if (!f.match(/^vendor/)) if (g.match(e)) {
                h = g.score(a);
                if (h > 0) {
                    if (!a.match("/")) if (g.match("/")) h += g.replace(/^.*\//, "").score(a);
                    else h *= 2;
                    b.push([h, f])
                }
            }
        }
        return $.map(b.sort(function(j, l) {
            return l[0] - j[0]
        }),
        function(j) {
            return j[1]
        })
    },
    regexpForQuery: function(a) {
        var d = "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1");
        d = new RegExp("\\(([" + d + "])\\)", "g");
        return new RegExp("(.*)" + a.toLowerCase().replace(/(.)/g, "($1)(.*?)").replace(d, "(\\$1)") + "$", "i")
    }
};
$(function() {
    window.treeFinder = new GitHub.TreeFinder
});
GitHub || (GitHub = {});
GitHub.TreeSlider = function() {
    if (window.history && window.history.pushState) if ($("#slider").length != 0) if (!navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        window.history.replaceState({
            path: this.pathFromURL(location.pathname)
        },
        "");
        var a = this;
        a.enabled = true;
        $("#slider a.js-slide-to, .breadcrumb a").live("click",
        function(d) {
            return a.clickHandler(d)
        });
        $(window).bind("popstate",
        function(d) {
            a.popStateHandler(d.originalEvent)
        })
    }
};
GitHub.TreeSlider.prototype = {
    enabled: false,
    sliding: false,
    slideSpeed: 400,
    frameForPath: function(a) {
        return $(".frame[data-path=" + a + "]")
    },
    frameForURL: function(a) {
        return this.frameForPath(this.pathFromURL(a))
    },
    pathFromURL: function(a) {
        var d = GitHub.currentRef || GitHub.commitSHA;
        d = new RegExp("/(tree|blob)/" + d + "/");
        a = a.split(d)[2] || "/";
        if (a.slice(a.length - 1, a.length) != "/") a += "/";
        return a
    },
    scrollToBreadcrumb: function() {
        this.visibleInBrowser(".breadcrumb:visible") || $(".breadcrumb:visible").scrollTo(50)
    },
    visibleInBrowser: function(a) {
        var d =
        $(window).scrollTop(),
        b = d + $(window).height(),
        c = $(a).offset().top;
        a = c + $(a).height();
        return a >= d && c <= b
    },
    clickHandler: function(a) {
        if (a.which == 2 || a.metaKey || a.ctrlKey) return true;
        if (this.sliding) return false;
        a = a.target.href;
        var d = this.pathFromURL(a);
        window.history.pushState({
            path: d
        },
        "", a);
        typeof _gaq != "undefined" && _gaq.push(["_trackPageview"]);
        this.slideTo(a);
        return false
    },
    popStateHandler: function(a) {
        a.state && this.slideTo(location.pathname)
    },
    doneSliding: function() {
        if (this.sliding) {
            this.sliding = false;
            $("#slider .frame-center").nextAll(".frame").hide();
            $("#slider .frame-center").prevAll(".frame").css("visibility", "hidden");
            var a = $(".frame-loading:visible");
            a.length ? a.removeClass("frame-loading") : $("#slider").trigger("slid")
        }
    },
    slideTo: function(a) {
        var d = this.pathFromURL(a),
        b = this.frameForPath(d),
        c = $("#slider .frame-center").attr("data-path") || "";
        b.is(".frame-center") || (c == "/" || d.split("/").length > c.split("/").length ? this.slideForwardTo(a) : this.slideBackTo(a))
    },
    slideForwardTo: function(a) {
        debug("Sliding forward to %s",
        a);
        var d = this.frameForURL(a);
        if (d.length) this.slideForwardToFrame(d);
        else {
            var b = this.slideForwardToLoading();
            this.loadFrame(a,
            function(c) {
                b.replaceWith($(c).find(".frame-center"))
            })
        }
    },
    slideForwardToFrame: function(a) {
        if (!this.sliding) {
            this.sliding = true;
            var d = this;
            $("#slider .frame-center").after(a.css("marginLeft", 0)).addClass("frame").removeClass("frame-center").animate({
                marginLeft: "-1200px"
            },
            this.slideSpeed,
            function() {
                d.doneSliding()
            });
            this.makeCenterFrame(a);
            this.setFrameTitle(a)
        }
    },
    slideForwardToLoading: function() {
        var a =
        $(".frame-loading").clone();
        a.find("img").hide();
        setTimeout(function() {
            a.find("img").show()
        },
        500);
        $(".frames").append(a);
        this.slideForwardToFrame(a);
        return a
    },
    slideBackTo: function(a) {
        debug("Sliding back to %s", a);
        var d = this.frameForURL(a);
        if (d.length) this.slideBackToFrame(d);
        else {
            var b = this.slideBackToLoading(),
            c = this.pathFromURL(a);
            this.loadFrame(a,
            function(e) {
                b.removeClass("frame-loading").empty().append($(e).find(".frame-center").contents()).attr("data-path", c)
            })
        }
    },
    slideBackToFrame: function(a) {
        if (!this.sliding) {
            this.sliding =
            true;
            $("#slider .frame-center").before(a.css("marginLeft", "-1200px")).addClass("frame").removeClass("frame-center");
            var d = this;
            a.animate({
                marginLeft: "0"
            },
            this.slideSpeed,
            function() {
                d.doneSliding()
            });
            this.makeCenterFrame(a);
            this.setFrameTitle(a)
        }
    },
    slideBackToLoading: function() {
        var a = $(".frame-loading").clone();
        a.find("img").hide();
        setTimeout(function() {
            a.find("img").show()
        },
        350);
        $(".frames").prepend(a.show());
        slider.slideBackToFrame(a);
        return a
    },
    makeCenterFrame: function(a) {
        a.css("visibility", "visible").show().addClass("frame-center");
        this.scrollToBreadcrumb();
        var d = $(".breadcrumb[data-path=" + a.attr("data-path") + "]");
        if (d.length > 0) {
            $(".breadcrumb:visible").hide();
            d.show()
        }
        a = $(".announce[data-path=" + a.attr("data-path") + "]");
        $(".announce").fadeOut();
        a.length > 0 && a.fadeIn();
        GitHub.currentPath = this.pathFromURL(location.pathname).replace(/\/$/, "")
    },
    setFrameTitle: function(a) {
        a = a.attr("data-path");
        if (! (!a || a.length == 0)) {
            var d = unescape(unescape(GitHub.currentRef));
            a = unescape(a.slice(0, a.length - 1));
            document.title = a.length > 0 ? a + " at " + d + " from " +
            GitHub.nameWithOwner + " - GitHub": GitHub.nameWithOwner + " at " + d + " - GitHub"
        }
    },
    loadFrame: function(a, d) {
        debug("Loading " + a + "?slide=1");
        var b = this;
        $.ajax({
            url: a + "?slide=1",
            cache: false,
            success: function(c) {
                d.call(this, c);
                $("#slider").trigger("slid");
                $("#slider .breadcrumb").hide().last().after($(c).find(".breadcrumb"));
                $("#slider").after($(c).find(".announce").hide().fadeIn());
                c = b.frameForURL(a);
                $("#slider .frame-center .relatize").relatizeDate();
                GitHub.Tree.rewriteSHAsInLinksWithRef();
                GitHub.CachedCommitDataPoller(50,
                c);
                GitHub.Blob.show();
                b.setFrameTitle(c)
            },
            error: function() {
                $("#slider .frame-center").html("<h3>Something went wrong.</h3>")
            },
            complete: function() {
                b.sliding = false
            }
        })
    }
};
$(function() {
    window.slider = new GitHub.TreeSlider
});
$(function() {
    GitHub.UFO = {
        drawFont: function() {
            var a = document.getElementById("ufo");
            a = a.getContext("2d");
            for (var d = 0; d < glifs.length; d++) {
                a.save();
                var b = d % 9 * 100,
                c = Math.floor(d / 9) * 100;
                a.translate(b + 10, c + 80);
                a.scale(0.1, -0.1);
                b = new GitHub.UFO.Glif(a, glifs[d]);
                b.draw();
                a.restore()
            }
        }
    };
    GitHub.UFO.Glif = function(a, d) {
        this.ctx = a;
        this.contours = d
    };
    GitHub.UFO.Glif.prototype = {
        draw: function() {
            this.ctx.beginPath();
            for (var a = 0; a < this.contours.length; a++) this.drawContour(this.contours[a]);
            this.ctx.fillStyle = "black";
            this.ctx.fill()
        },
        drawContour: function(a) {
            for (var d = 0; d < a.length; d++) d == 0 ? this.moveVertex(a[d]) : this.drawVertex(a[d]);
            this.drawVertex(a[0])
        },
        moveVertex: function(a) {
            this.ctx.moveTo(a[0], a[1])
        },
        drawVertex: function(a) {
            if (a.length == 2) this.ctx.lineTo(a[0], a[1]);
            else if (a.length == 4) this.ctx.quadraticCurveTo(a[2], a[3], a[0], a[1]);
            else a.length == 6 && this.ctx.bezierCurveTo(a[2], a[3], a[4], a[5], a[0], a[1])
        }
    };
    $("#ufo").length > 0 && GitHub.UFO.drawFont();
    $(".glif_diff").each(function() {
        var a = $(this).attr("rel"),
        d = this.getContext("2d");
        a = eval("glif_" + a);
        a = new GitHub.UFO.Glif(d, a);
        d.translate(0, 240);
        d.scale(0.333, -0.333);
        a.draw()
    })
});
$(function() {
    $("a.follow").click(function() {
        $.post(this.href, {});
        $(this).parent().find(".follow").toggle();
        return false
    });
    $("#inline_visible_repos").click(function() {
        var a = $(this).spin(),
        d = window.location + "/ajax_public_repos";
        $(".projects").load(d,
        function() {
            a.stopSpin();
            $(".relatize").relatizeDate()
        });
        a.hide();
        return false
    });
    GitHub.editableGenerator && $("#dashboard span.edit").each(GitHub.editableGenerator({
        width: "200px",
        submittype: "put"
    }));
    $("#edit_user .info .rename").click(function() {
        $("#edit_user .username").toggle();
        $("#user_rename").toggle();
        return false
    });
    $("#user_rename > input[type=submit]").click(function() {
        if (!confirm(GitHub.rename_confirmation())) return false
    });
    $("#reveal_cancel_info").click(function() {
        $(this).toggle();
        $("#cancel_info").toggle();
        return false
    });
    $("#cancel_plan").submit(function() {
        var a = "Are you POSITIVE you want to delete this account? There is absolutely NO going back. All repositories, comments, wiki pages - everything will be gone. Please consider downgrading the account's plan.";
        return confirm(a)
    });
    window.location.href.match(/account\/upgrade$/) && $("#change_plan_toggle").click()
});
$(function() {
    $("#see-more-elsewhere").click(function() {
        $(".seen-elsewhere").show();
        $(this).remove();
        return false
    });
    var a = [];
    $("form#history input[type=submit]").attr("disabled", true);
    $("form#history input[type=checkbox]").change(function() {
        var d = $(this).val(),
        b = $.inArray(d, a);
        if (b > -1) a.splice(b, 1);
        else {
            a.push(d);
            if (a.length > 2) {
                d = a.shift();
                $("input[value=" + d + "]").attr("checked", false)
            }
        }
        $("form#history tr.commit").removeClass("selected");
        $("form#history input[type=submit]").attr("disabled", true);
        if (a.length ==
        2) {
            $("form#history input[type=submit]").attr("disabled", false);
            var c = false;
            $("form#history tr.commit").each(function() {
                c && $(this).addClass("selected");
                if ($(this).find("input:checked").length > 0) c = !c;
                c && $(this).addClass("selected")
            })
        }
    })
});