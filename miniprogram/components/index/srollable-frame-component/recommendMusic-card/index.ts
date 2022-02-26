// components/index/srollable-frame-component/recommandMusic-card/index.ts
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
    onTab(){
      wx.navigateTo({url:`/pages/play-list/detail?id=${this.properties.item.id}`})
    }
  }

})
