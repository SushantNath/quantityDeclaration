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

			var processField;
			var startField;
			var that = this;
			//Activity information for for Last Activity blank

			var oActivityBlank = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Setup Start

			var oActivitySetupStart = {
				activity: [{
						actId: "R40",
						activityDes: "End Setup"
					}

				]
			};

			//Activity information for for Last Activity Setup End

			var oActivitySetupEnd = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing Start

			var oActivityProcessStart = {
				activity: [{
						actId: "B20",
						activityDes: "Start Failure"
					}, {
						actId: "B20",
						activityDes: "End Failure"
					}, {
						actId: "B30",
						activityDes: "Interrupt Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing Partial

			var oActivityProcessPartial = {
				activity: [{
						actId: "B20",
						activityDes: "Start Failure"
					}, {
						actId: "B20",
						activityDes: "End Failure"
					}, {
						actId: "B30",
						activityDes: "Interrupt Processing"
					}, {
						actId: "B40",
						activityDes: "End Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing Interrupt

			var oActivityProcessInterrupt = {
				activity: [{
						actId: "R10",
						activityDes: "Start Setup"
					}, {
						actId: "B10",
						activityDes: "Start Processing"
					}

				]
			};

			//Activity information for for Last Activity Processing End

			var oActivityProcessEnd = {
				activity: [{
						actId: "R40",
						activityDes: "No further confirmation"
					}

				]
			};

			this.oModel = this.getOwnerComponent().getModel();
			//	var e = sap.ui.core.UIComponent.getRouterFor(this);
			//	e.getRoute("RouteView1").attachMatched(this._onRouteFound, this);

			// var oConfirmModel = new sap.ui.model.json.JSONModel(jQuery.sap.getModulePath("com.sap.quantityDeclaration", "/Data.json"));
			//      this.getView().setModel(oConfirmModel, "confirmData");
			var n;
			var V;
			var t = this.getView();
	           n = "0030";
				V = "1000082";
 
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

			var b = this;
			var p = {};
			var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
			b.oModel.read(I, {
				success: function(oData) {
					p = oData;
					// if (oData.Gv_msg1 !== "") {
					// 	MessageBox.error(oData.Gv_msg1);
					// 	return;
					// }

					var i = oData.Igmng;
					var s = oData.Gmein;

					sap.ui.getCore().byId("idDate1").setDateValue(new Date);
					sap.ui.getCore().byId("idTime1").setDateValue(new Date);
					sap.ui.getCore().byId("idOrder1").setText(V);
					sap.ui.getCore().byId("idOper1").setText(n);
					sap.ui.getCore().byId("idWork1").setText(oData.Arbpl);
					sap.ui.getCore().byId("idDesc1").setText(oData.Ktext);
					sap.ui.getCore().byId("idMat1").setText(oData.Matnr);
					sap.ui.getCore().byId("idMatD1").setText(oData.Maktx);

					if (i === "") {
						s = "";
					}

					sap.ui.getCore().byId("idQact1").setText(oData.ZactDate);
					sap.ui.getCore().byId("idATime1").setText(oData.ZactTime);
					sap.ui.getCore().byId("idAStat1").setText(oData.ZactPro);
					sap.ui.getCore().byId("idAUnit1").setText(oData.ZactStart);
					processField = oData.ZactPro;
					startField = oData.ZactStart;

					if (processField === "Processing" && startField === "Start") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessStart);

					} else if (processField === "" && startField === "") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityBlank);

					} else if (processField === "Setup" && startField === "Start") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivitySetupStart);

					} else if (processField === "Setup" && startField === "End") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivitySetupEnd);

					} else if (processField === "Processing" && startField === "Partial") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessPartial);

					} else if (processField === "Processing" && startField === "Interrupt") {

						// Create an instance of JSON Model using the Employee data available above.
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessInterrupt);

					} else if (processField === "Processing" && startField === "End") {

					
						that.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessEnd);

					} 

					that.getView().setModel(that.oConfirmModel, "confirmData");
					var oDDL = sap.ui.getCore().byId("DropDown");
					var oDDLTemplate = new sap.ui.core.Item({
						key: "{confirmData>actId}",
						text: "{confirmData>activityDes}"
					});
					oDDL.setModel(that.oJson);
					oDDL.bindAggregation("items", "confirmData>/activity", oDDLTemplate);

				},
				error: function(e) {}
			});
			//	}

			this.fActClick();

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
		
		//code for post activity/save functionality
			fConfirm1: function (e) {
	
				var t = this;
				var i = sap.ui.getCore().byId("idOrder1").getText(); //Production order
				var s = sap.ui.getCore().byId("idOper1").getText(); //Operation
				var r = sap.ui.getCore().byId("DropDown").getSelectedKey(); //Confirmation type
			 	var d = sap.ui.getCore().byId("idDate1").getValue();//Date
				var logTime = sap.ui.getCore().byId("idTime1").getValue();
				var logtime1= (logTime.replace(":", ""));
				var o= (logtime1.replace(":", "")); //time
			 	var g = sap.ui.getCore().byId("idNumber1").getValue(); //Number of operators
			 	var comments = sap.ui.getCore().byId("commentsText").getValue(); // Comments
			     var n = "";//Yield
				 var l = "";  //unit
				// var i = "1000082";
				// var s ="0030";
			//	var d = "31.05.2021";
				// var logTime = "16:00:10";
				// var logtime1= (logTime.replace(":", ""));
				// var o= (logtime1.replace(":", ""));
			//	var g = "1";
			//	var u= "";
				// 	var n = "";
				// var l = "";
			//	var comments = "hello";
			//	var r = "B20";
				var reasonValue=sap.ui.getCore().byId("idReason1").getValue();
				var reasonRequire=sap.ui.getCore().byId("idLReason1").getRequired();
				var operatorValue= sap.ui.getCore().byId("idNumber1").getValue();
				var operatorRequire = 	sap.ui.getCore().byId("idLNumber1").getRequired();
			//	sap.ui.getCore().byId("idLNumber1").setRequired(true);
				var u = reasonValue;//Reason for deviation
				
				if(d===""|| o=== ""){ //date and time
					MessageBox.error("Please fill in all required fileds to proceed");
					return;
					
				}
				
					if(reasonValue==="" && reasonRequire=== true){ //Reason label and field
					MessageBox.error("Please fill in all required fileds to proceed");
						return;
				}
				
					if(operatorValue==="" && operatorRequire=== true){ //No. of operators
					MessageBox.error("Please fill in all required fileds to proceed");
						return;
				}
		
				var V = {};
				var vmsg;
				var b = sap.ui.core.UIComponent.getRouterFor(this);
				var p = this.getOwnerComponent().getModel();
					var y = ("Message");
			var I = "/PO_CONFSet(Order='" + i + "',Reason='" + u + "',Number='" + g + "',Operation='" + s + "',Record='" + r + "',Logdate='" +
					d + "',Logtime='" + o + "',Unit='" + l + "',Yield='" + n + "',Comments='" + comments + "')";
		//		var y = gmsgbundle.getText("Message");
				p.read(I, {
				//		p.read(I, null, null, false, function (e) {
					
						success: function (oData, Response) {

					
					console.log("Inside warehouse success function", oData.results);
				//	V = e;
					vmsg = Response.data.GvMsg;
					MessageBox.show(vmsg, {
						title: y,
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function (r) {
							if (Response.data.GvFlag === "") {
								t._oDialog1.close();
								var d = "/PO_GETSet(Aufnr='" + i + "',Vornr='" + s + "')";
								var o = gmsgbundle.getText("Title");
								t.oModel.read(d, {
									success: function (e) {
										V = e;
										if (e.Gv_msg1 !== "") {
											MessageBox.error(e.Gv_msg1);
											return;
										}
										
										else{
											
											
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				}

			});
										}
							
										var r = new sap.ui.model.json.JSONModel(V);
										sap.ui.getCore().setModel(r, "Idetails");
									
									},
									error: function (e) {
											console.log("Inside Error function  second");
									}
								});
							}
					
						} 
					});
				},

				error: function (oData, Response, oError) {
					console.log("Inside Error function first");
					MessageBox.show("Error in fetching records");                             
				}
					
				
				}) ;
		}

	});
});