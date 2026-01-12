# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0]

### Added

- Year in Review feature
- Beta test for receipt auto detect
- Added support for Savings Transfers

### Fixed

- Transaction List card description text not aligning properly
- Dates shifting between viewer and editor

## [0.4.2]

### Added

- Transaction reconciliation screen and APIs

### Changes

- Removed unused headers from GET budget API calls

## [0.4.1]

### Changes

- Now uses Alpine node docker image
- Updated UI for transactions viewer
- Rewrote Transaction Cards to use composable component pattern

### Fixed

- Entering 21.0 on planner fields not being possible due to validation (would reset to 21.)
- All number inputs now sanitize to allow for up to two digit decimals
- Transaction cards are now wrapped with a button element to make them interactable

## [0.4.0]

### Changes

- Breaking Changes - All endpoints now use the Session user id
- Top buttons now match between all screens
- Budget sharing settings moved to the Settings view
- New budget date selector

## [0.3.1]

### Changes

- Updated to NextJS 15.3.5

## [0.3.0]

### Added

- Added Gift transactions option
- Added Split Transactions functionality (WIP)
- Transaction Badges on Card

### Changes

- Borrowed transactions now appear on the month the transaction originated

## [0.2.0]

### Added

- Account management UI
- Filter by transaction Account
- Notes on Categories for Planner

### Changes

- Upgraded to NextJS 15
- Upgraded to TailwindCSS v4
- Updated Drawer component

### Fixed

- Invalid date on Income Transaction View
- Login not allowing special characters for password
- Income viewer showing "Edit" button when there is currently no edit functions
- Categories not correctly sync when entering edit mode for an expense
- Savings sorting based on month rather than actual time

## [0.1.0]

### Added

- Changelog file
- Added a button on planner category editor to use previous months alloted amount
- Added an option to borrow from future budgets
- Keep budget month selected
- Caching budget
- Settings page
- Shadcn components
- Added Receipt Images

### Changes

- Transactions page: Filters now are applied to show categories that are selected

### Fixed

- Number input fields changing to zero when input is erased
- Server side error when trying to access localstorage
- Login page: default redirect was not working
- Select closing when selecting any values that overlapped the background overlays of the drawer
