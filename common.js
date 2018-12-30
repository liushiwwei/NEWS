/*
** Create by 张晓坤 on 2018/10/25
* 本文件主要解决IE8浏览器兼容性问题
*/

//以后开发中，像一些常用代码也可以写在一个文件中封装成一个函数，直接调用即可
function id ( str ) {
    return document.getElementById('str');
};

/**1.获取元素文本
 *
 * @param ele
 * @return {*}
 */
function getText (ele  ) {
    //1.能力检测
    if (ele.textContent){//非IE8
        return ele.textContent;
    }else{//IE8浏览器
        return ele.innerText;
    }
}

/**2.修改元素文本内容
 *
 * @param ele  元素
 * @param text 要修改的文本
 * @return {*}
 */
function setText (ele ,text ) {
    //1.能力检测
    if (ele.textContent){//非IE8
        ele.textContent = text;
    }else{//IE8浏览器
        ele.innerText = text;
    }
}

/**3.获取下一个兄弟元素
 * @param ele  元素
 * @return 下一个兄弟元素
 */
function getNextElementSibling ( ele ) {
    //1.能力检测
    if (ele.nextElementSibling){//谷歌火狐
        return ele.nextElementSibling;
    }else{//IE8浏览器
        //1.获取下一个节点
        var node = ele.nextSibling;
        //2 如果节点存在并且不是元素，则继续往下找
        //   node != null && node.nodeType != 1
        while (node && node.nodeType != 1){
            node = node.nextSibling;
        };
        return node;
    }
};


/**
 * 4.获取上一个兄弟元素
 * @param ele 元素
 * @return {*} 上一个兄弟元素
 */
function getPreviousElementSibling ( ele ) {
    //能力检测
    if (ele.previousElementSibling){//谷歌火狐
        return ele.previousElementSibling;
    }else{//IE8浏览器
        //1.获取上一个节点
        var node = ele.previousSibling;
        //2.如果node存在 并且 节点类型不是1，则继续往上找
        while(node && node.nodeType != 1){
            node = node.previousSibling
        };
        //循环结束条件： （1）node为null  （2）node.Nodetype = 1
        return node;
    }
};

/**5.获取元素的第一个子元素
 *
 * @param ele 元素
 * @return 第一个子元素
 */
function getFirstElementChild ( ele ) {
    if (ele.firstElementChild){//谷歌火狐
        return ele.firstElementChild;
    }else{//IE
        //1.获取第一个子节点
        var node = ele.firstChild;
        //2.只要节点存在 并且 节点类型不是1，继续往下找
        while (node && node.nodeType != 1){
            node = node.nextSibling;
        }
        return node;
    }
}

/**
 * 6.获取父元素的最后一个子元素
 * @param ele 父元素
 * @return 最后一个子元素
 */
function getLastElementChild (  ele ) {
    if (ele.lastElementChild){//谷歌火狐
        return ele.lastElementChild;
    }else{//IE8
        //1.获取元素的最后一个子节点
        var node = ele.lastChild;
        //2.只要子节点存在 并且 节点类型不是1，则继续往上找
        while(node && node.nodeType != 1){
            node = node.previousSibling;
        };
        return node;
    }
}

/**7.获取元素样式属性
 *
 * @param ele 要获取的元素
 * @param attribute 要获取的属性名字符串
 */
function getStyle ( ele,attribute ) {
    //能力检测
    if (window.getComputedStyle){//谷歌火狐
        return window.getComputedStyle(ele, null)[attribute];
    }else{//IE8浏览器
        return ele.currentStyle[attribute];
    }
}

/**8.获取页面滚动出去的距离
 *
 * @return {{scrollLeft: number, scrollTop: number}}
 */
function getPageScroll (  ) {

    //逻辑或：一真则真
    //短路运算：找真，只要左边式子是真，无条件返回左边式子的值，反之无条件返回右边式子的值
    //最后一个0是为了提高代码的易读性，避免产生返回undefined的情况
    var x = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    return {
        scrollLeft:x,
        scrollTop:y
    };
}

/**
 * 9.获取页面可视区域大小
 * @return {{clientWidth: number, clientHeight: number}}
 */
function getClientSize (  ) {
    return {
        clientWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
        clientHeight : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
    }
}

/**10.获取鼠标触发点相对于页面左上角距离
 *
 * @param e 事件对象
 * @return {{pageX: number, pageY: number}}
 */
function getPagePoint ( e ) {
    return {
        pageX : e.pageX || getPageScroll().scrollLeft + e.clientX,
        pageY : e.pageY || getPageScroll().scrollTop + e.clientY,
    }
}

/**11.注册多个同名事件兼容性封装
 * @param ele:事件源 元素
 * @param type:事件类型   不要on
 * @param fn 事件处理函数
 */
function addEvent (ele,type,fn  ) {
    //能力检测
    if (ele.addEventListener){//如果对象有这个方法  谷歌火狐
        ele.addEventListener(type,fn, false);
    }else if (ele.attachEvent){//IE浏览器
        ele.attachEvent('on' + type,fn);
    }else{//某些浏览器两个都不支持， 使用点语法添加
        ele['on' + type] = fn;
    }

}

/**
 * 12.移除事件兼容性封装
 * @param ele 元素
 * @param type 事件类型 不要on
 * @param fn 事件处理函数
 */
function removeEvent ( ele,type,fn ) {
    //能力检测
    if (ele.removeEventListener){//谷歌火狐
        ele.removeEventListener(type,fn);
    }else if (ele.detachEvent){//IE8
        ele.detachEvent('on' + type,fn);
    }else{//其他浏览器
        ele['on' + type] = null;
    }
}