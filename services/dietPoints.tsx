const calculateStepCalories = (steps: number) => {
    return Math.round(steps * 0.04);
};

const calculateBaseMaintenanceCalories = (
    weight: number,
    height: number,
    age: number,
    gender: string
) => {
    let bmr = 0;
    if (gender === "Male") {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
    return Math.round(bmr * 1.35);
};

export const calculatePoints = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    steps: number,
    deficit = 800,
) => {
    const baseMaintenance = calculateBaseMaintenanceCalories(
        weight,
        height,
        age,
        gender
    );
    const stepBonusCalories = calculateStepCalories(steps);

    const maintenanceCalories = baseMaintenance + stepBonusCalories;
    const targetCalories = maintenanceCalories - deficit;

    const base = Math.round((baseMaintenance - deficit) / 100);
    const stepBonus = Math.round(stepBonusCalories / 100);
    const total = base + stepBonus;

    return {
        base,
        stepBonus,
        total
    };
};