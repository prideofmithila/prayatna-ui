# Session Timer Feature - User Guide

## Overview

The Session Timer is a powerful feature in Prayatna that helps you track time during your study or work sessions. It supports multi-level time tracking: session-level, task-level, and subtask-level timers running simultaneously.

---

## Getting Started

### Accessing the Timer

1. **From Sessions List:**
   - Navigate to the Sessions page
   - Find the session you want to study with
   - Click the **Play button** (▶) on the session card
   - You'll be taken to the timer page

2. **From Session Details:**
   - Open a session in view mode
   - Click the **Play button** in the action buttons at the top
   - The timer page will load

---

## Timer Interface

### Main Components

#### 1. **Session Timer** (Top Card)
- **Large display** showing total session elapsed time
- **Play/Pause button** - Start or pause the timer
- **Stop button** - End the session and return to sessions list
- Shows accumulated time in `HH:MM:SS` format

#### 2. **Task Selection Panel**
- **Available for sessions with tasks**
- Shows all tasks in your session as clickable cards
- Each task card displays:
  - Task name
  - Total task duration
- Click any task card to select it and start/track that task

#### 3. **Current Task Timer** (If Tasks Exist)
- Shows elapsed time for the **currently selected task**
- Updates in real-time as you work
- Displays task duration for reference

#### 4. **Subtask Information** (If Applicable)
- **Current Subtask** name and elapsed time
- **Next Subtask** preview
- **Subtask Timer** countdown in real-time
- Only appears if selected task has subtasks

---

## How to Use

### Step 1: Start the Timer
1. Click the **Play button** (▶) to start the timer
2. **If your session has tasks:**
   - A modal will appear asking you to select a task
   - Click a task card to select it
   - The timer will start automatically

3. **If your session has no tasks:**
   - The session timer will start immediately

### Step 2: Track Your Work
- **Session Timer** counts overall time spent in the session
- **Task Timer** tracks time on the current selected task
- **Subtask Timer** (if applicable) tracks time on the current subtask
- All three timers run **simultaneously** when a task with subtasks is selected

### Step 3: Switch Between Tasks
- While the timer is running, click on a different task card
- The current task timer resets and begins tracking the new task
- The session timer continues without interruption
- The subtask timer resets to track the first subtask of the new task

### Step 4: Pause and Resume
- Click the **Pause button** (⏸) to pause the timer
- All three timers (session, task, subtask) pause simultaneously
- Click **Play** to resume from where you left off

### Step 5: Stop the Session
- Click the **Stop button** (⏹) to end the session
- You'll be redirected back to the sessions list
- All time data is preserved

---

## Key Features

### Multi-Level Time Tracking
The timer tracks three levels of time simultaneously:

| Level | Purpose | Updates |
|-------|---------|---------|
| **Session** | Total time in study session | Continuous while playing |
| **Task** | Time on current task | Resets when switching tasks |
| **Subtask** | Time on current subtask | Resets when moving to next subtask |

### Time Display Format
- **HH:MM:SS** - Standard format (Hours : Minutes : Seconds)
- Example: `01:23:45` = 1 hour, 23 minutes, 45 seconds

### Task Selection
- **Click to select** - Tap any task card to focus on it
- **Selected state** - Highlighted with visual styling
- **Task duration** - Shows how long the task is designed to take

### Subtask Progress
When a task has subtasks:
- Current subtask displays the subtask you're working on
- Next subtask shows what comes after
- Individual subtask timers track each subtask separately

### Screen Dimming Prevention (Wake Lock)
- The device screen stays active while the timer runs
- Prevents accidental screen lock during study sessions
- Automatically releases when timer stops or page is closed

---

## Tips & Best Practices

### Organizing Your Sessions
- **Create sessions with subtasks** for detailed progress tracking
  - Example: Long essay task → Introduction, Body Paragraph 1, Body Paragraph 2, etc.
- **Use meaningful task names** to stay focused
- **Group related tasks** in the same session

