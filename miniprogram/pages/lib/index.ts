import { getPageByMusicName } from "../../api/music";
import { debounce, playerStore, throttle } from "../../store/index";

// pages/lib/index.ts
const appInstance=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    contentHeight:0,
    contentTop:0,
    deviceRadio:0,
    tabList:["歌曲","歌单","歌手","专辑","风格"],
    currentTabIndex:0,
    toTab:'Tab0',
    scrollLeft: 0, //tab标题的滚动条位置
    screenWidth:0,
    scrollPercent:0,
    isClick:false,

    currentMusic:{},
    isPlay:false,
    playAnimState:"paused",
    
    playSongList:[],
    playSongIndex:0,

    musicList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  

   //自定义函数区
   //改变当前Tab的Index值（页面绑定）
   changeCurrentTabIndex(event){
     let clickItemIndex=event.currentTarget.dataset.clickitemindex
      if(clickItemIndex !== undefined && clickItemIndex !== null){
        this.setData({
          currentTabIndex:clickItemIndex,
          isClick:true
       
        })
     }

     //如果点击的Item的索引在第四个，就引动
      if(clickItemIndex>=3){
        this.setData({
          scrollLeft: 400
        })
      }else{
        this.setData({
          scrollLeft: 0
        })
      }

   },

   //监控当前SwiperItem滑动的位置(页面绑定)
   watchSwiperItemPositon(event){
    let intDx= parseInt(event.detail.dx)
    let scrollPercent=Math.floor((intDx/this.data.screenWidth*10000)/100)/100

    // scrollPercent=scrollPercent%1
    // console.log(event)
    
    
    let isClick=this.data.isClick

    if(scrollPercent != 0 && isClick===false){
      this.setData({
        scrollPercent:scrollPercent,
        
      })
  
    }


   },
   //监控当前Swiper动画完成(页面绑定)
   watchSwiperAnimationFinish(event){
    let currentSwiperItemIndex=event.detail.current
    if(currentSwiperItemIndex !== undefined && currentSwiperItemIndex !== null){
      this.setData({
        currentTabIndex:currentSwiperItemIndex,
        scrollPercent:0,
        isClick:false
      })
      
   }

   if(currentSwiperItemIndex>=3){
    this.setData({
      scrollLeft: 400
    })
    }else{
      this.setData({
        scrollLeft: 0
      })
    }

   },
   //检测swiper数值改变
   watchSwiperChange(event){
  },
  //查询tab-item的宽度
  queryTabItem(){
    const query = wx.createSelectorQuery()

    query.selectAll('.tab-item-content').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res)=>{
      console.log(res)
      let currentTabIndex=this.data.currentTabIndex
     this.setData({
       test:res[0][currentTabIndex].width
     })
     console.log(this.data.test)
    })

  },


  //监听专区
watchPlayerStoreListener(){

  //监听currentSong的信息
playerStore.onStates(["music","isPlay"],({music,isPlay})=>{
    if(music !== undefined){
      this.setData({
        currentMusic:music
      })
    }

    if(isPlay !== undefined){
      this.setData({
        isPlay:isPlay,
        playAnimState:isPlay?"running":"paused"
      })
    }
})
//歌单相关变量监听
  playerStore.onStates(["playSongList","playSongIndex"],({playSongList,playSongIndex})=>{
  if(playSongList!== undefined&&playSongList !== null){   this.setData({playSongList:playSongList})}
  if(playSongIndex !== undefined&&playSongIndex !== null){   this.setData({playSongIndex:playSongIndex})}
  });
},

  onLoad() {
    
    //监听
    this.watchPlayerStoreListener()
    //计算页面容器的高度
    const info =wx.getSystemInfoSync();

    //整个屏幕的宽度
    let screenWidth= info.windowWidth
    //整个屏幕的高度
    let sreenHeight= appInstance.globalData.sreenHeight|| info.screenHeight
    // 状态栏 + 胶囊按钮边距
    let navMarginTop=  appInstance.globalData.navMarginTop
    //胶囊按钮的高度
    let navHeight=    appInstance.globalData.navHeight

    //页面的高度
    let contentHeight=sreenHeight-navMarginTop-navHeight
    //页面排除胶囊按钮后的高度
    let contentTop = navMarginTop+navHeight

    //像素比
    let deviceRadio=  appInstance.globalData.deviceRadio


    console.log(contentHeight,sreenHeight,navMarginTop,navHeight)
    this.setData({
      contentHeight,
      contentTop,
      deviceRadio,
      screenWidth
    })


    //获取歌曲数据
    let data={pageNum:1,pageSize:10,searchWord:''};
    getPageByMusicName(data).then(res=>{
      console.log(res.data.records)
      if(res.data.records !== undefined){
        this.setData({
          'musicList':res.data.records
        })
      }
    })
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