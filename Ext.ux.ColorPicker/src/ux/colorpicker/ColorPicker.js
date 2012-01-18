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
		var me = this;
		me.initConfig(config);
		me.addEvents('select');
		me.callParent(arguments);
		return this;
	},

	afterRender : function(component) {
		var me = this;
		me.callParent(arguments);
		if (me.value)
			me.setColor(me.value);
	},

	initEvents : function() {
		var me = this;
		me.callParent();

		me.down('#cRgb').getEl().on('mousedown', me.rgbClick, me);
		me.down('#cHue').getEl().on('mousedown', me.hueClick, me);

		me.down('#iHexa').on('blur', me.hexaChange, me);
		me.down('#iRed').on('blur', me.rgbChange, me);
		me.down('#iGreen').on('blur', me.rgbChange, me);
		me.down('#iBlue').on('blur', me.rgbChange, me);

		me.down('#iHue').on('blur', me.hsvChange, me);
		me.down('#iSat').on('blur', me.hsvChange, me);
		me.down('#iVal').on('blur', me.hsvChange, me);

		me.down('#bWebsafe').on('click', me.websafeClick, me);
		me.down('#bInverse').on('click', me.inverseClick, me);
		me.down('#bSelect').on('click', me.selectClick, me);
	},

	websafeClick : function() {
		this.setColor(this.rgbToHex(this.websafe(this.getColor())));
	},

	inverseClick : function() {
		this.setColor(this.invert(this.getColor()));
	},

	selectClick : function() {
		var me = this, color;
		color = me.down('#cSelect').getEl().getColor('backgroundColor', '', '');
		this.fireEvent('select', this, color.toUpperCase());
	},

	getColor : function() {
		return me.hsvToRgb(this.getHsv());
	},

	setValue : function(v) {
		this.value = v;
		this.setColor(v);
	},

	setColor : function(c) {
		var me = this;
		if (me.rendered) {
			c = c.replace('#', '');
			if (!/^[0-9a-fA-F]{6}$/.test(c))
				return;
			me.down('#iHexa').setValue(c);
			me.hexaChange();
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
			s : this.down('#iSat').getValue() / 100,
			v : this.down('#iVal').getValue() / 100
		});
	},

	hexaChange : function(input) {
		this.updateColor(this.hexToRgb(this.down('#iHexa').getValue()));
	},

	hueClick : function(event, el) {
		var me = this;
		me.updateMode = 'click';
		me.moveHuePicker(event.getXY()[1] - me.down('#cHue').getEl().getTop());
	},

	rgbClick : function(event, el) {
		var me = this, cRgb = me.down('#cRgb').getEl();
		me.updateMode = 'click';
		me.moveRgbPicker(event.getXY()[0] - cRgb.getLeft(), event.getXY()[1] - cRgb.getTop());
	},

	moveHuePicker : function(y) {
		var hsv = this.getHsv(), hp = this.down('#huePicker').getEl();
		hsv.h = Math.round(360 / 181 * (181 - y));
		hp.moveTo(hp.getLeft(), this.down('#cHue').getEl().getTop() + y - 7, true);
		this.updateRgbPicker(hsv.h);
		this.updateColor(hsv);
	},

	updateRgbPicker : function(newValue) {
		this.down('#cRgb').getEl().applyStyles({
			'backgroundColor' : '#' + this.rgbToHex(this.hsvToRgb({ h: newValue, s:1, v:1 }))
		});
	},

	moveRgbPicker : function(x, y) {
		var me = this, hsv = me.getHsv(), cRgb = me.down('#cRgb').getEl();
		hsv.s = me.getSaturation(x);
		hsv.v = me.getVal(y);
		me.down('#rgbPicker').getEl().moveTo(cRgb.getLeft() + x - 7, cRgb.getTop() + y - 7, true);
		me.updateColor();
	},

	updateColor : function(color) {
		var rgb, hsv, invert, websafe;
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

		this.down('#iHexa').setValue(this.rgbToHex(rgb));
		this.down('#iRed').setValue(rgb.r);
		this.down('#iGreen').setValue(rgb.g);
		this.down('#iBlue').setValue(rgb.b);
		this.down('#iHue').setValue(Math.round(hsv.h));
		this.down('#iSat').setValue(Math.round(hsv.s * 100));
		this.down('#iVal').setValue(Math.round(hsv.v * 100));
		this.setButtonColor('#cWebsafe', websafe);
		this.setButtonColor('#cInverse', invert);
		this.setButtonColor('#cSelect',  rgb);

		if (this.updateMode != 'click') {
			var cRgb = this.down('#cRgb').getEl(), cHue = this.down('#cHue').getEl(), hp = this.down('#huePicker').getEl();
			hp.moveTo(hp.getLeft(), cHue.getTop() + this.getHPos(this.down('#iHue').getValue()) - 7, true);
			this.down('#rgbPicker').getEl().moveTo(cRgb.getLeft() + this.getSPos(this.down('#iSat').getValue() / 100) - 7,
					cHue.getTop() + this.getVPos(this.down('#iVal').getValue() / 100) - 7, true);
		}
	},

	setButtonColor : function(id, rgb) {
		var me = this, dq = Ext.DomQuery, invert = me.invert(rgb);
		me.down(id).getEl().applyStyles({
			'background' : '#' + me.rgbToHex(rgb)
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
		var r, g, b, i, f, p, q, t;
		i = Math.floor((hsv.h / 60) % 6);
		f = (hsv.h / 60) - i;
		p = hsv.v * (1 - hsv.s);
		q = hsv.v * (1 - f * hsv.s);
		t = hsv.v * (1 - (1 - f) * hsv.s);
		switch (i) {
		case 0:
			r = hsv.v, g = t, b = p;
			break;
		case 1:
			r = q, g = hsv.v, b = p;
			break;
		case 2:
			r = p, g = hsv.v, b = t;
			break;
		case 3:
			r = p, g = q, b = hsv.v;
			break;
		case 4:
			r = t, g = p, b = hsv.v;
			break;
		case 5:
			r = hsv.v, g = p, b = q;
			break;
		}
		return {
			r: this.realToDec(r),
			g: this.realToDec(g),
			b: this.realToDec(b)
		};
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
		r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if (max == min) {
			h = 0; // achromatic
		} else {
			switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			}
			h /= 6;
		}

		return {
			h: h,
			s: s,
			v: v
		};
	}
});
