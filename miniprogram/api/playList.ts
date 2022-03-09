import { get } from "./request"

export const getPlayList =(id:String)=>{
  return get(`/playlist/${id}`)
}