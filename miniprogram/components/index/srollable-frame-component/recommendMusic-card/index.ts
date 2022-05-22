// components/index/srollable-frame-component/recommandMusic-card/index.ts
import {playerStore} from "../../../../store/player-store"
Component({
  /**
   * 组件的属性列表
   */  
  options:{
    styleIsolation:'isolated'
  },
  properties: {
      item:{
        type:Object,
        value:()=>{null}
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    artist:null,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTab(){
      let id =this.properties.item.id;
      wx.navigateTo({url:`/pages/music-player/detail?id=${this.properties.item.id}&musicName=${this.properties.item.name}&artistName=${this.properties.item.artistVoList[0].name}`})
   
      //对歌曲进行数据请求 
    let payload={id:id}
    playerStore.dispatch("playMusicWithSongIdAction",payload)
      //获取当前的歌曲列表/当前歌曲的索引

    }

    
  },
  onLoad(){


  }

})
