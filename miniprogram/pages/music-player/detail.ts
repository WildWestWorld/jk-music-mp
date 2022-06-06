
import { get, getDIY } from "../../api/request";
import { getMusicById } from "../../api/music";
import {backgroundAudioManager,debounce,parseLyric,playerStore, throttle} from "../../store/index";
import moment from 'moment';

const appInstance=getApp();

const playModeNames =["order","repeat","random"]

//！！！！！！！！！！！
// 该页面的大部分的逻辑代码都转移到了store/plaer-store了，留下来的都是原稿
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:0,
    music:null,
    isPlay:false,
    totalTime:0,
    formatTime:'00:00',
    currentTime:'00:00',
    canPlay:false,
    percent:0,
    showLrc:false,
    lycArray:[],
    currentLycIndex:0,
    lycScrollTop:0,
    musicSrc:null,
    musicName:null,
    musicId:null,
    toLyc:'',
    showMusicList:false,
    contentHeight:0,
    //需要下移的高度
    contentTop:0,
    deviceRadio:0,
    isSliderDrag:false,
    playModeIndex:0,
    playModeName:'order',

    playSongList:[],
    playSongIndex:0,

    toCurrentMusic:'',
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
  let isPlay= !this.data.isPlay;

  playerStore.dispatch("changeMusicPlayState",isPlay)
  this.setData({
    isPlay
  })
  // this.changeMusicPlayState(isPlay);

  // console.log(this.data.isPlay)
},
//改变音乐播放状态
changeMusicPlayState(isPlay){


  if(isPlay){
    backgroundAudioManager.play();
  }else{
    backgroundAudioManager.pause();
  }
},
//设置用于图标显示isPlay变量的函数，只是个封装函数跟this.setData一样的，只是这样写更美观
changeMusicIsPlay(isPlay){
  this.setData({
    isPlay
  })
},

//改变歌词的显示状态(页面绑定)
changeLrcState(){

  this.setData({
    showLrc:!this.data.showLrc
  })
},
//改变随机播放图标的显示状态(页面绑定)
changePlayModeIndexToRadom(){
  this.setData({
    playModeIndex:2
  })
  playerStore.setState('playModeIndex',2)
  wx.setStorageSync('playModeIndex',2)

  wx.showToast({
    title:'随机播放',
    icon: 'none',
    duration: 1000
  })

},
changePlayModeIndexToSingleCricle(){
  this.setData({
    playModeIndex:1
  })
  playerStore.setState('playModeIndex',1)
  
  wx.setStorageSync('playModeIndex',1)

  wx.showToast({
    title:'单曲循环',
    icon: 'none',
    duration: 1000
  })

},
changePlayModeIndexToListCricle(){
  this.setData({
    playModeIndex:0
  })
  playerStore.setState('playModeIndex',0)
  wx.setStorageSync('playModeIndex',0)
  wx.showToast({
    title:'列表循环',
    icon: 'none',
    duration: 1000
  })

},
//切换下一首(页面绑定)
changePlayMusicToNextMusic(){
  //重置歌词状态，不重置会导致歌词还保留上一首歌曲的歌曲的位置
  this.setData({
    currentLycIndex:0,
  })

  playerStore.dispatch("changePlayMusicToNextMusicOrPreMusic",true)
},
//切换上一首(页面绑定)
changePlayMusicToPreMusic(){
  this.setData({
    currentLycIndex:0,
  })
  playerStore.dispatch("changePlayMusicToNextMusicOrPreMusic",false)

},

