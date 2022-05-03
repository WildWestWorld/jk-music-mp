
import { get, getDIY } from "../../api/request";
import { getMusicById } from "../../api/music"
const innerAudioContext = wx.createInnerAudioContext();

// pages/music-player/detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:0,
    music:null,
    isPlay:true,
    totalTime:0,
    formatTime:'00:00',
    currentTime:'00:00',
    canPlay:false,
    percent:0,
    showLrc:false,
  },
  observers:{
  'value':function(newVal){
    if(newVal>100){
      this.setData({
        value:100
      })
    }else if(newVal<0){
      this.setData({
        value:0
      })
    }
  }
},

// 自定义函数区
//改变播放状态的函数
changePlayState(){
  console.log(innerAudioContext.paused)
  this.setData({
    isPlay:innerAudioContext.paused
  })
  if(this.data.isPlay === true){
    innerAudioContext.play()
  }else{
    innerAudioContext.pause()
  }
  // console.log(this.data.isPlay)
},
//改变歌词的显示状态
changeLrcState(){

  this.setData({
    showLrc:!this.data.showLrc
  })
},

//用于修复微信小程序无法正确获取到音频长度的BUG

loadDuration() {
  setTimeout(() => {
      if (innerAudioContext.duration>0) {
        // 获取到正确的duration
        console.log(innerAudioContext.duration)

        let time=innerAudioContext.duration.toString().split('.')
        let timeMs=parseInt(time)*1000
        let min=this.transformMsToMin(timeMs)
        let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
        let formatTime=this.data.formatTime.split(':')
        formatTime[0]=min.toString();
        formatTime[1]=sec.toString();
        formatTime=formatTime.join(':').toString()
        this.setData({
          totalTime:innerAudioContext.duration,
          canPlay:true,
          formatTime:formatTime,
        })
   
        if(this.data.canPlay){
          innerAudioContext.play();
        }
      } else {
        this.loadDuration();
      }
  }, 10);
},
//用于转换ms与s之间的转换
transformMsToSec(totalMs){

  let min = parseInt(totalMs/60000);
  let remainSec = parseInt(totalMs/1000-min*60);

  if(remainSec < 10){
    
   return '0'+remainSec;
  } else {
   return remainSec;
  }

},
//用于转化ms与分钟之间的关系
transformMsToMin(totalMs){
  let min =Math.floor( parseInt(totalMs)/60000*10)/10;
  if(parseInt(min) < 10)
      return '0'+parseInt(min);
  else return parseInt(min)
},
//用于更新歌曲的进度条/当前时间
musicProcessTimeUpdate(){
  innerAudioContext.onTimeUpdate(()=>{
    let procent=Math.floor(innerAudioContext.currentTime/innerAudioContext.duration*1000)/10;
   
    if(procent=== 100){
      console.log('成功')
    }
    let time=innerAudioContext.currentTime.toString().split('.')
    let timeMs=parseInt(time)*1000
    let min=this.transformMsToMin(timeMs)
    let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
    // console.log(this.transformMsToSec(timeMs))
    let currentTime=this.data.formatTime.split(':')
    currentTime[0]=min.toString();
    currentTime[1]=sec.toString();
    currentTime=currentTime.join(':').toString()


    this.setData({

      currentTime:currentTime,
    })


    this.setData({
      value:procent
    })
    })
},
//监听歌曲自然结束
musicOnEnd(){
  innerAudioContext.onEnded(()=>{
    isPlay:false;
  })
},
// 处理歌词
dealLyric(lyc){
  console.log(lyc)
  //处理歌词我们需要把他转化成数组形式
  let lycArray=lyc.split('\r\n')
  //删除数组中的最后一个元素，因为大多数情况下他都是空的
  if(lycArray[lycArray.length-1]===""){
    lycArray.pop()
  }
  console.log(lycArray)
  //使用正则表达式匹配歌词前面的时间
  // \d 匹配数字 \d{2} 匹配两位 
  // \[ \用于转义，说明你这个[使用来搜索的  \. 也是用于转义
  // .原来的意思是匹配除了换行符以外的任意单个字符
  let pattern=/\[\d{2}:\d{2}\.\d{3}\]/;

  // let lrcTime=

},

//创建播放器示例
createMusicAudio(){
 //参考文献：https://developers.weixin.qq.com/minigame/dev/api/media/audio/InnerAudioContext.html

//  innerAudioContext.boolean.autoplay = true
//  console.log(innerAudioContext.src)
//  console.log(this.data.music.file.src)
 

//  innerAudioContext.onError((res) => {
//    console.log(res.errMsg)
//    console.log(res.errCode)
//  })

},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //用于掩饰进度条
    // setTimeout(()=>{
    //   setInterval(()=>{
      
    //     this.setData({
    //       value:this.data.value+1
    //     })
    //     // if(innerAudioContext.currentTime){
    //     // console.log(innerAudioContext.currentTime)
    //     // }
    //   },100)
    // },1000);


    if(options.id){
     
      console.log(`/music/${options.id}`)
      getMusicById(options.id).then(res=>{
        console.log(res)
        this.setData({
          music:res.data
        })
        console.log(this.data.music)
        console.log(this.data.music.file.url)
        
        innerAudioContext.src = this.data.music.file.url;
        console.log(innerAudioContext)
        
        innerAudioContext.onCanplay(this.loadDuration);
        
         console.log(this.data.totalTime)
        this.musicProcessTimeUpdate()
        // this.musicOnEnd()



        //请求歌词数据
        console.log(this.data.music.lyc.url)
        getDIY(this.data.music.lyc.url).then((res)=>{
          console.log(res.data)
          let lyc=res.data
          this.dealLyric(lyc)
        })
      })
      
    }




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
    innerAudioContext.destroy();

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