$(function () {
		Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
    return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		
        stops: [
            [0, color],
            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        ]
    };
});
    $('#container1').highcharts({
		credits: {
            enabled: false
        }, 
		tooltip: {
            enabled: false
        },  
            plotOptions: {  
                pie: {  
                    size:'60%',  
                    borderWidth: 0,  
                    allowPointSelect: true,  
                    cursor: 'pointer',  
                    dataLabels: {  
                    enabled: true,  
                    color: '#000',                        
                    distance: -50,//通过设置这个属性，将每个小饼图的显示名称和每个饼图重叠  
                    style: {                              
                        fontSize: '10px',  
                        lineHeight: '10px'  
                    },  
                    formatter: function(index) {      
                            return  '<span style="color:#00008B;font-weight:bold">' + this.point.name + '</span>';  
                       }  
                  },  
                 padding:20  
                }  
            },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
		title: {
            text: ''
			
        },
		
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                 {	color:'#ff588b',
					name:'',
                    y: 62.5
                },
				 {	color:'#55acef',
					
					name:'',
                    y: 33.7,
                    sliced: true,
                    selected: true
                },
				 {	color:'#69ddf6',
					name:'',
                    y: 3.8,
                    sliced: true,
                    selected: true
                }
            ]
        }]
    });
});				


$(function () {
    $('#container2').highcharts({
        chart: {
            type: 'column'
        },
        subtitle: {
            text: ''
        },
		title: {
            text: ''
			
        },
		
		tooltip: {
            enabled: false
        },
		credits: {
            enabled: false
        },
        xAxis: {
            categories: [
                '本年',
                '上一年',
                '再上一年'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '营业收入',
			color:'#ff588b',
            data: [49.9, 71.5, 106.4]

        }, {
            name: '毛利润',
			color:'#55acef',
            data: [83.6, 78.8, 98.3]

        }, {
            name: '净利润',
			color:'#69ddf6',
            data: [48.9, 38.8, 39.3]

        }]
    });
});				
$(function () {
    $('#container3').highcharts({
        chart: {
            type: 'column'
        },
        subtitle: {
            text: ''
        },
		title: {
            text: ''
			
        },
		
		tooltip: {
            enabled: false
        },
		credits: {
            enabled: false
        },
        xAxis: {
            categories: [
                '本年',
                '上一年',
                '再上一年'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '营业收入',
			color:'#ff588b',
            data: [49.9, 71.5, 106.4]

        }, {
            name: '毛利润',
			color:'#55acef',
            data: [83.6, 78.8, 98.3]

        }, {
            name: '净利润',
			color:'#69ddf6',
            data: [48.9, 38.8, 39.3]

        }]
    });
});	