import { playerStore } from "../../../store/index"

// components/common/JKMusicList/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // showMusicList:{
    //   type:Boolean,
    //   value:false
    // },
    playSongIndex:{
      type:Number,
      value:0
    },
    playSongList:{
      type:Object,
      value:()=>{null}
    },
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
    changeShowMusicListState(){
      let showMusicList=!this.data.showMusicList
    
      this.setData({
        showMusicList: showMusicList,
    
      })
    },
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
