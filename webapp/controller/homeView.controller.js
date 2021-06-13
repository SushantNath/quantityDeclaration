var gmsgbundle;
var selectionValue;
var messageArray = [];
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
			var V = "1002206";

			if (ParameterData.startupParameters.orderNumber === undefined && ParameterData.startupParameters.operationNum === undefined) {
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

			}

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
					sap.ui.getCore().byId("idQU2").setValue(oData.ZquanUnit);

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

		//code for quantuty save

		fConfirm2: function(e) {
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
			var oModel = this.getOwnerComponent().getModel();
			//new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPTMPROD_CONF_SRV");
			var I = "/PO_CONFSet(Order='" + i + "',Operation='" + s + "',Reason='" + l + "',Number='" + n + "',Record='" + r + "',Logdate='" +
				d + "',Logtime='" + o + "',Unit='" + g + "',Yield='" + u + "')";
			var vmsg;

			//	var	selectionValue = "auto";
			var messageArray = [];

			//if selected radio button is automatic then trigger background job processing
			if (selectionValue === "auto") {

				console.log("Inside auto selection");

				if (n === "" || n === "0") {
					MessageBox.error("Please insert a number of operators");
					return;
				}
				// Added - 12152
				if (n > "3") {
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
									selectedArray.push(payloadObject);

									var aCreateDocPayload = selectedArray;
									oModel.setDeferredGroups(["backgroundConsumptionBatch"]);
									oModel.setUseBatch(true);

								}

								var mParameter = {

									urlParameters: null,
									groupId: "ReversalConsumptionBatch",
									success: function(oData, oRet) {

										//	var serverMessage = oRet.headers["sap-message"];

										//	console.log("Message from server", serverMessage);
										console.log("Inside mparameter success");
										//	sap.ui.core.BusyIndicator.hide();

									},
									error: function(oError) {
										console.log("Inside mparameter error");
										//	sap.ui.core.BusyIndicator.hide();

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
											sap.ui.core.BusyIndicator.hide();
											MessageBox.show("Consumption posted successfully", {
												icon: MessageBox.Icon.SUCCESS,
												title: "Dear User",
												actions: [sap.m.MessageBox.Action.CLOSE],

												onClose: function(r) {


	if (oData.Gvstag === "X") {
								
	var stagingUrl = "/PO_GETSet(Aufnr='" + i + "')";
	oModel.read(stagingUrl, {
							success: function(oData) {
								
									MessageToast.show("Automatic schedule staging triggered in background");
									
									     //Cross navigation to product monitor app
													sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
														target: {
															semanticObject: "ZPTM",
															action: "display"
														}

													});
								
							console.log("Inside staging success");
								},
								
								//	b.navTo("RouteView1");
							
							error: function(e) {
								
								console.log("Inside staging error");
							}
						});
	
	
	
								}

else {

                                             //Cross navigation to product monitor app
													sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
														target: {
															semanticObject: "ZPTM",
															action: "display"
														}

													});
													
}	
													
												}

											});

										} else {
											messageArray.push(JSON.parse(serverMessage).details);
											t.sapMessageDisplay();
											sap.ui.core.BusyIndicator.hide();
											return;
											// return;
										}

									},
									error: function(oError) {
										MessageBox.show("Error in background job processing", {
											icon: MessageBox.Icon.ERROR,
											title: "Dear User",
											actions: [sap.m.MessageBox.Action.OK]

										});
									}

								};
								for (var m = 0; m < aCreateDocPayload.length; m++) {

									singleentry.properties = aCreateDocPayload[m];
									singleentry.changeSetId = "changeset " + m;
									oModel.createEntry("/PO_POSTSet", singleentry);

								}
								oModel.submitChanges(mParameter);
								//	b.navTo("RouteView1");
							}
						});

						t._oDialog2.close();
						var d = "/PO_GETSet(Aufnr='" + i + "',Vornr='" + s + "')";
						var o = "Title";
						oModel.read(d, {
							success: function(e) {
								V = e;
								if (e.Gv_msg1 !== "") {
									MessageBox.error(e.Gv_msg1);
									return;
								}
								console.log("Inside create success");
								//	b.navTo("RouteView1");
							},
							error: function(e) {}
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
			else if (selectionValue === "manual") {
				if (this._oDialog2) {

					if (n === "" || n === "0") {
						MessageBox.error("Please insert a number of operators");
						return;
					}
					// Added - 12152
					if (n > "3") {
						MessageBox.error("The number of operators should be maximum 3. Please check your entry before proceeding");
						return;
					}
					// Added - 12152

					p.read(I, {

						success: function(oData) {

							//	p=oData;

							//	V = e;
							vmsg = oData.GvMsg;
							MessageBox.show(vmsg, {
								title: "Message",
								actions: [sap.m.MessageBox.Action.CLOSE],
								onClose: function(r) {
									if (oData.GvFlag === "") {
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
										var o = "Title";
										oModel.read(d, {
											success: function(e) {

												console.log("Inside success of create manual");

											},
											error: function(e) {

												console.log("Inside error function manual");

											}
										});
									}
									//	b.navTo("RouteView1");
								}
							});

							console.log("Inside  success manual");
						},
						error: function(oError) {
							console.log("Inside  error manual");
							//	sap.ui.core.BusyIndicator.hide();

						}

					});
				}
			}
			/////////
			else if (selectionValue === undefined) {
				MessageBox.show("Please select a consumption type");

			}

			/////////
		},

		sapMessageDisplay: function(e) {
			sap.ui.core.BusyIndicator.show();
			var messageArray2 = [];
			for (var m = 0; m < messageArray[0].length; m++) {

				messageArray2.push(messageArray[0][m]);

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
		//Close sap-message dialog
		handleClose: function(oEvent) {
			/* This function closes the dialog box */
			if (this._oDialog) {

				this._oDialog.close();
			}
		}

	});
});