### Maximizing Focus
1. **Select a task before starting** - Reduces distractions
2. **Minimize distractions** - The timer page provides a clean interface
3. **Use subtasks for checkpoints** - Track micro-progress within tasks
4. **Take breaks between sessions** - Creates natural pause points

### Tracking Your Progress
- Session timer shows **total study time**
- Task timers help identify which tasks take longest
- Subtask timers reveal **time distribution** across sub-goals
- Use this data to **plan future sessions** more accurately

---

## Common Scenarios

### Scenario 1: Timed Study Session
**Goal:** Study for exactly 2 hours

1. Create a session with total duration of 2 hours
2. Add tasks (reading, practice problems, review)
3. Click Play and select a task
4. Session timer counts down from 2 hours
5. Switch tasks as you complete them
6. Timer auto-alerts when session ends

### Scenario 2: Multi-Part Assignment
**Goal:** Complete an essay with multiple sections

1. Create a task "Essay Writing"
2. Add subtasks: "Outline", "Introduction", "Body", "Conclusion"
3. Click Play and session starts
4. Start with "Outline" - subtask timer tracks this section
5. Progress to next subtask - timer resets for that section
6. Complete essay while tracking time per section

### Scenario 3: Task-Only Session
**Goal:** Work on multiple independent tasks

1. Create a session with multiple tasks
2. No subtasks needed
3. Click Play and select first task
4. Task timer tracks each task separately
5. Switch between tasks as needed
6. Session timer shows total time across all tasks

---

## Troubleshooting

### Timer Won't Start
- **Ensure a task is selected** if the session has tasks
- Wait for the task selection modal and click a task
- Session-only sessions (no tasks) should start immediately

### Timer Keeps Pausing
- Check if your app lost focus
- On mobile devices, ensure the page stays visible
- The screen lock protection may be disabled on some browsers

### Wrong Time Displayed
- Confirm you selected the correct task
- Task timers reset when you switch tasks
- Subtask timers reset when moving to the next subtask

### Screen Keeps Dimming
- The device may not support wake lock feature
- Ensure you're using a modern browser (Chrome, Firefox, Safari mobile)
- Some devices ignore wake lock; adjust device settings manually

---

## Advanced Features

### Session Timer Behavior
- **Positive time**: You're within the allocated time
- **Negative time** (displayed in red): You've exceeded the session duration
- Helps manage time budgets for study sessions

### System-Generated Sessions
- **Read-only templates** provided by Prayatna
- When editing a system-generated session, a **copy is created**
- Changes are saved to your profile, not the original template
- Free you to customize templates without affecting others

### Guest vs. Signed-In Users
- **Guests**: Timer works normally but sessions stored locally
- **Signed-In**: Sessions sync across devices
- Both can use all timer features equally

---

## Keyboard & Mobile Controls

### Desktop
- **Play/Pause**: Click the play/pause button or select a task
- **Stop**: Click the stop button
- **Task Switch**: Click any task card

### Mobile
- **Play/Pause**: Tap the play/pause button or select a task
- **Stop**: Tap the stop button
- **Task Switch**: Swipe or tap task cards
- **Landscape mode** recommended for better visibility

---

## Performance Tips

### For Longer Sessions
- Keep the number of tasks reasonable (5-10 optimal)
- Mobile devices work best with 1-2 running timers
- Close other browser tabs to reduce memory usage

### Battery Usage
- Timer consumes minimal battery
- Wake lock uses slightly more power
- Consider your device's battery level before long sessions

---

## Need Help?

For more information about:
- **Creating sessions**: See Sessions Management Guide
- **Adding tasks and subtasks**: See Session Editor Guide
- **Syncing across devices**: See Account Settings Guide
- **System-generated sessions**: See Session Templates Guide

---

## Summary

The Session Timer is your personal study companion that helps you:
✅ Track total study time  
✅ Monitor time per task  
✅ Break work into measurable subtasks  
✅ Stay focused without screen interruptions  
✅ Manage time budgets effectively  
✅ Build better study habits through data  

Start a session today and optimize your productivity!
