/*	fConfirm2: function(e) {
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
								if (oData.GvFlag === "X") {
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
		}, */
		
		
			/////////////////////////
						/*		var stagingUrl = "/PO_STAGSet(Aufnr='" + i + "')";
								oModel.read(stagingUrl, {
											success: function(oData) {
												
												var stagMessage = oData.GvString;

											//	MessageToast.show(stagMessage);
														MessageBox.show(stagMessage, {
								title: "Message",
								actions: [sap.m.MessageBox.Action.CLOSE],
								onClose: function(r) {
										sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
													target: {
														semanticObject: "ZPTM",
														action: "display"
													}

												});
								
								}
							});
												
												

										

												console.log("Inside staging success");
											},

											//	b.navTo("RouteView1");

											error: function(e) {

												console.log("Inside staging error");
											}
										});*/
										
										
										
										//fconfirm 2 final version
										
												fConfirm2: function(e) {

			// 	this._sTimeoutId = setTimeout(function() {
			// 	console.log("Display time out");
			// }.bind(this), 1000);

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
			// Convering the quantity unit from PC to PAL for specific oredr#
			// if (g === "PC") {
			// 	g = "PAL";
			// }

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

				var aCreateDocPayload = selectedArray;
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

							oModel.read(I, {
								success: function(oData) {
									vmsg = oData.GvMsg;

									MessageBox.show(vmsg, {
										title: "Message",
										actions: [sap.m.MessageBox.Action.CLOSE],
										onClose: function(r) {
											t.busyDialog.close();
											//Checking validation for consumption
											if (oData.GvFlag === "") {
												//Checking staging parameter

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
