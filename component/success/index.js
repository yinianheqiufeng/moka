// component/suceess/index.js
import Poster from '../../miniprogram_dist/poster/poster';
import millionAnswer from '../../ownApi/millionAnswer'

const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import {apiSubSubject,apiGetRanking ,apiGetUser, apiGetExchange ,apiShenqing} from '../../ownApi/index.js'
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    userData: {},
    posterConfig:{},
    poster:'',
    gift:null,
    hasGift:false,
    isContinue:true,
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    lvtext:['黑铁','青铜','白银','黄金','钻石','星耀','王者'],
  },

  onPosterSuccess(e) {
    
    wx.hideLoading()  //生成成功关闭loading

    const { detail } = e;
    this.setData({
      poster:detail
    })
    
  },
  onPosterFail(err) {
    console.error(err);
  },

  showPoster(){  //预览海报长按保存
    wx.previewImage({
      current: this.data.poster,
      urls: [this.data.poster]
    })
  },

  checContinue(){   //检测是否答完所有题
    apiGetUser().then(res => {
      if(res.data.status == 3){
        this.setData({
          isContinue:false
        })
      }
    })
  },

  onCreatePoster() {  //生成海报
    this.setData({ posterConfig: posterConfig }, () => {
      Poster.create(true);    // 入参：true为抹掉重新生成
    });
  },

  getHaibao(){   //提交答案绑定用户的排名，没关所获 和 设置海报
    
    millionAnswer.buildCode().then(data => {  //先生成小程序二维码，再请求排名数据
      let key = this.data.gift.key
      let answer = this.data.gift.answer
      apiSubSubject({key,user_answer:answer}).then(res => {

        if(res.error == 2){

          let user = res.data
          this.setData({
            userData:res.data
          })
    
          // console.log(user.pic)
    
          let posterConfig = {
            width: 662,
            height: 1003,
            debug: false,
            pixelRatio: 2,
            blocks: [
    
            ],
            texts: [
              {
                x: 320,
                y: 380,
                width: 200,
                baseLine: 'middle',
                text: `${user.nickname}`,
                textAlign:'center',
                fontSize: 32,
                color: '#ffffff',
              },
              {
                x: 130,
                y: 450,
                baseLine: 'middle',
                text: `总排名:`,
                textAlign:'center',
                fontSize: 28,
                color: '#ffffff',
              },
              {
                x: 190,
                y: 450,
                baseLine: 'middle',
                text: `${user.allpai}名`,
                fontSize: 30,
                color: '#ffd924',
              },
              {
                x: 460,
                y: 450,
                baseLine: 'middle',
                text: `好友排名:`,
                textAlign: 'center',
                fontSize: 28,
                color: '#ffffff',
              },
              {
                x: 530,
                y: 450,
                baseLine: 'middle',
                text: `${user.haoyoupai}名`,
                fontSize: 30,
                color: '#ffd924',
              },
              {
                x: 228,
                y: 745,
                baseLine: 'middle',
                text: `${user.cos}ml`,
                fontSize:100,
                color: '#ffd924',
                textAlign: 'center',
                fontWeight:'bold'
              },
              {
                x: 170,
                y: 630,
                baseLine: 'middle',
                text: `获得汽油`,
                fontSize: 45,
                color: '#fff',
                textAlign: 'center',
              },
              {
                x: 280,
                y: 200,
                fontSize: 26,
                color: '#a90410',
                text: `${this.data.lvtext[user.level - 1]}LV${user.lvy}`,
                zIndex:10
              },
            ],
            images: [
              {
                width: 662,
                height: 1003,
                x: 0,
                y: 0,
                url: `${baseUrl}/MiniProgram/images/poster/window3.png`,
              },
              {
                width: 150,
                height: 150,
                x: 250,
                y: 200,
                borderRadius:150,
                borderColor:'#fff',
                borderWidth:4,
                url: `${user.pic}`,
              },
              {
                width: 80 * 1.4,
                height: 43 * 1.4,
                x: 275,
                y: 160,
                url: `${baseUrl}/MiniProgram/images/poslv.png`,
              },
              // {   //小程序二维码 测试测试
              //   width: 120,
              //   height: 120,
                // x: 180,
                // y: 845,
              //   url: `${data.data.url}`,
              // },
    
            ]
    
          }
    
          this.setData({ posterConfig: posterConfig }, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成
          });
        }
     
      })
    })   
   
  },

  

  goAnswer() {   //继续答题
    millionAnswer.createEffect('click')

    millionAnswer.reportEvent(3,'xb00000100050010',{
      desc:`用过进入第${millionAnswer.globalData.userData.reached}关`,
      name:millionAnswer.globalData.userData.reached
    })

    wx.redirectTo({
      url: '../questions/index',
    })
  },

  registerVip(e){  //注册会员 立即领取优惠券
    millionAnswer.createEffect('click')

    if(e.detail.iv){  //同意授权

      let { iv, encryptedData } = e.detail

      if(this.data.userData.is_vip == 1){  //是否是会员 ，1 是 ,2 不是
        this.lingqu()  //券领取记录

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
              url: '/pages/index/index?channel=300485',
            })

            // this.lingqu()  //券领取记录
    
          })
        })
        
       
      }

    }else{  //拒绝授权
      this.setData({
        hasGift:false
      })
    }
    
  },

  lingqu(){ //券领取记录
    apiGetExchange({gift_id:this.data.gift.gift_id})   
        .then(res => {
          if(res.error < 0){
            wx.showToast({
              title: '领取成功',
            })
          }else{
            wx.showToast({
              title: res.info,
              icon:'none'
            })
          }

          this.setData({
            hasGift:false
          })
         
        })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '海报生成中',
    })

    this.checContinue()

    millionAnswer.refreshUserdata()  //更新用户信息

    millionAnswer.reportEvent(1,'xb00000100100010',{
      page_id:'component/success/index',
      desc:'每次闯关成功页页面展现'
    })

    if(options.gift){
      let gift = JSON.parse(options.gift)
      this.setData({
        gift:gift,
      }) 

      if(gift.gift_id){
          this.setData({
            hasGift:true,
          })
        }
        this.getHaibao()
    } 

    //测试 开始
    // let posterConfig = {
    //   width: 662,
    //   height: 1003,
    //   debug: false,
    //   pixelRatio: 2,
    //   blocks: [

    //   ],
    //   texts: [
    //     {
    //       x: 320,
    //       y: 380,
    //       width: 200,
    //       baseLine: 'middle',
    //       text: `123`,
    //       textAlign:'center',
    //       fontSize: 32,
    //       color: '#ffffff',
    //     },
    //     {
    //       x: 130,
    //       y: 450,
    //       baseLine: 'middle',
    //       text: `总排名:`,
    //       textAlign:'center',
    //       fontSize: 28,
    //       color: '#ffffff',
    //     },
    //     {
    //       x: 190,
    //       y: 450,
    //       baseLine: 'middle',
    //       text: `1名`,
    //       fontSize: 30,
    //       color: '#ffd924',
    //     },
    //     {
    //       x: 460,
    //       y: 450,
    //       baseLine: 'middle',
    //       text: `好友排名:`,
    //       textAlign: 'center',
    //       fontSize: 28,
    //       color: '#ffffff',
    //     },
    //     {
    //       x: 530,
    //       y: 450,
    //       baseLine: 'middle',
    //       text: `1名`,
    //       fontSize: 30,
    //       color: '#ffd924',
    //     },
    //     {
    //       x: 228,
    //       y: 745,
    //       baseLine: 'middle',
    //       text: `100ml`,
    //       fontSize: 100,
    //       color: '#ffd924',
    //       textAlign: 'center',
    //       fontWeight:'bold'
    //     },
    //     {
    //       x: 170,
    //       y: 630,
    //       baseLine: 'middle',
    //       text: `获得汽油`,
    //       fontSize: 45,
    //       color: '#fff',
    //       textAlign: 'center',
    //     },
    //     {
    //       x: 280,
    //       y: 200,
    //       fontSize: 26,
    //       color: '#a90410',
    //       text: `青铜LV1`,
    //       zIndex:10
    //     },
    //   ],
    //   images: [
    //     {
    //       width: 662,
    //       height: 1003,
    //       x: 0,
    //       y: 0,
    //       url: `${baseUrl}/MiniProgram/images/poster/window3.png`,
    //     },
    //     {
    //       width: 150,
    //       height: 150,
    //       x: 250,
    //       y: 200,
    //       borderRadius:150,
    //       borderColor:'#fff',
    //       borderWidth:4,
    //       url: `${baseUrl}/MiniProgram/images/poster/widow2.png`,
    //     },
    //     {
    //       width: 80 * 1.4,
    //       height: 43 * 1.4,
    //       x: 275,
    //       y: 160,
    //       url: `${baseUrl}/MiniProgram/images/poslv.png`,
    //     },
    //     {   //小程序二维码 测试测试
    //       width: 120,
    //       height: 120,
    //       x: 180,
    //       y: 845,
    //       url: `${baseUrl}/MiniProgram/images/poslv.png`,
    //     },
    //     // {   //小程序二维码 测试测试
    //     //   width: 120,
    //     //   height: 120,
    //     //   x: 120,
    //     //   y: 735,
    //     //   url: `${data.data.url}`,
    //     // },

    //   ]

    // }
    // this.setData({ posterConfig: posterConfig }, () => {
    //   Poster.create(true);    // 入参：true为抹掉重新生成
    // });
    //测试 结束


  },

  onShow(){
    millionAnswer.reportEvent(1,'xb00000100100010',{
      page_id:'component/success/index',
      desc:'每次闯关成功页页面展现'
    })

    millionAnswer.createEffect('success')
    
    // if(millionAnswer.globalData.bgm.paused){   //是否在播放 true 已经暂停
    //   millionAnswer.globalData.bgm.play()  //播放背景音乐
    // }
    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)
    
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100100010',{
      page_id:'component/success/index',
      desc:'每次闯关成功页页面离开'
    })
    let pages = getCurrentPages(); 
    let l = pages.length; 
    let prev = pages[l - 2];
    prev.onLoad()
  },
  onHide(){
    millionAnswer.globalData.bgm.pause()  //暂停背景音乐
  },


  /**
   * 用户点击右上角分享
   */
  //分享，邀请好友
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      millionAnswer.createEffect('click')
      millionAnswer.reportEvent(3,'xb00000100090010',{ 
        desc:`复活邀请好友（分享）`,
      })
    }

    return {
      title: millionAnswer.globalData.share.home_share_txt,   //标题
      path: '/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
    }
  },
})