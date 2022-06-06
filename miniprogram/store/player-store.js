import {HYEventStore} from 'hy-event-store'
import { getMusicById } from "../api/music";
import {getDIY} from "../api/request"
import {parseLyric,debounce,throttle} from "../store/index";
import moment from 'moment';

const backgroundAudioManager= wx.getBackgroundAudioManager();
const appInstance=getApp();


const playerStore =new HYEventStore({
  //常量
  state:{
    music:null,
    id:0,

    isFirstPlay:true,
    isStop:false,
    canPlay:false,
    isPlay:false,
    lycArray:[],
    currentLycIndex:0,
    totalTime:0,
    formatTime:'00:00',
    currentTime:'00:00',
    currentTimeMs:0,
    lycScrollTop:0,
    toLyc:'',
    isSliderDrag:false,
    value:0,
    playModeIndex: 0 ,//0循环播放，1单曲播放 2随机播放
    playModeName:'order',

    playSongList:[],
    playSongIndex:0,
    currentSong:null
  },

  actions:{
    //这里的{id}也可以写作payload，不过payload得传个对象，拿数据的时候得是payload.id
    playMusicWithSongIdAction(state,{id,isRefresh=false}){ 
      

      //如果播放的是同一首歌的话，我们就不再去请求音乐的API了
      //而且isRefresh为false，因为isRefresh用于强制刷新
      if(state.id === id && !isRefresh){
        this.dispatch("changeMusicPlayState",state.isPlay)
        return
      }

      //重置所有音乐变量 目的:改变音乐时会产生遗留上一首音乐的信息

      state.formatTime='00:00'
      state.lycArray=[]
      state.totalTime='0'
      state.currentLycIndex=0
      state.lycScrollTop=0
      state.toLyc=''
      state.currentTime='00:00'
      state.value=0
      state.isChangeMusic=false
      //1.请求歌曲
      getMusicById(id).then(res=>{
        console.log(res)
        state.music=res.data 
        state.id=id



        //2.请求歌词
        //如果存在歌词的链接就请求
       
        if(state.music.lyc !== null &&state.music.lyc ){
        getDIY(state.music.lyc.url).then((res)=>{
   
          let lyc=res.data
          //方法来自于store里面的parse-lyric
          lyc=parseLyric(lyc)
          console.log(lyc)
          state.lycArray=lyc

        })
      }


        //3.开启播放
        
        backgroundAudioManager.stop();
        backgroundAudioManager.src=state.music.file.url;
        backgroundAudioManager.title=state.music.name

        backgroundAudioManager.autoplay=true;     
        //修复音乐播放总时长无法正常获取的BUG   
        backgroundAudioManager.onCanplay(this.dispatch('loadDuration'))


        
        //4.监听歌曲事件
        //监听函数只需要开启一次监听就可以了，因为我们backgroundAudioManager是一直复用的
        if(state.isFirstPlay){
          this.dispatch('watchMusic')
          state.isFirstPlay=false
        }
      
    })
  },

//监听音乐的函数（重要）
  watchMusic(state){
    backgroundAudioManager.onPlay(()=>{
      let  isPlay=true
      state.isPlay=isPlay
      //设置全局变量isMusicPlay，isMusicPlay用于检验我们退出当前界面后我们是否点击了相同的音乐
      appInstance.globalData.isMusicPlay=true;
      appInstance.globalData.musicId=state.id;
  
    })
    backgroundAudioManager.onPause(()=>{
      let  isPlay=false
      state.isPlay=isPlay
      //当我们进行播放的时候我们就已经
      appInstance.globalData.isMusicPlay=false;
      
  
    }),
    //用于用户把小程序的背景播放给关掉的情况
    backgroundAudioManager.onStop(()=>{
      let  isPlay=false
      state.isPlay=isPlay
      state.isStop=true
      appInstance.globalData.isMusicPlay=false;
  
  
    }),
  
    backgroundAudioManager.onTimeUpdate(throttle(()=>{
      state.currentTimeMs= backgroundAudioManager.currentTime
      let procent=Math.floor(backgroundAudioManager.currentTime/backgroundAudioManager.duration*1000)/10;
     
 
      //当前时间的从s转化为min
      let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss')
          //不是在slider滑动状态，我们就设置data，如果在滑动我们就不设置data

      if(Math.abs(state.value-procent)>1.5){
        procent=state.value
        currentTime=state.currentTime

      }
    if(!state.isSliderDrag){
      state.value=procent
      state.currentTime=currentTime

    }
  
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
      let lycArray=state.lycArray;
  
        //原理：找出比当前时间大的一些的歌词的位置，找到了，当前歌词的位置就在到歌词的下面
        //如果lycArray的长度没有值的话就直接跳过
        //注意：设置值的时候得在这一行之前，因为这里有个return，若是if()里面的成立，return后面的命令行就不会触发了
        if(!state.lycArray.length||state.lycArray.length===0) return
        let i=0
        for( ;i<lycArray.length;i++){
          let lycTime=lycArray[i][0]
          if(musicCurrentTime<lycTime){
            break
          }
  
        }
      
        let currentIndex =i-1
        //如果currentIndex小于-1，当前歌词不会变蓝，所以小于0得把他设置为0（似乎不是这个原因）
        if(currentIndex<=0){
          currentIndex=0
          state.currentLycIndex=currentIndex
        }
        if(state.currentLycIndex !==currentIndex){
           state.currentLycIndex=currentIndex
        }

      if(state.currentLycIndex>=0){
          //设置滚动距离，
          //为什么减6？因为我们是从第7个开始滚动的，也就是中间的这个位置
        state.lycScrollTop=(state.currentLycIndex-0)*24.8*2
        state.toLyc='Lyc'+state.currentLycIndex

      }
  

  
  
  
  
      },300)),
    
      //监听播放结束的事件
      backgroundAudioManager.onEnded(()=>{
       //切换音乐

        this.dispatch("changePlayMusicToNextMusicOrPreMusic",true)

      })
  
  
     
  },
//用于进行音乐状态的改变
changeMusicPlayState(state,isPlay =true){
  state.isPlay= isPlay
  //如果用户把微信判断的背景音乐窗口关闭了
  if(state.isPlay&&state.isStop&&!state.isChangeMusic){
    backgroundAudioManager.src=state.music.file.url;
    backgroundAudioManager.title=state.music.name;
    //如果关了窗口如何让用户回到原来播放的位置
    //我们需要的是秒
    backgroundAudioManager.startTime=state.currentTimeMs/1000
    state.isStop=false
  }

  if(state.isPlay){
    backgroundAudioManager.play()
  }else{
    backgroundAudioManager.pause()
  }
},

//切换下一首/切换上一首，切换参数isNext
//若isNext=ture就是切换下一首，为false就是切换上一首
changePlayMusicToNextMusicOrPreMusic(state,isNext=true){
  console.log(state.playSongList)
  console.log(state.playSongList.length)
  //1.获取当前音乐的索引
  let  currentIndex =state.playSongIndex
  //2.根据不同的模式播放不同的音乐
  switch(state.playModeIndex){
    case 0:  //顺序播放
    currentIndex=isNext?currentIndex+1:currentIndex-1

    //如果当前的的索引到了playSongList的长度，就让index置为0
    if(currentIndex > state.playSongList.length-1){
      currentIndex=0
    }
     
    if(currentIndex < 0){
      currentIndex=state.playSongList.length -1
    }

    break

    case 1:  //单曲播放
    currentIndex=currentIndex
    break

    case 2:  //随机播放

    currentIndex=Math.floor(Math.random() * state.playSongList.length)
    break
    //如果随机到的数字还是我们当前播放的音乐就再随机一次

  }


  //3.获取当前歌曲
  let currentSong =state.playSongList[currentIndex]
  //如果没有playSongList
  if(!currentSong){
    currentSong=state.currentSong
  }
  //如果有歌曲
  else{
  //设置新的索引 若不设置，就点击下一首只能生效一次
  state.playSongIndex=currentIndex
  }
  //4.播放新的歌曲
  let playload={id:currentSong.id,isRefresh:true}
  this.dispatch("playMusicWithSongIdAction",playload)

    //判断是否是跳转的
    state.isChangeMusic=true
},

//快进30s
changePlayMusicToQuickOrSlow30s(state,isQuick=true){
  let  musicCurrentTime= backgroundAudioManager.currentTime

  if(isQuick){
  let newCurrentTime=musicCurrentTime+30
  let newValue=Math.floor(newCurrentTime/backgroundAudioManager.duration*1000)/10;
  let   currentTime = moment(newCurrentTime * 1000).format('mm:ss')
  // console.log(currentTime)
  // console.log(currentTime,newCurrentTime)

    backgroundAudioManager.seek(newCurrentTime)
    state.value=newValue
    state.currentTime=currentTime

  }else{
    let newCurrentTime=musicCurrentTime-30
    let newValue=Math.floor(newCurrentTime/backgroundAudioManager.duration*1000)/10;
    let currentTime = moment(newCurrentTime * 1000).format('mm:ss')
    // console.log(currentTime,newCurrentTime)
      backgroundAudioManager.seek(newCurrentTime)
      state.value=newValue
      state.currentTime=currentTime
  } 
},
//在歌曲列表弹框，点击跳转
changeCurrentMusic(state,musicIndex){

  //获取当前的音乐索引后面会用来比对
  const  currentIndex=state.playSongIndex

  if(currentIndex === musicIndex){
    return
  }
  //1.把当前音乐的索引改为我们要跳转的音乐的索引
  state.playSongIndex=musicIndex
  //2.获取我们要跳转的音乐歌曲
  let currentSong =state.playSongList[musicIndex]
  //如果没有playSongList
  if(!currentSong){
    currentSong=state.currentSong
  }
  //如果有歌曲
  else{
  //设置新的索引 若不设置，就点击下一首只能生效一次
  state.playSongIndex=musicIndex
  }
  //3.播放新的歌曲
  let playload={id:currentSong.id,isRefresh:true}
  this.dispatch("playMusicWithSongIdAction",playload)
  //判断是否是跳转的
  state.isChangeMusic=true
},
//删除列表中的当前元素
deleteMusicListCurrentMusic(state,musicIndex){
    console.log(musicIndex)
    console.log(state.playSongList)
    console.log(state.playSongIndex)

      //必须是不等于undefined 不然为0的时候他就工作了
  let playSongList=state.playSongList
  //当前播放的音乐的索引
  let CurrentMusicIndex=state.playSongIndex

    if(musicIndex !== undefined){
      playSongList.splice(musicIndex,1)
      //不设置为空，页面无法监听到  
      state.playSongList=[]
      state.playSongList=playSongList
      //要被删除的索引在播放的音乐的上面
      if(musicIndex<CurrentMusicIndex){
        state.playSongIndex= CurrentMusicIndex-1
      }
      //要被删除的索引就是播放的音乐
      if(musicIndex===CurrentMusicIndex){
        state.playSongIndex= CurrentMusicIndex

        let  newCurrentSong =state.playSongList[CurrentMusicIndex]
        let playload={id:newCurrentSong.id,isRefresh:true}
        this.dispatch("playMusicWithSongIdAction",playload)
        //判断是否是跳转的
        state.isChangeMusic=true
      }      
    }





},
//将歌曲放入我们的播放列表中
addNewMusicToPlayList(state,{item}){
  let musicItem=item
  console.log(musicItem)

  if(musicItem){
  //拿到当前的音乐列表
  let currentPlayList=state.playSongList
  //查找是否音乐列表中有该音乐
  let musicItemIndex=currentPlayList.findIndex((item)=>{
    return item.id === musicItem.id
  })
  console.log(musicItemIndex)
  //音乐列表中有该音乐
    if(musicItemIndex !== -1){
      state.playSongIndex=musicItemIndex

      let  newCurrentSong =state.playSongList[CurrentMusicIndex]
      let playload={id:newCurrentSong.id,isRefresh:true}
      this.dispatch("playMusicWithSongIdAction",playload)
    }else{
      //如果没有音乐列表中没有该音乐

      //将当前的音乐放入到播放列表的首位
      currentPlayList.unshift(musicItem)
      //点击这个item之后就把他放进我们的播放列表中
      state.playSongList=[];
      state.playSongList=currentPlayList
      state.playSongIndex=0
    }
  }
},
//将音乐列表存放到storage
saveMusicListIntoStorage(state){
 let playSongList= state.playSongList
 console.log(playSongList)
 if(playSongList.length !== 0){
  wx.setStorageSync('playSongList', playSongList)
}
 console.log(playSongList)
},

//被调用的子函数

//用于修复音乐播放总时长无法正常获取的BUG   
loadDuration(state) {
  setTimeout(() => {
      if (backgroundAudioManager.duration>0) {
        // 获取到正确的duration
        console.log(backgroundAudioManager.duration)

        let totalTime=backgroundAudioManager.duration
        let formatTime = moment(totalTime* 1000).format('mm:ss')

        state.totalTime=totalTime
        state.formatTime=formatTime
        //有些時候還是會查不出來所以我們需要再查一次
        if(appInstance.globalData.musicTotalTime !==state.totalTime){
          appInstance.globalData.musicTotalTime=state.totalTime
          clearTimeout()
          
        }else{
          appInstance.globalData.musicTotalTime=0
          this.dispatch('loadDuration')
        }
      } else {
        this.dispatch('loadDuration')
      }
  }, 100);
},


}
})

export{
  backgroundAudioManager,
  playerStore
}