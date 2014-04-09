var currentNavId=0;
var currentSubNavId=0;
var ColoumPixel=[0,-640,-1280,-2925];
var ColoumColor=["#fd625e","#58b3a3","#3497db","#7e4d76"]
var IntroWord=["2013届有多少毕业生?","2013届毕业生去干嘛了?","2013届毕业生去哪儿就业?","2013届毕业生去哪儿深造?"]
var WorkSubColoumPixel=[0,452,553];

$(document).ready(function()
{
	drawSubNav();
	$(".graph").bind("mousewheel",function(event){
        if(currentNavId==2){
        		event.preventDefault();
        		var moveDirection = event.deltaY>0?1:-1;
        		currentSubNavId=currentSubNavId-moveDirection;
        		if(currentSubNavId<0){currentSubNavId=0;}
        		if(currentSubNavId>2){currentSubNavId=2;}
        		console.log(currentSubNavId);
        		setSubNavStatus("subNav_"+currentSubNavId);
        		jumpOver(currentSubNavId);
        }
    });
});


function updateInfo(index)
{
	$(".intro").html(IntroWord[index]);
	$(".header_canvas").css("background-color",ColoumColor[index]);
	$(".graph").animate({top:ColoumPixel[index]});
	currentNavId=index;
	if (index==2){
		setSubNavStatus("subNav_0");
		jumpOver(0);
	}		
}

function drawSubNav(){
	var subNav = d3.select("#graph_nav").append("svg");
	var i=0;
	for(i=0;i<3;i++)
	{

		subNav.append("circle")
			.attr("id","subNav_" + i)
			.attr("r",4)
		  	.attr("cursor","pointer")
			.attr("cx",10)
			.attr("cy",i * 20 + 15)
			.attr("fill","#BCBEC0")
			.on("click",function()
			{
				setSubNavStatus(d3.select(this).attr("id"));
				jumpOver(d3.select(this).attr("id").split('_')[1]);
			});

	}
	setSubNavStatus("subNav_0");
}

function setSubNavStatus(navId)
{
	var i=0;
	for(i=0;i<3;i++)
	{
		if(navId == "subNav_" + i)
		{
			d3.select("#"+navId)
				.style("fill", "#6D6E71");
		}
		else
		{
			d3.select("#subNav_" + i)
				.style("fill", "#BCBEC0");
		}
	}
	currentSubNavId=navId.split('_')[1];
}

function jumpOver(navId){
	var i=0;
	var delta=0;
	for(i=0;i<=navId;i++){
		delta=delta+WorkSubColoumPixel[i];
	}
	$("#graph_nav").animate({top:1370+delta});
	$(".graph").animate({top:ColoumPixel[2]-delta;left:"100px";},function(){alert(1);console.log(1);});
}
