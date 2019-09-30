Component({

    properties: {
        comtype: {
            type: Number,
            value: 2
        },

    },

    data: {
        topbarHeight: 44,
    },

    created() {
        let systemInfo = wx.getSystemInfoSync();
        let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
        let topbarH = systemInfo.statusBarHeight;
        let menuH = rect.height;
        let spacing = rect.top - topbarH;
        this.topbarHeight = menuH + spacing * 2 + topbarH;
        this.spacing = spacing;
    },

    attached() {
        this.setData({
            topbarHeight: this.topbarHeight,
            posibottom: this.spacing
        })

    },
    methods: {
        gotominepage: function() {
            wx.navigateTo({
                url: '/pages/mine/mine',
            })
        },

        backtopPage: function() {
            wx.navigateBack({
                delta: 1
            })
        }
    }
})