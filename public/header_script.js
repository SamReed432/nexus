var cur_margin_movie = 0;
var cur_margin_tv = 0;
var max_margin = -200;
var min_margin = -100;
$(document).ready(function() {
		//$('#results2').hide()
		//$('#results3').hide()
		//$('#results4').hide()
		
        $('#search_box').hover( 
            function() {
	
                $('#search_input').animate({
					width:'20vw',
					opacity: "70%"
				}, 0.1);
            },
            function() { 
                $('#search_input').delay(700).animate({
					width:'0px',
					opacity: "0%"
				}, 0.1)
            }
        )
	
		$('#right_arrow').click(
			function() {
				if (cur_margin_movie < max_margin){
					cur_margin_movie = 0;
				} else {
					cur_margin_movie -= 100;
				}
                $('#all_results').animate({
					marginLeft: cur_margin_movie + "%"
				})	
            }
        )
		
		$('#left_arrow').click(
			function() {
				if (cur_margin_movie > min_margin){
					cur_margin_movie = -300;
				} else {
					cur_margin_movie += 100;
				}
                $('#all_results').animate({
					marginLeft: cur_margin_movie + "%"
				})
				}
        )
	
		$('#tvright_arrow').click(
			function() {
				if (cur_margin_tv < max_margin){
					cur_margin_tv = 0;
				} else {
					cur_margin_tv -= 100;
				}
                $('#tv_results').animate({
					marginLeft: cur_margin_tv + "%"
				})	
            }
        )
		
		$('#tvleft_arrow').click(
			function() {
				if (cur_margin_tv > min_margin){
					cur_margin_tv = -300;
				} else {
					cur_margin_tv += 100;
				}
                $('#tv_results').animate({
					marginLeft: cur_margin_tv + "%"
				})
				}
        )
	
    })