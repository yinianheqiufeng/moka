// component/myprize/index.js
import millionAnswer from '../../ownApi/millionAnswer'
//index.js
//获取应用实例
const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import { apiUserExchange, apiPassrecord, apiGetRecord ,apiAddAddress} from '../../ownApi/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    type:1,
    duihuanjilu:[
     
    ],
    tongguanjiangli:[
     
    ],
    zhongjiangjilu:[
     
    ],
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    prize:{},  //奖品
    form: {  //收货信息
      name:'',
      phone:'',
      address:''
    } , 
    showAddress:false ,  //填写地址弹窗
    showDetail:false,  //出现券详情
    detail: {}, //券详情
    isClose:'',  //收起展开优惠券
  },

  checkDetail(e){   //点击券查看详情和兑换
    let id = e.currentTarget.dataset.id
    let item = {}
    
    if(this.data.type == 1){
      item = this.data.duihuanjilu.find(el => el.id == id)
      item.name = item.gift_name
    }else if(this.data.type == 2){
      item = this.data.tongguanjiangli.find(el => el.id == id)
      item.name = item.gift_name
    }else if(this.data.type == 3){
      
      item = this.data.zhongjiangjilu.find(el => el.id == id)
      item.name = item.prize
      item.content = item.config_prize.content
     
    } 
    this.setData({
      detail:item,
      showDetail:true
    })
  },

  switchType(e){   //切换奖品
    millionAnswer.createEffect('click')
    let type = e.currentTarget.dataset.type
    this.setData({
      type
    })
    // console.log(this.data.zhongjiangjilu)
  },

  cancel(){  //取消
    this.setData({
      showDetail: false
    })
  },

  shouqi(e){  //展开收起券
    let id = e.currentTarget.dataset.id
    if(id == this.data.isClose){
      this.setData({
        isClose:''
      })
    }else{
      this.setData({
        isClose:id
      })
    }
    
  },

  getPrize(){  //获取兑换记录
    apiUserExchange().then(res => {
      this.setData({
        duihuanjilu:res.data.list,
      })
    })
  },
  getPrize2() {  //获取通关奖励
    apiPassrecord().then(res => {
      this.setData({
        tongguanjiangli: res.data.list,
      })
    })
  },
  getPrize3(){  //获取抽奖记录
    let params = {
      pagenum:1,
      pageSize:100,
      type:1
    }
    apiGetRecord(params).then(res => {
      // console.log(res)
      this.setData({
        zhongjiangjilu:res.data.list,
        // zhongjiangjiangpin:res.data.list,
      })
    })
  },

  goMoka(){
    millionAnswer.createEffect('click')
    wx.navigateTo({
      url: '/pages/index/index?channelNo=null&activityId=null&channel=300440',
    })
  },
  goJiayou(){
    millionAnswer.createEffect('click')
    wx.navigateTo({
      url: '/pages/index/index?channelNo=null&activityId=null&channel=300441',
    })
    
  },

  goZhongjiang(e){   //跳转中奖记录
    millionAnswer.createEffect('click')


    if(this.data.type == 3){
      
      let types = e.currentTarget.dataset.types
      let prize = e.currentTarget.dataset.prize


      if(types == 1){  //MOKA券
        wx.navigateTo({
          url: '/pages/index/index?channelNo=null&activityId=null&channel=300440',
        })
      }else if(types == 2){  //实物

        let form = {  //收货信息
          name:prize.fill_name,
          phone:prize.fill_phone,
          address:prize.fill_address
        } 

        this.setData({
          prize,
          form
        })
          this.setData({
            showAddress:true
          })
      }else if(types == 3){  //外部券
        wx.navigateTo({
          url: `../h5/index?url=${prize.url}`,
        })
      }else if(types == 4) {  //券码
        this.setData({
          detail:item,
          showDetail:true
        })
      }
    }else{
      this.goMoka()
    }
  },

  tijiao(){  //提交收货信息

    millionAnswer.createEffect('click')
   
    let form = this.data.form

    if(form.name == ''){
      wx.showToast({
        title: '请填写名字！',
        icon: 'none'
      })
      return
    }
    if(!this.isphone(form.phone)){
      wx.showToast({
        title: '请填写有效的号码！',
        icon: 'none'
      })
      return
    }
    if(form.address == ''){
      wx.showToast({
        title: '请填写地址！',
        icon: 'none'
      })
      return
    }

    let params = {}
    params.id = this.data.prize.id   //id是什么
    params.fill_name = form.name
    params.fill_phone = form.phone
    params.fill_address = form.address

    apiAddAddress(params).then(res => {
      
        if(res.error == 0){

          wx.showToast({
            title:'提交成功',
            success:()=>{
              this.setData({
                showAddress:false   //注意
              })
            }
          })
        }
    })

  },

  inputName(e){  //同步名字 改变对象里面的值
    this.setData({
      ['form.name']: e.detail.value
    })
  },
  inputPhone(e){
    this.setData({
      ['form.phone']:e.detail.value
    })
  },
  inputAddress(e) {
    this.setData({
      ['form.address']: e.detail.value
    })
  },
  closeAddress() {  //关闭地址填写
    millionAnswer.createEffect('click')
    this.setData({
      showAddress: false
    })
  },

  // 判断合法的手机号
  isphone(phone){
      var phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      var ok = false;
    if (phoneReg.test(phone)) {
      ok = true
    }
    return ok
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getPrize()
    this.getPrize2()
    this.getPrize3()

    millionAnswer.reportEvent(1,'xb00000100050005',{
      page_id:'component/myprize/index',
      desc:'我的奖品页页面展现'
    })

  },
  onShow(){
    millionAnswer.reportEvent(1,'xb00000100050005',{
      page_id:'component/myprize/index',
      desc:'我的奖品页页面展现'
    })
    // if(millionAnswer.globalData.bgm.paused){   //是否在播放 true 已经暂停
    //   millionAnswer.globalData.bgm.play()  //播放背景音乐
    // }
    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)

    millionAnswer.createEffect('cj',true)  //暂停抽奖音乐
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100050005',{
      page_id:'component/myprize/index',
      desc:'我的奖品页页面离开'
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