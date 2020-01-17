// const http = `https://ca.hj388.cn/yc/wei/index.php/index/index/`
// const http2 = `https://ca.hj388.cn/yc/wei/index.php/index/login/`
const http = `https://mgateway.yiche.com/wei/index.php/index/index/`
const http2 = `https://mgateway.yiche.com/wei/index.php/index/login/`

export const

  // 获取用户信息
  apiGetUser = (params = {}) => {
    const sign = wx.getStorageSync('sign')
    if (sign) {
      params.sign = sign
    }
    //  console.log(sign)
    // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${http}getUser`,
        data: params,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

// 记录用户
export const apiMarkUser = (params = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http2}setAuth`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取答题
export const apiGetSubject = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}getSubject`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 提交答题
export const apiSubSubject = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}sub`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 复活
export const apiFuhuo = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}fuhuo`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取配置
export const apiGetConfig = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}getconfig`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取奖品列表-抽奖   8个奖品
export const apiGetprize = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}getprize`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 抽奖  点击抽奖
export const apiChoujiang = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}luck_draw`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 填写地址
export const apiAddAddress = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}addAddress`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 抽奖记录
export const apiGetRecord = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}is_zhang`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取排名
export const apiGetRanking = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}ranking`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取礼品列表
export const apiGetGift = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}gift_list`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取单个礼品
export const apiSingleGift = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}gift_one`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 券领取记录(闯关升级时领取的奖品)
export const apiGetExchange = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}add_exchange_log`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 申请会员后请求记录
export const apiShenqing = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}setusers`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 积分兑换礼品
export const apiScore = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}user_gift_zhi`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 用户礼品兑换记录
export const apiUserExchange = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}gift_all`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 通关领取记录
export const apiPassrecord = (params = {}) => {
  const sign = wx.getStorageSync('sign')
  params.sign = sign
  // params.sign = 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${http}user_exchange_log`,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
