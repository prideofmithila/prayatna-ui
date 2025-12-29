import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  selectedSection: HelpSection | null = null;
  searchTerm = '';

  helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket_launch',
      description: 'Learn the basics of BodhPrepIAS and how to create your first session',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Welcome to BodhPrepIAS!</h3>
        <p>BodhPrepIAS is a powerful study session planner and timer. Here's how to get started:</p>
        <ol>
          <li><strong>Create Your Account</strong> (Optional) - Sign in to sync sessions across devices</li>
          <li><strong>Create a Session</strong> - Define your study topic and tasks</li>
          <li><strong>Add Tasks</strong> - Break down your session into manageable tasks</li>
          <li><strong>Start the Timer</strong> - Begin tracking your study time</li>
          <li><strong>Monitor Progress</strong> - Watch your task and session progress in real-time</li>
        </ol>
        <p>Sessions are stored locally on your device by default. Sign in to sync them to your account.</p>
      `
    },
    {
      id: 'create-sessions',
      title: 'How to Create Sessions',
      icon: 'add_circle',
      description: 'Step-by-step guide for creating and managing study sessions',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Creating a Session</h3>
        <ol>
          <li><strong>Click the "+" button</strong> on the Sessions page</li>
          <li><strong>Enter Session Name</strong> - Give your session a clear, descriptive name</li>
          <li><strong>Set Duration</strong> (Optional) - Set how long you plan to study</li>
          <li><strong>Add Tasks</strong> - Click "Add Task" to break down your session</li>
          <li><strong>Add Subtasks</strong> (Optional) - Further break down complex tasks</li>
          <li><strong>Save Session</strong> - Click "Save" to create your session</li>
        </ol>
        <h4>Task vs Subtask</h4>
        <ul>
          <li><strong>Tasks</strong> - Main topics (e.g., "Read Chapter 3")</li>
          <li><strong>Subtasks</strong> - Detailed breakdowns (e.g., "Introduction", "Main Points", "Summary")</li>
        </ul>
        <p><em>Use subtasks for complex tasks to track granular progress.</em></p>
      `
    },
    {
      id: 'session-timer',
      title: 'Using the Session Timer',
      icon: 'timer',
      description: 'Master the session timer for effective time tracking',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Session Timer Overview</h3>
        <p>The timer tracks time at multiple levels:</p>
        <ul>
          <li><strong>Session Timer</strong> - Total time for entire session</li>
          <li><strong>Task Timer</strong> - Time spent on current task</li>
          <li><strong>Subtask Timer</strong> - Time for current subtask (if applicable)</li>
        </ul>
        <h4>How to Use</h4>
        <ol>
          <li>Click the <strong>Play button</strong> to start the timer</li>
          <li><strong>Select a task</strong> (if your session has tasks)</li>
          <li>All timers will start counting</li>
          <li>Click <strong>Pause</strong> to pause the timer</li>
          <li>Click <strong>Stop</strong> to end the session</li>
        </ol>
        <h4>Switching Tasks</h4>
        <p>While the timer is running, click a different task card to switch. The task timer resets but the session timer continues.</p>
      `
    },
    {
      id: 'system-generated',
      title: 'System-Generated Sessions',
      icon: 'star',
      description: 'Understanding platform templates and how to customize them',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>What are System-Generated Sessions?</h3>
        <p>System-generated sessions are study templates created by BodhPrepIAS to help you get started. They're labeled with a "System Generated" tag.</p>
        <h4>Key Features</h4>
        <ul>
          <li><strong>Read-Only Original</strong> - Templates cannot be directly edited</li>
          <li><strong>Create Your Copy</strong> - When you click Edit, a personal copy is created</li>
          <li><strong>Customize Freely</strong> - Your copy is fully editable without affecting the original template</li>
          <li><strong>Hide from Profile</strong> - Remove templates from your session list (signed-in users)</li>
        </ul>
        <h4>How to Edit a System-Generated Session</h4>
        <ol>
          <li>Open the system-generated session</li>
          <li>Click the <strong>Edit button</strong></li>
          <li>A confirmation dialog appears explaining the copy process</li>
          <li>Click <strong>"Continue Editing"</strong></li>
          <li>Your personal copy opens for editing</li>
          <li>Make your changes and save</li>
        </ol>
      `
    },
    {
      id: 'account-sync',
      title: 'Account & Syncing',
      icon: 'cloud_sync',
      description: 'Managing your account and syncing sessions across devices',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Session Storage</h3>
        <h4>Without Account (Guest)</h4>
        <ul>
          <li>Sessions stored on current device only</li>
          <li>Not accessible from other devices</li>
          <li>Lost if browser cache is cleared</li>
          <li>Useful for quick, temporary sessions</li>
        </ul>
        <h4>With Account (Signed In)</h4>
        <ul>
          <li>Sessions saved to your BodhPrepIAS account</li>
          <li>Accessible from any device</li>
          <li>Automatic syncing across devices</li>
          <li>Permanent backup of your sessions</li>
        </ul>
        <h4>How to Sign In</h4>
        <ol>
          <li>Click the <strong>Sign In button</strong> in the header</li>
          <li>Enter your email and password</li>
          <li>Your sessions will sync automatically</li>
        </ol>
        <p><em>System-generated sessions can only be hidden by signed-in users.</em></p>
      `
    },
    {
      id: 'editing-sessions',
      title: 'Editing & Managing Sessions',
      icon: 'edit',
      description: 'How to modify and manage your existing sessions',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Editing Sessions</h3>
        <h4>Your Own Sessions</h4>
        <ol>
          <li>Open the session in view mode</li>
          <li>Click the <strong>Edit button</strong> (pencil icon)</li>
          <li>Modify the session name, duration, tasks, or subtasks</li>
          <li>Click <strong>"Save Session"</strong></li>
          <li>Changes are applied immediately</li>
        </ol>
        <h4>System-Generated Sessions</h4>
        <p>See the <strong>System-Generated Sessions</strong> section for detailed steps.</p>
        <h3>Deleting Sessions</h3>
        <h4>Your Sessions</h4>
        <ol>
          <li>From the Sessions list, find the session</li>
          <li>Click the <strong>Delete button</strong> or option</li>
          <li>Confirm the deletion in the modal</li>
          <li>Session is permanently removed</li>
        </ol>
        <h4>What You Can Delete</h4>
        <ul>
          <li>✅ Sessions you created</li>
          <li>✅ Local-only sessions (guest users)</li>
          <li>❌ System-generated sessions (hidden instead of deleted)</li>
        </ul>
      `
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: 'lightbulb',
      description: 'Tips and tricks for getting the most out of BodhPrepIAS',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Session Planning Tips</h3>
        <ul>
          <li><strong>Be Specific</strong> - Use clear, descriptive session and task names</li>
          <li><strong>Break It Down</strong> - Use subtasks for complex topics</li>
          <li><strong>Realistic Timing</strong> - Set time estimates based on experience</li>
          <li><strong>Review & Adjust</strong> - Update sessions based on actual time taken</li>
          <li><strong>Reuse Templates</strong> - Duplicate successful sessions for similar topics</li>
        </ul>
        <h3>Study Effectiveness</h3>
        <ul>
          <li><strong>Focus on One Task</strong> - Select a task before starting the timer</li>
          <li><strong>Minimize Distractions</strong> - Keep the timer page visible during study</li>
          <li><strong>Use Subtasks as Checkpoints</strong> - Track micro-progress within larger tasks</li>
          <li><strong>Take Breaks</strong> - Stop and start new sessions for natural breaks</li>
          <li><strong>Analyze Patterns</strong> - Review which tasks take longest and plan accordingly</li>
        </ul>
        <h3>Session Management</h3>
        <ul>
          <li><strong>Organize by Subject</strong> - Group related sessions together</li>
          <li><strong>Archive Old Sessions</strong> - Delete completed sessions to reduce clutter</li>
          <li><strong>Create Recurring Sessions</strong> - Duplicate templates for daily/weekly study</li>
          <li><strong>Sign In for Backup</strong> - Ensure your sessions sync to your account</li>
        </ul>
      `
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'help_outline',
      description: 'Common issues and their solutions',
      lastUpdated: 'December 26, 2025',
      content: `
        <h3>Session Creation Issues</h3>
        <h4>Session Won't Save</h4>
        <ul>
          <li>Check that <strong>Session Name</strong> is filled (required field)</li>
          <li>Ensure all tasks have been saved (not just in the modal)</li>
          <li>Look for error messages in red text</li>
          <li>Try refreshing and creating again</li>
        </ul>
        <h4>Tasks Aren't Showing</h4>
        <ul>
          <li>Click <strong>"Save Task"</strong> button in the modal</li>
          <li>Ensure the modal closed after saving</li>
          <li>Task should appear as a card after successful save</li>
        </ul>
        <h3>Timer Issues</h3>
        <h4>Timer Won't Start</h4>
        <ul>
          <li>If session has tasks, <strong>select a task first</strong></li>
          <li>Wait for task selection modal and click a task</li>
          <li>Sessions with no tasks should start immediately</li>
        </ul>
        <h4>Screen Keeps Dimming</h4>
        <ul>
          <li>Some browsers/devices don't support wake lock</li>
          <li>Use a modern browser (Chrome, Firefox, Safari)</li>
          <li>Manually adjust device screen timeout settings</li>
        </ul>
        <h3>Data & Sync Issues</h3>
        <h4>Sessions Lost After Closing Browser</h4>
        <ul>
          <li><strong>If signed in</strong> - Sessions auto-save to account</li>
          <li><strong>If guest</strong> - Sessions stored locally only</li>
          <li><strong>Solution</strong> - Sign in to ensure sessions persist</li>
        </ul>
        <h4>Sessions Not Syncing</h4>
        <ul>
          <li>Check your internet connection</li>
          <li>Verify you're signed in to your account</li>
          <li>Try refreshing the page</li>
          <li>Sign out and back in to force sync</li>
        </ul>
      `
    }
  ];

  filteredSections: HelpSection[] = [];

  constructor(private router: Router) {
    this.filteredSections = this.helpSections;
  }

  ngOnInit() {
    // Select first section by default
    if (this.helpSections.length > 0) {
      this.selectedSection = this.helpSections[0];
    }
  }

  selectSection(section: HelpSection) {
    this.selectedSection = section;
  }

  searchHelp(term: string) {
    this.searchTerm = term.toLowerCase();
    if (!this.searchTerm) {
      this.filteredSections = this.helpSections;
    } else {
      this.filteredSections = this.helpSections.filter(section =>
        section.title.toLowerCase().includes(this.searchTerm) ||
        section.description.toLowerCase().includes(this.searchTerm) ||
        section.content.toLowerCase().includes(this.searchTerm)
      );
    }
    // Select first result if available
    if (this.filteredSections.length > 0 && !this.filteredSections.includes(this.selectedSection!)) {
      this.selectedSection = this.filteredSections[0];
    }
  }

  goBack() {
    this.router.navigate(['/sessions']);
  }
}
