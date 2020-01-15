export const 
// 1   模拟数据js  
  getUserInfo = params => {
    return new Promise(resolve => {
      setTimeout(() => {
        let res = {
          code: '0',
          data: {},
          msg: null
        }

        res.data.memberFlag = false
        res.data.nickName =  '巨无霸双层牛肉汉堡' 
        res.data.avatarUrl = 'https://ca.hj388.cn/yc/MiniProgram/images/page1/touxiang.jpg'
        res.data.userId = null

        resolve(res)
      }, 1500)
    })
  },

// 2
memberLoginV2 = params => {
  return new Promise(resolve => {
    setTimeout(()=>{
      let res = {
        code:'0',
        data:{},
        msg:null
      }

      res.data.memberFlag = false
      res.data.userId = 1
      res.data.phone = ''

      resolve(res)
    },1500)
  })
},

// 3.giveCoupon
giveCoupon = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      let res = {
        code: '0',
        data: {},
        msg: null
      }
      res.data = ''
      resolve(res)
    }, 1500)
  })
},




// 4.createQRCode
createQRCode = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      let res = {
        code: '0',
        data: {},
        msg: null
      }

      res.data.url = ''

      resolve(res)
    }, 1500)
  })
},


// 6.getOpenId
getOpenId = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      let res = {
        code: '0',
        data: {},
        msg: null
      }

      res.data.openId = 'opsdasdfasf'

      resolve(res)
    }, 1500)
  })
},

// 7.getPhoneNumber
getPhoneNumber = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      let res = {
        code: '0',
        data: {},
        msg: null
      }

      res.data.phoneNumber = '13664545454'

      resolve(res)
    }, 1500)
  })
}


;
