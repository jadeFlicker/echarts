const path=require('path');
const uglify=require('uglifyjs-webpack-plugin');//引入js压缩
const htmlPlugin=require('html-webpack-plugin');//html 打包插件
const extractTextPlugin=require('extract-text-webpack-plugin');//css 分离
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");

const website={
	publicPath:'http://localhost:4322/'
} 
module.exports={
	mode:'development',
	// 入口文件的配置项
	entry:{
		//里面的main是可以随便写的
		main:'./src/main.js',
		main2:'./src/main2.js'
	},
	//出口文件的配置项
	output:{
		//打包的路径
		path:path.resolve(__dirname,'../dist'),
		//打包的文件名称
		filename:'js/[name].js',   //这里[name]是告诉我们入口进去的文件是什么名字,打包出来就是什么名字
		publicPath:website.publicPath
	},
	//模块：例如解读css,图片如何转换，压缩
	module:{
		rules:[
			//CSS loader
			// {
			// 	test:/\.css$/,
			// 	// use:[
			// 	// 	{loader:'style-loader'},
			// 	// 	{loader:'css-loader'}
			// 	// ]
			// 	use:extractTextPlugin.extract({
			// 		fallback:'style-loader',
			// 		use:'css-loader'
			// 	})
			// },
			{
				test:/\.(png|jpg|gif|jpeg)/,
				use:[
					{
					    loader:'url-loader',
						options:{
							limit:500,
							outputPath:'images/'
						}
					}	
				]
			},
			{
				test:/\.(htm|html)$/i,
				use:['html-withimg-loader']
			},
			//less loader
			{
				test:/\.less$/,
				// 提取less分离文件
				// use:[{
				// 	loader:'style-loader'  //create style node form JS strings
				// },{
				// 	loader:'css-loader'   //translates CSS into CommonJS
				// },{
				// 	loader:'less-loader'  //compiles Less to css
				// }]
				use:extractTextPlugin.extract({
					use:[{
						loader:'css-loader'
					},{
						loader:'less-loader'
					}],
					fallback:'style-loader'
				})
			},
			//sass loader
			{
				test:/\.scss$/,
				// use:[{
				// 	loader:'style-loader'
				// },{
				// 	loader:'css-loader'
				// },{
				// 	loader:'sass-loader'
				// }]
				use:extractTextPlugin.extract({
					use:[{
						loader:'css-loader'
					},{
						loader:'postcss-loader'
					},{
						loader:'sass-loader'
					}],
					fallback:'style-loader'
				})
			},
			{
				test:/\.css$/,
				use:extractTextPlugin.extract({
					fallback:'style-loader',
					use:[{
						loader:'css-loader'
					},{
						loader:'postcss-loader'
					}]
				})
			}
		]
	},
	//插件,用于生产模块和各项功能
	plugins:[
	    
		new uglify(),
		new htmlPlugin({
			minify:{//是对html文件进行压缩
				removeAttributeQuotes:true  //removeAttributeQuotes去掉属性的双引号
			},
			hash:true,
			template:'./src/index.html'
		}),
		
		new PurifyCSSPlugin({
			paths:glob.sync(path.join(__dirname,'./src/*.js'))
		}),
		new extractTextPlugin('css/index.css')
	],
	//配置webpack开发服务功能
	devServer:{
		//设置基本目录结构
		contentBase:path.resolve(__dirname,'../dist'),
		//服务器的ip地址，可以使用IP也可以使用localhost
		host:'localhost',
		//服务器压缩是否开启
		compress:true,
		//配置服务端口号
		port:4322
	}
}