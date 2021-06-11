var gmsgbundle;

sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter", "sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState", "sap/ui/model/FilterOperator"
], function(Controller, MessageToast, MessageBox, BusyIndicator, Filter, JSONModel, ValueState, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.quantityDeclaration.controller.homeView", {

		onInit: function() {

			var ParameterData = this.getOwnerComponent().getComponentData();
				gmsgbundle = this.getOwnerComponent().getModel("i18n");
				
				var n = "0020";
			var	V = "1002206";
				
				/*	if (ParameterData.startupParameters.orderNumber === undefined && ParameterData.startupParameters.operationNum === undefined){
 console.log("passed order number is undefined ");

				n = "0030";
				V = "1000082";
			} else {

 console.log("passed order number is ", ParameterData.startupParameters.orderType);
 console.log("passed operation number is ", ParameterData.startupParameters.operationNum);

				if (ParameterData.startupParameters.orderType) {

					V = ParameterData.startupParameters.orderType[0]; // “Getting the Purchase Order Value passed along with the URL

				}

				if (ParameterData.startupParameters.operationNum) {

					n = ParameterData.startupParameters.operationNum[0]; // “Getting the Purchase Order Value passed along with the URL

				}

			}  */

			var processField;
			var startField;
			var that = this;
			
			var oModel = this.getOwnerComponent().getModel();
				var b = this;
			// 		var n;
			// var V;
			var t = this.getView();
	          
			var p = {};
			var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
			oModel.read(I, {
				success: function(oData) {
					p = oData;
					
					// 	if (oData.Gv_msg1 !== "") {
					// 	MessageBox.error(oData.Gv_msg1);
					// 	return;
					// }
			
				
					sap.ui.getCore().byId("idOrder2").setValue(V);
			sap.ui.getCore().byId("idOper2").setValue(n);
			sap.ui.getCore().byId("idWork2").setValue(oData.Arbpl);
			sap.ui.getCore().byId("idDesc2").setValue(oData.Ktext);
			sap.ui.getCore().byId("idMat2").setValue(oData.Matnr);
			sap.ui.getCore().byId("idMatD2").setValue(oData.Maktx);
			sap.ui.getCore().byId("idQact2").setValue(oData.ZquanDate);
			sap.ui.getCore().byId("idATime2").setValue(oData.ZquanTime);
			sap.ui.getCore().byId("idAStat2").setValue(oData.ZquanPro);
			sap.ui.getCore().byId("idAUnit2").setValue(oData.ZquanUnit);
			sap.ui.getCore().byId("idDate2").setDateValue(new Date);
			sap.ui.getCore().byId("idTime2").setDateValue(new Date);
				
				

				/*	var i = oData.Igmng;
					var s = oData.Gmein;

					sap.ui.getCore().byId("idDate1").setDateValue(new Date);
					sap.ui.getCore().byId("idTime1").setDateValue(new Date);
					sap.ui.getCore().byId("idOrder1").setValue(V);
					sap.ui.getCore().byId("idOper1").setValue(n);
					sap.ui.getCore().byId("idWork1").setValue(oData.Arbpl);
					sap.ui.getCore().byId("idDesc1").setValue(oData.Ktext);
					sap.ui.getCore().byId("idMat1").setValue(oData.Matnr);
					sap.ui.getCore().byId("idMatD1").setValue(oData.Maktx);

					if (i === "") {
						s = "";
					}

					sap.ui.getCore().byId("idQact1").setValue(oData.ZactDate);
					sap.ui.getCore().byId("idATime1").setValue(oData.ZactTime);
					sap.ui.getCore().byId("idAStat1").setValue(oData.ZactPro);
					sap.ui.getCore().byId("idAUnit1").setValue(oData.ZactStart);
					sap.ui.getCore().byId("idConf").setText(oData.Satza);
					sap.ui.getCore().byId("idReason").setText(oData.Grund);
					processField = oData.ZactPro;
					startField = oData.ZactStart;
					// reasonField= oData.Grund;
					// confirmationField= oData.Satza; */
				}
				
			});

			this.fQuantityClick();

		},

		fActClick: function(e) {

			//odata fetching logic

			var t = this.getView();
			if (!this._oDialog1) {
				this._oDialog1 = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.act", this);
				this.getView().addDependent(this._oDialog1);
			}

			this._oDialog1.open();
		},

		// code for pop up close and cross navigation
		closeDialog: function(e) {
			if (this._oDialog1) {
				this._oDialog1.close();
			}

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				}

			});

		},
		
		//code to handle change event for Confirmation type.
		changeConfirmation: function() {
		var confirmType	= sap.ui.getCore().byId("DropDown")._getSelectedItemText();
		// validation for "reason for deviation" based on "confirmation type"
		if(confirmType === "End Failure"){
			sap.ui.getCore().byId("idReason1").setEnabled(true);
				sap.ui.getCore().byId("idLReason1").setRequired(true);
			
		}
		else{
			sap.ui.getCore().byId("idReason1").setEnabled(false);	
				sap.ui.getCore().byId("idLReason1").setRequired(false);
			
		}
		
		//Validation for "No. of operators" based on "confirmation type"
		
			if(confirmType === "Start Setup" || confirmType === "Start Processing"){
			sap.ui.getCore().byId("idNumber1").setEnabled(false);
				sap.ui.getCore().byId("idLNumber1").setRequired(false);
			
		}
		else{
			sap.ui.getCore().byId("idNumber1").setEnabled(true);
				sap.ui.getCore().byId("idLNumber1").setRequired(true);
			
		}
		//set values to balnk on change of confirmation type
		sap.ui.getCore().byId("idReason1").setValue("");
		sap.ui.getCore().byId("idReason1").setDescription("");
		sap.ui.getCore().byId("commentsText").setValue("");	
		sap.ui.getCore().byId("idNumber1").setValue("");
		
		
		},

		//  code to get value help "Reason for deviation"
		onReasonF4: function() {

			var e = sap.ui.getCore().byId("idOrder1").getText();
			BusyIndicator.show();
			if (!this._ReasonDialog) {
				this._ReasonDialog = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.value", this);
			}
			//	var t = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");

			var oModel = this.oModel;
			oModel.read("/GET_REASONSet", {
				filters: [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, e)],
				urlParameters: {
					$expand: "F4ReasonNav"
				},
				success: function(oData, t) {
					BusyIndicator.hide();
					var a = new sap.ui.model.json.JSONModel(oData.results[0].F4ReasonNav);
					this._ReasonDialog.setModel(a, "oReasonModel");
				}.bind(this),
				error: function(e) {
					BusyIndicator.hide();
				}.bind(this)
			});
			this._ReasonDialog.open();
		},
		//code to select a specific reason for deviation from value help
		onReasonF4Confirm: function(e) {

			var t = e.getParameter("selectedItem");
			sap.ui.getCore().byId("idReason1").setValue(t.getTitle());
			sap.ui.getCore().byId("idReason1").setDescription(t.getInfo());
		},
		
		//code to open quantity decaration fragment
				fQuantityClick: function(e) {
			var t = this.getView();
			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.quan", this);
				this.getView().addDependent(this._oDialog2);
			}
		this._oDialog2.open();
			
				},
				
				//code for quantuty save
				
					fConfirm2: function(e) {
		//	messageArray = [];
			var t = this;
			var i = sap.ui.getCore().byId("idOrder2").getValue();
			var s = sap.ui.getCore().byId("idOper2").getValue();
		//	var r = sap.ui.getCore().byId("idType2").getValue();
			var d = sap.ui.getCore().byId("idDate2").getValue();
			var o = "164059";
			//sap.ui.getCore().byId("idTime2").getValue();
			var u = sap.ui.getCore().byId("idQuan2").getValue();
			var g = sap.ui.getCore().byId("idQU2").getValue();
			var n = sap.ui.getCore().byId("idNumber2").getValue();
			var oModel = t.getOwnerComponent().getModel();
			var l = "";
			var r ="B20";
			var selectedArray = [];
			var payloadObject = {};

			payloadObject.Lgnum = "4A10";
			payloadObject.Huident = "";
			payloadObject.MfgOrder = i;
			payloadObject.Quana = u;
			payloadObject.Altme = g;
			payloadObject.Operation = s;
			payloadObject.Psa = "";

			var l = "";

			var V = {};
			var b = sap.ui.core.UIComponent.getRouterFor(this);
			var p = this.getOwnerComponent().getModel();
			//new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
			var I = "/PO_CONFSet(Order='" + i + "',Operation='" + s + "',Reason='" + l + "',Number='" + n + "',Record='" + r + "',Logdate='" +
				d + "',Logtime='" + o + "',Unit='" + g + "',Yield='" + u + "')";
			var vmsg ;
			
		var	selectionValue = "auto";
		var messageArray=[];

			//if selected radio button is automatic then trigger background job processing
			if (selectionValue === "auto") {

				console.log("Inside auto selection");

				if (n === "" || n === "0") {
					MessageBox.error("Please insert a number of operators");
					return;
				}
				// Added - 12152
					if (n > "3" ) {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
					// Added - 12152

				////////////////////////////////////////////

				p.read(I, {
				success: function(oData) {
					p = oData;
		        	console.log("Inside success function");
		        	
		        	/////////////////////////////////
		        		vmsg = oData.GvMsg;
		        	
		        				MessageBox.show(vmsg, {
						title: "Message",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function(r) {
							if (oData.GvFlag === "") {
								// Calling background processing
                         sap.ui.core.BusyIndicator.show();
							

							}
							//	b.navTo("RouteView1");
						}
					});
		        	
		        	////////////////////////////////////////

				},
				error: function(e) {
					console.log("Inside error function");
				}
			});
			}
			//if selected radio button is manual then trigger manual consumption
			//else {
           else if(selectionValue === "manual") { 
				if (this._oDialog2) {

					if (n === "" || n === "0") {
						MessageBox.error("Please insert a number of operators");
						return;
					}
					// Added - 12152
					if (n > "3" ) {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
					// Added - 12152
				
					p.read(I, null, null, false, function(e) {
						V = e;
						vmsg = V.GvMsg;
						MessageBox.show(vmsg, {
							title: y,
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function(r) {
								if (e.GvFlag === "") {
									// Calling Post consumption App
									if (sap.ui.getCore().byId("idManual2").getSelected()) {
										sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
											target: {
												semanticObject: "ZpostCons_semobj",
												action: "display"
											},
											params: {
												"Warehouse": "4A10",
												"ManufacturingOrder": i,
												"Operation": s,
												"Quantity": u,
												"Unit": g,
												"mode": "crossNavigation"
											}
										});
									}
									//
									t._oDialog2.close();
									var d = "/PO_GETSet(Aufnr='" + i + "',Vornr='" + s + "')";
									var o = gmsgbundle.getText("Title");
									t.oModel.read(d, {
										success: function(e) {
											V = e;
											if (e.Gv_msg1 !== "") {
												MessageBox.error(e.Gv_msg1);
												return;
											}
											
											console.log("Inside success of create");
										/*	t.getView().byId("idNumber").setValue(e.ANZMA);
											t.getView().byId("idWork").setValue(e.Arbpl);
											t.getView().byId("idDesc").setValue(e.Ktext);
											t.getView().byId("idMat").setValue(e.Matnr);
											t.getView().byId("idMatD").setValue(e.Maktx);
											t.getView().byId("idQuan").setValue(e.Gamng);
											t.getView().byId("idQU").setValue(e.Gmein);
											t.getView().byId("idQConf").setValue(e.Igmng);
											var i = e.Igmng;
											var s = e.Gmein;
											if (i === "") {
												s = "";
											}
											t.getView().byId("idQCon").setValue(s);
											t.getView().byId("idLast").setValue(e.ZquanDate);
											t.getView().byId("idQTime").setValue(e.ZquanTime);
											t.getView().byId("idQStat").setValue(e.ZquanPro);
											t.getView().byId("idQUnit").setValue(e.ZquanUnit);
											var r = new sap.ui.model.json.JSONModel(V);
											sap.ui.getCore().setModel(r, "Idetails");
											b.navTo("RouteView1");*/
										},
										error: function(e) {}
									});
								}
								b.navTo("RouteView1");
							}
						});
					});
				}
			}
			/////////
			else if(selectionValue === "nocomp") { 
				if (this._oDialog2) {

					if (n === "" || n === "0") {
						MessageBox.error("Please insert a number of operators");
						return;
					}
					
					// Added - 12152
					if (n > "3" ) {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
					// Added - 12152
				
					p.read(I, null, null, false, function(e) {
						V = e;
						vmsg = V.GvMsg;
						MessageBox.show(vmsg, {
							title: y,
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function(r) {
								if (e.GvFlag === "") {
									t._oDialog2.close();
									var d = "/PO_GETSet(Aufnr='" + i + "',Vornr='" + s + "')";
									var o = gmsgbundle.getText("Title");
									t.oModel.read(d, {
										success: function(e) {
											V = e;
											if (e.Gv_msg1 !== "") {
												MessageBox.error(e.Gv_msg1);
												return;
											}
											t.getView().byId("idNumber").setValue(e.ANZMA);
											t.getView().byId("idWork").setValue(e.Arbpl);
											t.getView().byId("idDesc").setValue(e.Ktext);
											t.getView().byId("idMat").setValue(e.Matnr);
											t.getView().byId("idMatD").setValue(e.Maktx);
											t.getView().byId("idQuan").setValue(e.Gamng);
											t.getView().byId("idQU").setValue(e.Gmein);
											t.getView().byId("idQConf").setValue(e.Igmng);
											var i = e.Igmng;
											var s = e.Gmein;
											if (i === "") {
												s = "";
											}
											t.getView().byId("idQCon").setValue(s);
											t.getView().byId("idLast").setValue(e.ZquanDate);
											t.getView().byId("idQTime").setValue(e.ZquanTime);
											t.getView().byId("idQStat").setValue(e.ZquanPro);
											t.getView().byId("idQUnit").setValue(e.ZquanUnit);
											var r = new sap.ui.model.json.JSONModel(V);
											sap.ui.getCore().setModel(r, "Idetails");
											b.navTo("RouteView1");
										},
										error: function(e) {}
									});
								}
								b.navTo("RouteView1");
							}
						});
					});
				}
			}
			/////////
		}
		

	});
});