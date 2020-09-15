# ImgViewer 一个彷知乎图片放大效果的JS插件

**ImgViewer**是一个基于`Pure JS`和`CSS`的图片放大器，它的目标是帮助你快速的实现图片放大功能而不需要额外的内容

特性如下：
- 全局性：  支持 `react` `vue` 和`pure js`实现
- 简单：    只需要传入 `Elment` 元素即可实现绑定，并且支持自动全局绑定和过滤器绑定
- 美观：    高仿知乎
- 可拔插：  引入即可使用


## 运行效果


## 安装
>直接使用外部引用js即可，使用以下代码时请确保js文件和html文件在同一路径下
```html
<script type="text/javascript" src="ImgViewer.js"></script>
```

## 例子
```javascript
//绑定一个新的放大器
var ImgViewer = new ImgViewer(document.getElementById("img1"));

//带参数的绑定
var ImgViewer = new ImgViewer(document.getElementById("img1"), {

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
     
});

//绑定全局所有IMG元素,返回的是所有绑定的元素列表
var BindImgList = ImgViewer.BindAllImg()
//运行后可以通过 window.BindImgList 来查看所有已绑定元素



//绑定页面的内的所有img对象,返回一个列表 
//参数 classFilter 正则过滤类,实际上就是 re.test()
//例： classFilter = /hahah/ 就是选择含有hahah类的img
//     =/^((?!hahah).)*$/ 就是不选择带有hahah 的类，详情请看正则表达式的使用
ImgViewer.BindAllImg(/hahah/)

```
## 关于事件绑定
>提供了四个事件供重写
```javascript
  //重写这些方法即可
  //传入的变量为 自己绑定的图片元素，和原始点击事件
  this.onShow = function (element, e) { };
  this.onClose = function (show_img, e) { };
  //传入的变量为 自己绑定的图片元素
  this.onShown = function (element) { };
  this.onClosed = function (element) { };
```

## 帮助
如果你在使用过程中发现任何问题，可以 提交 [提交issue](https://github.com/Barrierml/ImgViewer/issues) 或自行 fork 修改后提交 pull request。

如果你要提交 pull request，请确保你的代码风格和项目已有的代码保持一致，遵循 PEP 8，变量命名清晰，有适当的注释。
