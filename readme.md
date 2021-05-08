# 皇家小虎数据中台前端、算法

## TODO
- [ ] 验证是否主账号可以查到所有商品ID
- [ ] 解决加密算法只适合本机的问题
- [ ] 改用`scrapy`进行爬虫
- [ ] 改用`node`端的`api`

## 开发进度

### 配置了`redux-devtool`，2021年05月08日08:57:45
参考：
https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm

### 完成对`fetchPddData`基于`yield`的爬取方式的封装，2021年05月07日

具体见`hjxh-web/node/src/fetch_pdd_data.ts`

### 【问题】遇到冯同学谷歌浏览器上生成的`cookie`不能通过本地加密算法的问题

尝试了多遍，以及在`cookie`算法中动态加入`ua`，但结果都不行。

很有可能是生成`cookie`的过程中加入了一些关于浏览器的其他信息，所以本加密算法不适应。

暂时先在我本地完成账号的存入操作吧。。。

### 修复`dbQuery`模板函数空类型导致的数据库`query`失败以至于`cors`错的问题

因为`sort`函数较为敏感，所以之前直接将`sort`记为空或者空字段的方案是不可行的。

最后考虑到`sort`在`uri`拼接的最后，所以对于空`sort`直接不参与拼接，解决了问题。

尽管如此，有时间还是得看一下后盾部分，想想怎样设计接口，才能使服务端`query`更稳健与方便。

### 完成路由配置，2021年05月06日

使用`react-router-dom`替换了原先的基于`id`的导航。

其实本来并不想用路由的，但是后来涉及到要分享特定的页面给冯同学，这个时候有路由的优越性就体现出来了，所以立即换上了。

目前来看，貌似速度是比之前的要快很多的，大爱~

## 开发经验

### 【重要】 关于不同位置的cookie的差异， 2021年05月08日21:31:33
原来如此！必须在拼多多商家后台页面进行cookie刷新，否则cookie是无效的……（比如在推广页面）

### 关于`react-redux`的`connect`函数提示太多并且很慢的问题， 2021年05月08日21:01:58
解决方案很简单：去掉  full method`就可以。

去掉之后，将打开新的世界，一切更美好~

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-08/47818171510450.png?Expires=4774078921&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=9ahK4I3NdrubIXzVyF8tA4Tn9Wg%3D)


### 关于无法快捷导入自定义的`AntdIcon`， 2021年05月08日20:24:57
其实是因为我们需要用组件形式导入`AntdIcon`（即，尖括号那种组件导入方式），所以虽然在自定义的`AntdIcon`里没有使用`jsx`语法，但还是需要改为`tsx`文件才支持。

### 关于mac dock失效、无法点击的最终解决方案，2021年05月08日08:05:32
之前参考网上文章采取了重启的方式，今天早上在高度专注的情况下仔细研究了文章，敏锐的意识到最有可能是第三方插件的问题，尤其是`mac forge`这个，毕竟它动过了系统设置。

最后我退出`mac forge`后，果然解决了问题！

参考：
- [How to Fix Mac Dock getting Stuck? - Appuals.com](https://appuals.com/how-to-fix-mac-dock-getting-stuck/)

### redux设计中，select 和 filter 的区别

我想明白了，全局的店铺、商品一般只有一个，所以select必须放在全局redux里，而filter这种多选的一般用在客户端，所以就放在组件里。

这个思考，我认为很有意思，也是第一次思考这么细致的问题。

### 直接刷新路由，导致首页的异步载入未能预先完成
想来这也是很有意思的一件事。

我在首页执行`users`、`goods`的预先获取操作，但我现在停留的网页是在订单分析这。

于是我执行订单分析页的刷新，它将根据从`store`直接读取的`users`、`goods`进行是否获取数据的判断，由于在该页刷新载入之时，首页的数据获取操作还未完成，于是本页就无法更新了。

解决方案在我打字时突然想出来了，那就是将`useEffect`的依赖由`[]`改成基于`users`、`goods`的数量变动~

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-08/61172002745364.png?Expires=4774005546&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=QVyqpd0hxzfFzHvaU7irgqRBzhQ%3D)

然而，尴尬的事情发生了，最后一步的数据获取的参数，是没有数据的，233333，因为这个店铺的数据还没更新Orz。

### ts-node 配置问题
`ts-node`真是个神奇的玩意……

在封装了自己的`logger`后，进行测试，结果死活不成……

参考：
- [package.json - ts-node execute typescript with module import and module defined - Stack Overflow](https://stackoverflow.com/questions/63445821/ts-node-execute-typescript-with-module-import-and-module-defined)

最终只需要改`tsconfig.json`的`module`就可以了：
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs"
  }
}
```
### js reduce用法
原来第一个参数是目标结果，而第二个参数才是数组内的每个元素，这一点和`map`、`forEach`等数组函数有很大的区别！

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-07/54496392166889.png?Expires=4773998870&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=YL6C1U455BOB34pU4TafW6Fyrtw%3D)


