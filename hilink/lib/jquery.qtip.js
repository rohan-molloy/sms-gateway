/*!
 * jquery.qtip. The jQuery tooltip plugin
 *
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : February 2009
 * Version : 1.0.0-rc3
 * Released: Tuesday 12th May, 2009 - 00:00
 * Debug: jquery.qtip.debug.js
 */
(function(e) {
    e(document).ready(function() {
        var r;
        e(window).bind("resize scroll", function(t) {
            for (r = 0; r < e.fn.qtip.interfaces.length; r++) {
                var s = e.fn.qtip.interfaces[r];
                if (s && s.status && s.status.rendered && s.options.position.type !== "static" && s.elements.tooltip.is(":visible") && (s.options.position.adjust.scroll && t.type === "scroll" || s.options.position.adjust.resize && t.type === "resize")) {
                    s.updatePosition(t, true)
                }
            }
        });
        e(document).bind("mouseenter.qtip", function(t) {
            if (e(t.target).parents("div.qtip").length === 0) {
                var u = e(".qtipSelector"),
                    s = u.qtip("api");
                if (u.is(":visible") && s && s.status && !s.status.disabled && e(t.target).add(s.elements.target).length > 1) {
                    s.hide(t)
                }
            }
        })
    });

    function n(r) {
        if (!r) {
            return false
        }
        this.x = String(r).replace(/middle/i, "center").match(/left|right|center/i)[0].toLowerCase();
        this.y = String(r).replace(/middle/i, "center").match(/top|bottom|center/i)[0].toLowerCase();
        this.offset = {
            left: 0,
            top: 0
        };
        this.precedance = (r.charAt(0).search(/^(t|b)/) > -1) ? "y" : "x";
        this.string = function() {
            return (this.precedance === "y") ? this.y + this.x : this.x + this.y
        }
    }

    function b(u, t, s) {
        var r = {
            bottomright: [
                [0, 0],
                [t, s],
                [t, 0]
            ],
            bottomleft: [
                [0, 0],
                [t, 0],
                [0, s]
            ],
            topright: [
                [0, s],
                [t, 0],
                [t, s]
            ],
            topleft: [
                [0, 0],
                [0, s],
                [t, s]
            ],
            topcenter: [
                [0, s],
                [t / 2, 0],
                [t, s]
            ],
            bottomcenter: [
                [0, 0],
                [t, 0],
                [t / 2, s]
            ],
            rightcenter: [
                [0, 0],
                [t, s / 2],
                [0, s]
            ],
            leftcenter: [
                [t, 0],
                [t, s],
                [0, s / 2]
            ]
        };
        r.lefttop = r.bottomright;
        r.righttop = r.bottomleft;
        r.leftbottom = r.topright;
        r.rightbottom = r.topleft;
        return r[u]
    }

    function f(r) {
        var s;
        if (e("<canvas />").get(0).getContext) {
            s = {
                topLeft: [r, r],
                topRight: [0, r],
                bottomLeft: [r, 0],
                bottomRight: [0, 0]
            }
        } else {
            if (e.browser.msie) {
                s = {
                    topLeft: [-90, 90, 0],
                    topRight: [-90, 90, -r],
                    bottomLeft: [90, 270, 0],
                    bottomRight: [90, 270, -r]
                }
            }
        }
        return s
    }

    function p(t, s) {
        var u, r;
        u = e.extend(true, {}, t);
        for (r in u) {
            if (s === true && (/(tip|classes)/i).test(r)) {
                delete u[r]
            } else {
                if (!s && (/(width|border|tip|title|classes|user)/i).test(r)) {
                    delete u[r]
                }
            }
        }
        return u
    }

    function d(r) {
        if (typeof r.tip !== "object") {
            r.tip = {
                corner: r.tip
            }
        }
        if (typeof r.tip.size !== "object") {
            r.tip.size = {
                width: r.tip.size,
                height: r.tip.size
            }
        }
        if (typeof r.border !== "object") {
            r.border = {
                width: r.border
            }
        }
        if (typeof r.width !== "object") {
            r.width = {
                value: r.width
            }
        }
        if (typeof r.width.max === "string") {
            r.width.max = parseInt(r.width.max.replace(/([0-9]+)/i, "$1"), 10)
        }
        if (typeof r.width.min === "string") {
            r.width.min = parseInt(r.width.min.replace(/([0-9]+)/i, "$1"), 10)
        }
        if (typeof r.tip.size.x === "number") {
            r.tip.size.width = r.tip.size.x;
            delete r.tip.size.x
        }
        if (typeof r.tip.size.y === "number") {
            r.tip.size.height = r.tip.size.y;
            delete r.tip.size.y
        }
        return r
    }

    function a() {
        var r, s, t, w, u, v;
        r = this;
        t = [true, {}];
        for (s = 0; s < arguments.length; s++) {
            t.push(arguments[s])
        }
        w = [e.extend.apply(e, t)];
        while (typeof w[0].name === "string") {
            w.unshift(d(e.fn.qtip.styles[w[0].name]))
        }
        w.unshift(true, {
            classes: {
                tooltip: "qtip-" + (arguments[0].name || "defaults")
            }
        }, e.fn.qtip.styles.defaults);
        u = e.extend.apply(e, w);
        v = (e.browser.msie) ? 1 : 0;
        u.tip.size.width += v;
        u.tip.size.height += v;
        if (u.tip.size.width % 2 > 0) {
            u.tip.size.width += 1
        }
        if (u.tip.size.height % 2 > 0) {
            u.tip.size.height += 1
        }
        if (u.tip.corner === true) {
            if (r.options.position.corner.tooltip === "center" && r.options.position.corner.target === "center") {
                u.tip.corner = false
            } else {
                u.tip.corner = r.options.position.corner.tooltip
            }
        }
        return u
    }

    function q(t, v, r, s) {
        var u = t.get(0).getContext("2d");
        u.fillStyle = s;
        u.beginPath();
        u.arc(v[0], v[1], r, 0, Math.PI * 2, false);
        u.fill()
    }

    function k() {
        var E, y, s, A, w, D, t, F, C, x, v, B, z, r, u;
        E = this;
        E.elements.wrapper.find(".qtip-borderBottom, .qtip-borderTop").remove();
        s = E.options.style.border.width;
        A = E.options.style.border.radius;
        w = E.options.style.border.color || E.options.style.tip.color;
        D = f(A);
        t = {};
        for (y in D) {
            t[y] = '<div rel="' + y + '" style="' + ((/Left/).test(y) ? "left" : "right") + ":0; position:absolute; height:" + A + "px; width:" + A + 'px; overflow:hidden; line-height:0.1px; font-size:1px">';
            if (e("<canvas />").get(0).getContext) {
                t[y] += '<canvas height="' + A + '" width="' + A + '" style="vertical-align: top"></canvas>'
            } else {
                if (e.browser.msie) {
                    F = A * 2 + 3;
                    t[y] += '<v:arc stroked="false" fillcolor="' + w + '" startangle="' + D[y][0] + '" endangle="' + D[y][1] + '" style="width:' + F + "px; height:" + F + "px; margin-top:" + ((/bottom/).test(y) ? -2 : -1) + "px; margin-left:" + ((/Right/).test(y) ? D[y][2] - 3.5 : -1) + 'px; vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>'
                }
            }
            t[y] += "</div>"
        }
        C = E.getDimensions().width - (Math.max(s, A) * 2);
        x = '<div class="qtip-betweenCorners" style="height:' + A + "px; width:" + C + "px; overflow:hidden; background-color:" + w + '; line-height:0.1px; font-size:1px;">';
        v = '<div class="qtip-borderTop" dir="ltr" style="height:' + A + "px; margin-left:" + A + 'px; line-height:0.1px; font-size:1px; padding:0;">' + t.topLeft + t.topRight + x;
        E.elements.wrapper.prepend(v);
        B = '<div class="qtip-borderBottom" dir="ltr" style="height:' + A + "px; margin-left:" + A + 'px; line-height:0.1px; font-size:1px; padding:0;">' + t.bottomLeft + t.bottomRight + x;
        E.elements.wrapper.append(B);
        if (e("<canvas />").get(0).getContext) {
            E.elements.wrapper.find("canvas").each(function() {
                z = D[e(this).parent("[rel]:first").attr("rel")];
                q.call(E, e(this), z, A, w)
            })
        } else {
            if (e.browser.msie) {
                E.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>')
            }
        }
        r = Math.max(A, (A + (s - A)));
        u = Math.max(s - A, 0);
        E.elements.contentWrapper.css({
            border: "0px solid " + w,
            borderWidth: u + "px " + r + "px"
        })
    }

    function g(s, u, r) {
        var t = s.get(0).getContext("2d");
        t.fillStyle = r;
        t.beginPath();
        t.moveTo(u[0][0], u[0][1]);
        t.lineTo(u[1][0], u[1][1]);
        t.lineTo(u[2][0], u[2][1]);
        t.fill()
    }

    function m(t) {
        var s, v, x, r, w, u;
        s = this;
        if (s.options.style.tip.corner === false || !s.elements.tip) {
            return
        }
        if (!t) {
            t = new n(s.elements.tip.attr("rel"))
        }
        v = x = (e.browser.msie) ? 1 : 0;
        s.elements.tip.css(t[t.precedance], 0);
        if (t.precedance === "y") {
            if (e.browser.msie) {
                if (parseInt(e.browser.version.charAt(0), 10) === 6) {
                    x = t.y === "top" ? -3 : 1
                } else {
                    x = t.y === "top" ? 1 : 2
                }
            }
            if (t.x === "center") {
                s.elements.tip.css({
                    left: "50%",
                    marginLeft: -(s.options.style.tip.size.width / 2)
                })
            } else {
                if (t.x === "left") {
                    s.elements.tip.css({
                        left: s.options.style.border.radius - v
                    })
                } else {
                    s.elements.tip.css({
                        right: s.options.style.border.radius + v
                    })
                }
            }
            if (t.y === "top") {
                s.elements.tip.css({
                    top: -x
                })
            } else {
                s.elements.tip.css({
                    bottom: x
                })
            }
        } else {
            if (e.browser.msie) {
                x = (parseInt(e.browser.version.charAt(0), 10) === 6) ? 1 : (t.x === "left" ? 1 : 2)
            }
            if (t.y === "center") {
                s.elements.tip.css({
                    top: "50%",
                    marginTop: -(s.options.style.tip.size.height / 2)
                })
            } else {
                if (t.y === "top") {
                    s.elements.tip.css({
                        top: s.options.style.border.radius - v
                    })
                } else {
                    s.elements.tip.css({
                        bottom: s.options.style.border.radius + v
                    })
                }
            }
            if (t.x === "left") {
                s.elements.tip.css({
                    left: -x
                })
            } else {
                s.elements.tip.css({
                    right: x
                })
            }
        }
        r = "padding-" + t[t.precedance];
        w = s.options.style.tip.size[t.precedance === "x" ? "width" : "height"];
        s.elements.tooltip.css("padding", 0).css(r, w);
        if (e.browser.msie && parseInt(e.browser.version.charAt(0), 6) === 6) {
            u = parseInt(s.elements.tip.css("margin-top"), 10) || 0;
            u += parseInt(s.elements.content.css("margin-top"), 10) || 0;
            s.elements.tip.css({
                marginTop: u
            })
        }
    }

    function c(u) {
        var s, r, x, t, w, v;
        s = this;
        if (s.elements.tip !== null) {
            s.elements.tip.remove()
        }
        r = s.options.style.tip.color || s.options.style.border.color;
        if (s.options.style.tip.corner === false) {
            return
        } else {
            if (!u) {
                u = new n(s.options.style.tip.corner)
            }
        }
        x = b(u.string(), s.options.style.tip.size.width, s.options.style.tip.size.height);
        s.elements.tip = '<div class="' + s.options.style.classes.tip + '" dir="ltr" rel="' + u.string() + '" style="position:absolute; height:' + s.options.style.tip.size.height + "px; width:" + s.options.style.tip.size.width + 'px; margin:0 auto; line-height:0.1px; font-size:1px;"></div>';
        s.elements.tooltip.prepend(s.elements.tip);
        if (e("<canvas />").get(0).getContext) {
            v = '<canvas height="' + s.options.style.tip.size.height + '" width="' + s.options.style.tip.size.width + '"></canvas>'
        } else {
            if (e.browser.msie) {
                t = s.options.style.tip.size.width + "," + s.options.style.tip.size.height;
                w = "m" + x[0][0] + "," + x[0][1];
                w += " l" + x[1][0] + "," + x[1][1];
                w += " " + x[2][0] + "," + x[2][1];
                w += " xe";
                v = '<v:shape fillcolor="' + r + '" stroked="false" filled="true" path="' + w + '" coordsize="' + t + '" style="width:' + s.options.style.tip.size.width + "px; height:" + s.options.style.tip.size.height + "px; line-height:0.1px; display:inline-block; behavior:url(#default#VML); vertical-align:" + (u.y === "top" ? "bottom" : "top") + '"></v:shape>';
                v += '<v:image style="behavior:url(#default#VML);"></v:image>';
                s.elements.contentWrapper.css("position", "relative")
            }
        }
        s.elements.tip = s.elements.tooltip.find("." + s.options.style.classes.tip).eq(0);
        s.elements.tip.html(v);
        if (e("<canvas  />").get(0).getContext) {
            g.call(s, s.elements.tip.find("canvas:first"), x, r)
        }
        if (u.y === "top" && e.browser.msie && parseInt(e.browser.version.charAt(0), 10) === 6) {
            s.elements.tip.css({
                marginTop: -4
            })
        }
        m.call(s, u)
    }

    function h() {
        var r = this;
        if (r.elements.title !== null) {
            r.elements.title.remove()
        }
        r.elements.tooltip.attr("aria-labelledby", "qtip-" + r.id + "-title");
        r.elements.title = e('<div id="qtip-' + r.id + '-title" class="' + r.options.style.classes.title + '"></div>').css(p(r.options.style.title, true)).css({
            zoom: (e.browser.msie) ? 1 : 0
        }).prependTo(r.elements.contentWrapper);
        if (r.options.content.title.text) {
            r.updateTitle.call(r, r.options.content.title.text)
        }
        if (r.options.content.title.button !== false && typeof r.options.content.title.button === "string") {
            r.elements.button = e('<a class="' + r.options.style.classes.button + '" role="button" style="float:right; position: relative"></a>').css(p(r.options.style.button, true)).html(r.options.content.title.button).prependTo(r.elements.title).click(function(s) {
                if (!r.status.disabled) {
                    r.hide(s)
                }
            })
        }
    }

    function j() {
        var s, u, t, r;
        s = this;
        u = s.options.show.when.target;
        t = s.options.hide.when.target;
        if (s.options.hide.fixed) {
            t = t.add(s.elements.tooltip)
        }
        r = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseout", "mouseenter", "mouseleave", "mouseover"];

        function x(y) {
            if (s.status.disabled === true) {
                return
            }
            clearTimeout(s.timers.inactive);
            s.timers.inactive = setTimeout(function() {
                e(r).each(function() {
                    t.unbind(this + ".qtip-inactive");
                    s.elements.content.unbind(this + ".qtip-inactive")
                });
                s.hide(y)
            }, s.options.hide.delay)
        }
        if (s.options.hide.fixed === true) {
            s.elements.tooltip.bind("mouseover.qtip", function() {
                if (s.status.disabled === true) {
                    return
                }
                clearTimeout(s.timers.hide)
            })
        }

        function w(y) {
            if (s.status.disabled === true) {
                return
            }
            if (s.options.hide.when.event === "inactive") {
                e(r).each(function() {
                    t.bind(this + ".qtip-inactive", x);
                    s.elements.content.bind(this + ".qtip-inactive", x)
                });
                x()
            }
            clearTimeout(s.timers.show);
            clearTimeout(s.timers.hide);
            if (s.options.show.delay > 0) {
                s.timers.show = setTimeout(function() {
                    s.show(y)
                }, s.options.show.delay)
            } else {
                s.show(y)
            }
        }

        function v(y) {
            if (s.status.disabled === true) {
                return
            }
            if (s.options.hide.fixed === true && (/mouse(out|leave)/i).test(s.options.hide.when.event) && e(y.relatedTarget).parents('div.qtip[id^="qtip"]').length > 0) {
                y.stopPropagation();
                y.preventDefault();
                clearTimeout(s.timers.hide);
                return false
            }
            clearTimeout(s.timers.show);
            clearTimeout(s.timers.hide);
            s.elements.tooltip.stop(true, true);
            s.timers.hide = setTimeout(function() {
                s.hide(y)
            }, s.options.hide.delay)
        }
        if (s.options.position.target === "mouse" && s.options.position.type !== "static") {
            u.bind("mousemove.qtip", function(y) {
                s.cache.mouse = {
                    left: y.pageX,
                    top: y.pageY
                };
                if (s.status.disabled === false && s.options.position.adjust.mouse === true && s.options.position.type !== "static" && s.elements.tooltip.css("display") !== "none") {
                    s.updatePosition(y)
                }
            })
        }
        if ((s.options.show.when.target.add(s.options.hide.when.target).length === 1 && s.options.show.when.event === s.options.hide.when.event && s.options.hide.when.event !== "inactive") || s.options.hide.when.event === "unfocus") {
            s.cache.toggle = 0;
            u.bind(s.options.show.when.event + ".qtip", function(y) {
                if (s.cache.toggle === 0) {
                    w(y)
                } else {
                    v(y)
                }
            })
        } else {
            u.bind(s.options.show.when.event + ".qtip", w);
            if (s.options.hide.when.event !== "inactive") {
                t.bind(s.options.hide.when.event + ".qtip", v)
            }
        }
        if ((/(fixed|absolute)/).test(s.options.position.type)) {
            s.elements.tooltip.bind("mouseover.qtip", s.focus)
        }
    }

    function i() {
        var r, s, t;
        r = this;
        t = r.getDimensions();
        s = '<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" style="display:block; position:absolute; z-index:15000; filter:alpha(opacity=\'0\'); border: 1px solid red; height:' + t.height + "px; width:" + t.width + 'px" />';
        r.elements.bgiframe = r.elements.wrapper.prepend(s).children(".qtip-bgiframe:first")
    }

    function o() {
        var r, t, s, u, v;
        r = this;
        r.beforeRender.call(r);
        r.status.rendered = 2;
        r.elements.tooltip = '<div qtip="' + r.id + '" id="qtip-' + r.id + '" role="tooltip" aria-describedby="qtip-' + r.id + '-content" class="qtip ' + (r.options.style.classes.tooltip || r.options.style) + '" style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0; z-index: 15000; position:' + r.options.position.type + ';">   <div class="qtip-wrapper" style="position:relative; overflow:hidden;">     <div class="qtip-contentWrapper" style="overflow:hidden;">        <div id="qtip-' + r.id + '-content" class="qtip-content ' + r.options.style.classes.content + '"></div> </div></div></div>';
        r.elements.tooltip = e(r.elements.tooltip);
        r.elements.tooltip.appendTo(r.options.position.container);
        r.elements.tooltip.data("qtip", {
            current: 0,
            interfaces: [r]
        });
        r.elements.wrapper = r.elements.tooltip.children("div:first");
        r.elements.contentWrapper = r.elements.wrapper.children("div:first");
        r.elements.content = r.elements.contentWrapper.children("div:first").css(p(r.options.style));
        if (e.browser.msie) {
            r.elements.wrapper.add(r.elements.content).css({
                zoom: 1
            })
        }
        if (r.options.hide.when.event === "unfocus") {
            r.elements.tooltip.attr("unfocus", true)
        }
        if (typeof r.options.style.width.value === "number") {
            r.updateWidth()
        }
        if (e("<canvas />").get(0).getContext || e.browser.msie) {
            if (r.options.style.border.radius > 0) {
                k.call(r)
            } else {
                r.elements.contentWrapper.css({
                    border: r.options.style.border.width + "px solid " + r.options.style.border.color
                })
            }
            if (r.options.style.tip.corner !== false) {
                c.call(r)
            }
        } else {
            r.elements.contentWrapper.css({
                border: r.options.style.border.width + "px solid " + r.options.style.border.color
            });
            r.options.style.border.radius = 0;
            r.options.style.tip.corner = false
        }
        if ((typeof r.options.content.text === "string" && r.options.content.text.length > 0) || (r.options.content.text.jquery && r.options.content.text.length > 0)) {
            t = r.options.content.text
        } else {
            t = " "
        }
        if (r.options.content.title.text !== false) {
            h.call(r)
        }
        r.updateContent(t, false);
        j.call(r);
        if (r.options.show.ready === true) {
            r.show()
        }
        if (r.options.content.url !== false) {
            s = r.options.content.url;
            u = r.options.content.data;
            v = r.options.content.method || "get";
            r.loadContent(s, u, v)
        }
        r.status.rendered = true;
        r.onRender.call(r)
    }

    function l(t, s, u) {
        var r = this;
        r.id = u;
        r.options = s;
        r.status = {
            animated: false,
            rendered: false,
            disabled: false,
            focused: false
        };
        r.elements = {
            target: t.addClass(r.options.style.classes.target),
            tooltip: null,
            wrapper: null,
            content: null,
            contentWrapper: null,
            title: null,
            button: null,
            tip: null,
            bgiframe: null
        };
        r.cache = {
            attr: false,
            mouse: {},
            toggle: 0,
            overflow: {
                left: false,
                top: false
            }
        };
        r.timers = {};
        e.extend(r, r.options.api, {
            show: function(x) {
                var w, y;
                if (!r.status.rendered) {
                    return false
                }
                if (r.elements.tooltip.css("display") !== "none") {
                    return r
                }
                r.elements.tooltip.stop(true, false);
                w = r.beforeShow.call(r, x);
                if (w === false) {
                    return r
                }

                function v() {
                    r.elements.tooltip.attr("aria-hidden", true);
                    if (r.options.position.type !== "static") {
                        r.focus()
                    }
                    r.onShow.call(r, x);
                    if (e.browser.msie) {
                        var z = r.elements.tooltip.get(0).style;
                        z.removeAttribute("filter");
                        z.removeAttribute("opacity")
                    } else {
                        r.elements.tooltip.css({
                            opacity: ""
                        })
                    }
                }
                r.cache.toggle = 1;
                if (r.options.position.type !== "static") {
                    r.updatePosition(x, (r.options.show.effect.length > 0 && r.rendered !== 2))
                }
                if (typeof r.options.show.solo === "object") {
                    y = e(r.options.show.solo)
                } else {
                    if (r.options.show.solo === true) {
                        y = e("div.qtip").not(r.elements.tooltip)
                    }
                }
                if (y) {
                    y.each(function() {
                        if (e(this).qtip("api").status.rendered === true) {
                            e(this).qtip("api").hide()
                        }
                    })
                }
                if (typeof r.options.show.effect.type === "function") {
                    r.options.show.effect.type.call(r.elements.tooltip, r.options.show.effect.length);
                    r.elements.tooltip.queue(function() {
                        v();
                        e(this).dequeue()
                    })
                } else {
                    if (r.options.show.effect.type === undefined) {
                        r.elements.tooltip.show(null, v)
                    } else {
                        alert(r.options.show.effect.type);
                        switch (r.options.show.effect.type.toLowerCase()) {
                            case "fade":
                                r.elements.tooltip.fadeIn(r.options.show.effect.length, v);
                                break;
                            case "slide":
                                r.elements.tooltip.slideDown(r.options.show.effect.length, function() {
                                    v();
                                    if (r.options.position.type !== "static") {
                                        r.updatePosition(x, true)
                                    }
                                });
                                break;
                            case "grow":
                                r.elements.tooltip.show(r.options.show.effect.length, v);
                                break;
                            default:
                                r.elements.tooltip.show(null, v);
                                break
                        }
                        r.elements.tooltip.addClass(r.options.style.classes.active)
                    }
                }
                return r
            },
            hide: function(x) {
                var w;
                if (!r.status.rendered) {
                    return false
                } else {
                    if (r.elements.tooltip.css("display") === "none") {
                        return r
                    }
                }
                clearTimeout(r.timers.show);
                r.elements.tooltip.stop(true, false);
                w = r.beforeHide.call(r, x);
                if (w === false) {
                    return r
                }

                function v() {
                    r.elements.tooltip.attr("aria-hidden", true);
                    if (e.browser.msie) {
                        r.elements.tooltip.get(0).style.removeAttribute("opacity")
                    } else {
                        r.elements.tooltip.css({
                            opacity: ""
                        })
                    }
                    r.onHide.call(r, x)
                }
                r.cache.toggle = 0;
                if (typeof r.options.hide.effect.type === "function") {
                    r.options.hide.effect.type.call(r.elements.tooltip, r.options.hide.effect.length);
                    r.elements.tooltip.queue(function() {
                        v();
                        e(this).dequeue()
                    })
                } else {
                    switch (r.options.hide.effect.type.toLowerCase()) {
                        case "fade":
                            r.elements.tooltip.fadeOut(r.options.hide.effect.length, v);
                            break;
                        case "slide":
                            r.elements.tooltip.slideUp(r.options.hide.effect.length, v);
                            break;
                        case "grow":
                            r.elements.tooltip.hide(r.options.hide.effect.length, v);
                            break;
                        default:
                            r.elements.tooltip.hide(null, v);
                            break
                    }
                    r.elements.tooltip.removeClass(r.options.style.classes.active)
                }
                return r
            },
            toggle: function(v, w) {
                var x = /boolean|number/.test(typeof w) ? w : !r.elements.tooltip.is(":visible");
                r[x ? "show" : "hide"](v);
                return r
            },
            updatePosition: function(v, w) {
                if (!r.status.rendered) {
                    return false
                }
                var L = s.position,
                    H = e(L.target),
                    A = r.elements.tooltip.outerWidth(),
                    x = r.elements.tooltip.outerHeight(),
                    I, E, D, K = L.corner.tooltip,
                    y = L.corner.target,
                    z, J, B, G, C, F = {
                        left: function() {
                            var Q = e(window).scrollLeft(),
                                O = e(window).width() + e(window).scrollLeft(),
                                M = K.x === "center" ? A / 2 : A,
                                N = K.x === "center" ? I / 2 : I,
                                T = (K.x === "center" ? 1 : 2) * r.options.style.border.radius,
                                R = -2 * L.adjust.x,
                                S = D.left + A,
                                P;
                            if (S > O) {
                                P = R - M - N + T;
                                if (D.left + P > Q || Q - (D.left + P) < S - O) {
                                    return {
                                        adjust: P,
                                        tip: "right"
                                    }
                                }
                            }
                            if (D.left < Q) {
                                P = R + M + N - T;
                                if (S + P < O || S + P - O < Q - D.left) {
                                    return {
                                        adjust: P,
                                        tip: "left"
                                    }
                                }
                            }
                            return {
                                adjust: 0,
                                tip: K.x
                            }
                        },
                        top: function() {
                            var Q = e(window).scrollTop(),
                                O = e(window).height() + e(window).scrollTop(),
                                M = K.y === "center" ? x / 2 : x,
                                N = K.y === "center" ? E / 2 : E,
                                T = (K.y === "center" ? 1 : 2) * r.options.style.border.radius,
                                S = -2 * L.adjust.y,
                                R = D.top + x,
                                P;
                            if (R > O) {
                                P = S - M - N + T;
                                if (D.top + P > Q || Q - (D.top + P) < R - O) {
                                    return {
                                        adjust: P,
                                        tip: "bottom"
                                    }
                                }
                            }
                            if (D.top < Q) {
                                P = S + M + N - T;
                                if (R + P < O || R + P - O < Q - D.top) {
                                    return {
                                        adjust: P,
                                        tip: "top"
                                    }
                                }
                            }
                            return {
                                adjust: 0,
                                tip: K.y
                            }
                        }
                    };
                if (v && s.position.target === "mouse") {
                    y = {
                        x: "left",
                        y: "top"
                    };
                    I = E = 0;
                    if (!v.pageX) {
                        D = r.cache.mouse
                    } else {
                        D = {
                            top: v.pageY,
                            left: v.pageX
                        }
                    }
                } else {
                    if (H[0] === document) {
                        I = H.width();
                        E = H.height();
                        D = {
                            top: 0,
                            left: 0
                        }
                    } else {
                        if (H[0] === window) {
                            I = H.width();
                            E = H.height();
                            D = {
                                top: H.scrollTop(),
                                left: H.scrollLeft()
                            }
                        } else {
                            if (H.is("area")) {
                                J = r.options.position.target.attr("coords").split(",");
                                for (B = 0; B < J.length; B++) {
                                    J[B] = parseInt(J[B], 10)
                                }
                                G = r.options.position.target.parent("map").attr("name");
                                C = e('img[usemap="#' + G + '"]:first').offset();
                                D = {
                                    left: Math.floor(C.left + J[0]),
                                    top: Math.floor(C.top + J[1])
                                };
                                switch (r.options.position.target.attr("shape").toLowerCase()) {
                                    case "rect":
                                        I = Math.ceil(Math.abs(J[2] - J[0]));
                                        E = Math.ceil(Math.abs(J[3] - J[1]));
                                        break;
                                    case "circle":
                                        I = J[2] + 1;
                                        E = J[2] + 1;
                                        break;
                                    case "poly":
                                        I = J[0];
                                        E = J[1];
                                        for (B = 0; B < J.length; B++) {
                                            if (B % 2 === 0) {
                                                if (J[B] > I) {
                                                    I = J[B]
                                                }
                                                if (J[B] < J[0]) {
                                                    D.left = Math.floor(C.left + J[B])
                                                }
                                            } else {
                                                if (J[B] > E) {
                                                    E = J[B]
                                                }
                                                if (J[B] < J[1]) {
                                                    D.top = Math.floor(C.top + J[B])
                                                }
                                            }
                                        }
                                        I = I - (D.left - C.left);
                                        E = E - (D.top - C.top);
                                        break
                                }
                                I -= 2;
                                E -= 2
                            } else {
                                I = H.outerWidth();
                                E = H.outerHeight();
                                if (!L.adjust.offset || r.elements.tooltip.offsetParent()[0] === document.body) {
                                    D = H.offset()
                                } else {
                                    D = H.position();
                                    D.top += H.offsetParent().scrollTop();
                                    D.left += H.offsetParent().scrollLeft()
                                }
                            }
                        }
                    }
                    D.left += y.x === "right" ? I : y.x === "center" ? I / 2 : 0;
                    D.top += y.y === "bottom" ? E : y.y === "center" ? E / 2 : 0
                }
                D.left += L.adjust.x + (K.x === "right" ? -A : K.x === "center" ? -A / 2 : 0);
                D.top += L.adjust.y + (K.y === "bottom" ? -x : K.y === "center" ? -x / 2 : 0);
                if (r.options.style.border.radius > 0) {
                    if (K.x === "left") {
                        D.left -= r.options.style.border.radius
                    } else {
                        if (K.x === "right") {
                            D.left += r.options.style.border.radius
                        }
                    }
                    if (K.y === "top") {
                        D.top -= r.options.style.border.radius
                    } else {
                        if (K.y === "bottom") {
                            D.top += r.options.style.border.radius
                        }
                    }
                }
                if (L.adjust.screen) {
                    (function() {
                        var N = {
                                x: 0,
                                y: 0
                            },
                            M = {
                                x: F.left(),
                                y: F.top()
                            },
                            O = new n(s.style.tip.corner);
                        if (r.elements.tip && O) {
                            if (M.y.adjust !== 0) {
                                D.top += M.y.adjust;
                                O.y = N.y = M.y.tip
                            }
                            if (M.x.adjust !== 0) {
                                D.left += M.x.adjust;
                                O.x = N.x = M.x.tip
                            }
                            r.cache.overflow = {
                                left: N.x === false,
                                top: N.y === false
                            };
                            if (r.elements.tip.attr("rel") !== O.string()) {
                                c.call(r, O)
                            }
                        }
                    }())
                }
                if (!r.elements.bgiframe && e.browser.msie && parseInt(e.browser.version.charAt(0), 10) === 6) {
                    i.call(r)
                }
                z = r.beforePositionUpdate.call(r, v);
                if (z === false) {
                    return r
                }
                if (s.position.target !== "mouse" && w === true) {
                    r.status.animated = true;
                    r.elements.tooltip.stop().animate(D, 200, "swing", function() {
                        r.status.animated = false
                    })
                } else {
                    r.elements.tooltip.css(D)
                }
                r.onPositionUpdate.call(r, v);
                return r
            },
            updateWidth: function(y) {
                if (!r.status.rendered || (y && typeof y !== "number")) {
                    return false
                }
                var A = r.elements.contentWrapper.siblings().add(r.elements.tip).add(r.elements.button),
                    x = r.elements.wrapper.add(r.elements.contentWrapper.children()),
                    z = r.elements.tooltip,
                    v = r.options.style.width.max,
                    w = r.options.style.width.min;
                if (!y) {
                    if (typeof r.options.style.width.value === "number") {
                        y = r.options.style.width.value
                    } else {
                        r.elements.tooltip.css({
                            width: "auto"
                        });
                        A.hide();
                        z.width(y);
                        if (e.browser.msie) {
                            x.css({
                                zoom: ""
                            })
                        }
                        y = r.getDimensions().width;
                        if (!r.options.style.width.value) {
                            y = Math.min(Math.max(y, w), v)
                        }
                    }
                }
                if (y % 2) {
                    y += 1
                }
                r.elements.tooltip.width(y);
                A.show();
                if (r.options.style.border.radius) {
                    r.elements.tooltip.find(".qtip-betweenCorners").each(function(B) {
                        e(this).width(y - (r.options.style.border.radius * 2))
                    })
                }
                if (e.browser.msie) {
                    x.css({
                        zoom: 1
                    });
                    r.elements.wrapper.width(y);
                    if (r.elements.bgiframe) {
                        r.elements.bgiframe.width(y).height(r.getDimensions.height)
                    }
                }
                return r
            },
            updateStyle: function(v) {
                var y, z, w, x, A;
                if (!r.status.rendered || typeof v !== "string" || !e.fn.qtip.styles[v]) {
                    return false
                }
                r.options.style = a.call(r, e.fn.qtip.styles[v], r.options.user.style);
                r.elements.content.css(p(r.options.style));
                if (r.options.content.title.text !== false) {
                    r.elements.title.css(p(r.options.style.title, true))
                }
                r.elements.contentWrapper.css({
                    borderColor: r.options.style.border.color
                });
                if (r.options.style.tip.corner !== false) {
                    if (e("<canvas />").get(0).getContext) {
                        y = r.elements.tooltip.find(".qtip-tip canvas:first");
                        w = y.get(0).getContext("2d");
                        w.clearRect(0, 0, 300, 300);
                        x = y.parent("div[rel]:first").attr("rel");
                        A = b(x, r.options.style.tip.size.width, r.options.style.tip.size.height);
                        g.call(r, y, A, r.options.style.tip.color || r.options.style.border.color)
                    } else {
                        if (e.browser.msie) {
                            y = r.elements.tooltip.find('.qtip-tip [nodeName="shape"]');
                            y.attr("fillcolor", r.options.style.tip.color || r.options.style.border.color)
                        }
                    }
                }
                if (r.options.style.border.radius > 0) {
                    r.elements.tooltip.find(".qtip-betweenCorners").css({
                        backgroundColor: r.options.style.border.color
                    });
                    if (e("<canvas />").get(0).getContext) {
                        z = f(r.options.style.border.radius);
                        r.elements.tooltip.find(".qtip-wrapper canvas").each(function() {
                            w = e(this).get(0).getContext("2d");
                            w.clearRect(0, 0, 300, 300);
                            x = e(this).parent("div[rel]:first").attr("rel");
                            q.call(r, e(this), z[x], r.options.style.border.radius, r.options.style.border.color)
                        })
                    } else {
                        if (e.browser.msie) {
                            r.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function() {
                                e(this).attr("fillcolor", r.options.style.border.color)
                            })
                        }
                    }
                }
                return r
            },
            updateContent: function(z, x) {
                var y, w, v;

                function A() {
                    r.updateWidth();
                    if (x !== false) {
                        if (r.options.position.type !== "static") {
                            r.updatePosition(r.elements.tooltip.is(":visible"), true)
                        }
                        if (r.options.style.tip.corner !== false) {
                            m.call(r)
                        }
                    }
                }
                if (!z) {
                    return false
                }
                y = r.beforeContentUpdate.call(r, z);
                if (typeof y === "string") {
                    z = y
                } else {
                    if (y === false) {
                        return
                    }
                }
                if (r.status.rendered) {
                    if (e.browser.msie) {
                        r.elements.contentWrapper.children().css({
                            zoom: "normal"
                        })
                    }
                    if (z.jquery && z.length > 0) {
                        z.clone(true).appendTo(r.elements.content).show()
                    } else {
                        r.elements.content.html(z)
                    }
                    w = r.elements.content.find("img[complete=false]");
                    if (w.length > 0) {
                        v = 0;
                        w.each(function(B) {
                            e('<img src="' + e(this).attr("src") + '" />').load(function() {
                                if (++v === w.length) {
                                    A()
                                }
                            })
                        })
                    } else {
                        A()
                    }
                } else {
                    r.options.content.text = z
                }
                r.onContentUpdate.call(r);
                return r
            },
            loadContent: function(v, y, z) {
                var x;

                function w(A) {
                    r.onContentLoad.call(r);
                    r.updateContent(A)
                }
                if (!r.status.rendered) {
                    return false
                }
                x = r.beforeContentLoad.call(r);
                if (x === false) {
                    return r
                }
                if (z === "post") {
                    e.post(v, y, w)
                } else {
                    e.get(v, y, w)
                }
                return r
            },
            updateTitle: function(w) {
                var v;
                if (!r.status.rendered || !w) {
                    return false
                }
                v = r.beforeTitleUpdate.call(r);
                if (v === false) {
                    return r
                }
                if (r.elements.button) {
                    r.elements.button = r.elements.button.clone(true)
                }
                r.elements.title.html(w);
                if (r.elements.button) {
                    r.elements.title.prepend(r.elements.button)
                }
                r.onTitleUpdate.call(r);
                return r
            },
            focus: function(z) {
                var x, w, v, y;
                if (!r.status.rendered || r.options.position.type === "static") {
                    return false
                }
                x = parseInt(r.elements.tooltip.css("z-index"), 10);
                w = 15000 + e('div.qtip[id^="qtip"]').length - 1;
                if (!r.status.focused && x !== w) {
                    y = r.beforeFocus.call(r, z);
                    if (y === false) {
                        return r
                    }
                    e('div.qtip[id^="qtip"]').not(r.elements.tooltip).each(function() {
                        if (e(this).qtip("api").status.rendered === true) {
                            v = parseInt(e(this).css("z-index"), 10);
                            if (typeof v === "number" && v > -1) {
                                e(this).css({
                                    zIndex: w
                                })
                            }
                            e(this).qtip("api").status.focused = false
                        }
                    });
                    r.elements.tooltip.css({
                        zIndex: w
                    });
                    r.status.focused = true;
                    r.onFocus.call(r, z)
                }
                return r
            },
            disable: function(v) {
                r.status.disabled = v ? true : false;
                return r
            },
            destroy: function() {
                var v, x, y, w = r.elements.target.data("old" + r.cache.attr[0]);
                x = r.beforeDestroy.call(r);
                if (x === false) {
                    return r
                }
                if (r.status.rendered) {
                    r.options.show.when.target.unbind("mousemove.qtip", r.updatePosition);
                    r.options.show.when.target.unbind("mouseout.qtip", r.hide);
                    r.options.show.when.target.unbind(r.options.show.when.event + ".qtip");
                    r.options.hide.when.target.unbind(r.options.hide.when.event + ".qtip");
                    r.elements.tooltip.unbind(r.options.hide.when.event + ".qtip");
                    r.elements.tooltip.unbind("mouseover.qtip", r.focus);
                    r.elements.tooltip.remove()
                } else {
                    r.options.show.when.target.unbind(r.options.show.when.event + ".qtip-" + r.id + "-create")
                }
                if (typeof r.elements.target.data("qtip") === "object") {
                    y = r.elements.target.data("qtip").interfaces;
                    if (typeof y === "object" && y.length > 0) {
                        for (v = 0; v < y.length - 1; v++) {
                            if (y[v].id === r.id) {
                                y.splice(v, 1)
                            }
                        }
                    }
                }
                e.fn.qtip.interfaces.splice(r.id, 1);
                if (typeof y === "object" && y.length > 0) {
                    r.elements.target.data("qtip").current = y.length - 1
                } else {
                    r.elements.target.removeData("qtip")
                }
                if (w) {
                    r.elements.target.attr(r.cache.attr[0], w)
                }
                r.onDestroy.call(r);
                return r.elements.target
            },
            getPosition: function() {
                var v, w;
                if (!r.status.rendered) {
                    return false
                }
                v = (r.elements.tooltip.css("display") !== "none") ? false : true;
                if (v) {
                    r.elements.tooltip.css({
                        visiblity: "hidden"
                    }).show()
                }
                w = r.elements.tooltip.offset();
                if (v) {
                    r.elements.tooltip.css({
                        visiblity: "visible"
                    }).hide()
                }
                return w
            },
            getDimensions: function() {
                var v, w;
                if (!r.status.rendered) {
                    return false
                }
                v = (!r.elements.tooltip.is(":visible")) ? true : false;
                if (v) {
                    r.elements.tooltip.css({
                        visiblity: "hidden"
                    }).show()
                }
                w = {
                    height: r.elements.tooltip.outerHeight(),
                    width: r.elements.tooltip.outerWidth()
                };
                if (v) {
                    r.elements.tooltip.css({
                        visiblity: "visible"
                    }).hide()
                }
                return w
            }
        })
    }
    e.fn.qtip = function(A, t) {
        var x, s, z, r, w, v, u, y;
        if (typeof A === "string") {
            if (e(this).data("qtip")) {
                if (A === "api") {
                    return e(this).data("qtip").interfaces[e(this).data("qtip").current]
                } else {
                    if (A === "interfaces") {
                        return e(this).data("qtip").interfaces
                    }
                }
            } else {
                return e(this)
            }
        } else {
            if (!A) {
                A = {}
            }
            if (typeof A.content !== "object" || (A.content.jquery && A.content.length > 0)) {
                A.content = {
                    text: A.content
                }
            }
            if (typeof A.content.title !== "object") {
                A.content.title = {
                    text: A.content.title
                }
            }
            if (typeof A.position !== "object") {
                A.position = {
                    corner: A.position
                }
            }
            if (typeof A.position.corner !== "object") {
                A.position.corner = {
                    target: A.position.corner,
                    tooltip: A.position.corner
                }
            }
            if (typeof A.show !== "object") {
                A.show = {
                    when: A.show
                }
            }
            if (typeof A.show.when !== "object") {
                A.show.when = {
                    event: A.show.when
                }
            }
            if (typeof A.show.effect !== "object") {
                A.show.effect = {
                    type: A.show.effect
                }
            }
            if (typeof A.hide !== "object") {
                A.hide = {
                    when: A.hide
                }
            }
            if (typeof A.hide.when !== "object") {
                A.hide.when = {
                    event: A.hide.when
                }
            }
            if (typeof A.hide.effect !== "object") {
                A.hide.effect = {
                    type: A.hide.effect
                }
            }
            if (typeof A.style !== "object") {
                A.style = {
                    name: A.style
                }
            }
            A.style = d(A.style);
            r = e.extend(true, {}, e.fn.qtip.defaults, A);
            r.style = a.call({
                options: r
            }, r.style);
            r.user = e.extend(true, {}, A)
        }
        return e(this).each(function() {
            var B = e(this),
                C = false;
            if (typeof A === "string") {
                v = A.toLowerCase();
                z = e(this).qtip("interfaces");
                if (typeof z === "object") {
                    if (t === true && v === "destroy") {
                        for (x = z.length - 1; x > -1; x--) {
                            if ("object" === typeof z[x]) {
                                z[x].destroy()
                            }
                        }
                    } else {
                        if (t !== true) {
                            z = [e(this).qtip("api")]
                        }
                        for (x = 0; x < z.length; x++) {
                            if (v === "destroy") {
                                z[x].destroy()
                            } else {
                                if (z[x].status.rendered === true) {
                                    if (v === "show") {
                                        z[x].show()
                                    } else {
                                        if (v === "hide") {
                                            z[x].hide()
                                        } else {
                                            if (v === "focus") {
                                                z[x].focus()
                                            } else {
                                                if (v === "disable") {
                                                    z[x].disable(true)
                                                } else {
                                                    if (v === "enable") {
                                                        z[x].disable(false)
                                                    } else {
                                                        if (v === "update") {
                                                            z[x].updatePosition()
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                u = e.extend(true, {}, r);
                u.hide.effect.length = r.hide.effect.length;
                u.show.effect.length = r.show.effect.length;
                if (u.position.container === false) {
                    u.position.container = e(document.body)
                }
                if (u.position.target === false) {
                    u.position.target = e(this)
                }
                if (u.show.when.target === false) {
                    u.show.when.target = e(this)
                }
                if (u.hide.when.target === false) {
                    u.hide.when.target = e(this)
                }
                u.position.corner.tooltip = new n(u.position.corner.tooltip);
                u.position.corner.target = new n(u.position.corner.target);
                if (!u.content.text.length) {
                    e(["title", "alt"]).each(function(E, D) {
                        var F = B.attr(D);
                        if (F && F.length) {
                            C = [D, F];
                            B.data("old" + D, F).removeAttr(D);
                            u.content.text = F.replace(/\n/gi, "<br />");
                            return false
                        }
                    })
                }
                s = e.fn.qtip.interfaces.length;
                for (x = 0; x < s; x++) {
                    if (typeof e.fn.qtip.interfaces[x] === "undefined") {
                        s = x;
                        break
                    }
                }
                w = new l(e(this), u, s);
                e.fn.qtip.interfaces[s] = w;
                w.cache.attr = C;
                if (typeof e(this).data("qtip") === "object" && e(this).data("qtip")) {
                    if (typeof e(this).attr("qtip") === "undefined") {
                        e(this).data("qtip").current = e(this).data("qtip").interfaces.length
                    }
                    e(this).data("qtip").interfaces.push(w)
                } else {
                    e(this).data("qtip", {
                        current: 0,
                        interfaces: [w]
                    })
                }
                if (u.content.prerender === false && u.show.when.event !== false && u.show.ready !== true) {
                    u.show.when.target.bind(u.show.when.event + ".qtip-" + s + "-create", {
                        qtip: s
                    }, function(D) {
                        y = e.fn.qtip.interfaces[D.data.qtip];
                        y.options.show.when.target.unbind(y.options.show.when.event + ".qtip-" + D.data.qtip + "-create");
                        y.cache.mouse = {
                            left: D.pageX,
                            top: D.pageY
                        };
                        o.call(y);
                        y.options.show.when.target.trigger(y.options.show.when.event)
                    })
                } else {
                    w.cache.mouse = {
                        left: u.show.when.target.offset().left,
                        top: u.show.when.target.offset().top
                    };
                    o.call(w)
                }
            }
        })
    };
    e.fn.qtip.interfaces = [];
    e.fn.qtip.fn = {
        attr: e.fn.attr
    };
    e.fn.attr = function(r) {
        var s = e(this).qtip("api");
        return (arguments.length === 1 && (/title|alt/i).test(r) && s.status && s.status.rendered === true) ? e(this).data("old" + s.cache.attr[0]) : e.fn.qtip.fn.attr.apply(this, arguments)
    };
    e.fn.qtip.defaults = {
        content: {
            prerender: true,
            text: false,
            url: false,
            data: null,
            title: {
                text: false,
                button: false
            }
        },
        position: {
            target: false,
            corner: {
                target: "bottomRight",
                tooltip: "topLeft"
            },
            adjust: {
                x: 5,
                y: 5,
                mouse: true,
                screen: false,
                scroll: true,
                resize: true
            },
            type: "absolute",
            container: false
        },
        show: {
            when: {
                target: false,
                event: "mouseover"
            },
            delay: 140,
            solo: false,
            ready: false
        },
        hide: {
            when: {
                target: false,
                event: "mouseout"
            },
            effect: {
                type: "hide",
                length: 100
            },
            delay: 0,
            fixed: false
        },
        api: {
            beforeRender: function() {},
            onRender: function() {},
            beforePositionUpdate: function() {},
            onPositionUpdate: function() {},
            beforeShow: function() {},
            onShow: function() {},
            beforeHide: function() {},
            onHide: function() {},
            beforeContentUpdate: function() {},
            onContentUpdate: function() {},
            beforeContentLoad: function() {},
            onContentLoad: function() {},
            beforeTitleUpdate: function() {},
            onTitleUpdate: function() {},
            beforeDestroy: function() {},
            onDestroy: function() {},
            beforeFocus: function() {},
            onFocus: function() {}
        }
    };
    e.fn.qtip.styles = {
        defaults: {
            background: "#ffffe7",
            color: "#111",
            overflow: "hidden",
            tip: true,
            width: {
                min: 110,
                max: 110
            },
            padding: "5px 7px",
            border: {
                width: 1,
                radius: 5,
                color: "#636d73"
            },
            tip: {
                corner: true,
                color: false,
                size: {
                    width: 10,
                    height: 10
                },
                opacity: 1
            },
            title: {
                background: "#e1e1e1",
                fontWeight: "normal",
                padding: "7px 12px"
            },
            button: {
                cursor: "pointer"
            },
            classes: {
                target: "",
                tip: "qtip-tip",
                title: "qtip-title",
                button: "qtip-button",
                content: "qtip-content",
                active: "qtip-active"
            }
        },
        sms: {},
        upd: {},
        sim: {},
        signal: {},
        station: {},
        wan: {},
        wifi: {},
        battery: {},
        sms_full: {},
        roaming: {},
        cream: {
            border: {
                width: 3,
                radius: 0,
                color: "#F9E98E"
            },
            title: {
                background: "#F0DE7D",
                color: "#A27D35"
            },
            background: "#FBF7AA",
            color: "#A27D35",
            classes: {
                tooltip: "qtip-cream"
            }
        },
        light: {
            border: {
                width: 3,
                radius: 0,
                color: "#E2E2E2"
            },
            title: {
                background: "#f1f1f1",
                color: "#454545"
            },
            background: "white",
            color: "#454545",
            classes: {
                tooltip: "qtip-light"
            }
        },
        dark: {
            border: {
                width: 3,
                radius: 0,
                color: "#303030"
            },
            title: {
                background: "#404040",
                color: "#f3f3f3"
            },
            background: "#505050",
            color: "#f3f3f3",
            classes: {
                tooltip: "qtip-dark"
            }
        },
        red: {
            border: {
                width: 3,
                radius: 0,
                color: "#CE6F6F"
            },
            title: {
                background: "#f28279",
                color: "#9C2F2F"
            },
            background: "#F79992",
            color: "#9C2F2F",
            classes: {
                tooltip: "qtip-red"
            }
        },
        green: {
            border: {
                width: 3,
                radius: 0,
                color: "#A9DB66"
            },
            title: {
                background: "#b9db8c",
                color: "#58792E"
            },
            background: "#CDE6AC",
            color: "#58792E",
            classes: {
                tooltip: "qtip-green"
            }
        },
        blue: {
            border: {
                width: 3,
                radius: 0,
                color: "#ADD9ED"
            },
            title: {
                background: "#D0E9F5",
                color: "#5E99BD"
            },
            background: "#E5F6FE",
            color: "#4D9FBF",
            classes: {
                tooltip: "qtip-blue"
            }
        },
        yellow: {
            border: {
                width: 3,
                radius: 6,
                color: "#505B61"
            },
            width: {
                min: 250,
                max: 250
            },
            background: "#ffffe7",
            tip: true,
            classes: {
                tooltip: "qtip-yellow"
            }
        }
    }
})(jQuery);
