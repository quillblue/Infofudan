var initProtoType=function(div,height,width){
	this.height=height;
	this.width=width;
	this.scale = d3.scale.linear()
	                    .domain([0, 200])
						.range([0, 780]);

	this.svg= d3.select(div).append("svg")
			.attr("class","canvas")
	    	.attr("width", this.width)
	    	.attr("height", this.height)
}

function init1(){
	
	var width = 520;
	var height = 500;
	var isFirst=1;
	var CanvasIntro =new initProtoType("#intro_graph",height+40,width);
	var force = d3.layout.force();
	var svg=CanvasIntro.svg;
	root[0].update=drawData;
	function promptsColor(abortRadio){
		var color = "#ff0000";
		if(abortRadio>0.3){return "#a12518";}
		if(abortRadio>0.25){return "#f46e60";}
		if(abortRadio>0.2){return "#fba39a";}
		if(abortRadio>0.15){return "#68dd82";}
		if(abortRadio>0.10){return "#37bb54";}
		else{return "#127929";}
	}

	function tick(e) {
		var q = d3.geom.quadtree(dataset);
		var n = dataset.length;
		var i = 0;

		while (++i < n) {
		  q.visit(collide(dataset[i]));
		}
	 
		svg.selectAll(".node")
		   .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });	 
	}

	function collide(node) {
		var r = CanvasIntro.scale(Math.sqrt(node.TotalCount)) + 80;
		var nx1 = node.x - r;
		var nx2 = node.x + r;
		var ny1 = node.y - r;
		var ny2 = node.y + r;
		return function(quad, x1, y1, x2, y2) {
		  if (quad.point && (quad.point !== node)) {
			var x = node.x - quad.point.x,
				y = node.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = CanvasIntro.scale(Math.sqrt(node.TotalCount)) + CanvasIntro.scale(Math.sqrt(quad.point.TotalCount));
			if (l < r) {
			  l = (l - r) / l * .5;
			  node.x -= x *= l;
			  node.y -= y *= l;
			  quad.point.x += x;
			  quad.point.y += y;
			}
		  }
		  return x1 > nx2
			  || x2 < nx1
			  || y1 > ny2
			  || y2 < ny1;
		};
	}

	function sortDown(a, b){
	    return b.level - a.level;
	} 
	function drawData(){
		svg.selectAll(".node")
		   .remove();
		var gravity=0.048;
		var charge=100;
		if(isFirst==1){
			gravity=0.03;
			charge=95;
		}
		offsetHeight=25;
		offsetWidth=20;
		dataset.sort(sortDown);
		dataset[0].x=width/2;
	    dataset[0].y=height-offsetHeight+3000;
		
		for(var i=0; i<dataset.length; i++){
			var radius =(dataset[i].level)*400;
			var radian = (0.5+(Math.random()-0.5)/Math.abs(dataset[i].level)/1.1)*(Math.PI);
			dataset[i].x= width/2 + Math.cos(radian)*radius;
	        dataset[i].y= height/2-offsetHeight + dataset[i].level*800;
	    	dataset[i].r= CanvasIntro.scale(Math.sqrt(dataset[i].TotalCount))
	    }
		
		force
	    .nodes(dataset)
		.gravity(gravity)
		.charge(charge)
	    .size([width-20, height])
		.on("tick", tick)
		.start();
			
		
		svg.selectAll(".node")
	    .data(dataset)
	    .enter().append("circle")
	    .attr("class", "node")
	    .attr("r", function(d){return d.r;})
		.style("stroke", "white")
		.style("fill", function(d) { return promptsColor(d.AbortRadio); })
		//.attr("transform", function(d) { return "translate(" + -width + "," + -height + ")"; })
		.on("mouseover", function(d) {
			
			d3.select(this).style("stroke", "#999999");
			d3.select(this).style("stroke-width", "2");
			var mouse = d3.mouse(svg.node());
			var offsetY = 5;
			var w = 180;
			var h = 100;
			var tooltip_rect_y=d.y-d.r-offsetY-h;
			if(tooltip_rect_y<0){tooltip_rect_y=d.y+d.r+offsetY;}
			var tooltip_rect_x=d.x-w/2;
			if(tooltip_rect_x<0){tooltip_rect_x=0;}
			if(tooltip_rect_x+w>width){tooltip_rect_x=width-w;}

			svg.append("rect")
			   .attr("id", "tooltip_rect")
			   .attr("class", "tooltips")
			   .attr("width", w)
			   .attr("height", h)
			   .style("fill", "#ffffff")
			   .style("fill-opacity", ".95")
			   .attr("x", tooltip_rect_x)
			   .attr("y", tooltip_rect_y)
			   .attr("stroke", "#bbbbbb")
			   .attr("rx", 3)
			   .attr("ry", 3);
			   
			svg.append("text")
			   .attr("id", "tooltip_dept")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "14px")
			   .style("fill","#000000")
			   .text(d.dept)
			   .attr("x", tooltip_rect_x+w/2-d.dept.length*7)
			   .attr("y", tooltip_rect_y+25);

			svg.append("line")
				   .attr("class", "tooltips")
				   .style("stroke","#bbbbbb")
				   .attr("x1",tooltip_rect_x+12)
				   .attr("x2",tooltip_rect_x+w-12)
				   .attr("y1",tooltip_rect_y+33)
				   .attr("y2",tooltip_rect_y+33);
			
			svg.append("text")
			   .attr("id", "tooltip_fin")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "12px")
			   .style("fill","#000000")
			   .text("结项数 : "+(d.TotalCount-d.AbortCount))
			   .attr("x", tooltip_rect_x+12)
			   .attr("y", tooltip_rect_y+52);

			svg.append("text")
			   .attr("id", "tooltip_abort")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "12px")
			   .style("fill","#000000")
			   .text("中止数 : "+d.AbortCount)
			   .attr("x", tooltip_rect_x+12)
			   .attr("y", tooltip_rect_y+70);
			svg.append("text")
			   .attr("id", "tooltip_total")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "12px")
			   .style("fill","#000000")
			   .text("合计数 : "+d.TotalCount)
			   .attr("x", tooltip_rect_x+12)
			   .attr("y", tooltip_rect_y+88);
			svg.append("text")
			   .attr("id", "tooltip_abortRadioLabel")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "12px")
			   .style("fill","#000000")
			   .text("中止率")
			   .attr("x", tooltip_rect_x+110)
			   .attr("y", tooltip_rect_y+52);
			var AbortRadioString=(d.AbortRadio*100).toFixed(2).toString()+"%";
			svg.append("text")
			   .attr("id", "tooltip_abortRadio")
			   .attr("class", "tooltips")
			   .style("font-family", "微软雅黑")
			   .style("font-size", "18px")
			   .style("font-weight", "bold")
			   .style("fill",promptsColor(d.AbortRadio))
			   .text(AbortRadioString)
			   .attr("x", tooltip_rect_x+125-AbortRadioString.length*18/4)
			   .attr("y", tooltip_rect_y+80);

		})
		.on("mouseout", function(d) {
			d3.select(this).style("stroke", "white");
			d3.select(this).style("stroke-width", "1");
			d3.selectAll(".tooltips").remove();
		});

	}
	drawData();
	isFirst=0;
}

