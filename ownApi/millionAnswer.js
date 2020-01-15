import {
    apiGetConfig,
    apiGetUser
} from './index.js'

/**
 * 模拟引入的接口
 */
// import { getOpenId ,getUserInfo, memberLoginV2, giveCoupon, createQRCode, getPhoneNumber} from './test.js'

/**
 * 正式要引入的接口
 */
import { getOpenId, getUserInfo ,memberLoginV2 , createQRCode ,giveCoupon,getPhoneNumber} from 'xxx/api/answer.api.js'
const reportSDK = require('xxx/utils/reportSDK')


class MillionAnswer {
    constructor() {
        this.globalData = {
            baseUrl: 'https://ca.hj388.cn/yc/', //当前的域名，用于拼接图片等资源
            userData: {}, //用户的答题信息
            share: {},
            bgm: null,
            audio: null,
            musicArr: [],
            stopAudio: false,
            config: {},
            marr:[]
        }

        this.init()
    }

    init() {

        //全部音乐的路径
        this.globalData.musicArr = [{
                type: 'click', //click 点击音效
                url: `${this.globalData.baseUrl}MiniProgram/music/click.mp3`,
            },
            {
                type: 'cj',
                // url: `${this.globalData.baseUrl}MiniProgram/music/抽奖背景音乐.mp3`,
                url: `${this.globalData.baseUrl}MiniProgram/music/choujiangtubeijingyinyue.mp3`,
            },
            {
                type: 'zhuan',
                url: `${this.globalData.baseUrl}MiniProgram/music/choujiangzhuanpanzhaundongyinxiao.mp3`,
            },
            {
                type: 'zhong',
                url: `${this.globalData.baseUrl}MiniProgram/music/chouzhongjiang.mp3`,
            },
            {
                type: 'success',
                url: `${this.globalData.baseUrl}MiniProgram/music/chaungguanchenggong.mp3`,
            },
            {
                type: 'wrong',
                url: `${this.globalData.baseUrl}MiniProgram/music/dacuole.mp3`,
            },
            {
                type: 'right',
                url: `${this.globalData.baseUrl}MiniProgram/music/daduile.mp3`,
            },
            {
                type: 'get',
                url: `${this.globalData.baseUrl}MiniProgram/music/jiangpinruzhang.mp3`,
            },
            {
                type: 'weizhong',
                url: `${this.globalData.baseUrl}MiniProgram/music/meichouzhongjianng.mp3`,
            },
            {
                type: 'shibai',
                url: `${this.globalData.baseUrl}MiniProgram/music/chuangguanshibai.mp3`,
            },
        ]

        this.createBgm()
        this.globalData.audio = wx.createInnerAudioContext()
        this.preloadMusic()
    }

    createBgm() { //设置全局背景音乐

        this.globalData.bgm = wx.getBackgroundAudioManager()
        let bgm = this.globalData.bgm
        bgm.title = 'bgm'
        // 设置了 src 之后会自动播放
        bgm.src = `${this.globalData.baseUrl}MiniProgram/music/youxizhengtibeijingyinyue.mp3`
        bgm.onEnded(() => {
            this.createBgm()
        })
    
    }

    preloadMusic(){ //设置音效
        this.globalData.musicArr.forEach(el => {
            let item = wx.createInnerAudioContext()
            item.autoplay = false
            item.src = el.url
            this.globalData.marr.push({type:el.type,audio:item})
        })
    }

    createEffect(type = 'click',isStop = false) {  //点击播放音效
        let item = this.globalData.marr.find(el => el.type == type)

        if (item.type == 'zhuan' || item.type == 'cj') {
            item.audio.onEnded(()=> {
                if (this.globalData.stopAudio) {
                    item.audio.pause()
                    return
                }else{
                    item.audio.src = item.audio.src
                    item.audio.play()
                }
                
            })
        }

        if(isStop){
            item.audio.pause()
        }else{
            item.audio.play()
        }

        return item
          
    }

    buildCode() { //生成小程序码 
        return createQRCode({
            path: '/component/firstpage/index',
            scene: `${this.globalData.id}`,
            width: '200'
        })
    }

    getCoupon(params){   //请求发放MOKA券
        giveCoupon(params).then(res => {
            
        })
    }

    reportEvent(num, eventId, params = {}) { //埋点事件 num = 1 进入页面上报，num = 2 离开页面上报 , num = 3 , 点击上报
        if(num == 1){ 
          params.event_type = 1
          reportSDK.reportIntoPage(eventId,params)
        }else if(num == 2){
          params.event_type = 1
          reportSDK.reportLeavePage(eventId,params)
        }else if(num == 3){
          params.event_type = 2
          reportSDK.reportSendEvent(eventId,params)
        }
    }

    getConfig() { //获取全部配置
        // let name = 'home_theme,button1,button2,button3,firstlogo,model,home_share_txt,home_share_img'
        let name = ''
        apiGetConfig({
            name
        }).then(res => {
            this.globalData.config = res.data

            let {
                home_share_txt,
                fail_share_txt,
                home_share_img,
                fail_share_img
            } = res.data
            this.globalData.share = {
                home_share_txt,
                fail_share_txt,
                home_share_img,
                fail_share_img
            }
        })
    }

    becomeVip(params = {}) { //成为会员
        return memberLoginV2(params)
    }

    getPhone(params = {}){  //获取手机号
        return getPhoneNumber(params)
    }

    refreshUserdata() { //更新用户答题信息
        apiGetUser().then(res => {
            this.globalData.userData = res.data
        })
    }
}

let millionAnswer = new MillionAnswer()

export default millionAnswer