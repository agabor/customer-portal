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

export interface ImageCondition {
    name: ImageCondition.NameEnum;

    value: number;

}
export namespace ImageCondition {
    export enum NameEnum {
        FixWidth = <any> 'fix_width',
        FixHeight = <any> 'fix_height',
        MinWidth = <any> 'min_width',
        MaxWidth = <any> 'max_width',
        MinHeight = <any> 'min_height',
        MaxHeight = <any> 'max_height'
    }
}