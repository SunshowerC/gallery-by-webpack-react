/**
 * Created by ChenWeiYu
 * Date : 2016/9/30
 * Time : 15:59
 */
/* main.js */
// 'use strict';
var ReactDOM = require('react-dom');
var React = require('react');


import './main.scss';


var imagesData = require('../data/gallery.json');


//获取图片路径
imagesData = (function (imagesDataArr) {

    return imagesDataArr.map(function (item) {

        item.url = require('../images/' + item.fileName);
        return item;
    })
})(imagesData);






var ImgFigure = React.createClass({

    handleClick: function () {
        if ( this.props.arrange.isCenter ) {
            this.props.reverse();
        } else  {
            this.props.center();
        }

    },

    render: function () {
        var styleObj = this.props.arrange.pos;
        var figClass = 'img-figure';

        styleObj.webkitTransform = "translate(-50%,-50%) rotate(" + this.props.arrange.rotate + "deg)";
        styleObj.transform = "translate(-50%,-50%) rotate(" + this.props.arrange.rotate + "deg)";
        // styleObj.transform = "translate(-50%,-50%)" + (this.props.arrange.isReverse ? " rotateY(180deg)" : " rotate(" + this.props.arrange.rotate + "deg)" );

        figClass += this.props.arrange.isReverse ?  ' reverse' : '';

        return (
            <figure className={figClass} style={styleObj} onClick={ this.handleClick }>
                <img src={this.props.data.url} style={{maxWidth:this.props.arrange.naturalWidth }}  alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="back-description">
                        背面详情描述
                    </div>
                </figcaption>

            </figure>
        )
    }
});


var ControllerUnit = React.createClass({
    handleClick: function () {
        if ( this.props.arrange.isCenter ) {
            this.props.reverse();
        } else  {
            this.props.center();
        }

    },
    render: function () {
        var unitClassName = '';

        unitClassName += this.props.arrange.isCenter ? ' active '　: '';
        unitClassName += this.props.arrange.isReverse ? ' reverse '　: '';



        return (
            <span className={unitClassName} onClick={ this.handleClick }>

            </span>
        )
    }
});


var GalleryApp = React.createClass({
    constantData: {
        stageW: 0, // 展台宽度
        stageH: 0,  //展台高度
        controllerW:800,     //控制条宽度
        curSpaceHeigth: 680, //图片中心不能存在的范围
        curSpaceWidth: 580   //图片中心不能存在的范围
    },

    getInitialState: function () {
        var imgsStateArr = [];

        //图片初始状态
        imagesData.forEach(function (item, index) {
            imgsStateArr.push({
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,    // 旋转角度
                isReverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            });
        });
        return {
            imgsStateArr: imgsStateArr
        };
    },

    //图片中心，随机分布在指定区域
    getRandPos: function () {
        var constant = this.constantData;
        var x = Math.random()* constant.stageW;
        var y = Math.random()* constant.stageH;
        // console.log( (constant.stageW - constant.curSpaceWidth)/2 , (constant.stageW + constant.curSpaceWidth)/2);

        /*( x > (constant.stageW - constant.curSpaceWidth)/2 && x < (constant.stageW + constant.curSpaceWidth)/2 )   ||
         ( ( x > (constant.controllerW - constant.curSpaceWidth)/2 && x < (constant.controllerW + constant.curSpaceWidth)/2 ) &&
         (y > constant.stageH - constant.curSpaceHeigth) )*/

        if ( ( x > (constant.stageW - constant.controllerW)/2 && x < (constant.stageW + constant.controllerW)/2 ) &&
             (y > constant.stageH - constant.curSpaceHeigth)
        ) {
            return this.getRandPos();
        } else {
            return {x,y};
        }
    },

    //对所有图片进行重新布局，并对index的图片进行居中
    reArrangeImgs: function (index) {
        var curImgsState = [], randPos={}, rotate = 0;

        // var curFigure = ReactDOM.findDOMNode(this.refs['imgFigure'+index] );
        // this.constantData.curSpaceHeigth =  this.refs.stage.clientHeight - curFigure.offsetTop + curFigure.clientHeight/2;
        // this.constantData.curSpaceWidth = curFigure.clientWidth;
        // console.log(this.constantData);
        var This = this;



        //随机设置图片位置与旋转角度。
        this.state.imgsStateArr.forEach(function () {
            randPos = This.getRandPos();   //获取指定区域范围的随机坐标
            curImgsState.push({
                pos: {
                    // left: parseInt(Math.random() * This.constantData.stageW),
                    // top: parseInt(Math.random() * This.constantData.stageH)
                    left: randPos.x,
                    top: randPos.y,
                    zIndex: parseInt(Math.random() * 99)
                },
                rotate: parseInt(Math.random() * 180 - 90) ,    // 旋转角度
                isReverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            })
        });


        //设置目标图片居中
        curImgsState[index].pos.left = "50%" ;
        curImgsState[index].pos.top = "50%" ;
        curImgsState[index].pos.zIndex = 100;
        curImgsState[index].rotate = 0;
        // curImgsState[index].naturalWidth = ReactDOM.findDOMNode(this.refs['imgFigure'+index] ).getElementsByTagName('img')[0].naturalWidth;
        curImgsState[index].naturalWidth = 600;  //还原原图大小，最大限制在600px
        curImgsState[index].isCenter = true;

        this.setState({
            imgsStateArr: curImgsState
        });

    },

    setCenter: function (index) {
        return function () {
            this.reArrangeImgs(index);
        }.bind(this)
    },

    setReverse: function (index) {
        var curImgsState = this.state.imgsStateArr;
        return function () {
            curImgsState[index].isReverse = !curImgsState[index].isReverse;
            this.setState({
                imgsStateArr: curImgsState
            })
        }.bind(this)

    },

    componentDidMount: function () {
        //获取舞台的高度，宽度，仅运行一次

            // this.constantData = {};
            this.constantData.stageW = this.refs.stage.clientWidth;
            this.constantData.stageH = this.refs.stage.clientHeight;
            this.constantData.controllerW = this.refs.controller.clientWidth;

            this.reArrangeImgs(0);

    },

    render: function () {
        var controllerUnit = [],imgFigures=[];


         imagesData.forEach(function (item,index) {

             controllerUnit.push(<ControllerUnit
                key={index}
                center={this.setCenter(index)}
                reverse={this.setReverse(index)}
                arrange={ this.state.imgsStateArr[index] }
            />);

             imgFigures.push(<ImgFigure
                 key={index}
                 data={item}
                 ref={"imgFigure" + index}
                 center={this.setCenter(index) }
                 reverse={this.setReverse(index)}
                 arrange={ this.state.imgsStateArr[index] }
             />);

        }.bind(this));



        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav" ref="controller">
                    {controllerUnit}
                </nav>
            </section>
        )
    }
});

ReactDOM.render(<GalleryApp />, document.getElementById('content'));
