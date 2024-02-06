let results;

let bodyParts = [
	"nose",
	"lefteye",
	"rightEye",
	"leftEar",
	"rightEar",
	"leftShoulder",
	"rightShoulder",
	"leftElbow",
	"rightElbow",
	"leftWrist",
	"rightWrist",
	"leftHip",
	"rightHip",
	"leftKnee",
	"rightKnee",
	"leftAnkle",
	"rightAnkle"
];

let svgTyping = `<svg viewBox="0 0 24 12" style="position: relative; display: inline-block; height: 1em; width: auto">
    <circle r="2" cx="4" cy="10" fill="currentColor">
      <animate attributeName="cy" values="10; 3; 10" dur="1.5s" begin="0s" repeatCount="indefinite" keyTimes="0;0.75;1" keySplines="1 0 1 0 1 0 1 0" calcMode="spline" />
    </circle>
    <circle r="2" cx="12" cy="10" fill="currentColor">
      <animate attributeName="cy" values="10; 3; 10" dur="1.5s" begin="-0.4s" repeatCount="indefinite" keyTimes="0;0.75;1" keySplines="1 0 1 0 1 0 1 0" calcMode="spline" />
    </circle>
    <circle r="2" cx="20" cy="10" fill="currentColor">
      <animate attributeName="cy" values="10; 3; 10" dur="1.5s" begin="-0.8s" repeatCount="indefinite" keyTimes="0;0.75;1" keySplines="1 0 1 0 1 0 1 0" calcMode="spline" />
    </circle>
  </svg>`;

/* function to calculate a point on a line between 2 points that is 3 past the end point and lies on the line */
function pointOnLine(x1, y1, x2, y2, distance) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let length = Math.sqrt(dx * dx + dy * dy);
	let x3 = x2 + dx * (distance / length);
	let y3 = y2 + dy * (distance / length);
	return { x: x3, y: y3 };
}

/* functions to calculate a point perpendicular to a line and 5px away between 2 points that is 3 past the end point and lies on the line */
function pointPerpendicularToLine(x1, y1, x2, y2, distance) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let length = Math.sqrt(dx * dx + dy * dy);
	let x3 = x2 + dx * (distance / length);
	let y3 = y2 + dy * (distance / length);
	let x4 = x3 + dy * (distance / length);
	let y4 = y3 - dx * (distance / length);
	return { x: x4, y: y4 };
}
function pointPerpendicularToLine2(x1, y1, x2, y2, distance) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let length = Math.sqrt(dx * dx + dy * dy);
	let x3 = x2 + dx * (distance / length);
	let y3 = y2 + dy * (distance / length);
	let x4 = x3 - dy * (distance / length);
	let y4 = y3 + dx * (distance / length);
	return { x: x4, y: y4 };
}

