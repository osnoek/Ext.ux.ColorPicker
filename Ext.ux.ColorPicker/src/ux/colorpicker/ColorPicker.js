/**
 * @class Ext.ux.AdvancedColorPicker
 * @extends Ext.BoxComponent This is a color picker.
 * @license: LGPLv3
 * @author: Olav Snoek (extjs id: osnoekie)
 * @constructor Creates a new ColorPicker
 * @param {Object}
 *            config Configuration options
 * @version 1.0.0
 *
 */

Ext.define('Ext.ux.colorpicker.ColorPicker', {
	extend : 'Ext.container.Container',
	alias : 'widget.ux.colorpicker',
	width : 350,
	config : {
		hsv : {
			h : 0,
			s : 0,
			v : 0
		}
	},
	items : [ {
		xtype : 'container',
		itemId : 'cRgb',
		cls : 'x-cp-rgbpicker',
		items : [ {
			xtype : 'container',
			itemId : 'rgbPicker',
			cls : 'x-cp-rgbslider',
			width : 15,
			height : 15
		} ]
	}, {
		xtype : 'container',
		itemId : 'cHue',
		cls : 'x-cp-huepicker',
		items : [ {
			xtype : 'container',
			itemId : 'huePicker',
			cls : 'x-cp-hueslider',
			width : 15,
			height : 15
		} ]
	}, {
		xtype : 'form',
		itemId : 'cForm',
		border : false,
		cls : 'x-cp-formcontainer',
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				layout : 'anchor',
				border : false,
				defaultType : 'numberfield',
				defaults : {
					anchor : '99%',
					labelWidth : 10,
					value : 0,
					minValue : 0,
					maxValue : 255,
					labelSeparator : '',
					hideTrigger : true
				},
				columnWidth : .5,
				items : [ {
					fieldLabel : 'R',
					itemId : 'iRed'
				}, {
					fieldLabel : 'G',
					itemId : 'iGreen'
				}, {
					fieldLabel : 'B',
					itemId : 'iBlue'
				} ]
			}, {
				layout : 'anchor',
				border : false,
				defaultType : 'numberfield',
				defaults : {
					anchor : '99%',
					labelWidth : 10,
					value : 0,
					minValue : 0,
					maxValue : 255,
					labelSeparator : '',
					hideTrigger : true
				},
				columnWidth : .5,
				items : [ {
					fieldLabel : 'H',
					itemId : 'iHue',
					maxValue : 360
				}, {
					fieldLabel : 'S',
					itemId : 'iSat'
				}, {
					fieldLabel : 'V',
					itemId : 'iVal'
				} ]
			} ]
		}, {
			layout : 'anchor',
			border : false,
			defaults : {
				anchor : '99%',
				labelWidth : 10,
				labelSeparator : ''
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : '#',
				itemId : 'iHexa'
			} ]
		}, {
			defaultType : 'container',
			border : false,
			items : [ {
				layout : {
					type : 'hbox',
					align : 'top'
				},
				defaultType : 'container',
				items : [ {
					width : 30,
					height : 25,
					itemId : 'cWebsafe'
				}, {
					cls : 'x-cp-leftarrow'
				}, {
					xtype : 'button',
					text : 'Websafe',
					itemId : 'bWebsafe',
					flex : 1
				} ]
			}, {
				layout : {
					type : 'hbox',
					align : 'middle'
				},
				defaultType : 'container',
				items : [ {
					width : 30,
					height : 25,
					itemId : 'cInverse'
				}, {
					cls : 'x-cp-leftarrow'
				}, {
					xtype : 'button',
					text : 'Inverse',
					itemId : 'bInverse',
					flex : 1
				} ]
			}, {
				layout : {
					type : 'hbox',
					align : 'middle'
				},
				defaultType : 'container',
				items : [ {
					width : 30,
					height : 25,
					itemId : 'cSelect'
				}, {
					cls : 'x-cp-leftarrow'
				}, {
					xtype : 'button',
					text : 'Select Color',
					itemId : 'bSelect',
					flex : 1
				} ]
			} ]
		} ]
	} ],

	constructor : function(config) {
		this.initConfig(config);
		this.addEvents('select');
		this.callParent(arguments);
		return this;
	},

	afterRender : function(component) {
		this.callParent(arguments);
		if (this.value)
			this.setColor(this.value);
	},

	initEvents : function() {
		this.callParent();

		this.down('#cRgb').getEl().on('mousedown', this.rgbClick, this);
		this.down('#cHue').getEl().on('mousedown', this.hueClick, this);

		this.down('#iHexa').on('blur', this.hexaChange, this);
		this.down('#iRed').on('blur', this.rgbChange, this);
		this.down('#iGreen').on('blur', this.rgbChange, this);
		this.down('#iBlue').on('blur', this.rgbChange, this);

		this.down('#iHue').on('blur', this.hsvChange, this);
		this.down('#iSat').on('blur', this.hsvChange, this);
		this.down('#iVal').on('blur', this.hsvChange, this);

		this.down('#bWebsafe').on('click', this.websafeClick, this);
		this.down('#bInverse').on('click', this.inverseClick, this);
		this.down('#bSelect').on('click', this.selectClick, this);
	},

	websafeClick : function() {
		this.setColor(this.rgbToHex(this.websafe(this.getColor())));
	},

	inverseClick : function() {
		this.setColor(this.rgbToHex(this.invert(this.getColor())));
	},

	selectClick : function() {
		var color = this.down('#cSelect').getEl().getColor('backgroundColor', '', '');
		this.fireEvent('select', this, color.toUpperCase());
	},

	getColor : function() {
		return this.hsvToRgb(this.getHsv());
	},

	setValue : function(v) {
		this.value = v;
		this.setColor(v);
	},

	setColor : function(c) {
		if (this.rendered) {
			c = c.replace('#', '');
			if (!/^[0-9a-fA-F]{6}$/.test(c))
				return;
			this.down('#iHexa').setValue(c);
			this.hexaChange();
		}
	},

	selectColor : function(event, element) {
		this.fireEvent('select', this, Ext.get(element).getColor('backgroundColor', '', ''));
	},

	rgbChange : function(input) {
		this.updateColor({
			r: this.down('#iRed').getValue(),
			g: this.down('#iGreen').getValue(),
			b: this.down('#iBlue').getValue()
		});
	},

	hsvChange : function(input) {
		this.updateColor({
			h : this.down('#iHue').getValue(),
			s : this.down('#iSat').getValue(),
			v : this.down('#iVal').getValue()
		});
	},

	hexaChange : function(input) {
		this.updateColor(this.hexToRgb(this.down('#iHexa').getValue()));
	},

	hueClick : function(event, el) {
		this.moveHuePicker(event.getXY()[1] - this.down('#cHue').getEl().getTop());
	},

	rgbClick : function(event, el) {
		var cRgb = this.down('#cRgb').getEl();
		this.moveRgbPicker(event.getXY()[0] - cRgb.getLeft(), event.getXY()[1] - cRgb.getTop());
	},

	moveHuePicker : function(y) {
		var hsv = this.getHsv(), hp = this.down('#huePicker').getEl();
		hsv.h = Math.round(360 / 181 * (181 - y));
		hp.moveTo(hp.getLeft(), this.down('#cHue').getEl().getTop() + y - 7, true);
		this.updateColor(hsv);
	},

	updateRgbPicker : function(newValue) {
		this.down('#cRgb').getEl().applyStyles({
			'backgroundColor' : '#' + this.rgbToHex(this.hsvToRgb({ h: newValue, s:100, v:100 }))
		});
	},

	moveRgbPicker : function(x, y) {
		var hsv = this.getHsv(), cRgb = this.down('#cRgb').getEl();
		hsv.s = this.getSaturation(x) * 100;
		hsv.v = this.getVal(y) * 100;
		this.down('#rgbPicker').getEl().moveTo(cRgb.getLeft() + x - 7, cRgb.getTop() + y - 7, true);
		this.updateColor();
	},

	updateColor : function(color) {
		var cRgb = this.down('#cRgb').getEl(), cHue = this.down('#cHue').getEl(), hp = this.down('#huePicker').getEl(),
				rgb, hsv, invert, websafe;

		color = (Ext.isEmpty(color) ? this.getHsv() : color);
		if (Ext.isEmpty(color.h)) {
			rgb = color;
			hsv = this.rgbToHsv(rgb);
		} else {
			hsv = color;
			rgb = this.hsvToRgb(hsv);
		}
		invert = this.invert(rgb);
		websafe = this.websafe(rgb);
		this.hsv = hsv;
		this.updateRgbPicker(hsv.h);
		this.down('#iHexa').setValue(this.rgbToHex(rgb));
		this.down('#iRed').setValue(rgb.r);
		this.down('#iGreen').setValue(rgb.g);
		this.down('#iBlue').setValue(rgb.b);
		this.down('#iHue').setValue(Math.round(hsv.h));
		this.down('#iSat').setValue(Math.round(hsv.s));
		this.down('#iVal').setValue(Math.round(hsv.v));
		this.setButtonColor('#cWebsafe', websafe);
		this.setButtonColor('#cInverse', invert);
		this.setButtonColor('#cSelect',  rgb);

		hp.moveTo(hp.getLeft(), cHue.getTop() + this.getHPos(this.down('#iHue').getValue()) - 7, true);
		this.down('#rgbPicker').getEl().moveTo(cRgb.getLeft() + this.getSPos(this.down('#iSat').getValue() / 100) - 7,
			cHue.getTop() + this.getVPos(this.down('#iVal').getValue() / 100) - 7, true);
	},

	setButtonColor : function(id, rgb) {
		this.down(id).getEl().applyStyles({
			'background' : '#' + this.rgbToHex(rgb)
		});
	},
	/**
	 * Convert X coordinate to Saturation value
	 *
	 * @private
	 * @param {Integer}
	 *            x
	 * @return {Integer}
	 */
	getSaturation : function(x) {
		return x / 181;
	},

	/**
	 * Convert Y coordinate to Brightness value
	 *
	 * @private
	 * @param {Integer}
	 *            y
	 * @return {Integer}
	 */
	getVal : function(y) {
		return (181 - y) / 181;
	},

	hsvToRgb : function(hsv) {
		var result = { r: 0, g: 0, b: 0 };
		var h = hsv.h / 360;
		var s = hsv.s / 100;
		var v = hsv.v / 100;

		if (s == 0) {
			result.r = v * 255;
			result.g = v * 255;
			result.v = v * 255;
		} else {
			var_h = h * 6;
			var_i = Math.floor(var_h);
			var_1 = v * (1 - s);
			var_2 = v * (1 - s * (var_h - var_i));
			var_3 = v * (1 - s * (1 - (var_h - var_i)));

			if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
			else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
			else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
			else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
			else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
			else {var_r = v; var_g = var_1; var_b = var_2};

			result.r = var_r * 255;
			result.g = var_g * 255;
			result.b = var_b * 255;

			result.r = Math.round(result.r);
			result.g = Math.round(result.g);
			result.b = Math.round(result.b);
		}
		return result;
	},
	/**
	 * Convert a float to decimal
	 *
	 * @param {Float}
	 * @return {Integer}
	 */
	realToDec : function(n) {
		return Math.min(255, Math.round(n * 256));
	},

	websafe : function(rgb) {
		return {
			r: this.checkSafeNumber(rgb.r),
			g: this.checkSafeNumber(rgb.g),
			b: this.checkSafeNumber(rgb.b)
		}
	},

	checkSafeNumber : function(v) {
		if (!isNaN(v)) {
			v = Math.min(Math.max(0, v), 255);
			var i, next;
			for (i = 0; i < 256; i = i + 51) {
				next = i + 51;
				if (v >= i && v <= next) {
					return (v - i > 25) ? next : i;
				}
			}
		}
		return v;
	},

	invert : function(rgb) {
		return {
			r: (255 - rgb.r),
			g: (255 - rgb.g),
			b: (255 - rgb.b)
		};
	},

	getSPos : function(saturation) {
		return saturation * 181;
	},

	getVPos : function(value) {
		return 181 - (value * 181);
	},

	getHPos : function(hue) {
		return 181 - hue * (181 / 360);
	},

	hexToRgb : function(hex) {
		return {
			r: parseInt(hex.substring(0, 2), 16),
			g: parseInt(hex.substring(2, 4), 16),
			b: parseInt(hex.substring(4, 6), 16)
		}
	},

	rgbToHex : function(rgb) {
		return this.toHex(rgb.r) + this.toHex(rgb.g) + this.toHex(rgb.b);
	},

	toHex : function(n) {
		n = parseInt(n, 10);
		if (isNaN(n))
			return "00";
		n = Math.max(0, Math.min(n, 255));
		return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
	},

	rgbToHsv : function(rgb) {
		var result = { h: 0, s:0, v:0 },r = rgb.r / 255, g = rgb.g / 255,b = rgb.b / 255, minVal = Math.min(r, g, b),
				maxVal = Math.max(r, g, b), delta = maxVal - minVal;

		result.v = maxVal;

		if (delta == 0) {
			result.h = 0;
			result.s = 0;
		} else {
			result.s = delta / maxVal;
			var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

			if (r == maxVal) { result.h = del_B - del_G; }
			else if (g == maxVal) { result.h = (1 / 3) + del_R - del_B; }
			else if (b == maxVal) { result.h = (2 / 3) + del_G - del_R; }

			if (result.h < 0) { result.h += 1; }
			if (result.h > 1) { result.h -= 1; }
		}

		result.h = Math.round(result.h * 360);
		result.s = Math.round(result.s * 100);
		result.v = Math.round(result.v * 100);
		return result;
	}
});
