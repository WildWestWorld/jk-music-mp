// components/index/srollable-frame/index.ts
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
      value:'默认列表',
    },
    moreLabel:{
     type:String,
     value:'更多' 
    },
    // 用于隐藏more标签的布尔值
    hideMoreLabel:{
      type:Boolean,
      value:"true"
    },
    itemWidth:{
      type:Number,
      value:290,
    },
    itemCount:{
      type:Number,
      value:6,
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

  }
})
