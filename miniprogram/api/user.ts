import { post } from "./request"

type LoginRequest ={
  username:string,
  password:string
}

export const login =(loginReques:LoginRequest)=>{
  
  return  post('/tokens',loginReques)
};
export const register =(user:Object)=>{
  
  return  post('/users',user)
}
