//index.js 
//获取应用实例 
import Poster from '../../miniprogram_dist/poster/poster';
import millionAnswer from '../../ownApi/millionAnswer'
const baseUrl = millionAnswer.globalData.baseUrl
 
import { apiGetSubject, apiGetConfig, apiSubSubject, apiFuhuo, apiGetUser ,apiShenqing ,apiGetExchange} from '../../ownApi/index'

Page({  
  data: {
    config:{},
    subject:{  //题目的信息
      title:'',
      option_group:[],
      answer:2,
      level: "1",   //级别,
      key:0
    },
    answer:null,   //用户选择的答案
    baseUrl: baseUrl,
    count:15,  //答题倒数,
    timeout:false,  //是否到时间
    slideIn:true,
    slideOut:false,
    liveCard:1,  //复活卡的数量
    helped:false,  //是否助力
    shared:false,  //是否分享过
    waitTime:3 * 60,
    waitText:'03:00',
    waitTimer:null,  //等地助力计时器
    fail:false,
    userData:{},
    userData2:{},
    configName: ['lv1_num' , 'lv2_num' ,'lv3_num','lv4_num','lv5_num','lv6_num','lv7_num','lv1_gasoline','lv2_gasoline','lv3_gasoline','lv4_gasoline','lv5_gasoline','lv6_gasoline','lv7_gasoline'],   //配置名
    total:0, //当前等级的总题数
    isFrist:true,  //第一次进
    ad:'', //banner广告
    getCardNum:1 ,  //得到复活卡的张数
    showCard:false ,  //显示获得的复活卡弹窗
    checkTimer:null,
    title: {
      "bg_color": "none",
      "color": "#000",
      "flag": 1,
      "name": ""
    },
    lvtext:['黑铁','青铜','白银','黄金','钻石','星耀','王者'],
    showSuccess:false,
    hasGift:false,
    gift:{},
    isJumpBanner:false,
    hasTimer:false,
    isPass:false,
    showPoster:false,
    poster:'',
  },

/*获取配置 
lv1_num 1级有多少题 
lv2_num 2级有多少题 
lv3_num 3级有多少题 
lv4_num 4级有多少题 
lv5_num 5级有多少题 
lv6_num 6级有多少题 
lv7_num 7级有多少题 
lv1_gasoline 1级可获得多少汽油 
lv2_gasoline 2级可获得多少汽油 
lv3_gasoline 3级可获得多少汽油 
lv4_gasoline 4级可获得多少汽油 
lv5_gasoline 5级可获得多少汽油  
lv6_gasoline 6级可获得多少汽油 
lv7_gasoline 7级可获得多少汽油 
get_gasoline 每邀请好友得油量 
get_num 最多邀请多少个好友  
home_theme 首页主题图 
answer_img 答题图 
activity_rules 活动规则 
fail_img 闯关失败弹窗
home_share_txt 分享文案（首页） 
fail_share_txt 分享文案（失败） 
home_share_img 分享图（首页） 
fail_share_img 分享图（失败） 
draw_mg 抽奖转盘页面
button1 我的油量按钮 
button2 我的奖品按钮 
button3 去答题按钮 
haoyou 抽奖耗油量 */
  getConfig() {   
    let name = ''
    apiGetConfig({name}).then(res => {
      // console.log(res)
      this.setData({
        config:res.data
      })

      this.setLv()
      
    })
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
  setLv(){  //设置等级和题目数
    let key = this.data.configName.find(el => el == `lv${this.data.userData.level}_num`)
    let total = this.data.config[key]
    this.setData({
      total
    })
  },
  getUser() {   //获取用户的答题信息
    apiGetUser().then(res => {
      // console.log(res)
      this.setData({
        userData: res.data
      })
      millionAnswer.globalData.userData = res.data

      this.getConfig()
    })
  },
  getSubject(){   //获取题目

    apiGetSubject().then(res => {
      // console.log(res)
      if(this.data.isFrist){   //第一次，只设置题目
        if(!res.data) return
        this.setData({
          subject: res.data,
          isFrist: false
        })
        let status = res.data.status
        if(status == 1){
          
        }else if(status == 2){
          // console.log('haha==getSub')
          this.setData({
            fail:true,
            timeout:true
          })
          
    // 失败弹窗
        }else if(status == 3){
          wx.showToast({
            title: '已全部答完',
          })
        }else if (status == 4) {

        }else{
          wx.showToast({
            title: '请重新登录',
            icon:'none'
          })
      }
      }else{                 //非第一次，切换题目的动画和设置下一题
        setTimeout(() => {  //切换题目的动画和设置下一题
          this.setData({
            slideOut: true,
            answer: null,
          })
        }, 500);
        setTimeout(() => {
          this.setData({
            slideOut: false,
            count: 15,
            subject: res.data,
          })
        }, 1000);

      }

      if(res.data.ad != ''){   //设置广告图
        this.setData({
          ad:res.data.ad
        })
      }else {
        this.setData({
          ad:null
        })
      }
     
    })
    // callback && callback()
  },
  choose(e){  //选择答案
    let answer = e.currentTarget.dataset.answer  //用户选的答案
    let key = e.currentTarget.dataset.key  //这道题的下标

            //  status 1 时 正答题，2为等待复活，3已答完，4(不是初次进来的正常答题)
    if(this.data.subject.status == 1 || this.data.subject.status == 4){
      apiSubSubject({key,user_answer:answer})    //提交答案
      .then(res => {
        // console.log(res)

        if (res.error == '0') {  //答对
              millionAnswer.createEffect('right')
              this.setData({
                answer,
                // subject:res.data
              })

              this.setData({answer})  //按钮答对状态

              setTimeout(() => {  //切换题目的动画和设置下一题
                this.setData({
                  slideOut: true,
                  answer: null,
                  subject: res.data,
                })
              }, 500);
              setTimeout(() => {
                this.setData({
                  slideOut: false,
                  count: 15,
                  
                })
              }, 1000);
      
            if(res.data.ad != ''){   //设置广告图
              this.setData({
                ad:res.data.ad
              })
            }else {
              this.setData({
                ad:null
              })
            }

              
        }else if(res.error == '2' || res.error == 4){   //过关
          this.setData({
            answer,
            // subject:res.data
          })
          millionAnswer.createEffect('right')
          millionAnswer.createEffect('success')

          millionAnswer.reportEvent(3,'xb00000100060010')

          if(res.data.gift && res.data.gift.id != ''){  //有额外券
            if(res.data.dat == 1){  //有券且升级的情况
              let gift = {}
              gift.gift_id = res.data.gift.id
              gift.img = res.data.gift.img
              gift.is_vip = res.data.gift.is_vip
              gift.key = key
              gift.answer = answer

              wx.setStorageSync('time',null)
              wx.setStorageSync('count',15)
              this.setData({
                isPass:true
              })

              let str = JSON.stringify(gift)

              setTimeout(() => {
                wx.redirectTo({
                  url: '../success/index?gift='+str,
                })
              },500)
              
            }else{      //有券没升级只是过关的情况
              this.setData({
                answer,
                hasGift:true,
                timeout:true,
                userData2:res.data,
                gift:res.data.gift
              })  
            }
            
          }else{

            if(res.data.dat == 1){  //没券升级的情况
              let gift = {}
              gift.key = key
              gift.answer = answer

              wx.setStorageSync('time',null)
              wx.setStorageSync('count',15)
              this.setData({
                isPass:true
              })

              let str = JSON.stringify(gift)
              setTimeout(() => {
                wx.redirectTo({
                  url: '../success/index?gift='+str,
                })
              },500)

            }else{   //没券没升级只是过关的情况
              this.setData({
                answer,
                showSuccess:true,
                timeout:true,
                userData2:res.data,
                gift:res.data.gift
              })  
            }
          }
         
        } else if(res.error == '3') {   //答错
          millionAnswer.createEffect('shibai')
          this.setData({
            timeout: true,
            fail:true
          })
        }else{  // 4 全部通关
          
        }
      })
    }else if(this.data.subject.status == 2){
      this.setData({
        fail:true,
        timeout:true
      })
    }else if(this.data.subject.status == 3){

    }

  },
  countDown(){  //答题倒计时

    if(this.data.hasTimer) return

    let timer = setInterval(() => {
      if(this.data.count > 0 && !this.data.timeout){
        let count = this.data.count 
        count -- 
        this.setData({
          count
        })
      }else if(this.data.timeout || this.data.count <= 0){
        clearInterval(timer)
        this.setData({   //暂停时间
          timeout:true,
          hasTimer:false
        })

        if(this.data.count == 0){  
          this.setData({ 
            fail: true
          })
          //时间用完默认提交错误答案
          let key = this.data.subject.key
          let answer = -1
          apiSubSubject({ key, user_answer: answer })    
            .then(res => {

            })
        }
      }
    },1000)

    this.setData({
      hasTimer:true
    })
  },
  revive(){  //复活
    if (this.data.userData.fu_num > 0){
      apiFuhuo().then(res => {
        wx.showToast({
          title: '复活成功',
        })
        let num = parseInt(this.data.userData.fu_num)
        num--
        this.setData({
          ['subject.status']: 1,
          ['userData.fu_num']: num
        })

        // console.log(this.data.userData.fu_num)
  
        // 失败弹窗关闭，继续答题
        this.setData({
          fail: false,
          timeout:false,
          count:15
        })
        this.countDown()
      })
      

    }else{
      wx.showToast({
        title: '没续命卡了',
        icon:'none'
      })
    }

    millionAnswer.createEffect('click')
  },
  waitHelp(){   //等待好友助力
    let timer = setInterval(() => {
      if (this.data.waitTime >= 0) {
        let minutes = Math.floor(this.data.waitTime / 60);
        let seconds = Math.floor(this.data.waitTime % 60) > 9 ? Math.floor(this.data.waitTime % 60) : `0${Math.floor(this.data.waitTime % 60)}`;
        let time = this.data.waitTime
        let msg = `0${minutes}:${seconds}`;
        --time;
        this.setData({
          waitTime:time,
          waitText:msg
        })
      } else {
        clearInterval(timer);
      }
    },1000)
  },
  giveup(){   //放弃
    millionAnswer.createEffect('click')
    wx.redirectTo({
      url: '../firstpage/index',
    })
  },
  clickBanner(){  //点击广告
    millionAnswer.createEffect('click')

    let ad = this.data.ad

    // this.setData({
    //   isJumpBanner:true
    // })
    // wx.navigateTo({
    //   url: `/component/h5/index?url=https://www.baidu.com`,
    // })
    // return

    if(ad.types == 1){   //H5
      wx.navigateTo({
        url: `../h5/index?url=${ad.url}`,
      })

      millionAnswer.reportEvent(3,'xb00000100080010',{
        // desc:`Banner 的点击事件 - 跳H5`,
        url:ad.url
      })

      this.setData({
        isJumpBanner:true
      })
    }else if(ad.types == 2){   //小程序

      millionAnswer.reportEvent(3,'xb00000100080010',{
        // desc:`Banner 的点击事件 - 跳小程序`,
        url:ad.appidurl,
        appid:ad.appid
      })

      wx.navigateToMiniProgram({
        appId: ad.appid,//小程序appid
        path: ad.appidurl,//跳转关联小程序millionAnswer.json配置里面的地址
        // extraData: {//需要传递给目标小程序的数据，目标小程序可在 millionAnswer.onLaunch()，millionAnswer.onShow() 中获取到这份数据。
        //   foo: 'bar'
        // },
        //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })

      this.setData({
        isJumpBanner:true
      })
      
    }else if(ad.types == 3){  //文章

    }
  },
  registerVip(e){  //注册会员
    millionAnswer.createEffect('click')
    if(e.detail.iv){  //同意授权

      let { iv, encryptedData } = e.detail

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
            url: '/pages/index/index?channelNo=null&activityId=null&channel=300439',
          })

          // this.lingqu()  //券领取记录
  
        })
      })

    }else{  //拒绝授权
     
    }
    
  },
  closeCard(){  //关闭复活卡弹窗
    millionAnswer.createEffect('click')
      this.setData({
        showCard:false,
        fail:true,
        shared:false
      })
      this.getUser()
  },
  checkFuhuo(){  //检测复活
    let fnum = this.data.userData.fu_num
    let timer = setInterval(() => {

      apiGetUser().then(res => {
        if(fnum != res.data.fu_num){
          this.setData({
            userData:res.data,
            shared:false,
            getCardNum:1,
            showCard:true
          })

          clearInterval(this.data.checkTimer)
        }
      })
    }, 1500);

    this.setData({
      checkTimer:timer
    })
    
  },
  continue(){   //继续答题
    millionAnswer.createEffect('click')
    this.setData({
      showSuccess:false,
      count:15,
      timeout:false,
      userData:this.data.userData2
    })
    this.countDown()

    this.getSubject()
    this.getUser()

  },
  registerVip2(e){  //注册会员 立即领取优惠券
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
        hasGift:false,
        showSuccess:true
      })
    }
    
  },
  lingqu(){ //券领取记录
    apiGetExchange({gift_id:this.data.gift.id})   
        .then(res => {
          if(res.error < 0){
            wx.showToast({
              title: '领取成功',
            })
          }else{
            // wx.showToast({
            //   title: res.info,
            //   icon:'none'
            // })
          }

          this.setData({
            hasGift:false,
            showSuccess:true
          })
         
        })
  },
  createPoster(){  //合成海报

    millionAnswer.buildCode().then(data => {  //先生成小程序二维码，再生成

      apiGetUser().then(res => {
        let user = res.data
        let rnum = parseInt(Math.random() * 3) + 1
        let pos = this.data.config[`failposter${rnum}`]
          console.log(pos)

           let posterConfig = {
            width: 750,
            height: 1127,
            debug: false,
            pixelRatio: 2,
            texts: [
              {  //昵称
                x: 290,
                y: 120,
                baseLine: 'middle',
                text: `${user.nickname}`,
                textAlign:'center',
                fontSize: 30,
                color: '#333',
              },
              {  //文案
                x: 205,
                y: 170,
                baseLine: 'middle',
                text: `老司机大作战，我已达到${this.data.lvtext[user.level - 1]}LV.${user.lvy}啦`,
                fontSize: 30,
                color: '#333',
              },
            ],
            images: [
              {  //底图
                width: 750,
                height: 1127,
                x: 0,
                y: 0,
                // url: `${baseUrl}/MiniProgram/images/postem.jpg`,
                url: pos,
              },
              {  //头像
                width: 150,
                height: 150,
                x: 45,
                y: 50,
                borderRadius:150,
                borderColor:'#fff',
                borderWidth:4,
                url: `${user.pic}`,
              },
              {   //小程序二维码 
                width: 120,
                height: 120,
                x: 560,
                y: 950,
                url: `${data.data.url}`,
                // url: `${user.pic}`,
              },
            ]
          }
    
          this.setData({ posterConfig: posterConfig }, () => {
            Poster.create(true);    // 入参：true为抹掉重新生成
          });
      })
    })   
   
  },
  closeGift(){  //关闭券弹窗
    millionAnswer.createEffect('click')
    this.setData({
      hasGift:false,
      showSuccess:true
    })
  },
  checkPoster(){  //点击查看海报按钮
    millionAnswer.createEffect('click')
    this.setData({
      showPoster:true,
      fail:false
    })

    wx.showLoading({
      title:'海报生成中...'
    })

    this.createPoster()
  },
  checkPoster2(){  //预览海报长按保存
    wx.previewImage({
      current: this.data.poster,
      urls: [this.data.poster]
    })

    millionAnswer.reportEvent(3,'xb00000100200010')
  },
  closePoster(){  //关海报弹窗
    millionAnswer.createEffect('click')
    this.setData({
      showPoster:false,
      fail:true
    })
  },
  saveTime(){  //离开页面时保存时间戳
    if (!this.data.fail && !this.data.hasGift && !this.data.showSuccess && !this.data.showPoster) {  //没有失败，还在答题的情况，暂停计时
        if(this.data.isJumpBanner){  //判断是否是点击banner跳转
          this.setData({
            timeout: true,
            fail:false
          })
        }else{
          this.setData({
            timeout:true
          })
          if(!this.data.isPass){
            //保存时间和秒数
            let time = new Date().getTime()
            wx.setStorageSync('time', time)
            wx.setStorageSync('count', this.data.count)
          }
        }
      }
    },
  getTime(){  //获取和设置保存的时间戳

    console.log('time ==='+ wx.getStorageSync('time'))

      if(wx.getStorageSync('time')){  //判断有没有保存时间戳
        let now = new Date().getTime()
        let count = wx.getStorageSync('count')
        let time = wx.getStorageSync('time')

        let cha = now - time
        if(cha / 1000 > count){  //大于上次保存的秒数
          // console.log('haha==gettime')
          this.setData({
            timeout:true,
            fail:true,
            count:0,
          })
        }else{  //还在倒计时间内
          if(!this.data.fail && !this.data.hasGift && !this.data.showSuccess && !this.data.showPoster){  
            count = parseInt( count - (cha / 1000))
            
            this.setData({
              timeout:false,
              fail:false,
              count,
            })
            this.countDown()
          }
        }
        
        wx.setStorageSync('time',null)
        wx.setStorageSync('count',15)
      }else{
        if(!this.data.fail && !this.data.hasGift && !this.data.showSuccess && !this.data.showPoster){  
          this.setData({//接着上次计时
            timeout:false,
            fail:false
          })
          this.countDown()
        }
      }
  },

  //事件处理函数
  onLoad: function () {
    this.getSubject()
    this.getUser()

    millionAnswer.reportEvent(1,'xb00000100060006')

    this.getTime()

    millionAnswer.createEffect('cj',true)  //暂停抽奖音乐
    millionAnswer.globalData.bgm.play()

    millionAnswer.reportEvent(1,'xb00000100060006')
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

    if(this.data.isJumpBanner){
      if(!this.data.fail && !this.data.hasGift && !this.data.showSuccess && !this.data.showPoster){  //接着上次计时
        this.setData({
          timeout:false,
          fail:false,
          isJumpBanner:false
        })
        this.countDown()
      }
    }else{
      this.getTime()
    }

    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    },200)

    millionAnswer.createEffect('cj',true)  //暂停抽奖音乐

    if(this.data.shared || this.data.showSuccess) return  //触发了系统分享窗口 也是会执行page的onShow方法 ，所以shared为true时不再重复执行onShow
  
  },

  onUnload(){
    millionAnswer.reportEvent(2,'xb00000100060006')

    millionAnswer.refreshUserdata()

    this.saveTime()

    if(this.data.checkTimer){  //清除等待好友复活的计时器
      clearInterval(this.data.checkTimer)
    }else{
      // console.log(123)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.saveTime()
    
    // millionAnswer.globalData.bgm.pause()  //暂停背景音乐
    
  },
  //分享，邀请好友
  onShareAppMessage(res) {

    if (res.from === 'button') {

      // // 来自页面内转发按钮
      // if (this.data.shared) return

      millionAnswer.reportEvent(3,'xb00000100090010',)

      if(res.target.dataset.name == 'xuanyao'){

        let text = [
          `我已通关【${this.data.lvtext[this.data.userData.level - 1]}lv${this.data.userData.lvy}】，朋友圈最有才的是我，不服来战！`,
          `我已通关【${this.data.lvtext[this.data.userData.level - 1]}lv${this.data.userData.lvy}】，有文化真的好可怕，不服来战！`,
          `我已通关【${this.data.lvtext[this.data.userData.level - 1]}lv${this.data.userData.lvy}】，才高八斗说的就是我，不服来战！`
        ] 

        let rnum = parseInt(Math.random() * 3) + 1
        let shareText = text[rnum - 1]
        let imgname = `flauntimg${rnum}`   

        return {
          title: shareText,   //标题
          path: '/subPackages/activities/answer/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
          imageUrl: this.data.config[imgname],   //分享图
        }
      }else{

        this.setData({
          shared: true,
          fail:false
        })
        this.checkFuhuo()

        return {
          title: millionAnswer.globalData.share.fail_share_txt,   //标题
          path: '/subPackages/activities/answer/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
          imageUrl: millionAnswer.globalData.share.fail_share_img,   //分享图
        }
      }
      
    }else{
      return {
        title: millionAnswer.globalData.share.home_share_txt,   //标题
        path: '/subPackages/activities/answer/component/firstpage/index?id=' + millionAnswer.globalData.userData.id,  //分享路径
        imageUrl: millionAnswer.globalData.share.home_share_img,   //分享图
      }
    }
    
  },

})
