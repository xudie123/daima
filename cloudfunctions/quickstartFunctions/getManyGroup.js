const cloud = require("wx-server-sdk");

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
module.exports = async (event) =>{
  try{
    let res = await db.collection("test-group").where({
      member: _.lt(6)
    }).orderBy("groupId","asc").get();
    /*调用小组,每小组小于六个人,小组号升序排列*/
    return{
      success:true,
      groupList:res.data
    }
  }catch(e){
    return{
      success:false,
      errorMessage:error
    }
  }
}