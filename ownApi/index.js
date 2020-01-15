const http = `https://ca.hj388.cn/yc/wei/index.php/index/index/`
const http2 = `https://ca.hj388.cn/yc/wei/index.php/index/login/`

export const 
 
//获取用户信息 
apiGetUser = (params = {}) => {
   let sign = wx.getStorageSync('sign')
   if(sign){
     params.sign = sign
   }
  //  console.log(sign)
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
    
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}getUser`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

  //记录用户
  apiMarkUser = (params = {}) => {
    return new Promise((reslove, reject) => {
      wx.request({
        url: `${http2}setAuth`,
        data: params,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          reslove(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

//获取答题
apiGetSubject = (params = {}) => {
  let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}getSubject`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//提交答题
apiSubSubject = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}sub`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//复活
apiFuhuo = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}fuhuo`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//获取配置
apiGetConfig = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}getconfig`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//获取奖品列表-抽奖   8个奖品
apiGetprize = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}getprize`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//抽奖  点击抽奖
apiChoujiang = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}luck_draw`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},
 
//填写地址
apiAddAddress = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}addAddress`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//抽奖记录
apiGetRecord = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}is_zhang`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//获取排名
apiGetRanking = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}ranking`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//获取礼品列表
apiGetGift = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}gift_list`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//获取单个礼品
apiSingleGift = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}gift_one`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//券领取记录(闯关升级时领取的奖品)
apiGetExchange = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}add_exchange_log`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},



//申请会员后请求记录
apiShenqing = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}setusers`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//积分兑换礼品
apiScore = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}user_gift_zhi`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},

//用户礼品兑换记录
apiUserExchange = (params = {}) => {
   let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((reslove,reject) => {
    wx.request({
      url: `${http}gift_all`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        reslove(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
},


  //通关领取记录
  apiPassrecord = (params = {}) => {
     let sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
    return new Promise((reslove, reject) => {
      wx.request({
        url: `${http}user_exchange_log`,
        data: params,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          reslove(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }


;