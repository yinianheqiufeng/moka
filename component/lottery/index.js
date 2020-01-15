
import millionAnswer from '../../ownApi/millionAnswer'

let timer;
let cjChange = 0; //抽奖过程KEY
const app = getApp()
const baseUrl = millionAnswer.globalData.baseUrl

import { apiGetprize, apiChoujiang, apiAddAddress , apiShenqing,apiGetConfig} from '../../ownApi/index.js'

Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    prizeList: [
      // { id: '001', index: 1, imgsrc: `${baseUrl}MiniProgram/images/choujiang/1.png`},
      // { id: '002', index: 2, imgsrc: `${baseUrl}MiniProgram/images/choujiang/2.png`},
      // { id: '003', index: 3, imgsrc: `${baseUrl}MiniProgram/images/choujiang/3.png`},
      // { id: '004', index: 4, imgsrc: `${baseUrl}MiniProgram/images/choujiang/4.png`},
      // { id: '005', index: 5, imgsrc: `${baseUrl}MiniProgram/images/choujiang/5.png`},
      // { id: '006', index: 6, imgsrc: `${baseUrl}MiniProgram/images/choujiang/6.png`},
      // { id: '007', index: 7, imgsrc: `${baseUrl}MiniProgram/images/choujiang/7.png`},
      // { id: '008', index: 8, imgsrc: `${baseUrl}MiniProgram/images/choujiang/8.png`},
    ],

    cjChange: null, //抽奖过程KEY
    prizeResult: null, //抽奖结果KEY
    prize:{},  //奖品信息
    disabled: false, //抽奖按钮状态
    showRule: false,
    shwDraw:false , //奖品弹窗
    showAddress:false ,  //填写地址弹窗
     showWei:false,
     showThanks:false,
    form: {  //收货信息
      name:'',
      phone:'',
      address:''
    } ,  
    userData:{},
    showBtn:true,  //隐藏授权的按钮  true
    config: {},
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    cbgm:null,  //抽奖背景音乐
  },

  getConfig(){
    let name = 'draw_rule,haoyou'
    apiGetConfig({name}).then(res => {
      console.log(res)
      this.setData({
        config:res.data
      })
    })
  },

  registerVip(e){  //注册会员 立即抽奖
    millionAnswer.createEffect('click')

    if(e.detail.iv){  //同意授权
      let { iv, encryptedData } = e.detail
      
      if(this.data.userData.is_vip == 1){  //是否是会员 ，1 是 ,2 不是
        this.cj()  
        this.setData({
          showBtn:false
        })
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
              url: '/pages/index/index?channel=300487',
            })
          })
        })
      }

    }else{  //拒绝授权
      console.log('拒绝授权')
    }
    
  },

  getPrize() {  //获取奖品列表
    apiGetprize().then(res => {
      let prizeList = res.data.list
      this.setData({
        prizeList,
      })

    })
  },

  //抽奖操作
  cj() {
   
    let This = this;

    if (this.data.disabled) {
      return;
    } else {
      this.setData({
        disabled: true,
      })
    }

    apiChoujiang().then(data => {

      if(data.error < 0){   //油量不足
        wx.showToast({
          title: data.info,
          icon:'none'
        })
        this.setData({
          disabled:false
        })
        return
      }
      millionAnswer.globalData.bgm.pause()
      this.data.cbgm = millionAnswer.createEffect('cj')  //抽奖背景音效
      millionAnswer.createEffect('zhuan')  //转动音效

      clearInterval(timer);
      timer = setInterval(This.changePrize, 80);

      let item = this.data.prizeList.find(el => el.id == data.data.prize_id)
      let position = item.position   
      
      // test start
      let res = {
        stutus: 1,
        prizeResult: position,
      }
      if (res.stutus == 1) {
        setTimeout(function () {
          clearInterval(timer);
          timer = setInterval(This.changePrize, 160);
          setTimeout(function () {
            clearInterval(timer);
            timer = setInterval(This.changePrize, 300);

            setTimeout(function () {
              This.setData({
                prizeResult:res.prizeResult,
                prize : data.data,
              });
            }, 1000)
          }, 1000)
        }, 2000)
      }
    // test end

    })   
    
    millionAnswer.reportEvent(3,'xb00000100040004',{
      page_id:'component/lottery/index',
      desc:'用户触发抽奖事件'
    })

  },

  //抽奖过程奖品切换
  changePrize() {
    cjChange++;
    cjChange = cjChange > 8 ? 1 : cjChange;

    let This = this;
    This.setData({
      cjChange: cjChange
    });

    if (This.data.prizeResult == cjChange) {   //转动结束
      clearInterval(timer);

      console.log('获得奖品：' + This.data.prize.prize)

      This.setData({
        // cjChange: null, //抽奖过程KEY
        disabled: false,  //抽奖按钮状态
        prizeResult: null, //抽奖结果KEY
      });

      millionAnswer.createEffect('zhuan',true)  //暂停抽奖音乐

      // 5再抽一次，6谢谢
      if (this.data.prize.types == 5  ){
        This.setData({
          showWei: true
        })
        millionAnswer.globalData.stopAudio = true
        millionAnswer.createEffect('weizhong')
      }else if (this.data.prize.types == 6){
        This.setData({
          showThanks: true
        })
        millionAnswer.globalData.stopAudio = true
        millionAnswer.createEffect('weizhong')
      } else if (this.data.prize.types == 2){   //实物
        setTimeout(() => {
          This.setData({
            showAddress: true
          })
        }, 1500)
        millionAnswer.globalData.stopAudio = true
        millionAnswer.createEffect('zhong')
      }else{                                 //其他券
        millionAnswer.globalData.stopAudio = true
        millionAnswer.createEffect('zhong')
        setTimeout(() => {
          This.setData({
            showDraw: true
          })
        }, 1500)
      }

      
    }
  },
  shouxiajiangli(){   //收下奖励
    let prize = this.data.prize

    millionAnswer.createEffect('get')

    if(prize.types == 1){
      let userId = millionAnswer.globalData.userData.user_id
      let couponCode = this.prize.returndata
      millionAnswer.getCoupon({userId,couponCode})
    }

    this.setData({
      showDraw:false
    }) 
  },

  goMyprize() {   //前往我的奖品
    millionAnswer.createEffect('click')

      wx.navigateTo({
        url: '../myprize/index',
      })
  },


  goAnswer() {   //答题赢汽油
  
  millionAnswer.createEffect('click')

    wx.redirectTo({
        url: '../questions/index',
    })
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
            title:'填写成功',
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
  // 判断合法的手机号
  isphone(phone){
      var phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      var ok = false;
    if (phoneReg.test(phone)) {
      ok = true
    }
    return ok
  },
  seeRule() {   //查看规则
    millionAnswer.createEffect('click')
    this.setData({
      showRule: true
    })
  },
  closeRule() {  //关闭规则
    millionAnswer.createEffect('click')
    this.setData({
      showRule: false
    })
  },
  closeDraw() {  //关闭规则
    millionAnswer.createEffect('click')
    this.setData({
      showDraw: false
    })
  },
  closeAddress() {  //关闭地址填写
    millionAnswer.createEffect('click')
    this.setData({
      showAddress: false
    })
  },
  closenoDraw(){
      millionAnswer.createEffect('click')
      this.setData({
        showWei: false
      })
  },
  closeThanks(){
    millionAnswer.createEffect('click')
    this.setData({
      showThanks: false
    })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPrize()
    this.getConfig()

    this.setData({
      userData:millionAnswer.globalData.userData,
      config: millionAnswer.globalData.config
    })

    // console.log(this.data.config)

    millionAnswer.reportEvent(1,'xb00000100040004',{
      page_id:'component/lottery/index',
      desc:'抽奖页面页面展现'
    })
  },
  onShow(){
    millionAnswer.reportEvent(1,'xb00000100040004',{
      page_id:'component/lottery/index',
      desc:'抽奖页面页面展现'
    })

    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
      
    },200)
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100040004',{
      page_id:'component/lottery/index',
      desc:'抽奖页面页面离开'
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
    return {
      title: millionAnswer.globalData.share.home_share_txt,   //标题
      path: '/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
    }
  },
})
