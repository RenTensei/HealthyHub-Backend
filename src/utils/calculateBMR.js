// The Basal Metabolic Rate (BMR) Calculator estimates your basal metabolic rate
let k = 1;
const calculateBMR = ({ goal, gender, height, weight, age, physicalActivityRatio }) => {
  if (goal === 'Lose fat') {
    k = 0.83;
  } else if (goal === 'Gain Muscle') {
    k = 1.17;
  }
  const BMR =
    gender === 'Female'
      ? (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) * physicalActivityRatio * k
      : (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age) * physicalActivityRatio * k;
  return Math.round(BMR);
};

module.exports = calculateBMR;
