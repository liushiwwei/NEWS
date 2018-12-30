/*
** Create by 张晓坤 on 2018/4/30
*/

/** 1.匀速平移动画
* @param obj：要移动的元素
 * @param target：要移动的目标位置
* @return 无
*/
function animateMove (obj,target ) {
    //移动之前，如果元素已有定时器，则先清除
    clearInterval(obj.timeID);

    //移动动画:将定时器的id作为移动元素的属性
    obj.timeID=  setInterval(function (  ) {
        //1.获取元素当前位置
        var currentLeft = obj.offsetLeft;
        //2.判断元素是向左移动还是向右移动

        var isLeft;
        if(currentLeft < target){
            //向右移动
            currentLeft += 10;
            isLeft = false;
        }else{
            //向左移动
            currentLeft -= 10;
            isLeft = true;
        }

        //3.边界检测
        /*如果是向右移动，检测规则是：if (当前距离 < 目标距离) 继续右移，否则直接回到目标距离
        如果是向左移动，检测规则是：if (当前距离 > 目标距离) 继续左移，否则直接回到目标距离
        * 解决方案：可以在第二步判断元素左移还是右移的时候声明一个变量，如果为true则表示左移，false表示右移
        isLeft == false?currentLeft < target:currentLeft > target
        * 这个三目运算的含义，如果是右移，返回currentLeft < target 条件表达式的结果。否则返回currentLeft > target条件表达式的结果
         */
        if(isLeft == false?currentLeft < target:currentLeft > target){
            //4.设置盒子的位置（offset家族只能读取不能设置）
            obj.style.left = currentLeft + 'px';
        }else{
            obj.style.left =  target + 'px';
            //5.到达目的地之后移除定时器
            clearInterval(obj.timeID);
        }
    },5);
}

/** 2.多属性缓动动画+回调函数
 * @param obj 要执行动画的元素
 * @param attrs 对象类型：要执行动画的元素的属性和值  {key1=value1，key2=value2}
 * @param callback  回调函数：如果一个函数的参数也是一个函数，那么这个函数就叫做回调函数
 * @return 无
 */
function animationSlow ( obj, attrs, callback ) {
    //1每次设置计时器之前，都要把原来的计时器给清空掉
    clearInterval ( obj.timerID )
    //2 设置计时器
    obj.timerID = setInterval ( function () {
        //开关思想确保所有的属性都到达目标位置之后再停止定时器
        var isAllOK = true
        //3 循环参数对象，让每一个属性执行一次定时器的代码
        for ( var key in attrs ) {
            //透明度的范围是0-1的小数，需要单独处理逻辑
            if ( key == "opacity" ) {
                var target = attrs[ key ]
                //透明度是0-1的小数所以需要使用parseFloat，乘以一百方便计算
                var current = parseFloat ( getStyle ( obj, key ) ) * 100
                var step = ( target * 100 - current ) / 10
                step = step > 0 ? Math.ceil ( step ) : Math.floor ( step )
                current += step
                //由于之前我们乘了一百，把透明度的值放大一百倍转成0-100的整数，所以所以又要除以一百转成0-1的小数
                obj.style[ key ] = current / 100
                if ( current / 100 != target ) {
                    isAllOK = false
                }
            } else if ( key == "zIndex" ) {
                //层级的改变无需动画（这是一个瞬间的过程）
                obj.style.zIndex = attrs[ key ]
            } else {
                //3.1 获取本次动画要修改的属性的值  key就是属性  atts[key]就是属性对应的值
                var target = attrs[ key ]
                //3.2 获取box的当前的的属性的值,此时key就是元素的属性
                var current = parseInt ( getStyle ( obj, key ) )
                //3.3 计算本次要运动的距离
                var step = ( target - current ) / 10
                //如果是正数，就向上取整，如果是负数，就向下取整。
                step = step > 0 ? Math.ceil ( step ) : Math.floor ( step )
                //3.4 开始移动
                current += step
                obj.style[ key ] = current + "px"
                //3.5 开关思想检测所有属性是否都到达目标位置
                if ( current != target ) {//只要有一个没达到，开关就为false
                    isAllOK = false
                }
            }
        }
        //4.检测是否所有属性都到达目标位置，如果是就清楚定时器
        if ( isAllOK == true ) {
            clearInterval ( obj.timerID )
            //判断函数调用者是否需要告诉他函数执行完毕，如果传递了回调函数这个参数我们就执行这个函调函数，否则不执行
            if ( typeof  callback == "function" ) {
                callback ()
            }
        }
    }, 50 )
}

//获取元素样式的值
function getStyle ( obj, attr ) {
    //能力检测
    if ( obj.currentStyle ) {
        //IE8及之前
        return obj.currentStyle[ attr ]
    } else {
        console.log ( window.getComputedStyle ( obj, null ) )
        return window.getComputedStyle ( obj, null )[ attr ]
    }
}