import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {TextsComponent} from '../components/project/texts/texts.component';
import {LinksComponent} from '../components/project/links/links.component';

export class CanDeactivateLinks implements CanDeactivate<LinksComponent> {
  canDeactivate(component: LinksComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!LinksComponent.saved) {
      return confirm('You have unsaved changes. Are you sure you want to leave this page?');
    }
    return true;
  }

}
