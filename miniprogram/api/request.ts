import { getToken, removeToken, setToken } from "../utils/auth"

const baseUrl='https://jk-music-1577517-1309371796.ap-shanghai.run.tcloudbase.com'

export const get = (requestUrl:string) :Promise<any>=>{
  //wx.showLoading 就是出来一个提示框，title属性里面放的就是loading时候显示的文字是什么
  wx.showLoading({
    title:'加载中'
  })
  //返回一个promise对象
  return new Promise((resolve,reject)=>{
    //Wx.request必要的5个参数,url method,success(回调函数),fail(回调函数),compete(回调函数)
    wx.request({
      url:baseUrl+requestUrl,
      method:'GET',

      success:(res)=>{
        //resolve(res) =将res标记为resolve状态，也就是res被成功解析了
        //且标记为resolve的数据就是后续then里面的参数
        resolve(res.data)
      },

      fail:reject,
      //完成时
      complete:()=>{
        wx.hideLoading();
      }

    })
  })

//get方法止
}

export const post = (requestUrl:string, data:object) :Promise<any>=>{
  //wx.showLoading 就是出来一个提示框，title属性里面放的就是loading时候显示的文字是什么
  wx.showLoading({
    title:'加载中'
  })
  //返回一个promise对象
  return new Promise((resolve,reject)=>{
    //Wx.request必要的5个参数,url method,success(回调函数),fail(回调函数),compete(回调函数)
    wx.request({
      url:baseUrl+requestUrl,
      method:'POST',
      //放入数据
      data:data,
      success:(res)=>{
        //请求返回的是401错误，意味着用户要么没登录，要么token过期了，所以要removetoken
        if(res.statusCode === 401){
          removeToken();
          // getCurrentPages() 获取获取当前页面访问过的历史记录数组

          // 返回的数据的示例：
          // 0: XA {__wxExparserNodeId__: "e6a15a80", __route__: "pages/login/index", route: "pages/login/index",

          // 1: XA {__wxExparserNodeId__: "2b6e3cf9", __route__: "pages/login/index", route: "pages/login/index", __displayReporter: B, onLogin: ƒ, …}
          
          // length: 2
          const currentPages= getCurrentPages()
          //判断是否为login页面，如果不是就跳转，是就不跳转
          const  currentRoute=currentPages[currentPages.length-1].route
          if(currentRoute !="pages/login/index"){
            wx.navigateTo({
              //使用navigateTo  url的时候，page前面要加 '/' 
              //加个redirect ，这样他登陆完了，我们根据redirect做个函数，然后就能跳转到原来的页面
              url:`/pages/login/index?redirect=${currentRoute}`})
          }
          //显示一个小框给用户，说下这是什么错误
          wx.showToast({
            title:'用户未登录',
            icon:'error',
          }) 
    
        }
        // console.log(res.header['authorization'])

        //自定义方法，在下面，作用：设置token
        _handleToken(res.header)
        //resolve(res) =将res标记为resolve状态，也就是res被成功解析了
        //且标记为resolve的数据就是后续then里面的参数
        resolve(res.data)
      },

      fail:reject,
      //完成时
      complete:()=>{
        wx.hideLoading();
      }

    })
  })

//post方法止
}

//用于设置token
const _handleToken = (header :any) =>{
  //获得当前header里面的Authorization
  const token =header['authorization']||null
  //如果存在token而且
  //存储在localstorage里面的token不等于当前header里面的Authorization
  if(token && getToken() !== token){
    //就把当前的token设置为localstorage里面的token
    setToken(token)
    //弹出提示登录成功
    wx.showToast({
      title:"登录成功"
    })
    // wx.navigateBack()：返回之前的页面
    wx.navigateBack()
    
  }



}