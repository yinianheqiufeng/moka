//index.js
//获取应用实例
import millionAnswer from '../../ownApi/millionAnswer'
const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import { apiGetRanking } from '../../ownApi/index.js'

Page({ 
  data: {
    baseUrl: baseUrl,
    friendRank:[],  //好友排名
    allRank:[],  //全网排名
    myRank:{},  //我的排名
    rankList:[]  ,
    rankType: 1,  //1 好友排名, 2 全网排名
    teshuquantity:0,
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    }
  },
  //事件处理函数
  onLoad: function () {
    
    this.getRank()
    millionAnswer.reportEvent(1,'xb00000100070007',{
      page_id:'component/rank/index',
      desc:'排行榜页页面展现'
    })
  },

  onShow(){
    millionAnswer.reportEvent(1,'xb00000100070007',{
      page_id:'component/rank/index',
      desc:'排行榜页页面展现'
    })
    // if(millionAnswer.globalData.bgm.paused){   //是否在播放 true 已经暂停
    //   millionAnswer.globalData.bgm.play()  //播放背景音乐
    // }
    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100070007',{
      page_id:'component/rank/index',
      desc:'排行榜页页面离开'
    })
  },
  onHide(){
    millionAnswer.globalData.bgm.pause()  //暂停背景音乐
  },

  getRank(){  //获取排行
    apiGetRanking().then(res => {
      console.log(res)
   
      let text = this.filterYtext(res.data.user.quantity)

      res.data.haoyoupai.map(el => {
        el.ytext = this.filterYtext(el.quantity)
      })
      res.data.allpai.map(el => {
        el.ytext = this.filterYtext(el.quantity)
      })

      this.setData({
        teshuquantity:text,
        friendRank:res.data.haoyoupai,
        allRank:res.data.allpai,
        myRank:res.data.user,
        rankList:res.data.haoyoupai
      })
    })
  },

  filterYtext(num){   //转换油量
    let you = parseInt(num)
    let text = ''
    if(you > 999){
      text = Math.floor(you / 1000) + 'L'
    }else{
      text = you + 'ml'
    }

    return text
  },

  switchRank(e){   //切换排名
    

    let type = e.currentTarget.dataset.type
    this.setData({
      rankType:type
    })

    if(type == 1){
      let haoyou = this.data.friendRank
      this.setData({
        rankList:haoyou
      })
    }else{
      let all = this.data.allRank
      this.setData({
        rankList: all
      })
    }

    millionAnswer.createEffect('click')
  },
  //分享，邀请好友
  onShareAppMessage(res) {
    return {
      title: millionAnswer.globalData.share.home_share_txt,   //标题
      path: '/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
    }
  },
})
