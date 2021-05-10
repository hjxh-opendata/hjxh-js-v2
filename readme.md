# 皇家小虎数据中台前端、算法

## TODO
- [ ] 验证是否主账号可以查到所有商品ID
- [ ] 解决加密算法只适合本机的问题
- [ ] 改用`scrapy`进行爬虫
- [ ] 改用`node`端的`api`
- [ ] 测试域名对`cookie`的验证影响, refer: [domain](#domain) 
- [ ] 使用`jsdom`重新完成pdd加密的hack,refer: [jsdom](#jsdom)


## 业务相关
### 退款金额字段
`sucRfOrdrAmt1d`，主要看前缀`sucRfOrdrAmt`

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/63093222231277.png?Expires=4774248365&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=Dgvmo97ffXCD3pL16TZQK2dr7oI%3D)


## 开发进度

### ts-jest Support， 2021年05月10日01:42:06
参考：
- [Installation | ts-jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)

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

### 日期与时间控制（拼多多服务端、js端、python端）， 2021年05月10日16:14:58
以pdd官网的时间为准，其2021年5月10号零点的时间戳为 `1620576000`。
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/49275045546839.png?Expires=4774234547&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=f%2FGZ2zfKOEljysXfVF77q3RloQI%3D)

在`python`中，可以直接使用`datetime.datetime(2021, 5, 10).timestamp()`得到值是相同的：
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/49325049938852.png?Expires=4774234597&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=zXKArQzJJLEsd0H8QHYRAXRirAo%3D)

（注意：`datetime.date`这个类没有直接的`timestamp`方法，并且也会在与`mongodb`等第三方打交道时出错，所以能不用就不用，毕竟`datetime`是`date`的真超集。）

在`js`中，也可以直接调用，但是非常要注意的一个坑是，月份是从0开始记的，所以要`new Date(2021, 4, 10).getTime()`：
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/49426738409686.png?Expires=4774234699&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=YNIgVaPVGOO6Rd3XSrsflM7JqG0%3D)

如果使用`dayjs`包的话，更方便：
```js
var d = dayjs('2021-05-10')
console.log('时间戳（秒）: ', d.unix())
console.log('时间戳（毫秒）: ', d.valueOf())
```

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/49702714596339.png?Expires=4774234975&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=Go36MueBnsbma6a6oZoh36kxlcI%3D)

还可以通过数组接收形式：
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/49767385785948.png?Expires=4774235039&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=zoNFps7rgj0pN0P442y%2F7U4lIGk%3D)

不过，根据官方介绍，需要加`"dayjs/plugin/arraySupport"`插件，我也不知道为啥这里可以直接运行，我本来想截个报错作为对比的……（可能，被兼容了吧……）

