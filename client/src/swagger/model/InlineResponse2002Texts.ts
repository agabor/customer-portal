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

export interface InlineResponse2002Texts {
    textId?: string;

    name?: string;

    description?: string;

    startGroup?: string;

    minLength?: number;

    maxLength?: number;

    values?: Array<models.InlineResponse2002Values>;

}
