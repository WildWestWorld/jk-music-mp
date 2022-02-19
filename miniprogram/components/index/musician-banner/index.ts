// components/index/musician-banner/index.ts
Component({
  /**
   * 组件的属性列表
   */
  options:{
    styleIsolation:'isolated'
  },
  properties: {
    title:{
      type:String,
      value:''
    },
    list:{
      type:Array,
      value:[],
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
    //将捕获到的click时间打印出来
    onClick(e){
      console.log(e)
    }
  }
})
