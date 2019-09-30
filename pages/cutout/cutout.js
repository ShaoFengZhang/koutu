import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        srcDomin: loginApi.srcDomin,
        ifshowMask: 0,
        itemList: [],
        contentArr: [],
        txtNowIndex: 0,
        picNowSelcet: 0,
        classArr: [],
        scrollLeft: 0,
        apiHave: 0,
        posLeft: -app.globalData.posLeft,
        posTop: -app.globalData.posTop,
        scale:1,
    },

    onLoad: function(options) {

        let _this = this;
        wx.getSystemInfo({
            success(res) {
                _this.pix = (res.screenWidth / 300);
            }
        });

        this.userS = 1;
        this.userX = 0;
        this.userY = 0;
        this.canmove=false;

        if (options && options.peopleUrl) {
            this.oneTime = true;
            this.setData({
                peopleUrl: options.peopleUrl,
            });
            util.loding('初始化图片')
            this.initPic(options.peopleUrl);
            
        };
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getClass(0);

    },

    onShow: function() {
        this.getuserScore();
    },

    onShareAppMessage: function() {
        return {
            title: '@你，大家一起来制图~',
            path: `/pages/index/index?uid=${wx.getStorageSync('u_id')}`,
            imageUrl: this.data.posterUrl
        }
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

    //获取分类
    getClass: function(index) {
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/diandiantype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function(res) {
            if (res.status == 1) {
                _this.setData({
                    classArr: res.type,
                });
                _this.getContent(res.type[index].id)
            }
        })
    },

    // 获取模板数据
    getContent: function(typeid) {
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/diandianindex';
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            page: this.page,
            len: this.rows,
            typeid: typeid,
        }, function(res) {
            if (res.status == 1) {
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                }

                if (res.contents.length == 0) {
                    _this.cangetData = false;
                    _this.page == 1 ? null : _this.page--;
                };
                _this.setData({
                    contentArr: _this.data.contentArr.concat(res.contents),
                });
                _this.setData({
                    dituimg: _this.data.srcDomin + '/newadmin/Uploads/' + _this.data.contentArr[_this.data.picNowSelcet].url,
                    apiHave: 1,
                });
                _this.mubanId = _this.data.contentArr[_this.data.picNowSelcet].id;

            }
        })
    },

    //加载下一页
    bindscrolltolower: function() {
        console.log(123113)
        if (this.cangetData) {
            this.page++;
            this.getContent(this.data.classArr[this.data.txtNowIndex].id);
        }
    },

    //分类切换
    txtClassClicl: function(e) {
        let index = e.currentTarget.dataset.index;
        if (index == this.data.txtNowIndex) {
            return;
        };
        this.setData({
            txtNowIndex: index,
            picNowSelcet: 0,
            contentArr: [],
            scrollLeft: 0,
        });
        this.cangetData = true;
        // this.userS = 1;
        // this.userX = 0;
        // this.userY = 0;
        // this.initPic(this.data.peopleUrl);
        // this.imagebindload();
        this.getContent(this.data.classArr[index].id)
    },

    //分类图片点击选择
    classPicClick: function(e) {
        let index = e.currentTarget.dataset.index;
        if (index == this.data.picNowSelcet) {
            return;
        };
        this.setData({
            picNowSelcet: index,
            dituimg: this.data.srcDomin + '/newadmin/Uploads/' + this.data.contentArr[index].url,
        });
        // this.userS = 1;
        // this.userX = 0;
        // this.userY = 0;
        // this.initPic(this.data.peopleUrl);
        // this.imagebindload();
        this.mubanId = this.data.contentArr[index].id;
    },

    hidejsfenMask: function() {
        this.setData({
            ifshowMask: 0,
        })
    },

    //生成海报
    generatePoster: function() {
        if (!this.data.ifVip && this.data.userScore < 50) {
            this.setData({
                ifshowMask: 1,
            });
            return
        };

        util.loding('全速生成中');
        let _this = this;
        let generatePosterUrl = loginApi.domin + '/home/index/shengchengrenxiang1';
        loginApi.requestUrl(_this, generatePosterUrl, "POST", {
            "imgurl": this.data.peopleUrl,
            'id': this.mubanId,
            'uid': wx.getStorageSync('u_id'),
            'x': this.userX,
            'y': this.userY,
            'w': this.data.picinfo.width * this.userS,
            'h': this.data.picinfo.height * this.userS,
            'pix': this.pix,
            'width': this.userwidth,
            'height': this.userheight,
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    posterUrl: res.path,
                    qcode: res.qcode,
                });
                _this.tongjihaibao(_this.mubanId);
                setTimeout(function() {
                    // wx.hideLoading();
                    _this.judgevip();
                }, 600)
            }
        })
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
                _this.setData({
                    peopleUrl: res.imgurl,
                    scale: 1,
                });
                _this.canmove = false;
                _this.oneTime = true;
                _this.userS = 1;
                _this.userX = 0;
                _this.userY = 0;
                _this.initPic(res.imgurl)
                _this.imagebindload();
                // wx.hideLoading();
            }
        })
    },

    // 获取用户会员信息
    getuserScore: function() {
        let _this = this;
        let getuserScoreUrl = loginApi.domin + '/home/index/isvip';
        loginApi.requestUrl(_this, getuserScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    ifVip: res.vip,
                    userScore: res.jifen,
                });
            }
        })
    },

    //减积分
    minusscore: function() {
        let _this = this;
        let addScoreUrl = loginApi.domin + '/home/index/reducejifen';
        loginApi.requestUrl(_this, addScoreUrl, "POST", {
            'uid': wx.getStorageSync('u_id'),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    userScore: res.integral
                });
                _this.uploadImage(2);
            };
            if (res.status == 2) {
                util.toast('积分扣除失败/积分不足')
            }
        })
    },

    // 上传图片
    shangchuan: function() {
        let _this = this;
        util.upLoadImage("shangchuan", "image", 1, this, loginApi, function(data) {
            _this.picUrl = data.imgurl;
            _this.generatePoster();
        });
    },

    // 判断VIP
    judgevip: function() {
        if (this.data.ifVip) {
            this.uploadImage(1);
            return;
        };

        if (this.data.userScore >= 50) {
            this.minusscore();
        } else {
            this.setData({
                ifshowMask: 1,
            })
        }

    },

    // 点击保存图片
    uploadImage: function(type) {
        let _this = this;
        let src = type == 1 ? this.data.posterUrl : this.data.qcode;
        wx.navigateTo({
            url: `/pages/results/results?url=${src}`,
        });
        wx.hideLoading();
        return;
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

        wx.getImageInfo({
            src: src,
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function() {
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
                        wx.previewImage({
                            urls: [res.path]
                        })
                    }
                })
            }
        })

    },

    gotovip: function() {
        wx.navigateTo({
            url: `/pages/vipHome/vipHome`,
        });
        this.setData({
            ifshowMask: 0,
        })
    },

    //统计海报
    tongjihaibao: function(id) {
        let _this = this;
        let tongjihaibaoUrl = loginApi.domin + '/home/index/increasemuban';
        loginApi.requestUrl(_this, tongjihaibaoUrl, "POST", {
            'id': id,
        }, function(res) {})
    },

    hidejsfenMask: function() {
        this.setData({
            ifshowMask: 0,
        })
    },

    // 底图加载完成处理位置信息
    imagebindload: function() {
        if (!this.oneTime){
            return;
        }
        this.oneTime=false;
        let _this = this;
        const query = wx.createSelectorQuery()
        query.select('#caozuo').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res) {
            _this.userwidth = res[0].width;
            _this.pix = (res[0].width / 300);
            _this.userheight = res[0].height;
            console.log(res);
            console.log(-_this.data.posLeft);
            _this.setData({
                dx: app.globalData.posLeft + res[0].left,
                dy: app.globalData.posTop + res[0].top,
            })
        });
        setTimeout(function(){
            _this.canmove = true;
            wx.hideLoading();
        },2400)
        
    },


    // initPic
    initPic(url) {
        wx.getImageInfo({
            // src: 'https://duanju.58100.com/upload/huanlian/renxiang/1569229313.png',
            src: url,
            success: res => {
                let data = {}
                if (res.width > 1000) {
                    data.width = res.width * 0.15 //宽度
                    data.height = res.height * 0.15 //高度 
                } else if (res.width > 800) {
                    data.width = res.width * 0.2 //宽度
                    data.height = res.height * 0.2 //高度 
                } else if (res.width > 600) {
                    data.width = res.width * 0.3 //宽度
                    data.height = res.height * 0.3 //高度 
                } else if (res.width >= 320) {
                    data.width = res.width * 0.6 //宽度
                    data.height = res.height * 0.6 //高度
                } else if (res.width < 320) {
                    data.width = res.width //宽度
                    data.height = res.height //高度 
                };
                this.userS = 1;
                this.userX = 0;
                this.userY = 0;
                this.setData({
                    picinfo: data,
                    scale: 1,
                })
            }
        })
    },

    onChange(e) {
        if (!this.canmove){
            return;
        }
        this.userX = e.detail.x - this.data.dx;
        this.userY = e.detail.y - this.data.dy;
        console.log('move', this.userX, this.userY)
        console.log('Scale',this.userS)
    },

    onScale(e) {
        if (!this.canmove) {
            return;
        }
        this.userS = e.detail.scale;
        this.userX = e.detail.x - this.data.dx;
        this.userY = e.detail.y - this.data.dy;
        console.log('move', this.userX, this.userY)
        console.log('Scale',this.userS)
    }
})