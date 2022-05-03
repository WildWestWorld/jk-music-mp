Component({
  data: {
    selected: 0,
    "color": "#7A869A",
    "selectedColor": "#7A869A",
    //要是用该文件需要在app.json中"tabBar"里面 写入custom:ture
    list: [  
          {
      "iconPath": "../images/home.png",
      "selectedIconPath": "../images/explore-active.png",
      "pagePath": "../index/index",
      "text": "首页"
    },
    {
      "iconPath": "../images/search.png",
      "selectedIconPath": "../images/search-active.png",
      "pagePath": "../search/index",
      "text": "搜索"
    },
    {
      "iconPath": "../images/lib.png",
      "selectedIconPath": "../images/lib-active.png",
      "pagePath": "../lib/index",
      "text": "音乐库"
    }
  ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      console.log(this.data.selected)
      this.setData({
        selected: data.index
      })
      console.log(this.data.selected)
    }
  }
})