import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { UserService } from "./user-service.service";

let isRefreshing = false

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const userApi = inject(UserService)
    const token = userApi.token()

    if (!token) return next(req)

    if (isRefreshing) {
        return refreshAndProceed(userApi, req, next)
    }

    return next(addToken(req, token))
        .pipe(
            catchError(err => {
                if (err.status === 401) {
                    userApi.logout()
                    return refreshAndProceed(userApi, req, next)
                }

                return throwError(err)
            })
        )
}

const refreshAndProceed = (
    service: UserService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    if (!isRefreshing) {
        isRefreshing = true

        return service.refreshAuthToken()
            .pipe(
                switchMap((res) => {
                    isRefreshing = false
                    return next(addToken(req, res.acces_token))
                })
            )
    }
    return next(addToken(req, service.token()!))
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone(
        {
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}
