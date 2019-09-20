import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {

        videoAdShow: 1,

    },

    onLoad: function(options) {
        let _this = this;
        this.getuserScoreInfo();
        wx.getSystemInfo({
            success(res) {
                console.log(res);
                if (res.system.slice(0, 3) == 'iOS') {
                    _this.setData({
                        huiyuanhide: 1,
                    })
                }
            }
        });
        
    },

    onShow: function() {},


    onShareAppMessage: function() {
        return util.shareObj
    },

    //得到积分
    getuserScoreInfo: function() {
        let _this = this;
        let getuserScoreUrl = loginApi.domin + '/home/index/jifen';
        loginApi.requestUrl(_this, getuserScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
            'openid': wx.getStorageSync('user_openID'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.user.integral
                });
            }
        })
    },

    gotoVip: function() {
        wx.navigateTo({
            url: `/pages/vipHome/vipHome`,
        })
    },


    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})