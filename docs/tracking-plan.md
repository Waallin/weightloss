# Kudoo tracking plan

Läses av Claude när data hämtas från Mixpanel. Håll den i synk med `constants/analytics.ts` och `services/tracking.ts`.

## Definitioner
- **Aktiverad:** första loggade måltiden (`first_meal_logged`) inom 24 timmar efter att kontot skapades (`hours_since_signup` <= 24).
- **Retention:** `returned_after_signup` (första öppning en senare kalenderdag) och `app_opened` med `days_since_signup`.
- **Rapporter ska exkludera Sverige** (`device_region` = `SE`) och `is_internal` = true.
- Mixpanel-projekt: Kudoo (US-servern). Dev-byggen skickar inget om inte `EXPO_PUBLIC_MIXPANEL_DEV_TOKEN` är satt.

## Flödesversion
`flow_version` finns på varje event (se `FLOW_VERSION` i `services/tracking.ts`). Ändra den vid varje stor omgörning av onboarding/guide. Nuvarande: `onb_v3_free_anon`.

## Super properties (på varje event)
`platform`, `app_version`, `flow_version`, `account_type` (`anonymous`|`apple`), `device_region`, `is_internal`, `signup_date`, `days_since_signup`.

## Tratten
`app_installed` -> `onboarding_viewed` -> `onboarding_slide_viewed` (slide 1-4) -> `onboarding_completed` -> `profile_details_step_viewed` (step_index 1-5) -> `profile_details_completed` -> `plan_ready_viewed` + `auth_viewed` (samma skärm) -> `start_tapped` -> `user_registered` -> `first_day_guide_viewed` -> `health_permission_prompted` -> `first_meal_logged` -> `home_viewed`.

## Events
| Event | När | Egenskaper |
|---|---|---|
| `profile_details_step_viewed` | Varje profilsteg | `step`, `step_index`, `total_steps`, `ms_since_previous_step` |
| `profile_details_completed` | Sista steget klart | `age_group`, `gender`, `goal_type`, `weight_goal_band` |
| `start_tapped` | Tryck på Start | - |
| `user_registered` | Anonymt konto skapat | `anonymous` |
| `meal_logged` | Alla loggade måltider | `method` (`scan`/`manual`/`recipe`/`food`), `points`, `meal_slot`, `is_first_meal` |
| `first_meal_logged` | Första måltiden (nya konton) | `method`, `hours_since_signup` |
| `scan_started` / `scan_succeeded` / `scan_failed` | Skanning | `duration_ms`, `points`, `reason` (`not_food`/`error`) |
| `camera_permission_result` | Efter kamerafrågan | `result` |
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
