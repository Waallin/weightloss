import Constants from "expo-constants";
import { calculateFoodPoints } from "./dietPoints";

/**
 * Streckkoder slås upp i Open Food Facts (gratis, ingen nyckel).
 * API: https://openfoodfacts.github.io/openfoodfacts-server/api/
 */

export type BarcodeProduct = {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  /** Näring per 100 g/ml */
  per100: { calories: number; protein: number; fiber: number };
  servingGrams?: number;
  packageGrams?: number;
};

export type BarcodeLookupResult =
  | { status: "found"; product: BarcodeProduct }
  | { status: "not_found"; reason: "not_in_database" | "no_nutrition" }
  | { status: "error"; reason: "network" | "timeout" };

const FIELDS = [
  "product_name",
  "product_name_en",
  "product_name_sv",
  "generic_name",
  "brands",
  "image_front_small_url",
  "nutriments",
  "serving_quantity",
  "product_quantity",
].join(",");

const TIMEOUT_MS = 8000;

const toNumber = (value: unknown): number | undefined => {
  const n = typeof value === "string" ? parseFloat(value) : (value as number);
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : undefined;
};

/** Bara siffror, 8–14 tecken (EAN-8, UPC-A, EAN-13, GTIN-14). */
export const normalizeBarcode = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 14 ? digits : null;
};

export const lookupBarcode = async (barcode: string): Promise<BarcodeLookupResult> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=${FIELDS}`,
      {
        signal: controller.signal,
        headers: {
          // Open Food Facts ber appar att identifiera sig
          "User-Agent": `Kudoo/${Constants.expoConfig?.version ?? "1"} (iOS)`,
        },
      },
    );
    if (response.status === 404) return { status: "not_found", reason: "not_in_database" };
    if (!response.ok) return { status: "error", reason: "network" };
    const json = await response.json();
    if (json?.status !== 1 || !json.product) {
      return { status: "not_found", reason: "not_in_database" };
    }
    const p = json.product;
    const n = p.nutriments ?? {};
    const kcal =
      toNumber(n["energy-kcal_100g"]) ??
      // Bara kJ angivet: räkna om
      (toNumber(n["energy-kj_100g"]) ?? toNumber(n["energy_100g"]) ?? 0) / 4.184;
    const name = String(p.product_name || p.product_name_en || p.product_name_sv || p.generic_name || "").trim();
    if (!kcal || kcal <= 0 || !name) return { status: "not_found", reason: "no_nutrition" };

    const brand = String(p.brands ?? "").split(",")[0]?.trim() || undefined;
    return {
      status: "found",
      product: {
        barcode,
        name,
        brand,
        imageUrl: p.image_front_small_url || undefined,
        per100: {
          calories: Math.round(kcal),
          protein: toNumber(n.proteins_100g) ?? 0,
          fiber: toNumber(n.fiber_100g) ?? 0,
        },
        servingGrams: toNumber(p.serving_quantity),
        packageGrams: toNumber(p.product_quantity),
      },
    };
  } catch (error: any) {
    return { status: "error", reason: error?.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
};

export type PortionKey = "serving" | "100g" | "pack" | "custom";

export type PortionOption = { key: Exclude<PortionKey, "custom">; label: string; grams: number };

/** Portionsval som finns för produkten, i ordning serving, 100 g, hela förpackningen. */
export const portionOptions = (product: BarcodeProduct): PortionOption[] => {
  const options: PortionOption[] = [];
  const { servingGrams, packageGrams } = product;
  if (servingGrams && servingGrams !== 100) {
    options.push({ key: "serving", label: `1 serving · ${Math.round(servingGrams)} g`, grams: servingGrams });
  }
  options.push({ key: "100g", label: "100 g", grams: 100 });
  if (packageGrams && packageGrams !== 100 && packageGrams !== servingGrams && packageGrams <= 2000) {
    options.push({ key: "pack", label: `Whole pack · ${Math.round(packageGrams)} g`, grams: packageGrams });
  }
  return options;
};

/** Standard: en portion om den finns, annars hela förpackningen om den är liten (en bar, en yoghurt), annars 100 g. */
export const defaultPortion = (product: BarcodeProduct): PortionOption => {
  const options = portionOptions(product);
  return (
    options.find((o) => o.key === "serving") ??
    options.find((o) => o.key === "pack" && o.grams <= 500) ??
    options.find((o) => o.key === "100g")!
  );
};

export const pointsForGrams = (product: BarcodeProduct, grams: number) => {
  const factor = grams / 100;
  const calories = product.per100.calories * factor;
  return {
    calories: Math.round(calories),
    points: calculateFoodPoints({
      calories,
      protein: product.per100.protein * factor,
      fiber: product.per100.fiber * factor,
      estimatedGrams: grams,
    }),
  };
};
