import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Alerts } from '../../Core/Services/alerts';
import { UserRole } from '../enums/role.enum';
import { Auth } from '../../Core/Services/auth';


export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const alerts = inject(Alerts);
  const auth=inject(Auth)
  const token = localStorage.getItem('token');
  const role=localStorage.getItem('role')


  if (token&&role==UserRole.ADMIN) {
return true;
  } else {
    // 3. التوكن مش موجود، ارمي تنبيه ورجعه لصفحة اللوجن 🔒
    alerts.showWarning('ACcess Denied Use an admin account');
    auth.logOut();
    return false;
  }
}