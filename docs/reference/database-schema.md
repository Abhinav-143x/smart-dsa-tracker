# Reference: Database Schema

This document provides a technical description of the SQLite database schema used by the Smart DSA Tracker.

## Overview

The database (`dsa_tracker.db`) consists of four primary tables designed to track DSA problems, user accounts, and their associated progress.

---

## Tables

### `problems`
Stores the curated list of DSA problems.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Unique identifier for the problem. |
| `title` | String | The name of the problem. |
| `topic` | String | High-level category (e.g., "Arrays", "Graphs"). |
| `subtopic` | String | Specific category (e.g., "Two Pointers"). |
| `difficulty` | String | "Easy", "Medium", or "Hard". |
| `source_link` | String | Primary external URL (e.g., LeetCode). |
| `article_link` | String | Link to explanation article. |
| `youtube_link` | String | Link to video tutorial. |
| `leetcode_link`| String | Direct LeetCode link (if available). |
| `order_index` | Integer | Sorting order within the sheet. |
| `slug` | String | URL-friendly identifier. |

### `users`
Stores user profile information.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Unique identifier. |
| `username` | String | Unique username. |
| `email` | String | User email address. |
| `created_at` | DateTime | Account creation timestamp. |
| `last_active` | DateTime | Last login/activity timestamp. |

### `user_progress`
Tracks the relationship between users and problems.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Record identifier. |
| `user_id` | Integer (FK) | Reference to `users.id`. |
| `problem_id` | Integer (FK) | Reference to `problems.id`. |
| `status` | String | "Solved", "In Progress", "Revision Needed". |
| `completed_at`| DateTime | When the problem was first solved. |
| `revision_count`| Integer | Number of times the problem was revised. |
| `notes` | Text | Personal user notes on the problem. |
| `updated_at` | DateTime | Last progress update. |

### `streaks`
Tracks user consistency and protection.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Record identifier. |
| `user_id` | Integer (FK) | Reference to `users.id`. |
| `current_streak`| Integer | Number of consecutive days active. |
| `longest_streak`| Integer | Historical best streak. |
| `last_solve_date`| Date | Date of the most recent solved problem. |
| `freeze_tokens` | Integer | Available streak protection tokens. |

### `achievements`
Stores milestone definitions.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Record identifier. |
| `name` | String | Name of the badge. |
| `description` | String | Unlock criteria. |
| `icon_name` | String | Icon identifier. |
| `criteria_type`| String | logic type (solve_count, etc.). |
| `criteria_value`| String | Target threshold. |

---

## Entity Relationship Summary
- A **User** has many **UserProgress** records.
- A **Problem** has many **UserProgress** records.
- A **User** has many **UserAchievement** records.
- A **User** has one **Streak** record.
