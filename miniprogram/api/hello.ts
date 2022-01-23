import { get } from "./request";

//get方法，访问后台地址的/hello接口
//sayHello其实什么都没做，只是调用了request里面的方法：get
export const sayHello = ()=>{
  return get('/hello');
}