
// 自己封装的wx登陆的api，因为微信的api不能用primise
export const  loginWxApi=()=>{
  return new Promise((resolve,reject)=>{
    
    wx.login({
      timeout:1000,
      success:(res)=>{
        //code
        const code =res.code
        //发送网路请求给服务器
        resolve(code)
      },
      fail:(err)=>{
        console.log(err)
        reject(err)
      }

    })
  })
}