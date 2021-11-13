/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

// Script for Simple Timer Example Project v87

// How to load in modules
const Scene = require('Scene');
const Patches = require('Patches');
const Reactive = require('Reactive');

Promise.all([

    Scene.root.findFirst('TimerCountText'),

]).then(function (results) {

    const timerCountText = results[0];

    // Get the timer ready
    reset();
    start();

    function reset() {

        Patches.inputs.setPulse('SendReset', Reactive.once());

    }

    function start() {

        Patches.outputs.getScalar('TimerCountValue').then(timerCountValue => {

            timerCountValue.monitor({ fireOnInitialValue: true }).subscribe(function (timerEvent) {

                timerCountText.text = timerEvent.newValue.toString();

            });

        });
    }

});
