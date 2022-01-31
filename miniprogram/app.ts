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
          wx.navigateTo({
            url:'/pages/login/index'
          })  
        }
  }


})