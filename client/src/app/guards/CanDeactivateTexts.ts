import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {ProjectComponent} from '../components/project/project.component';
import {Observable} from 'rxjs/Observable';
import {TextsComponent} from '../components/project/texts/texts.component';

export class CanDeactivateTexts implements CanDeactivate<TextsComponent> {
  canDeactivate(component: TextsComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.saved) {
      return confirm('You have unsaved changes. Are you sure you want to leave this page?');
    }
    return true;
  }

}
