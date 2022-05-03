
import { login, register } from "../../api/user"

// pages/login/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:'',
    nickname:'',
    isLogin:true
  },
  // 自定义函数区
  //用于拿到token
   onLogin(){
     console.log(this.data.isLogin)
     login({username:this.data.username,password:this.data.password}).then(res=>{
       console.log(res)
       if(res){
       if(!res.code  ||res.statusCode === 200 ){
        wx.showToast({
          title:"登录成功"
        })
        wx.setStorageSync('JK-token',res)
         wx.switchTab	({
           url:'/pages/index/index'
          })
       }else{
         wx.showToast({
           title:'登录失败',
           icon:'error'
         })
       }
     }
    })
     
   },
   onRegister(){
    console.log(this.data.isLogin)
    let user=null;
    user={username:this.data.username,password:this.data.password,nickname:this.data.nickname}
    register(user).then(res=>{
      console.log(res)
     
      if(res){

       wx.showToast({
         title:"注册成功"
       })
      //  this.data.isLogin=true;
      //跳转到login页面
        this.navigetorToLogin()

    }
    if(res.message){
      wx.showToast({
        title:res.message,
        icon:'error'
      })
    }

   })
    
  },

   //自定义函数，用于model双向绑定出现的warning 没有什么具体的含义
   emptyFunctionForModel(){},
//注册切换
   navigetorToRegister(){

    this.setData({
      isLogin:false,
      username:'',
      password:'',
      nickname:''

    })
   },

//登录切换

   navigetorToLogin(){

    this.setData({
      isLogin:true,
      username:'',
      password:'',
      nickname:''
    })
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})