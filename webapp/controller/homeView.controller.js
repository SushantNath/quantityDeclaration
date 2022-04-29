var gmsgbundle;
var selectionValue;
var messageArray = [];
var processField;
var startField;
var processCheck;
var reason;
var recordType;
var globalFlag;
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

			// var n = "0010";
			// var V = "1003298";
			//"1000460";
			//"1002439";
			//"1002426";
			//	var V = "1002206";
			var that = this;

				if (ParameterData.startupParameters.orderNumber === undefined && ParameterData.startupParameters.operationNum === undefined) {
					console.log("passed order number is undefined ");

					var n = "0010";
			var V = "1003298";
				} else {

					console.log("passed order number is ", ParameterData.startupParameters.orderType);
					console.log("passed operation number is ", ParameterData.startupParameters.operationNum);

					if (ParameterData.startupParameters.orderType) {

						V = ParameterData.startupParameters.orderType[0]; // “Getting the Purchase Order Value passed along with the URL
						that.orderNumber = V;
					}

					if (ParameterData.startupParameters.operationNum) {

						n = ParameterData.startupParameters.operationNum[0]; // “Getting the Purchase Order Value passed along with the URL
						that.operationNum = n;
					}
					if (ParameterData.startupParameters.intOper) {

						var intOper = ParameterData.startupParameters.intOper[0]; // “Getting the Purchase Order Value passed along with the URL
						that.iOper = intOper;
					}
					if (ParameterData.startupParameters.intOperItem) {

						var intOperItem = ParameterData.startupParameters.intOperItem[0]; // “Getting the Purchase Order Value passed along with the URL
						that.iOperItem = intOperItem;
					}

				}  

			// var processField;
			// var startField;
			//	var that = this;
			this.orderValue = V;
			this.operationValue = n;

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

					var conversionValue = oData.Gmein;
					if (conversionValue === "PC") {
						conversionValue = "PAL";
					}
					
						//code check - sushant
						
		// 				  Promise.all([ that.getUnitValues()
		//      //  getUnitValues, quantityUnitValues
	    //   ]).then(
        //           that.quantityUnitValues());
						
						that.getUnitValues();
						
						// code check end- sushant
				//	sap.ui.getCore().byId("idQU2").setValue(conversionValue);//Sushant - 16394 - 26 April 2022

					processField = oData.ZactPro;
					startField = oData.ZactStart;
					processCheck = oData.Gv_msg2;
					reason = oData.Grund;
					recordType = oData.Satza;
					
				//	that. quantityUnitValues();

					console.log("start and processing fields are", processField, startField);

					////Validation check for product already confirmed

					var errorMessage1 = "Production order already finished.No further activity can be processed";
					var errorMessage2 = "Quantity declaration not possible. Check the sequence of confirmations";

					if (processCheck === "B40") {
						MessageBox.error(errorMessage1, {
							title: "Message",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function(r) {
								sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
									target: {
										semanticObject: "ZPTM",
										action: "display"
									},

									params: {
										"orderType": b.orderNumber,
										"operationNum": b.operationNum,
										"mode": "crossNavigation",
										"intOper": b.iOper,
										"intOperItem": b.iOperItem

									}

								});

							}

						});

					}
					if (processCheck !== "B10" && processCheck !== "B20" && processCheck !== "B40") {

						MessageBox.error(errorMessage2, {
							title: "Message",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function(r) {
								sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
									target: {
										semanticObject: "ZPTM",
										action: "display"
									},
									params: {
										"orderType": b.orderNumber,
										"operationNum": b.operationNum,
										"mode": "crossNavigation",
										"intOper": b.iOper,
										"intOperItem": b.iOperItem

									}

								});

							}

						});

					}
					// check for reason and record type
					if (reason === "0000" && recordType === "B20") {

						MessageBox.error(errorMessage2, {
							title: "Message",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function(r) {
								sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
									target: {
										semanticObject: "ZPTM",
										action: "display"
									},
									params: {
										"orderType": b.orderNumber,
										"operationNum": b.operationNum,
										"mode": "crossNavigation",
										"intOper": b.iOper,
										"intOperItem": b.iOperItem

									}

								});

							}

						});

					}

				}

			});

			var errorMessage1 = "Production order already finished.No further activity can be processed";
			var errorMessage2 = "Quantity declaration not possible. Check the sequence of confirmations";

			this.fQuantityClick();

		},
		
		// Code change by sushant , Wricef- 16394- 26 April 2022 - start
		
		//Code to fetch values for dropdown/ unit
		
			getUnitValues: function(e) {
				
			var	that = this;
			
			//promise function start
			
			 var that = this;
			 	var oModel = this.getOwnerComponent().getModel();
			 	var n = "0010";
			var V = "1003298";

//Expand
this.getOwnerComponent().getModel().read("/GET_UOMSet('78909')", {
    urlParameters: {
        $expand: "UOMNav"
    },
    success: function (oData) {
        var expandModel = new JSONModel(oData);
        that.getView().setModel(expandModel, "expandModel");
        that.getView().getModel("expandModel").refresh();
        console.log("Expand values are",expandModel)
    }
});

			/*	var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
  return new Promise(
	function(resolve, reject) {
				    oModel.read(I, {
					  success: function(oData) {
					    resolve(oData);
					  //  that.quantityUnitValues();
					    console.log("Inside promise success getUnitValues");
					  },
                      error: function(oResult) {
					    reject(oResult);
					     console.log("Inside promise error");
                      }
	                });
        }); */
			
			// oModel.read(I, {
			// 		  success: function(oData) {
					   
			// 		  //  that.quantityUnitValues();
			// 		    console.log("Inside promise success getUnitValues");
			// 		  },
   //                   error: function(oResult) {
					  
			// 		     console.log("Inside promise error");
   //                   }
	  //              });
			
			//Promise funtion end
			
			
				
				

					
					
					
			},
			
			quantityUnitValues: function(e) {
				
					var oModel = this.getOwnerComponent().getModel();
			 	var n = "0010";
			var V = "1003298";
				var I = "/PO_GETSet(Aufnr='" + V + "',Vornr='" + n + "')";
					oModel.read(I, {
					  success: function(oData) {
					   
					  //  that.quantityUnitValues();
					    console.log("Inside promise success quantityUnitValues");
					  },
                      error: function(oResult) {
					  
					     console.log("Inside promise error");
                      }
	                });
				
					//Activity information for for Last Activity Processing Start blank
					var modelValue;
                    var keyValue;
                    var that=this;
			var oActivityProcessStartBlank = {
				activity: [{

						actId: "B30",
						activityDes: "Interrupt Processing"
					}, {

						actId: "B40",
						activityDes: "End Processing"
					}, {

						actId: "B20",
						activityDes: "Start Failure"
					}

				]
			};
				
				
 // return new Promise(
	// function(resolve, reject) {
	// 			    oModel.read(I, {
	// 				  success: function(oData) {
	// 				    resolve(oData);
	// 				  //  that.quantityUnitValues();
	// 				    console.log("Inside promise success getUnitValues");
	// 				  },
 //                     error: function(oResult) {
	// 				    reject(oResult);
	// 				     console.log("Inside promise error");
 //                     }
	//                 });
 //       });
			
		
				
				
				this.oConfirmModel = new sap.ui.model.json.JSONModel(oActivityProcessStartBlank);
				modelValue = this.oConfirmModel;
					that.getView().setModel(that.oConfirmModel, "confirmData");
					var oDDL = sap.ui.getCore().byId("idQU2");
				//	oDDL.setSelectedKey("1000");
					// var oDDLTemplate = new sap.ui.core.Item({
					// 	key: "{confirmData>actId}",
					// 	text: "{confirmData>activityDes}"
					// });
					
					// oDDL.setModel(that.oJson);
					// oDDL.bindAggregation("items", "confirmData>/activity", oDDLTemplate);
					
					//////////////
					
						
		

// 	oDDL.onBeforeRendering=function() {
				
// 					that.getView().setModel(that.oConfirmModel, "confirmData");
// 			//	this.setSelectedText("B40");
    
// };


					
					sap.ui.getCore().byId("idQU2").bindItems({
            path: "confirmData>/activity",
            template: new sap.ui.core.Item({
          
                key: "{confirmData>actId}",
                text: "{confirmData>activityDes}"
            }),
            events: {
                dataReceived: function () {
                  
                }.bind(this)
            }
        });
        
        	oDDL.onAfterRendering=function() {
        		
        		var textValue= "Start Failure";
        		var i;
        		var defaultValue ;
        		
        		for(i=0;i<3;i++){
        		defaultValue = modelValue.oData['activity'][i].activityDes;
        		
        		if (defaultValue === textValue){
        			 keyValue= 	modelValue.oData['activity'][i].actId;
        			console.log("Key value is",keyValue);
        		}
        			
        		}
        		
        		
    //     		if(textValue === "Start Failure" ){
				// var keyValue= 	this.getSelectedKey();
				// //	that.getView().setModel(that.oConfirmModel, "confirmData");
				 this.setSelectedKey(keyValue);
    //     		}
    
        	};
				
			},

		
			// Code change by sushant , Wricef- 16394- 26 April 2022 - End

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

			var t = this;
			if (this._oDialog1) {
				this._oDialog1.close();

			}

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "ZPTM",
					action: "display"
				},
				params: {
					"orderType": t.orderNumber,
					"operationNum": t.operationNum,
					"mode": "crossNavigation",
					"intOper": t.iOper,
					"intOperItem": t.iOperItem

				}

			});

		},

		//code to handle change event for Confirmation type.
		changeConfirmation: function() {
			var confirmType = sap.ui.getCore().byId("DropDown")._getSelectedItemText();
			// validation for "reason for deviation" based on "confirmation type"
			if (confirmType === "End Failure") {
				sap.ui.getCore().byId("idReason1").setEnabled(true);
				sap.ui.getCore().byId("idLReason1").setRequired(true);

			} else {
				sap.ui.getCore().byId("idReason1").setEnabled(false);
				sap.ui.getCore().byId("idLReason1").setRequired(false);

			}

			//Validation for "No. of operators" based on "confirmation type"

			if (confirmType === "Start Setup" || confirmType === "Start Processing") {
				sap.ui.getCore().byId("idNumber1").setEnabled(false);
				sap.ui.getCore().byId("idLNumber1").setRequired(false);

			} else {
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
			//	BusyIndicator.show();
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

			var i = this.orderValue;
			var s = this.operationValue;
			//	var r = sap.ui.getCore().byId("idType2").getValue();
			var d = sap.ui.getCore().byId("idDate2").getValue();
			//	var o = "164059";
			//sap.ui.getCore().byId("idTime2").getValue();
			var logTime = sap.ui.getCore().byId("idTime2").getValue();
			var logtime1 = (logTime.replace(":", ""));
			var o = (logtime1.replace(":", "")); //time
			var u = sap.ui.getCore().byId("idQuan2").getValue();
			var g = "";
			//sap.ui.getCore().byId("idQU2").getSelectedItem(); //Sushant - 16394 - 26 April 2022
			var n = sap.ui.getCore().byId("idNumber2").getValue();
			var oModel = this.getOwnerComponent().getModel();
			var l = "";
			var r = "B20";

			// if (g === "PC") {
			// 	g = "PAL";
			// }

			var I = "/PO_CONFSet(Order='" + i + "',Operation='" + s + "',Reason='" + l + "',Number='" + n + "',Record='" + r + "',Logdate='" +
				d + "',Logtime='" + o + "',Unit='" + g + "',Yield='" + u + "')";

			oModel.read(I, {
				success: function(oData, Response) {

					var setRadio = oData.GvWork;

					if (setRadio === "1" || setRadio === "" || setRadio === 1) {
						sap.ui.getCore().byId("idAuto2").setSelected(true);
						selectionValue = "auto";
					} else if (setRadio === "2" || setRadio === 2) {
						sap.ui.getCore().byId("idManual2").setSelected(true);
						selectionValue = "manual";
					} else {
						console.log("value for Gvwork/radiobutton is", setRadio);
					}

					sap.ui.core.BusyIndicator.hide();
					console.log("Inside Po_confset success radio button", setRadio);
				},

				//	b.navTo("RouteView1");

				error: function(e) {
					sap.ui.core.BusyIndicator.hide();
					console.log("Inside Po_confset error  radio button");
				}
			});

		},


		//Selecttin event for automatic component consumption

		autoCompSel: function(e) {

			selectionValue = "auto";
		},

		//Selectton event for manual component consumption

		manualCompSel: function(e) {

			selectionValue = "manual";
		},

		// Selection event for no component consumption
		autoSel: function(e) {

			selectionValue = "nocomp";
		},

		//not used
		/*		fConfirm3: function(e) {
					///////////////////////////////////////////////////
	
	

			var t = this;
				var i = sap.ui.getCore().byId("idOrder2").getValue();
				var s = sap.ui.getCore().byId("idOper2").getValue();
				//	var r = sap.ui.getCore().byId("idType2").getValue();
				var d = sap.ui.getCore().byId("idDate2").getValue();
				//	var o = "164059";
				//sap.ui.getCore().byId("idTime2").getValue();
				var logTime = sap.ui.getCore().byId("idTime2").getValue();
				var logtime1 = (logTime.replace(":", ""));
				var o = (logtime1.replace(":", "")); //time
				var u = sap.ui.getCore().byId("idQuan2").getValue();
				var g = sap.ui.getCore().byId("idQU2").getValue();
				var n = sap.ui.getCore().byId("idNumber2").getValue();
				var oModel = t.getOwnerComponent().getModel();
				var l = "";
				var r = "B20";
				var selectedArray = [];
				var selectedArrayFlag = [];
				var payloadObject = {};
				
					//normal payload
				payloadObject.Lgnum = "4A10";
				payloadObject.Huident = "";
				payloadObject.MfgOrder = i;
				payloadObject.Quana = u;
				payloadObject.Altme = g;
				payloadObject.Operation = s;
				payloadObject.Psa = "";
				payloadObject.Flag = "";
				
					oModel.create("/PO_POSTSet", payloadObject, null, function (response) {
				console.log("Inside Success Create");
			}, function (Error) {
				//show error 
				console.log("Inside Error Create");
			});
	
		//////////////////////////////////////////////////	
					
					
				}, */

		//code for quantuty save

		fConfirm2: function(e) {

			// 	this._sTimeoutId = setTimeout(function() {
			// 	console.log("Display time out");
			// }.bind(this), 1000);
			globalFlag = "";
			messageArray = [];
			var t = this;
			var i = sap.ui.getCore().byId("idOrder2").getValue();
			var s = sap.ui.getCore().byId("idOper2").getValue();
			//	var r = sap.ui.getCore().byId("idType2").getValue();
			var d = sap.ui.getCore().byId("idDate2").getValue();
			//	var o = "164059";
			//sap.ui.getCore().byId("idTime2").getValue();
			var logTime = sap.ui.getCore().byId("idTime2").getValue();
			var logtime1 = (logTime.replace(":", ""));
			var o = (logtime1.replace(":", "")); //time
			var u = sap.ui.getCore().byId("idQuan2").getValue();
			var g = sap.ui.getCore().byId("idQU2").getValue();
			var n = sap.ui.getCore().byId("idNumber2").getValue();
			var oModel = t.getOwnerComponent().getModel();

			var l = "";
			var r = "B20";
			var selectedArray = [];
			var selectedArrayFlag = [];
			var payloadObject = {};
			var payloadObjectFlag = {};
			// Convering the quantity unit from PC to PAL for specific oredr#
			// if (g === "PC") {
			// 	g = "PAL";
			// }
			//normal payload
			payloadObject.Lgnum = "4A10";
			payloadObject.Huident = "";
			payloadObject.MfgOrder = i;
			payloadObject.Quana = u;
			payloadObject.Altme = g;
			payloadObject.Operation = s;
			payloadObject.Psa = "";
			payloadObjectFlag.Flag = "";

			//flagged payload
			payloadObjectFlag.Lgnum = "4A10";
			payloadObjectFlag.Huident = "";
			payloadObjectFlag.MfgOrder = i;
			payloadObjectFlag.Quana = u;
			payloadObjectFlag.Altme = g;
			payloadObjectFlag.Operation = s;
			payloadObjectFlag.Psa = "";
			payloadObjectFlag.Flag = "X";

			var l = "";

			var V = {};
			var b = sap.ui.core.UIComponent.getRouterFor(this);
			var p = this.getOwnerComponent().getModel();
			var oModel = this.getOwnerComponent().getModel();
			//new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
			var I = "/PO_CONFSet(Order='" + i + "',Operation='" + s + "',Reason='" + l + "',Number='" + n + "',Record='" + r + "',Logdate='" +
				d + "',Logtime='" + o + "',Unit='" + g + "',Yield='" + u + "')";
			var vmsg;

			//	var	selectionValue = "auto";
			var messageArray = [];
			// 	sap.ui.core.BusyIndicator.show();
			//if selected radio button is automatic then trigger background job processing
			if (selectionValue === "auto") {

				console.log("Inside auto selection");

				if (n === "" || n === "0" || n === 0) {
					MessageBox.error("Please insert a number of operators");
					return;
				}
				// Added - 12152
				if (n > 3 || n > "3") {
					MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
					return;
				}

				if (!t.busyDialog) {
					t.busyDialog = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.busyDialog", this);
					this.getView().addDependent(t.busyDialog);
				}
				t.busyDialog.open();

				selectedArray.push(payloadObject);
				selectedArrayFlag.push(payloadObjectFlag);

				var aCreateDocPayload = selectedArray;
				var aCreateDocPayloadFlag = selectedArrayFlag;
				oModel.setDeferredGroups(["backgroundConsumptionBatch"]);
				oModel.setUseBatch(true);
				//	sap.ui.core.BusyIndicator.show();

				var mParameter = {

					urlParameters: null,
					groupId: "ReversalConsumptionBatch",
					success: function(oData, oRet) {

						//	var serverMessage = oRet.headers["sap-message"];

						//	console.log("Message from server", serverMessage);
						console.log("Inside mparameter success");
						sap.ui.core.BusyIndicator.hide();

					},
					error: function(oError) {
						console.log("Inside mparameter error");
						sap.ui.core.BusyIndicator.hide();

					}
				};

				var singleentry = {
					groupId: "ReversalConsumptionBatch",
					urlParameters: null,
					success: function(oData, oRet) {
						console.log("Inside singleentry success");
						//The success callback function for each record

						var serverMessage = oRet.headers["sap-message"];

						if (serverMessage === undefined) {
							console.log("Inside if block for message toast");
							//call consumption

							// MessageBox.show("Consumption posted successfully", {
							// 				icon: MessageBox.Icon.SUCCESS,
							// 				title: "Dear User",
							// 				actions: [sap.m.MessageBox.Action.CLOSE],

							// 				onClose: function(r) {
							///////////////////////
							//            	this._sTimeoutId = setTimeout(function() {
							// console.log("Display time out");

							// if (globalFlag === "second") {
							//                      	t.busyDialog.close();

							//                      	////////////////////////////////////

							//                      	//////////////////////////////////

							// 	return;
							// }

							oModel.read(I, {
								success: function(oData) {
									vmsg = oData.GvMsg;

									if (globalFlag === "second") {
										/////////////////////////////////////
										if (oData.GvStag === "X") {
											// globalFlag = "";
											t.busyDialog.open();
											//Calling staging odata dervices
											var d = "/PO_STAGSet(Order='" + i + "')";
											var o = "Title";
											/*	oModel.read(d, {
													success: function(OData) {
														t.busyDialog.close();
														MessageBox.show(OData.GvString, {
															title: " Staging Message",
															actions: [sap.m.MessageBox.Action.CLOSE],
															onClose: function(r) {
																sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
																	target: {
																		semanticObject: "ZPTM",
																		action: "display"
																	},
																	params: {
																		"orderType": t.orderNumber,
																		"operationNum": t.operationNum,
																		"mode": "crossNavigation",
																		"intOper": t.iOper,
																		"intOperItem": t.iOperItem

																	}

																});

															}

														});
														t.busyDialog.close();
														sap.ui.core.BusyIndicator.hide();
														console.log("Inside success of PO_Stag");

													},
													error: function(OData) {
														//	sap.ui.core.BusyIndicator.hide();
														t.busyDialog.close();
														console.log("Inside error PO_stag");

													}
												});*/

											//	}
											//		});

										} // end bracket for GVstag
										else {

											sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
												target: {
													semanticObject: "ZPTM",
													action: "display"
												},
												params: {
													"orderType": t.orderNumber,
													"operationNum": t.operationNum,
													"mode": "crossNavigation",
													"intOper": t.iOper,
													"intOperItem": t.iOperItem

												}

											});

										}

										////////////////////////////////////////////

									} // closing if bracket for global flag
									//	if (globalFlag !== "second"){
									else {
										MessageBox.show(vmsg, {
											title: "Message",
											actions: [sap.m.MessageBox.Action.CLOSE],
											onClose: function(r) {
												t.busyDialog.close();
												//Checking validation for consumption
												if (oData.GvFlag === "") {
													//Checking staging parameter
													globalFlag = "second";
													//////////////////////////////////////////////////////
													for (var m = 0; m < aCreateDocPayloadFlag.length; m++) {

														singleentry.properties = aCreateDocPayloadFlag[m];
														singleentry.changeSetId = "changeset " + m;
														oModel.createEntry("/PO_POSTSet", singleentry);

													}
													oModel.submitChanges(mParameter);

													////////////////////Testing promise//////////////////////////

											/*		var promise = Promise.resolve();

													//Chain the promises
													promise = promise.then(function() {
														return;
													});

													promise.then(function() {
															//All done
														})
														.catch(function() {
															//Error somewhere. remaining not executed
														});  */

													/////////////////////////////////////////////////////////

													MessageBox.show("Consumption posted successfully", {
														icon: MessageBox.Icon.SUCCESS,
														title: "Dear User",
														actions: [sap.m.MessageBox.Action.CLOSE],

														onClose: function(r) {

															if (oData.GvStag === "X") {

																t.busyDialog.open();
																//Calling staging odata dervices
																var d = "/PO_STAGSet(Order='" + i + "')";
																var o = "Title";
																oModel.read(d, {
																	success: function(OData) {
																		t.busyDialog.close();
																		MessageBox.show(OData.GvString, {
																			title: " Staging Message",
																			actions: [sap.m.MessageBox.Action.CLOSE],
																			onClose: function(r) {
																				sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
																					target: {
																						semanticObject: "ZPTM",
																						action: "display"
																					},
																					params: {
																						"orderType": t.orderNumber,
																						"operationNum": t.operationNum,
																						"mode": "crossNavigation",
																						"intOper": t.iOper,
																						"intOperItem": t.iOperItem

																					}

																				});

																			}

																		});
																		t.busyDialog.close();
																		sap.ui.core.BusyIndicator.hide();
																		console.log("Inside success of PO_Stag");

																	},
																	error: function(OData) {
																		//	sap.ui.core.BusyIndicator.hide();
																		t.busyDialog.close();
																		console.log("Inside error PO_stag");

																	}
																});

																//	}
																//		});

															} // end bracket for GVstag
															else {

																sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
																	target: {
																		semanticObject: "ZPTM",
																		action: "display"
																	},
																	params: {
																		"orderType": t.orderNumber,
																		"operationNum": t.operationNum,
																		"mode": "crossNavigation",
																		"intOper": t.iOper,
																		"intOperItem": t.iOperItem

																	}

																});

															}

														}
													});

													//	}.bind(this), 1000); End bracket for timeout functionality

												} // end bracket for Gvflag
												/*	else if (oData.GvFlag !== "") {
														MessageBox.show(
															"For the operation the quantity declaration cannot be executed.Please select a different operation");
														return;
													} else {
														console.log("No Gvflag message");
													}*/
											}
										});

									} //closing bracket of else for global flag === second
									//	sap.ui.core.BusyIndicator.hide();
									console.log("Inside Po_confset success");
									t.busyDialog.close();
								},

								//	b.navTo("RouteView1");

								error: function(e) {
									sap.ui.core.BusyIndicator.hide();
									console.log("Inside Po_confset error");
									t.busyDialog.close();
								}
							});
							//		}.bind(this), 1000); //End bracket for timeout functionality
							///////////////////////////////////												
							//	}
							//	});

						} else {
							t.serverMessage = [];
							//	t.messageArray.push(JSON.parse(serverMessage).details);
							t.serverMessage.push(JSON.parse(serverMessage).details);
							t.sapMessageDisplay();
							t.busyDialog.close();
							//	sap.ui.core.BusyIndicator.hide();
							return;
							// return;
						}

					},
					error: function(oError) {
						t.busyDialog.close();

						MessageBox.show("Error in consumption", {
							icon: MessageBox.Icon.ERROR,
							title: "Dear user",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function() {

								sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
									target: {
										semanticObject: "ZPTM",
										action: "display"
									},
									params: {
										"orderType": t.orderNumber,
										"operationNum": t.operationNum,
										"mode": "crossNavigation",
										"intOper": t.iOper,
										"intOperItem": t.iOperItem

									}

								});

							}
						});

						/*	MessageBox.show("Error in consumption", {
								icon: MessageBox.Icon.ERROR,
								title: "Dear User",
								actions: [sap.m.MessageBox.Action.OK]

							}); */
					}

				};

				for (var m = 0; m < aCreateDocPayload.length; m++) {

					singleentry.properties = aCreateDocPayload[m];
					singleentry.changeSetId = "changeset " + m;
					oModel.createEntry("/PO_POSTSet", singleentry);

				}
				oModel.submitChanges(mParameter);

			}
			//if selected radio button is manual then trigger manual consumption
			//else {
			else if (selectionValue === "manual") {
				if (this._oDialog2) {

					if (n === "" || n === "0" || n === 0) {
						MessageBox.error("Please insert a number of operators");
						return;
					}
					// Added - 12152
					if (n > 3 || n > "3") {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
					// Added - 12152

					if (!t.busyDialog) {
						t.busyDialog = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.busyDialog", this);
						this.getView().addDependent(t.busyDialog);
					}
					t.busyDialog.open();

					var selectedArray2 = [];
					selectedArray2.push(payloadObject);

					var aCreateDocPayload2 = selectedArray2;
					oModel.setDeferredGroups(["backgroundConsumptionBatch2"]);
					oModel.setUseBatch(true);
					//	sap.ui.core.BusyIndicator.show();
					var mParameter2 = {

						urlParameters: null,
						groupId: "ReversalConsumptionBatch2",
						success: function(oData, oRet) {

							//	var serverMessage = oRet.headers["sap-message"];

							//	console.log("Message from server", serverMessage);
							console.log("Inside mparameter success 2");
							//	sap.ui.core.BusyIndicator.hide();

						},
						error: function(oError) {
							console.log("Inside mparameter error 2");
							//	sap.ui.core.BusyIndicator.hide();

						}
					};

					var singleentry2 = {
						groupId: "ReversalConsumptionBatch2",
						urlParameters: null,
						success: function(oData, oRet) {
							console.log("Inside singleentry success 2");
							//The success callback function for each record

							var serverMessage2 = oRet.headers["sap-message"];

							if (serverMessage2 === undefined) {
								console.log("Inside if block for message toast");

								oModel.read(I, {
									success: function(oData) {

										vmsg = oData.GvMsg;

										////////////////////////////////

										//	if (globalFlag === "second") {
										/////////////////////////////////////
										/*	if (oData.GvStag === "X") {
                                             // globalFlag = "";
															t.busyDialog.open();
															//Calling staging odata dervices
															var d = "/PO_STAGSet(Order='" + i + "')";
															var o = "Title";
													
															//		});

														} // end bracket for GVstag
														else {

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
															"mode": "crossNavigation",
															"application": "QuantityDeclaration"
														}
													});

														} */

										////////////////////////////////////////////

										//	} // closing if bracket for global flag

										//////////////////////////////////////

										// if (oData.GvFlag !== "") {
										// 	MessageBox.show("For the operation the quantity declaration cannot be executed.Please select a different operation");
										// 	return;
										// }
										t.busyDialog.close();
										MessageBox.show(vmsg, {
											title: "Message",
											actions: [sap.m.MessageBox.Action.CLOSE],
											onClose: function(r) {
												// Calling Post consumption App
												console.log("calling post consumption app");

												if (oData.GvFlag === "") {

													sap.ui.core.BusyIndicator.hide();

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
															"mode": "crossNavigation",
															"application": "QuantityDeclaration"
														}
													});
													//End bracket for Gvstag
												} //end bracket for GVflag */
												//	b.navTo("RouteView1");

												// 	else if  (oData.GvFlag !== ""){

												// 	MessageBox.show("For the operation the quantity declaration cannot be executed.Please select a different operation");
												// return;
												// 	}
												// 	else{
												// 		console.log("No Gvflag message");
												// 	}
											}
										});
										sap.ui.core.BusyIndicator.hide();
										console.log("Inside Po_confset success");
									},

									//	b.navTo("RouteView1");

									error: function(e) {
										sap.ui.core.BusyIndicator.hide();
										t.busyDialog.close();
										console.log("Inside Po_confset error");
									}
								});

							} else {
								t.serverMessage2 = [];
								//	t.messageArray.push(JSON.parse(serverMessage).details);
								t.serverMessage2.push(JSON.parse(serverMessage2).details);
								t.sapMessageDisplay2();
								t.busyDialog.close();
								//	sap.ui.core.BusyIndicator.hide();
								return;
								// return;
							}

						},
						error: function(oError) {
							t.busyDialog.close();
							//////////////////////////
							MessageBox.show("Error in consumption", {
								icon: MessageBox.Icon.ERROR,
								title: "Dear user",
								actions: [sap.m.MessageBox.Action.CLOSE],
								onClose: function() {

									sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
										target: {
											semanticObject: "ZPTM",
											action: "display"
										},
										params: {
											"orderType": t.orderNumber,
											"operationNum": t.operationNum,
											"mode": "crossNavigation",
											"intOper": t.iOper,
											"intOperItem": t.iOperItem

										}

									});

								}
							});

							//////////////////////
							/*	MessageBox.show("Error in consumption", {
									icon: MessageBox.Icon.ERROR,
									title: "Dear User",
									actions: [sap.m.MessageBox.Action.OK]

								}); */
						}

					};

					for (var m = 0; m < aCreateDocPayload2.length; m++) {

						singleentry2.properties = aCreateDocPayload2[m];
						singleentry2.changeSetId = "changeset " + m;
						oModel.createEntry("/PO_POSTSet", singleentry2);

					}
					oModel.submitChanges(mParameter2);

					/////////////////////////////////////
				}
			}
			/////////
			else if (selectionValue === undefined) {
				MessageBox.show("Please select a consumption type");

			}

			/////////
		},

		//Methods for busy indicator

		sapMessageDisplay: function(e) {
			//	sap.ui.core.BusyIndicator.show();
			var messageArray2 = [];
			for (var m = 0; m < this.serverMessage[0].length; m++) {

				messageArray2.push(this.serverMessage[0][m]);

			}

			var messageModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(messageModel, "messageModel");
			this.getView().getModel("messageModel").setProperty("/messageSet", messageArray2);
			sap.ui.core.BusyIndicator.hide();

			if (!this._oDialog) {
				//	this._oDialog = sap.ui.xmlfragment("com.bp.lubescustfinancial.fragments.OrderChangeHx", this);
				this._oDialog = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.serverMessage", this);
			}

			this.getView().addDependent(this._oDialog);
			this._oDialog.open();

			console.log("Inside sap message display");
		},
		sapMessageDisplay2: function(e) {
			//	sap.ui.core.BusyIndicator.show();
			var messageArrayManual = [];
			for (var m = 0; m < this.serverMessage2[0].length; m++) {

				messageArrayManual.push(this.serverMessage2[0][m]);

			}

			var messageModel2 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(messageModel2, "messageModel2");
			this.getView().getModel("messageModel2").setProperty("/messageSet2", messageArrayManual);
			sap.ui.core.BusyIndicator.hide();

			if (!this._oDialogManual) {
				//	this._oDialog = sap.ui.xmlfragment("com.bp.lubescustfinancial.fragments.OrderChangeHx", this);
				this._oDialogManual = sap.ui.xmlfragment("com.sap.quantityDeclaration.fragments.serverMessageManual", this);
			}

			this.getView().addDependent(this._oDialogManual);
			this._oDialogManual.open();

			console.log("Inside sap message display");
		},
		//Close sap-message dialog
		handleClose: function(oEvent) {
			/* This function closes the dialog box */
			if (this._oDialog) {

				this._oDialog.close();
			}
		},

		//Close sap-message dialog manual
		handleClose2: function(oEvent) {
			/* This function closes the dialog box */
			if (this._oDialogManual) {

				this._oDialogManual.close();
			}
		}

	});
});