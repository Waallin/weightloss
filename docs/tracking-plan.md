# Kudoo tracking plan

Läses av Claude när data hämtas från Mixpanel. Håll den i synk med `constants/analytics.ts` och `services/tracking.ts`.

## Definitioner
- **Aktiverad:** första loggade måltiden (`first_meal_logged`) inom 24 timmar efter att kontot skapades (`hours_since_signup` <= 24).
- **Retention:** `returned_after_signup` (första öppning en senare kalenderdag) och `app_opened` med `days_since_signup`.
- **Rapporter ska exkludera Sverige** (`device_region` = `SE`) och `is_internal` = true.
- Mixpanel-projekt: Kudoo (US-servern). Dev-byggen skickar inget om inte `EXPO_PUBLIC_MIXPANEL_DEV_TOKEN` är satt.

## Flödesversion
`flow_version` finns på varje event (se `FLOW_VERSION` i `services/tracking.ts`). Ändra den vid varje stor omgörning av onboarding/guide. Nuvarande: `onb_v5_scan_first` (scan, paywall, sedan hela profilen). Före: `onb_v4_hard_paywall` (6 profilsteg först).

## Super properties (på varje event)
`platform`, `app_version`, `flow_version`, `account_type` (`anonymous`|`apple`), `device_region`, `is_internal`, `signup_date`, `days_since_signup`.

## Tratten
**`onb_v5_scan_first` (nuvarande):** `app_installed` -> `onboarding_viewed` -> `onboarding_slide_viewed` (slide 1-4) -> `onboarding_completed` -> `user_registered` (konto skapas direkt efter introduktionen, ingen `start_tapped`/`plan_ready_viewed`) -> `first_day_guide_viewed` -> `health_permission_prompted` -> `steps_ring_viewed` -> `scan_started` (ev. `scan_sample_used`) -> `first_meal_logged` -> `day1_dashboard_viewed` -> `day1_dashboard_cta_tapped` -> `acquisition_source_answered` (före paywallen, alla svarar) -> `paywall_viewed` (om hård paywall är på) -> `paywall_purchase_succeeded` -> `profile_details_step_viewed` (step_index 1-5, `phase`=`post_paywall`) -> `profile_details_completed` -> `plan_ready_viewed` -> `home_viewed`.

**`onb_v4_hard_paywall` (äldre):** `app_installed` -> `onboarding_viewed` -> `onboarding_slide_viewed` (slide 1-4) -> `onboarding_completed` -> `profile_details_step_viewed` (step_index 1-6) -> `acquisition_source_answered` -> `profile_details_completed` -> `plan_ready_viewed` + `auth_viewed` (samma skärm) -> `start_tapped` -> `user_registered` -> `first_day_guide_viewed` -> `health_permission_prompted` -> `first_meal_logged` -> `paywall_viewed` -> `paywall_purchase_succeeded` -> `home_viewed`.

Jämför flödena med `flow_version`. Obs: i v5 saknar konton som inte hunnit svara efter paywallen ålder/kön/längd/vikt (standardvärden, `profilePending: true` på kontot).

