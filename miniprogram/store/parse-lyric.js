// 正则(regular)表达式(expression): 字符串匹配利器

// [00:58.65]


  //使用正则表达式匹配歌词前面的时间
  // \d 匹配数字 \d{2} 匹配两位 
  // \[ \用于转义，说明你这个[使用来搜索的  \. 也是用于转义
  // .原来的意思是匹配除了换行符以外的任意单个字符

const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  // let lyricStrings = lyricString.split("\n")
  let lyricStrings=lyricString.split('\r\n')
  if(lyricStrings.length <= 2){
    lyricStrings=lyricString.split('\n')

  }
  const lyricInfos = []
  for (const lineString of lyricStrings) {
    // [00:58.65]他们说 要缝好你的伤 没有人爱小丑
    
    //正则表达式匹配字符就用exec
    const timeResult = timeRegExp.exec(lineString)
    //如果没有歌词就跳过，继续执行函数
    if (!timeResult) continue
    // 1.获取歌词时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3]
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10: millsecondTime * 1
    const time = minute + second + millsecond

    // 2.获取歌词文本
    const text = lineString.replace(timeRegExp, "")
    lyricInfos.push([ time, text ])
  }

  return lyricInfos
}
//防抖
export function oldDebounce(fun,delay){
  let run;
  return ()=>{
    let that=this
    let args =arguments

    clearTimeout(run)
    run=  setTimeout(
      ()=>{fun.apply(that,args)}
      ,delay)
  }
}

export function debounce(fun,delay){
  let timer =null;

  const _debounce =(...args)=>{
    if(timer){
      clearTimeout(timer)
    }
    timer =setTimeout(()=>{
      fun.apply(this,args)
    },delay)
  }

  return _debounce

}