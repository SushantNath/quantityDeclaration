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