const tokenKey = 'JK-token'

export const setToken =(token:string)=>{
  //微信版setlocalStorage
    wx.setStorageSync(tokenKey,token)
}
export const getToken=()=>{
   //微信版setlocalStorage
  return wx.getStorageSync(tokenKey)||null
}
export const removeToken =  ()=>{
  wx.setStorageSync(tokenKey,'');
}