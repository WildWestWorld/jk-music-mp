// components/common/JKNavigator/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{type:String,value:''}
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBoxHeight:0,//导航栏的盒子高度
    statusBarHeight: 0, // 状态栏高度
    navMarginTop: 0, // 导航栏上边距/胶囊按钮的上边距
    navHeight: 0, // 导航栏高度
    navWidth: 0, // 导航栏宽度
    menuButtonRightPadding:0,//胶囊的右边距

    pages:null,//所有的页面信息

    back:false//用于判断回退按钮是否显示
  },

  /**
   * 组件的方法列表
   */
  //小程序的生命周期
  lifetimes:{
    attached(){
      this.calculateMenuAndStatusBar();
      //利用getCurrentPages可以获取到之前访问的页面，也就是说，如果你之前有访问过其他页面也就被该函数捕捉
      const pages =getCurrentPages();
      //如果访问过的页面大于1时，也就是你之前有访问过页面，就设置值为true，该值用于判断是否显示回退
      //因为回退函数是基于你之前访问过的页面来回退的，所以要判断pages是否大于1
      this.setData({
        pages
      })
      if(pages.length>1){
        this.setData({
          back:true
        })
      }else{
        this.setData({
          back:false
        })
      }
    }
  },

  methods: {
//calculateMenuAndStatusBar用于获取和计算头部导航栏的宽度和高度的函数
    calculateMenuAndStatusBar(){
      //利用 wx.getMenuButtonBoundingClientRect 得到胶囊按钮的坐标和高宽等信息
      let menuButtonInfo = wx.getMenuButtonBoundingClientRect()
      //top是胶囊按钮的上坐标，right是胶囊按钮的下坐标 
      //width,height是胶囊按钮的宽度和高度
      const { top,right,width, height,  } = menuButtonInfo
      // console.log(menuButtonInfo)
      


      //利用 wx.getSystemInfo方法获取到状态栏的高度，状态栏就是右上角的电池
      wx.getSystemInfo({
        success: (res) => {
          //statusBarHeight就是状态栏的高度
          const { statusBarHeight } = res
          //top:胶囊按钮的上坐标，上坐标是从页面顶部到胶囊按钮的顶部的距离
           //statusBarHeight就是状态栏的高度
           //两值相减就能得到他们的间距，也就是margin
          const margin = top - statusBarHeight
          //getWindowInfo用于获取窗口的宽度，注意：需要小程序基础库版本不低于 2.21.3
          const windowInfo=wx.getWindowInfo() 

          this.setData({
            //statusBarHeight就是状态栏的高度
            statusBarHeight: statusBarHeight,
            //navHeight导航栏的总体高度，胶囊按钮高度+状态栏的高度+胶囊按钮边距
            navBoxHeight: (height + statusBarHeight + (margin * 2)),
            //导航栏的margintop，就是状态栏的高度+状态栏和胶囊按钮的间距，其实就是胶囊按钮的上边距
            navMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
            //导航栏文字和图标的高度
            navHeight: height,  // 与胶囊按钮同高
            //right:胶囊按钮右边坐标
            //width:胶囊按钮宽度
            //这里计算的是胶囊按钮左边部分的可用宽度
            navWidth: right - width,  // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
            //胶囊按钮的右边距
            menuButtonRightPadding:windowInfo.screenWidth-menuButtonInfo.right
          })
          const appInstance=getApp();

         
         appInstance.globalData.navMarginTop=this.data.navMarginTop
         appInstance.globalData.navHeight=this.data.navHeight
        },
      })
    },//calculateMenuAndStatusBar止
//backBeforePage 回到之前页面的函数，使用之前先用getCurrentPage判断用户是否有访问多个页面，若是单个页面是无法退回的
    backBeforePage(){
      //wx自带的回退函数
      wx.navigateBack();
      // let beforePage = this.data.pages[this.data.pages.length -2];  //获取上个页面的实例对象

      // beforePage.go_update();   //触发上个页面自定义的go_update方法

    },

    backIndexPage(){
      //wx自带的回退函数
       wx.switchTab({url:'/pages/index/index'})
    }

  }
})
