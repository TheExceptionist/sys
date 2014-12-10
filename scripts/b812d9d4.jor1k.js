function Terminal(a,b,c){this.nrows=a,this.ncolumns=b,this.canvas=document.getElementById(c),this.context=this.canvas.getContext("2d"),this.context.font="13px courier,fixed,swiss,monospace,sans-serif",this.cursorvisible=!1,this.escapetype=0,this.escapestring="",this.cursorx=0,this.cursory=0,this.scrolltop=0,this.scrollbottom=this.nrows-1,this.currentcolor=7,this.pauseblink=!1,this.screen=new Array(this.nrows),this.color=new Array(this.nrows);for(var d=0;d<this.nrows;d++){this.screen[d]=new Array(this.ncolumns),this.color[d]=new Array(this.ncolumns);for(var e=0;e<this.ncolumns;e++)this.screen[d][e]=0,this.color[d][e]=this.currentcolor}this.ScreenUpdate(),this.Blink()}function TerminalInput(a){this.CTRLpressed=!1,this.ALTpressed=!1,this.uart=a,this.enabled=!0}function Ethernet(a){this.url=a,this.onmessage=function(){},this.OpenSocket()}function EthernetMessageHandler(a){a.data instanceof ArrayBuffer?this.onmessage(a):0==a.data.toString().indexOf("ping:")&&this.socket.send("pong:"+a.data.toString().substring(5))}function EthernetCloseHandler(){console.log("Websocket closed. Reopening."),this.OpenSocket()}function EthernetErrorHandler(a){console.error("Websocket error:"),console.error(a)}var Colors=new Array("#000000","#BB0000","#00BB00","#BBBB00","#0000BB","#BB00BB","#00BBBB","#BBBBBB","#555555","#FF5555","#55FF55","#FFFF55","#5555FF","#FF55FF","#55FFFF","#55FFFF");Terminal.prototype.PauseBlink=function(a){a=!!a,this.pauseblink=a,this.cursorvisible=!a,this.PlotRow(this.cursory)},Terminal.prototype.Blink=function(){this.cursorvisible=!this.cursorvisible,this.pauseblink||this.PlotRow(this.cursory),window.setTimeout(this.Blink.bind(this),500)},Terminal.prototype.DeleteRow=function(a){for(var b=0;b<this.ncolumns;b++)this.screen[a][b]=0,this.color[a][b]=7;this.PlotRow(a)},Terminal.prototype.DeleteArea=function(a,b,c,d){for(var e=a;c>=e;e++){for(var f=b;d>=f;f++)this.screen[e][f]=0,this.color[e][f]=7;this.PlotRow(e)}},Terminal.prototype.PlotRow=function(a){var b=this.color[a][0],c=0,d="",e=this.color[this.cursory][this.cursorx];this.cursorvisible&&(this.color[this.cursory][this.cursorx]|=1536);for(var f=0;f<this.ncolumns;f++)b!=this.color[a][f]&&(this.context.fillStyle=Colors[b>>>8&31],this.context.fillRect(8*c,16*a,8*(f-c),16),this.context.fillStyle=Colors[31&b],this.context.fillText(d,8*c,16*(a+1)-4),d="",b=this.color[a][f],c=f),d+=0==this.screen[a][f]?" ":String.fromCharCode(this.screen[a][f]);this.context.fillStyle=Colors[b>>>8&31],this.context.fillRect(8*c,16*a,8*(this.ncolumns-c),16),this.context.fillStyle=Colors[31&b],this.context.fillText(d,8*c,16*(a+1)-4),this.color[this.cursory][this.cursorx]=e},Terminal.prototype.ScreenUpdate=function(){for(var a=0;a<this.nrows;a++)this.PlotRow(a)},Terminal.prototype.ScrollDown=function(){return this.cursory!=this.scrolltop?(this.cursory--,void(this.cursorvisible&&(this.PlotRow(this.cursory+1),this.PlotRow(this.cursory)))):void this.ScrollDown2()},Terminal.prototype.ScrollDown2=function(a){for(var b=this.scrollbottom-1;b>=this.scrolltop;b--)if(b!=this.nrows-1){for(var c=0;c<this.ncolumns;c++)this.screen[b+1][c]=this.screen[b][c],this.color[b+1][c]=this.color[b][c];a&&this.PlotRow(b+1)}this.DeleteRow(this.scrolltop),a&&this.PlotRow(this.scrolltop)},Terminal.prototype.ScrollUp=function(a){for(var b=this.scrolltop+1;b<=this.scrollbottom;b++)if(0!=b){for(var c=0;c<this.ncolumns;c++)this.screen[b-1][c]=this.screen[b][c],this.color[b-1][c]=this.color[b][c];a&&this.PlotRow(b-1)}this.DeleteRow(this.scrollbottom),a&&this.PlotRow(this.scrollbottom)},Terminal.prototype.LineFeed=function(){return this.cursory!=this.scrollbottom?(this.cursory++,void(this.cursorvisible&&(this.PlotRow(this.cursory-1),this.PlotRow(this.cursory)))):void this.ScrollUp(!0)},Terminal.prototype.Scroll=function(a){if(0>a){a=-a;for(var b=0;d>b;b++)DeleteRow(b)}this.ScreenUpdate()},Terminal.prototype.ChangeCursor=function(a){switch(a.length){case 0:this.cursorx=0,this.cursory=0;break;case 1:this.cursory=a[0],this.cursory&&this.cursory--;break;case 2:default:this.cursory=a[0],this.cursorx=a[1],this.cursorx&&this.cursorx--,this.cursory&&this.cursory--}this.cursorx>=this.ncolumns&&(this.cursorx=this.ncolumns-1),this.cursory>=this.nrows&&(this.cursory=this.nrows-1)},Terminal.prototype.ChangeColor=function(a){for(var b=0;b<a.length;b++)switch(Number(a[b])){case 30:case 31:case 32:case 33:case 34:case 35:case 36:case 37:this.currentcolor=-8&this.currentcolor|a[b]-30&7;break;case 40:case 41:case 42:case 43:case 44:case 45:case 46:case 47:this.currentcolor=255&this.currentcolor|(a[b]-40&7)<<8;break;case 0:this.currentcolor=7;break;case 1:this.currentcolor|=10;break;case 7:this.currentcolor=(15&this.currentcolor)<<8|this.currentcolor>>8&15;break;case 39:this.currentcolor=-8&this.currentcolor|7;break;case 49:this.currentcolor=255&this.currentcolor;break;case 10:break;default:DebugMessage("Color "+a[b]+" not found")}},Terminal.prototype.HandleEscapeSequence=function(){var a=0;if("[J"==this.escapestring)return this.DeleteArea(this.cursory,this.cursorx,this.cursory,this.ncolumns-1),void this.DeleteArea(this.cursory+1,0,this.nrows-1,this.ncolumns-1);if("M"==this.escapestring)return void this.ScrollDown2(!0);var b=this.escapestring;if("["!=b.charAt(0))return void DebugMessage("Escape sequence unknown:'"+this.escapestring+"'");b=b.substr(1);var c=b.substr(b.length-1);b=b.substr(0,b.length-1);var d=b.split(";");for(0==d[0].length&&(d=[]),a=0;a<d.length;a++)d[a]=Number(d[a]);var e=this.cursory,f=0;switch(c){case"l":for(var a=0;a<d.length;a++)switch(d[a]){default:DebugMessage("Term Parameter unknown "+d[a])}break;case"m":return void this.ChangeColor(d);case"A":f=d.length?d[0]:1,0==f&&(f=1),this.cursory-=f;break;case"B":f=d.length?d[0]:1,0==f&&(f=1),this.cursory+=f;break;case"C":f=d.length?d[0]:1,0==f&&(f=1),this.cursorx+=f;break;case"D":f=d.length?d[0]:1,0==f&&(f=1),this.cursorx-=f,this.cursorx<0&&(this.cursorx=0);break;case"E":f=d.length?d[0]:1,this.cursory+=f,this.cursorx=0;break;case"F":f=d.length?d[0]:1,this.cursory-=f,this.cursory<0&&(this.cursory=0),this.cursorx=0;break;case"G":f=d.length?d[0]:1,this.cursorx=f,this.cursorx&&this.cursorx--;break;case"H":case"d":case"f":this.ChangeCursor(d);break;case"K":f=d.length?d[0]:1,d.length?1==d[0]?this.DeleteArea(this.cursory,0,this.cursory,this.cursorx):2==d[0]&&this.DeleteRow(this.cursory):this.DeleteArea(this.cursory,this.cursorx,this.cursory,this.ncolumns-1);break;case"L":f=d.length?d[0]:1,0==f&&(f=1);var g=this.scrolltop;if(this.scrolltop=this.cursory,1==f)this.ScrollDown2(!0);else{for(var h=0;f-1>h;h++)this.ScrollDown2(!1);this.ScrollDown2(!0)}this.scrolltop=g;break;case"M":f=d.length?d[0]:1,0==f&&(f=1);var g=this.scrolltop;if(this.scrolltop=this.cursory,1==f)this.ScrollUp(!0);else{for(var h=0;f-1>h;h++)this.ScrollUp(!1);this.ScrollUp(!0)}this.scrolltop=g;break;case"P":f=d.length?d[0]:1,0==f&&(f=1);for(var i=0,h=this.cursorx+f;h<this.ncolumns;h++)this.screen[this.cursory][this.cursorx+i]=this.screen[this.cursory][h],this.color[this.cursory][this.cursorx+i]=this.color[this.cursory][h],i++;this.DeleteArea(this.cursory,this.ncolumns-f,this.cursory,this.ncolumns-1),this.PlotRow(this.cursory);break;case"r":return void(0==d.length?(this.scrolltop=0,this.scrollbottom=this.nrows-1):(this.scrolltop=d[0],this.scrollbottom=d[1],this.scrolltop&&this.scrolltop--,this.scrollbottom&&this.scrollbottom--));case"X":f=d.length?d[0]:1,0==f&&(f=1);for(var h=0;f>h;h++)this.screen[this.cursory][this.cursorx+h]=0;break;default:DebugMessage("Escape sequence unknown:'"+this.escapestring+"'")}this.cursorvisible&&(this.PlotRow(this.cursory),this.cursory!=e&&this.PlotRow(e))},Terminal.prototype.PutChar=function(a){if(2==this.escapetype)return this.escapestring+=String.fromCharCode(a),void(a>=64&&126>=a&&(this.HandleEscapeSequence(),this.escapetype=0));if(0==this.escapetype&&27==a)return this.escapetype=1,void(this.escapestring="");if(1==this.escapetype)return this.escapestring+=String.fromCharCode(a),91==a?void(this.escapetype=2):(this.HandleEscapeSequence(),void(this.escapetype=0));switch(a){case 10:return this.LineFeed(),void document.dispatchEvent(new CustomEvent("jor1k_terminal_put_char",{detail:{character:"\n"}}));case 13:return void(this.cursorx=0);case 7:return;case 8:return this.cursorx--,this.cursorx<0&&(this.cursorx=0),void this.PlotRow(this.cursory);case 9:var b=8-(7&this.cursorx);do this.cursorx>=this.ncolumns&&(this.PlotRow(this.cursory),this.LineFeed(),this.cursorx=0),this.screen[this.cursory][this.cursorx]=32,this.color[this.cursory][this.cursorx]=this.currentcolor,this.cursorx++;while(b--);return void this.PlotRow(this.cursory);case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 11:case 12:case 14:case 15:case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 23:case 24:case 25:case 26:case 27:case 28:case 29:case 30:case 31:return void DebugMessage("unknown character "+a)}this.cursorx>=this.ncolumns&&(this.LineFeed(),this.cursorx=0);var c=this.cursorx,d=this.cursory;this.screen[d][c]=a,document.dispatchEvent(new CustomEvent("jor1k_terminal_put_char",{detail:{character:String.fromCharCode(a)}})),this.color[d][c]=this.currentcolor,this.cursorx++,this.PlotRow(this.cursory)},TerminalInput.prototype.OnKeyPress=function(a){if(this.enabled){var b=0;return b=a.charCode,0==b?!1:(this.CTRLpressed&&(b>=65&&90>=b||b>=97&&122>=b)&&(b&=31),this.uart.ReceiveChar(b),!1)}},TerminalInput.prototype.OnKeyUp=function(a){if(this.enabled){{var b=a.keyCode;a.charCode}return 17==b?this.CTRLpressed=!1:18==b&&(this.ALTpressed=!1),!1}},TerminalInput.prototype.OnKeyDown=function(a){if(this.enabled){{var b=a.keyCode;a.charCode}if(this.CTRLpressed&&!this.ALTpressed&&b>=65&&90>=b)return this.uart.ReceiveChar(b-32&31),a.preventDefault(),!1;switch(b){case 16:return;case 38:return this.uart.ReceiveChar(16),a.preventDefault(),!1;case 37:return this.uart.ReceiveChar(2),a.preventDefault(),!1;case 40:return this.uart.ReceiveChar(14),a.preventDefault(),!1;case 36:return this.uart.ReceiveChar(1),a.preventDefault(),!1;case 35:return this.uart.ReceiveChar(5),a.preventDefault(),!1;case 33:return this.uart.ReceiveChar(21),a.preventDefault(),!1;case 34:return this.uart.ReceiveChar(22),a.preventDefault(),!1;case 39:return this.uart.ReceiveChar(6),a.preventDefault(),!1;case 46:return this.uart.ReceiveChar(4),a.preventDefault(),!1;case 17:return void(this.CTRLpressed=!0);case 18:return void(this.ALTpressed=!0)}return 0!=b&&31>=b?(this.uart.ReceiveChar(b),a.preventDefault(),!1):void 0}},Ethernet.prototype.OpenSocket=function(){this.url?(this.socket=new WebSocket(this.url),this.socket.binaryType="arraybuffer",this.socket.onmessage=EthernetMessageHandler.bind(this),this.socket.onclose=EthernetCloseHandler.bind(this),this.socket.onerror=EthernetErrorHandler.bind(this)):this.socket={send:function(){}}},Ethernet.prototype.SendFrame=function(a){this.socket.send(a)},Ethernet.prototype.Close=function(){this.socket.onclose=void 0,this.socket.close()};