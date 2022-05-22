import { loginWxApi } from "./api/loginWx";
import { playerStore } from "./store/index";
import { getToken } from "./utils/auth"

// app.ts
App<IAppOption>({
  globalData: {
    //是否在播放
    isMusicPlay:false,
    isSameMusic:false,
    //音乐ID
    musicId:'',
    // 当前播放歌单id
     musicListId: '',
    // 当前播放歌曲在歌单中的索引
    playingMusicIndex: 0,
    // 当前播放歌单
    playingMusicList: [],
    // 用户喜欢的歌曲列表(短时间多次请求喜欢列表会导致304缓存，所以请求一次后在本地进行操作)
    likeList: [],
    // 存放在musicList中请求到的列表id
    trackIdsList: [],
    //下面的暂时无用
    musicObject:null,
    musicPercent:0,
    musicTotalTime:'00:00',
    musicCurrentTime:'00:00',
    //屏幕的信息
    screenWidth:0,
    screenHeight:0,
    deviceRadio:0,
    //状态栏的信息，状态栏就是显示时间和电量的一个状态
    statusBarHeight:0,

  },
  //自定义函数区
  async loginWx(){
    //自定义函数，具体在api/loginWx里面
    const code =await loginWxApi()
    console.log(code)
  },
  onLaunch() {
    //获取当前手机的信息，例如屏幕的宽高
    const info =wx.getSystemInfoSync();
    this.globalData.screenHeight =info.screenHeight;
    this.globalData.screenWidth =info.screenWidth;
    this.globalData.statusBarHeight =info.statusBarHeight;
    this.globalData.deviceRadio=info.devicePixelRatio
    console.log(info);
    //获取用户信息(暂时不需要，我们有写token)
    // this.loginWx()
    
    //获取store里面playSongList
    let playSongList =wx.getStorageSync('playSongList')
    console.log(playSongList)
    if(playSongList.length !== 0){
      playerStore.setState('playSongList',playSongList)
      console.log(playSongList)
    }
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


         //获取store里面playSongList

  },
  onUnload(){
  }

})