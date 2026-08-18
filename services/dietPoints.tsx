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

const PROTEIN_PER_100_KCAL_REF = 8;
const FIBER_PER_100_KCAL_REF = 2;
const GRAMS_PER_100_KCAL_REF = 80;

export type FoodPointInput = {
    calories: number;
    protein: number;
    fiber: number;
    estimatedGrams: number;
};

export const calculateFoodPoints = (food: FoodPointInput): number => {
    const calories = food.calories ?? 0;
    if (calories <= 0) return 0;

    const protein = food.protein ?? 0;
    const fiber = food.fiber ?? 0;
    const estimatedGrams = food.estimatedGrams ?? 0;

    const per100 = calories / 100;
    const proteinScore = Math.min((protein / per100) / PROTEIN_PER_100_KCAL_REF, 1);
    const fiberScore = Math.min((fiber / per100) / FIBER_PER_100_KCAL_REF, 1);
    const volumeScore =
        estimatedGrams > 0
            ? Math.min((estimatedGrams / per100) / GRAMS_PER_100_KCAL_REF, 1)
            : 0;

    const satiety = proteinScore * 0.5 + fiberScore * 0.2 + volumeScore * 0.3;
    const costMultiplier = 1.3 - satiety * 0.6;

    return Math.max(0, Math.round(per100 * costMultiplier));
};