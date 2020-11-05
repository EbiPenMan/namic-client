//----------------------------------------------------------//
// ProGraphGroup selfRotate Component                              //
// Author: Ebrahim Karimi                                   //
// Created Date: 30 Dec 2017                                //
// Last Modified Date: 9 Jun 2017                           //
//                                                          //
//                                                          //
// Description :                                            //
//   -Rotate the object around itself                       //
//                                                          //
//                                                          //
// Version: 1.0                                             //
//    -This is the first version                            //
//                                                          //
// Roadmap Next Version :                                   //
//                                                          //
//                                                          //
//----------------------------------------------------------//


let enRotateDirection = cc.Enum({
    ClockWise: -1,
    CounterClockWise: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        rotationSpeed: 90,
        RotateDirection: {
            default: enRotateDirection.ClockWise,
            type: enRotateDirection
        },
    },

    update: function (dt) {
        if (this.RotateDirection == enRotateDirection.ClockWise)
            this.node.angle -= dt * this.rotationSpeed;
        else
            this.node.angle += dt * this.rotationSpeed;

    },
});