### 解决`FormData`提交的问题
使用`qs.stringify`可以完美解决，参考：
- [axios中文文档|axios中文网 | axios](http://axios-js.com/zh-cn/docs/index.html#%E4%BD%BF%E7%94%A8-application-x-www-form-urlencoded-format)

主要是我在`fastapi`对`user`里的`cookie`设置成了`form`格式，所以需要用这个手段。

### 解决`antd`里`modal`套`form`的一种最佳实践

直接调用`Modal.confirm`可以避免使用`hook`导致代码分离，但这样，就无法使用原生`Modal`的`footer`属性，以将`Form`的提交按钮绑定在`Modal`的`Footer`上。

参考以下，可以得出一种改变`onButtonProps`的属性，从而达到绑定的效果，很有意思~：
- [reactjs - How to submit form component in modal dialogue using antd react component library - Stack Overflow](https://stackoverflow.com/questions/41221633/how-to-submit-form-component-in-modal-dialogue-using-antd-react-component-librar)
- [Button - Ant Design](https://ant.design/components/button/#API)

【update 2021年05月07日21:35:30】 然而这种方案还是碰到了问题。
因为对`Form`需要做一些验证，所以如果直接把`Form`绑定到`Confirm`按钮，会导致无论验证与否都直接关闭了`Modal`，这是很不符合预期的。

看样子，还是得用朴素的玩意。。


```typescript jsx
const updateUser = (record: UserInfo) => {
  Modal.confirm({
    width: 800,
    title: "更新用户信息",
    okButtonProps: {form: 'update_user', htmlType: 'submit'},
    content: (
      <Form
        id={'update_user'}
        labelCol={{span: 2}}
        onFinish={(e) => {
          console.log("finished", e)
        }}
      >
        ...
      </Form>
    )
  })
}
```

### 配置prettier的规则

为了方便将项目从`js`同步到`python`，例如，将一些变量转移过去，由于`prettier`默认结尾是有分号的，所以转移到`python`之后还得手动去除不方便。

由于`js`是对分号不敏感的，所以考虑直接从`prettier`级别去除这些分号。

本来想搞个全局配置，结果发现不支持，参考：

- [Configuration File · Prettier](https://prettier.io/docs/en/configuration.html)

最后的解决方案是直接在`package.json`中添加对`prettier`的约定：

```json
{
  "prettier": {
    "semi": false
  }
}
```

最后对特定文件进行格式化即可，需要使用文件级别（非`VCS`级别）的格式化，否则不起作用。具体做法就是按`Command + Control + Shift + L`，然后勾选`Whole File`。

### 解决`Sider`和`Header`均固定，且`Sider`支持`collapse`的问题

根据`antd`官方文档给出的`Layout`示例，有单独固定`Sider`的，也有单独固定`Header`的，都是使用的`position: fixed`的手段。

然而，当把两个合在一起，问题就出现了，因为`fixed`布局导致我们必须要计算`Slider`伸缩的宽度，从而产生麻烦，并且由于`Slider`内部使用了伸缩动效（较为复杂的`css`
），这导致机即使我们计算的精准无误，也会产生伸缩时难以忍受的动效+刷新不同步的问题。

#### 步骤一，headers布局改为sticky

解决的第一个办法，就是将`header`的`fixed`改成`sticky`，这样同样达到了固定顶部的效果，并且贴合容器，不会出现以`fixed`布局需要计算`width`的问题，支持流式自动布局。

参考：

- [javascript - How to create sticky headers on scroll with react - Stack Overflow](https://stackoverflow.com/questions/62970456/how-to-create-sticky-headers-on-scroll-with-react)

#### 步骤二，content设置固定高度

参考：

- [html - Independent Overflow-y Scrolling on Sidebar and Content - Stack Overflow](https://stackoverflow.com/questions/35730748/independent-overflow-y-scrolling-on-sidebar-and-content)

### 突然意识到IDE总是自动补全`props`、`state`的原因

只要在`live templates - React`里去除这两个就可以！
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55299949224842.png?Expires=4773912367&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=6EnpKNapMRrN8pOPafH2A%2Fxh4jM%3D)

### 前端CORS跨域失败……

如果是在服务端直接使用`axios`（或者使用`python`）发起请求，因为可以直接设置`referer`、`cookie`之类，所以可以成功。

但如果是在浏览器端，由于浏览器的`CORS`策略，就比较麻烦。我们不可以直接在浏览器端自定义`cookie`、`referer`之类的属性。对于`cookie`，可以通过操控`document.cookie`进行更改，比如使用`react`
的`react-cookie`库。对于`referer`，就需要通过反向代理。`react`官网给出了一个使用`http-proxy-middleware`的方案，参考：

- [Proxying API Requests in Development | Create React App](https://create-react-app.dev/docs/proxying-api-requests-in-development/)

但经过实践证明，在我保证`cookie`与正常访问相同（清除本地`cookie`再使用正常`cookie`进行`set`）之后，再次访问`pdd`的目标网址。
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55309488341425.png?Expires=4773912376&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=xtvQQ9wi3O%2BeZvggH0hE8mnfh78%3D)

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-06/55316511552028.png?Expires=4773912383&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=E%2FWgG35Cxss7D6zkN2YZMswcE40%3D)

但最终报了以下错误：

```json
{
  "success": false,
  "errorCode": 1,
  "errorMsg": "Unable to find your routing configuration!",
  "result": null
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
    "src/hjxh-node/src/hack_core/*.js"
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
