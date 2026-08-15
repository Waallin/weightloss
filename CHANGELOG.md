# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.11]

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



