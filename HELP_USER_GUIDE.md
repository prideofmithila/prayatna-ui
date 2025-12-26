# Prayatna Help System - User Experience Guide

## Overview
The Help system is a comprehensive, read-only resource center that guides users through every aspect of Prayatna. It's accessible from the main navigation menu and designed to be intuitive and searchable.

## User Interface Layout

### Desktop View
```
┌─────────────────────────────────────────────────┐
│ ← Help & Documentation                          │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│ Topics       │ Getting Started                  │
│              │                                  │
│ • Getting    │ Learn the basics of Prayatna    │
│   Started    │ and how to create your first    │
│ • How to     │ session                         │
│   Create     │                                  │
│ • Using      │ Welcome to Prayatna!            │
│   Timer      │ Prayatna is a powerful study   │
│ • System-    │ session planner and timer.     │
│   Generated  │ Here's how to get started:     │
│ • Account    │                                  │
│ • Editing    │ 1. Create Your Account          │
│ • Best       │    (Optional) - Sign in to sync │
│   Practices  │    sessions across devices     │
│ • Troubl.   │ 2. Create a Session            │
│              │ 3. Add Tasks                    │
│ [Search]     │ 4. Start the Timer              │
│              │ 5. Monitor Progress             │
│              │                                  │
│              │ Sessions are stored locally on  │
│              │ your device by default. Sign    │
│              │ in to sync them to your        │
│              │ account.                        │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

### Tablet View
```
┌────────────────────────────────┐
│ ← Help & Documentation         │
├────────────────────────────────┤
│ [Search box]                   │
├────────────────────────────────┤
│ • Getting Started              │
│ • How to Create Sessions       │
│ • Using the Session Timer      │
│ • System-Generated Sessions    │
│ • Account & Syncing            │
│ • Editing & Managing Sessions  │
│ • Best Practices               │
│ • Troubleshooting              │
├────────────────────────────────┤
│ Getting Started                │
│ Learn the basics...            │
│                                │
│ Welcome to Prayatna!           │
│ Prayatna is a powerful study   │
│ session planner...             │
│ [Content scrolls]              │
└────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────┐
│ ← Help & Documentation   │
├──────────────────────────┤
│ [Search box]             │
├──────────────────────────┤
│ Topics ▼                 │
│ • Getting Started        │
│ • How to Create Sessions │
│ • Using Timer            │
│ • System-Generated       │
│ • Account & Syncing      │
│ [scroll for more]        │
├──────────────────────────┤
│ Getting Started          │
│ Learn the basics...      │
│                          │
│ Welcome to Prayatna!     │
│ Prayatna is a powerful   │
│ study session planner... │
│ [Content scrolls]        │
└──────────────────────────┘
```

## Navigation Flow

### Accessing Help

#### From Desktop Menu
```
Prayatna Header
├─ Home
├─ Practice Tools → Session Timer
├─ Daily Quiz
├─ Social
├─ About
└─ Help ← Click here
    ↓
Help Page (/help)
```

#### From Mobile Menu
```
Hamburger Menu (☰)
├─ Home
├─ Practice Tools → Session Timer
├─ Daily Quiz
├─ Social
├─ About
└─ Help ← Click here
    ↓
Help Page (/help)
```

#### Direct URL
```
User Types: yourapp.com/help
    ↓
Help Page loads with first topic selected
```

### Topic Selection Flow

#### Via Sidebar (Desktop/Tablet)
```
Topic List
  ↓
Click Topic
  ↓
Selected Topic Highlights (blue background)
  ↓
Content Displays on Right
  ↓
Scroll to Read Full Content
```

#### Via Search (All Devices)
```
[Search box]
  ↓
Type keyword (e.g., "timer")
  ↓
Topics filter in real-time
  ↓
First matching topic auto-selects
  ↓
Content displays
```

### Navigation Back
```
Back Button (← arrow)
  ↓
Returns to Sessions page
  ↓
