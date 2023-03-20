Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    region: "",
    groupId:"",
  },
    /*如果有groupId参数,我们设置一下数据小组Id,然后到下面的提交submit函数里判断一下,如果数据里有groupId,那么就调用groupId函数(加入小组),如果没有的话,才调用创建小组函数*/
  onLoad:function(e){
  if(e.groupId){
  this.setData({
    groupId: e.groupId,
  });
 }
 },
 submit:function(e){
  let u = e.detail.value;
  if (this.data.groupId){
    wx.cloud.callFunction({
      name:"quickstartFunctions",
      data:{
        type:"joinGroup",
        data:{
          ...u,
          age: new Date().getFullYear() - this.data.date,
          region:this.data.region,
          groupId:Number(this.data.groupId),
        },
      },
    });
  }else{
  wx.cloud.callFunction({
    name:"quickstartFunctions",
    data:{
      type:"createGroup",
      data:{
        ...u,
        age: new Date().getFullYear() - this.data.date,
        region:this.data.region,
      },
    },
  })
  .then((res) => {
    console.log(res);
  });
}
},

  dateChange: function (e) {
    this.setData({
      date: e.detail.value,
    }); /*注意标点符号*/
  },

  regionChange: function (e) {
    this.setData({
      region: e.detail.value,
    }); /*注意标点符号*/
  },

  
});
