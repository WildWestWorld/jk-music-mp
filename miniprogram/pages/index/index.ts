// index.ts

import { getToken } from "../../utils/auth"
import { sayHello } from "../../api/hello"
import { getPageByMusicName } from "../../api/music"
import { playerStore } from "../../store/index"

// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    categoryBannerList:[{
      name:'说唱音乐',
      playTimes:'15K',
      image:'../../images/recommend-playlist.png'
    },{
      name:'说唱音乐',
      playTimes:'15K',
      image:'../../images/recommend-playlist.png'
    },{
      name:'说唱音乐',
      playTimes:'15K',
      image:'../../images/recommend-playlist.png'
    },
  ],
    musicianBannerList:[{
      id:111,
      name:"黄渤",
      category:'流行音乐',
      image:'../../../../images/musician-photo.png'
    },{
      id:222,
      name:"黄渤",
      category:'流行音乐',
      image:'../../../../images/musician-photo.png'
    },{
      id:333,
      name:"黄渤",
      category:'流行音乐',
      image:'../../../../images/musician-photo.png'
    },
    
  ],
    recommandMusicList:[{
      id:"111",
      name:"狂想曲",
      description:'释放心中的怒火',
      image:'../../../../images/album.png'
    },{
      id:"111",
      name:"狂想曲",
      description:'释放心中的怒火',
      image:'../../../../images/album.png'
    },{
      id:"111",
      name:"狂想曲",
      description:'释放心中的怒火',
      image:'../../../../images/album.png'
    },
  ],
    lastPlayMusicList:[{
      name:"夜曲",
      album:"十一月的肖邦",
      artist:"周杰伦",
      cover:'../../../images/yequ.jpeg'
    },{
      name:"夜曲",
      album:"十一月的肖邦",
      artist:"周杰伦",
      cover:'../../../images/yequ.jpeg'
    }
    ],
    JKRecommandMusicList:null,
    message:'hello world!',
    currentMusic:{},
    isPlay:false,
    playAnimState:"paused",
    
    playSongList:[],
    playSongIndex:0,
    showMusicList:false,
  },
  // 事件处理函数
  //button点击 会调用hi函数
  hi(){
    //因为返回回来的是promise对象所以可以.then
    sayHello().then(resData =>{
   
      //微信中的赋值
      this.setData!({
      message : resData
     })
     
      return console.log(resData)
    })
  },
  // test(event){
  //   console.log(event)
  // },
//更新页面使用的函数，会在navigator组件中使用(暂时无用)
go_update(){
  let data={pageNum:1,pageSize:10,searchWord:''};
  getPageByMusicName(data).then(res=>{
    console.log(res)
    this.setData({
      'JKRecommandMusicList':res.data.records
    })
  })
},
debounce(fun,delay){

  let time

  return ()=>{
    let that=this
    let argus=arguments

    clearTimeout(time)

    time=setTimeout(
      ()=>{
       fun.apply(that,argus)
    }
    ,delay)

  }
},
//用于点击卡片时候触发的函数（页面绑定）
handleSongItemClick(event){
  let index=event.currentTarget.dataset.index
  playerStore.setState("playSongIndex",index)

  // playerStore.setState("playSongList",this.data.JKRecommandMusicList)

  //拿到item信息
  let musicItem=event.currentTarget.dataset.item;
  // //拿到当前的音乐列表
  // let currentPlayList=this.data.playSongList
  // //将当前的音乐放入到播放列表的首位
  // currentPlayList.unshift(musicItem)
  //   //点击这个item之后就把他放进我们的播放列表中
  // playerStore.setState("playSongList",currentPlayList)
  // playerStore.setState("playSongIndex",0)
  let payload={item:musicItem}
  playerStore.dispatch('addNewMusicToPlayList',payload)
  console.log(event)
},
//改变音乐的播放状态（页面绑定）(现在转移到component里面了)
changeMusicState(){
  
  let isPlay = !this.data.isPlay
  playerStore.dispatch('changeMusicPlayState',isPlay)

},
//跳转到当前播放的音乐界面(页面绑定)(现在转移到component里面了)
navigateToCurrentMusic(){
  wx.navigateTo({
    url:'/pages/music-player/detail?id='+this.data.currentMusic.id
  })
},
changeShowMusicListState(){
  let showMusicList=!this.data.showMusicList

  this.setData({
    showMusicList: showMusicList,

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
    if(!getToken){
      wx.switchTab({url:'/pages/login/index'})
    };
    //用于监听playerStore，详情在上面
    this.watchPlayerStoreListener()

    
  },
  //在页面初始化完毕后加载的函数
  onShow(){

  //  let fun=()=>{ 
  //    let data={pageNum:1,pageSize:10,searchWord:''};
  //   getPageByMusicName(data).then(res=>{
  //     console.log(res)
  //     this.setData({
  //       'JKRecommandMusicList':res.data.records
  //     })
  //   })
  //   this.debounce(fun,3000)
  // }

  },
  onReady(){
    let data={pageNum:1,pageSize:10,searchWord:''};
    getPageByMusicName(data).then(res=>{
      console.log(res)
      this.setData({
        'JKRecommandMusicList':res.data.records
      })
    })
  }
})
