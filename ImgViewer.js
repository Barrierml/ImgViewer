; (function (global, undefined) {
    'use strict';
    //元素对象
    var _Element;
    var _global;
    //所需元素的style
    var _ElmentStlye = {
        //顶层蒙版
        background: `position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 101;
                    overflow: hidden;
                    transition: background-color .2s ease-in-out;
                    background-color: rgba(26, 26, 26, .65);
                    padding-bottom: 10px;`,
        //图片
        imgs: `display: block;`,
        //二层蒙版
        background_twice: "overflow:auto;height: 100%;",
    };


    var ImgViewer = function (Element, config = null) {
        if (Element !== undefined && Element.nodeName === "IMG") {
            this.Element = Element;
            if (!this.Element.src) {
                throw "this element src is null";
            }
            var init = () => {
                //更改设置
                if (config !== null && typeof config == "object") {
                    this.config = config;
                }
                //绑定事件
                this.Element.addEventListener("click", (e) => {
                    //初始化图片属性
                    this.data = {
                        img_src: this.Element.src,
                        NH: this.Element.naturalHeight,
                        NW: this.Element.naturalWidth,
                        OW: this.Element.width,
                        OH: this.Element.height,
                        x: this.Element.x,
                        y: this.Element.y,
                    }
                    typeof this.onShow === "function" && this.onShow(this.Element, e)
                    this.Show();
                })
                //重写这些方法即可
                //传入的变量为 自己绑定的图片元素，和原始点击事件
                this.onShow = function (element, e) { };
                this.onClose = function (show_img, e) { };
                //传入的变量为 自己绑定的图片元素
                this.onShown = function (element) { };
                this.onClosed = function (element) { };
            }
            //判断是否加载完毕,放置图片数据错误
            if (Element.complete === true) {
                init();
            }
            else {
                Element.onload = () => {
                    init();
                }
            }

        }
        else {
            throw "element must a img element!";
        }
    };

    //原型方法
    ImgViewer.prototype = {
        //是否初始化
        $has_init: false,
        get has_init() {
            return this.Element !== undefined
        },
        //设置
        config: {
            //设置图片居中时两边的总距离,离屏幕两边的距离即为 centerCrevice/2
            //推荐不要小于60，因为在Chromium里出现y-scroll时也会占用宽度而导致坐标偏移错误
            centerCrevice: 80,
            //图片离顶部的距离
            topCrevice: 10,
            //图片底部的距离
            bottomCrevice: 10,
            //设置是否开启动画 变形的动画是否开启
            anmationSwitch: true,
            //变形时间 单位：秒
            anmationTime: 0.3,
        },
        //数据
        data: {
            isShown: false,
        },
        //显示的方法
        Show: function () {
            if (this.data.isShown) { return false };
            //添加到页面
            document.body.appendChild(this.BuiltImgNode());
            //开始动画
            let [IW, IH] = [window.innerWidth, window.innerHeight]
            let CenterTop, CenterLeft = 0;
            //计算比例
            let t = this.data;
            let ScalePercent = t.NW < IW ? 1 : IW / (t.NW + this.config.centerCrevice || 20);
            //移动距离(因为宽度不可能大于屏幕)
            CenterLeft = (IW - t.NW * ScalePercent) / 2;
            CenterTop = t.NH * ScalePercent < IH ? (IH - t.NH * ScalePercent) / 2 : this.config.topCrevice || 10;
            //body的滚动条消失
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                this.data.nowShowImg.style = `transition: ${this.config.anmationSwitch == false ? "none" : `all ${this.config.anmationTime || 0.5}s ease-in-out`};` + `cursor:zoom-out;width:${parseInt(t.NW * ScalePercent)}px;transform:translate3d(${CenterLeft}px, ${CenterTop}px, 0px) scale3d(${1},${1} , 1);opacity: 1;`
                this.data.isShown = true;
                typeof this.onShown === "function" && this.onShown(this.Element)
            }, this.config.anmationSwitch == false ? 0 : 50);
            //绑定关闭
            this.data.nowShowBC.addEventListener("click", (e) => {
                if (!this.data.isShown) { return false };
                typeof this.onClose === "function" && this.onClose(this.Element, e)
                this.data.nowShowImg.style = `transition: ${this.config.anmationSwitch == false ? "none" : `all ${this.config.anmationTime || 0.5}s ease-in-out`};` + `width:${parseInt(t.OW)}px;transform:translate3d(${t.x}px, ${t.y}px, 0px) scale3d(${1},${1} , 1);opacity: 1;`
                //删除背景并清除当前变量
                setTimeout(() => {
                    if (!this.data.isShown) { return false };
                    document.body.removeChild(this.data.nowShowBC);
                    this.data.isShown = false;
                    typeof this.onClosed === "function" && this.onClosed(this.Element)
                    //body的滚动条消失
                    document.body.style.overflow = "auto";
                }, this.config.anmationSwitch == false ? 0 : this.config.anmationTime * 1000 || 500);
            })
        },
        //创建新的viewer
        BuiltImgNode: function () {
            if (!this.has_init) { return false; }
            var img_style = `
                width:${this.data.OW || this.Element.naturalWidth}px;
                height:${this.data.OH || this.Element.naturalHeight}px;
                margin-top:${this.data.y || this.Element.y}px;
                margin-left:${this.data.x || this.Element.x}px;
            `;
            //创建元素并绑定自身
            var _Div_C = document.createElement("div");
            var _Div = document.createElement("div");
            _Div.style = _ElmentStlye.background;
            _Div.style.paddingBottom = this.config.bottomCrevice || 10;
            var _Div_2 = document.createElement("div");
            _Div_2.style = _ElmentStlye.background_twice;
            var Img = document.createElement("img");
            Img.style = img_style;
            Img.src = this.Element.src;
            _Div_2.appendChild(Img);
            _Div.appendChild(_Div_2);
            _Div_C.appendChild(_Div);
            this.data.nowShowImg = Img;
            this.data.nowShowBC = _Div_C;
            return _Div_C;
        },
    };
    //绑定页面的内的所有img对象,返回一个列表 
    //参数 classFilter 正则过滤类,实际上就是 re.test()
    //例子 classFilter = /hahah/ 就是选择含有hahah类的img
    //    =/^((?!hahah).)*$/ 就是不选择带有hahah 的类，详情请看正则表达式
    ImgViewer.BindAllImg = function (classFilter) {
        if (typeof window == "undefined") { throw "Please run this plug in chrome" }
        let $D = document || window.document;
        let waitBindList = $D.getElementsByTagName("img");
        //过滤
        var Results = [];
        for (let i = 0; i < waitBindList.length; i++) {
            console.log(classFilter,waitBindList[i].className);
            typeof classFilter == "undefined" ? Results.push(new ImgViewer(waitBindList[i])):
            classFilter.test(waitBindList[i].className) && Results.push(new ImgViewer(waitBindList[i]));
        }
        //将已绑定列表绑定到 BindedImgList 上;
        !('BindedImgList' in _global) && (_global.BindedImgList = Results);
        return Results;
    },
        //暴露接口
        _global = (function () {return this || (0, eval)('this'); }());
    !('ImgViewer' in _global) && (_global.ImgViewer = ImgViewer);
})(this);