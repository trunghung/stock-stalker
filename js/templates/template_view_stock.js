var view_stock_page = '<div id="view_stock" class="page panel edit" title="Stock" button="edit_btn"></div>',
template_view_stock = 
    [
    '<div class="page_content">',
		'<ul class="nav_tabs tabs {tabs_count}">',
			'<li class="viewQuote tab first active" view="viewQuote" onclick=""><a>Quote</a></li>',
			'<li class="viewLots tab {show_lots}" view="viewLots" onclick=""><a>Lots</a></li>',
			'<li class="viewNews tab" view="viewNews" onclick=""><a>News</a></li>',
			'<li class="viewChart tab last" view="viewChart" onclick=""><a>Chart</a></li>',
		'</ul>',
		'<div class="viewChart tab_content round_block">',
			'<div class="block header dark_bg">',
	        	'<label class="name">{name}</label> <label class="symbol">({symbol})</label>',
			'</div>',
			'<div class="block content">',
				'<img class="chart" src="" width="90%">',
			'</div>',		
			'<ul class="chart_range tabs five_tabs">',
				'<li class="1d tab first" view="1d" onclick=""><a>1d</a></li>',
				'<li class="5d tab active" view="5d" onclick=""><a>5d</a></li>',
				'<li class="3m tab" view="3m" onclick=""><a>3m</a></li>',
				'<li class="6m tab" view="6m" onclick=""><a>6m</a></li>',
				'<li class="1y tab last" view="1y" onclick=""><a>1y</a></li>',
			'</ul>',
		'</div>',
		'<div class="viewLots tab_content">',
			'<div class="lots round_block">',
				'<div class="block header dark_bg">',
					'<label class="name">{name}</label> <label class="symbol">({symbol})</label>',
				'</div>',
				'<div class="content block">', 
		        '</div>',
		    '</div>',
		'</div>',
	    '<div id="stock_info_header" class="viewQuote tab_content round_block stock_info active">',
	        '<div class="block header dark_bg">',
	    		'<label class="name">{name} ({symbol})</label>',
	        '</div>',
	        '<div class="block stock_info_summary color_bg">',
	            '<div class="round_header">',
	                '<table class="sub_header">',
	                    '<tr>',
	                        '<td class="first {positive} price"><div class="title">Last</div><div class="title price">{price}</div></td>',
	                        '<td class="last {positive} change"><div class="title">Change</div><div class="title price">{change} ({percent-change})</div></td>', 
	                    '</tr>',
	                '</table>',
	            '</div>',
	        '</div>',
	        '<div class="block stock_info_detail">',             
	            '<table>',
	                '<tr class="row">',
	                    '<td>Bid</td>',
	                    '<td class="value bid">{bid}</td>',
	                    '<td><label>Ask</td>',
	                    '<td class="value ask">{ask}</td>',
	                '</tr>',
	                '<tr class="row">',
	                    '<td>Open</td>',
	                    '<td class="value open">{open}</td>',
	                    '<td>MCap</td>',
	                    '<td class="value MCap">{MCap}</td>',
	                '</tr>',
	                '<tr class="row">',
	                    '<td>Day Hi</td>',
	                    '<td class="value high">{day_hi}</td>',
	                    '<td>Day Lo</td>',
	                    '<td class="value low">{day_lo}</td>',
	                '</tr>',
	                '<tr class="row">',
	                    '<td>52w Hi</td>',
	                    '<td class="value year_hi">{year_hi}</td>',
	                    '<td>52w Lo</td>',
	                    '<td class="value year_lo">{year_lo}</td>',
	                '</tr>',
	                '<tr class="row">',
	                    '<td>P/E</td>',
	                    '<td class="value pe">{pe}</td>',  
	                    '<td>Volume</td>',
	                    '<td class="value vol">{vol}</td>',
	                '</tr>',
	                '<tr class="position_info row {show_lots}">',  
	                    '<td>Shares</td>',
	                    '<td class="value shares">{total_shares}</td>',
	                    '<td>Lots</td>',
	                    '<td class="value lots">{lots_count}</td>',
	                '</tr>',
	            '</table>',
	        '</div>',
	    '</div>',
	    '<div class="viewNews tab_content round_block">',
	        '<div class="block header dark_bg">',
	        	'<label class="name">{name}</label> <label class="symbol">({symbol})</label>',
	        '</div>',
	        '<ul class="block rounded news_container hide_extra_items">',
	            '<div class="status loading">Loading...</div>',
	        '</ul>',
	    '</div>',
	'</div>',    
    '<div class="position">',
	    '<div class="round_block">',
		    '<div class="block header dark_bg">',
            	'<label class="name">{name} ({symbol})</label>',
		    '</div>',
		    '<div class="block">',             
		        '<table>',
			        '<tr class="row">',
		            	'<th class=""></td>',
			            '<th class="">Shares</td>',
			            '<th class="">Paid</td>',
			            '<th class="">Date</td>',
			        '</tr>',
		            '<tr class="row">',
	                	'<td class="icon"><a class="delete" onclick=""></a></td>',
		                '<td class="value shares">500</td>',
		                '<td class="value price">$11.5</td>',
		                '<td class="value date forward">3/15/2011</td>',
		            '</tr>',
		            '<tr class="row input_group">',
	            		'<td class="icon"><a class="delete" onclick=""></a></td></td>',
		                '<td class="value shares">1500</td>',
		                '<td class="value price">$10.5</td>',
		                '<td class="value date forward">4/15/2011</td>',
		            '</tr>',
		        '</table>',
		    '</div>',
		'</div>',
	'</div>',
    ].join("");