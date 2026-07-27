import { getUserStorageItem, setUserStorageItem } from './session-manager';

export interface ActivityItem {
  action: string;
  time: string;
}

export function addActivity(action: string): void {
  if (typeof window !== 'undefined') {
    const existing = getUserStorageItem('user_activities');
    let list: ActivityItem[] = [];
    
    if (existing) {
      try {
        list = JSON.parse(existing);
      } catch {
        list = [];
      }
    }

    // Prepend the new activity
    list.unshift({
      action,
      time: 'Just now'
    });

    // Limit to the 5 most recent activities
    setUserStorageItem('user_activities', JSON.stringify(list.slice(0, 5)));
  }
}

