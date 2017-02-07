// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');
    var Comm = require('../common/common');
    var md5 = require('../tool/md5');
    var Hospital = require('../components/selectHospital')
    //--------------------------------------------------------
    
    //初始化页面数据
    initData()

    //初始化页面控件事件
    initEvent()


    function initData(){
        Comm.initData.thisUpload = '';
    	Comm.initData.HeadImg = ''; //医生头像
    	Comm.initData.CertificateImg = ''; //执业或资格证书

    	Comm.initData.PageIndex = 0;
        Comm.initData.SelectHospita = null; //当前医院
        Comm.initData.HospitaData = []; //全部医院
        Comm.initData.RegMess = null; //全部科室
        Comm.initData.Dep = [];  //当前科室
    	Comm.initData.Txt = null; //职称
    }

    function initEvent(){

        // 获取焦点or失去焦点
        $(".inpTxt").focus(function(){
            $(this).siblings('i').show()
        })

        $(".inpTxt").blur(function() {
            var con = $(this).siblings('i');
            setTimeout(function() {
                con.hide()
            }, 200)
        })

	    //清空input值
	    $(".ion-close-circled").on('click',function(){
	    	$(this).siblings('input').val('')
	    })

    	//返回上一页
    	$(".reg-return").off('click')
    	$(".reg-return,.foot-but").on('click',function(){
    		$(".reg-filter,.bar-hospital,.bar-Departments,.foot-but").hide();
    		$(".reg-list-con").removeClass('reg-list-hospital');
    		$("#scroll").removeClass('doc-reg-bottom')
    	})

    	//显示医院列表
    	$(".reg-hospital").on('click',function(){
    		$(".reg-list-con").html('<p class="reg-list-terms">输入医院名称查询</p>');
    		$(".reg-list-con").addClass('reg-list-hospital');
            $('.reg-filter,.bar-hospital').show();
    	})

    	//搜索医院
    	$(".search-but").on('click',Hospital.selectHospital);

    	//选择科室
    	$(".reg-Departments").on('click',function(){
    		$(".reg-list-con").html('');
    		Hospital.selectDepartments();
            $("#scroll").addClass('doc-reg-bottom');
            $('.reg-filter,.bar-Departments,.foot-but').show();
            
    	})

        //选择职称
        $(".reg-jobTitle").on('click',function(){
            $(".reg-list-con").html('');
            Hospital.selectJobTitle();
            // $("#scroll").addClass('doc-reg-bottom')
            $('.reg-filter,.bar-Departments').show();
            
        })

    	//保存信息
    	$(".reg-button").on('click',getSave);

        //选择头像
        $('.haedimg').on('click', function () {
            Comm.initData.thisUpload='haedimg';
            $("#inputfile").click()
        });

        //选择资格证书
        $('.certificate').on('click', function () {
            Comm.initData.thisUpload='certificate';
            $("#inputfileDoc").click()
        });
    }
    


    //保存信息验证
    function getSave(){

    	//密码验证
    	if ($('input[name=password]').val() == '') { 
            Comm.popupsUtil.init('请输入密码！', '提示', 1, function() {
	            $("input[name='password']").focus()
	        });
            return;
        }

        //姓名验证
    	if ($('input[name=username]').val() == '') { 
            Comm.popupsUtil.init('请输入姓名！', '提示', 1, function() {
	            $("input[name='username']").focus()
	        });
            return;
        }

        //医院
        if (!Comm.initData.SelectHospita) { 
            Comm.popupsUtil.init('请选择医院！', '提示', 1, function() {
                return;
            });
            return;
        }

        //科室
        if (Comm.initData.Dep==null || Comm.initData.Dep=='') { 
            Comm.popupsUtil.init('请选择科室！', '提示', 1, function() {
                return;
            });
            return;
        }

        //职称
        if (!Comm.initData.Txt) { 
            Comm.popupsUtil.init('请选择职称！', '提示', 1, function() {
                return;
            });
            return;
        }

    	
        addDocInfo()

    }

    //保存信息提交
    function addDocInfo(){
        $(".reg-button").off('click');

        var DepStr=[];

        for(var i=0; i<Comm.initData.Dep.length;i++){
            DepStr.push(Comm.initData.Dep[i].DepartmentID)
        }

        var data = {
            SID:0, //销售编号
            DoctorID:Comm.initData.docid?Comm.initData.docid:0,
            OpenID:Comm.initData.openid,
            // Phone: $('input[name=mobile]').val(), //手机号
            // Password: hex_md5($('input[name=password]').val()),  //密码
            Password: $('input[name=password]').val(),  //密码
            // VCode: $('input[name=yzm]').val(), //验证码
            HeadPic:Comm.initData.HeadImg, //头像
            Name:$('input[name=username]').val(),  //医生姓名
            // PID:AddreEvent.Province,  //省份编号
            // CID: AddreEvent.City,  //城市编号
            DepartmentID: DepStr.toString(), //科室 多个用英文逗号隔开
            Title: Comm.initData.Txt.TitleID,  //职称
            CertificatePic:Comm.initData.CertificateImg,  //执业或资格证书
            HospitalID:Comm.initData.SelectHospita.HospitalID, //医院编号
            IsEnable:2 //是否显示在医生列表
        }

        var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'http://api.yuer24h.com/app/ZHT/GetZHTDoctorReg', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                
                Comm.goToUrl({
                    h5Url:'download.html?uid=' + Comm.initData.uid
                });

            },
            error: function (value) {
                console.log(value)
            }
        })
    }


    

    $('#inputfile').change(function(){
        Comm.UploadImg("https://www.yuer24h.com/webapi/API/upload_json.ashx", "inputfile", 2, function(value) {
            postIMGCallback(value);
        });
    })
    $('#inputfileDoc').change(function(){
        Comm.UploadImg("https://www.yuer24h.com/webapi/API/upload_json.ashx", "inputfileDoc", 2, function(value) {
            postIMGCallback(value);
        });
    })
    function postIMGCallback(value) {       
        console.log(value.qiniufilePath);
        if(Comm.initData.thisUpload == 'haedimg'){
            var w = ($(window).width()-32)*0.2;
            Comm.initData.HeadImg = value.qiniudomain + value.qiniufilePath
            $(".haedimg img").attr("src", Comm.initData.HeadImg);
            $(".haedimg").height(w)
            Comm.Tool.ImgOnload(".haedimg", "",  Comm.initData.HeadImg);
        }else{
            var w = ($(window).width()-32)*0.2*0.75;
            Comm.initData.CertificateImg = value.qiniudomain + value.qiniufilePath
            $(".certificate img").attr("src", Comm.initData.CertificateImg);
            $(".certificate").height(w)
            Comm.Tool.ImgOnload(".certificate", "",  Comm.initData.CertificateImg);
        } 
    }

   


    
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
