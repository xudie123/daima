/*这个函数很简单，先用require函数引入server-sdk，翻译一下就是服务端开发者工具包software development kit，然后init初始化一下，设置一个db变量，就是database数据库，写一下函数因为我们等会调用数据库的异步函数，所以这里使用了async关键词 异步函数,根据传进来的数据，创建一个group小组数据，创建一个form表单数据，这个具体语法你们看文档就行，这两个数据除了传入信息，还需要一个字段指向特定的用户，就是说我们要怎么样才能知道这条数据是谁的，一般来说，我们通常要求用户用手机号登录，数据库中的用户表就会查询有这个手机号的用户数据但是我们不能每次都让用户传手机号，对吧，所以通常会在注册时，创建一个随机的字符，作为用户的id保存进去，这个id就是用户的唯一标识符，登录后我们直接使用这个id生成一个加密字符，token返回给前端，前端保存在手机或浏览器中，每次网络请求都要带上这个token,后端接收到请求数据时，会解密这个token为id,确定这个请求是由某个用户发送来的，然后用id查询数据库得到用户数据，小程序有一个比较方便的功能，就是它的环境给你一个自带的openid,每个小程序用户都有一个唯一的openid，这个是腾讯帮你注册的，你就可以不用那些手机号短信啥的再弄一遍，在云函数中，可以直接使用getcontext获取上下文，得到用户的openid,这样我们就使用这个数据和其他信息同时存入数据库，但是还有一点，我们想让小组的编号123456这样递增怎么办？云开发的这个数据库没有提供递增功能，我们就得自己实现一下，先查询所有小组的数量，给这个数字加1就是新小组的编号了，这里有一个问题哈，在极端的情况下，会有两个人在同一毫秒内创建小组，同时查询小组数据得到同样的数字，就会创建同一个编号的小组，这就造成bug了对吧，这个问题可以由数据库事物功能解决，就是transaction,简单来说就是开始事务后，数据库会锁住相关的数据，先执行你接下来几个使用事务的命令，等这几个操作完成后提交事务，数据库确保事务里的函数全部执行成功，才会统一更改信息，如果其中有一个失败，那么事物里的所有操作全部回退*/

/* vscode打开终端输入（.\uploadFunction.bat ），意思是执行上传云函数的命令程序，它就会开始上传我们刚写好的函数到后端服务器，一开始会有提示，输入y按回车就行，稍微等一下，提示上传成功*/
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

module.exports = async (event) => {
  let u = event.data;
  //userId?一般来说是自行实现，小程序提供了openid比较方便
  let wxContext = cloud.getWXContext();
  let openId = wxContext.OPENID;
  //想要递增
  let res = await db.collection("test-group").count();
  let groupId = parseInt(res.total) + 1;
  //严格项目需要事务功能，可以自行搜索并查看文档
  await db.collection("test-group").add({
    data: {
      leader: u.nickname,
      region: u.region,
      code: u.code,
      age: u.age,
      info: u.info,
      member: 1,
      openId,
      groupId,
    },
  });
  await db.collection("test-form").add({
    data: {
      nickname: u.nickname,
      gender: u.gender === "nv",
      region: u.region,
      code: u.code,
      age: u.age,
      info: u.info,
      isLeader: true,
      openId,
      groupId,
    },
  });
  return {
    success: true,
    groupId,
  };
};
