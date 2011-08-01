var admin = {

	REGEXP_NODE_NAME: new RegExp(/^_?(?!(xml|[_\d\W]))([\w.-]+)$/i),
	INVALID_NODE_NAME: "<h5>Invalid node name</h5>",
	_xml_doc : null,

	// 
	// hide all divs
	// 
	hide_divs : function (scope){
		
		$(scope).find("details>div").hide();
		$(scope).find("aside>div").hide();
		$(scope).find("article>div").hide();
	},
	
	// 
	// add attribute
	// 
	add_attr  : function (value){

		$(value).closest("div").find("table").append(parser.get_attribute_row_html(parser.DEFAULT_ATTR));
		parser.apply_styles();
	},

	// 
	// remove attribute
	// 
	rm_attr : function(value){
		$(value).parent().parent().detach();
	},

	// 
	//  remove whole node
	// 
	rm_node : function (value){

		var _context = $(value).closest("blockquote"); 
		$(value).closest("section").detach();

		if ($(_context).find("section").length==0){
			$(_context).parent().append(parser.get_node_value_html($($.parseXML(parser.EMPTY_XML)).find("*").get(0)));
			var _section = $(_context).parent();
			$(_context).detach();
			parser.apply_styles();
			admin.hide_divs(_section);
		}
	},
	
	//
	// duplicate the node
	//
	cp_node : function (value){

		var copy = $(value).closest("section").clone();
		$(value).closest("section").after(copy);
		parser.apply_styles();
		admin.hide_divs(copy);
	},

	//
	// creates a new node in the same context.
	//
	mk_node : function (value){

		_scope = $(value).closest("section").parent();
		$( $.parseXML(parser.EMPTY_XML) ).find("*").each(parser.parse_node);
		parser.apply_styles();
		admin.hide_divs(_scope);
	},

	// 
	// adding empty inner node into value's field
	// 
	add_inner_node : function (value){

		_scope = $(value).closest("article").parent().append("<blockquote />").find("blockquote");

		$( $.parseXML(parser.EMPTY_XML) ).find("*").each(parser.parse_node);
		$(value).closest("article").detach();

		parser.apply_styles();

		admin.hide_divs(_scope);
	},

	// 
	// show original xml code
	// 
	show_raw : function (value){

		if ($("body>code").css("display")=="none"){

			$("body>code").show();
			$(value).text(parser.BTN_HIDE_ORIGINAL);
		}
		else{
			
			$("body>code").hide();
			$(value).text(parser.BTN_SHOW_ORIGINAL);
		}
	},

	// 
	// validate node's content to avoid malformed xml nodes.
	// 
	validate_content: function(attribute) {

		switch(attribute.target.id)
		{
			case "attr_value":
				$(attribute.target).text($(attribute.target).text().replace(/\n\r/,""));
			break;
			case "node_name":
			case "attr_name":
				var value  = $(attribute.target).text();
				if (admin.REGEXP_NODE_NAME.test(value)==false)
				{
					$(attribute.target).css("border","2px dotted cyan");
					if (attribute.target.id=="node_name"){
						if($(attribute.target).parent().children("h5").length==0){
							$(attribute.target).before(admin.INVALID_NODE_NAME);
						}
					}
				}
				else{
					$(attribute.target).css("border","none");
					if (attribute.target.id=="node_name"){
						$(attribute.target).parent().children("h5").detach();
					}
				}
			break;
		}
	},

	// 
	// render all html and creates an xml version
	// 
	save : function(){

		var xml = admin.render_node( $("body>section") );
		$.post("http://www.ialmeida.com/save.php",{xml_content:new XMLSerializer().serializeToString(admin._xml_doc)},function(result){
			console.info("result",result);
			admin._xml_doc = null;
		});
	},

	// 
	// render a node based on html schema
	// 
	render_node : function ( html_node ){

		var selection = $(html_node).children("header");

		if (selection.length==0){
			return null;
		}

		var node_name  = selection.children("h2").text();
		var xml_node;

		if (admin._xml_doc==null){
			admin._xml_doc = new DOMParser().parseFromString( "<"+node_name+" />",  "application/xml");
			xml_node = admin._xml_doc.getElementsByTagName(node_name)[0];
		}
		else
		{
			xml_node = admin._xml_doc.createElement(node_name);
		}

		admin.redender_attr(xml_node, html_node);
		admin.render_value(xml_node, html_node);

		return xml_node;
	},

	// 
	// render a node's attributes
	// 
	redender_attr : function (xml_node, html_node){

		var selection = $(html_node).children("details").find("div>table");

		if ( selection.length==1){

			// table found. time to move to rows...
			selection = $(selection).find("tbody>tr");

			if (selection.length>0){

				// finding rows...
				$(selection).each( function(row_index){

					// finding columns...
					var row = $(this).get(row_index);
					var columns = $(row).find("td");

					if (columns.length==3){
						var attr_name = $($(columns).get(1)).text();
						var attr_value = $($(columns).get(2)).text();
						xml_node.setAttribute(attr_name,attr_value);
					}
				} );
			}
		}
	},

	// 
	// RENDER NODE'S VALUE OR NESTES NODES.
	// 
	render_value : function( xml_node, html_node ){

		var selection = $(html_node).children("article");
		if ( selection.length ==1 ){
			var cdata = admin._xml_doc.createCDATASection( selection.find("div>h6").text() );
			xml_node.appendChild(cdata);
		}
		else
		{
			var $contents = $(html_node).children("blockquote").contents();
			if ($contents.length>0){
				$contents.each(function(index){
					xml_node.appendChild( admin.render_node( $(this).get() ) );
				});
			}
		}
	}
};