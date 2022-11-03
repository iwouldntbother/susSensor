console.log(
  "  _____                  _____                           \n / ____|                / ____|                          \n| (___  _   _ ___ _____| (___   ___ _ __  ___  ___  _ __ \n \\___ \\| | | / __|______\\___ \\ / _ \\ '_ \\/ __|/ _ \\| '__|\n ____) | |_| \\__       ____) |  __/ | | \\__ \\ (_) | |   \n|_____/ \\__,_|___/     |_____/ \\___|_| |_|___/\\___/|_|   \n"
);

let video;
let poseNet;
let poses = [];
let nose;
let susCategory;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  //   console.log('no. of people: '+poses.length)

  let noses = [];
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        text(j, keypoint.position.x, keypoint.position.y);

        // DEV MODE !!!!!
        // (j===0 || j===1) ? noses.push(pose.keypoints[j]) : null;
        j === 0 ? noses.push(pose.keypoints[j]) : null;

        if (j == 0) {
          push();
          imageMode(CENTER);
          //image(nose,keypoint.position.x, keypoint.position.y, 50, 50);
          pop();
          //text("NOSE", keypoint.position.x + -15, keypoint.position.y + 15);
        }
      }
    }
  }
  // console.log(noses.length);
  if (noses.length > 1) {
    dist = distanceBetweenPoints(noses[0].position, noses[1].position);
    console.log(dist);
    categories(dist);
    document.getElementById('data').innerHTML =
      'Distance: ' + dist + ', Number of faces:' + noses.length;
    document.getElementById('outputText').innerHTML =
      'You guys are ' + susCategory;
  } else {
    document.getElementById('outputText').innerHTML = '';
    document.getElementById('prettyDiv').style.backgroundColor = 'black';
  }
}

const distanceBetweenPoints = (p1, p2) => {
  let dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return dist;
};

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

const categories = (distance) => {
  if (distance > 250) {
    susCategory = 'strangers...';
    // document.getElementById('outputText').style.color = "black"
    document.getElementById('prettyDiv').style.backgroundColor = 'black';
  } else if (distance > 200) {
    susCategory = 'friends';
    // document.getElementById('outputText').style.color = "black"
    document.getElementById('prettyDiv').style.backgroundColor = 'black';
  } else if (distance > 150) {
    susCategory = 'friends (kinda sus)';
    // document.getElementById('outputText').style.color = "black"
    document.getElementById('prettyDiv').style.backgroundColor = 'black';
  } else if (distance > 100) {
    susCategory = 'in a relationship';
    // document.getElementById('outputText').style.color = "magenta"
    document.getElementById('prettyDiv').style.backgroundColor = 'magenta';
  } else if (distance > 0) {
    susCategory = 'already gettin nasty !!';
    // document.getElementById('outputText').style.color = "red"
    document.getElementById('prettyDiv').style.backgroundColor = 'red';
  }
};
