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
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

//#region Modules
// How to load in modules
const Scene = require('Scene');
const Materials = require('Materials');
const CI = require('CameraInfo');
const R = require('Reactive');

// Use export keyword to make a symbol available in scripting debug console
const Diagnostics = require('Diagnostics');
//#endregion

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

Diagnostics.log('script executing');
const width = CI.previewSize.width.div(CI.previewScreenScale);
const height = CI.previewSize.height.div(CI.previewScreenScale);

function userReadySignals(trackingPoints) {
  /**
   * This function loops through the available tracking points and returns true if the user is ready to start the game
   * it determines if the user is ready by checking if the user's tracking points are all 10 pixels or farther away
   * from the border of the screen
   * it is assumed that it is fine if feet are not in the frame.
   */
   Diagnostics.log('Calling is UserReady');
  const signals = [];
  for (let element of trackingPoints) {
    // we are in async code so the asignments here create signals
    // Therefore we must use pinLastValue to get the last value
    if (element.name != 'leftAnkle' && element.name != 'rightAnkle') {
        signals.concat(element.transform.position.x.gt(width.mul(.05)).or(
          element.transform.position.x.lt(width.sub(.05)).or(
            element.transform.position.y.gt(height.mul(.05)).or(
              element.transform.position.y.lt(height.sub(.05))))));
    }
  };
  return signals;
}

(async function () {  // Enables async/await in JS [part 1]

  Diagnostics.log('script executing in async');
  // To access scene objects
  const [trackingPoints, material0, material1] = await Promise.all([
    Scene.root.findByPath('**/TrackingPointCanvas/*'),
    Materials.findFirst('material0'),
    Materials.findFirst('material1')
  ]);

  // const userReady = R.andList(userReadySignals(trackingPoints));
  Diagnostics.log(trackingPoints[0].name);
  const userReady = trackingPoints[0].transform.position.x.gt(width.mul(.05)).or(
    trackingPoints[0].transform.position.x.lt(width.sub(.05)).or(
      trackingPoints[0].transform.position.y.gt(height.mul(.05)).or(
        trackingPoints[0].transform.position.y.lt(height.sub(.05)))));
  Diagnostics.watch('userReady', userReady);
  trackingPoints[0].material = material0; 
  trackingPoints.forEach(element => {
    // we are in async code so the asignments here create signals
    // Therefore we must use pinLastValue to get the last value
    const signalx = element.transform.position.x.pinLastValue();
    const signaly = element.transform.position.y.pinLastValue();
    Diagnostics.log(element.name + ' ' + signalx + ', ' + signaly);
    element.material = material1 ? userReady : material0;
  });

})(); // Enables async/await in JS [part 2]
