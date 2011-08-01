<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:msxsl="urn:schemas-microsoft-com:xslt"
 xmlns:redneck="http://ialmeida.com/redneck"
 exclude-result-prefixes="msxsl redneck">


<xsl:output 
 media-type="text"
 method="html"
 encoding="utf-8"
 indent="yes"
 omit-xml-declaration="yes"/>

	<xsl:template match="*">
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>XML PLayground v.1.0</title>

				<link rel="stylesheet" href="css/html5-reset.css" type="text/css" media="screen" charset="utf-8" />
				<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen" charset="utf-8" />
				
				<script src="js/jquery-1.5.1.min.js" type="text/javascript" charset="utf-8"></script>
				<script src="js/xml-admin.js" type="text/javascript" charset="utf-8"></script>
				<script src="js/code-parser.js" type="text/javascript" charset="utf-8"></script>

			</head>
			<body onload="parser.init();">
				<nav></nav>
				<code>
					<xsl:output
						 method="xml"
						 indent="yes"
						 encoding="utf-8"
						 omit-xml-declaration="yes" />
					<xmp><xsl:copy-of select="."/></xmp>
				</code>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>