var fs= require("fs")
const { exec }=require('child_process');
const { execSync }=require('child_process');
var lang_commands=require('./lang_commands.js');
const args = process.argv.reduce((a, b, index) => {
  if (/^[^=]*=[^=]*$/.test(b)) {
    const arr = b.split('=')
    a[arr[0]] = arr[1]
  }
  return a;
}, {})
var checkers={};
checkers.IgnoreSpace=function(A,B){
	function trim(str) {
    	return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
 	}
 	return trim(A)==trim(B);
}
//---------------------------------------------
const datadir="./data/";
const tempdir="./temp/";
var lang=args.lang//语言
var pid=args.pid//题号
var code=args.code;//代码路径
var compile_time_out=50000//编译时间上限
var pgname=tempdir+Math.floor(Math.random()*10000);
var probcfg=JSON.parse(fs.readFileSync(datadir+pid+"/"+"config.json"));
var tl=probcfg.time_limit;//时限
var checker=checkers[probcfg.checker];
var _=0;
//---------------------------------------------

	var score=0;//分数
   	exec(lang_commands[lang][0].replace("<code>",code).replace("<program>",pgname),{timeout:compile_time_out},function (error, stdout, stderr) {
        if(stderr){//编译报错
        	console.log(stderr);
        	console.log('CE');
        	process.exit()
        }
        try{
        	if(error.killed){//如果被杀死说明编译器死掉了
        		console.log('CF');//"Compiling failed"
        		process.exit()
        	}
        }
        catch(e){}
        var n=1;
        while(fs.existsSync(datadir+pid+"/"+n+".in"))n++;
        function hd(){
        	_++;
        	if(_==n-1){
        		console.log(score);
  				process.exit(0);
        	}
  			
		};
        for(var i=1;i<n;i++){//每一组数据
        	function bb(i){
        		var inF=datadir+pid+"/"+i+".in";	//输入文件
        		var outF=tempdir+i+".out"			//输出文件
        		var ansF=datadir+pid+"/"+i+".out"	//答案文件
        		console.log("Start test "+i);
        		var pro=exec(lang_commands[lang][1].replace("<program>",pgname),{timeout:tl},
        			function(error,stdout,stderr){
        				if(error!=null){
        					if(error.killed)
        						console.log('Test '+i+' : TLE')//程序超时被杀死
        					else
        						console.log('Test '+i+' : RE')//自己异常退出
        					hd();
        					return;
        				}
        				if(checker(stdout.toString(),fs.readFileSync(ansF).toString())){
        				    score+=probcfg.score[i-1];
        					console.log('Test '+i+' : AC');
        				}
        				else{
        					console.log('Test '+i+' : WA');
        				}
        				hd();
        			}
        		);
        		pro.stdin.write(fs.readFileSync(inF).toString());//给程序输入
        		pro.stdin.end();
        	}
        	bb(i);
        }
    })
