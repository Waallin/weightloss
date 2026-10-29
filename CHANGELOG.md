# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added
- Accounts start anonymously: "Start" creates an anonymous Firebase account, so the app no longer requires Apple sign-in to get going. Sessions persist in AsyncStorage
- "Save your progress" card on Home (after the first meal or on day 2) links Apple to the anonymous account without moving any data; "Later" hides it for three days. "Already have an account? Sign in" restores an existing account after a reinstall
- New day 1 guide after sign-up: turn on step counting (Apple Health), then try logging a meal. "Not now" and "Skip for now" are always available
- Manual food entry screen (name, calories, optional protein/fiber/weight, portion size), reachable from the camera view
- Scan demo on the first onboarding slide
- Progress bar with endowed progress (starts at 25 %) on the profile steps
- Plan summary and account creation on one screen, with a larger mascot
- Offline screen with "Try again" when the user document can't be read at startup
- Tracking: `meal_logged` (with `method`, `points`, `meal_slot`, `is_first_meal`), `first_meal_logged`, `scan_started`/`scan_succeeded`/`scan_failed`, `camera_permission_result`, `notification_permission_result`, `health_permission_prompted`, `steps_first_detected`, `returned_after_signup`, `start_tapped`, `save_progress_viewed`/`save_progress_dismissed`, `account_linked` and `account_deleted`
- Super properties on every event: `platform`, `app_version`, `flow_version`, `account_type`, `device_region`, `is_internal`, `signup_date`, `days_since_signup`
- `trackMilestone` sends first meal, day 2 return and Apple link to Mixpanel, TikTok and Meta from one place; TikTok users are identified with their uid
- `docs/tracking-plan.md` documents definitions, events, properties and the TikTok/Meta mapping

### Changed
- The app is free: the paywall and RevenueCat initialisation are gone
- Onboarding shortened: removed "How it works", the social proof screen and the separate plan screen
- Profile details: age is chosen from four groups (18-29, 30-44, 45-59, 60+) and `age_group` is stored in Mixpanel; age, gender and height use the same card design; the age and gender steps move on with one tap, without Continue
- Wheel pickers use the green selection band from the app
- Settings: the Profile row is removed and the section is called "Preferences"
- One green everywhere (`#16B97B`)
- Mixpanel is initialised before the first events are sent, and dev builds no longer send to the production project (set `EXPO_PUBLIC_MIXPANEL_DEV_TOKEN` to test)
- Mixpanel people properties and `profile_details_completed` use `goal_type` and `weight_goal_band` instead of exact weight and height
- `profile_details_step_viewed` includes `step_index`, `total_steps` and `ms_since_previous_step`
- Camera, step and notification prompts now log their results

### Fixed
- The primary button keeps its size while loading
- "Delete account" now removes the Firestore data for older accounts without a saved session and only reports success if it worked
- A network error at startup no longer logs the user out and sends them back to onboarding
- Signing in after a failed restore no longer reuses the Apple session for a new anonymous account

### Removed
- Paywall, "How it works" and social proof routes and their analytics events from the active flow (paywall screens remain in the code but are unused)

## [1.1.4]

### Added
- Units follow the device region: US devices default to ft/lb, everyone else to cm/kg (a saved choice still wins)
- Local StoreKit configuration (`Kudoo.storekit`) for testing purchases in the simulator

### Fixed
- Cancelling Apple's purchase dialog is no longer logged as a failed purchase and no longer shows a "Purchase failed" alert
- Double taps on the paywall button can no longer start several purchase attempts; the button is disabled while a purchase is in progress
- The paywall reloads products if they failed to load at app start and shows a clear error if the subscription is unavailable
- `paywall_purchase_succeeded` is now only logged when the premium entitlement is active, and includes `is_trial`; TikTok `START_TRIAL` is only sent for real trials
- Startup no longer skips Mixpanel initialisation if RevenueCat offerings fail to load

### Changed
- Restored the annual paywall design from 1.1.3 (the monthly/weekly paywall from 1.1.2 is removed)
- Purchase analytics: new `paywall_purchase_cancelled` event; failed events now include `error_code`, `error_message`, `product_id`, `offering_id` and `cancelled`
- Users are now identified with the same ID (email) in Mixpanel and RevenueCat (`identify` / `logIn`) after registration and on app start
- New app icon
- Redesigned the social proof screen: "Real results" badge, highlighted key phrases in testimonials and staggered card animations; testimonial weights are shown in kg outside the US
- Profile details: the Continue button is enabled only after the user has interacted with the step (gender and goal weight excepted), start weight defaults to 100 and goal weight follows it at 10 kg less until changed

