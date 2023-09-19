// The Basal Metabolic Rate (BMR) Calculator estimates your basal metabolic rate
let k = 1;
const calculateBMR = ({ gender, height, weight, age, physicalActivityRatio }) => {
  const BMR =
    gender === 'Female'
      ? (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * physicalActivityRatio
      : (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * physicalActivityRatio;
  return Math.round(BMR);
};

module.exports = calculateBMR;
