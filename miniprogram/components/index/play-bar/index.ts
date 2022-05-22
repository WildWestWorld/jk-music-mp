import { playerStore } from "../../../store/index"

// components/index/play-bar/index.ts
Component({
  /**
   * 组件的属性列表
   */

  options:{
    styleIsolation:'isolated'
  },
  properties: {
    currentMusic:{
      type:Object,
      value:()=>{null}
  } ,
  playAnimState:{
    type:String,
    value:'',
  } ,
  isPlay:{
    type:Boolean,
    value:false,
  },
  showMusicList:{
    type:Boolean,
    value:false,
  },
  playSongList:{
    type:Array,
    value:[],
  },
  playSongIndex:{
    type:Number,
    value:0,
  }

  },

  /**
   * 组件的初始数据
   */
  data: {
    showMusicList:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //改变音乐的播放状态（页面绑定）
    changeMusicState(){
  
      let isPlay = !this.properties.isPlay
      playerStore.dispatch('changeMusicPlayState',isPlay)
    
    },
    //跳转到当前播放的音乐界面(页面绑定)
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
    //点击歌曲改变歌曲播放(页面绑定)(已经转移到compenent组件)
changeCurrentMusic(event){

  let newMusicIndex=event.currentTarget.dataset.index
  //必须是不等于undefined 不然为0的时候他就工作了
  if(newMusicIndex !== undefined){
  playerStore.dispatch('changeCurrentMusic',newMusicIndex)
  }
},
//点击歌曲删除歌曲列表中当前元素(页面绑定)
deleteMusicListCurrentMusic(event){

  
  let newMusicIndex=event.currentTarget.dataset.index
  playerStore.dispatch('deleteMusicListCurrentMusic',newMusicIndex)

  // //必须是不等于undefined 不然为0的时候他就工作了
  // let playSongList=this.data.playSongList
  // playSongList.splice(newMusicIndex,1)
  // if(newMusicIndex !== undefined){
  // this.setData({playSongList})
  // playerStore.setState('playSongList',playSongList)
  // }
},
  }
})
