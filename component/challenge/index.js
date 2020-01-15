//index.js
//获取应用实例 

import millionAnswer from '../../ownApi/millionAnswer'

const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import {apiFuhuo ,apiGetUser} from '../../ownApi/index.js'

Page({
  data: {
    baseUrl: baseUrl,
    userData:null,
    showRule:false,
    config:{},
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    }
  },
  //事件处理函数
  onLoad: function () {
    

    millionAnswer.reportEvent(1,'xb00000100010001',{
      page_id:'component/challenge/index',
      desc:'开始挑战页页面展现'
    })

  },
 
  onShow(){

    this.getUser()

    millionAnswer.reportEvent(1,'xb00000100010001',{
      page_id:'component/challenge/index',
      desc:'开始挑战页页面展现'
    })
   
    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)

  },
  
  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100010001',{
      page_id:'component/challenge/index',
      desc:'开始挑战页页面离开'
    })

    // "requiredBackgroundModes": ["audio"],
  },

  onHide(){
    millionAnswer.globalData.bgm.pause()  //暂停背景音乐
  },

  getUser(){ //获取用户答题信息
    apiGetUser().then(res => {
      this.setData({
        userData: res.data,
        config: millionAnswer.globalData.config
      })
    })
  },

  startTest(){   //开始挑战
  let status = this.data.userData.status

  if(status == 3){
    wx.showToast({
      title: '已全部答完',
    })
  }else{
    millionAnswer.createEffect('click')
    wx.reLaunch({
      url: '../questions/index',
    })
  }
  }, 
  fuhuo(){  //复活

    millionAnswer.createEffect('click')
    apiFuhuo().then(res => {
      //  有复活卡，是否需要复活，0为复活成功  - 1是不需要复活
        if(res.error == -1){
          wx.showToast({
            title: '无需续命',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '续命成功',
            icon: 'success'
          })
          let num = parseInt(this.data.userData.fu_num)
          num --
          this.setData({
            ['userData.status']: 1,
            ['userData.fu_num']:num
          })

          millionAnswer.refreshUserdata()
          setTimeout(()=>{
            wx.reLaunch({
              url: '../questions/index',
            })
          },500)
          } 
        })
    
    
    
  },
  seeRule(){   //查看规则
    millionAnswer.createEffect('click')

    this.setData({
      showRule:true
    })
  },
  closeRule(){  //关闭规则
    millionAnswer.createEffect('click')

    this.setData({
      showRule: false
    })
  },
  goRank(){   //前往排行榜
    millionAnswer.createEffect('click')
    wx.navigateTo({
      url: '../rank/index',
    })
  },

  //分享，邀请好友
  onShareAppMessage(res) {
    return {
      title: millionAnswer.globalData.share.home_share_txt,   //标题
      path: '/component/firstpage/index?id=' + this.data.userData.id,  //分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
    }
  },
})