function init2(){
	var width = 735;
	var height = 830;
	root[1].update=drawData;
	var CanvasDetail =new initProtoType("#detail_graph",height,width);
	CanvasDetail.scale=d3.scale.linear()
                    .domain([0, 9])
					.range([2, 13]);
	var svg=CanvasDetail.svg;
	function drawSeperateLine(){
		for(i=0;i<dataset.length;i++){
			svg.append("line")
				   .attr("class", "detail_line")
				   .style("stroke","#ebebeb")
				   .attr("x1",0)
				   .attr("x2",720)
				   .attr("y1",29*i+40)
				   .attr("y2",29*i+40);
		}
		for(i=0;i<6;i++){
			svg.append("line")
				   .attr("class", "detail_line")
				   .style("stroke","#ebebeb")
				   .attr("x1",100*i+180)
				   .attr("x2",100*i+180)
				   .attr("y1",10)
				   .attr("y2",822);
		}
	}

	function drawDeptName(){
		for(i=0;i<dataset.length;i++){
			svg.append("text")
			   .attr("id", "tooltip_dept")
			   .attr("class", "detail_depttext")
			   .text(dataset[i].dept)
			   .style("fill","#666666")
			   .attr("x", 5)
			   .attr("y", 29*i+32);
		}
	}
	
	function selectColor(pjIndex){
		if(pjIndex==0){return "#ef5948";}
		if(pjIndex==1){return "#2f8898";}
		else{return "a7e443";}
	}
	function selectLabelColor(pjIndex,pjAbortRadio){
		if(pjAbortRadio>averagePjAbort[pjIndex]){return "#f46e60";}
		if(pjAbortRadio<averagePjAbort[pjIndex]){return "#68dd82";}
		else{return "ffffff";}
	}

	function drawDataPoint(i,pjIndex){
		var d=dataset[i];
		if(d.pjAbortRadio[pjIndex]=="null"){return;}
		d.cx[pjIndex]=d.pjAbortRadio[pjIndex]*1000+180;
		if(d.cx[pjIndex]>680){d.cx[pjIndex]=710;}
		d.cy=29*i+26;
		d.cr[pjIndex]=CanvasDetail.scale(Math.sqrt(d.pjTotal[pjIndex]));
		svg.append("circle")
	       .attr("class", "node")
	       .attr("cx",180)
	       .attr("cy",d.cy)
	       .attr("r", d.cr[pjIndex])
	       .style("stroke", "white")
		   .style("fill", selectColor(pjIndex))
		   .on("mouseover", function() {
				d3.select(this).style("stroke", "#999999");
				d3.select(this).style("stroke-width", "2");
				var mouse = d3.mouse(svg.node());
				var FinData=[];
				var AbortRadioData=[];
				var offsetY = 5;
				var w = 255;
				var h = 140;
				var tooltip_rect_y=d.cy-d.cr[pjIndex]-offsetY-h;
				if(tooltip_rect_y<0){tooltip_rect_y=d.cy+d.cr[pjIndex]+offsetY;}
				var tooltip_rect_x=d.cx[pjIndex]-w/2;
				if(tooltip_rect_x<0){tooltip_rect_x=0;}
				if(tooltip_rect_x+w>width){tooltip_rect_x=width-w;}

				svg.append("rect")
				   .attr("id", "tooltip_rect")
				   .attr("class", "tooltips")
				   .attr("width", w)
				   .attr("height", h)
				   .style("fill", "#000000")
				   .style("fill-opacity", ".75")
				   .attr("x", tooltip_rect_x)
				   .attr("y", tooltip_rect_y)
				   .attr("stroke", "#999999")
				   .attr("rx", 3)
				   .attr("ry", 3);
				   
				svg.append("text")
				   .attr("id", "tooltip_dept")
				   .attr("class", "tooltips")
				   .style("font-family", "微软雅黑")
				   .style("font-size", "16px")
				   .style("fill","#ffffff")
				   .text(d.dept)
				   .attr("x", tooltip_rect_x+w/2-d.dept.length*8)
				   .attr("y", tooltip_rect_y+25);

				svg.append("line")
					   .attr("class", "tooltips")
					   .style("stroke","#bbbbbb")
					   .attr("x1",tooltip_rect_x+12)
					   .attr("x2",tooltip_rect_x+w-12)
					   .attr("y1",tooltip_rect_y+35)
					   .attr("y2",tooltip_rect_y+35);

				svg.append("text")
				   .attr("id", "tooltip_jzLabel")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("莙政计划")
				   .attr("x", tooltip_rect_x+12)
				   .attr("y", tooltip_rect_y+80);
				svg.append("text")
				   .attr("id", "tooltip_wdLabel")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("望道计划")
				   .attr("x", tooltip_rect_x+12)
				   .attr("y", tooltip_rect_y+104);
				svg.append("text")
				   .attr("id", "tooltip_xyLabel")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("曦源计划")
				   .attr("x", tooltip_rect_x+12)
				   .attr("y", tooltip_rect_y+128);

				svg.append("text")
				   .attr("id", "tooltip_fin")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("结项数")
				   .attr("x", tooltip_rect_x+90)
				   .attr("y", tooltip_rect_y+57);
				svg.append("text")
				   .attr("id", "tooltip_fin")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("中止数")
				   .attr("x", tooltip_rect_x+145)
				   .attr("y", tooltip_rect_y+57);
				svg.append("text")
				   .attr("id", "tooltip_fin")
				   .attr("class", "tooltips")
				   .style("fill","#ffffff")
				   .style("font-size", "14px")
				   .text("中止率")
				   .attr("x", tooltip_rect_x+200)
				   .attr("y", tooltip_rect_y+57);
				
				for(j=0;j<3;j++){
					FinData[j]=d.pjTotal[j]-d.pjAbort[j];
					AbortRadioData[j]=(d.pjAbortRadio[j]*100).toFixed(1).toString()+"%";
					if(d.pjAbortRadio[j]==null){AbortRadioData[j]="-";}
					svg.append("text")
					   .attr("class", "tooltips")
					   .style("fill","#ffffff")
					   .style("font-size", "14px")
					   .text(FinData[j])
					   .attr("x", tooltip_rect_x+108-FinData[j].toString().length*3)
					   .attr("y", tooltip_rect_y+80+24*j);
					svg.append("text")
					   .attr("class", "tooltips")
					   .style("fill","#ffffff")
					   .style("font-size", "14px")
					   .text(d.pjAbort[j])
					   .attr("x", tooltip_rect_x+163-d.pjAbort[j].toString().length*3)
					   .attr("y", tooltip_rect_y+80+24*j);
					svg.append("text")
					   .attr("class", "tooltips")
					   .style("fill",selectLabelColor(j,d.pjAbortRadio[j]))
					   .style("font-size", "14px")
					   .text(AbortRadioData[j])
					   .attr("x", tooltip_rect_x+218-AbortRadioData[j].toString().length*3)
					   .attr("y", tooltip_rect_y+80+24*j);
				}			
			})
		   .on("mouseout", function(d) {
				d3.select(this).style("stroke", "white");
				d3.select(this).style("stroke-width", "1");
				d3.selectAll(".tooltips").remove();
			})
	       .transition()
		   .duration(1000)
		   .attr("cx",d.cx[pjIndex]);
				   		   
	}
	function drawData(){
		for(i=0;i<dataset.length;i++){
			dataset[i].cx=[];
			dataset[i].cr=[];
			drawDataPoint(i,1);
			drawDataPoint(i,2);
			drawDataPoint(i,0);
		}
	}
	drawSeperateLine();
	drawDeptName();
	drawData();
}