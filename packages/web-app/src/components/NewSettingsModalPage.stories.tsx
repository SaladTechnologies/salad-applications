import React from 'react'
import { storiesOf } from '@storybook/react'
//import { SettingsModalPage } from './NewSettingsModalPage'
import './../pagedraw/settings.css';
import Schedules from './assets/Schedules.png';
import Launch from './assets/LaunchStartup.png'
import SettingsItem from './assets/Settings_Item.png'
import Salad from './assets/Salad.io.png'
import Accounts from './assets/Accounts.png'
import Settings from './assets/Settings-1.png'
import Close from './assets/closeButton.png'
import Minimize from './assets/minimizeButton.png'
import LineButton from './assets/lineButton.png'
import Vector from './assets/Vector.png'
import SaladDescription from './assets/SaladCanStart.png'
import LaunchSalad from "./assets/LaunchSalad.png";
import OnButton from "./assets/ON.png"
import OffButton from "./assets/OFF.png"

storiesOf('NewSettingsPage', module)
  .add('Main', () => {
    return (
    <div>
        <BarRectangle />
        <MainRectangle/>
        <ScheduleButton />
        <img src={Schedules} className="settingsimg" height="12" width="87"/>
        <img src={Launch} className="launchOnStartup" height="14" width="153"/>
        <img src={SettingsItem} className="settings-item" height="14" width="113"/>
        <img src={Accounts} className="accounts" height="12" width="77" />
        <img src={Settings} className="settings" height="14" width="77" />
        <img src={Close} className="close-button" height="12" width="12" />
        <img src={Minimize} className="minimize-button" height="12" width="12" />
        <img src={LineButton} className="line-button" width="12" />
        <img src={Salad} className="salad" height="14" />
        <img src={Vector} className="vector-1" width="296.88" />
        <img src={SaladDescription} className="salad-description" height="32" width="300" />
        <img src={Vector} className="vector-2" width="296.88" />
        <img src={LaunchSalad} className="launch-salad" height="12" width="164" />
        <OffRectangle/>
        <OnRectangle/>
        <img src={OnButton} className="on" height="8" width="17"/>
        <img src={OffButton} className="off" height="8" width="23"/>

    </div>
    );
    
  })

const BarRectangle = () => (
    <rect width="1216" height="32" className="settings-bar-rect" />
    );

const MainRectangle = () => (
    <rect width="1216" height="733" className="settings-main-rect" />
);

const OffRectangle = () => (
  <rect width="31" height="16" className="off-rectangle" />
);

const OnRectangle = () => (
  <rect width="31" height="16" className="on-rectangle" />
);

const ScheduleButton = () => (
    <div className="schedules-button">Schedules</div>
);