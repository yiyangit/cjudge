# cjudge
基于命令行的算法竞赛评测程序

来了？坐。

什么是cjudge？其实就是一个命令行上的OI评测机。对他进行一些改造就可以把它当做OJ的评测机了。

## 平台
只支持linux
## 开始

首先，你需要把cjudge的源码拉过来。
```sh
git clone https://github.com/yiyangit/cjudge.git
```
cjudge基于node，你还需要安装node：
```sh
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```
完成啦！
## 快速体验
cjudge的源码中自带A+B，可以这样体验：
```sh
node app.js pid=1 code=code.cpp lang=cpp
            题号   代码文件位置 语言
```
就可以看到测评结果啦！
## 配置数据
### 数据
/data 文件夹里就是数据了。
输入文件和答案文件的格式分别是`x.in`和`x.out`。
x只能是正整数且一道题的数据编号必须连续。
比如A+B这道题的数据文件是
```
1.in 1.out
2.in 2.out
3.in 3.out
4.in 4.out
5.in 5.out
```
###配置文件
配置文件是json格式，是每道题目下的`config.json`。
```json
{
    "time_limit":1000,  （时限）
	"checker":"IgnoreSpace", （checker，目前只能是"IgnoreSpace"或"strict"）
    "score":[20,20,20,20,20] （每个数据的分数）
}
```
## 高级
默认只支持C++。但是可以用简单的配置实现支持更多语言。
怎么实现呢？请看`lang_commands.js`。
```js
module.exports={
    'cpp':['g++ <code> -o <program>','<program>']
}
```
如果想支持Java，可以写
```js
module.exports={
    'cpp':['g++ <code> -o <program>','<program>'],
    'java':['javac <code> <program>','java <program>']
}
```
其他语言同理。
## 安全问题
**没有任何防护措施**所以请勿在不加修改的情况下用作OJ评测机

另外哪个懂的大佬和我研究研究怎么解决安全问题呀
## Bug&局限性
* 不能限制内存
* 只能测传统题
* 不支持subtask
* 不能自定义checker
## 联系我
Luogu 账号: lndlay
