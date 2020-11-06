
const rules={ 
	//手机号码
	mobile: [ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change','blur'],
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^(1[3-9])\d{9}$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '手机号码不正确',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	//登录密码
	password: [
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '密码格式错误',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	newPassword:[ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '密码格式错误',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	oldPassword:[ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '密码格式错误',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	//姓名
	name: [
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change','blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^([\u4E00-\u9FA5])*$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '请填入中文格式汉字',
			// 触发器可以同时用blur和change
			trigger: ['blur','change'],
		}
	],
	//身份证
	idNo: [
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change','blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '请填入正确格式的身份证号码',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	//邮箱
	email: [
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change','blur'],
		},
		 //不能为纯数字，不能为纯小写字母，不能为纯大写字母，不能为纯特殊符号，至少六位。 
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/.test(value)){
					return true
				}else{ 
					return false;
				}
			}, 
			message: '请填入正确格式的邮箱',
			// 触发器可以同时用blur和change
			trigger: ['blur'],
		}
	],
	//特殊符号
	addressDetail:[ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['change','blur'],
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/[0-9a-zA-Z\u4E00-\u9FA5]/.test(value)){
					return true;
				}
				else{ 
					return false;
				}
			}, 
			message: '不允许输入特殊符号',
			// 触发器可以同时用blur和change
			trigger: ['blur','change'], 
		}
	],
	//不为空
	address:[ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		}
	],
	// 数字金额
	amount:[
		{
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)){
					return true;
				}else{ 
					return false;
				}
			}, 
			message: '请输入正确格式的金额数值并且金额不得大于500万元',
			// 触发器可以同时用blur和change
			trigger: ['blur'], 
		}
	],
	//年化利率
	annualRate:[ 
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(value <= 24){
					return true;
				}
				else{ 
					return false;
				}
			}, 
			message: '不允许超过24',
			// 触发器可以同时用blur和change
			trigger: ['blur'], 
		}
	],
	//fineRate 违约金
	fineRate:[
		{ 
			required: true, 
			message: '不能为空', 
			// 可以单个或者同时写两个触发验证方式 
			trigger: ['blur'],
		},
		{
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => { 
				if(value <= 0.1){
					return true;
				}
				else{ 
					return false;
				}
			}, 
			message: '不允许超过0.1',
			// 触发器可以同时用blur和change
			trigger: ['blur'], 
		}
	],
}
export default rules;