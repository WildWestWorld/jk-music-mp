import { get,getWithParams } from "./request"
export const getPageByMusicName =(data)=>{
  

  return getWithParams(`/music/pages`,data)
};
export const getMusicById =(id)=>{
  return get(`/music/${id}`)
};