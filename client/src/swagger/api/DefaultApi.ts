/**
 * Customer Portal
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { Http, Headers, URLSearchParams }                    from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType }                     from '@angular/http';

import { Observable }                                        from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models                                           from '../model/models';
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class DefaultApi {
    protected basePath = 'http://localhost:8000/api/v1';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();

    constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
    }

    /**
     * 
     * Login with username and password. The response contains a JWT. 
     * @param userName 
     * @param password 
     */
    public loginPost(userName: string, password: string, extraHttpRequestParams?: any): Observable<models.InlineResponse200> {
        return this.loginPostWithHttpInfo(userName, password, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * 
     * 
     * @param token JSON Web Token
     */
    public logoutPost(token: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.logoutPostWithHttpInfo(token, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * 
     * list of projects
     * @param token JSON Web Token
     */
    public projectsGet(token: string, extraHttpRequestParams?: any): Observable<Array<models.InlineResponse2001>> {
        return this.projectsGetWithHttpInfo(token, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * 
     * project data
     * @param token JSON Web Token
     * @param id project identifier
     */
    public projectsIdGet(token: string, id: string, extraHttpRequestParams?: any): Observable<models.InlineResponse2002> {
        return this.projectsIdGetWithHttpInfo(token, id, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * 
     * update texts
     * @param token JSON Web Token
     * @param id project identifier
     * @param body 
     */
    public projectsIdTextsPut(token: string, id: string, body?: models.Body, extraHttpRequestParams?: any): Observable<{}> {
        return this.projectsIdTextsPutWithHttpInfo(token, id, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }


    /**
     * 
     * Login with username and password. The response contains a JWT. 
     * @param userName 
     * @param password 
     */
    public loginPostWithHttpInfo(userName: string, password: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/login`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'userName' is not null or undefined
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling loginPost.');
        }
        // verify required parameter 'password' is not null or undefined
        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling loginPost.');
        }
        if (userName !== undefined) {
            /*if(userName instanceof Date) {
                queryParameters.set('user_name', <any>userName.d.toISOString());
            } else */{
                queryParameters.set('user_name', <any>userName);
            }
        }

        if (password !== undefined) {
            /*if(password instanceof Date) {
                queryParameters.set('password', <any>password.d.toISOString());
            } else */{
                queryParameters.set('password', <any>password);
            }
        }

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * 
     * 
     * @param token JSON Web Token
     */
    public logoutPostWithHttpInfo(token: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/logout`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'token' is not null or undefined
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling logoutPost.');
        }
        headers.set('token', String(token));

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * 
     * list of projects
     * @param token JSON Web Token
     */
    public projectsGetWithHttpInfo(token: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/projects`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'token' is not null or undefined
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling projectsGet.');
        }
        headers.set('token', String(token));

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * 
     * project data
     * @param token JSON Web Token
     * @param id project identifier
     */
    public projectsIdGetWithHttpInfo(token: string, id: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/projects/${id}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'token' is not null or undefined
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling projectsIdGet.');
        }
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdGet.');
        }
        headers.set('token', String(token));

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * 
     * update texts
     * @param token JSON Web Token
     * @param id project identifier
     * @param body 
     */
    public projectsIdTextsPutWithHttpInfo(token: string, id: string, body?: models.Body, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/projects/${id}/texts`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'token' is not null or undefined
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling projectsIdTextsPut.');
        }
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsPut.');
        }
        headers.set('token', String(token));

        // to determine the Content-Type header
        let consumes: string[] = [
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Put,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}