/* function to calculate a point perpendicular to a point at the end of a line and 5px above at a right angle with the line */
function perpendicular(x1, y1, x2, y2, distance) {
	let x = x2 - x1;
	let y = y2 - y1;
	let length = Math.sqrt(x * x + y * y);
	let x3 = x2 - (distance * y) / length;
	let y3 = y2 + (distance * x) / length;
	return { x: x3, y: y3 };
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/* write a function to find the midpoint on a line between 2 x,y points */
function midpoint(x1, y1, x2, y2) {
	return {
		x: (x1 + x2) / 2,
		y: (y1 + y2) / 2
	};
};

const imgHW = (image) => {
	let w = image.clientWidth;
	let h = image.clientHeight;
	return [w, h];
};

function boneBetween(x1, y1, x2, y2) {
	let boneEndCenter1 = pointOnLine(x2, y2, x1, y1, 3);
	let boneEndCenter2 = pointOnLine(x1, y1, x2, y2, 3);

	let boneCurve1L = pointPerpendicularToLine(x2, y2, x1, y1, 5);
	let boneCurve1R = pointPerpendicularToLine2(x2, y2, x1, y1, 5);
	let boneCurve2L = pointPerpendicularToLine(x1, y1, x2, y2, 5);
	let boneCurve2R = pointPerpendicularToLine2(x1, y1, x2, y2, 5);

	let boneEnd1L = perpendicular(x2, y2, x1, y1, 2);
	let boneEnd1R = perpendicular(x2, y2, x1, y1, -2);
	let boneEnd2L = perpendicular(x1, y1, x2, y2, 2);
	let boneEnd2R = perpendicular(x1, y1, x2, y2, -2);

	let bonePath = `<path class="bone" d="
		M ${boneEnd1L.x} ${boneEnd1L.y}
		Q ${boneCurve1R.x} ${boneCurve1R.y} ${boneEndCenter1.x} ${boneEndCenter1.y} 
		Q ${boneCurve1L.x} ${boneCurve1L.y} ${boneEnd1R.x} ${boneEnd1R.y}
		L ${boneEnd2L.x} ${boneEnd2L.y} 
		Q ${boneCurve2R.x} ${boneCurve2R.y} ${boneEndCenter2.x} ${boneEndCenter2.y} 
		Q ${boneCurve2L.x} ${boneCurve2L.y} ${boneEnd2R.x} ${boneEnd2R.y} 
		Z" 
		fill="#f5f5f5" stroke="#000" stroke-width="1"/>`;
	return bonePath;
};
function calculateInterpolatedPoints(point1, point2, numSegments) {
    const deltaX = (point2.x - point1.x) / (numSegments + 1);
    const deltaY = (point2.y - point1.y) / (numSegments + 1);

    let interpolatedPoints = [];

    for (let i = 1; i <= numSegments; i++) {
        const newX = point1.x + i * deltaX;
        const newY = point1.y + i * deltaY;
        interpolatedPoints.push({x: newX, y: newY});
    }

    return interpolatedPoints;
}

function makeSpine(x1, y1, x2, y2) {
	let pathDist = getDistance(x1, y1, x2, y2);
	let segments = Math.floor(pathDist / 4);
	let c = calculateInterpolatedPoints({x:x1,y:y1}, {x:x2, y:y2}, segments);
	let path = `M${x1} ${y1}`;
	for (let i=0; i<segments; i++) {
		path += `L ${c[i].x} ${c[i].y}`;
	}
	return `<marker id="vert" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10">
			<path d="M 2 3 L 8 3 L 8 4 A 1 1 0 0 1 8 6 L 8 7 L 2 7 L 2 6 A 1 1 0 0 1 2 4 Z" fill="#fff" stroke="#000" />
		</marker>
		<path d="${path}" marker-start="url(#vert)" marker-mid="url(#vert)" />`
}
function getCenterAndAngle(x1, y1, x2, y2) {
	// Calculate the center point
	let centerX = (x1 + x2) / 2;
	let centerY = (y1 + y2) / 2;

	// Calculate the rotation angle
	let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) - 180;

	return { centerX, centerY, angle };
}

