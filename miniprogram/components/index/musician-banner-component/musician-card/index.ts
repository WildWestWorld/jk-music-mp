import { sayHello } from "../../../../api/hello"

// components/index/musician-banner-component/musician-card/index.ts
Component({
  /**
   * 组件的属性列表
   */  
  options:{
    styleIsolation:'isolated'
  },
  properties: {
    item:{
      type:Object,
      value:()=>{null}
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 此外就是不转化成click事件也会因为BindTab的冒泡属性，被父组件捕获
   //就是把tab事件改为click事件，并且传入参数
    //this.triggerEvent 小程序的触发时间  前面那个是触发的类型 
    //后面这个是传进来参数 
    onTab() {
     this.triggerEvent('click',this.properties.item);
     this.hi();
    },

    hi(){
      //因为返回回来的是promise对象所以可以.then
      sayHello().then(resData =>{
     
        //微信中的赋值
        this.setData!({
        message : resData
       })
       
        return console.log(resData)
      })
    },
  }
})
