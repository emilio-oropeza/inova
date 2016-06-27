(function($){
	$.fn.inncup = function(){
		return this.each(function() {
			var element = $(this);						
			if (element.data('inncup')) return;
			var myplugin = new Inncup(this);
			element.data('inncup', myplugin);
			element.data('inncup').methods.init();			
		});
	};
	
	var Inncup = function(target){
		var componentObj = {
			active: false,
			methods:{
				init:function(){
					componentObj.methods.displayBrands();
					componentObj.methods.displayTeams();
					componentObj.methods.displayFigures();
					$(window).resize(componentObj.methods.resize);
					$(".equipo-selector").each(function(i, val){
						$(this).click(function(){
							componentObj.methods.showTeamsTenis(i, val);
						});
					});
					$("#vertodos").click(function(){
						componentObj.methods.showTeamsTenis(-1, null);
					});
				},
				displayBrands: function(){
					//marcas.sort()
					$(".marcas").each(function(i, val){						
						var brand = marcas[$(this).data("marca")];
						var img = urlIndepth+"images/marcas/"+componentObj.methods.strImage(brand.marca)+".png";
						var goles = (brand.goles < 10)?("0"+brand.goles):brand.goles;
						$(this).find("img").attr("src", img);
						$(this).find("span").text(goles);
					});
				},
				displayFigures: function(){
					//jugadores.sort(componentObj.methods.sortByName);
					//jugadores.sort(componentObj.methods.sortByGol);
					$(".figuras").each(function(i, val){
						var img = urlIndepth+"images/figuras/"+componentObj.methods.strImage(jugadores[i].nombre)+".png";
						$(this).find(".figura-foto").attr("src", img);
						$(this).find(".figura-nombre").html(componentObj.methods.strName(jugadores[i].nombre));
						$(this).find(".figura-pais").text(jugadores[i].pais);

						img = urlIndepth+'images/tenis3/'+(jugadores[i].tenis.marca+jugadores[i].tenis.modelo)+'.png';
						var modeloTxt = marcas[jugadores[i].tenis.marca].marca;
						modeloTxt += " "+ marcas[jugadores[i].tenis.marca].modelos[jugadores[i].tenis.modelo].nombre;
						var goles = (jugadores[i].goles < 10)?("0"+jugadores[i].goles):jugadores[i].goles;

						$(this).find(".figura-tenis-foto").attr("src", img);
						$(this).find(".figura-tenis-modelo").text(modeloTxt);
						$(this).find(".figura-goles").text(goles);
					});
				},
				displayTeams: function(){
					$(".tenis-equipos").each(function(x, val){
						var seleccion;
						if(x < selecciones.length){
							seleccion = selecciones[x];
							$(this).data("pais", seleccion.nombre);
							seleccion.tenis.sort(componentObj.methods.sortByGol);
							for (var i = 0; i < seleccion.tenis.length; i++) {
								var tenis = seleccion.tenis[i];
								var marca = marcas[tenis.marca];
								var modelo = marca.modelos[tenis.modelo];
								componentObj.methods.renderRow(i, this, tenis, marca, modelo);								
							}
						}else{
							var selescs = {};
							var seleccion = [];
							for (var i = 0; i < selecciones.length; i++) {
								var s = selecciones[i];
								for (var j = 0; j < s.tenis.length; j++) {
									var tenis = s.tenis[j];
									var id = tenis.marca + tenis.modelo;
									if(!(id in selescs)){
										selescs[id] = {
											"marca": tenis.marca,
											"modelo": tenis.modelo,
											"goles": tenis.goles,
											"jugadores": tenis.jugadores
										};
									}else{
										selescs[id].goles += tenis.goles;
										//selescs[id].jugadores.push(tenis.jugadores);
										for (var k = 0; k < tenis.jugadores.length; k++) {
											var jug = tenis.jugadores[k];
											selescs[id].jugadores.push(jug);
										}
									}						
								}
							}							
							for (var key in selescs) {
								seleccion.push(selescs[key]);
							}
							seleccion.sort(componentObj.methods.sortByGol);
							for (var i = 0; i < seleccion.length; i++) {
								var tenis = seleccion[i];
								var marca = marcas[tenis.marca];
								var modelo = marca.modelos[tenis.modelo];
								componentObj.methods.renderRow(i, this, tenis, marca, modelo);	
							}
						}
					});
				},
				renderRow: function(place, content, tenis, marca, modelo){
					var gnralRow = $('<div class="row tenis-row"></div>').appendTo($(content));
					$('<div class="col-sm-1 numeracion"><span>'+(place+1)+'</span></div>').appendTo($(gnralRow));
					var colum1 = $('<div class="col-sm-3"></div>').appendTo($(gnralRow));
					var tenisImagen = $('<div class="tenis-imagen"></div>').appendTo($(colum1));
					var img = $('<img class="img-responsive img-center" src="">').appendTo($(tenisImagen));
					$('<span>'+modelo.nombre+'</span>').appendTo($(tenisImagen));
					var jugadorDiv = $('<div class="col-sm-3 modelo"><span></span></div>').appendTo($(gnralRow));
					$('<div class="col-sm-2 marca"><span>'+marca.marca+'</span></div>').appendTo($(gnralRow));
					$('<div class="col-sm-1 goles"><span>'+tenis.goles+'</span></div>').appendTo($(gnralRow));
					var loquiero = '<div class="col-sm-2 loquiero"><div>';
					loquiero +=	'<a href="'+modelo.link+'" target="_blank">';
					loquiero +=	'<span class="loquiero-img"><i class="fa fa-tag" aria-hidden="true"></i></span>';
					loquiero +=	'<span class="loquiero-txt">LO QUIERO</span></a></div></div>';
					$(loquiero).appendTo($(gnralRow));					
					$(img)
					  	.attr("src", urlIndepth+'images/tenis3/'+(tenis.marca+tenis.modelo)+'.png') // Copy the src attr from the target <img>
					    .load(function() {
					      $(tenisImagen).height(this.height+30);
				  	});
				    var text = "";
				    var x = 0;
				    var total = 1;
					for (var i = 0; i < tenis.jugadores.length; i++) {
						if( i == 2 && tenis.jugadores.length > 3){
							text += '<span class="mas-btn">...</span>';
						}
						text += "<span>"+tenis.jugadores[i]+ "</span>";	
					}
					var x = (tenis.jugadores.length >= 3)?3:tenis.jugadores.length;
					var players = $('<div class="players'+x+'" data-total="'+tenis.jugadores.length+'">'+text+'</div>').appendTo($(jugadorDiv));
					
					var masBtn = $(players).find(".mas-btn");
					$(masBtn).on("click", function(){
						var total = $(this).parent().data("total");
						var height = total * 25;
						componentObj.methods.resizeTenis(this, gnralRow, height);
						$(window).resize(function() {
							componentObj.methods.resizeTenis(this, gnralRow, height);
						});
					});
				},
				resize: function(){
					if($(window).width() > 768){
						$("#table-header > .row").show();				
					}else{
						$("#table-header > .row").hide();
					}
				},
				resizeTenis: function(mas, gnralRow, height){					
					$(mas).parent().height(height);
					$(mas).hide();
					if($(window).width() > 768){
						//$(mas).parent().parent().css({"height":"100%"});
						$(gnralRow).find(".modelo").css({"height":"100%"});
						$(gnralRow).height((height+50));
					}else{
						//$(mas).parent().parent().height(height);
						$(gnralRow).find(".modelo").height(height);
						$(gnralRow).css({"height":"auto"});
					}
				},
				showTeamsTenis: function(i, val){
					var tenis;					
					if(i < 0 || $(val).hasClass("active")){
						$(".equipo-selector").removeClass("active");
						$("#vertodos").addClass("active");
						tenis = $("#gnral-tenis");
					}else{
						$(".equipo-selector").removeClass("active");
						$("#vertodos").removeClass("active");
						tenis = $(".tenis-equipos").get(i);
						$(val).addClass("active");
					}
					$(".tenis-equipos").hide();
					$(tenis).fadeIn("slow");
				},
				strImage: function(string){
					var output = string.replace(" ", "");
					output = componentObj.methods.specialChar(output);
					return output.toLowerCase();
				},
				strName: function(string){
					var output = string.replace(" ", "<br>");
					//output = componentObj.methods.specialChar(output);
					return output;
				},
				sortByGol: function(playerA, playerB){
					return playerB.goles - playerA.goles;
				},
				sortByName: function(playerA, playerB){
					var A = playerA.nombre.toLowerCase();
					var B = playerB.nombre.toLowerCase();
					if (A < B){
						return -1;
					}else if (A > B){
						return  1;
					}else{
						return 0;
					}
				},
				specialChar: function(string){
					string = string.replace(new RegExp("á", 'g'), "a");
					string = string.replace(new RegExp("é", 'g'), "e");
					string = string.replace(new RegExp("è", 'g'), "e");
					string = string.replace(new RegExp("í", 'g'), "i");
					string = string.replace(new RegExp("ó", 'g'), "o");
					string = string.replace(new RegExp("ú", 'g'), "u");
					string = string.replace(new RegExp("ü", 'g'), "u");
					string = string.replace(new RegExp("Á", 'g'), "A");
					string = string.replace(new RegExp("É", 'g'), "E");
					string = string.replace(new RegExp("Í", 'g'), "I");
					string = string.replace(new RegExp("Ó", 'g'), "O");
					string = string.replace(new RegExp("Ú", 'g'), "U");
					string = string.replace(new RegExp("ñ", 'g'), "n");
					string = string.replace(new RegExp("Ñ", 'g'), "N");
					return string;
				}
			}
		};
		return componentObj;
	};	
})(jQuery);