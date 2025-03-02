# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changes
- Upgraded to NextJS 15
- Upgraded to TailwindCSS v4
- Updated Drawer component
### Fixed
- Invalid date on Income Transaction View

## [0.0.1]

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