Preserves session list state
```

## Feature Walkthrough

### 1. Landing Page
**What user sees:**
- Header with back button and search
- Topic list on left (desktop) or top (mobile)
- First topic ("Getting Started") selected
- Relevant content displayed

**User action:** Browse topics or search

### 2. Search Experience
**What user sees:**
- Search input with placeholder text
- Results filter in real-time
- No results message if search doesn't match

**Example searches that work:**
- "timer" → Shows "Using the Session Timer"
- "create" → Shows "How to Create Sessions"
- "system" → Shows "System-Generated Sessions"
- "sync" → Shows "Account & Syncing"
- "delete" → Shows "Troubleshooting" and "Editing"

### 3. Topic Reading
**What user sees:**
- Formatted content with headings
- Numbered lists for instructions
- Bullet points for features
- Bold text for important terms
- Organized sections

**Content structure:**
```
Topic Title
├─ Description (subtitle)
├─ Main Content
│  ├─ h3 Subheading
│  ├─ Paragraphs
│  ├─ Lists
│  └─ More text
├─ More Sections
└─ Related info
```

### 4. Mobile Experience
**Touch-friendly:**
- Large tap targets for buttons
- Readable font sizes on all screens
- Sidebar collapses to prevent scrolling horizontally
- Search input easy to tap

**Responsive text:**
- Headings: 24px (desktop) → 20px (mobile)
- Body: 15px (desktop) → 13px (mobile)
- Labels: 16px (desktop) → 14px (mobile)

## Topic Content Overview

### Getting Started
**Best for:** New users
- What is Prayatna
- 5-step getting started guide
- Local vs account storage
- Where to go next

### How to Create Sessions
**Best for:** Users creating first session
- Step-by-step instructions
- Task creation guide
- Subtask explanation
- Task vs Subtask differences

### Using the Session Timer
**Best for:** Users starting a session
- Timer overview (multi-level)
- How to use controls
- Task switching guide
- Mobile controls

### System-Generated Sessions
**Best for:** Users seeing template sessions
- What templates are
- Key features (read-only, copyable)
- How to edit process
- Hiding templates (for signed-in users)

### Account & Syncing
**Best for:** Users wondering about sync
- Guest storage (local only)
- Account storage (synced)
- How to sign in
- Benefits of signing in

### Editing & Managing Sessions
**Best for:** Users modifying existing sessions
- How to edit sessions
- Deletion permissions
- Template editing process
- What can be deleted

### Best Practices
**Best for:** Users wanting better study habits
- Session planning tips
- Study effectiveness strategies
- Session management tips
- Organization ideas

### Troubleshooting
**Best for:** Users experiencing issues
- Session creation problems
- Timer issues
- Data & sync problems
- Solutions for each issue

## Colors & Visual Hierarchy

### Color Scheme
```
Primary Blue:    #667eea  (Active states, highlights)
Secondary Purple: #764ba2 (Background gradient)
Text:            #333     (Main content)
Light Gray:      #666     (Secondary text)
Borders:         #ddd     (Dividers)
Background:      #fff     (Content area)
```

### Typography
```
Headings (h2):   32px, bold, #333
Subheading (h3): 20px, bold, #333  
Labels (h4):     16px, bold, #555
Body text:       15px, color: #444
Emphasis:        bold, italic
Code:            monospace, #667eea background
```

### Interactive Elements
```
Active Topic:      Blue left border + light blue background
Topic Hover:       Light indigo background
Search Focus:      Blue border + box shadow
Back Button:       Color change on hover
```

## Accessibility Features

### For Screen Readers
- Semantic HTML structure
- Proper heading hierarchy (h2, h3, h4)
- Alt text for icons (implicit via semantic structure)
- ARIA labels where applicable

### For Keyboard Navigation
- Tab through topics
- Enter to select topic
- Tab through links and buttons
- Escape to close search focus

### For Visual Accessibility
- High contrast (WCAG AA compliance)
- Readable font sizes
- Clear visual hierarchy
- Color not sole indicator (icons + text)

## Performance Characteristics

### Load Time
- Component lazy-loaded on first visit to /help
- All content pre-loaded (no API calls)
- Fast switching between topics
- Search instant (client-side filtering)

### Device Performance
- Works on all modern browsers
- Optimized for mobile (responsive design)
- Smooth scrolling
- No lag during search

### Data Usage
- No external API calls
- Small bundle size (~50KB total)
- No image downloads required
- Efficient CSS and JavaScript

## Common User Scenarios

### Scenario 1: First-Time User
```
User lands on Prayatna
  ↓
"How do I get started?" question
  ↓
Clicks Help → Gets "Getting Started" topic
  ↓
Reads 5-step guide
  ↓
Goes to Sessions to create first session
```

### Scenario 2: Confused about System Sessions
```
User sees "(System Generated)" label
  ↓
"What's this?" question
  ↓
Searches "system" in help
  ↓
Reads "System-Generated Sessions" topic
  ↓
Understands can edit as own copy
  ↓
Proceeds with editing
```

### Scenario 3: Timer Not Working
```
User starts session but timer doesn't work
  ↓
Clicks Help
  ↓
Searches "timer" or selects "Using Timer" topic
  ↓
Finds troubleshooting in "Timer Issues"
  ↓
Learns must select task first
  ↓
Returns to fix issue
```

### Scenario 4: Sign-In Benefits
```
User asks "Why sign in?"
  ↓
Searches "sync" or "account"
  ↓
Reads "Account & Syncing" section
  ↓
Compares guest vs account benefits
  ↓
Decides to create account
```

## Technical Implementation Details

### Component Structure
```
HelpComponent
├─ Header
│  ├─ Back Button
│  └─ Title
├─ Search Area
│  └─ Search Input
├─ Sidebar (Desktop/Tablet)
│  ├─ Topic List
│  └─ Active Topic Highlight
└─ Main Content
   ├─ Article Header
   ├─ Article Content
   └─ Article Footer
```

### Route
- **Path**: `/help`
- **Lazy Loaded**: Yes
- **Protected**: No (public access)
- **Back Navigation**: Router.navigate(['/sessions'])

### Data Flow
```
HelpComponent
├─ helpSections[] (static data)
├─ selectedSection (current topic)
├─ searchTerm (search input)
└─ filteredSections (search results)
```

## Future Enhancement Possibilities

### Screenshots
- Add images to help topics
- Step-by-step visual guides
- Timer interface screenshots
- Session creation walkthrough

### Video
- Embedded YouTube tutorials
- Screen recording guides
- Interactive demos

### Interactive
- Guided tours (overlay on actual app)
- Click-to-learn (jump to help from app)
- Contextual help (show relevant topic)

### Community
- User comments/discussions
- FAQ upvoting
- Suggestion submission
- Feedback form

---

**Last Updated**: Current Implementation
**User Guide Version**: 1.0
**Status**: Ready for Users