参考：
- [字符串 · Day.js](https://day.js.org/docs/zh-CN/parse/string)
- [Unix 时间戳 · Day.js](https://day.js.org/docs/zh-CN/display/unix-timestamp)
- [数组 · Day.js](https://day.js.org/docs/zh-CN/parse/array)
- [ArraySupport · Day.js](https://day.js.org/docs/zh-CN/plugin/array-support)


### 终于解决换行问题， 2021年05月10日16:06:51
由于系统用的`prettier`进行换行控制，而它的`printWidth`默认值是80，这导致某一行代码想不换行结果被换了，因为视觉上还有很大空间。

查看系统的一些设置，有80、120两个界，`CodeStyle`里改成120无效，因为被`prettier`覆盖了，于是考虑新建一个本地`.prettierrc`文件，修改`printWidth`的值。

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/48911727673232.png?Expires=4774234184&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=O69TJM%2BZPC9io21jlz%2FNHLv4I2Q%3D)


最后效果如下：

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/48740681382240.png?Expires=4774234013&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=z7IseE%2FS5BVj3LUYHXLtltIcUMo%3D)

参考：
- [Options · Prettier](https://prettier.io/docs/en/options.html#print-width)

### 终于解决老自动乱提示库的问题， 2021年05月10日14:52:33

之前在初始化项目之后，为了解决`promise`的问题，修改`tsconfig.json`里的`lib`为`es2015.primise`，这导致很多内置库无法识别，比如`Array`。

但我联想到`create-react-app`项目里没有这个问题，所以觉得很有可能还是自己的配置问题。

中途还尝试删掉`@types/mongoose`库（因为老是跳出`mongoodse`里的`Array`，让我导入，但一导入就错，不导入就反复横跳），结果删完之后原先只跳两个可选`Array`的出处，后来变成四个……其中第一个是来自`es2015`的。

最后意识到了是`typescript`配置的问题，下意识地修改了一下：
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/44507751334980.png?Expires=4774229780&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=U%2BdBqy5diUjPJza5BSN62HbVQao%3D)

结果就成了！这紫色粗斜字体可太好看了！
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/44282669866479.png?Expires=4774229555&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=nefuMwsg4LYrVrBOC2E4m6d9c1Y%3D)


### 卧槽，一行代码解决`git push`卡住的问题， 2021年05月10日09:13:18
```shell
 git config --global core.askpass "git-gui--askpass"
```

参考：
- [Git push hangs when pushing to Github? - Stack Overflow](https://stackoverflow.com/questions/16906161/git-push-hangs-when-pushing-to-github)

<a name='domain'></a>
### 关于cookie验证403的问题，2021年05月10日05:45:57
其实是选错了api。

验证用户是否有效有两个api，一个会返回mall信息（yingxiao），一个不用（mms）。

我们目前使用的是商家后台的cookie，所以走mms渠道是可以获得有效信息的，但是直接访问yingxiao会出问题。

反过来可以不？待测试


<a name="jsdom"></a>
### jsdom或许是pdd加密算法的又一大杀器
![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/1322153107609.png?Expires=4774186594&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=vaKrNv0Y%2Fb0TY%2BZ%2B5dwwUJvTxng%3D)


### 关于在`try...catch...finally`的`finally`中使用`return`的问题
参考：
- [解决async/await滥用产生的困境 - 知乎](https://zhuanlan.zhihu.com/p/138331544)
- [java - Can we use "return" in finally block - Stack Overflow](https://stackoverflow.com/questions/18205493/can-we-use-return-in-finally-block)

### 关于从`prop`获得的传入`useState`的数据不会再度刷新， 2021年05月09日14:15:39
参考：
- [reactjs - React.useState does not reload state from props - Stack Overflow](https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props)

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


## JEST 相关（由于起步使用，特单独记录）

### TODO
- [ ] 解决`create-react-app`的`jest`环境为`jsdom`从而无法测试`node`环境的一些`test`程序的问题

### jset配置extend， 2021年05月10日15:54:53
本来只是为了快速验证一个值是不是一个数字，结果发现比较麻烦，毕竟`number`和`Number`不是一回事。

第一种方案是`expect(value).toEqual(expect.any(Number))`，就很繁琐，而且这个`toEqual`我很不能接受，因为我的意图就是判别类型，结果字面意义却是等于什么值，这不好，这太hack了。

第二种方案是使用`jest-extend`，我发现这个不错，而且`star`数还挺高，`1.5 k`了。安装完后，直接使用`expect(value).toBeNumber()`就可以，这简直太友好了~

注意，第二种方法要三步走，安装`jest-extend`，配置`jest.config.json`，再新增`global.d.ts`文件，这些都是值得的。

参考：
- [jestjs - `toBeInstanceOf(Number)` does not work in jest - Stack Overflow](https://stackoverflow.com/questions/52551035/tobeinstanceofnumber-does-not-work-in-jest)
- [jest-community/jest-extended: Additional Jest matchers 🃏💪](https://github.com/jest-community/jest-extended#typescript)


### 终于配置好了`jest`的`node`环境

```js
// /Users/mark/projects/HJXH/hjxh-js/hjxh-backend/src/crawl/pdd.test.ts
import {createPddClient, PddClientPlus} from "./pdd";

describe("pdd test", () => {
    let pdd: PddClientPlus;

    beforeAll(async () => {
        console.log("=== started test pdd ===");
        // 默认使用数据库第一个拼多多账号进行初始化
        pdd = await createPddClient();
    });

    it("pdd should pass verification", async () => {
        const e = await pdd.fetchUserInfo();
        expect(e).toBe(true);
    });
});
```

![](http://mark-vue-oss.oss-cn-hangzhou.aliyuncs.com/pasteimageintomarkdown/2021-05-10/35174825782003.png?Expires=4774220447&OSSAccessKeyId=LTAI4G8kArj75ch3irL8mUUJ&Signature=yTCcYWSLhsqtJuAR6VePZUtMN%2Fk%3D)


参考：
- [测试异步代码 · Jest](https://jestjs.io/zh-Hans/docs/asynchronous)
- [Globals · Jest](https://jestjs.io/docs/api#beforeallfn-timeout)
- [jestjs - How to pass variable from beforeEach hook to tests in jest? - Stack Overflow](https://stackoverflow.com/questions/52397708/how-to-pass-variable-from-beforeeach-hook-to-tests-in-jest)

### 在`node`环境配置`ts-jest`启动失败的原因， 2021年05月10日10:23:07

尝试了很多配置，均未成功，后来在`ts-jest`官网找到了原因。

- [Presets | ts-jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/presets)

参考以上链接，在`ts-jest`中，有三种`preset`，默认是第一种，即会把所有`ts | tsx`格式文件转成`js | jsx`。

我当时测试的文件，由于为了适应`create-react-app`的配置，名称为`pdd-request.test.js`，是`js`格式，所以`ts-jest`不会自动将它转为`commonjs`。然而该文件里使用了`import`，属于`esm`，因此报错。

解决办法就是将`preset`改成`ts-jest/presets/js-with-ts`，这样所有的`ts | tsx | js | jsx`都能转成`commonjs`了，不过此选项需要打开`tsconfig.json`中的`"allowJs": true`选项。

### 关于`jest`报错：`You should not use <Link> outside a <Router>`，2021年05月10日02:46:31

其实这个问题，是因为`create-react-app`的默认测试文件`App.test.js`是直接拿`App.tsx`进行`render`测试，然而当时我的项目目录，已经把主配置移到了`index.tsx`文件，比如`store`和`BrowserRouter`等。

所以解决方案就是把`index.tsx`简化，所有`Provider`全写进`App.tsx`，包括`css`文件。