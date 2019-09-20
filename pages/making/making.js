import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function(options) {
        if (options && options.mubanId) {
            this.mubanId = options.mubanId;
            this.imgurl = options.imgurl;
            this.imgtype = options.type;
            this.setData({
                imgUrl: loginApi.srcDomin + '/newadmin/Uploads/' + options.imgurl,
                viewHeight: ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 144),
                imgtype: options.type,
            });
        };
    },

    onShow: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
    },


    onShareAppMessage: function() {
        return {
            title: '@你，大家一起来制图~',
            path: `/pages/index/index?mubanId=${this.mubanId}&imgurl=${this.imgurl}&uid=${wx.getStorageSync('u_id')}`,
        }
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },


    // 抠图上传图片
    cutOutshangchuan: function() {
        let _this = this;
        util.upLoadImage("uploadrenxiang", "image", 1, this, loginApi, function(data) {
            _this.cutoutimg(data.imgurl);
        });
    },

    //抠图接口
    cutoutimg: function(url) {
        util.loding('加载中')
        let _this = this;
        let cutoutimgUrl = loginApi.domin + '/home/index/koutu';
        loginApi.requestUrl(_this, cutoutimgUrl, "POST", {
            'imgurl': url,
        }, function(res) {
            if (res.status == 1) {
                wx.navigateTo({
                    url: `/pages/cutout/cutout?peopleUrl=${res.imgurl}&mubanId=${_this.mubanId}&dituimg=${_this.data.imgUrl}&shareimg=${_this.imgurl}`,
                });
                // wx.hideLoading();
            }
        })
    },

    // 获取授权信息
    getUserInfo: function(e) {
        console.log(e);
        if (!e.detail.userInfo) {
            util.toast("我们需要您的授权哦亲~", 1200)
            return
        }
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let session_key = app.globalData.session_key;
        loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key)
    },

})