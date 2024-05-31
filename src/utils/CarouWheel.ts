const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 180 / Math.PI

export function degreesToArcLength(angle: number, radius: number) {
  const thetaRadians = angle * DEGREES_TO_RADIANS
  return radius * thetaRadians
}

export function arcLengthToDegrees(arcLength: number, radius: number) {
  const thetaRadians = arcLength / radius
  return thetaRadians * RADIANS_TO_DEGREES
}

export function calculateArcLengthOccupiedByACircleOnACircle(
  primaryCircleRadius: number,
  auxiliaryCircleRadius: number,
) {
  let cosTheta =
    (2 * auxiliaryCircleRadius ** 2 - primaryCircleRadius ** 2) /
    (2 * auxiliaryCircleRadius ** 2)

  if (cosTheta < -1) cosTheta = -1
  if (cosTheta > 1) cosTheta = 1

  const theta = Math.acos(cosTheta / 2)

  const arcLength = auxiliaryCircleRadius * theta
  return arcLength
}
