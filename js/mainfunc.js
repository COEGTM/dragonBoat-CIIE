$(function() {
    $.global = {}
    var startTimeData;
    var endTimeData;
    //获取所有数据
    getQueryAjax = (callback) => {
            startTimeData = CurrentTime()
            $.ajax({
                type: "GET",
                async: true,
                url: `http://10.84.97.68:5000/query?startTime=${startTimeData}`,
                success: function(res) {
                    $.extend($.global, res);
                    if (typeof callback == 'function') {
                        callback($.global)
                    }
                },
                error: function(e) {}
            });
            return this
        }
        //获取当前时间
    function CurrentTime() {
        var now = new Date();
        var year = now.getFullYear(); //年   
        var month = now.getMonth() + 1; //月   
        var day = now.getDate(); //日
        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //获取当前秒();

        var clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day + " ";
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";
        if (ss < 10) clock += '0';
        clock += ss;
        return (clock);
    }

    // initBarCharts = () => {
    //     // 基于准备好的dom，初始化echarts实例
    //     var mychart6 = echarts.init(document.getElementById('chart6'));
    //     var [aver_data, max_data, min_data] = [
    //         [],
    //         [],
    //         []
    //     ]
    //     ajaxPromise({
    //         // url: `js/angle.json?startTime=${startTimeData}`,
    //         "url": `http://10.84.97.68:5000/statistics`,
    //     }).then(res => {
    //         var [Ankle_Angle, Elbow_Angle, Hip_Angle, Knee_Angle, Torso_Angle] = [
    //             res.Ankle_Angle,
    //             res.Elbow_Angle,
    //             res.Hip_Angle,
    //             res.Knee_Angle,
    //             res.Torso_Angle
    //         ]
    //         var aver_data = [Ankle_Angle.average, Elbow_Angle.average, Hip_Angle.average, Knee_Angle.average, Torso_Angle.average]
    //         var max_data = [Ankle_Angle.max, Elbow_Angle.max, Hip_Angle.max, Knee_Angle.max, Torso_Angle.max]
    //         var min_data = [Ankle_Angle.min, Elbow_Angle.min, Hip_Angle.min, Knee_Angle.min, Torso_Angle.min]
    //             // average_charts6.forEach((d, i) => average_charts6[i] = d.toFixed(1))
    //         aver_data.forEach((d, i) => aver_data[i] = d.toFixed(1))
    //         barChartOption.series[0].data = min_data;
    //         barChartOption.series[1].data = max_data;
    //         barChartOption.series[2].data = aver_data;
    //         mychart6.setOption(barChartOption, true)
    //     }).catch(err => {})
    // }


    var linechartOption = {
        tooltip: {
            trigger: 'axis',
            position: function(pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '躯干角度',
            textStyle: {
                color: '#fff',
                fontSize: 18,
                fontWeight: 'normal'
            },
            subtextStyle: {
                color: '#fff',
                fontSize: 12,
            },
            top: 20,
        },
        grid: {
            left: '5%',
            right: '4%',
            height: 180,
            bottom: '8%',
            padding: '0 0 10 0',
            containLabel: true,
        },
        backgroundColor: '#0e1c47',
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLine: { //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                    color: "#092b5d",
                },
            },
            axisLabel: { //坐标轴刻度标签的相关设置
                textStyle: {
                    color: '#24c4ff',
                    interval: 50, //代表显示所有x轴标签显示
                },
                formatter: function(d) {
                    return d
                }
            },
            axisTick: {
                show: false,
            },
            data: []
        }],
        yAxis: [{
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#092b5d'
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#092b5d"
                }

            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#24c4ff',

                },
                formatter: function(value) {
                    if (value === 0) {
                        return value
                    }
                    return value + '°'
                }
            },
            axisTick: {
                show: false,
            },
        }],
        series: [{
            name: '躯干角度',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            lineStyle: {
                normal: {
                    color: "#1fd7ff", // 线条颜色
                },
                borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
                color: 'rgb(255, 70, 131)',
            },
            areaStyle: { //区域填充样式
                normal: {
                    //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "rgba(124, 128, 244,.3)"
                    }, {
                        offset: 1,
                        color: "rgba(124, 128, 244, 0)"
                    }], false),
                    shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                    shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                }
            },
            data: []
        }]
    };

    var barChartOption = {
        backgroundColor: '#0e1c47',
        title: {
            text: '角度平均值',
            textStyle: {
                color: '#fff',
                fontSize: 18,
                fontWeight: 'normal'
            },
            subtextStyle: {
                color: '#fff',
                fontSize: 12,
            },
            top: 20,
            left: 'center'
        },
        tooltip: { //提示框组件
            trigger: 'axis',
            formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
            }
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '6%',
            top: 30,
            padding: '0 0 0 0',
            containLabel: true,
            top: '18%',
        },
        legend: { //图例组件，颜色和名字
            right: 10,
            top: 10,
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 7,
            data: [{
                    name: '最大值',
                    //icon:'image://../wwwroot/js/url2.png', //路径
                },
                {
                    name: '最小值',
                }, {
                    name: '平均值',
                }
            ],
            textStyle: {
                color: '#a8aab0',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
            }
        },
        xAxis: [{
            type: 'category',
            boundaryGap: true, //坐标轴两边留白
            data: ['脚踝角度', '手肘角度', '臀部角度', '膝盖角度', '躯干角度'],
            axisLabel: { //坐标轴刻度标签的相关设置。
                interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
                margin: 15,
                textStyle: {
                    color: '#078ceb',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                }
            },
            axisTick: { //坐标轴刻度相关设置。
                show: false,
            },
            axisLine: { //坐标轴轴线相关设置
                lineStyle: {
                    color: '#fff',
                    opacity: 0.2
                }
            },
            splitLine: { //坐标轴在 grid 区域中的分隔线。
                show: false,
            }
        }],
        yAxis: [{
            type: 'value',
            splitNumber: 5,
            axisLabel: {
                textStyle: {
                    color: '#a8aab0',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#fff'],
                    opacity: 0.06
                }
            }

        }],
        series: [{
                name: '最小值',
                type: 'bar',
                data: [],
                barWidth: 10,
                barGap: 0, //柱间距离
                label: { //图形上的文本标签
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#a8aab0',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 8,
                        },
                    },
                },
                itemStyle: { //图形样式
                    normal: {
                        barBorderRadius: [0, 0, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(127, 128, 225, 0.7)'
                        }, {
                            offset: 0.9,
                            color: 'rgba(72, 73, 181, 0.7)'
                        }, {
                            offset: 0.31,
                            color: 'rgba(0, 208, 208, 0.7)'
                        }, {
                            offset: 0.15,
                            color: 'rgba(0, 208, 208, 0.7)'
                        }, {
                            offset: 0,
                            color: 'rgba(104, 253, 255, 0.7)'
                        }], false),
                    },
                },
            },
            {
                name: '最大值',
                type: 'bar',
                data: [],
                barWidth: 10,
                barGap: 0, //柱间距离
                label: { //图形上的文本标签
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#a8aab0',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 8,
                        },
                    },
                },
                itemStyle: { //图形样式
                    normal: {
                        barBorderRadius: [0, 0, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(127, 128, 225, 0.7)'
                        }, {
                            offset: 0.9,
                            color: 'rgba(72, 73, 181, 0.7)'
                        }, {
                            offset: 0.31,
                            color: 'rgba(0, 208, 208, 0.7)'
                        }, {
                            offset: 0.15,
                            color: 'rgba(0, 208, 208, 0.7)'
                        }, {
                            offset: 0,
                            color: 'rgba(104, 253, 255, 0.7)'
                        }], false),
                    },
                },
            },
            {
                name: '平均值',
                type: 'bar',
                data: [],
                barWidth: 10,
                barGap: "130%", //柱间距离
                label: { //图形上的文本标签
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#a8aab0',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 8,
                        },
                    },
                },
                itemStyle: { //图形样式
                    normal: {
                        barBorderRadius: [0, 0, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(127, 128, 225, 0.7)'
                        }, {
                            offset: 0.9,
                            color: 'rgba(72, 73, 181, 0.7)'
                        }, {
                            offset: 0.25,
                            color: 'rgba(226, 99, 74, 0.7)'
                        }, {
                            offset: 0,
                            color: 'rgba(253, 200, 106, 0.7)'
                        }], false),
                    },
                },
            }
        ]
    };

    initChart = (chartid, option) => {
        myChart = echarts.init(document.getElementById(chartid));
        $.extend(true, linechartOption, option);
        myChart.setOption(linechartOption);
    }
    init = (globaldata) => {
        var g = globaldata;
        var [angele, Elbow, Hip_Angle, Knee_Angle, Torso_Angle] = [
            g.Ankle_Angle,
            g.Elbow_Angle,
            g.Hip_Angle,
            g.Knee_Angle,
            g.Torso_Angle
        ]
        var mapdata = (souce, fmt) => {
            var _mapdata = souce.map(item => fmt ? formatTime(item.time) : item.value);
            return [{ data: _mapdata }]
        }
        var chartList = {
            names: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'],
            titles: ['躯干角度', '手肘角度', '臀部角度', '膝盖角度', '脚踝角度'],
            dataset: [angele, Elbow, Hip_Angle, Knee_Angle, Torso_Angle, Torso_Angle]
        }
        chartList.names.forEach((name, index) => {
            var chartdata = chartList.dataset[index];
            var text = chartList.titles[index]
            initChart(name, {
                title: { text: text },
                xAxis: mapdata(chartdata, true),
                series: mapdata(chartdata)
            })
        })
    }

    initBarCharts = () => {
        // 基于准备好的dom，初始化echarts实例
        mychart6 = echarts.init(document.getElementById('chart6'));
        var [aver_data, max_data, min_data] = [
            [],
            [],
            []
        ]
        barChartOption.title.text = "角度平均值"
        mychart6.setOption(barChartOption, true)
        ajaxPromise({
            "url": `http://10.84.97.68:5000/statistics`,
        }).then(res => {
            console.log('图表6：' + new Date())
            var [Ankle_Angle, Elbow_Angle, Hip_Angle, Knee_Angle, Torso_Angle] = [
                res.Ankle_Angle,
                res.Elbow_Angle,
                res.Hip_Angle,
                res.Knee_Angle,
                res.Torso_Angle
            ]
            var aver_data = [Ankle_Angle.average, Elbow_Angle.average, Hip_Angle.average, Knee_Angle.average, Torso_Angle.average]
            var max_data = [Ankle_Angle.max, Elbow_Angle.max, Hip_Angle.max, Knee_Angle.max, Torso_Angle.max]
            var min_data = [Ankle_Angle.min, Elbow_Angle.min, Hip_Angle.min, Knee_Angle.min, Torso_Angle.min]
            barChartOption.series[0].data = min_data;
            barChartOption.series[1].data = max_data;
            aver_data.forEach((d, i) => aver_data[i] = d.toFixed(1))
            barChartOption.series[2].data = aver_data
            mychart6.setOption(barChartOption, true)
        }).catch(err => {})

    }


    var timer_clock;
    var timer_nums = 3;
    var timer_resetchart;
    var timer_stopchart;
    var timer_resetbarchart;
    var isclicked = false;
    var reqdata_count = 0;

    startBtnFn = function() {
        console.log('操作1-:开始倒计时:' + new Date())
        $('.welcome').css('display', 'none');
        $('.countDown-box').css('display', 'flex');
        $('.container-fluid').css('display', 'none');
        timer_clock = setInterval(doLoop, 1000); //一秒执行一次
        myChart.clear();
        // myChart6.clear();
        //图表6
        setTimeout(() => {
            timer_resetbarchart = setInterval(() => {
                initBarCharts()
            }, 3000)
        }, 3000)
        setTimeout(() => {
            console.log('操作1-:结束倒计时' + new Date())
            console.log('操作2：开始每5000毫秒请求数据' + new Date())
            timer_resetchart = setInterval(() => {
                getQueryAjax(init);
                reqdata_count++;
                console.log(`操作2：请求接口次数:第${reqdata_count}次,时间${new Date()}`)
            }, 1000);
            timer_stopchart = setTimeout(() => {
                endBtnFn();
                console.log('操作3：生成报告11111111111' + new Date())
            }, 30000);
            generate_report();
        }, 3000);
        getQueryAjax(init);
    }

    endBtnFn = function() {
        getScore();
        clearInterval(timer_resetchart);
        clearInterval(timer_resetbarchart);
        endTimeData = CurrentTime();
        ajaxPromise({
            "url": `http://10.84.97.68:5000/query?startTime=${startTimeData}&endTime=${endTimeData}`
        }).then(res => {}).catch(err => {})

    }


    formatTime = time => { return time.substr(11, 8); }

    doLoop = () => {
        timer_nums--;
        if (timer_nums > 0) {
            $('.number').html(timer_nums);
        } else {
            clearInterval(timer_clock); //清除js定时器
            timer_nums = 3; //重置时间
            $('.countDown-box').css('display', 'none');
            $('.container-fluid').css('display', 'block');
        }
    }

    generate_report = () => {
        var current_score;
        ajaxPromise({
            "url": `http://10.84.97.68:5000/generate_report`
        }).then(res => {}).catch(err => {})
    }

    getScore = () => {
        var current_score;
        ajaxPromise({
            "url": `http://10.84.97.68:5000/report`
        }).then(res => {
            $('.error').css('display', 'none');
            if (res.comment) {
                current_score = res;
                $('#myModal').modal('show');
                $('.error').css('display', 'none');
                $('.report-contain').css('display', 'block');
                $('.loading').css('display', 'none');
                $('.score').html(current_score.score);
                $('.comment').html(current_score.comment);
                $('.cycle').html(current_score.cycle.comment);
                $('.ankle').html(current_score.ankle_angle.min_comment + '；' + current_score.ankle_angle.max_comment);
                $('.elbow').html(current_score.elbow_angle.min_comment + '；' + current_score.elbow_angle.max_comment);
                $('.torso').html(current_score.torso_angle.min_comment + '；' + current_score.torso_angle.max_comment);
                $('.hip').html(current_score.hip_angle.min_comment + '；' + current_score.hip_angle.max_comment);
                $('.knee').html(current_score.knee_angle.min_comment + '；' + current_score.knee_angle.max_comment);
            } else if (res.error) {
                $('#myModal').modal('show');
                $('.report-contain').css('display', 'none');
                $('.loading').css('display', 'none');
                $('.error').css('display', 'block');
                $('.errScore').html(randomNum(60, 70));
            } else {
                $('#myModal').modal('show');
                $('.report-contain').css('display', 'block');
                $('.error').css('display', 'none');
                $('.loading').css('display', 'block');
            }

        }).catch(err => {
            var err = err.responseText;
            if (err.status == 200) {
                // $('#myModal').modal('show');
                // $('.report-contain').css('display', 'block');
                // $('.loading').css('display', 'none');
                // $('.score').html(err.score);
                // $('.comment').html(err.comment);
                // $('.cycle').html(err.cycle.comment);
                // $('.ankle').html(err.ankle_angle.min_comment + '；' + err.ankle_angle.max_comment);
                // $('.elbow').html(err.elbow_angle.min_comment + '；' + err.elbow_angle.max_comment);
                // $('.torso').html(err.torso_angle.min_comment + '；' + err.torso_angle.max_comment);
                // $('.hip').html(err.hip_angle.min_comment + '；' + err.hip_angle.max_comment);
                // $('.knee').html(err.knee_angle.min_comment + '；' + err.knee_angle.max_comment);
                $('#myModal').modal('show');
                $('.report-contain').css('display', 'none');
                $('.loading').css('display', 'none');
                $('.error').css('display', 'block');
                $('.errScore').html(randomNum(58, 70));
            } else {
                $('#myModal').modal('show');
                $('.report-contain').css('display', 'none');
                $('.error').css('display', 'none');
                $('.loading').css('display', 'block');
            }
        })
    }


    //生成从minNum到maxNum的随机数
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return (Math.random() * minNum + 1).toFixed(1);
                break;
            case 2:
                return (Math.random() * (maxNum - minNum + 1) + minNum).toFixed(1);
                break;
            default:
                return 0;
                break;
        }
    }

    $('#myModal').on('hidden.bs.modal', function(e) {
        $('.container-fluid').css('display', 'none');
        $('.welcome').css('display', 'block');
        location.reload();
    })


    getQueryAjax(init)
    initBarCharts()
})