# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
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