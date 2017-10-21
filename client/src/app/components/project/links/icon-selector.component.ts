import {Modal} from '../../../ui/modal';
import {Component} from '@angular/core';

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.css']
})
export class IconSelectorComponent {
  modal = new Modal();
  iconSelected: (string) => void;
  icons = ['android', 'apple', 'bitbucket', 'calendar', 'drupal', 'facebook', 'git', 'github', 'gitlab', 'globe', 'google', 'google-plus',
    'hashtag', 'joomla', 'linkedin', 'quora', 'rss', 'shopping-cart', 'trello', 'twitter', 'users', 'vimeo', 'wordpress', 'xing', 'yahoo',
    'yelp', 'youtube-play'];

  selectIcon(icon: string) {
    this.modal.hide();
    this.iconSelected('fa-' + icon);
  }
}
