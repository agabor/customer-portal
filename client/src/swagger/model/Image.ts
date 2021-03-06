/**
 * Customer Point
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

export interface Image {
    imageId?: string;

    name?: string;

    description?: string;

    width?: number;

    height?: number;

    minWidth?: number;

    maxWidth?: number;

    minHeight?: number;

    maxHeight?: number;

    fileName?: string;

    conditions?: Array<models.ImageCondition>;

}
