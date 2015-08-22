module.exports = {
  //配置项: 配置值
  port: 8360, //监听的端口
  db_type: 'mysql', // 数据库类型
  db_host: '127.0.0.1', // 服务器地址
  db_port: '', // 端口
  db_name: 'think_list', // 数据库名
  db_user: 'root', // 用户名
  db_pwd: '', // 密码
  db_prefix: 'think_', // 数据库表前缀
  tpl_file_suffix: '.ejs', //模版文件名后缀

  session_name: 'yao_yao_qie_ke_nao', //session对应的cookie名称
  session_type: 'File', //session存储类型, 空为内存，还可以为File
  session_path: '', //File类型下文件存储位置，默认为系统的tmp目录
  session_options: {}, //session对应的cookie选项
  session_sign: '', //session对应的cookie使用签名
  session_timeout: 24 * 3600 * 14, //服务器上session失效时间，单位：秒
};
