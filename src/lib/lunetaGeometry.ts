export function lunetaGeometry(objectiveFocal: number) {
  const eyeFocal = 8;
  const length = objectiveFocal + eyeFocal;
  const inputSlope = 0.0003;
  const imageHeight = objectiveFocal * inputSlope;
  const overviewScale = 210 / length;
  const detailScale = 12;
  const overviewPoint = (x: number, y: number) => ({ x: 54 + x * overviewScale, y: 78 - y * overviewScale });
  const detailPoint = (x: number, y: number) => ({ x: 36 + (x - objectiveFocal) * detailScale, y: 206 - y * detailScale });
  const rays = [-0.04, 0, 0.04].map(aperture => {
    const objectiveHeight = aperture * objectiveFocal;
    // Lente fina: u' = u − h/f. O foco traseiro da objetiva coincide
    // com o foco dianteiro da ocular; só assim o feixe emergente é paralelo.
    const middleSlope = inputSlope - objectiveHeight / objectiveFocal;
    const eyeHeight = objectiveHeight + length * middleSlope;
    const exitSlope = middleSlope - eyeHeight / eyeFocal;
    return {
      objectiveHeight, middleSlope, eyeHeight, exitSlope,
      overview: [overviewPoint(-35 / overviewScale, objectiveHeight - inputSlope * 35 / overviewScale), overviewPoint(0, objectiveHeight), overviewPoint(objectiveFocal, imageHeight), overviewPoint(length, eyeHeight)],
      detail: [detailPoint(objectiveFocal, imageHeight), detailPoint(length, eyeHeight), detailPoint(length + 12, eyeHeight + 12 * exitSlope)],
    };
  });
  return { objectiveFocal, eyeFocal, length, inputSlope, imageHeight, magnification: -objectiveFocal / eyeFocal, overviewScale, detailScale, objectiveX: 54, imageX: 54 + objectiveFocal * overviewScale, eyeX: 264, rays };
}
