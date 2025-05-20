import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-settings-sub-studio',
  standalone: true,
  imports: [],
  templateUrl: './settings-sub-studio.component.html',
  styleUrl: './settings-sub-studio.component.sass'
})
export class SettingsSubStudioComponent {
  @Input() currAvatarImage: string | ArrayBuffer = ''
  @Input() currHeaderImage: string | ArrayBuffer = ''

}
