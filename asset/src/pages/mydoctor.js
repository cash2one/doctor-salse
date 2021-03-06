// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');
    var ScrollUtil = require('../util/scrollUtil');

    //--------------------------------------------------------
    

    //初始化页面数据
    // initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    getData(true);

    // console.log(Comm.initData);

    function initEvent(){
        Comm.init.back();

        $('#add-btn').on('click',function(){
            Comm.goToUrl({h5Url:'regedit.html?addDoc=1&sid=' + Comm.initData.sid});
        })

        Comm.initData.ListScroll = ScrollUtil.init({
            obj:'wrapper',
            scoll:'scroller',
            isLoading:true,
            pullUp:function(){    //下拉
                if (!Comm.initData.isLoading) {
                    Comm.initData.pageindex++;
                    getData(false);
                }
            }
        })

        
    }
//-----------------------------------------------------

   function getData(isload){
       
        var data = {
            SID:Comm.initData.sid,
            PageIndex:Comm.initData.pageindex,
            PageSize:20
        }

        var isloadObj = {
            loadVal:isload,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'/SaleApi/GetMySaleDoctorList', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                // console.log(value);
                var SaleDoctorList =  Comm.Tool.getArray(value,'SaleDoctorList')
                if(!SaleDoctorList.length){
                    Comm.initData.isLoading = true;
                }
                pushDocList(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
               
            }
        })
   }

    function pushDocList(value){

        var str = "";
        if (Comm.Tool.getArray(value,'SaleDoctorList').length) {

            $.each(Comm.Tool.getArray(value,'SaleDoctorList'),function(){

                str +='<div class="doc-item line-bot" data-doc-id="'+ Comm.Tool.getInt(this,'DoctorID')+'" data-exam-id="'+ Comm.Tool.getInt(this,'Examine')+'">'
                str +='<div class="doc-pic">'
                if (this.HeadPic) {
                    str +='<img src="'+ Comm.Tool.getPicUrl(value.PicDomain + this.HeadPic,70,70) +'" alt="">'
                }else{
                     str +='<img src="../asset/images/public/default_v2.png" alt="">'
                }
               
                str +='</div>'
                str +='<div class="doc-txt">'
                str +='<p class="info line-bot">'+ Comm.Tool.getString(this,'Name')+' <small>'+ this.Title+' </small></br><span>'+ Comm.Tool.getString(this,'Hospital')+'</span></p>'
                str +='<div class="state">'
                
                switch(this.Examine){
                    case 1:  //审核通过
                        str+='<span class ="green">审核通过</span>'
                        str +='<div class="performance">绩效</div>'
                    break;
                    case 2:  //未通过
                        str+='<span class ="red">审核失败</span>'
                    break;
                    case 3:  //未审核
                        str+='<span class ="yellow">审核中</span>'
                    break;
                    case 4:  //信息不完整
                        str+='<span class ="gray">待注册</span>'
                    break;
                }
                str +='<em>注册于'+  Comm.Tool.formatDate(this.Created*1000,'yyyy-MM-dd')+'</em>'
                str +='</div>'
                str += '</div>'
                str +='</div>'
            })
        }else{
            if (Comm.initData.pageindex==0) {
                str+='<div class="no-data"><p>( > __ <。)</p><p>暂无医生信息！</p></div>';
            }
        }

        $(".doclist").append(str);
        $(".doc-item").on('click',gotopage);
    }


    function gotopage(){
        
        var docid = $(this).attr('data-doc-id');
        var state = $(this).attr('data-exam-id');
            switch(parseInt(state)){
                case 1: //审核通过
                    Comm.goToUrl({h5Url:'docdetail.html?docid='+ docid})
                    break;
                case 2:  //未通过 信息认证页
                    Comm.goToUrl({h5Url:'identification.html?check=1&docid=' + docid})
                    break;
                case 3: //审核中 信息认证页
                    Comm.goToUrl({h5Url:'identification.html?docid='+ docid })
                    break;
                case 4: //信息不完整
                    Comm.goToUrl({h5Url:'regedit.html?docid='+ docid })
                    break;
            }
        
    }

//------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