//快进30s(页面绑定)
changePlayMusicToQuick30s(){
  playerStore.dispatch("changePlayMusicToQuickOrSlow30s",true)
},
//后退30s(页面绑定)
changePlayMusicToSlow30s(){
  playerStore.dispatch("changePlayMusicToQuickOrSlow30s",false)
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

//用于修复微信小程序无法正确获取到音频长度的BUG
loadDuration() {
  setTimeout(() => {
      if (backgroundAudioManager.duration>0) {
        // 获取到正确的duration
        console.log(backgroundAudioManager.duration)

        let time=backgroundAudioManager.duration.toString().split('.')
        let timeMs=parseInt(time)*1000
        let min=this.transformMsToMin(timeMs)
        let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
        let formatTime=this.data.formatTime.split(':')
        formatTime[0]=min.toString();
        formatTime[1]=sec.toString();
        formatTime=formatTime.join(':').toString()
        this.setData({
          totalTime:backgroundAudioManager.duration,
          // canPlay:true,
          formatTime:formatTime,
        })
        appInstance.globalData.musicTotalTime=this.data.totalTime
        if(this.data.canPlay){
          // innerAudioContext.play();
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
//用于更新歌曲的进度条/当前时间(废弃，已经和watchMusic合并)
musicProcessTimeUpdate(){
  backgroundAudioManager.onTimeUpdate(()=>{
    let procent=Math.floor(backgroundAudioManager.currentTime/backgroundAudioManager.duration*1000)/10;
   
    if(procent=== 100){
      console.log('成功')
    }
    //当前时间的从s转化为min

    // let time=backgroundAudioManager.currentTime.toString().split('.')
    // let timeMs=parseInt(time)*1000
    // let min=this.transformMsToMin(timeMs)
    // let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
    // // console.log(this.transformMsToSec(timeMs))
    // let currentTime=this.data.formatTime.split(':')
    // currentTime[0]=min.toString();
    // currentTime[1]=sec.toString();
    // currentTime=currentTime.join(':').toString()


    let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss')
    //歌词根据当前时间进行滚动
    let musicCurrentTime=backgroundAudioManager.currentTime;
    let lycArray=this.data.lycArray;
    //判断是否是最后一行，因为我们在最后一行的时候无法再比较下下句和当前句的时间了，所以我们得进行特殊的判断
    if(this.data.currentLycIndex === lycArray.length-2){
      console.log(this.data.currentLycIndex)
      //在唱最后一句
      if(musicCurrentTime>=lycArray[lycArray.length-1][0]){
        this.setData({
          currentLycIndex:lycArray.length-1
        })
      
      }
    }else if(this.data.currentLycIndex <= lycArray.length-2){
      for( let  i=0;i<lycArray.length;i++){
        if(musicCurrentTime>=lycArray[i][0]&&musicCurrentTime<lycArray[i+1][0]){
          this.setData({
            currentLycIndex:i
          })
        }
      }
    }
 

    if(this.data.currentLycIndex>=0){
      this.setData({
        //设置滚动距离，
        //为什么减6？因为我们是从第7个开始滚动的，也就是中间的这个位置
        toView:'cate'+this.data.currentLycIndex,
        lycScrollTop:(this.data.currentLycIndex-0)*24.8*2,
      })
    }
    //不是在slider滑动状态，我们就设置data，如果在滑动我们就不设置data
    console.log(!this.data.isSliderDrag)
        if(!this.data.isSliderDrag){
            this.setData({
              value:procent,
              currentTime:currentTime,
              
            })
          }


    })
},
//判断此时的页面是是否是我们之前播放的页面(废弃)
musicIsNowPlayMusic(musicId){
  //如果此时的全局变量isMusicPlay为true和musicID与当前的msuicID相同 
  //也就是当前music在播放，而且新打开的页面与之前的页面相同
  
  if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===musicId){
    console.log(appInstance.globalData.isMusicPlay)
    console.log(appInstance.globalData.musicId===musicId)
    this.setData({
      isPlay:true
    })
    return true
  }else{
    return false
  }
},

//防抖（已经迁移，迁移位置在顶部）
debounce(fun,delay){
  let run;
  return ()=>{
    let that=this
    let args =arguments

    clearTimeout(run)
    run=  setTimeout(
      ()=>{fun.apply(that,args)}
      ,delay)
  }
},


// 处理歌词（废弃，改用store下面parse-lyric函数）
dealLyric(lyc){

  let lycResult=[]
  //处理歌词我们需要把他转化成数组形式
  let lycArray=lyc.split('\r\n')
  if(lycArray.length <= 2){
  lycArray=lyc.split('\n')

  }
  //删除数组中的最后一个元素，因为大多数情况下他都是空的
  if(lycArray[lycArray.length-1]===""){
    lycArray.pop()
  }

  //使用正则表达式匹配歌词前面的时间
  // \d 匹配数字 \d{2} 匹配两位 
  // \[ \用于转义，说明你这个[使用来搜索的  \. 也是用于转义
  // .原来的意思是匹配除了换行符以外的任意单个字符
  let pattern=/\[\d{2}:\d{2}\.\d{2,3}\]/;
  //利用map函数替换每一个带有时间标记的元素
  lycArray.map(item=>{
    let realLyc=item.replace(pattern,'')
    let lycTime=item.match(pattern)
    //去除括号
    if(lycTime !== null){
      lycTime=lycTime[0].slice(1,-1)
      let timeArray=lycTime.split(":")
      let realTime=parseInt(timeArray[0])*60+parseFloat(timeArray[1]);
      let realTimeStr=parseFloat(realTime.toFixed(3))
 
      //把时间和歌词放进一个数组中
      lycResult.push([realTimeStr,realLyc])
      lycResult=this.dealLyricIsEmpty(lycResult)

    }

    // console.log(lycTime)
  
  })
  return lycResult


},
//处理歌词是空的情况，属于处理歌词的子函数（废弃）
dealLyricIsEmpty(lycArray){
  let resultLycArray=[]
  lycArray.map((item)=>{
    if(item[1]!==""){
      resultLycArray.push(item)
    }
  })
  return resultLycArray;
},
//显示音乐数组（理应保留）(现在已转移到component)
changeShowMusicListState(){
  let showMusicList=!this.data.showMusicList

  this.setData({
    showMusicList: showMusicList,

  })
},

// ------------------------------监听专区---------------------
//用于监听Slider值变动后使用的函数(理应保留)
handleSliderChange(event){
  


  console.log(event)

  //获取滑动后变化的值
  let valueAfterSlider =event.detail.value
  console.log(valueAfterSlider)
  //转化为百分比
  let percentAfterSlider=valueAfterSlider/100
  //当前的时间 百分比*总时间 
  //此时的总时间是Ms 我们需要s，所以除以1000
  let currentTimeAfterSlider=percentAfterSlider*this.data.totalTime
  //调用backgroundAudioManager的seek函数让他跳转到指定的位置

  backgroundAudioManager.pause()
  backgroundAudioManager.seek(currentTimeAfterSlider)
    backgroundAudioManager.play()

  playerStore.setState('value',valueAfterSlider)
  let   currentTime = moment(currentTimeAfterSlider * 1000).format('mm:ss')                

  playerStore.setState('currentTime',currentTime)



  //设置最新的进度条状态
  this.setData({
    value:valueAfterSlider,
    // 结束拖动事件，结束拖动状态
    isSliderDrag:false,
    currentTime:currentTime,

  })
  playerStore.setState('isSliderDrag',false)


},
//用于监听页面的拖动状态(理应保留)
handleSliderDrag(event){
  this.setData({
    isSliderDrag:true,
  })

  playerStore.setState('isSliderDrag',true)
  //获取滑动正在拖动的位置当前值
  let valueAfterDrag =event.detail.value

    console.log(valueAfterDrag)
    //转化为百分比
    let percentAfterDrag=valueAfterDrag/100
    let currentTimeAfterDrag=percentAfterDrag*this.data.totalTime
 
  //时间格式化
        // let time=currentTimeAfterDrag.toString().split('.')
        // let timeMs=parseInt(time)*1000
        // let min=this.transformMsToMin(timeMs)
        // let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
        // // console.log(this.transformMsToSec(timeMs))
        // let currentTime=this.data.formatTime.split(':')
        // currentTime[0]=min.toString();
        // currentTime[1]=sec.toString();
        // currentTime=currentTime.join(':').toString()

        let   currentTime = moment(currentTimeAfterDrag * 1000).format('mm:ss')
        playerStore.setState('isSliderDrag',true)
        playerStore.setState('currentTime',currentTime)
        
        this.setData({
          isSliderDrag:true,
          currentTime:currentTime,
          
        })
   
        console.log(currentTime)


},
//监听歌曲播放(重要)（已经迁移，迁移位置在顶部）
watchMusic(){
  backgroundAudioManager.onPlay(()=>{
    this.changeMusicIsPlay(true)
    //设置全局变量isMusicPlay，isMusicPlay用于检验我们退出当前界面后我们是否点击了相同的音乐
    appInstance.globalData.isMusicPlay=true;
    appInstance.globalData.musicId=this.data.musicId;

  })
  backgroundAudioManager.onPause(()=>{
    this.changeMusicIsPlay(false)
    //当我们进行播放的时候我们就已经
    appInstance.globalData.isMusicPlay=false;
    

  }),
  backgroundAudioManager.onStop(()=>{
    this.changeMusicIsPlay(false)
    appInstance.globalData.isMusicPlay=false;


  }),

  backgroundAudioManager.onTimeUpdate(this.debounce(()=>{

    let procent=Math.floor(backgroundAudioManager.currentTime/backgroundAudioManager.duration*1000)/10;
   
    if(procent=== 100){
      console.log('成功')
    }
    //当前时间的从s转化为min
    let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss')

    

    // let time=backgroundAudioManager.currentTime.toString().split('.')
    // let timeMs=parseInt(time)*1000
    // let min=this.transformMsToMin(timeMs)
    // let sec=this.transformMsToSec(timeMs).toString().slice(0,2)
    // // console.log(this.transformMsToSec(timeMs))
    // let currentTime=this.data.formatTime.split(':')
    // currentTime[0]=min.toString();
    // currentTime[1]=sec.toString();
    // currentTime=currentTime.join(':').toString()


    //歌词根据当前时间进行滚动
    //为什么乘1000因为我们在parse-lyric里面把以ms为单位，currentTime返回的是s，所以乘以1000
    let musicCurrentTime=backgroundAudioManager.currentTime*1000;
    let lycArray=this.data.lycArray;

    //该方法废弃，废弃原因：会造成歌词显示慢，改用下面的方法
    //判断是否是最后一行，因为我们在最后一行的时候无法再比较下下句和当前句的时间了，所以我们得进行特殊的判断
    
    // if(this.data.currentLycIndex === lycArray.length-2){
    //   console.log(this.data.currentLycIndex)
    //   //在唱最后一句
    //   if(musicCurrentTime>=lycArray[lycArray.length-1][0]){
    //     this.setData({
    //       currentLycIndex:lycArray.length-1
    //     })
      
    //   }
    // }else if(this.data.currentLycIndex <= lycArray.length-2){
    //   for( let  i=0;i<lycArray.length;i++){
    
    //     if(musicCurrentTime>=lycArray[i][0]&&musicCurrentTime<lycArray[i+1][0]){
    //       this.setData({
    //         currentLycIndex:i
    //       })
    //     }
    //   }
    // }
 

      //原理：找出比当前时间大的一些的歌词的位置，找到了，当前歌词的位置就在到歌词的下面
      //如果lycArray的长度没有值的话就直接跳过
      if(!this.data.lycArray.length) return
      let i=0
      for( ;i<lycArray.length;i++){
        let lycTime=lycArray[i][0]
        if(musicCurrentTime<lycTime){
          break
        }

      }
      let currentIndex =i-1
      if(this.data.currentLycIndex !==currentIndex){
        this.setData({
          currentLycIndex:currentIndex
        })
      }




    if(this.data.currentLycIndex>=0){
      this.setData({
        //设置滚动距离，
        //为什么减6？因为我们是从第7个开始滚动的，也就是中间的这个位置
        lycScrollTop:(this.data.currentLycIndex-0)*24.8*2,
        toLyc:'Lyc'+this.data.currentLycIndex
      })
    }

  //不是在slider滑动状态，我们就设置data，如果在滑动我们就不设置data
  console.log(this.data.isSliderDrag)
  if(!this.data.isSliderDrag){

    this.setData({
      value:procent,
      currentTime:currentTime,
      
    })
  }




    },200))



   
},
// 歌词相关的变量监听 函数抽离
musicStateWatchFunciton({formatTime,lycArray,totalTime,currentLycIndex,lycScrollTop,toLyc,currentTime}){

  if(formatTime){this.setData({formatTime})}
  if(lycArray){this.setData({lycArray})}
  if(totalTime){this.setData({totalTime})}

  if(  currentLycIndex !== undefined&&currentLycIndex !== null){this.setData({currentLycIndex})}

  if(lycScrollTop){this.setData({lycScrollTop})}
  if(toLyc){this.setData({toLyc})}

  //时间变化
  if(currentTime&& !this.data.isSliderDrag){
    this.setData({currentTime})
  }
},
//用于监听store下面的player-store player-store放着我们需要的歌曲/歌词信息
//注意异步请求，会有一段时间的null，所以建议发过来的值就是直接是异步请求后的
//(重要)
watchPlayerStoreListener(){
  // onStates可以监听多个数值
  //若只有最右边的括号里只有个值，就返回的是对象，若是有多个值加个中括号就是对象里面的值了
  
  //播放相关的变量监听
playerStore.onStates(["music","id","isPlay"],({music,id,isPlay})=>{

  if(music){   this.setData({music:music})
  }
  if(id){   this.setData({id:id})
  }
  if(isPlay){   this.setData({isPlay:isPlay})
}
});


  //歌词相关的变量监听
playerStore.onStates(["formatTime","lycArray","totalTime","currentLycIndex","lycScrollTop","toLyc","currentTime"],
//封装好的函数，就在watchPlayerStoreListener上面
this.musicStateWatchFunciton
);
//进度条相关变量监听
playerStore.onStates(["value"],({value})=>{

  if(value!== undefined&& value !== null){   this.setData({value:value})}
//  const  fun =()=>{
//   console.log(value)
//   if(value){   this.setData({value:value})
//  }
//   }
  // throttle(()=>{
  // console.log(value)
  // if(value){   this.setData({value:value})}
  // },10)

});
//播放模式相关变量监听
playerStore.onStates(["playModeIndex"],({playModeIndex})=>{


  if(playModeIndex){   this.setData({playModeIndex:playModeIndex,playModeName:playModeNames[playModeIndex]})
  }
});
//歌单相关变量监听

playerStore.onStates(["playSongList","playSongIndex"],({playSongList,playSongIndex})=>{

  if(playSongList!== undefined&&playSongList !== null){   this.setData({playSongList:playSongList})}
  if(playSongIndex !== undefined&&playSongIndex !== null){   this.setData({playSongIndex:playSongIndex})}
  

});
},
  /**
   * 生命周期函数--监听页面加载
   */
  // 整体的业务逻辑已经转移到store里面的player-store文件里面去了
  onLoad(options) {



    //获取播放模式
    let playModeIndex=wx.getStorageSync('playModeIndex')
    if(playModeIndex){
      this.setData({playModeIndex})

    }else{
      this.setData({playModeIndex:0})
      wx.setStorageSync('playModeIndex',0)
      playerStore.setState('playModeIndex',0)
    }
    //监听和获取歌曲的信息
    this.watchPlayerStoreListener()


    //计算页面容器的高度
    const info =wx.getSystemInfoSync();


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
      deviceRadio
    })
    console.log(this.data.deviceRadio)

    console.log(options)
    let isNowPlayMusic=this.musicIsNowPlayMusic(options.id)
    console.log(isNowPlayMusic)

    if(isNowPlayMusic){
      this.changeMusicIsPlay(true);
    }
    if(options.id){
     
      console.log(`/music/${options.id}`)
      // getMusicById(options.id).then(res=>{
      //   console.log(res)
      //   this.setData({
      //     music:res.data
      //   })
        console.log(this.data.music)
        //创建一个可以后台播放的audio 并且绑定到this上，这样我们就可以在任意位置调用该audio的方法和属性
        //上面的是我们以前使用的方法，现在我们使用Store里面的文件来引入一个backgroundAudioManager
        //这样就不用this.backgroundAudioManager 而是直接使用
        //修改：现在引入的方法并不好用该为原来的方法
        // this.backgroundAudioManager= wx.getBackgroundAudioManager()

        // this.backgroundAudioManager.stop();
        // this.backgroundAudioManager.src=this.data.music.file.url;
       

        // this.backgroundAudioManager.title=this.data.music.name

       //为了处理组件运行了一个歌曲，再运行时显示的长度是上一首歌曲的时间长度
        // if(appInstance.globalData.musicTotalTime=this.data.totalTime){
        //   this.loadDuration()
        // }
        //设置音乐的访问地址和名字和id
        // this.setData({
        //   musicSrc:this.data.music.file.url,
        //   musicName:this.data.music.name,
        //   musicId:this.data.music.id

        // })

         console.log(this.data.totalTime)
         //判断此时的页面是是否是我们之前播放的页面
        //音乐播放进度条的更新
        // this.musicProcessTimeUpdate()

        //音乐的更新状态函数
        // this.watchMusic()

        // this.musicOnEnd()

        //请求歌词数据
        // console.log(this.data.music.lyc.url)
        // getDIY(this.data.music.lyc.url).then((res)=>{
   
        //   let lyc=res.data
        //   lyc=parseLyric(lyc)
        //   console.log(lyc)
        //   this.setData({
        //     lycArray:lyc
        //   })
        // })
      // })
      
    }
 


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
    playerStore.dispatch('saveMusicListIntoStorage')
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
    //停止监听
//     playerStore.offStates(["formatTime","lycArray","totalTime","currentLycIndex","lycScrollTop","toLyc","currentTime"],
// //封装好的函数，就在watchPlayerStoreListener上面
//     this.musicStateWatchFunciton
//     );
    // playerStore.dispatch('saveMusicListIntoStorage')
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