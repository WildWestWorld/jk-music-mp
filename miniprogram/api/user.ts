import { post } from "./request"

type LoginRequest ={
  username:string,
  password:string
}

export const login =(loginReques:LoginRequest)=>{
  
  return  post('/login',loginReques)
}