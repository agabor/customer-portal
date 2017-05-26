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

import * as models from './models';

export interface Project {
    name?: string;

    slug?: string;

    warnings?: number;

    progress?: number;

    texts?: Array<models.InlineResponse2002Texts>;

    images?: Array<models.InlineResponse2002Images>;

    files?: Array<models.InlineResponse2002Files>;

    locales?: Array<models.InlineResponse2002Locales>;

}
