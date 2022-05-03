import { getToken } from "./utils/auth"

// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {

  },
  onShow(){

    //getToken方法得到值是空的情况下
    //gettoken来自于utils/auth

        if(!getToken()){
          wx.redirectTo({
            url:'/pages/login/index'
          })  
        }


        // let pages = getCurrentPages() //获取加载的页面
        // let  currentPage = pages[pages.length-1] //获取当前页面的对象
        // let url = currentPage.route //当前页面url
        // console.log(url)
    
        if(wx.getStorageSync('JK-token')){
          
          wx.navigateTo({url:'/pages/index/index'})
          
        }else{
          wx.redirectTo({url:'/pages/login/index'})
          // if(url !== 'pages/login/index'){
          //   wx.navigateTo({url:'/pages/login/index'})
          // }
        }
     
  }


})