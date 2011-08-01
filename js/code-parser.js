var parser = {

    // PROPS
    _raw_xml: null,
    _scope: null,

    // CONSTANTS
    H_ATTRIBUTES: "Attributes:",
    H_NODE_VALUE: "Node value:",
    H_NODE_NAME: "Node name:",
    BTN_REMOVE_ATTR: "remove",
    BTN_ADD_ATTR: "new",
    BTN_ADD_INNER_NODE: "add child",
    BTN_SAVE: "save",
    BTN_SHOW_ORIGINAL: "show original",
    BTN_HIDE_ORIGINAL: "hide original",
    DEFAULT_ATTR: {
        localName: "attr_name",
        nodeValue: "attr_value"
    },
    EMPTY_XML: "<node_name />",

    init: function() {

        _raw_xml = $.parseXML($("body>code").text());

        // defining scope
        _scope = $("body");

        $("body>nav").append("<button type=\"button\" onclick=\"admin.save();\">" + parser.BTN_SAVE + "</button>\
			<button type=\"button\" onclick=\"admin.show_raw(this);\">" + parser.BTN_SHOW_ORIGINAL + "</button>");

        // parsing every node.
        $(_raw_xml).children("*").each(parser.parse_node);

        // css on it!
        parser.apply_styles();

        // only once
        $("div").hide();

        // the main node cant be removed or duplicated.
        $("body>section>header>nav").hide();
    },

	// 
	// parse a xml node
	// 
    parse_node: function(index) {

        var node = $(this).get();
        if (node != undefined) {
            $(_scope).append(parser.get_html_node(node));
        }

    },
	
	// 
	// return a html template for the given xml node.
	// 
    get_html_node: function(node) {

        var _section = $("<section />");

        // appending node name and main nav
        $(_section).append(parser.get_header_html(node));

        // appending attributes
        $(_section).append(parser.get_attributes_html(node));

        // appending node value or nestead nodes.
        if ($(node).children("*").length > 0) {
            // nestead nodes
            _scope = $(_section).append("<blockquote />").find("blockquote");
            $(node).find("*").each(parser.parse_node);
        }
        else {
            // node value
            $(_section).append(parser.get_node_value_html(node));
        }

        return _section;
    },

	// 
	// return a header html template
	// 
    get_header_html: function(node) {

        var _header = $("<header />");
        var _h2 = $(_header).append("<h2 id=\"node_name\">" + $(node).get(0).localName + "</h2>");
        var _nav = $(_header).append("<nav>\
			<button type=\"button\" onclick=\"admin.mk_node(this);\">new</button>\
			<button type=\"button\" onclick=\"admin.cp_node(this);\">duplicate</button>\
			<button type=\"button\" onclick=\"admin.rm_node(this);\">remove</button>\
		</nav>");

        return _header;
    },
	
	// 
	// return a attributes html template
	// 
    get_attributes_html: function(node) {

        var _details = $("<details />");

        $(_details).append("<h1>" + parser.H_ATTRIBUTES + "</h1>");
        var _div = $(_details).append("<div />").find("div");

        $(_div).append("<button type=\"button\" onclick=\"admin.add_attr(this);\">" + parser.BTN_ADD_ATTR + "</button>");

        var _table = $(_div).append("<table />").find("table");
        if ($(node).get(0).attributes.length > 0) {
            var index = 0;
            for (index; index < $(node).get(0).attributes.length; index++) {
                $(_table).append(parser.get_attribute_row_html($(node).get(0).attributes[index]));
            }
        }

        return _details;
    },
	
	// 
	// return an attribute row html template
	// 
    get_attribute_row_html: function(value) {

        return $("<tr></tr>").append("<td><button type=\"button\" onclick=\"admin.rm_attr(this);\">" + parser.BTN_REMOVE_ATTR + "</button></td>\
				<td id=\"attr_name\">" + $(value).get(0).localName + "</td>\
				<td id=\"attr_value\">"+ $(value).get(0).nodeValue + "</td>");
    },
	
	// 
	// return the html template for node's value
	// 
    get_node_value_html: function(node) {
	
        var _article = $("<article />");
        var _h1 = $(_article).append("<h1>" + parser.H_NODE_VALUE + "</h1>");
        var _div = $(_article).append("<div />").find("div");
        var _button = $(_div).append("<button type=\"button\" onclick=\"admin.add_inner_node(this);\">" + parser.BTN_ADD_INNER_NODE + "</button>");
        var _h6 = $(_div).append("<h6 id=\"node_value\">" + $(node).get(0).textContent + "</h6>");

        return _article;
    },

    apply_styles: function() {

        // make it editable
        $("td").filter(function(value) {
            return $(this).find("button").length == 0;
        }).add("h6, h2").map(function(index){
			$(this).attr("contenteditable", "true");
			$(this).focusout(admin.validate_content);
		});

        // main styles
        $("button").addClass("rounded_box");
        $("section>details, blockquote>section>details").addClass("node_attr_box rounded_box");
        $("section>article, blockquote>section>article").addClass("node_value_box rounded_box");
        $("section>header, blockquote>section>header").addClass("rounded_box node_name_box");

        if ($("h1").hasClass("expand") == false || $("h1").hasClass("collapse") == false) {
            $("h1").addClass("expand");
        }

        $("h1").unbind().click(function()
        {
            var div = $(this).next("div");
            if ($(div).css("display") == "none")
            {
                $(div).show();
                $(this).removeClass("expand").addClass("collapse");
            }
            else
            {
                $(div).hide();
                $(this).removeClass("collapse").addClass("expand");
            }
        });
    }
};