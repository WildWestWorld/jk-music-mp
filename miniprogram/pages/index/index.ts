// index.ts

import { sayHello } from "../../api/hello"

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
    message:'hello world!'
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
  }
})
