// component/myprize/index.js
import millionAnswer from '../../ownApi/millionAnswer'
//index.js
//获取应用实例
const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import { apiGetGift, apiGetConfig, apiShenqing,apiGetUser} from '../../ownApi/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    userData:{},
    giftList:[],
    showDetail:false,  //出现券详情
    detail: {}, //券详情
    config: {},
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    lvtext:['黑铁','青铜','白银','黄金','钻石','星耀','王者'],
  },

  getConfig() {
    let name = 'button7,button8,button9,button10'
    apiGetConfig({ name }).then(res => {
      console.log(res)
      this.setData({
        config: res.data
      })
    })
  },


  getGift(){  //获取礼品列表
    apiGetGift().then(res => {
      // console.log(res)
      this.setData({
        giftList:res.data.list
      })
    })
  },

  checkDetail(e){   //点击券查看详情和兑换
    let id = e.currentTarget.dataset.id
    let item = this.data.giftList.find(el => el.id == id)
    this.setData({
      detail:item,
      showDetail:true
    })
  },

  useScore(){   //积分兑换礼品
    let id = this.data.detail.id
    apiScore({id}).then(res =>{
      if(res.error == 0){
        wx.showToast({
          title: '兑换成功',
        })
        millionAnswer.refreshUserdata()
        this.setData({
          showDetail:false
        })
      }else{
        wx.showToast({
          title: res.info,
          icon:'none'
        })
      }
    })
  },

  registerVip(e) {  //注册会员
    millionAnswer.createEffect('click')

    if(e.detail.iv){  //同意授权
      let { iv, encryptedData } = e.detail

      
      if(parseInt(this.data.userData.quantity) < parseInt(this.data.detail.integral)){
        this.remind()
        return
      }

      // console.log('授权成为会员')
      
      if(this.data.userData.is_vip == 1){  //是否是会员 ，1 是 ,2 不是
        this.useScore()
      }else{
        millionAnswer.getPhone({ iv, encryptedData })
        .then(result => {
          let openId = this.data.userData.openid
          let phone = result.data.phoneNumber
          let params = { iv, encryptedData , openId,phone}
          millionAnswer.becomeVip(params)
          .then(res => {
            millionAnswer.refreshUserdata()
    
            let params = {}
            params.user_id = res.userId
            params.phone = res.phone ? res.phone : ''
    
            apiShenqing(params)   //申请会员后请求记录
            wx.switchTab({
              url: '/pages/index/index?channel=300486',
            })
    
          })
        })
      }

    }else{  //拒绝授权
      console.log('拒绝授权')
      // if(this.data.userData.quantity < this.data.detail.integral){
      //   this.remind()
      // }
    }
    
  },

  cancel(){  //取消
    this.setData({
      showDetail: false
    })
  },
  goMoka(){
    wx.switchTab({
      url: '/pages/index/index?channelNo=null&activityId=null&channel=300440',
    })
    millionAnswer.createEffect('click')
  },
  goJiayou(){
    wx.switchTab({
      url: '/pages/index/index?channelNo=null&activityId=null&channel=300441',
    })
    millionAnswer.createEffect('click')
  },
  goChoujiang(){
    wx.navigateTo({
      url: '../lottery/index',
    })
    millionAnswer.createEffect('click')
  },

  remind(){   // 提示油量不足
    wx.showToast({
      title:'油量不足请继续答题',
      icon:'none'
    })
  },

  goMyprize() {   //前往我的奖品
    wx.navigateTo({
      url: '../myprize/index',
    })
    millionAnswer.createEffect('click')
  },

  getUser(){
    apiGetUser().then(res => {
      this.setData({
        userData:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getUser()

    this.getConfig()

    this.getGift()
    millionAnswer.reportEvent(1,'xb00000100090009',{
      page_id:'component/shop/index',
      desc:'积分商城页页面展现'
    })

  },

  onShow(){
    millionAnswer.reportEvent(1,'xb00000100090009',{
      page_id:'component/shop/index',
      desc:'积分商城页页面展现'
    })
    // if(millionAnswer.globalData.bgm.paused){   //是否在播放 true 已经暂停
    //   millionAnswer.globalData.bgm.play()  //播放背景音乐
    // }
    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100090009',{
      page_id:'component/shop/index',
      desc:'积分商城页页面离开'
    })
  },

  onHide(){
    millionAnswer.globalData.bgm.pause()  //暂停背景音乐
  },

  /**
   * 用户点击右上角分享
   */
  //分享，邀请好友
  onShareAppMessage(res) {
    return {
      title: millionAnswer.globalData.share.home_share_txt,   //标题
      path: '/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
    }
  },
})