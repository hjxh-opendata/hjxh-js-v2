# 皇家小虎数据中台前端、算法

## 开发进度
### 2021年05月06日
#### 完成路由配置
使用`react-router-dom`替换了原先的基于`id`的导航。

其实本来并不想用路由的，但是后来涉及到要分享特定的页面给冯同学，这个时候有路由的优越性就体现出来了，所以立即换上了。

目前来看，貌似速度是比之前的要快很多的，大爱~

## 开发经验

### 突然意识到IDE总是自动补全`props`、`state`的原因
只要在`live templates - React`里去除这两个就可以！
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55299949224842.png?Expires=4773912367&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=6EnpKNapMRrN8pOPafH2A%2Fxh4jM%3D)



### 前端CORS跨域失败……
如果是在服务端直接使用`axios`（或者使用`python`）发起请求，因为可以直接设置`referer`、`cookie`之类，所以可以成功。

但如果是在浏览器端，由于浏览器的`CORS`策略，就比较麻烦。我们不可以直接在浏览器端自定义`cookie`、`referer`之类的属性。对于`cookie`，可以通过操控`document.cookie`进行更改，比如使用`react`的`react-cookie`库。对于`referer`，就需要通过反向代理。`react`官网给出了一个使用`http-proxy-middleware`的方案，参考：
- [Proxying API Requests in Development | Create React App](https://create-react-app.dev/docs/proxying-api-requests-in-development/)

但经过实践证明，在我保证`cookie`与正常访问相同（清除本地`cookie`再使用正常`cookie`进行`set`）之后，再次访问`pdd`的目标网址。
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55309488341425.png?Expires=4773912376&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=xtvQQ9wi3O%2BeZvggH0hE8mnfh78%3D)


![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55316511552028.png?Expires=4773912383&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=E%2FWgG35Cxss7D6zkN2YZMswcE40%3D)


但最终报了以下错误：
```json
{
  "success":false,
  "errorCode":1,
  "errorMsg":"Unable to find your routing configuration!",
  "result":null
}
```

这个结果表明，很有可能，`pdd`官方的网关对访问源还是做了比较严格的限制，所以我们无法成功。


### Array.prototype.some() 返回问题
第一种写法，会报warning，因为没有对所有结果进行返回
```js
str.split(";").some((line) => {
    const [k, v] = line.split("=");
    if (k === key) {
      return v;
    }
  });
```

第二种就没问题了。
```js
str.split(";").some((line) => {
    const [k, v] = line.split("=");
    return k === key ? v : false
  });
```

主要是some的机制需要接收一个为真的返回值。

参考：
- [Array.prototype.some() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

### 阻止eslint检查js代码
修改`package.json`中`eslint`部分的设定：
```json
{
  "ignorePatterns": [
    "src/node/src/hack_core/*.js"
  ]  
}
```

### 在webstorm的ts中导入js
需要配置一下`tsconfig.json`中的`allowJS`选项为`true`才可以导入`js`文件。

### 登录时的字段需求
经过测试，只需要`_nano_fp`字段（缺失会返回存在风险）和`_bee`字段（缺失需要手机验证）。

### 服务器卸载modoboa（惊喜，貌似把这个卸载后，服务器的mongodb再也不会动不动宕机了）
- [How do I uninstall this? · Issue #157 · modoboa/modoboa-installer](https://github.com/modoboa/modoboa-installer/issues/157)


### 吐槽评价数据的数据结构

评价数据的数据获取方式与其他api都有些差异。

具体地说，它分为列表查询和单品查询两个api，其中列表查询可以获得多个单品当日的较为详细的数据（但不支持选择日期，参数中没有此项），而单品查询却可以直接查到近30日的数据，包含以下最关键的几个字段：
```text
statDate	String	2021-05-04
avgServRevScr1m	Number	4.572659912293966
avgDescRevScr1m	Number	4.570391652805081
avgLgstRevScr1m	Number	4.573113564191743
goodsUnfkUndfltRevCnt1m	Integer	6613
```
但是，其他字段的信息就没有了。



## 生活相关
### 每个月开头总是这么难
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55327436289141.png?Expires=4773912394&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=zRK%2BjDChIKWcoyO8a%2FuD0cVUuuE%3D)