function makeSvg(w, h) {
	let confidence = 0.1;

	let score_nose = getPart(results, "nose").score;
	let score_leftAnkle = getPart(results, "leftAnkle").score;
	let score_rightAnkle = getPart(results, "rightAnkle").score;
	let score_leftEar = getPart(results, "leftEar").score;
	let score_rightEar = getPart(results, "rightEar").score;
	let score_leftElbow = getPart(results, "leftElbow").score;
	let score_rightElbow = getPart(results, "rightElbow").score;
	let score_leftEye = getPart(results, "leftEye").score;
	let score_rightEye = getPart(results, "rightEye").score;
	let score_leftHip = getPart(results, "leftHip").score;
	let score_rightHip = getPart(results, "rightHip").score;
	let score_leftKnee = getPart(results, "leftKnee").score;
	let score_rightKnee = getPart(results, "rightKnee").score;
	let score_leftShoulder = getPart(results, "leftShoulder").score;
	let score_rightShoulder = getPart(results, "rightShoulder").score;
	let score_leftWrist = getPart(results, "leftWrist").score;
	let score_rightWrist = getPart(results, "rightWrist").score;
	let nose = getPart(results, "nose").position;
	let leftAnkle = getPart(results, "leftAnkle").position;
	let rightAnkle = getPart(results, "rightAnkle").position;
	let leftEar = getPart(results, "leftEar").position;
	let rightEar = getPart(results, "rightEar").position;
	let leftElbow = getPart(results, "leftElbow").position;
	let rightElbow = getPart(results, "rightElbow").position;
	let leftEye = getPart(results, "leftEye").position;
	let rightEye = getPart(results, "rightEye").position;
	let leftHip = getPart(results, "leftHip").position;
	let rightHip = getPart(results, "rightHip").position;
	let leftKnee = getPart(results, "leftKnee").position;
	let rightKnee = getPart(results, "rightKnee").position;
	let leftShoulder = getPart(results, "leftShoulder").position;
	let rightShoulder = getPart(results, "rightShoulder").position;
	let leftWrist = getPart(results, "leftWrist").position;
	let rightWrist = getPart(results, "rightWrist").position;

	let build_head = ``;
	let build_nose = ``;
	let build_leftAnkle = ``;
	let build_rightAnkle = ``;
	let build_leftEar = ``;
	let build_rightEar = ``;
	let build_leftElbow = ``;
	let build_rightElbow = ``;
	let build_leftEye = ``;
	let build_rightEye = ``;
	let build_leftHip = ``;
	let build_rightHip = ``;
	let build_hips = ``;
	let build_leftKnee = ``;
	let build_rightKnee = ``;
	let build_leftShoulder = ``;
	let build_rightShoulder = ``;
	let build_shoulders = ``;
	let build_leftWrist = ``;
	let build_rightWrist = ``;
	let build_leftUpperArm = ``;
	let build_rightUpperArm = ``;
	let build_leftLowerArm = ``;
	let build_rightLowerArm = ``;
	let build_leftUpperLeg = ``;
	let build_rightUpperLeg = ``;
	let build_leftLowerLeg = ``;
	let build_rightLowerLeg = ``;
	let build_leftTorso = ``;
	let build_rightTorso = ``;
	let build_spine = ``;
	let build_ribs = ``;
	let build_pelvis = ``;
	let build_teeth = ``;

	let headW = getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) / 1.25;
	let headH = getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) / 1.15;
	//make builds based on confidence
	if (score_leftEar >= confidence && score_rightEar >= confidence) {
		build_head = `<ellipse 
		cx="${midpoint(rightEar.x, rightEar.y, leftEar.x, leftEar.y).x}" 
		cy="${midpoint(rightEar.x, rightEar.y, leftEar.x, leftEar.y).y}" 
		rx="${headW}" ry="${headH}"
		fill="#fff" 
		stroke="#000" stroke-width="1.5" />`;
	}
	if (score_nose >= confidence) {
		// build_nose = `<path d="
		// M${nose.x} ${nose.y}
		// q -3 2 -3 4 
		// a 1 1 0 0 0 3 0 
		// a 1 1 0 0 0 3 0 
		// q 0 -2 -3 -4"
		// fill="#000" />`;
		let r = (headW / 9)
		build_nose = `<path d="
		M${nose.x} ${nose.y}
		l -${r} ${r} v ${r} h ${r * 2} v -${r}Z" 
		stroke="#000" stroke-width="1" />
	<circle cx="${nose.x - r}" cy="${nose.y + (r * 2)}" r="${r}"/>
	<circle cx="${nose.x + r}" cy="${nose.y + (r * 2)}" r="${r}"/>"`;
		
		// let mouthD = getDistance(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
		let mouthD = headH/1.5;
		
		build_teeth = `<path d="
		M${leftEar.x - mouthD/4} ${leftEar.y + (mouthD)} 
		L${rightEar.x + mouthD/4} ${rightEar.y + (mouthD)}" 
		stroke="#000" 
		stroke-width="${headH / 5}" 
		stroke-dasharray="${headH / 8} ${headH / 10}" />`;
	}
	if (score_leftAnkle >= confidence) {
		build_leftAnkle = `<circle 
		cx="${leftAnkle.x}" cy="${leftAnkle.y}" 
		r="${headW / 3}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightAnkle >= confidence) {
		build_rightAnkle = `<circle 
		cx="${rightAnkle.x}" cy="${rightAnkle.y}" 
		r="${headW / 3}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_leftEar >= confidence) {
		build_leftEar = `<circle 
		cx="${leftEar.x}" cy="${leftEar.y}" 
		r="${getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) * 0.2}" 
		fill="#f00" />`;
	}
	if (score_rightEar >= confidence) {
		build_rightEar = `<circle 
		cx="${rightEar.x}" cy="${rightEar.y}" 
		r="${getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) * 0.2}" 
		fill="#0f0" />`;
	}
	if (score_leftElbow >= confidence) {
		build_leftElbow = `<circle 
		cx="${leftElbow.x}" cy="${leftElbow.y}" 
		r="${headW / 5}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightElbow >= confidence) {
		build_rightElbow = `<circle 
		cx="${rightElbow.x}" cy="${rightElbow.y}" 
		r="${headW / 5}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_leftEye >= confidence) {
		let eyeRadius = getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) * 0.18;
		build_leftEye = `<circle 
		cx="${leftEye.x}" cy="${leftEye.y}" 
		r="${eyeRadius}" fill="#000" />`;
	}
	if (score_rightEye >= confidence) {
		let eyeRadius = getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) * 0.18;
		build_rightEye = `<circle 
		cx="${rightEye.x}" cy="${rightEye.y}" 
		r="${eyeRadius}" fill="#000" />`;
	}
	if (score_leftHip >= confidence) {
		build_leftHip = `<circle 
		cx="${leftHip.x}" cy="${leftHip.y}" 
		r="${headW / 3.5}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightHip >= confidence) {
		build_rightHip = `<circle 
		cx="${rightHip.x}" cy="${rightHip.y}" 
		r="${headW / 3.5}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_leftHip >= confidence && score_rightHip >= confidence) {
		let pelvisPos = getCenterAndAngle(
			leftHip.x,
			leftHip.y,
			rightHip.x,
			rightHip.y
		);
		let pelvisScale =
			getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) / 50;
		build_pelvis = `<path d="M 50 55 Q 54 48 61 45 Q 61 39 69 41 C 76 34 71 23 63 27 Q 61 25 60 22 Q 50 32 40 22 Q 39 25 37 27 C 29 23 24 34 31 41 Q 38 39 39 45 Q 46 48 50 55 M 31 41 Q 20 53 39 58 Q 58 68 39 80 Q 24 89 24 63 Q 28 64 32 64 Q 32 77 38 72 Q 44 67 32 64 Q 28 64 24 63 Q 18 62 15 51 Q -1 36 2 22 C 6 6 26 14 31 27 C 28 28 25 35 31 41 M 69 41 Q 80 53 61 58 Q 42 68 61 80 Q 76 89 76 63 Q 72 64 68 64 Q 68 77 62 72 Q 56 67 68 64 Q 72 64 76 63 Q 82 62 85 51 Q 101 36 98 22 C 94 6 74 14 69 27 C 72 28 75 35 69 41" 
		fill="#fff" stroke="#000" 
		stroke-width="${8 * pelvisScale}" 
		stroke-linecap="round" 
		stroke-linejoin="round" 
		transform="translate(${pelvisPos.centerX - 50 * pelvisScale}, ${pelvisPos.centerY - 50 * pelvisScale}) scale(${pelvisScale}) rotate(${pelvisPos.angle})"
		/>`;
	}
	if (score_leftKnee >= confidence) {
		build_leftKnee = `<circle 
		cx="${leftKnee.x}" cy="${leftKnee.y}" 
		r="${headW / 4}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightKnee >= confidence) {
		build_rightKnee = `<circle 
		cx="${rightKnee.x}" cy="${rightKnee.y}" 
		r="${headW / 4}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_leftShoulder >= confidence) {
		build_leftShoulder = `<circle 
		cx="${leftShoulder.x}" 
		cy="${leftShoulder.y}" 
		r="${headW / 3}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightShoulder >= confidence) {
		build_rightShoulder = `<circle 
		cx="${rightShoulder.x}" 
		cy="${rightShoulder.y}" 
		r="${headW / 3}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightShoulder >= confidence && score_leftShoulder >= confidence) {
		build_shoulders = `${boneBetween(
			leftShoulder.x,
			leftShoulder.y,
			rightShoulder.x,
			rightShoulder.y
		)}`;
	}
	if (score_leftWrist >= confidence) {
		build_leftWrist = `<circle 
		cx="${leftWrist.x}" cy="${leftWrist.y}" 
		r="${headW / 4}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_rightWrist >= confidence) {
		build_rightWrist = `<circle 
		cx="${rightWrist.x}" cy="${rightWrist.y}" 
		r="${headW / 4}" 
		fill="#f5f5f5" stroke="#000" />`;
	}
	if (score_leftElbow >= confidence && score_leftShoulder >= confidence) {
		build_leftUpperArm = `${boneBetween(
			leftShoulder.x,
			leftShoulder.y,
			leftElbow.x,
			leftElbow.y
		)}`;
	}
	if (score_rightElbow >= confidence && score_rightShoulder >= confidence) {
		build_rightUpperArm = `${boneBetween(
			rightShoulder.x,
			rightShoulder.y,
			rightElbow.x,
			rightElbow.y
		)}`;
	}
	if (score_leftElbow >= confidence && score_leftWrist >= confidence) {
		build_leftLowerArm = `${boneBetween(
			leftElbow.x,
			leftElbow.y,
			leftWrist.x,
			leftWrist.y
		)}`;
	}
	if (score_rightElbow >= confidence && score_rightWrist >= confidence) {
		build_rightLowerArm = `${boneBetween(
			rightElbow.x,
			rightElbow.y,
			rightWrist.x,
			rightWrist.y
		)}`;
	}
	if (score_leftKnee >= confidence && score_leftHip >= confidence) {
		build_leftUpperLeg = `${boneBetween(
			leftHip.x,
			leftHip.y,
			leftKnee.x,
			leftKnee.y
		)}`;
	}
	if (score_rightKnee >= confidence && score_rightHip >= confidence) {
		build_rightUpperLeg = `${boneBetween(
			rightHip.x,
			rightHip.y,
			rightKnee.x,
			rightKnee.y
		)}`;
	}
	if (score_leftAnkle >= confidence && score_leftKnee >= confidence) {
		build_leftLowerLeg = `${boneBetween(
			leftKnee.x,
			leftKnee.y,
			leftAnkle.x,
			leftAnkle.y
		)}`;
	}
	if (score_rightAnkle >= confidence && score_rightKnee >= confidence) {
		build_rightLowerLeg = `${boneBetween(
			rightKnee.x,
			rightKnee.y,
			rightAnkle.x,
			rightAnkle.y
		)}`;
	}
	if (score_leftShoulder >= confidence && score_leftHip >= confidence) {
		build_leftTorso = `<line 
		x1="${leftShoulder.x}" y1="${leftShoulder.y}" 
		x2="${leftHip.x}" y2="${leftHip.y}" 
		stroke="yellow" stroke-width="2" />`;
	}
	if (score_rightShoulder >= confidence && score_rightHip >= confidence) {
		build_rightTorso = `<line 
		x1="${rightShoulder.x}" y1="${rightShoulder.y}" 
		x2="${rightHip.x}" y2="${rightHip.y}" 
		stroke="yellow" stroke-width="2" />`;
	}
	if (
		score_leftShoulder >= confidence &&
		score_leftHip >= confidence &&
		score_rightShoulder >= confidence &&
		score_rightHip >= confidence
	) {
		let betweenShoulders = midpoint(
			rightShoulder.x,
			rightShoulder.y,
			leftShoulder.x,
			leftShoulder.y
		);
		let betweenHips = midpoint(rightHip.x, rightHip.y, leftHip.x, leftHip.y);
		// build_spine = `${boneBetween(
		// 	betweenShoulders.x,
		// 	betweenShoulders.y,
		// 	betweenHips.x,
		// 	betweenHips.y
		// )}`;
		build_spine = `${makeSpine(betweenShoulders.x,
			betweenShoulders.y,
			betweenHips.x,
			betweenHips.y)}`;

		let ribsPos = getCenterAndAngle(nose.x, nose.y, betweenHips.x, betweenHips.y);
		let ribsScale =
			getDistance(rightEar.x, rightEar.y, leftEar.x, leftEar.y) / 50;
		build_ribs = `<path d="M 99.3 71 C 99.2 65.1 98.8 58.7 97.7 52 C 93.1 31.7 87.8 20.9 83.5 13.7 C 80.5 8.7 75.6 5.8 70.4 5.8 C 68.6 5.8 66.9 6.1 65.2 6.8 L 54.3 11.3 H 46 L 35.1 6.8 C 33.4 6.1 31.6 5.8 29.8 5.8 C 24.7 5.8 19.8 8.7 16.8 13.7 C 12.5 20.9 7.1 31.7 4.1 44.2 C 1.5 59.4 1 66.3 1 72.6 C 1.1 83.2 8.9 92.5 17.7 92.5 H 17.7 C 27.1 92.1 31 86.7 33.3 84.5 C 38.4 79.5 42.7 72.2 45.2 67.3 C 46.5 68.6 48.2 69.3 50.1 69.3 C 52 69.3 53.8 68.5 55.1 67.2 C 57.6 72.1 61.8 79.4 67 84.5 C 69.3 86.7 74.6 92.1 79.7 92.1 C 91.4 92.5 99.2 83.2 99.3 72.6 C 99.3 72.1 99.3 71.6 99.3 71.1 C 99.3 71 99.3 71 99.3 71 Z M 12.1 34.2 C 15 36 20.9 38.7 29.4 38.9 C 30 38.9 30.5 38.9 31.1 38.9 C 36.1 38.9 40.2 38.2 43.2 37.5 V 39.3 C 40 41.1 30.9 45.9 23.1 46.3 C 16.7 46.6 11.5 45.1 9 44.1 C 9.9 40.7 11 37.3 12.1 34.2 Z M 17.2 22.8 C 19.9 24.5 25.8 27.8 31.7 29 C 34.4 29.5 36.9 29.7 39 29.7 C 40.6 29.7 42 29.6 43.2 29.5 V 32.5 C 40.3 33.4 35.7 34.3 29.5 34.2 C 21.2 33.9 15.9 31 13.9 29.7 C 15 27.3 16.1 24.9 17.2 22.8 Z M 86.4 29.7 C 84.4 31 79.1 33.9 70.8 34.2 C 64.6 34.3 60 33.4 57.1 32.5 V 29.5 C 58.2 29.6 59.7 29.7 61.3 29.7 C 63.4 29.7 65.9 29.5 68.5 29 C 74.5 27.8 80.5 24.5 83.1 22.8 Z M 91.3 44.1 C 88.8 45.1 83.7 46.6 77.1 46.3 C 69.4 45.9 60.2 41.1 57.1 39.3 V 37.5 C 60.1 38.2 64.2 38.9 69.2 38.9 C 69.8 38.9 70.3 38.9 70.9 38.9 C 79.4 38.7 85.3 36 88.2 34.2 Z M 93 52.6 C 93.2 53.8 93.3 55 93.5 56.1 C 92.3 57.3 88.3 60.1 79.1 59.3 C 68.5 58.4 59.3 48.6 57.1 46.1 V 44.7 C 61.6 47.1 69.6 50.6 76.9 51 C 77.6 51.1 78.3 51.1 78.9 51.1 C 84.8 51.1 89.5 49.8 92.3 48.8 Z M 21.4 51.1 C 22 51.1 22.7 51.1 23.4 51 C 30.7 50.6 38.7 47.1 43.2 44.7 V 46.1 C 40.9 48.6 31.8 58.4 21.1 59.3 C 12 60.1 8 57.3 6.8 56.1 C 7.5 51.3 7.7 50.1 7.9 48.8 C 10.8 49.8 15.5 51.1 21.4 51.1 Z M 5.8 70.4 C 5.8 67.6 5.9 64.6 6.2 61.6 C 8.6 63 12.4 64.2 17.9 64.2 C 19.1 64.2 20.3 64.1 21.6 64 C 30.7 63.2 38.6 57.2 43.2 52.9 V 54.5 C 38.3 60.5 25.5 74.1 17.1 74.1 C 9.1 74.1 6.4 71.4 5.8 70.4 Z M 57.1 52.9 C 61.7 57.2 69.5 63.2 78.7 64 C 80 64.1 81.2 64.2 82.4 64.2 C 87.9 64.2 91.7 62.9 94.1 61.6 C 94.3 64.7 94.5 67.6 94.5 70.5 C 93.9 71.3 91.3 74.1 83.2 74.1 C 74.8 74.1 62 60.5 57.1 54.5 V 52.9 Z M 80.8 18.6 C 78.6 20 73 23.2 67.6 24.4 C 63.2 25.3 59.3 25 57.1 24.7 V 21.4 C 57.1 21.4 57.2 21.4 57.2 21.4 C 60 21.4 64.5 21.1 68.5 19.6 C 72.9 18 75.6 15 77 13.2 C 77.9 14 78.7 15 79.4 16.1 Z M 67 11.2 C 68.1 10.8 69.3 10.5 70.4 10.5 C 71.2 10.5 72 10.6 72.7 10.9 C 71.7 12.2 69.8 14.1 66.8 15.2 C 63.4 16.4 59.5 16.7 57.1 16.6 V 15.2 L 67 11.2 Z M 33.3 11.2 L 43.2 15.2 V 16.6 C 40.8 16.7 36.9 16.4 33.5 15.2 C 30.5 14.1 28.6 12.2 27.6 10.9 C 28.3 10.6 29.1 10.5 29.8 10.5 C 31 10.5 32.2 10.8 33.3 11.2 Z M 23.3 13.2 C 24.7 15 27.4 18 31.8 19.6 C 35.9 21.1 40.3 21.4 43 21.4 C 43.1 21.4 43.1 21.4 43.2 21.4 V 24.7 C 41 25 37.1 25.3 32.7 24.4 C 27.3 23.2 21.7 20 19.5 18.6 C 21.6 15 22.4 14 23.3 13.2 Z M 30 81.1 C 28 83 24.1 86.4 19.5 87.5 C 18.9 87.6 18.3 87.7 17.7 87.7 C 17.7 87.7 17.7 87.7 17.7 87.7 C 12.6 87.7 7.9 82.9 6.3 76.8 C 8.7 77.9 12.2 78.8 17.1 78.8 C 25.7 78.8 35.9 69.6 42 63 C 39.9 67.4 35.4 75.8 30 81.1 Z M 82.7 87.7 C 82 87.7 81.4 87.6 80.8 87.5 C 76.2 86.4 72.3 83 70.3 81.1 C 64.9 75.8 60.4 67.4 58.3 63 C 64.4 69.6 74.6 78.8 83.2 78.8 C 88.1 78.8 91.6 77.9 94 76.8 C 92.4 82.9 87.6 87.7 82.7 87.7 Z" 
		fill="#fff" stroke="#000" 
		stroke-width="${8 * ribsScale}" 
		stroke-linecap="round" 
		stroke-linejoin="round" 
		transform="translate(${ribsPos.centerX - 50 * ribsScale}, ${ribsPos.centerY - 50 * ribsScale}) scale(${ribsScale}) rotate(${ribsPos.angle + 90})" />`;
	}

	//start SVG
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="skeletonSVG">
	<rect height="100%" width="100%" fill="rgba(0,0,0,0.75)" />
	<!--HEAD-->
	${build_head}
	<!--
	EARS
	${build_leftEar}
	${build_rightEar}
	-->
	<!--EYES-->
	${build_leftEye}
	${build_rightEye}
	<!--NOSE-->
	${build_nose}
	<!--TEETH-->
	${build_teeth}
	
	<!--SHOULDERS-->
	${build_shoulders}
	<!--SPINE-->
	${build_spine}
	<!--HIPS-->
	${build_hips}
	<!--TORSO-->
	<!--
	${build_leftTorso}
	${build_rightTorso}
	-->
	<!--UPPER ARMS-->
	${build_leftUpperArm}
	${build_rightUpperArm}
	<!--LOWER ARMS-->
	${build_leftLowerArm}
	${build_rightLowerArm}
	<!--UPPER LEGS-->
	${build_rightUpperLeg}
	${build_leftUpperLeg}
	<!--LOWER LEGS-->
	${build_leftLowerLeg}
	${build_rightLowerLeg}
	<!--HIPS-->
	${build_leftHip}
	${build_rightHip}
	<!--PELVIS-->
	${build_pelvis}
	<!--RIBS-->
	${build_ribs}
	
	<!--ANKLES-->
	${build_leftAnkle}
	${build_rightAnkle}
	<!--KNEES-->
	${build_leftKnee}
	${build_rightKnee}
	<!--ELBOWS-->
	${build_leftElbow}
	${build_rightElbow}
	<!--SHOULDERS-->
	${build_leftShoulder}
	${build_rightShoulder}
	<!--WRIST-->
	${build_leftWrist}
	${build_rightWrist}
	</svg>`;

	let svgEl = document.createElement("div");
	svgEl.innerHTML = svg;
	document.body.appendChild(svgEl.firstChild);
	document.querySelector(".whatHappening").innerHTML = "💀✔️";
}

const loadModel = async function () {
	document.querySelector(".whatHappening").innerHTML = `${svgTyping}`;
	const net = await posenet.load({
		architecture: "MobileNetV1",
		outputStride: 16,
		inputResolution: { width: 640, height: 480 },
		multiplier: 0.75
	});
	model = net;
	return net;
};

// Estimate function
const estimatePose = async function (net) {
	const imageScaleFactor = 0.5;
	const flipHorizontal = false;
	const outputStride = 16;
	const imageElement = document.getElementById("img");
	// load the posenet model

	const pose = await net.estimateSinglePose(
		imageElement,
		imageScaleFactor,
		flipHorizontal,
		outputStride
	);
	results = pose;
	document.querySelector("#poses").innerText = JSON.stringify(pose);
	//draw our svg
	makeSvg(imgHW(imageElement)[0], imgHW(imageElement)[1]);
};

// Start function
const start = async function () {
	const imageScaleFactor = 0.5;
	const flipHorizontal = false;
	const outputStride = 16;
	const imageElement = document.getElementById("img");
	// load the posenet model
	const net = await posenet.load({
		architecture: "MobileNetV1",
		outputStride: 16,
		inputResolution: { width: 640, height: 480 },
		multiplier: 0.75
	});
	const pose = await model.estimateSinglePose(
		imageElement,
		imageScaleFactor,
		flipHorizontal,
		outputStride
	);
	results = pose;
	document.querySelector("#poses").innerText = JSON.stringify(pose);
	document.querySelector(".whatHappening").innerHTML = `${svgTyping}`;
	//draw our svg
	makeSvg(imgHW(imageElement)[0], imgHW(imageElement)[1]);
};

function getPart(resultsObj, part) {
	return resultsObj.keypoints.find(function (keypoint) {
		return keypoint.part === part;
	});
}

//replace the #img with a user-submitted image
let URL = window.URL || window.webkitURL;


window.swapImage = (elm) => {
	let index = elm.dataset.index;
	// URL.createObjectURL is faster then using the filereader with base64
	let url = URL.createObjectURL(elm.files[0]);
	document.querySelector("#img").src = url;
	removeByClass("skeletonSVG");
	start();
};

const swapImageURL = (val) => {
	if (val) {
		let url = val;
		document.querySelector("#img").src = url;
		document.querySelector("#userImgURL").value = url;
		removeByClass("skeletonSVG");
		start();
	}
};

//used to remove old skeleton before drawing a new one
const removeByClass = (className) => {
	let els = document.getElementsByClassName(className);
	while (els.length > 0) {
		els[0].parentNode.removeChild(els[0]);
	}
};

// Call load and estimate
loadModel().then(estimatePose);
