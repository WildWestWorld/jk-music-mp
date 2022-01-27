const baseUrl='https://jk-music-1577517-1309371796.ap-shanghai.run.tcloudbase.com'

export const get = (requestUrl:string) :Promise<any>=>{
  //wx.showLoading 就是出来一个提示框，title属性里面放的就是loading时候显示的文字是什么
  wx.showLoading({
    title:'加载中'
  })
  //返回一个promise对象
  return new Promise((resolve,reject)=>{
    //Wx.request必要的5个参数,url method,success(回调函数),fail(回调函数),compete(回调函数)
    wx.request({
      url:baseUrl+requestUrl,
      method:'GET',

      success:(res)=>{
        //resolve(res) =将res标记为resolve状态，也就是res被成功解析了
        //且标记为resolve的数据就是后续then里面的参数
        resolve(res.data)
      },

      fail:reject,
      //完成时
      complete:()=>{
        wx.hideLoading();
      }

    })
  })

//get方法止
}