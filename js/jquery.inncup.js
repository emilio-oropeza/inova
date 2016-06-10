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
			methods:{
				init:function(){
					componentObj.methods.displayBrands();
					componentObj.methods.displayFigures();
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
					$(".figuras").each(function(i, val){
						var img = urlIndepth+"images/figuras/"+componentObj.methods.strImage(jugadores[i].nombre)+".png";
						$(this).find(".figura-foto").attr("src", img);
						$(this).find(".figura-nombre").text(jugadores[i].nombre);
						$(this).find(".figura-pais").text(jugadores[i].pais);

						img = urlIndepth+"images/tenis/"+componentObj.methods.strImage((jugadores[i].tenis.marca+jugadores[i].tenis.modelo))+".png";
						var modeloTxt = marcas[jugadores[i].tenis.marca].marca;
						modeloTxt += " "+ marcas[jugadores[i].tenis.marca].modelos[jugadores[i].tenis.modelo].nombre;
						var goles = (jugadores[i].goles < 10)?("0"+jugadores[i].goles):jugadores[i].goles;

						$(this).find(".figura-tenis-foto").attr("src", img);
						$(this).find(".figura-tenis-modelo").text(modeloTxt);
						$(this).find(".figura-goles").text(goles);
					});
				},
				strImage: function(string){
					var output = string.replace(" ", "");
					output = componentObj.methods.specialChar(output);
					return output.toLowerCase();
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