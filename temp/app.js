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
//---------------------------------------------
const datadir="./data/";
const tempdir="./temp/";
var lang=args.lang//语言
var pid=args.pid//题号
var tl=parseInt(args.tl);//时限
var code=args.code;//代码路径
var compile_time_out=50000//编译时间上限
var pgname=tempdir+Math.floor(Math.random()*10000);
//---------------------------------------------
   	exec(lang_commands[lang][0].replace("<code>",code).replace("<program>",pgname),{timeout:compile_time_out},async function (error, stdout, stderr) {
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
        var i=1;
        var AC_points=0;//通过的数据点数量
        var UnAC_points=0; //不通过的
        

        while(fs.existsSync(datadir+pid+"/"+i+".in")){//每一组数据
        	var inF=datadir+pid+"/"+i+".in";	//输入文件
        	var outF=tempdir+i+".out"			//输出文件
        	var ansF=datadir+pid+"/"+i+".out"	//答案文件
        	try{
        		execSync(lang_commands[lang][1].replace("<program>",pgname)+" < "+inF+" > "+outF,{timeout:tl});//运行程序
        	}
        	catch(e){
        		if(e.status==null)
        			console.log('Test '+i+' : TLE')//程序超时被杀死
        		else
        			console.log('Test '+i+' : RE')
        		UnAC_points++;
        		i++;continue;
        	}
        	var flag=0;
        	try{
        		execSync("diff --ignore-all-space "+outF+" "+ansF);//比较输出与答案文件
        	}
        	catch(e){//如果diff抛出异常说明输出与答案不一致
        		console.log('Test '+i+' : WA');
        		UnAC_points++;
        		flag=1;
        	}
        	if(!flag){//AC了这个点
        		console.log('Test '+i+' : AC');
        		AC_points++;
        	}
        	i++;
        }
        console.log(AC_points/(AC_points+UnAC_points)*100);
    })