## Events
| Event | När | Egenskaper |
|---|---|---|
| `profile_details_step_viewed` | Varje profilsteg | `step`, `step_index`, `total_steps`, `ms_since_previous_step`, `phase` (`post_paywall` från v5) |
| `acquisition_source_answered` | Svar på "Where did you hear about Kudoo?" (egen skärm mellan dashboarden och paywallen från v5, tidigare sista profilsteget) | `source` (`tiktok`, `app_store`, `instagram`, `friend`, `other`, `skipped`), `skipped` |
| `profile_details_completed` | Sista steget klart | `age_group`, `gender`, `goal_type`, `weight_goal_band` (`acquisition_source` skickas inte längre här från v5) |
| `start_tapped` | Tryck på Start | - |
| `user_registered` | Anonymt konto skapat | `anonymous` |
| `meal_logged` | Alla loggade måltider | `method` (`scan`/`barcode`/`manual`/`recipe`/`food`), `points`, `meal_slot`, `is_first_meal`, `portion` (bara `barcode`: `serving`/`100g`/`pack`/`custom`), `corrected` (bara `scan`: true om svaret rättades före loggning) |
| `first_meal_logged` | Första måltiden (nya konton) | `method`, `hours_since_signup` |
| `scan_started` / `scan_succeeded` / `scan_failed` | Skanning | `duration_ms`, `points`, `confidence` (AI:ns säkerhet 0-1, bara `scan_succeeded`), `reason` (`not_food`/`error`) |
| `scan_correction_opened` | "Tell Kudoo what it is" trycks på resultatkortet | `points`, `confidence`, `low_confidence` (confidence < 0,7, då visas "Is this right?"), `already_corrected` |
| `scan_corrected` | AI:n har tittat igen med användarens beskrivning och svaret är uppdaterat | `text` (användarens beskrivning, max 200 tecken), `text_length`, `name_before`, `name_after`, `points_before`, `points_after`, `points_delta` (standardportion), `confidence_before`, `confidence_after`, `low_confidence`, `duration_ms` |
| `scan_correction_failed` | Rättelsen gick inte igenom, det gamla svaret ligger kvar | `reason` (`not_food`/`error`), `duration_ms` |
| `barcode_scan_started` | Streckkodsskannern öppnas (ikon i fotokameran eller i matlistan) | `source` (`photo_scan`/`diet_list`) |
| `barcode_scan_succeeded` | Produkten hittades i Open Food Facts | `duration_ms` (från öppnad skanner), `input` (`camera`/`typed`), `points` (standardportion), `has_serving` |
| `barcode_product_not_found` | Okänd kod eller produkt utan kcal | `reason` (`not_in_database`/`no_nutrition`), `barcode`, `input`, `duration_ms` |
| `barcode_scan_failed` | Nätverksfel/timeout mot Open Food Facts | `reason` (`network`/`timeout`), `input`, `duration_ms` |
| `steps_ring_viewed` | Ringen mot 5 000 steg visas direkt efter att stegräkning slagits på (guidens steg 1, ingen egen skärm) | `steps` (steg just då, kan vara 0 innan HealthKit svarat) |
| `day1_dashboard_viewed` | Dashboarden efter första måltiden, före paywallen | `has_steps`, `steps`, `meal_points` |
| `day1_dashboard_cta_tapped` | "Start my journey" trycks | - |
| `scan_sample_used` | "Pick a sample photo" på första dagens guide (exempelfoto i stället för kamera) | `sample` (`pizza`/`chocolate`/`donut`/`salad`) |
| `camera_permission_result` | Efter kamerafrågan | `result`, `context` (`barcode` när frågan kom från streckkodsskannern) |
| `health_permission_prompted` | iOS-frågan för steg visas | `source` |
| `steps_first_detected` | Första gången steg > 0 | - |
| `notification_permission_result` | Efter notisfrågan | `result` |
| `returned_after_signup` | Första återkomst | `days_since_signup` |
| `account_linked` | Apple kopplat | - |
| `account_deleted` | Konto raderat | - |

`diet_scan_added`, `diet_manual_added`, `diet_food_added`, `diet_recipe_added` skickas fortfarande parallellt med `meal_logged` under en övergångsperiod. Ta bort dem när jämförelsen bakåt inte behövs längre.

## People properties
`age_group`, `gender`, `goal_type`, `weight_goal_band`, `account_type`, `steps_connected`, `notifications_enabled`, `meals_logged_total`, `first_meal_at`, `first_meal_method`, `email` (efter Apple-koppling). Ingen exakt vikt, längd eller målvikt.

## TikTok / Meta
Alla milstolpar går genom `trackMilestone` i `services/tracking.ts`.
| Milstolpe | TikTok | Meta |
|---|---|---|
| Tryck på Start (konto skapat) | `Registration` | - |
| `first_meal_logged` | `CompleteTutorial` (huvudsignal) | `CompleteTutorial` |
| `returned_after_signup` | `AchieveLevel` | - |
| `account_linked` | custom `AccountLinked` | - |

Kontrollera i TikTok Events Manager vilka händelser som går att optimera annonser mot och byt mappningen i `milestoneToAds`.

## Hård paywall (RevenueCat)
Styrs av Firestore `config/app`. Utan fälten är appen gratis.
- `hardPaywall: true` slår på paywallen (`"true"`/`"on"` fungerar också).
- `hardPaywallGrandfatherBefore: "YYYY-MM-DD"`: konton skapade före datumet slipper paywallen. Saknas datumet grandfatheras ingen.
- Paywallen visas efter första scannade måltiden (`placement=after_first_scan`) och vid appstart för icke-premium (`expired`/`app_open`). Från v5 finns ingen "Skip for now" på guiden, så `after_skip` skickas inte längre (äldre konton har det).
- Premium = entitlement `Kudoo Premium`. Ej Apple-/iOS-klienter räknas som premium så grinden aldrig gäller.
- Events: `paywall_viewed`, `paywall_cta_tapped`, `paywall_purchase_succeeded`/`_cancelled`/`_failed`, `paywall_restore_tapped`. Egenskaper: `placement`, `variant` (`rc_v1`).
- Grindlogik: `services/paywallGate.ts`, test: `npm test`.
