/*global QUnit*/
import Controller from "clf/demo/sapui51402/demosapui51402/controller/Demoui5.controller";

QUnit.module("Demoui5 Controller");

QUnit.test("I should test the Demoui5 controller", function (assert: Assert) {
	const oAppController = new Controller("Demoui5");
	oAppController.onInit();
	assert.ok(oAppController);
});