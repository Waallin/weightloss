// Kör: npm test   (Node 22+, ingen extra installation)
import test from "node:test";
import assert from "node:assert/strict";
import {
  getPaywallGate,
  isGrandfathered,
  isHardPaywallEnabled,
  toMillis,
} from "../services/paywallGate.ts";
import { resetToMain, resetToPaywall } from "../services/paywallNavigation.ts";

const ON = { hardPaywall: true };
const day = (iso) => new Date(iso);
const newUser = { createdAt: day("2026-12-01T10:00:00Z") };
const oldUser = { createdAt: day("2026-11-01T10:00:00Z") };
const gate = (over) =>
  getPaywallGate({ config: ON, user: newUser, isPremium: false, premiumLoaded: true, ...over });

test("av som standard: saknas config är appen gratis", () => {
  assert.equal(gate({ config: null }), "allow");
  assert.equal(gate({ config: {} }), "allow");
  assert.equal(gate({ config: { hardPaywall: false } }), "allow");
  assert.equal(gate({ config: { hardPaywall: "false" } }), "allow");
});

test("flaggan kan vara true, 'true' eller 'on'", () => {
  for (const v of [true, "true", "on"]) assert.equal(isHardPaywallEnabled({ hardPaywall: v }), true);
  for (const v of [false, "false", "off", 1, undefined, null]) assert.equal(isHardPaywallEnabled({ hardPaywall: v }), false);
});

test("påslagen: ny, icke-premium användare ser paywallen", () => {
  assert.equal(gate({}), "paywall");
});

test("premium släpps alltid in", () => {
  assert.equal(gate({ isPremium: true }), "allow");
  assert.equal(gate({ isPremium: true, premiumLoaded: false }), "allow");
});

test("okänd prenumerationsstatus ger 'unknown', inte fri åtkomst", () => {
  assert.equal(gate({ premiumLoaded: false }), "unknown");
});

test("grandfathering: konton före datumet slipper, efter datumet och exakt på datumet gör det inte", () => {
  const config = { ...ON, hardPaywallGrandfatherBefore: "2026-11-10T00:00:00Z" };
  assert.equal(gate({ config, user: oldUser }), "allow");
  assert.equal(gate({ config, user: { createdAt: day("2026-11-10T00:00:00Z") } }), "paywall");
  assert.equal(gate({ config, user: newUser }), "paywall");
});

test("grandfathering utan datum ger ingen undantag", () => {
  assert.equal(gate({ user: oldUser }), "paywall");
  assert.equal(isGrandfathered(oldUser, { hardPaywallGrandfatherBefore: "skräp" }), false);
});

test("okänt skapandedatum räknas som nytt konto", () => {
  const config = { ...ON, hardPaywallGrandfatherBefore: "2026-11-10" };
  assert.equal(gate({ config, user: {} }), "paywall");
  assert.equal(gate({ config, user: null }), "paywall");
  assert.equal(gate({ config, user: { createdAt: { _methodName: "serverTimestamp" } } }), "paywall");
});

test("toMillis förstår Firestore Timestamp, Date, ms och ISO", () => {
  const ms = Date.parse("2026-11-01T00:00:00Z");
  assert.equal(toMillis({ seconds: ms / 1000, nanoseconds: 0 }), ms);
  assert.equal(toMillis({ toMillis: () => ms }), ms);
  assert.equal(toMillis(new Date(ms)), ms);
  assert.equal(toMillis(ms), ms);
  assert.equal(toMillis("2026-11-01T00:00:00Z"), ms);
  assert.equal(toMillis(null), null);
  assert.equal(toMillis(undefined), null);
  assert.equal(toMillis("inte ett datum"), null);
  assert.equal(toMillis({ toMillis: () => { throw new Error("x"); } }), null);
});

test("Firestore-konto läst tillbaka som Timestamp grandfatheras korrekt", () => {
  const config = { ...ON, hardPaywallGrandfatherBefore: "2026-11-10T00:00:00Z" };
  const secs = Date.parse("2026-11-05T00:00:00Z") / 1000;
  assert.equal(gate({ config, user: { createdAt: { seconds: secs, nanoseconds: 0 } } }), "allow");
});

test("navigering: från MainStack-navigatorn (nya användare) nollställs det egna stacken", () => {
  const calls = [];
  const nav = { getState: () => ({ routeNames: ["MainNavigator", "Paywall", "FirstDayGuide"] }), reset: (s) => calls.push(s) };
  resetToPaywall(nav, "after_skip");
  resetToMain(nav);
  assert.deepEqual(calls[0], { index: 0, routes: [{ name: "Paywall", params: { placement: "after_skip" } }] });
  assert.deepEqual(calls[1], { index: 0, routes: [{ name: "MainNavigator" }] });
});

test("navigering: från AuthNavigator går resetten via MainStack-routen", () => {
  const calls = [];
  const nav = { getState: () => ({ routeNames: ["Onboarding", "Paywall", "MainStack"] }), reset: (s) => calls.push(s) };
  resetToPaywall(nav, "after_first_scan");
  assert.deepEqual(calls[0], {
    index: 0,
    routes: [{ name: "MainStack", state: { routes: [{ name: "Paywall", params: { placement: "after_first_scan" } }] } }],
  });
});
