# rainie-cli

自己的前端工程工具（不对外)

## 特点
- 覆盖了从项目初始化到最终发布的关键流程。包括前端本地开发，调试，测试，发布
- 提供了一些基础的开发命令, 这些命令可以通过插件的形式增加或覆盖
- 工程脚本收敛到统一的cli工具中，提高开发效率和业务代码分离

## 使用

```
 // 添加模板
 rnc tpl add
 
 // 创建模板
 rnc tpl create

// 本地开发
 rnc dev <path>

 // 构建测试
 rnc test <path?>

 // 线上打包
 rnc build <path?>

 // 提交发布
 rnc publish

```

## 开发注意
-  npm run bootstrap --hoist : 各个项目依赖(例如babel-runtime)依赖提取安装到了根目录
