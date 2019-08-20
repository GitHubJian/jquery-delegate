# delegate 代理 dom 注册事件

在很多 Ajax 异步渲染 dom tree 中，需要 dom 元素进行事件绑定，由于引入第三方的类库文件体积过大，故此抽离 jquery 源码中的 delegate 函数

### Api

##### 注册代理事件

delegate.on(elem, type, handler, selector)

- elem
  代理 dom 元素
- type
  event 事件名
- handler
  执行函数
- selector
  className 选择器
