import LemonActiveSvg from 'assets/images/bottom_lemon_active_40x40.svg';
import LemonInactiveSvg from 'assets/images/bottom_lemon_inactive_40x40.svg';
import CalendarActiveSvg from 'assets/images/bottom_calendar_active_40x40.svg';
import CalendarInactiveSvg from 'assets/images/bottom_calendar_inactive_40x40.svg';
import ListActiveSvg from 'assets/images/bottom_list_active_40x40.svg';
import ListInactiveSvg from 'assets/images/bottom_list_inactive_40x40.svg';
import SettingActiveSvg from 'assets/images/bottom_setting_active_40x40.svg';
import SettingInactiveSvg from 'assets/images/bottom_setting_inactive_40x40.svg';

export const BOTTOM_TAB_HEIGHT = 56;

export const BOTTOM_TABS = [
  {
    key: 'MainPage',
    active: LemonActiveSvg,
    inactive: LemonInactiveSvg,
  },
  {
    key: 'CalendarPage',
    active: CalendarActiveSvg,
    inactive: CalendarInactiveSvg,
  },
  {
    key: 'PlanChartListPage',
    active: ListActiveSvg,
    inactive: ListInactiveSvg,
  },
  {
    key: 'SettingPage',
    active: SettingActiveSvg,
    inactive: SettingInactiveSvg,
  },
];
