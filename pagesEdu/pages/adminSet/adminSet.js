// pagesEdu/pages/adminSet/adminSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  changeAdmin(e){
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '转让管理员后，将不能...,您确定要转让吗？',
      success(res){
        if(res.confirm){
          wx.navigateTo({
            url: `../../pages/chooseManager/chooseManager?action=changeAdmin&id=${id}`,
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})