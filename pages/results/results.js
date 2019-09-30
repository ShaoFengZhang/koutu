import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        
    },

    onLoad: function(options) {
        let _this=this;
        if (options && options.url) {
            this.setData({
                posturl: options.url
                // posturl: 'https://duanju.58100.com/upload/tutie/budaierweima/1569299875669.jpg'
            })
        };

    },

    onShow: function() {

    },


    onShareAppMessage: function() {
        return {
            title: '@你，大家一起来制图~',
            path: `/pages/index/index?uid=${wx.getStorageSync('u_id')}&type=${this.imgtype}`,
            imageUrl: this.data.posturl
        }
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

    // 点击保存图片
    uploadImage: function(type) {
        let _this = this;
        let src = this.data.posturl;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.saveImage(src);
                        },
                        // 拒绝授权时
                        fail() {
                            _this.saveImage(src);
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.saveImage(src);
                }
            },
            fail(res) {
                _this.saveImage(src);
            }
        })

    },

    // 保存图片
    saveImage: function(src) {
        let _this = this;
        util.loding('全力保存中')
        wx.getImageInfo({
            src: src,
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function() {
                        wx.hideLoading();
                        wx.showModal({
                            title: '保存成功',
                            content: `记得分享哦~`,
                            showCancel: false,
                            success: function(data) {
                                wx.previewImage({
                                    urls: [res.path]
                                })
                            }
                        });
                    },
                    fail: function(data) {
                        wx.hideLoading();
                        wx.previewImage({
                            urls: [res.path]
                        })
                    }
                })
            }
        })

    },

})