### Removed
- Debug logging of paywall products

[1.1.2]

Added

* Added two daily goals: Eat Smart and Move Daily
* Added a celebration screen when users reach their daily step goal
* Added daily goal indicators to track food points and step progress
* Added weekly check-ins to encourage consistent weight tracking
* Added two subscription options to the paywall: Monthly Premium with a 7-day free trial and Weekly Premium without a trial
* Added support for multiple monthly subscription prices for RevenueCat experiments

Changed

* Redesigned the home screen to focus on two simple daily goals
* Improved food scanning results with clearer points and remaining daily budget
* Updated step progress to display actual steps taken instead of steps remaining
* Redesigned the Progress screen with clearer goal statistics and weight tracking
* Improved the weight logging button and moved it to the Weekly Check-in section
* Updated onboarding to introduce the new two-goal system
* Updated onboarding illustrations and text to focus on food and movement
* Updated daily notification content to focus on meal logging and walking
* Improved overall UI consistency, spacing, and navigation

Removed

* Removed water tracking as a daily goal
* Removed water-related instructions and references from onboarding

## [1.1.1]

### Added
- Blocked account creation for users under 18 and lock the app after they confirm their age
- Added more analytics events during onboarding
- Added spinning wheel to paywall
- Added social proof to paywall
- First-day guide after the paywall: scan a meal, connect Apple Health, log a glass, then start the day
- Mixpanel events for the first-day guide: viewed, slide viewed, and completed

### Changed
- Updated event names to mixpanel
- Changed tiktok-event from TikTokEventName.SUBSCRIBE to TikTokEventName.START_TRAIL
- Changed Kudoos design
- Removed the home-screen first-time guide, including the 9/10 water shortcut and the review prompt on the first glass

## [1.1.0] 2026-09-03

### Added
- Tracking to mixpanel when scanning food
- Added dynamic prices at paywall
- You can now use cm, m, pounds, and kg when entering measurements

### Changed
- Enhanced the UI/UX for the AI-based food scanning feature
- Renamed the app as displayed in the App Store
- Updated the app subtitle
- Improved the design and flow of the paywall
- Made scanned meals use shorter, more casual names instead of listing every ingredient
- Changed paywall
- Enchanced the UI/UX on onboarding
- Changed meta-project

# Fixed
- Fixed bug with opacity att scanview

## [1.0.11] - 2026-08-17

### Added
- Introduced an AI-powered feature that lets you scan food to identify meals and calculate points

### Changed
- Reworked the paywall

## [1.0.10] - 2026-07-20

### Changed
- Reworked the paywall and changed price for annual

## [1.0.10] - 2026-06-17

### Changed

- Changed price in paywall

## [1.0.9] - 2026-06-15

### Added
- Track registration to tiktok-sdk


## [1.0.8] - 2026-06-08

### Added
- Integrated tiktok-sdk

### Changed
- Subscription period switched from yearly to monthly
- Updated the weekly subscription price

### Fixed
- Resolved an issue where users were not redirected to the paywall when restarting the app

## [1.0.7] - 2026-05-30

### Added
• Improved onboarding experience to better explain how Kudoo works
• Added a guided first-day experience to help you get started and build momentum
• Improved habit setup and activation flow
• Added App Tracking Transparency support for a better advertising and attribution experience
• Various UX improvements and bug fixes

## [1.0.6] - 2026-05-24

### Added
- First-time users now start with 9/10 water glasses completed to create an instant win experience
- Added App Store review prompt after first completed goal to capture positive early experiences
- Added app_opened-event to mixpanel

### Changed
- Reduced default daily step goal from 10,000 to 5,000 steps to create more achievable daily goals
- Changed to AsyncStorage.clear() in settings instead of removeItem("user")
- Updated onboarding copy to better explain how recipes and points work


## [1.0.5] - 2026-05-20

### Changed
- Improved onboarding flow for US users by switching weight and height inputs to imperial units (lb/ft)
- Moved HealthKit permission request until after premium purchase to reduce onboarding friction

## [1.0.4] - 2026-05-18

### Fixed
Annual now signals meta Subscribe

## [1.0.3] - 2026-05-14

### Added
Log event "app_installed" to Mixpanel upon app installation

### Fixed
RevenueCat user data is now updated each time the app is opened

### Changed
Notifications are now scheduled for the next 3 days only when the app becomes active
Gender selection options have been updated to remove "other"



