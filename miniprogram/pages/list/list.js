Page({
data:{
  groupList:[],
},
/*当页面加载的时候,执行下面函数,调用云函数,显示数组*/
onLoad:function(e){
  wx.cloud.callFunction({
    name:"quickstartFunctions",
    data:{
      type:"getManyGroup",
    },
  })
  .then((res) =>{
    console.log(res);
    this.setData({
      groupList: res.result.groupList,
    });
  });
},
});