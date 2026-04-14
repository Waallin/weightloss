const calculateStepCalories = (steps: number) => {
    return Math.round(steps * 0.04);
  };

const calculateMaintenanceCalories = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    steps: number,
  ) => {
    let bmr = 0;
  
    if (gender === "Male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
  
    const baseMaintenance = bmr * 1.35;
    const stepCalories = calculateStepCalories(steps);
  
    return Math.round(baseMaintenance + stepCalories);
  };

  export const calculatePoints = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    steps: number,
    deficit = 500,
  ) => {
    const maintenanceCalories = calculateMaintenanceCalories(
      weight,
      height,
      age,
      gender,
      steps
    );
  
    const targetCalories = maintenanceCalories - deficit;
  
    const points = Math.round(targetCalories / 100);
  
    return {
      maintenanceCalories,
      targetCalories,
      points,
    };
  };