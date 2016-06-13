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
					jugadores.sort(componentObj.methods.sortByGol);
					$(".figuras").each(function(i, val){
						var img = urlIndepth+"images/figuras/"+componentObj.methods.strImage(jugadores[i].nombre)+".png";
						$(this).find(".figura-foto").attr("src", img);
						$(this).find(".figura-nombre").html(componentObj.methods.strName(jugadores[i].nombre));
						$(this).find(".figura-pais").text(jugadores[i].pais);

						img = urlIndepth+"images/figuras/tenis/"+componentObj.methods.strImage(jugadores[i].nombre)+"_tenis.png";
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
							for (var i = 0; i < seleccion.tenis.length; i++) {
								var tenis = seleccion.tenis[i];
								var marca = marcas[tenis.marca];
								var modelo = marca.modelos[tenis.modelo];
								componentObj.methods.renderRow(this, tenis, marca, modelo);								
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
											"goles": tenis.goles
										};
									}else{
										selescs[id].goles += tenis.goles;
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
								componentObj.methods.renderRow(this, tenis, marca, modelo);	
							}
						}
					});
				},
				renderRow: function(content, tenis, marca, modelo){
					var gnralRow = $('<div class="row tenis-row"></div>').appendTo($(content));
					var colum1 = $('<div class="col-sm-3"></div>').appendTo($(gnralRow));
					var tenisImagen = $('<div class="tenis-imagen"></div>').appendTo($(colum1));
					var img = $('<img class="img-responsive img-center" src="">').appendTo($(tenisImagen));
					$('<span>'+modelo.nombre+'</span>').appendTo($(tenisImagen));
					$('<div class="col-sm-3 modelo"><span>'+modelo.nombre+'</span></div>').appendTo($(gnralRow));
					var marca = $('<div class="col-sm-2 marca"><span></span></div>').appendTo($(gnralRow));
					$('<div class="col-sm-2 goles"><span>'+tenis.goles+'</span></div>').appendTo($(gnralRow));
					var loquiero = '<div class="col-sm-2 loquiero">';
					loquiero +=	'<a href="'+modelo.link+'" target="_blank">';
					loquiero +=	'<span class="loquiero-img"><i class="fa fa-tag" aria-hidden="true"></i></span>';
					loquiero +=	'<span class="loquiero-txt">LO QUIERO</span></a></div>';
					$(loquiero).appendTo($(gnralRow));					
					$(img)
					  	.attr("src", urlIndepth+'images/tenis/'+(tenis.marca+tenis.modelo)+'.png') // Copy the src attr from the target <img>
					    .load(function() {
					      $(tenisImagen).height(this.height+30);
				  	});
					
				},
				resize: function(){
					if($(window).width() > 768){
						$("#table-header > .row").show();				
					}else{
						$("#table-header > .row").hide();
					}
				},
				showTeamsTenis: function(i, val){
					var tenis;					
					if($(val).hasClass("active")){
						$(".equipo-selector").removeClass("active");
						tenis = $("#gnral-tenis");
					}else{
						$(".equipo-selector").removeClass("active");
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
					output = componentObj.methods.specialChar(output);
					return output;
				},
				sortByGol: function(playerA, playerB){
					return playerB.goles - playerA.goles;
				},
				specialChar: function(string){
					string = string.replace("á", "a");
					string = string.replace("é", "e");
					string = string.replace("í", "i");
					string = string.replace("ó", "o");
					string = string.replace("ú", "u");
					string = string.replace("ü", "u");
					string = string.replace("Á", "A");
					string = string.replace("É", "E");
					string = string.replace("Í", "I");
					string = string.replace("Ó", "O");
					string = string.replace("Ú", "U");
					string = string.replace("ñ", "n");
					string = string.replace("Ñ", "N");
					return string;
				}
			}
		};
		return componentObj;
	};	
})(jQuery);