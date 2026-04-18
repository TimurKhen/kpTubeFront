import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs'
import { UserService } from './user-service.service'

let isRefreshing = false
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

const publicUrls = [
  '/videos/',
  '/login',
  '/register',
  '/refresh_token',
]

function isPublicUrl(url: string, method: string): boolean {
  if (method === 'GET' && url.includes('/videos/')) {
    return true
  }

  if (publicUrls.some(publicUrl => url.includes(publicUrl))) {
    return true
  }

  return false
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const userService = inject(UserService)

  const requiresAuth = !isPublicUrl(req.url, req.method)

  if (!requiresAuth) {
    return next(req)
  }

  userService.loadUserData()
  const token = userService.token()
  let authReq = req

  if (token) {
    authReq = addTokenToRequest(req, token)
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && requiresAuth && !req.url.includes('/refresh_token')) {
        return handle401Error(authReq, next, userService)
      }
      return throwError(() => error)
    })
  )
}

function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, userService: UserService) {
  if (!isRefreshing) {
    isRefreshing = true
    refreshTokenSubject.next(null)

    return userService.refreshAuthToken().pipe(
      switchMap(() => {
        isRefreshing = false
        const newToken = userService.token()
        refreshTokenSubject.next(newToken)
        return next(addTokenToRequest(request, newToken!))
      }),
      catchError((refreshError) => {
        isRefreshing = false
        userService.logout()
        return throwError(() => refreshError)
      })
    )
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addTokenToRequest(request, token!)))
    )
  }
}
