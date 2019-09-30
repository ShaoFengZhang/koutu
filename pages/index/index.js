import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function(options) {

        loginApi.wxlogin(app).then(function(value) {
            if (options && options.uid) {
                _this.fenxiangAddScore(options.uid);
            }
        })

        // if (options && options.mubanId) {
        //     wx.navigateTo({
        //         url: `/pages/making/making?mubanId=${options.mubanId}&imgurl=${options.imgurl}`,
        //     })
        // }
    },

    onShow: function(options) {
    },

    // 分享
    onShareAppMessage: function(e) {
        return util.shareObj
    },


    catchtap: function() {},

    // 收集formid
    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

    // 抠图上传图片
    cutOutshangchuan: function () {
        let _this = this;
        util.upLoadImage("uploadrenxiang", "image", 1, this, loginApi, function (data) {
            _this.cutoutimg(data.imgurl);
        });
    },

    //抠图接口
    cutoutimg: function (url) {
        util.loding('加载中')
        let _this = this;
        let cutoutimgUrl = loginApi.domin + '/home/index/koutu';
        loginApi.requestUrl(_this, cutoutimgUrl, "POST", {
            'imgurl': url,
        }, function (res) {
            if (res.status == 1) {
                wx.navigateTo({
                    url: `/pages/cutout/cutout?peopleUrl=${res.imgurl}`,
                });
            }
        })
    },

    //跳转making
    gotomaking: function(e) {
        let {
            index,
            bindex
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/making/making?mubanId=${this.data.contentArr[bindex].content[index].id}&imgurl=${this.data.contentArr[bindex].content[index].xiaotu_url}&type=${this.
                data.contentArr[bindex].content[index].type}&width=${this.data.contentArr[bindex].content[index].img_width}&height=${this.data.contentArr[bindex].content[index].img_height}`,
        })
    },

    // 判断分享加积分
    fenxiangAddScore: function(fuid) {
        let _this = this;
        let fenxiangAddScoreUrl = loginApi.domin + '/home/index/fenxiangjifen';
        loginApi.requestUrl(_this, fenxiangAddScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
            'openid': wx.getStorageSync('user_openID'),
            'fuid': fuid,
            'newuser': wx.getStorageSync('ifnewUser')
        }, function(res) {
        })
    }

})