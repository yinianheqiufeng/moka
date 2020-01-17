// index.js
// 获取应用实例

import millionAnswer from '../../ownApi/millionAnswer'

import { apiGetUser, apiMarkUser, apiShenqing, apiGetConfig } from '../../ownApi/index.js'

import { getOpenId, getUserInfo } from '../../../../../api/answer.api.js'

import '../animation/anime.min.js'

const baseUrl = millionAnswer.globalData.baseUrl

Page({
  data: {
    baseUrl: baseUrl,
    userData: {},
    isHelp: false, // 是否出现助力弹窗
    getCardNum: 1, // 得到复活卡的张数
    showCard: false, // 显示获得的复活卡弹窗
    config: {},
    youliangtext: 0,
    isRegister: true,
    title: {
      bg_color: 'none',
      color: '#000',
      flag: 1,
      name: ''
    },
    lvtext: ['黑铁', '青铜', '白银', '黄金', '钻石', '星耀', '王者']
  },

  getConfig () {
    const name = ''
    apiGetConfig({ name }).then(res => {
      this.setData({
        config: res.data
      })

      millionAnswer.setConfig(res)
    })
  },

  onLoad: function (options) {
    // wx.clearStorage()
    // wx.clearStorageSync()

    wx.showLoading({
      title: '加载中'
    })

    if (options.id) {
      this.getUser(options.id)
    } else if (options.scene) {
      this.getUser(options.scene)
    } else {
      this.getUser('')
    }

    millionAnswer.reportEvent(1, 'xb00000100020002')
  },
  onHide () {
    // millionAnswer.globalData.bgm.pause()  //暂停背景音乐
  },
  onShow () {
    millionAnswer.reportEvent(1, 'xb00000100020002')

    setTimeout(() => {
      millionAnswer.globalData.bgm.play()
    }, 200)
  },
  onUnload () {
    millionAnswer.reportEvent(2, 'xb00000100020002')
  },
  markUser (params) { // 记录用户
    apiMarkUser(params).then(res => {
      wx.setStorageSync('sign', res.data.sign)
      apiGetUser().then(res => {
        const you = parseInt(res.data.quantity)
        let text = ''
        if (you > 999) {
          const t = you / 1000 + ''
          text = t.substring(0, 4) + 'L'
        } else {
          text = you + 'ml'
        }
        this.setData({
          userData: res.data,
          youliangtext: text,
          isRegister: res.data.is_vip == 1
        })
        millionAnswer.globalData.userData = res.data
      })
      this.getConfig()
      wx.hideLoading()
    })
  },
  getOpenId2 (pid) {
    getOpenId().then(res2 => {
      getUserInfo({ openId: res2.data.openId })
        .then(res3 => {
          const data = res3
          const params = {}

          params.openid = res2.data.openId
          params.nickName = data.nickName
          params.avatarUrl = data.avatarUrl
          params.memberFlag = data.memberFlag
          params.userId = data.memberFlag ? data.userId : null
          params.pid = pid
          this.markUser(params)

          if (pid > 0) {
            this.setData({
              isHelp: true
            })
          }

        // var i = Math.random() * (999999 - 100000) + 100000;   //测试测试
        // var j = parseInt(i, 10);
        // params.openid = 'dfsggrkljfsysrjkldf' + j
        // params.nickName = '测试' + j
        // params.avatarUrl = 'https://ca.hj388.cn/yc/MiniProgram/images/page1/touxiang.jpg'
        // params.memberFlag = true
        // params.userId = 67
        // params.pid = pid
        // this.markUser(params)
        })
    })
  },
  getUser (pid) { // 获取用户的答题信息
    apiGetUser({ pid }).then(res => {
      if (res.error == 606) { // 没有用户缓存  测试
        this.getOpenId2(pid)
      } else {
        const you = parseInt(res.data.quantity)
        let text = ''
        if (you > 999) {
          const t = you / 1000 + ''
          text = t.substring(0, 4) + 'L'
        } else {
          text = you + 'ml'
        }
        this.setData({
          userData: res.data,
          youliangtext: text,
          isRegister: res.data.is_vip == 1
        })
        millionAnswer.globalData.userData = res.data
        this.getConfig()
        wx.hideLoading()
      }

      if (pid) {
        if (pid != res.data.id && res.data.bang == 0) {
          this.setData({
            isHelp: true
          })
        }

        if (res.error == 606) {
          this.getOpenId2(pid)
        } else {
          const data = res.data
          const params = {}
          params.openid = data.openid
          params.nickName = data.nickname
          params.avatarUrl = data.pic
          params.memberFlag = data.is_vip == 1
          params.userId = data.is_vip == 1 ? data.user_id : null
          params.pid = pid
          this.markUser(params)
        }
      }
    })
  },
  registerVip (e) { // 注册会员
    millionAnswer.createEffect('click')
      millionAnswer.reportEvent(3,'xb00000100230001')

    if (e.detail.iv) { // 同意授权
      const { iv, encryptedData } = e.detail

      if (this.data.userData.is_vip == 1) { // 是否是会员 ，1 是 ,2 不是

      } else {
        millionAnswer.getPhone({ iv, encryptedData })
          .then(result => {
            const openId = this.data.userData.openid
            const phone = result.data.phoneNumber
            const params = { iv, encryptedData, openId, phone }
            millionAnswer.becomeVip(params)
              .then(res => {
                millionAnswer.refreshUserdata()

                const params = {}
                params.user_id = res.userId
                params.phone = res.phone ? res.phone : ''

                apiShenqing(params).then(res2 => {
                              wx.switchTab({
                                url: '/pages/index/index',
                              })
                            })   //申请会员后请求记录
                millionAnswer.reportEvent(3,'xb00000100200001',{name:3})
              })
          })
      }
    } else { // 拒绝授权
      console.log('拒绝授权')
    }
  },
  closeCard () { // 关闭复活卡弹窗
    millionAnswer.createEffect('click')
    this.setData({
      showCard: false
    })
    millionAnswer.refreshUserdata()
  },
  goTest () { // 前往答题
    millionAnswer.createEffect('click')

    wx.navigateTo({
      url: '../challenge/index'
    })
  },
  goMyprize () { // 前往我的奖品
    wx.navigateTo({
      url: '../myprize/index'
    })

    millionAnswer.createEffect('click')
  },
  goShop () { // 前往商城
    wx.navigateTo({
      url: '../shop/index'
    })

    millionAnswer.createEffect('click')
  },

  help () { // 挑战好友助力复活
    millionAnswer.createEffect('click')
    this.setData({
      isHelp: false
    })
    wx.showToast({
      title: '助力成功'
    })
  },

  // 分享，邀请好友
  onShareAppMessage (res) {
    return {
      title: millionAnswer.globalData.share.home_share_txt, // 标题
      path: '/subPackages/activities/answer/component/firstpage/index?id=' + this.data.userData.id, // 分享路径
      imageUrl: millionAnswer.globalData.share.home_share_img // 分享图
    }
  }
})
