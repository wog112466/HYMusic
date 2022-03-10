// pages/home-video/index.js
import { getTopMV } from '../../service/api_video.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopMVData(0)
  },

  //封装网络请求的方法
  getTopMVData: async function(offset){
    //判断是否可以请求
    if(!this.data.hasMore) return

    //展示加载动画
    wx.showNavigationBarLoading()

    //真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMvs

    //判断是上拉加载还是上拉刷新
    if(offset === 0){
      newData = res.data
    }else {
      newData = newData.concat(res.data)
    }

    //设置数据
    this.setData({ topMvs: newData })
    this.setData({hasMore: res.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0){
      wx.stopPullDownRefresh()
    }
  },

  //封装事件处理的方法
  handleVideoItemClick: function(event) {
    //获取id
    const id = event.currentTarget.dataset.item.id
    console.log(id);

    //页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`
    })
  },

  //其他生命周期的回调函数
  onPullDownRefresh: function() {
    this.getTopMVData(0)
  },

  //上拉加载更多
  onReachBottom: async function() {
    this.getTopMVData(this.data.topMvs.length)
  }
})