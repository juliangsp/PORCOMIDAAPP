/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_list = {
	data : {},
	pageDiv : "#list",
	init : function(data,template){
		ctrl_list.data = data;
		ctrl_list.render();
	},
	render : function(){

		var data  = {
			items : [
				{
				 url:"#infoSuc",
				 nSucursal: "Miramontes 2",
				 distancia:"1.2 km.",
				 tags: "Afinación, Suspensión, Frenos",
				 direccion: "Miramontes #412, Alameda Central",
				 estado:"Mexico D.F.",
				 cp:"13230",
				 tel1:"(55) 5863-2285"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Coacalco",
				 distancia:"1.6 km.",
				 tags: "Mecánica en General",
				 direccion: "Blvd. Coacalco 75 esquina con calle Via ",
				 estado:"Estado de México.",
				 cp:"55700",
				 tel1:"(55) 5879-3485"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Power Center",
				 distancia:"1.8 km.",
				 tags: "Mecánica en General, Suspensiones",
				 direccion: "Av. Vía José López Portillo # 2 FS-03 ",
				 estado:"Estado de México.",
				 cp:"55712",
				 tel1:"(551) 548-4145"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Ecatepec",
				 distancia:"2.4 km.",
				 tags: "Suspensiones, Amortiguadores",
				 direccion: "Av. 1º de Mayo s/n Lote 1, manzana 3",
				 estado:"Estado de México.",
				 cp:"55075",
				 tel1:"(55) 5854-3853"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Ecatepec via Morelos",
				 distancia:"3.1 km.",
				 tags: "Mecánica en General",
				 direccion: "Blvd. Coacalco 75 esquina con calle Via ",
				 estado:"Estado de México.",
				 cp:"55900",
				 tel1:"(55) 5770-8012"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Miramontes 2",
				 distancia:"1.2 km.",
				 tags: "Afinación, Suspensión, Frenos",
				 direccion: "Miramontes #412, Alameda Central",
				 estado:"Mexico D.F.",
				 cp:"13230",
				 tel1:"(55) 5863-2285"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Coacalco",
				 distancia:"1.6 km.",
				 tags: "Mecánica en General",
				 direccion: "Blvd. Coacalco 75 esquina con calle Via ",
				 estado:"Estado de México.",
				 cp:"55700",
				 tel1:"(55) 5879-3485"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Power Center",
				 distancia:"1.8 km.",
				 tags: "Mecánica en General, Suspensiones",
				 direccion: "Av. Vía José López Portillo # 2 FS-03 ",
				 estado:"Estado de México.",
				 cp:"55712",
				 tel1:"(551) 548-4145"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Ecatepec",
				 distancia:"2.4 km.",
				 tags: "Suspensiones, Amortiguadores",
				 direccion: "Av. 1º de Mayo s/n Lote 1, manzana 3",
				 estado:"Estado de México.",
				 cp:"55075",
				 tel1:"(55) 5854-3853"
				},
				{
				 url:"#infoSuc",
				 nSucursal: "Ecatepec via Morelos",
				 distancia:"3.1 km.",
				 tags: "Mecánica en General",
				 direccion: "Blvd. Coacalco 75 esquina con calle Via ",
				 estado:"Estado de México.",
				 cp:"55900",
				 tel1:"(55) 5770-8012"
				},
			
				
			
			]
		}

		var mainObj = template.render('#listT',ctrl_list.pageDiv,data)

		mainObj.on('listDetail',function(){
			$.mobile.changePage( "#infoSuc", {
			  //transition: "slide",
			 // reverse: false,
			 // changeHash: true
			});
		});

		$(ctrl_list.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true })
		

	}
}