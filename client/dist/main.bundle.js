webpackJsonp([1,4],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swagger_api_DefaultApi__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_swagger__ = __webpack_require__(83);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Presenter; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var Presenter = (function () {
    function Presenter(http, api, router, basePath) {
        this.http = http;
        this.api = api;
        this.router = router;
        this.basePath = basePath;
        this.projects = null;
        this.appComponent = null;
        this.activeProject = null;
        this._isLoggedIn = false;
        this.loggedInWithToken = false;
        this.languages = null;
        this._isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.loggedInWithToken = localStorage.getItem('loggedInWithToken') === 'true';
        if (this._isLoggedIn) {
            this.user = {
                id: parseInt(localStorage.getItem('user_id'), 10),
                name: localStorage.getItem('user_name'),
                email: localStorage.getItem('user_email')
            };
        }
    }
    Presenter.prototype.login = function (model) {
        var _this = this;
        var res = this.api.loginPost(model.email, model.password);
        res.subscribe(function (user) {
            _this.setLoggedIn(user);
        }, function (error) {
            if (error.json().error === 'user_not_found') {
                _this.loginFormComponent.showUserError();
            }
            else {
                _this.loginFormComponent.showPasswordError();
            }
        });
    };
    Presenter.prototype.setLoggedIn = function (user) {
        this.user = user;
        this._isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id', this.user.id.toString());
        localStorage.setItem('user_name', this.user.name);
        localStorage.setItem('user_email', this.user.email);
        this.menuComponent.setLoggedIn();
        this.router.navigate(['/projects']);
    };
    Presenter.prototype.tokenLogin = function (login_token) {
        var _this = this;
        var res = this.api.tokenLoginTokenGet(login_token);
        res.subscribe(function (user) {
            _this.setLoggedIn(user);
            _this.loggedInWithToken = true;
            localStorage.setItem('loggedInWithToken', 'true');
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.loadProjects = function (callback) {
        var _this = this;
        var res = this.api.projectsGet();
        res.subscribe(function (data) {
            _this.projects = data;
            callback(_this.projects);
        }, function (error) {
            console.log(error.json());
            _this.router.navigate(['/logout']);
        });
    };
    Presenter.prototype.setAppComponent = function (appComponent) {
        this.appComponent = appComponent;
    };
    Presenter.prototype.isLoggedIn = function () {
        return this._isLoggedIn;
    };
    Presenter.prototype.logout = function () {
        localStorage.clear();
        this.activeProject = null;
        this.menuComponent.setLoggedOut();
        this.api.logoutPost();
    };
    Presenter.prototype.setLoginFormComponent = function (loginFormComponent) {
        this.loginFormComponent = loginFormComponent;
    };
    Presenter.prototype.getProject = function (slug) {
        for (var _i = 0, _a = this.projects; _i < _a.length; _i++) {
            var p = _a[_i];
            if (p.slug === slug) {
                return p;
            }
        }
        return null;
    };
    Presenter.prototype.setProjectComponent = function (projectComponent) {
        this.projectComponent = projectComponent;
    };
    Presenter.prototype.initProject = function (slug) {
        if (this.activeProject != null) {
            this.setProject();
        }
        else {
            this.loadProject(slug);
        }
    };
    Presenter.prototype.loadProject = function (slug, callback) {
        var _this = this;
        var res = this.api.projectsIdGet(slug);
        res.subscribe(function (data) {
            _this.activeProject = data;
            _this.setProject();
            if (callback) {
                callback();
            }
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.setProject = function () {
        this.projectComponent.setProject(this.activeProject);
    };
    Presenter.prototype.setMenuComponent = function (menuComponent) {
        this.menuComponent = menuComponent;
    };
    Presenter.prototype.showProject = function (slug) {
        var _this = this;
        if (this.activeProject != null && this.activeProject.slug === slug) {
            this.navigateToProject(slug);
            return;
        }
        var res = this.api.projectsIdGet(slug);
        res.subscribe(function (data) {
            _this.activeProject = data;
            _this.navigateToProject(slug);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.navigateToProject = function (slug) {
        this.router.navigate(['/projects/' + slug]);
    };
    Presenter.prototype.getImageUrl = function (image) {
        if (image.fileName != null && image.fileName.startsWith('data')) {
            return image.fileName;
        }
        if (image.imageId == null) {
            return '';
        }
        return this.getImagePath(image);
    };
    Presenter.prototype.saveProjectTexts = function (onDone) {
        var res = this.api.projectsIdTextsPut(this.activeProject.slug, { sources: this.activeProject.texts });
        res.subscribe(function (data) {
            console.log(data);
            onDone();
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.uploadImage = function (file, image, callback) {
        var res = this.api.projectsIdImagesImageIdPost(this.activeProject.slug, image.imageId, file);
        res.subscribe(function (data) {
            console.log(data);
            callback(data);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.getImagePath = function (image) {
        return this.basePath + '/projects/' + this.activeProject.slug + '/images/' + image.imageId;
    };
    Presenter.prototype.newImage = function (image) {
        var _this = this;
        var res = this.api.projectsIdImagesPatch(this.activeProject.slug, image.name, image.description, image.minWidth, image.maxWidth, image.minHeight, image.maxHeight);
        res.subscribe(function (data) {
            _this.activeProject.images.push(data);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.deleteImage = function (image) {
        var _this = this;
        var res = this.api.projectsIdImagesImageIdDelete(this.activeProject.slug, image.imageId);
        res.subscribe(function (data) {
            var idx = _this.activeProject.images.indexOf(image);
            _this.activeProject.images.splice(idx, 1);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.updateImage = function (image) {
        var res = this.api.projectsIdImagesImageIdPatch(this.activeProject.slug, image.imageId, image.name, image.description, image.minWidth, image.maxWidth, image.minHeight, image.maxHeight);
        res.subscribe(function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.getUser = function () {
        return this.user;
    };
    Presenter.prototype.addUser = function (newUser, message) {
        var _this = this;
        var res = this.api.projectsIdUsersPost(this.activeProject.slug, newUser.name, newUser.email, message);
        res.subscribe(function (user) {
            _this.activeProject.users.push(user);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.modifyUser = function (user) {
        var res = this.api.projectsIdUsersUserIdPost(this.activeProject.slug, user.id, user.name, user.email);
        res.subscribe(function (data) {
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.deleteUser = function (user) {
        var _this = this;
        var res = this.api.projectsIdUsersUserIdDelete(this.activeProject.slug, user.id);
        res.subscribe(function (data) {
            var index = _this.activeProject.users.indexOf(user);
            if (index > -1) {
                _this.activeProject.users.splice(index, 1);
            }
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.addLink = function (link) {
        var _this = this;
        var res = this.api.projectsIdLinksPost(this.activeProject.slug, link.name, link.icon, link.url);
        res.subscribe(function (newLink) {
            _this.activeProject.links.push(newLink);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.updateLink = function (link) {
        var res = this.api.projectsIdLinksLinkIdPost(this.activeProject.slug, link.id, link.name, link.icon, link.url);
        res.subscribe(function (data) {
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.deleteLink = function (link) {
        var _this = this;
        var res = this.api.projectsIdLinksLinkIdDelete(this.activeProject.slug, link.id);
        res.subscribe(function (data) {
            var index = _this.activeProject.links.indexOf(link);
            if (index > -1) {
                _this.activeProject.links.splice(index, 1);
            }
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.addProject = function (project) {
        var _this = this;
        var res = this.api.projectsPatch(project.name);
        res.subscribe(function (newProject) {
            _this.projects.push(newProject);
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.deleteProject = function (project) {
        var _this = this;
        var res = this.api.projectsIdDelete(project.slug);
        res.subscribe(function (data) {
            var index = _this.projects.indexOf(project);
            if (index > -1) {
                _this.projects.splice(index, 1);
            }
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.updateProject = function (project) {
        var res = this.api.projectsIdPost(project.slug, project.name);
        res.subscribe(function (newProject) {
            project.slug = newProject.slug;
        }, function (error) {
            console.log(error.json());
        });
    };
    Presenter.prototype.addLanguage = function (language, callback, error) {
        var _this = this;
        var res = this.api.projectsIdLanguagesPost(this.activeProject.slug, language.code);
        res.subscribe(function (newLang) {
            _this.activeProject.languages.push(newLang);
            callback();
        }, function () {
            error();
        });
    };
    Presenter.prototype.removeLanguage = function (language) {
        var res = this.api.projectsIdLanguagesDelete(this.activeProject.slug, language.code);
        res.subscribe(function () {
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.setPassword = function (password) {
        var _this = this;
        var res = this.api.setPasswordPost(password);
        res.subscribe(function (data) {
            console.log(data);
            _this.loggedInWithToken = false;
            localStorage.removeItem('loggedInWithToken');
            _this.router.navigate(['/projects']);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.isLoggedInWithToken = function () {
        return this.loggedInWithToken;
    };
    Presenter.prototype.addText = function (text, callback) {
        var _this = this;
        var res = this.api.projectsIdTextsPost(this.activeProject.slug, text.textId, text.name, text.description, text.startGroup, text.minLength, text.maxLength);
        res.subscribe(function (newText) {
            console.log(newText);
            _this.activeProject.texts.push(newText);
            callback();
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.updateText = function (text) {
        var res = this.api.projectsIdTextsTextIdPost(this.activeProject.slug, text.textId, text.name, text.description, text.startGroup, text.minLength, text.maxLength);
        res.subscribe(function (newText) {
            console.log(newText);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.deleteText = function (text) {
        var res = this.api.projectsIdTextsTextIdDelete(this.activeProject.slug, text.textId);
        res.subscribe(function (newText) {
            console.log(newText);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.saveLinks = function (callback) {
        var res = this.api.projectsIdLinksPut(this.activeProject.slug, { sources: this.activeProject.links });
        res.subscribe(function (data) {
            console.log(data);
            callback();
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.resetTextVaule = function (text, language) {
        var toReset;
        for (var _i = 0, _a = text.values; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.languageCode === language.code) {
                toReset = value;
                break;
            }
        }
        if (toReset === null) {
            return;
        }
        var res = this.api.projectsIdTextsTextIdGet(this.activeProject.slug, text.textId);
        res.subscribe(function (original) {
            console.log(original);
            for (var _i = 0, _a = original.values; _i < _a.length; _i++) {
                var value = _a[_i];
                if (value.languageCode === language.code) {
                    toReset.value = value.value;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.getLanguages = function (callback) {
        var _this = this;
        if (this.languages != null) {
            callback(this.languages);
            return;
        }
        var res = this.api.languagesGet();
        res.subscribe(function (languages) {
            _this.languages = languages;
            callback(languages);
        }, function (error) {
            console.log(error);
        });
    };
    Presenter.prototype.changePassword = function (oldPassword, newPassword, success, error) {
        var res = this.api.changePasswordPost(oldPassword, newPassword);
        res.subscribe(function () {
            success();
        }, function () {
            error();
        });
    };
    return Presenter;
}());
Presenter = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __param(3, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4_swagger__["BASE_PATH"])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_http__["f" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_http__["f" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__swagger_api_DefaultApi__["a" /* DefaultApi */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__swagger_api_DefaultApi__["a" /* DefaultApi */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _c || Object, String])
], Presenter);

var _a, _b, _c;
//# sourceMappingURL=presenter.js.map

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Modal; });
var Modal = (function () {
    function Modal() {
        this.hClass = 'modal fade';
        this.hStyle = 'display: none;';
        this.shown = false;
    }
    Modal.prototype.show = function () {
        this.hClass = 'modal fade in';
        this.hStyle = 'display: block;';
        this.shown = true;
    };
    Modal.prototype.hide = function () {
        this.hClass = 'modal fade';
        this.hStyle = 'display: none;';
        this.shown = false;
    };
    return Modal;
}());

//# sourceMappingURL=modal.js.map

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__variables__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__configuration__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DefaultApi; });
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/* tslint:disable:no-unused-variable member-ordering */






var DefaultApi = (function () {
    function DefaultApi(http, basePath, configuration) {
        this.http = http;
        this.basePath = 'http://customerpoint.net/api/v1';
        this.defaultHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        this.configuration = new __WEBPACK_IMPORTED_MODULE_4__configuration__["a" /* Configuration */]();
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
    }
    /**
     * change password
     * @param oldPassword
     * @param newPassword
     */
    DefaultApi.prototype.changePasswordPost = function (oldPassword, newPassword, extraHttpRequestParams) {
        return this.changePasswordPostWithHttpInfo(oldPassword, newPassword, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * list of languages
     */
    DefaultApi.prototype.languagesGet = function (extraHttpRequestParams) {
        return this.languagesGetWithHttpInfo(extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * Login with email and password. The response contains a JWT.
     * @param email
     * @param password
     */
    DefaultApi.prototype.loginPost = function (email, password, extraHttpRequestParams) {
        return this.loginPostWithHttpInfo(email, password, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     *
     */
    DefaultApi.prototype.logoutPost = function (extraHttpRequestParams) {
        return this.logoutPostWithHttpInfo(extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * list of projects
     */
    DefaultApi.prototype.projectsGet = function (extraHttpRequestParams) {
        return this.projectsGetWithHttpInfo(extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     *
     * @param id project identifier
     */
    DefaultApi.prototype.projectsIdDelete = function (id, extraHttpRequestParams) {
        return this.projectsIdDeleteWithHttpInfo(id, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * project data
     * @param id project identifier
     */
    DefaultApi.prototype.projectsIdGet = function (id, extraHttpRequestParams) {
        return this.projectsIdGetWithHttpInfo(id, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * delete image
     * @param id project identifier
     * @param imageId image identifier
     */
    DefaultApi.prototype.projectsIdImagesImageIdDelete = function (id, imageId, extraHttpRequestParams) {
        return this.projectsIdImagesImageIdDeleteWithHttpInfo(id, imageId, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * modify image
     * @param id project identifier
     * @param imageId image identifier
     * @param name
     * @param description
     * @param minWidth
     * @param maxWidth
     * @param minHeight
     * @param maxHeight
     */
    DefaultApi.prototype.projectsIdImagesImageIdPatch = function (id, imageId, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams) {
        return this.projectsIdImagesImageIdPatchWithHttpInfo(id, imageId, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * update image
     * @param id project identifier
     * @param imageId image identifier
     * @param image The uploaded image
     */
    DefaultApi.prototype.projectsIdImagesImageIdPost = function (id, imageId, image, extraHttpRequestParams) {
        return this.projectsIdImagesImageIdPostWithHttpInfo(id, imageId, image, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * add image
     * @param id project identifier
     * @param name
     * @param description
     * @param minWidth
     * @param maxWidth
     * @param minHeight
     * @param maxHeight
     */
    DefaultApi.prototype.projectsIdImagesPatch = function (id, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams) {
        return this.projectsIdImagesPatchWithHttpInfo(id, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * remove language from project
     * @param id project identifier
     * @param code
     */
    DefaultApi.prototype.projectsIdLanguagesDelete = function (id, code, extraHttpRequestParams) {
        return this.projectsIdLanguagesDeleteWithHttpInfo(id, code, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * add language to project
     * @param id project identifier
     * @param code
     */
    DefaultApi.prototype.projectsIdLanguagesPost = function (id, code, extraHttpRequestParams) {
        return this.projectsIdLanguagesPostWithHttpInfo(id, code, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * delete link
     * @param id project identifier
     * @param linkId project identifier
     */
    DefaultApi.prototype.projectsIdLinksLinkIdDelete = function (id, linkId, extraHttpRequestParams) {
        return this.projectsIdLinksLinkIdDeleteWithHttpInfo(id, linkId, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * modify user
     * @param id project identifier
     * @param linkId project identifier
     * @param name
     * @param icon
     * @param url
     */
    DefaultApi.prototype.projectsIdLinksLinkIdPost = function (id, linkId, name, icon, url, extraHttpRequestParams) {
        return this.projectsIdLinksLinkIdPostWithHttpInfo(id, linkId, name, icon, url, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * create new user and add to project
     * @param id project identifier
     * @param name
     * @param icon
     * @param url
     */
    DefaultApi.prototype.projectsIdLinksPost = function (id, name, icon, url, extraHttpRequestParams) {
        return this.projectsIdLinksPostWithHttpInfo(id, name, icon, url, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * update links
     * @param id project identifier
     * @param body
     */
    DefaultApi.prototype.projectsIdLinksPut = function (id, body, extraHttpRequestParams) {
        return this.projectsIdLinksPutWithHttpInfo(id, body, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * modify project
     * @param id project identifier
     * @param name project name
     */
    DefaultApi.prototype.projectsIdPost = function (id, name, extraHttpRequestParams) {
        return this.projectsIdPostWithHttpInfo(id, name, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * add new text
     * @param id project identifier
     * @param textId
     * @param name
     * @param description
     * @param startGroup
     * @param minLength
     * @param maxLength
     */
    DefaultApi.prototype.projectsIdTextsPost = function (id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams) {
        return this.projectsIdTextsPostWithHttpInfo(id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * update texts
     * @param id project identifier
     * @param body
     */
    DefaultApi.prototype.projectsIdTextsPut = function (id, body, extraHttpRequestParams) {
        return this.projectsIdTextsPutWithHttpInfo(id, body, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * delete text
     * @param id project identifier
     * @param textId
     */
    DefaultApi.prototype.projectsIdTextsTextIdDelete = function (id, textId, extraHttpRequestParams) {
        return this.projectsIdTextsTextIdDeleteWithHttpInfo(id, textId, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * get text
     * @param id project identifier
     * @param textId
     */
    DefaultApi.prototype.projectsIdTextsTextIdGet = function (id, textId, extraHttpRequestParams) {
        return this.projectsIdTextsTextIdGetWithHttpInfo(id, textId, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * modify text
     * @param id project identifier
     * @param textId
     * @param name
     * @param description
     * @param startGroup
     * @param minLength
     * @param maxLength
     */
    DefaultApi.prototype.projectsIdTextsTextIdPost = function (id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams) {
        return this.projectsIdTextsTextIdPostWithHttpInfo(id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * create new user and add to project
     * @param id project identifier
     * @param name
     * @param email
     * @param message
     */
    DefaultApi.prototype.projectsIdUsersPost = function (id, name, email, message, extraHttpRequestParams) {
        return this.projectsIdUsersPostWithHttpInfo(id, name, email, message, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * delete user
     * @param id project identifier
     * @param userId project identifier
     */
    DefaultApi.prototype.projectsIdUsersUserIdDelete = function (id, userId, extraHttpRequestParams) {
        return this.projectsIdUsersUserIdDeleteWithHttpInfo(id, userId, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * modify user
     * @param id project identifier
     * @param userId project identifier
     * @param name
     * @param email
     */
    DefaultApi.prototype.projectsIdUsersUserIdPost = function (id, userId, name, email, extraHttpRequestParams) {
        return this.projectsIdUsersUserIdPostWithHttpInfo(id, userId, name, email, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * add new project
     * @param name project name
     */
    DefaultApi.prototype.projectsPatch = function (name, extraHttpRequestParams) {
        return this.projectsPatchWithHttpInfo(name, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * sets the initial password for a user logged in with a token.
     * @param password
     */
    DefaultApi.prototype.setPasswordPost = function (password, extraHttpRequestParams) {
        return this.setPasswordPostWithHttpInfo(password, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     * Login with username and password. The response contains a JWT.
     * @param loginToken
     */
    DefaultApi.prototype.tokenLoginTokenGet = function (loginToken, extraHttpRequestParams) {
        return this.tokenLoginTokenGetWithHttpInfo(loginToken, extraHttpRequestParams)
            .map(function (response) {
            if (response.status === 204) {
                return undefined;
            }
            else {
                return response.json() || {};
            }
        });
    };
    /**
     *
     * change password
     * @param oldPassword
     * @param newPassword
     */
    DefaultApi.prototype.changePasswordPostWithHttpInfo = function (oldPassword, newPassword, extraHttpRequestParams) {
        var path = this.basePath + '/changePassword';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'oldPassword' is not null or undefined
        if (oldPassword === null || oldPassword === undefined) {
            throw new Error('Required parameter oldPassword was null or undefined when calling changePasswordPost.');
        }
        // verify required parameter 'newPassword' is not null or undefined
        if (newPassword === null || newPassword === undefined) {
            throw new Error('Required parameter newPassword was null or undefined when calling changePasswordPost.');
        }
        if (oldPassword !== undefined) {
            queryParameters.set('old_password', oldPassword);
        }
        if (newPassword !== undefined) {
            queryParameters.set('new_password', newPassword);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * list of languages
     */
    DefaultApi.prototype.languagesGetWithHttpInfo = function (extraHttpRequestParams) {
        var path = this.basePath + '/languages';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Get,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * Login with email and password. The response contains a JWT.
     * @param email
     * @param password
     */
    DefaultApi.prototype.loginPostWithHttpInfo = function (email, password, extraHttpRequestParams) {
        var path = this.basePath + '/login';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling loginPost.');
        }
        // verify required parameter 'password' is not null or undefined
        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling loginPost.');
        }
        if (email !== undefined) {
            queryParameters.set('email', email);
        }
        if (password !== undefined) {
            queryParameters.set('password', password);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     *
     */
    DefaultApi.prototype.logoutPostWithHttpInfo = function (extraHttpRequestParams) {
        var path = this.basePath + '/logout';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * list of projects
     */
    DefaultApi.prototype.projectsGetWithHttpInfo = function (extraHttpRequestParams) {
        var path = this.basePath + '/projects';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Get,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     *
     * @param id project identifier
     */
    DefaultApi.prototype.projectsIdDeleteWithHttpInfo = function (id, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdDelete.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * project data
     * @param id project identifier
     */
    DefaultApi.prototype.projectsIdGetWithHttpInfo = function (id, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdGet.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Get,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * delete image
     * @param id project identifier
     * @param imageId image identifier
     */
    DefaultApi.prototype.projectsIdImagesImageIdDeleteWithHttpInfo = function (id, imageId, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/images/${imageId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'imageId' + '}', String(imageId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdImagesImageIdDelete.');
        }
        // verify required parameter 'imageId' is not null or undefined
        if (imageId === null || imageId === undefined) {
            throw new Error('Required parameter imageId was null or undefined when calling projectsIdImagesImageIdDelete.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * modify image
     * @param id project identifier
     * @param imageId image identifier
     * @param name
     * @param description
     * @param minWidth
     * @param maxWidth
     * @param minHeight
     * @param maxHeight
     */
    DefaultApi.prototype.projectsIdImagesImageIdPatchWithHttpInfo = function (id, imageId, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/images/${imageId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'imageId' + '}', String(imageId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdImagesImageIdPatch.');
        }
        // verify required parameter 'imageId' is not null or undefined
        if (imageId === null || imageId === undefined) {
            throw new Error('Required parameter imageId was null or undefined when calling projectsIdImagesImageIdPatch.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (description !== undefined) {
            queryParameters.set('description', description);
        }
        if (minWidth !== undefined) {
            queryParameters.set('minWidth', minWidth);
        }
        if (maxWidth !== undefined) {
            queryParameters.set('maxWidth', maxWidth);
        }
        if (minHeight !== undefined) {
            queryParameters.set('minHeight', minHeight);
        }
        if (maxHeight !== undefined) {
            queryParameters.set('maxHeight', maxHeight);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Patch,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * update image
     * @param id project identifier
     * @param imageId image identifier
     * @param image The uploaded image
     */
    DefaultApi.prototype.projectsIdImagesImageIdPostWithHttpInfo = function (id, imageId, image, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/images/${imageId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'imageId' + '}', String(imageId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        var formParams = new FormData();
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdImagesImageIdPost.');
        }
        // verify required parameter 'imageId' is not null or undefined
        if (imageId === null || imageId === undefined) {
            throw new Error('Required parameter imageId was null or undefined when calling projectsIdImagesImageIdPost.');
        }
        // verify required parameter 'image' is not null or undefined
        if (image === null || image === undefined) {
            throw new Error('Required parameter image was null or undefined when calling projectsIdImagesImageIdPost.');
        }
        // to determine the Content-Type header
        var consumes = [
            'multipart/form-data'
        ];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        //headers.set('Content-Type', 'application/x-www-form-urlencoded');
        if (image !== undefined) {
            formParams.append('image', image);
        }
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            body: formParams.toString(),
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * add image
     * @param id project identifier
     * @param name
     * @param description
     * @param minWidth
     * @param maxWidth
     * @param minHeight
     * @param maxHeight
     */
    DefaultApi.prototype.projectsIdImagesPatchWithHttpInfo = function (id, name, description, minWidth, maxWidth, minHeight, maxHeight, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/images'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdImagesPatch.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (description !== undefined) {
            queryParameters.set('description', description);
        }
        if (minWidth !== undefined) {
            queryParameters.set('minWidth', minWidth);
        }
        if (maxWidth !== undefined) {
            queryParameters.set('maxWidth', maxWidth);
        }
        if (minHeight !== undefined) {
            queryParameters.set('minHeight', minHeight);
        }
        if (maxHeight !== undefined) {
            queryParameters.set('maxHeight', maxHeight);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Patch,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * remove language from project
     * @param id project identifier
     * @param code
     */
    DefaultApi.prototype.projectsIdLanguagesDeleteWithHttpInfo = function (id, code, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/languages'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLanguagesDelete.');
        }
        if (code !== undefined) {
            queryParameters.set('code', code);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * add language to project
     * @param id project identifier
     * @param code
     */
    DefaultApi.prototype.projectsIdLanguagesPostWithHttpInfo = function (id, code, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/languages'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLanguagesPost.');
        }
        if (code !== undefined) {
            queryParameters.set('code', code);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * delete link
     * @param id project identifier
     * @param linkId project identifier
     */
    DefaultApi.prototype.projectsIdLinksLinkIdDeleteWithHttpInfo = function (id, linkId, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/links/${link_id}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'link_id' + '}', String(linkId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLinksLinkIdDelete.');
        }
        // verify required parameter 'linkId' is not null or undefined
        if (linkId === null || linkId === undefined) {
            throw new Error('Required parameter linkId was null or undefined when calling projectsIdLinksLinkIdDelete.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * modify user
     * @param id project identifier
     * @param linkId project identifier
     * @param name
     * @param icon
     * @param url
     */
    DefaultApi.prototype.projectsIdLinksLinkIdPostWithHttpInfo = function (id, linkId, name, icon, url, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/links/${link_id}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'link_id' + '}', String(linkId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLinksLinkIdPost.');
        }
        // verify required parameter 'linkId' is not null or undefined
        if (linkId === null || linkId === undefined) {
            throw new Error('Required parameter linkId was null or undefined when calling projectsIdLinksLinkIdPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdLinksLinkIdPost.');
        }
        // verify required parameter 'icon' is not null or undefined
        if (icon === null || icon === undefined) {
            throw new Error('Required parameter icon was null or undefined when calling projectsIdLinksLinkIdPost.');
        }
        // verify required parameter 'url' is not null or undefined
        if (url === null || url === undefined) {
            throw new Error('Required parameter url was null or undefined when calling projectsIdLinksLinkIdPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (icon !== undefined) {
            queryParameters.set('icon', icon);
        }
        if (url !== undefined) {
            queryParameters.set('url', url);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * create new user and add to project
     * @param id project identifier
     * @param name
     * @param icon
     * @param url
     */
    DefaultApi.prototype.projectsIdLinksPostWithHttpInfo = function (id, name, icon, url, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/links'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLinksPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdLinksPost.');
        }
        // verify required parameter 'icon' is not null or undefined
        if (icon === null || icon === undefined) {
            throw new Error('Required parameter icon was null or undefined when calling projectsIdLinksPost.');
        }
        // verify required parameter 'url' is not null or undefined
        if (url === null || url === undefined) {
            throw new Error('Required parameter url was null or undefined when calling projectsIdLinksPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (icon !== undefined) {
            queryParameters.set('icon', icon);
        }
        if (url !== undefined) {
            queryParameters.set('url', url);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * update links
     * @param id project identifier
     * @param body
     */
    DefaultApi.prototype.projectsIdLinksPutWithHttpInfo = function (id, body, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/links'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdLinksPut.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        headers.set('Content-Type', 'application/json');
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Put,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body),
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * modify project
     * @param id project identifier
     * @param name project name
     */
    DefaultApi.prototype.projectsIdPostWithHttpInfo = function (id, name, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * add new text
     * @param id project identifier
     * @param textId
     * @param name
     * @param description
     * @param startGroup
     * @param minLength
     * @param maxLength
     */
    DefaultApi.prototype.projectsIdTextsPostWithHttpInfo = function (id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/texts'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'textId' is not null or undefined
        if (textId === null || textId === undefined) {
            throw new Error('Required parameter textId was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'description' is not null or undefined
        if (description === null || description === undefined) {
            throw new Error('Required parameter description was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'startGroup' is not null or undefined
        if (startGroup === null || startGroup === undefined) {
            throw new Error('Required parameter startGroup was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'minLength' is not null or undefined
        if (minLength === null || minLength === undefined) {
            throw new Error('Required parameter minLength was null or undefined when calling projectsIdTextsPost.');
        }
        // verify required parameter 'maxLength' is not null or undefined
        if (maxLength === null || maxLength === undefined) {
            throw new Error('Required parameter maxLength was null or undefined when calling projectsIdTextsPost.');
        }
        if (textId !== undefined) {
            queryParameters.set('textId', textId);
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (description !== undefined) {
            queryParameters.set('description', description);
        }
        if (startGroup !== undefined) {
            queryParameters.set('startGroup', startGroup);
        }
        if (minLength !== undefined) {
            queryParameters.set('minLength', minLength);
        }
        if (maxLength !== undefined) {
            queryParameters.set('maxLength', maxLength);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * update texts
     * @param id project identifier
     * @param body
     */
    DefaultApi.prototype.projectsIdTextsPutWithHttpInfo = function (id, body, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/texts'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsPut.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        headers.set('Content-Type', 'application/json');
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Put,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body),
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * delete text
     * @param id project identifier
     * @param textId
     */
    DefaultApi.prototype.projectsIdTextsTextIdDeleteWithHttpInfo = function (id, textId, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/texts/${textId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'textId' + '}', String(textId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsTextIdDelete.');
        }
        // verify required parameter 'textId' is not null or undefined
        if (textId === null || textId === undefined) {
            throw new Error('Required parameter textId was null or undefined when calling projectsIdTextsTextIdDelete.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * get text
     * @param id project identifier
     * @param textId
     */
    DefaultApi.prototype.projectsIdTextsTextIdGetWithHttpInfo = function (id, textId, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/texts/${textId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'textId' + '}', String(textId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsTextIdGet.');
        }
        // verify required parameter 'textId' is not null or undefined
        if (textId === null || textId === undefined) {
            throw new Error('Required parameter textId was null or undefined when calling projectsIdTextsTextIdGet.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Get,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * modify text
     * @param id project identifier
     * @param textId
     * @param name
     * @param description
     * @param startGroup
     * @param minLength
     * @param maxLength
     */
    DefaultApi.prototype.projectsIdTextsTextIdPostWithHttpInfo = function (id, textId, name, description, startGroup, minLength, maxLength, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/texts/${textId}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'textId' + '}', String(textId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'textId' is not null or undefined
        if (textId === null || textId === undefined) {
            throw new Error('Required parameter textId was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'description' is not null or undefined
        if (description === null || description === undefined) {
            throw new Error('Required parameter description was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'startGroup' is not null or undefined
        if (startGroup === null || startGroup === undefined) {
            throw new Error('Required parameter startGroup was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'minLength' is not null or undefined
        if (minLength === null || minLength === undefined) {
            throw new Error('Required parameter minLength was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        // verify required parameter 'maxLength' is not null or undefined
        if (maxLength === null || maxLength === undefined) {
            throw new Error('Required parameter maxLength was null or undefined when calling projectsIdTextsTextIdPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (description !== undefined) {
            queryParameters.set('description', description);
        }
        if (startGroup !== undefined) {
            queryParameters.set('startGroup', startGroup);
        }
        if (minLength !== undefined) {
            queryParameters.set('minLength', minLength);
        }
        if (maxLength !== undefined) {
            queryParameters.set('maxLength', maxLength);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * create new user and add to project
     * @param id project identifier
     * @param name
     * @param email
     * @param message
     */
    DefaultApi.prototype.projectsIdUsersPostWithHttpInfo = function (id, name, email, message, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/users'
            .replace('${' + 'id' + '}', String(id));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdUsersPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdUsersPost.');
        }
        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling projectsIdUsersPost.');
        }
        // verify required parameter 'message' is not null or undefined
        if (message === null || message === undefined) {
            throw new Error('Required parameter message was null or undefined when calling projectsIdUsersPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (email !== undefined) {
            queryParameters.set('email', email);
        }
        if (message !== undefined) {
            queryParameters.set('message', message);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * delete user
     * @param id project identifier
     * @param userId project identifier
     */
    DefaultApi.prototype.projectsIdUsersUserIdDeleteWithHttpInfo = function (id, userId, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/users/${user_id}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'user_id' + '}', String(userId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdUsersUserIdDelete.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling projectsIdUsersUserIdDelete.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Delete,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * modify user
     * @param id project identifier
     * @param userId project identifier
     * @param name
     * @param email
     */
    DefaultApi.prototype.projectsIdUsersUserIdPostWithHttpInfo = function (id, userId, name, email, extraHttpRequestParams) {
        var path = this.basePath + '/projects/${id}/users/${user_id}'
            .replace('${' + 'id' + '}', String(id))
            .replace('${' + 'user_id' + '}', String(userId));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling projectsIdUsersUserIdPost.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling projectsIdUsersUserIdPost.');
        }
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsIdUsersUserIdPost.');
        }
        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling projectsIdUsersUserIdPost.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        if (email !== undefined) {
            queryParameters.set('email', email);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * add new project
     * @param name project name
     */
    DefaultApi.prototype.projectsPatchWithHttpInfo = function (name, extraHttpRequestParams) {
        var path = this.basePath + '/projects';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'name' is not null or undefined
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling projectsPatch.');
        }
        if (name !== undefined) {
            queryParameters.set('name', name);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Patch,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * sets the initial password for a user logged in with a token.
     * @param password
     */
    DefaultApi.prototype.setPasswordPostWithHttpInfo = function (password, extraHttpRequestParams) {
        var path = this.basePath + '/setPassword';
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'password' is not null or undefined
        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling setPasswordPost.');
        }
        if (password !== undefined) {
            queryParameters.set('password', password);
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Post,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    /**
     *
     * Login with username and password. The response contains a JWT.
     * @param loginToken
     */
    DefaultApi.prototype.tokenLoginTokenGetWithHttpInfo = function (loginToken, extraHttpRequestParams) {
        var path = this.basePath + '/token/${login_token}'
            .replace('${' + 'login_token' + '}', String(loginToken));
        var queryParameters = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */](this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'loginToken' is not null or undefined
        if (loginToken === null || loginToken === undefined) {
            throw new Error('Required parameter loginToken was null or undefined when calling tokenLoginTokenGet.');
        }
        // to determine the Content-Type header
        var consumes = [];
        // to determine the Accept header
        var produces = [
            'application/json'
        ];
        var requestOptions = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestMethod */].Get,
            headers: headers,
            search: queryParameters,
            withCredentials: this.configuration.withCredentials
        });
        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = Object.assign(requestOptions, extraHttpRequestParams);
        }
        return this.http.request(path, requestOptions);
    };
    return DefaultApi;
}());
DefaultApi = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __param(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* Optional */])()), __param(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__variables__["a" /* BASE_PATH */])), __param(2, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* Optional */])()),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */]) === "function" && _a || Object, String, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__configuration__["a" /* Configuration */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__configuration__["a" /* Configuration */]) === "function" && _b || Object])
], DefaultApi);

var _a, _b;
//# sourceMappingURL=DefaultApi.js.map

/***/ }),
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\r\n    border-left: 5px solid #42A948; /* green */\r\n}\r\n.ng-invalid:not(form)  {\r\n    border-left: 5px solid #a94442; /* red */\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PasswordInputComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var PasswordInputComponent = (function () {
    function PasswordInputComponent() {
        this.newPassword = '';
        this.repeatPassword = '';
    }
    PasswordInputComponent.prototype.isValid = function () {
        return this.repeatPassword === this.newPassword && this.newPassword.length >= 6;
    };
    return PasswordInputComponent;
}());
PasswordInputComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-password-input',
        template: __webpack_require__(233),
        styles: [__webpack_require__(37)]
    })
], PasswordInputComponent);

//# sourceMappingURL=password-input.component.js.map

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImageModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ImageModalComponent = (function () {
    function ImageModalComponent(presenter) {
        this.presenter = presenter;
        this.currentImage = {
            imageId: null,
            name: null,
            width: 0,
            height: 0,
            fileName: null,
            conditions: []
        };
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
    }
    ImageModalComponent.prototype.showImage = function (image) {
        this.currentImage = image;
        var rw = 0.9 * window.innerWidth / image.width;
        var rh = 0.9 * window.innerHeight / image.height;
        if (rw < 1 || rh < 1) {
            var r = Math.min(rw, rh);
            this.width = image.width * r;
            this.height = image.height * r;
        }
        else {
            this.width = image.width;
            this.height = image.height;
        }
        this.modal.show();
    };
    ImageModalComponent.prototype.getImageUrl = function (image) {
        return this.presenter.getImageUrl(image);
    };
    ImageModalComponent.prototype.getModalLeft = function () {
        return (window.innerWidth - this.width - 2) / 2;
    };
    return ImageModalComponent;
}());
ImageModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-image-modal',
        template: __webpack_require__(237),
        styles: [__webpack_require__(218)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], ImageModalComponent);

var _a;
//# sourceMappingURL=image-modal.component.js.map

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectLogic; });
var ProjectLogic = (function () {
    function ProjectLogic(project) {
        this.project = project;
    }
    ProjectLogic.hasWarning = function (text, localText) {
        if (localText.value.length === 0) {
            return true;
        }
        if (localText.value.length < text.minLength) {
            return true;
        }
        return localText.value.length > text.maxLength;
    };
    ProjectLogic.imageHasWarning = function (img) {
        if (img.fileName == null || img.fileName.length === 0) {
            return true;
        }
        else if (img.width < img.minWidth || img.width > img.maxWidth || img.height < img.minHeight || img.height > img.maxHeight) {
            return true;
        }
        return false;
    };
    ProjectLogic.prototype.getLocaleTextWarningCount = function (languageIdx) {
        var language = this.project.languages[languageIdx];
        var count = 0;
        for (var _i = 0, _a = this.project.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            for (var _b = 0, _c = text.values; _b < _c.length; _b++) {
                var lt = _c[_b];
                if (lt.languageCode === language.code) {
                    if (lt.value.length < text.minLength) {
                        ++count;
                    }
                    if (lt.value.length > text.maxLength) {
                        ++count;
                    }
                }
            }
        }
        return count;
    };
    ProjectLogic.prototype.getTextWarningCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.project.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            for (var _b = 0, _c = text.values; _b < _c.length; _b++) {
                var lt = _c[_b];
                if (ProjectLogic.hasWarning(text, lt)) {
                    ++count;
                }
            }
        }
        return count;
    };
    ProjectLogic.prototype.getTextCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.project.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            count += text.values.length;
        }
        return count;
    };
    ProjectLogic.prototype.getFieldCount = function () {
        return this.getTextCount() + this.project.images.length + this.project.files.length;
    };
    ProjectLogic.prototype.getImageWarningCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.project.images; _i < _a.length; _i++) {
            var img = _a[_i];
            if (ProjectLogic.imageHasWarning(img)) {
                ++count;
            }
        }
        return count;
    };
    ProjectLogic.prototype.getFileWarningCount = function () {
        var count = 0;
        for (var _i = 0, _a = this.project.files; _i < _a.length; _i++) {
            var img = _a[_i];
            if (img.fileName == null || img.fileName.length === 0) {
                ++count;
            }
        }
        return count;
    };
    ProjectLogic.prototype.getWarningCount = function () {
        return this.getTextWarningCount() + this.getImageWarningCount() + this.getFileWarningCount();
    };
    ProjectLogic.prototype.getInfoPercentage = function () {
        var count = this.getFieldCount();
        return (count - this.getWarningCount()) * 100 / count;
    };
    return ProjectLogic;
}());

//# sourceMappingURL=project-logic.js.map

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BASE_PATH; });
/* unused harmony export COLLECTION_FORMATS */

var BASE_PATH = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* OpaqueToken */]('basePath');
var COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
};
//# sourceMappingURL=variables.js.map

/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProjectModalComponent = (function () {
    function ProjectModalComponent() {
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
        this.project = {};
    }
    ProjectModalComponent.prototype.show = function (projectlistComponent) {
        this.projectlistComponent = projectlistComponent;
        this.modal.show();
    };
    ProjectModalComponent.prototype.save = function () {
        this.hide();
        this.projectlistComponent.saveProject();
        this.project = {};
        this.projectForm.form.markAsPristine();
    };
    ProjectModalComponent.prototype.hide = function () {
        this.modal.hide();
    };
    return ProjectModalComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('projectForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], ProjectModalComponent.prototype, "projectForm", void 0);
ProjectModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-modal',
        template: __webpack_require__(235)
    })
], ProjectModalComponent);

var _a;
//# sourceMappingURL=project-modal.component.js.map

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewImageModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NewImageModalComponent = (function () {
    function NewImageModalComponent(presenter) {
        this.presenter = presenter;
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
        this.image = { name: '', description: '', minWidth: 100, maxWidth: 100, minHeight: 100, maxHeight: 100 };
    }
    NewImageModalComponent.prototype.show = function () {
        this.modal.show();
    };
    NewImageModalComponent.prototype.save = function () {
        this.presenter.newImage(this.image);
        this.hide();
    };
    NewImageModalComponent.prototype.hide = function () {
        this.modal.hide();
    };
    return NewImageModalComponent;
}());
NewImageModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-new-image-modal',
        template: __webpack_require__(239)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], NewImageModalComponent);

var _a;
//# sourceMappingURL=new-image-modal.component.js.map

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_modal__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IconSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var IconSelectorComponent = (function () {
    function IconSelectorComponent() {
        this.modal = new __WEBPACK_IMPORTED_MODULE_0__ui_modal__["a" /* Modal */]();
        this.icons = ['android', 'apple', 'bitbucket', 'calendar', 'drupal', 'facebook', 'git', 'github', 'gitlab', 'globe', 'google', 'google-plus',
            'hashtag', 'joomla', 'linkedin', 'quora', 'rss', 'shopping-cart', 'trello', 'twitter', 'users', 'vimeo', 'wordpress', 'xing', 'yahoo',
            'yelp', 'youtube-play'];
    }
    IconSelectorComponent.prototype.selectIcon = function (icon) {
        this.modal.hide();
        this.iconSelected('fa-' + icon);
    };
    return IconSelectorComponent;
}());
IconSelectorComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_15" /* Component */])({
        selector: 'app-icon-selector',
        template: __webpack_require__(241),
        styles: [__webpack_require__(220)]
    })
], IconSelectorComponent);

//# sourceMappingURL=icon-selector.component.js.map

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_modal__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__icon_selector_component__ = __webpack_require__(74);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinkModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LinkModalComponent = (function () {
    function LinkModalComponent() {
        this.modal = new __WEBPACK_IMPORTED_MODULE_1__ui_modal__["a" /* Modal */]();
        this.link = { icon: '' };
    }
    LinkModalComponent.prototype.show = function (linksComponent) {
        this.linksComponent = linksComponent;
        this.modal.show();
    };
    LinkModalComponent.prototype.save = function () {
        this.hide();
        this.linksComponent.saveLink();
        this.link = {};
        this.newLinkForm.form.markAsPristine();
    };
    LinkModalComponent.prototype.hide = function () {
        this.modal.hide();
    };
    LinkModalComponent.prototype.chooseIcon = function () {
        var _this = this;
        this.iconSelector.iconSelected = function (icon) {
            _this.link.icon = icon;
        };
        this.iconSelector.modal.show();
    };
    Object.defineProperty(LinkModalComponent.prototype, "iconSuffix", {
        get: function () {
            if (this.link.icon == null || this.link.icon.length < 3) {
                return '';
            }
            return this.link.icon.substr(3);
        },
        set: function (theIcon) {
            this.link.icon = 'fa-' + theIcon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkModalComponent.prototype, "isIconValid", {
        get: function () {
            return /^[a-z0-9\-]*$/.test(this.iconSuffix);
        },
        enumerable: true,
        configurable: true
    });
    return LinkModalComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('newLinkForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], LinkModalComponent.prototype, "newLinkForm", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_3__icon_selector_component__["a" /* IconSelectorComponent */]),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__icon_selector_component__["a" /* IconSelectorComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__icon_selector_component__["a" /* IconSelectorComponent */]) === "function" && _b || Object)
], LinkModalComponent.prototype, "iconSelector", void 0);
LinkModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-link-modal',
        template: __webpack_require__(242)
    })
], LinkModalComponent);

var _a, _b;
//# sourceMappingURL=link-modal.component.js.map

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__link_modal_component__ = __webpack_require__(75);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinksComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LinksComponent = LinksComponent_1 = (function () {
    function LinksComponent(presenter) {
        this.presenter = presenter;
        this.saving = false;
        this.project = presenter.activeProject;
    }
    LinksComponent.prototype.saveLink = function () {
        if (this.editedLink == null) {
            this.presenter.addLink(this.linkModalComponent.link);
        }
        else {
            this.presenter.updateLink(this.linkModalComponent.link);
            this.editedLink.name = this.linkModalComponent.link.name;
            this.editedLink.icon = this.linkModalComponent.link.icon;
            this.editedLink.url = this.linkModalComponent.link.url;
        }
    };
    LinksComponent.prototype.add = function () {
        this.editedLink = null;
        this.linkModalComponent.show(this);
    };
    LinksComponent.prototype.edit = function (link) {
        this.editedLink = link;
        this.linkModalComponent.link = { id: link.id, name: link.name, icon: link.icon, url: link.url };
        this.linkModalComponent.show(this);
    };
    LinksComponent.prototype.deleteLink = function (link) {
        if (confirm('Are you sure that you want to delete the link named ' + link.name + '?')) {
            this.presenter.deleteLink(link);
        }
    };
    LinksComponent.prototype.save = function () {
        var _this = this;
        this.saving = true;
        this.presenter.saveLinks(function () {
            _this.saving = false;
        });
        LinksComponent_1.saved = true;
    };
    LinksComponent.prototype.reset = function () {
        var self = this;
        LinksComponent_1.saved = true;
        this.presenter.loadProject(this.presenter.activeProject.slug, function () {
            self.project = self.presenter.activeProject;
        });
    };
    LinksComponent.prototype.isSaved = function () {
        return LinksComponent_1.saved;
    };
    LinksComponent.prototype.onKey = function (event) {
        var s = String(event.key);
        if (s.length === 1 || s === 'Backspace' || s === 'Enter') {
            LinksComponent_1.saved = false;
        }
    };
    return LinksComponent;
}());
LinksComponent.saved = true;
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2__link_modal_component__["a" /* LinkModalComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__link_modal_component__["a" /* LinkModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__link_modal_component__["a" /* LinkModalComponent */]) === "function" && _a || Object)
], LinksComponent.prototype, "linkModalComponent", void 0);
LinksComponent = LinksComponent_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-links',
        template: __webpack_require__(243),
        styles: [__webpack_require__(221)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], LinksComponent);

var LinksComponent_1, _a, _b;
//# sourceMappingURL=links.component.js.map

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ui_modal__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LanguageSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LanguageSelectorComponent = (function () {
    function LanguageSelectorComponent(presenter) {
        this.presenter = presenter;
        this.modal = new __WEBPACK_IMPORTED_MODULE_0__ui_modal__["a" /* Modal */]();
    }
    LanguageSelectorComponent.prototype.selectLanguage = function (language) {
        this.modal.hide();
        this.languageSelected(language);
    };
    LanguageSelectorComponent.prototype.projectHasLanguage = function (language) {
        for (var _i = 0, _a = this.presenter.activeProject.languages; _i < _a.length; _i++) {
            var l = _a[_i];
            if (l.code === language.code) {
                return true;
            }
        }
        return false;
    };
    return LanguageSelectorComponent;
}());
LanguageSelectorComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_15" /* Component */])({
        selector: 'app-language-selector',
        template: __webpack_require__(245),
        styles: [__webpack_require__(223)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], LanguageSelectorComponent);

var _a;
//# sourceMappingURL=language-selector.component.js.map

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TextModalComponent = (function () {
    function TextModalComponent(presenter) {
        this.presenter = presenter;
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
        this.setEmptyText();
    }
    TextModalComponent.prototype.show = function (textsComponent) {
        this.textsComponent = textsComponent;
        this.modal.show();
    };
    TextModalComponent.prototype.save = function () {
        this.textsComponent.saveText();
    };
    TextModalComponent.prototype.hide = function () {
        this.modal.hide();
    };
    TextModalComponent.prototype.setEmptyText = function () {
        this.model = {
            name: '',
            description: '',
            startGroup: '',
            minLength: 10,
            maxLength: 1000,
            values: []
        };
        for (var _i = 0, _a = this.presenter.activeProject.languages; _i < _a.length; _i++) {
            var language = _a[_i];
            this.model.values.push({
                languageCode: language.code,
                value: ''
            });
        }
    };
    return TextModalComponent;
}());
TextModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-new-text-modal',
        template: __webpack_require__(246)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], TextModalComponent);

var _a;
//# sourceMappingURL=text-modal.component.js.map

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_tab__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logic_project_logic__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__text_modal_component__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__language_selector_component__ = __webpack_require__(77);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TextsComponent = TextsComponent_1 = (function () {
    function TextsComponent(presenter, route, router) {
        this.presenter = presenter;
        this.route = route;
        this.router = router;
        this.saving = false;
        this.project = {
            name: null,
            slug: null,
            files: [],
            languages: [],
            texts: [],
            images: []
        };
        this.projectLogic = new __WEBPACK_IMPORTED_MODULE_3__logic_project_logic__["a" /* ProjectLogic */](this.project);
        this.languageTabs = [];
        this.lang = 0;
        this.textEntries = [];
    }
    TextsComponent.slugify = function (text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '_') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '_') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };
    TextsComponent.prototype.getTextIndicator = function (entry) {
        if (__WEBPACK_IMPORTED_MODULE_3__logic_project_logic__["a" /* ProjectLogic */].hasWarning(entry.text, entry.localText)) {
            return 'glyphicon-remove';
        }
        return 'glyphicon-ok';
    };
    TextsComponent.prototype.ngOnInit = function () {
        this.project = this.presenter.activeProject;
        this.projectLogic = new __WEBPACK_IMPORTED_MODULE_3__logic_project_logic__["a" /* ProjectLogic */](this.project);
        this.setLanguageTabs();
        var lang = this.route.snapshot.params['lang'];
        this.lang = -1;
        if (lang) {
            this.lang = this.getLanguageIndex(lang);
        }
        if (this.lang === -1) {
            this.lang = 0;
        }
        this.setLanguage(this.lang);
    };
    TextsComponent.prototype.setLanguageTabs = function () {
        this.languageTabs = [];
        for (var _i = 0, _a = this.project.languages; _i < _a.length; _i++) {
            var language = _a[_i];
            this.languageTabs.push(new __WEBPACK_IMPORTED_MODULE_2__ui_tab__["a" /* Tab */](language.name));
        }
    };
    TextsComponent.prototype.navigate = function (i) {
        this.setLanguage(i);
        this.router.navigate(['/projects/' + this.project.slug + '/texts/' + this.currentLanguage.code]);
    };
    TextsComponent.prototype.getLanguageIndex = function (languageId) {
        var idx = 0;
        for (var _i = 0, _a = this.project.languages; _i < _a.length; _i++) {
            var loc = _a[_i];
            if (loc.code === languageId) {
                return idx;
            }
            ++idx;
        }
        return -1;
    };
    TextsComponent.prototype.setLanguage = function (i) {
        var idx = 0;
        for (var _i = 0, _a = this.languageTabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            if (i === idx) {
                tab.setActive();
            }
            else {
                tab.setInactive();
            }
            ++idx;
        }
        this.currentLanguage = this.project.languages[i];
        this.setEntries();
    };
    TextsComponent.prototype.setEntries = function () {
        var entries = [];
        for (var _i = 0, _a = this.project.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            var localText = this.getLocalText(text);
            if (!TextsComponent_1.filter || __WEBPACK_IMPORTED_MODULE_3__logic_project_logic__["a" /* ProjectLogic */].hasWarning(text, localText)) {
                entries.push(new TextEntry(text, localText));
            }
        }
        this.textEntries = entries;
    };
    TextsComponent.prototype.getLocalText = function (text) {
        for (var _i = 0, _a = text.values; _i < _a.length; _i++) {
            var lt_1 = _a[_i];
            if (lt_1.languageCode === this.currentLanguage.code) {
                return lt_1;
            }
        }
        var lt = { languageCode: this.currentLanguage.code, value: '' };
        text.values.push(lt);
        return lt;
    };
    TextsComponent.prototype.getTextValue = function (text) {
        for (var _i = 0, _a = text.values; _i < _a.length; _i++) {
            var lt = _a[_i];
            if (lt.languageCode === this.currentLanguage.code) {
                return lt.value;
            }
        }
        return '';
    };
    TextsComponent.prototype.getBadgeLocaleText = function (languageIdx) {
        var count = this.projectLogic.getLocaleTextWarningCount(languageIdx);
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' + count + '</span>';
    };
    TextsComponent.prototype.save = function () {
        var _this = this;
        TextsComponent_1.saved = true;
        this.saving = true;
        this.presenter.saveProjectTexts(function () {
            _this.saving = false;
        });
    };
    TextsComponent.prototype.onKey = function (event) {
        var s = String(event.key);
        if (s.length === 1 || s === 'Backspace' || s === 'Enter') {
            TextsComponent_1.saved = false;
        }
    };
    TextsComponent.prototype.changed = function () {
        TextsComponent_1.saved = false;
    };
    TextsComponent.prototype.isSaved = function () {
        return TextsComponent_1.saved;
    };
    TextsComponent.prototype.add = function () {
        this.editedText = null;
        this.textModalComponent.setEmptyText();
        this.textModalComponent.show(this);
    };
    TextsComponent.prototype.reset = function () {
        var self = this;
        this.presenter.loadProject(this.presenter.activeProject.slug, function () {
            self.project = self.presenter.activeProject;
            TextsComponent_1.saved = true;
            self.setEntries();
        });
    };
    TextsComponent.prototype.edit = function (text) {
        this.editedText = text;
        this.textModalComponent.model = {
            name: text.name,
            description: text.description,
            startGroup: text.startGroup,
            minLength: text.minLength,
            maxLength: text.maxLength,
            values: []
        };
        this.textModalComponent.show(this);
    };
    TextsComponent.prototype.resetText = function (text) {
        this.presenter.resetTextVaule(text, this.currentLanguage);
    };
    TextsComponent.prototype.deleteText = function (text) {
        if (!confirm('Are you sure you want to delete this text?')) {
            return;
        }
        var texts = this.presenter.activeProject.texts;
        var index = texts.indexOf(text, 0);
        if (index > -1) {
            texts.splice(index, 1);
        }
        this.presenter.deleteText(text);
        TextsComponent_1.saved = false;
        this.setEntries();
    };
    TextsComponent.prototype.isIdInUse = function (textId) {
        for (var _i = 0, _a = this.presenter.activeProject.texts; _i < _a.length; _i++) {
            var text = _a[_i];
            if (text.textId === textId) {
                return true;
            }
        }
        return false;
    };
    TextsComponent.prototype.saveText = function () {
        var _this = this;
        var text = this.textModalComponent.model;
        if (this.editedText == null) {
            var baseID = TextsComponent_1.slugify(text.name);
            text.textId = baseID;
            var idx = 2;
            while (this.isIdInUse(text.textId)) {
                text.textId = baseID + idx;
                idx += 1;
            }
            this.presenter.addText(text, function () {
                _this.setEntries();
            });
        }
        else {
            TextsComponent_1.saved = false;
            this.editedText.name = text.name;
            this.editedText.description = text.description;
            this.editedText.startGroup = text.startGroup;
            this.editedText.minLength = text.minLength;
            this.editedText.maxLength = text.maxLength;
            this.presenter.updateText(this.editedText);
        }
        this.textModalComponent.hide();
    };
    TextsComponent.prototype.addNewLanguage = function () {
        var _this = this;
        this.presenter.getLanguages(function (languages) {
            _this.languageSelectorComponent.languages = languages;
            _this.languageSelectorComponent.languageSelected = function (language) { return _this.addLanguage(language); };
            _this.languageSelectorComponent.modal.show();
        });
    };
    TextsComponent.prototype.removeLanguage = function () {
        var language = this.currentLanguage;
        if (confirm('Are you sure that you want to remove the ' + language.name + ' language?')) {
            for (var _i = 0, _a = this.project.texts; _i < _a.length; _i++) {
                var text = _a[_i];
                var newValues = [];
                for (var _b = 0, _c = text.values; _b < _c.length; _b++) {
                    var lt = _c[_b];
                    if (lt.languageCode !== language.code) {
                        newValues.push(lt);
                    }
                }
                text.values = newValues;
            }
            this.project.languages.splice(this.project.languages.indexOf(language), 1);
            this.setLanguageTabs();
            if (this.lang === this.project.languages.length) {
                this.lang -= 1;
            }
            this.setLanguage(this.lang);
            this.presenter.removeLanguage(language);
        }
    };
    TextsComponent.prototype.addLanguage = function (language) {
        var _this = this;
        this.presenter.addLanguage(language, function () {
            _this.setLanguageTabs();
            _this.setLanguage(_this.languageTabs.length - 1);
        }, function () {
        });
    };
    TextsComponent.prototype.toggleFilter = function () {
        TextsComponent_1.filter = !TextsComponent_1.filter;
        this.setEntries();
    };
    return TextsComponent;
}());
TextsComponent.saved = true;
TextsComponent.filter = false;
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_5__text_modal_component__["a" /* TextModalComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__text_modal_component__["a" /* TextModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__text_modal_component__["a" /* TextModalComponent */]) === "function" && _a || Object)
], TextsComponent.prototype, "textModalComponent", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_6__language_selector_component__["a" /* LanguageSelectorComponent */]),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_6__language_selector_component__["a" /* LanguageSelectorComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__language_selector_component__["a" /* LanguageSelectorComponent */]) === "function" && _b || Object)
], TextsComponent.prototype, "languageSelectorComponent", void 0);
TextsComponent = TextsComponent_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-texts',
        template: __webpack_require__(247),
        styles: [__webpack_require__(224)]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["c" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["c" /* ActivatedRoute */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* Router */]) === "function" && _e || Object])
], TextsComponent);

var TextEntry = (function () {
    function TextEntry(text, localText) {
        this.text = text;
        this.localText = localText;
        this.id = text.textId + localText.languageCode;
    }
    return TextEntry;
}());
var TextsComponent_1, _a, _b, _c, _d, _e;
//# sourceMappingURL=texts.component.js.map

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_modal__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UserModalComponent = (function () {
    function UserModalComponent(presenter) {
        this.presenter = presenter;
        this.modal = new __WEBPACK_IMPORTED_MODULE_1__ui_modal__["a" /* Modal */]();
        this.user = {};
        this.project = {};
        this.isNewUser = true;
        this.project = presenter.activeProject;
    }
    UserModalComponent.prototype.show = function () {
        this.message = 'Dear ,\n' +
            'Please participate in the project named ' + this.project.name + '. You can register by clicking [link].';
        this.modal.show();
    };
    UserModalComponent.prototype.save = function () {
        this.hide();
        this.usersComponent.saveUser();
        this.user = {};
        this.newUserForm.form.markAsPristine();
    };
    UserModalComponent.prototype.hide = function () {
        this.modal.hide();
    };
    UserModalComponent.prototype.nameChanged = function () {
        var parts = this.message.split('\n');
        if (parts.length === 0) {
            return;
        }
        if (parts[0].startsWith('Dear ') && parts[0].endsWith(',')) {
            parts[0] = 'Dear ' + this.user.name + ',';
        }
        this.message = parts.join('\n');
    };
    return UserModalComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])('newUserForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], UserModalComponent.prototype, "newUserForm", void 0);
UserModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-user-modal',
        template: __webpack_require__(248)
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], UserModalComponent);

var _a, _b;
//# sourceMappingURL=user-modal.component.js.map

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tab; });
var Tab = (function () {
    function Tab(name) {
        this.name = name;
    }
    Tab.prototype.setActive = function () {
        this.pillClass = 'active';
        this.paneClass = 'tab-pane in active';
    };
    Tab.prototype.setInactive = function () {
        this.pillClass = '';
        this.paneClass = 'tab-pane';
    };
    return Tab;
}());

//# sourceMappingURL=tab.js.map

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Configuration; });
var Configuration = (function () {
    function Configuration() {
    }
    return Configuration;
}());

//# sourceMappingURL=configuration.js.map

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_api__ = __webpack_require__(146);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_models__ = __webpack_require__(158);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_1__model_models__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_1__model_models__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_1__model_models__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_1__model_models__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__variables__ = __webpack_require__(44);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_2__variables__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__configuration__ = __webpack_require__(82);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_3__configuration__["a"]; });




//# sourceMappingURL=index.js.map

/***/ }),
/* 84 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Image.js.map

/***/ }),
/* 85 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Project.js.map

/***/ }),
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 112;


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(145);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppConfig; });
var AppConfig = (function () {
    function AppConfig() {
    }
    return AppConfig;
}());

AppConfig.basePath = 'http://server.customerpoint.net/api/v1';
AppConfig.appBasePath = 'http://customerpoint.net';
//# sourceMappingURL=app.config.js.map

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_app_component__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_login_form_component__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_project_list_project_list_component__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__guards_authguard__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__swagger_api_DefaultApi__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__guards_logoutguard__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_project_project_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_menu_component__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_project_images_images_component__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_project_texts_texts_component__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_project_files_component__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_project_images_image_modal_component__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_project_links_links_component__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ui_autosize_directive__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__file_drop__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__swagger_variables__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_swagger__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_project_images_new_image_modal_component__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_project_images_thumbnail_component__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_app_app_config__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_token_login_component__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_project_texts_text_modal_component__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_project_users_users_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__angular_common__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_project_users_user_modal_component__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_project_links_link_modal_component__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__components_project_list_project_modal_component__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__guards_homeguard__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__components_new_password_component__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__guards_TokenGuard__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__guards_CanDeactivateTexts__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__guards_CanDeactivateLinks__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__components_project_links_icon_selector_component__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__components_project_texts_language_selector_component__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__components_change_password_component__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__components_password_input_component__ = __webpack_require__(41);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











































var appRoutes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_6__components_login_form_component__["a" /* LoginFormComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_33__guards_homeguard__["a" /* HomeGuard */]] },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_6__components_login_form_component__["a" /* LoginFormComponent */] },
    { path: 'token/:login_token', component: __WEBPACK_IMPORTED_MODULE_26__components_token_login_component__["a" /* TokenLoginComponent */] },
    { path: 'password', component: __WEBPACK_IMPORTED_MODULE_34__components_new_password_component__["a" /* NewPasswordComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_36__guards_TokenGuard__["a" /* TokenGuard */]] },
    { path: 'logout', component: __WEBPACK_IMPORTED_MODULE_6__components_login_form_component__["a" /* LoginFormComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_11__guards_logoutguard__["a" /* LogoutGuard */]] },
    { path: 'projects', component: __WEBPACK_IMPORTED_MODULE_8__components_project_list_project_list_component__["a" /* ProjectListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]] },
    { path: 'projects/:slug', component: __WEBPACK_IMPORTED_MODULE_12__components_project_project_component__["a" /* ProjectComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]], children: [
            { path: '', redirectTo: 'images', pathMatch: 'full' },
            { path: 'images', component: __WEBPACK_IMPORTED_MODULE_14__components_project_images_images_component__["a" /* ImagesComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]] },
            { path: 'texts', component: __WEBPACK_IMPORTED_MODULE_15__components_project_texts_texts_component__["a" /* TextsComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]], canDeactivate: [__WEBPACK_IMPORTED_MODULE_37__guards_CanDeactivateTexts__["a" /* CanDeactivateTexts */]] },
            { path: 'texts/:lang', component: __WEBPACK_IMPORTED_MODULE_15__components_project_texts_texts_component__["a" /* TextsComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]], canDeactivate: [__WEBPACK_IMPORTED_MODULE_37__guards_CanDeactivateTexts__["a" /* CanDeactivateTexts */]] },
            { path: 'links', component: __WEBPACK_IMPORTED_MODULE_18__components_project_links_links_component__["a" /* LinksComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]], canDeactivate: [__WEBPACK_IMPORTED_MODULE_38__guards_CanDeactivateLinks__["a" /* CanDeactivateLinks */]] },
            { path: 'users', component: __WEBPACK_IMPORTED_MODULE_28__components_project_users_users_component__["a" /* UsersComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]] }
        ] },
    { path: 'changePassword', component: __WEBPACK_IMPORTED_MODULE_41__components_change_password_component__["a" /* ChangePasswordComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */]] },
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__components_app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__components_login_form_component__["a" /* LoginFormComponent */],
            __WEBPACK_IMPORTED_MODULE_26__components_token_login_component__["a" /* TokenLoginComponent */],
            __WEBPACK_IMPORTED_MODULE_8__components_project_list_project_list_component__["a" /* ProjectListComponent */],
            __WEBPACK_IMPORTED_MODULE_12__components_project_project_component__["a" /* ProjectComponent */],
            __WEBPACK_IMPORTED_MODULE_13__components_menu_component__["a" /* MenuComponent */],
            __WEBPACK_IMPORTED_MODULE_14__components_project_images_images_component__["a" /* ImagesComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_project_texts_texts_component__["a" /* TextsComponent */],
            __WEBPACK_IMPORTED_MODULE_16__components_project_files_component__["a" /* FilesComponent */],
            __WEBPACK_IMPORTED_MODULE_28__components_project_users_users_component__["a" /* UsersComponent */],
            __WEBPACK_IMPORTED_MODULE_17__components_project_images_image_modal_component__["a" /* ImageModalComponent */],
            __WEBPACK_IMPORTED_MODULE_18__components_project_links_links_component__["a" /* LinksComponent */],
            __WEBPACK_IMPORTED_MODULE_19__ui_autosize_directive__["a" /* Autosize */],
            __WEBPACK_IMPORTED_MODULE_20__file_drop__["a" /* FileDropDirective */],
            __WEBPACK_IMPORTED_MODULE_23__components_project_images_new_image_modal_component__["a" /* NewImageModalComponent */],
            __WEBPACK_IMPORTED_MODULE_27__components_project_texts_text_modal_component__["a" /* TextModalComponent */],
            __WEBPACK_IMPORTED_MODULE_30__components_project_users_user_modal_component__["a" /* UserModalComponent */],
            __WEBPACK_IMPORTED_MODULE_32__components_project_list_project_modal_component__["a" /* ProjectModalComponent */],
            __WEBPACK_IMPORTED_MODULE_31__components_project_links_link_modal_component__["a" /* LinkModalComponent */],
            __WEBPACK_IMPORTED_MODULE_24__components_project_images_thumbnail_component__["a" /* ThumbnailComponent */],
            __WEBPACK_IMPORTED_MODULE_34__components_new_password_component__["a" /* NewPasswordComponent */],
            __WEBPACK_IMPORTED_MODULE_39__components_project_links_icon_selector_component__["a" /* IconSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_40__components_project_texts_language_selector_component__["a" /* LanguageSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_42__components_password_input_component__["a" /* PasswordInputComponent */],
            __WEBPACK_IMPORTED_MODULE_41__components_change_password_component__["a" /* ChangePasswordComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* RouterModule */].forRoot(appRoutes),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_7__logic_presenter__["a" /* Presenter */], __WEBPACK_IMPORTED_MODULE_9__guards_authguard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_11__guards_logoutguard__["a" /* LogoutGuard */], __WEBPACK_IMPORTED_MODULE_10__swagger_api_DefaultApi__["a" /* DefaultApi */], __WEBPACK_IMPORTED_MODULE_33__guards_homeguard__["a" /* HomeGuard */], __WEBPACK_IMPORTED_MODULE_35__guards_PasswordSetGuard__["a" /* PasswordSetGuard */], __WEBPACK_IMPORTED_MODULE_36__guards_TokenGuard__["a" /* TokenGuard */],
            __WEBPACK_IMPORTED_MODULE_37__guards_CanDeactivateTexts__["a" /* CanDeactivateTexts */], __WEBPACK_IMPORTED_MODULE_38__guards_CanDeactivateLinks__["a" /* CanDeactivateLinks */],
            { provide: __WEBPACK_IMPORTED_MODULE_21__swagger_variables__["a" /* BASE_PATH */], useValue: __WEBPACK_IMPORTED_MODULE_25_app_app_config__["a" /* AppConfig */].basePath },
            { provide: __WEBPACK_IMPORTED_MODULE_22_swagger__["Configuration"], useValue: { withCredentials: true } },
            { provide: __WEBPACK_IMPORTED_MODULE_29__angular_common__["a" /* APP_BASE_HREF */], useValue: __WEBPACK_IMPORTED_MODULE_25_app_app_config__["a" /* AppConfig */].appBasePath }],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__components_app_component__["a" /* AppComponent */], __WEBPACK_IMPORTED_MODULE_13__components_menu_component__["a" /* MenuComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(presenter) {
        this.presenter = presenter;
        presenter.setAppComponent(this);
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(228),
        styles: [__webpack_require__(214)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__password_input_component__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__(20);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangePasswordComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChangePasswordComponent = (function () {
    function ChangePasswordComponent(presenter, location) {
        this.presenter = presenter;
        this.location = location;
        this.passwordError = false;
    }
    ChangePasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        this.presenter.changePassword(this.oldPassword, this.passwordInputComponent.newPassword, function () {
            _this.passwordError = false;
            alert('Your password has been changed.');
            _this.location.back();
        }, function () {
            _this.passwordError = true;
        });
    };
    return ChangePasswordComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */]) === "function" && _a || Object)
], ChangePasswordComponent.prototype, "passwordInputComponent", void 0);
ChangePasswordComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        template: __webpack_require__(229),
        styles: [__webpack_require__(37)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common__["h" /* Location */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common__["h" /* Location */]) === "function" && _c || Object])
], ChangePasswordComponent);

var _a, _b, _c;
//# sourceMappingURL=change-password.component.js.map

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_data__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginFormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginFormComponent = (function () {
    function LoginFormComponent(presenter) {
        this.presenter = presenter;
        this.model = new __WEBPACK_IMPORTED_MODULE_1__login_data__["a" /* LoginData */]('', '');
        this.submitted = false;
        this.passwordError = false;
        this.userError = false;
        presenter.setLoginFormComponent(this);
    }
    LoginFormComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.userError = false;
        this.passwordError = false;
        this.presenter.login(this.model);
    };
    LoginFormComponent.prototype.showUserError = function () {
        this.userError = true;
    };
    LoginFormComponent.prototype.showPasswordError = function () {
        this.passwordError = true;
    };
    return LoginFormComponent;
}());
LoginFormComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        template: __webpack_require__(230),
        styles: [__webpack_require__(37)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], LoginFormComponent);

var _a;
//# sourceMappingURL=login-form.component.js.map

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_menu_item__ = __webpack_require__(144);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MenuComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MenuComponent = (function () {
    function MenuComponent(presenter) {
        this.presenter = presenter;
        this.user = null;
        this.items = [];
        this.activeItems = [];
        this.dropdownIsOpen = false;
        this.show = '';
        presenter.setMenuComponent(this);
        this.add(new __WEBPACK_IMPORTED_MODULE_2__ui_menu_item__["a" /* MenuItem */]('Login', 'login', true, 'glyphicon-log-in'));
        this.add(new __WEBPACK_IMPORTED_MODULE_2__ui_menu_item__["a" /* MenuItem */]('Projects', 'projects', false, 'glyphicon-tasks'));
        if (presenter.isLoggedIn()) {
            this.setLoggedIn();
        }
        else {
            this.setLoggedOut();
        }
    }
    MenuComponent.prototype.add = function (item) {
        this.items.push(item);
    };
    MenuComponent.prototype.activate = function (path) {
        this.getItem(path).active = true;
    };
    MenuComponent.prototype.deactivate = function (path) {
        this.getItem(path).active = false;
    };
    MenuComponent.prototype.getItem = function (path) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.path === path) {
                return item;
            }
        }
        return null;
    };
    MenuComponent.prototype.getActiveItems = function () {
        var result = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var mi = _a[_i];
            if (mi.active) {
                result.push(mi);
            }
        }
        return result;
    };
    MenuComponent.prototype.setLoggedIn = function () {
        this.user = this.presenter.getUser();
        this.deactivate('login');
        this.activate('projects');
        this.activeItems = this.getActiveItems();
    };
    MenuComponent.prototype.setLoggedOut = function () {
        this.user = null;
        this.activate('login');
        this.deactivate('projects');
        this.activeItems = this.getActiveItems();
    };
    MenuComponent.prototype.dropdown = function () {
        this.dropdownIsOpen = !this.dropdownIsOpen;
    };
    MenuComponent.prototype.toggle = function () {
        if (this.show.length === 0) {
            this.show = 'show';
        }
        else {
            this.show = '';
        }
    };
    return MenuComponent;
}());
MenuComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-menu',
        template: __webpack_require__(231),
        styles: [__webpack_require__(215)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], MenuComponent);

var _a;
//# sourceMappingURL=menu.component.js.map

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__password_input_component__ = __webpack_require__(41);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewPasswordComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NewPasswordComponent = (function () {
    function NewPasswordComponent(presenter) {
        this.presenter = presenter;
    }
    NewPasswordComponent.prototype.onSubmit = function () {
        this.presenter.setPassword(this.passwordInputComponent.newPassword);
    };
    return NewPasswordComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__password_input_component__["a" /* PasswordInputComponent */]) === "function" && _a || Object)
], NewPasswordComponent.prototype, "passwordInputComponent", void 0);
NewPasswordComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        template: __webpack_require__(232),
        styles: [__webpack_require__(37)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], NewPasswordComponent);

var _a, _b;
//# sourceMappingURL=new-password.component.js.map

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_modal_component__ = __webpack_require__(72);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProjectListComponent = (function () {
    function ProjectListComponent(presenter) {
        var _this = this;
        this.presenter = presenter;
        this.projects = null;
        presenter.loadProjects(function (projects) {
            _this.projects = projects;
        });
    }
    ProjectListComponent.prototype.showProject = function (slug) {
        this.presenter.showProject(slug);
    };
    ProjectListComponent.prototype.edit = function (project) {
        this.editedProject = project;
        this.projectModalComponent.project = { name: project.name };
        this.projectModalComponent.show(this);
    };
    ProjectListComponent.prototype.deleteProject = function (project) {
        if (confirm('Are you sure that you want to delete the project named ' + project.name + '?')) {
            this.presenter.deleteProject(project);
        }
    };
    ProjectListComponent.prototype.saveProject = function () {
        if (this.editedProject == null) {
            this.presenter.addProject(this.projectModalComponent.project);
        }
        else {
            this.editedProject.name = this.projectModalComponent.project.name;
            this.presenter.updateProject(this.editedProject);
        }
    };
    ProjectListComponent.prototype.add = function () {
        this.projectModalComponent.show(this);
    };
    return ProjectListComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2__project_modal_component__["a" /* ProjectModalComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__project_modal_component__["a" /* ProjectModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__project_modal_component__["a" /* ProjectModalComponent */]) === "function" && _a || Object)
], ProjectListComponent.prototype, "projectModalComponent", void 0);
ProjectListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        template: __webpack_require__(234),
        styles: [__webpack_require__(216)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], ProjectListComponent);

var _a, _b;
//# sourceMappingURL=project-list.component.js.map

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FilesComponent = (function () {
    function FilesComponent(presenter) {
        this.presenter = presenter;
        this.project = {
            name: null,
            slug: null,
            files: [],
            languages: [],
            texts: [],
            images: []
        };
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
        this.fileIsOver = false;
    }
    FilesComponent.prototype.ngOnInit = function () {
        this.project = this.presenter.activeProject;
    };
    FilesComponent.prototype.fileOver = function (fileIsOver) {
        this.fileIsOver = fileIsOver;
        console.log('fileIsOver ' + fileIsOver);
    };
    FilesComponent.prototype.onFileDrop = function (file) {
        console.log('Got file! ' + file.name);
    };
    return FilesComponent;
}());
FilesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'project-files',
        template: __webpack_require__(236),
        styles: [__webpack_require__(217)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _a || Object])
], FilesComponent);

var _a;
//# sourceMappingURL=files.component.js.map

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_modal__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__image_modal_component__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__new_image_modal_component__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__logic_project_logic__ = __webpack_require__(43);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImagesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ImagesComponent = ImagesComponent_1 = (function () {
    function ImagesComponent(presenter) {
        this.presenter = presenter;
        this.project = {
            name: null,
            slug: null,
            files: [],
            languages: [],
            texts: [],
            images: []
        };
        this.images = [];
        this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_modal__["a" /* Modal */]();
    }
    ImagesComponent.prototype.ngOnInit = function () {
        this.project = this.presenter.activeProject;
        this.images = this.project.images;
    };
    ImagesComponent.prototype.setProject = function (project) {
        this.project = project;
    };
    ImagesComponent.prototype.add = function () {
        this.newImageModalComponent.show();
    };
    ImagesComponent.prototype.toggleFilter = function () {
        ImagesComponent_1.filter = !ImagesComponent_1.filter;
        if (!ImagesComponent_1.filter) {
            this.images = this.project.images;
            return;
        }
        this.images = [];
        for (var _i = 0, _a = this.project.images; _i < _a.length; _i++) {
            var i = _a[_i];
            if (__WEBPACK_IMPORTED_MODULE_5__logic_project_logic__["a" /* ProjectLogic */].imageHasWarning(i)) {
                this.images.push(i);
            }
        }
    };
    return ImagesComponent;
}());
ImagesComponent.filter = false;
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_3__image_modal_component__["a" /* ImageModalComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__image_modal_component__["a" /* ImageModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__image_modal_component__["a" /* ImageModalComponent */]) === "function" && _a || Object)
], ImagesComponent.prototype, "imageModalComponent", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4__new_image_modal_component__["a" /* NewImageModalComponent */]),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__new_image_modal_component__["a" /* NewImageModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__new_image_modal_component__["a" /* NewImageModalComponent */]) === "function" && _b || Object)
], ImagesComponent.prototype, "newImageModalComponent", void 0);
ImagesComponent = ImagesComponent_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-images',
        template: __webpack_require__(238)
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _c || Object])
], ImagesComponent);

var ImagesComponent_1, _a, _b, _c;
//# sourceMappingURL=images.component.js.map

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__swagger_model_Image__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__swagger_model_Image___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__swagger_model_Image__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__image_modal_component__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__swagger_model_Project__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__swagger_model_Project___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__swagger_model_Project__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ThumbnailComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ThumbnailComponent = (function () {
    function ThumbnailComponent(presenter) {
        this.presenter = presenter;
        this.fileIsOver = null;
        this.editing = false;
        this.widthWarning = null;
        this.heightWarning = null;
    }
    ThumbnailComponent.prototype.ngOnInit = function () {
        this.setWarnings();
    };
    ThumbnailComponent.prototype.setWarnings = function () {
        this.widthWarning = null;
        this.heightWarning = null;
        if (this.image.fileName != null && this.image.fileName.length !== 0) {
            this.setWidthWarning();
            this.setHeightWarning();
        }
    };
    ThumbnailComponent.prototype.setHeightWarning = function () {
        var baseWarning = 'The height of this image is ' + this.image.height;
        if (this.image.minHeight != null && this.image.maxHeight != null) {
            if (this.image.height < this.image.minHeight || this.image.height > this.image.maxHeight) {
                if (this.image.minHeight === this.image.maxHeight) {
                    this.heightWarning = baseWarning
                        + ' but it should be ' + this.image.maxHeight + '.';
                }
                else {
                    this.heightWarning = baseWarning
                        + ' but it should be between ' + this.image.minHeight + ' and ' + this.image.maxHeight + '.';
                }
            }
        }
        else {
            if (this.image.minHeight != null && this.image.height < this.image.minHeight) {
                this.heightWarning = baseWarning + ' but it should be minimum '
                    + this.image.minHeight + '.';
            }
            if (this.image.maxHeight != null && this.image.height > this.image.maxHeight) {
                this.heightWarning = baseWarning + ' but it should be maximum '
                    + this.image.maxHeight + '.';
            }
        }
    };
    ThumbnailComponent.prototype.setWidthWarning = function () {
        var baseWarning = 'The width of this image is ' + this.image.width;
        if (this.image.minWidth != null && this.image.maxWidth != null) {
            if (this.image.width < this.image.minWidth || this.image.width > this.image.maxWidth) {
                if (this.image.minWidth === this.image.maxWidth) {
                    this.widthWarning = baseWarning + 'but it should be ' + this.image.maxWidth + '.';
                }
                else {
                    this.widthWarning = baseWarning
                        + ' but it should be between ' + this.image.minWidth + ' and ' + this.image.maxWidth + '.';
                }
            }
        }
        else {
            if (this.image.minWidth != null && this.image.width < this.image.minWidth) {
                this.widthWarning = baseWarning + ' but it should be minimum '
                    + this.image.minWidth + '.';
            }
            if (this.image.maxWidth != null && this.image.width > this.image.maxWidth) {
                this.widthWarning = baseWarning + ' but it should be maximum '
                    + this.image.maxWidth + '.';
            }
        }
    };
    ThumbnailComponent.prototype.getImageUrl = function () {
        return this.presenter.getImageUrl(this.image);
    };
    ThumbnailComponent.prototype.showImage = function () {
        this.imageModalComponent.showImage(this.image);
    };
    ThumbnailComponent.prototype.load = function () {
        var element = document.getElementById('img' + this.image.imageId);
        this.image.width = element.naturalWidth;
        this.image.height = element.naturalHeight;
    };
    ThumbnailComponent.prototype.deleteImage = function () {
        this.presenter.deleteImage(this.image);
    };
    ThumbnailComponent.prototype.edit = function () {
        this.editing = !this.editing;
    };
    ThumbnailComponent.prototype.save = function () {
        this.presenter.updateImage(this.image);
    };
    ThumbnailComponent.prototype.fileOver = function (fileIsOver) {
        if (fileIsOver) {
            this.fileIsOver = this.image;
        }
        else {
            if (this.fileIsOver === this.image) {
                this.fileIsOver = null;
            }
        }
        console.log('fileIsOver ' + fileIsOver + ' ' + this.image.imageId);
    };
    ThumbnailComponent.prototype.fileChange = function (event) {
        var fileList = event.target.files;
        if (fileList.length > 0) {
            var file = fileList[0];
            this.onFileDrop(file);
        }
    };
    ThumbnailComponent.prototype.onFileDrop = function (file) {
        var _this = this;
        if (!(file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.gif') || file.name.endsWith('.svg'))) {
            return;
        }
        if (file.size / 1024 / 1024 > 2) {
            alert("The file is too large. Maximal image size is 2 MB.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function (event) {
            _this.image.fileName = event.target.result;
        };
        reader.readAsDataURL(file);
        this.presenter.uploadImage(file, this.image, function (image) {
            _this.image = image;
            _this.setWarnings();
        });
    };
    return ThumbnailComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__swagger_model_Image__["Image"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__swagger_model_Image__["Image"]) === "function" && _a || Object)
], ThumbnailComponent.prototype, "image", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Input */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__swagger_model_Project__["Project"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__swagger_model_Project__["Project"]) === "function" && _b || Object)
], ThumbnailComponent.prototype, "project", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Input */])(),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__image_modal_component__["a" /* ImageModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__image_modal_component__["a" /* ImageModalComponent */]) === "function" && _c || Object)
], ThumbnailComponent.prototype, "imageModalComponent", void 0);
ThumbnailComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-thumbnail',
        template: __webpack_require__(240),
        styles: [__webpack_require__(219)]
    }),
    __metadata("design:paramtypes", [typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _d || Object])
], ThumbnailComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=thumbnail.component.js.map

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_tab__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__logic_project_logic__ = __webpack_require__(43);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProjectComponent = (function () {
    function ProjectComponent(route, router, presenter) {
        this.route = route;
        this.router = router;
        this.presenter = presenter;
        this.project = {
            name: null,
            slug: null,
            files: [],
            languages: [],
            texts: [],
            images: []
        };
        this.projectLogic = new __WEBPACK_IMPORTED_MODULE_4__logic_project_logic__["a" /* ProjectLogic */](this.project);
        this.tabImages = new __WEBPACK_IMPORTED_MODULE_3__ui_tab__["a" /* Tab */]('Images');
        this.tabTexts = new __WEBPACK_IMPORTED_MODULE_3__ui_tab__["a" /* Tab */]('Texts');
        this.tabFiles = new __WEBPACK_IMPORTED_MODULE_3__ui_tab__["a" /* Tab */]('Files');
        this.tabLinks = new __WEBPACK_IMPORTED_MODULE_3__ui_tab__["a" /* Tab */]('Links');
        this.tabUsers = new __WEBPACK_IMPORTED_MODULE_3__ui_tab__["a" /* Tab */]('Users');
        this.tabs = [this.tabImages, this.tabTexts, this.tabFiles, this.tabLinks, this.tabUsers];
        presenter.setProjectComponent(this);
    }
    ProjectComponent.prototype.ngOnInit = function () {
        var slug = this.route.snapshot.params['slug'];
        this.presenter.initProject(slug);
        switch (this.route.firstChild.snapshot.url[0].path) {
            case 'images':
                this.showTab(this.tabImages);
                break;
            case 'texts':
                this.showTab(this.tabTexts);
                break;
            case 'files':
                this.showTab(this.tabFiles);
                break;
            case 'links':
                this.showTab(this.tabLinks);
                break;
            case 'users':
                this.showTab(this.tabUsers);
                break;
            default:
                this.showTab(this.tabImages);
                break;
        }
    };
    ProjectComponent.prototype.navigate = function (part) {
        return this.router.navigate(['/projects/' + this.project.slug + part]);
    };
    ProjectComponent.prototype.showImages = function () {
        var _this = this;
        this.navigate('/images').then(function (success) {
            if (success) {
                _this.showTab(_this.tabImages);
            }
        });
    };
    ProjectComponent.prototype.showTexts = function () {
        var _this = this;
        this.navigate('/texts').then(function (success) {
            if (success) {
                _this.showTab(_this.tabTexts);
            }
        });
    };
    ProjectComponent.prototype.showFiles = function () {
        var _this = this;
        this.navigate('/files').then(function (success) {
            if (success) {
                _this.showTab(_this.tabFiles);
            }
        });
    };
    ProjectComponent.prototype.showLinks = function () {
        var _this = this;
        this.navigate('/links').then(function (success) {
            if (success) {
                _this.showTab(_this.tabLinks);
            }
        });
    };
    ProjectComponent.prototype.showUsers = function () {
        var _this = this;
        this.navigate('/users').then(function (success) {
            if (success) {
                _this.showTab(_this.tabUsers);
            }
        });
    };
    ProjectComponent.prototype.showTab = function (tab) {
        for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
            var t = _a[_i];
            if (t === tab) {
                t.setActive();
            }
            else {
                t.setInactive();
            }
        }
    };
    ProjectComponent.prototype.setProject = function (project) {
        this.project = project;
        this.projectLogic = new __WEBPACK_IMPORTED_MODULE_4__logic_project_logic__["a" /* ProjectLogic */](this.project);
    };
    ProjectComponent.prototype.getBadgeText = function () {
        var count = this.projectLogic.getTextWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' + count + '</span>';
    };
    ProjectComponent.prototype.getBadgeImage = function () {
        var count = this.projectLogic.getImageWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' + count + '</span>';
    };
    ProjectComponent.prototype.getBadgeFile = function () {
        var count = this.projectLogic.getFileWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' + count + '</span>';
    };
    return ProjectComponent;
}());
ProjectComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        template: __webpack_require__(244),
        styles: [__webpack_require__(222)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _c || Object])
], ProjectComponent);

var _a, _b, _c;
//# sourceMappingURL=project.component.js.map

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_modal_component__ = __webpack_require__(80);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var UsersComponent = (function () {
    function UsersComponent(presenter, appBasePath) {
        this.presenter = presenter;
        this.appBasePath = appBasePath;
        this.project = presenter.activeProject;
    }
    UsersComponent.prototype.getLoginLink = function (user) {
        return this.appBasePath + '/token/' + user.loginToken;
    };
    UsersComponent.prototype.saveUser = function () {
        if (this.editedUser == null) {
            this.presenter.addUser(this.userModalComponent.user, this.userModalComponent.message);
        }
        else {
            this.editedUser.name = this.userModalComponent.user.name;
            this.editedUser.email = this.userModalComponent.user.email;
            this.presenter.modifyUser(this.editedUser);
        }
    };
    UsersComponent.prototype.add = function () {
        this.editedUser = null;
        this.userModalComponent.isNewUser = true;
        this.userModalComponent.usersComponent = this;
        this.userModalComponent.show();
    };
    UsersComponent.prototype.edit = function (user) {
        this.editedUser = user;
        this.userModalComponent.usersComponent = this;
        this.userModalComponent.user = { name: user.name, email: user.email };
        this.userModalComponent.isNewUser = false;
        this.userModalComponent.show();
    };
    UsersComponent.prototype.deleteUser = function (user) {
        if (confirm('Are you sure that you want to delete the user named ' + user.name + '?')) {
            this.presenter.deleteUser(user);
        }
    };
    return UsersComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_3__user_modal_component__["a" /* UserModalComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__user_modal_component__["a" /* UserModalComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__user_modal_component__["a" /* UserModalComponent */]) === "function" && _a || Object)
], UsersComponent.prototype, "userModalComponent", void 0);
UsersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-project-users',
        template: __webpack_require__(249)
    }),
    __param(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_common__["a" /* APP_BASE_HREF */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object, String])
], UsersComponent);

var _a, _b;
//# sourceMappingURL=users.component.js.map

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_presenter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(9);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TokenLoginComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TokenLoginComponent = (function () {
    function TokenLoginComponent(route, presenter) {
        this.route = route;
        this.presenter = presenter;
    }
    TokenLoginComponent.prototype.ngOnInit = function () {
        this.login_token = this.route.snapshot.params['login_token'];
        this.presenter.tokenLogin(this.login_token);
    };
    return TokenLoginComponent;
}());
TokenLoginComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* Component */])({
        selector: 'app-token-login',
        template: __webpack_require__(250)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], TokenLoginComponent);

var _a, _b;
//# sourceMappingURL=token-login.component.js.map

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FileDropDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FileDropDirective = (function () {
    function FileDropDirective(element) {
        this.fileOver = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.onFileDrop = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.element = element;
    }
    FileDropDirective.prototype.onDragOver = function (event) {
        var transfer = this.getDataTransfer(event);
        if (!this.haveFiles(transfer.types)) {
            return;
        }
        transfer.dropEffect = 'copy';
        this.preventAndStop(event);
        this.emitFileOver(true);
    };
    FileDropDirective.prototype.onDragLeave = function (event) {
        if (event.currentTarget === this.element[0]) {
            return;
        }
        this.preventAndStop(event);
        this.emitFileOver(false);
    };
    FileDropDirective.prototype.onDrop = function (event) {
        var transfer = this.getDataTransfer(event);
        if (!transfer) {
            return;
        }
        this.preventAndStop(event);
        this.emitFileOver(false);
        this.emitFileDrop(transfer.files[0]);
    };
    FileDropDirective.prototype.emitFileOver = function (isOver) {
        this.fileOver.emit(isOver);
    };
    FileDropDirective.prototype.emitFileDrop = function (file) {
        this.onFileDrop.emit(file);
    };
    FileDropDirective.prototype.hasStrategy = function (type) {
        return [
            'DataURL',
            'BinaryString',
            'ArrayBuffer',
            'Text',
        ].indexOf(type) !== -1;
    };
    FileDropDirective.prototype.getDataTransfer = function (event) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    };
    FileDropDirective.prototype.preventAndStop = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    FileDropDirective.prototype.haveFiles = function (types) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        }
        if (types.contains) {
            return types.contains('Files');
        }
        return false;
    };
    return FileDropDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* Output */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]) === "function" && _a || Object)
], FileDropDirective.prototype, "fileOver", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* Output */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]) === "function" && _b || Object)
], FileDropDirective.prototype, "onFileDrop", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* HostListener */])('dragover', [
        '$event',
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileDropDirective.prototype, "onDragOver", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* HostListener */])('dragleave', [
        '$event',
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileDropDirective.prototype, "onDragLeave", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* HostListener */])('drop', [
        '$event',
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileDropDirective.prototype, "onDrop", null);
FileDropDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* Directive */])({ selector: '[fileDrop]' }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* ElementRef */]) === "function" && _c || Object])
], FileDropDirective);

var _a, _b, _c;
//# sourceMappingURL=file-drop.js.map

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_project_links_links_component__ = __webpack_require__(76);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanDeactivateLinks; });

var CanDeactivateLinks = (function () {
    function CanDeactivateLinks() {
    }
    CanDeactivateLinks.prototype.canDeactivate = function (component, currentRoute, currentState, nextState) {
        if (!__WEBPACK_IMPORTED_MODULE_0__components_project_links_links_component__["a" /* LinksComponent */].saved) {
            return confirm('You have unsaved changes. Are you sure you want to leave this page?');
        }
        return true;
    };
    return CanDeactivateLinks;
}());

//# sourceMappingURL=CanDeactivateLinks.js.map

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_project_texts_texts_component__ = __webpack_require__(79);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanDeactivateTexts; });

var CanDeactivateTexts = (function () {
    function CanDeactivateTexts() {
    }
    CanDeactivateTexts.prototype.canDeactivate = function (component, currentRoute, currentState, nextState) {
        if (nextState !== null && (nextState.url.endsWith('/texts') || nextState.url.indexOf('/texts/') >= 0)) {
            return true;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0__components_project_texts_texts_component__["a" /* TextsComponent */].saved) {
            return confirm('You have unsaved changes. Are you sure you want to leave this page?');
        }
        return true;
    };
    return CanDeactivateTexts;
}());

//# sourceMappingURL=CanDeactivateTexts.js.map

/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PasswordSetGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PasswordSetGuard = (function () {
    function PasswordSetGuard(router, presenter) {
        this.router = router;
        this.presenter = presenter;
    }
    PasswordSetGuard.prototype.canActivate = function (route, state) {
        if (this.presenter.isLoggedInWithToken()) {
            this.router.navigate(['/password']);
            return false;
        }
        return true;
    };
    return PasswordSetGuard;
}());
PasswordSetGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], PasswordSetGuard);

var _a, _b;
//# sourceMappingURL=PasswordSetGuard.js.map

/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TokenGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TokenGuard = (function () {
    function TokenGuard(router, presenter) {
        this.router = router;
        this.presenter = presenter;
    }
    TokenGuard.prototype.canActivate = function (route, state) {
        if (this.presenter.isLoggedInWithToken()) {
            return true;
        }
        this.router.navigate(['/projects']);
        return false;
    };
    return TokenGuard;
}());
TokenGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], TokenGuard);

var _a, _b;
//# sourceMappingURL=TokenGuard.js.map

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(router, presenter) {
        this.router = router;
        this.presenter = presenter;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        if (this.presenter.isLoggedInWithToken()) {
            this.router.navigate(['/password']);
            return false;
        }
        if (this.presenter.isLoggedIn()) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], AuthGuard);

var _a, _b;
//# sourceMappingURL=authguard.js.map

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeGuard = (function () {
    function HomeGuard(router, presenter) {
        this.router = router;
        this.presenter = presenter;
    }
    HomeGuard.prototype.canActivate = function (route, state) {
        if (this.presenter.isLoggedIn()) {
            this.router.navigate(['/projects']);
            return false;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    };
    return HomeGuard;
}());
HomeGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], HomeGuard);

var _a, _b;
//# sourceMappingURL=homeguard.js.map

/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_presenter__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LogoutGuard = (function () {
    function LogoutGuard(router, presenter) {
        this.router = router;
        this.presenter = presenter;
    }
    LogoutGuard.prototype.canActivate = function (route, state) {
        if (this.presenter.isLoggedIn()) {
            this.presenter.logout();
            this.router.navigate(['/login']);
            return false;
        }
        return false;
    };
    return LogoutGuard;
}());
LogoutGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__logic_presenter__["a" /* Presenter */]) === "function" && _b || Object])
], LogoutGuard);

var _a, _b;
//# sourceMappingURL=logoutguard.js.map

/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginData; });
var LoginData = (function () {
    function LoginData(email, password) {
        this.email = email;
        this.password = password;
    }
    return LoginData;
}());

//# sourceMappingURL=login-data.js.map

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Autosize; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Autosize = (function () {
    function Autosize(element) {
        this.element = element;
    }
    Autosize.prototype.onInput = function (textArea) {
        this.adjust();
    };
    Autosize.prototype.ngAfterContentChecked = function () {
        this.adjust();
    };
    Autosize.prototype.adjust = function () {
        this.element.nativeElement.style.overflow = 'hidden';
        this.element.nativeElement.style.height = 'auto';
        var scrollHeight = this.element.nativeElement.scrollHeight;
        if (scrollHeight < 32)
            scrollHeight = 32;
        this.element.nativeElement.style.height = scrollHeight + "px";
    };
    return Autosize;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* HostListener */])('input', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Autosize.prototype, "onInput", null);
Autosize = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* Directive */])({
        selector: 'textarea[autosize]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* ElementRef */]) === "function" && _a || Object])
], Autosize);

var _a;
//# sourceMappingURL=autosize.directive.js.map

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MenuItem; });
var MenuItem = (function () {
    function MenuItem(name, path, active, icon) {
        this.name = name;
        this.path = path;
        this.active = active;
        this.icon = icon;
    }
    return MenuItem;
}());

//# sourceMappingURL=menu-item.js.map

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DefaultApi__ = __webpack_require__(31);
/* unused harmony namespace reexport */
/* unused harmony export APIS */


var APIS = [__WEBPACK_IMPORTED_MODULE_0__DefaultApi__["a" /* DefaultApi */]];
//# sourceMappingURL=api.js.map

/***/ }),
/* 147 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Body.js.map

/***/ }),
/* 148 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Body1.js.map

/***/ }),
/* 149 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=File.js.map

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ImageCondition */
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
var ImageCondition;
(function (ImageCondition) {
    var NameEnum;
    (function (NameEnum) {
        NameEnum[NameEnum["MinWidth"] = 'minWidth'] = "MinWidth";
        NameEnum[NameEnum["MaxWidth"] = 'maxWidth'] = "MaxWidth";
        NameEnum[NameEnum["MinHeight"] = 'minHeight'] = "MinHeight";
        NameEnum[NameEnum["MaxHeight"] = 'maxHeight'] = "MaxHeight";
    })(NameEnum = ImageCondition.NameEnum || (ImageCondition.NameEnum = {}));
})(ImageCondition || (ImageCondition = {}));
//# sourceMappingURL=ImageCondition.js.map

/***/ }),
/* 151 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Language.js.map

/***/ }),
/* 152 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Link.js.map

/***/ }),
/* 153 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=LocalText.js.map

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export LoginError */
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
var LoginError;
(function (LoginError) {
    var ErrorEnum;
    (function (ErrorEnum) {
        ErrorEnum[ErrorEnum["UserNotFound"] = 'user_not_found'] = "UserNotFound";
        ErrorEnum[ErrorEnum["PasswordError"] = 'password_error'] = "PasswordError";
    })(ErrorEnum = LoginError.ErrorEnum || (LoginError.ErrorEnum = {}));
})(LoginError || (LoginError = {}));
//# sourceMappingURL=LoginError.js.map

/***/ }),
/* 155 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=ProjectBase.js.map

/***/ }),
/* 156 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=Text.js.map

/***/ }),
/* 157 */
/***/ (function(module, exports) {

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
//# sourceMappingURL=User.js.map

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Body__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Body___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Body__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_0__Body__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_0__Body__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_0__Body__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_0__Body__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Body1__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Body1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Body1__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_1__Body1__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_1__Body1__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_1__Body1__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_1__Body1__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__File__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__File___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__File__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_2__File__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_2__File__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_2__File__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_2__File__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Image__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Image___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Image__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_3__Image__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_3__Image__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_3__Image__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_3__Image__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ImageCondition__ = __webpack_require__(150);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Language__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Language___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__Language__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_5__Language__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_5__Language__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_5__Language__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_5__Language__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Link__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__Link__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_6__Link__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_6__Link__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_6__Link__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_6__Link__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__LocalText__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__LocalText___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__LocalText__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_7__LocalText__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_7__LocalText__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_7__LocalText__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_7__LocalText__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__LoginError__ = __webpack_require__(154);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Project__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Project___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__Project__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_9__Project__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_9__Project__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_9__Project__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_9__Project__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ProjectBase__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ProjectBase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ProjectBase__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_10__ProjectBase__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_10__ProjectBase__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_10__ProjectBase__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_10__ProjectBase__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__Text__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__Text___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__Text__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_11__Text__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_11__Text__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_11__Text__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_11__Text__["BASE_PATH"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__User__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__User___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__User__);
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_12__User__, "Configuration")) __webpack_require__.d(__webpack_exports__, "Configuration", function() { return __WEBPACK_IMPORTED_MODULE_12__User__["Configuration"]; });
/* harmony namespace reexport (by used) */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_12__User__, "BASE_PATH")) __webpack_require__.d(__webpack_exports__, "BASE_PATH", function() { return __WEBPACK_IMPORTED_MODULE_12__User__["BASE_PATH"]; });













//# sourceMappingURL=models.js.map

/***/ }),
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "a.active {\r\n    color: #42A948;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "span.glyphicon {\r\n    margin-right: 10px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".progress {\r\n    margin-top: 20px;\r\n}\r\n\r\na {\r\n    font-size: large;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".glyphicon {\r\n    float: left;\r\n    font-size: 60px;\r\n    margin-right: 20px;\r\n}\r\na > strong {\r\n    font-size: larger;\r\n}\r\n.file-is-over {\r\n    border: medium solid #337ab7;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "\r\n.modal-body {\r\n    padding: 0;\r\n}\r\n\r\n.modal-dialog {\r\n    margin-left: 0;\r\n    margin-right: 0;\r\n}\r\n\r\n.modal-body > p {\r\n    margin: 20px;\r\n    font-size: larger;\r\n    text-align: center;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".file-is-over {\r\n    border: medium solid #337ab7;\r\n}\r\nform {\r\n  display: inline-block;\r\n}\r\ninput[type=file] {\r\n  display: none;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".fa {\r\n  font-size: 25px;\r\n  margin: 5px;\r\n  cursor: pointer;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".fa {\r\n    float: left;\r\n    font-size: 40px;\r\n    margin-right: 20px;\r\n    margin-bottom: 10px;\r\n    width: 40px;\r\n}\r\n\r\n.right {\r\n  float: right;\r\n  margin-left: 5px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "div.modal-body {\r\n    text-align: center;\r\n}\r\n\r\ndiv.tab-content {\r\n    margin-top: 20px;\r\n}\r\n\r\n#textList {\r\n    margin-top: 20px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".disabled {\r\n  pointer-events: none;\r\n  cursor: default;\r\n  color: gray;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, ".alert.alert-warning {\r\n    margin-top: 10px;\r\n}\r\n.thumbnail {\r\n    margin-top: 10px;\r\n}\r\ntextarea {\r\n    resize: none;\r\n}\r\n\r\nbutton.right {\r\n    float: right;\r\n    margin-left: 5px;\r\n}\r\n\r\n.floating-buttons {\r\n  position: fixed;\r\n  bottom: 10px;\r\n  right: 10px;\r\n  z-index: 100;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */
/***/ (function(module, exports) {

module.exports = "\r\n<router-outlet></router-outlet>"

/***/ }),
/* 229 */
/***/ (function(module, exports) {

module.exports = "<h1>Change Password</h1>\r\n<form  (ngSubmit)=\"onSubmit()\"  #passwordForm=\"ngForm\">\r\n  <div class=\"form-group\">\r\n    <label for=\"newPassword\">Old Password</label>\r\n    <input type=\"password\" class=\"form-control\" id=\"newPassword\" required\r\n           [(ngModel)]=\"oldPassword\" name=\"oldPassword\" #oldPasswordM=\"ngModel\">\r\n    <div [hidden]=\"(oldPasswordM.valid || oldPasswordM.pristine)\"\r\n         class=\"alert alert-danger\">\r\n      Password is required\r\n    </div>\r\n    <div [hidden]=\"!passwordError\"\r\n         class=\"alert alert-danger\">\r\n      Password is incorrect\r\n    </div>\r\n  </div>\r\n  <app-password-input></app-password-input>\r\n  <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!passwordForm.form.valid  || !passwordInputComponent.isValid()\">Submit</button>\r\n</form>\r\n"

/***/ }),
/* 230 */
/***/ (function(module, exports) {

module.exports = "<h1>Login</h1>\r\n<form  (ngSubmit)=\"onSubmit()\"  #loginForm=\"ngForm\">\r\n    <div class=\"form-group\">\r\n        <label for=\"email\">E-mail</label>\r\n        <input type=\"text\" class=\"form-control\" id=\"email\" email\r\n               [(ngModel)]=\"model.email\" name=\"email\" #email=\"ngModel\">\r\n        <div [hidden]=\"email.valid || email.pristine\"\r\n             class=\"alert alert-danger\">\r\n           E-mail is required\r\n        </div>\r\n        <div [hidden]=\"!userError\"\r\n             class=\"alert alert-danger\">\r\n            User not found\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"password\">Password</label>\r\n        <input type=\"password\" class=\"form-control\" id=\"password\" required\r\n               [(ngModel)]=\"model.password\" name=\"password\" #password=\"ngModel\">\r\n        <div [hidden]=\"(password.valid || password.pristine) && !passwordError\"\r\n             class=\"alert alert-danger\">\r\n            <div [hidden]=\"password.valid || password.pristine\">\r\n                Password is required\r\n            </div>\r\n            <div [hidden]=\"!passwordError\">\r\n                wrong password\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!loginForm.form.valid\">Submit</button>\r\n</form>\r\n"

/***/ }),
/* 231 */
/***/ (function(module, exports) {

module.exports = "<!-- Brand and toggle get grouped for better mobile display -->\r\n<div class=\"navbar-header\">\r\n  <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" aria-expanded=\"false\" (click)=\"toggle()\">\r\n    <span class=\"sr-only\">Toggle navigation</span>\r\n    <span class=\"icon-bar\"></span>\r\n    <span class=\"icon-bar\"></span>\r\n    <span class=\"icon-bar\"></span>\r\n  </button>\r\n  <a class=\"navbar-brand\" href=\"javascript:void(0)\" routerLink=\"/home\">Customer Point</a>\r\n</div>\r\n\r\n<!-- Collect the nav links, forms, and other content for toggling -->\r\n<div class=\"collapse navbar-collapse {{show}}\">\r\n  <ul class=\"nav navbar-nav\">\r\n    <li *ngFor=\"let item of activeItems\" routerLink=\"/{{item.path}}\" routerLinkActive=\"active\"><a href=\"javascript:void(0)\"><span class=\"glyphicon {{item.icon}}\"></span>{{item.name}}</a></li>\r\n  </ul>\r\n  <ul class=\"nav navbar-nav navbar-right\" [hidden]=\"user === null\">\r\n    <li class=\"dropdown {{dropdownIsOpen ? 'open' : ''}}\" (click)=\"dropdown()\">\r\n      <a href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" [attr.aria-expanded]=\"dropdownIsOpen\">{{user?.name}}<span class=\"caret\"></span></a>\r\n      <ul class=\"dropdown-menu\">\r\n        <li routerLink=\"/changePassword\" routerLinkActive=\"active\"><a href=\"javascript:void(0)\">Change Password</a></li>\r\n        <li routerLink=\"/logout\" routerLinkActive=\"active\"><a href=\"javascript:void(0)\">Logout</a></li>\r\n      </ul>\r\n    </li>\r\n  </ul>\r\n</div><!-- /.navbar-collapse -->\r\n"

/***/ }),
/* 232 */
/***/ (function(module, exports) {

module.exports = "<h1>Please set new password!</h1>\r\n<form  (ngSubmit)=\"onSubmit()\"  #passwordForm=\"ngForm\">\r\n  <app-password-input></app-password-input>\r\n  <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!passwordForm.form.valid || !passwordInputComponent.isValid()\">Submit</button>\r\n</form>\r\n"

/***/ }),
/* 233 */
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\r\n  <label for=\"newPassword\">New Password</label>\r\n  <input type=\"password\" class=\"form-control\" id=\"newPassword\" required\r\n         [(ngModel)]=\"newPassword\" name=\"newPassword\" #newPasswordM=\"ngModel\">\r\n  <div [hidden]=\"(newPasswordM.valid || newPasswordM.pristine)\"\r\n       class=\"alert alert-danger\">\r\n    Password is required\r\n  </div>\r\n  <div [hidden]=\"newPassword == null || newPassword.length >= 6 || newPassword.length === 0\"\r\n       class=\"alert alert-danger\">\r\n    The password must be minimum 6 characters long!\r\n  </div>\r\n</div>\r\n<div class=\"form-group\">\r\n  <label for=\"repeatPassword\">Repeat Password</label>\r\n  <input type=\"password\" class=\"form-control\" id=\"repeatPassword\" required\r\n         [(ngModel)]=\"repeatPassword\" name=\"repeatPassword\" #repeatPasswordM=\"ngModel\">\r\n  <div [hidden]=\"(repeatPasswordM.valid || repeatPasswordM.pristine)\"\r\n       class=\"alert alert-danger\">\r\n    Password is required\r\n  </div>\r\n  <div [hidden]=\"newPassword == null || repeatPassword == null || repeatPassword.length === 0 || repeatPassword === newPassword\"\r\n       class=\"alert alert-danger\">\r\n    Passwords do not match!\r\n  </div>\r\n</div>\r\n"

/***/ }),
/* 234 */
/***/ (function(module, exports) {

module.exports = "<h1>Projects</h1>\r\n<div class=\"list-group\">\r\n    <div *ngIf=\"projects?.length == 0\" class=\"alert alert-info\" role=\"alert\">Your projects will appear here. You can start adding projects by clicking on the \"add project\" button.</div>\r\n    <div class=\"list-group-item\" *ngFor=\"let project of projects\">\r\n      <a href=\"javascript:void(0)\" (click)=\"showProject(project.slug)\">{{project.name}}</a><span class=\"badge\" *ngIf=\"project.warnings != 0\">{{project.warnings}}</span>\r\n        <div class=\"progress\">\r\n            <div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" [attr.aria-valuenow]=\"project.progress\" aria-valuemin=\"0\" aria-valuemax=\"100\" [style.width]=\"project.progress+'%'\">\r\n                <span class=\"sr-only\">{{project.progress}}% Complete</span>\r\n            </div>\r\n        </div>\r\n      <div *ngIf=\"project.admin\">\r\n      <button type=\"button\" class=\"btn btn-success\" (click)=\"edit(project)\" ><span class=\"glyphicon glyphicon-edit\"></span></button>\r\n      <button type=\"button\" class=\"btn btn-success\" (click)=\"deleteProject(project)\" ><span class=\"glyphicon glyphicon-trash\"></span></button>\r\n      </div>\r\n    </div>\r\n</div>\r\n\r\n<button type=\"button\" class=\"btn btn-primary\" (click)=\"add()\" >Add project</button>\r\n<app-project-modal></app-project-modal>\r\n"

/***/ }),
/* 235 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n    <div class=\"modal-dialog\">\r\n\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n                <h4 class=\"modal-title\">New Project</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <form #projectForm=\"ngForm\">\r\n                    {{diagnostic}}\r\n                    <div class=\"form-group\">\r\n                        <label for=\"name\">Name</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"name\" required\r\n                               [(ngModel)]=\"project.name\" name=\"name\" #name=\"ngModel\">\r\n                        <div [hidden]=\"name.valid || name.pristine\"\r\n                             class=\"alert alert-danger\">\r\n                            Name is required\r\n                        </div>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-default\" [disabled]=\"!projectForm.form.valid\" (click)=\"save()\">Save</button>\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Cancel</button>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n"

/***/ }),
/* 236 */
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\r\n    <div fileDrop\r\n         [ngClass]=\"{'file-is-over': fileIsOver}\"\r\n         (fileOver)=\"fileOver($event)\"\r\n         (onFileDrop)=\"onFileDrop($event)\">\r\n        <a href=\"http://localhost:8000/{{file.fileName}}\" target=\"_blank\" class=\"list-group-item\" *ngFor=\"let file of project.files\">\r\n            <span class=\"glyphicon glyphicon-download\"></span>\r\n            <strong>{{file.name}}</strong> <br>\r\n            {{file.description}}<br>\r\n            <i>{{file.fileName}} ({{file.size}} KB)</i>\r\n            <div [hidden]=\"file.fileName != null && file.fileName.length > 0\"\r\n                 class=\"alert alert-warning\">\r\n                You must upload this image!\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>"

/***/ }),
/* 237 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" id=\"myModal\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n    <div class=\"modal-dialog\" [style.left]=\"getModalLeft()+'px'\">\r\n\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\" [style.width]=\"(width+2)+'px'\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n                <h4 class=\"modal-title\">{{currentImage.name}}</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <img alt=\"{{currentImage.name}}\"\r\n                     [width]=\"width\"\r\n                     [height]=\"height\"\r\n                     src=\"{{getImageUrl(currentImage)}}\"\r\n                     data-holder-rendered=\"true\">\r\n                <p>{{currentImage.description}}</p>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Close</button>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n"

/***/ }),
/* 238 */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"project.images.length === 0\" class=\"alert alert-info\" role=\"alert\">Images belonging to your project, will appear here. You can start adding images by clicking on the \"add image\" button.</div>\r\n<div *ngIf=\"project.images.length !== 0\" class=\"checkbox\">\r\n  <label><input type=\"checkbox\"  [checked]=\"filter\" (change)=\"toggleFilter()\">Only show images with warnings</label>\r\n</div>\r\n<div class=\"row\">\r\n    <app-thumbnail *ngFor=\"let image of images\" [image]=\"image\" [project]=\"project\" [imageModalComponent]=\"imageModalComponent\"></app-thumbnail>\r\n</div>\r\n<div class=\"row\" [hidden]=\"!project.admin\">\r\n  <div class=\"col-sm-6 col-md-4\">\r\n    <button [hidden]=\"!project.admin\" type=\"button\" class=\"btn btn-success\" (click)=\"add()\" >Add image</button>\r\n  </div>\r\n</div>\r\n<app-project-image-modal></app-project-image-modal>\r\n<app-new-image-modal></app-new-image-modal>\r\n"

/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n    <div class=\"modal-dialog\">\r\n\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n                <h4 class=\"modal-title\">New image</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <form #newImageForm=\"ngForm\">\r\n                    <div class=\"form-group\">\r\n                        <label for=\"name\">Name</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"name\" required\r\n                               [(ngModel)]=\"image.name\" name=\"name\" #name=\"ngModel\">\r\n                        <div [hidden]=\"name.valid || name.pristine\"\r\n                             class=\"alert alert-danger\">\r\n                            Name is required\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"description\">Description</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"description\" required\r\n                               [(ngModel)]=\"image.description\" name=\"description\">\r\n                    </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"minWidth\">Minimum Width</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"minWidth\" id=\"minWidth\" required\r\n                           [(ngModel)]=\"image.minWidth\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"minWidth\">Maximum Width</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"maxWidth\" id=\"maxWidth\" required\r\n                           [(ngModel)]=\"image.maxWidth\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"minHeight\">Minimum Height</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"minHeight\" id=\"minHeight\" required\r\n                           [(ngModel)]=\"image.minHeight\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"maxHeight\">Maximum Height</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"maxHeight\" id=\"maxHeight\" required\r\n                           [(ngModel)]=\"image.maxHeight\">\r\n                  </div>\r\n                </form>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\" [disabled]=\"!newImageForm.form.valid\">Save</button>\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Cancel</button>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n"

/***/ }),
/* 240 */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-sm-6 col-md-4\">\r\n    <div fileDrop\r\n         [ngClass]=\"{'file-is-over': fileIsOver == image}\"\r\n         (fileOver)=\"fileOver($event)\"\r\n         (onFileDrop)=\"onFileDrop($event)\">\r\n        <div class=\"thumbnail\">\r\n            <a href=\"javascript:void(0);\" (click)=\"showImage()\">\r\n                <img alt=\"{{image.name}}\"\r\n                     src=\"{{getImageUrl()}}\"\r\n                     [id]=\"'img'+image.imageId\"\r\n                     (load)=\"load(image)\"\r\n                     data-holder-rendered=\"true\">\r\n            </a>\r\n            <div class=\"caption\">\r\n                <div *ngIf=\"!editing\">\r\n                    <h3>{{image.name}}</h3>\r\n                    <p>{{image.description}}</p>\r\n                </div>\r\n                <form *ngIf=\"editing\">\r\n                    <div class=\"form-group\">\r\n                        <label for=\"name\">Name</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" required\r\n                               [(ngModel)]=\"image.name\">\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"description\">Description</label>\r\n                        <textarea class=\"form-control\" autosize rows=\"1\" id=\"description\" name=\"description\" required\r\n                                  [(ngModel)]=\"image.description\"></textarea>\r\n                    </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"minWidth\">Minimum Width</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"minWidth\" id=\"minWidth\" required\r\n                           [(ngModel)]=\"image.minWidth\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"maxWidth\">Maximum Width</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"maxWidth\" id=\"maxWidth\" required\r\n                           [(ngModel)]=\"image.maxWidth\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"minHeight\">Minimum Height</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"minHeight\" id=\"minHeight\" required\r\n                           [(ngModel)]=\"image.minHeight\">\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"maxHeight\">Maximum Height</label>\r\n                    <input type=\"number\" class=\"form-control\" name=\"maxHeight\" id=\"maxHeight\" required\r\n                           [(ngModel)]=\"image.maxHeight\">\r\n                  </div>\r\n                </form>\r\n                <div [hidden]=\"image.fileName != null && image.fileName.length > 0\"\r\n                     class=\"alert alert-warning\">\r\n                    <span class=\"glyphicon glyphicon-cloud-upload\"></span> You must upload this image! Click on the upload button, or drag & drop the image file into this box.\r\n                </div>\r\n              <div [hidden]=\"widthWarning == null\"\r\n                   class=\"alert alert-warning\">\r\n                {{widthWarning}}\r\n              </div>\r\n              <div [hidden]=\"heightWarning == null\"\r\n                   class=\"alert alert-warning\">\r\n                {{heightWarning}}\r\n              </div>\r\n              <form>\r\n                <label class=\"btn btn-primary\" >\r\n                  <span class=\"glyphicon glyphicon-cloud-upload\"></span> Upload\r\n                  <input type=\"file\" (change)=\"fileChange($event)\" placeholder=\"Upload file\" accept=\".jpg, .png, .gif, .svg\">\r\n                </label>\r\n              </form>\r\n                <span [hidden]=\"!project.admin\">\r\n                  <button type=\"button\" class=\"btn btn-success\" (click)=\"save()\" ><span class=\"glyphicon glyphicon-floppy-disk\"></span></button>\r\n                  <button type=\"button\" class=\"btn btn-success\" (click)=\"edit()\" ><span class=\"glyphicon glyphicon-edit\"></span></button>\r\n                  <button type=\"button\" class=\"btn btn-success\" (click)=\"deleteImage()\" ><span class=\"glyphicon glyphicon-trash\"></span></button>\r\n                </span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 241 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n\r\n    <!-- Modal content-->\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n        <h4 class=\"modal-title\">Choose Icon</h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <span *ngFor=\"let icon of icons\" class=\"fa fa-{{icon}}\" (click)=\"selectIcon(icon)\"></span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),
/* 242 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n  <div class=\"modal-dialog\">\r\n\r\n    <!-- Modal content-->\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n        <h4 class=\"modal-title\">New Link</h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <form #newLinkForm=\"ngForm\">\r\n          {{diagnostic}}\r\n          <div class=\"form-group\">\r\n            <label for=\"name\">Name</label>\r\n            <input type=\"text\" class=\"form-control\" id=\"name\" required\r\n                   [(ngModel)]=\"link.name\" name=\"name\" #name=\"ngModel\">\r\n            <div [hidden]=\"name.valid || name.pristine\"\r\n                 class=\"alert alert-danger\">\r\n              Name is required\r\n            </div>\r\n          </div>\r\n          <div class=\"form-group\">\r\n            <label for=\"icon\">Icon</label>\r\n            <div class=\"input-group\">\r\n              <span class=\"input-group-addon\"><span class=\"fa {{link.icon}}\"></span></span>\r\n              <input type=\"text\" class=\"form-control\" id=\"icon\" required\r\n                     [(ngModel)]=\"iconSuffix\" name=\"icon\" #icon=\"ngModel\">\r\n              <span class=\"input-group-btn\">\r\n                <button class=\"btn btn-secondary\" type=\"button\" (click)=\"chooseIcon()\">Select</button>\r\n              </span>\r\n            </div>\r\n            <div [hidden]=\"icon.valid || icon.pristine\"\r\n                 class=\"alert alert-danger\">\r\n              Icon is required\r\n            </div>\r\n            <div [hidden]=\"isIconValid\"\r\n                 class=\"alert alert-danger\">\r\n              Invalid icon\r\n            </div>\r\n          </div>\r\n          <div class=\"form-group\">\r\n            <label for=\"url\">URL</label>\r\n            <input type=\"text\" class=\"form-control\" id=\"url\" required\r\n                   [(ngModel)]=\"link.url\" name=\"url\" #url=\"ngModel\">\r\n            <div [hidden]=\"url.valid || url.pristine\"\r\n                 class=\"alert alert-danger\">\r\n              URL is required\r\n            </div>\r\n          </div>\r\n        </form>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\" [disabled]=\"!newLinkForm.form.valid || !isIconValid\">Save</button>\r\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Cancel</button>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n<app-icon-selector></app-icon-selector>\r\n"

/***/ }),
/* 243 */
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\r\n  <div *ngIf=\"project.links.length == 0\" class=\"alert alert-info\" role=\"alert\">Links belonging to your project, like Homepage, Facebook page etc., will appear here. You can start adding links by clicking on the \"add link\" button.</div>\r\n  <div *ngFor=\"let link of project.links\" class=\"list-group-item\">\r\n    <span class=\"fa {{link.icon}}\"></span>\r\n    <span *ngIf=\"project.admin\">\r\n      <button type=\"button\" class=\"right btn btn-success\" (click)=\"deleteLink(link)\" ><span class=\"glyphicon glyphicon-trash\"></span></button>\r\n      <button type=\"button\" class=\"right btn btn-success\" (click)=\"edit(link)\" ><span class=\"glyphicon glyphicon-edit\"></span></button>\r\n    </span>\r\n    <a class=\"right btn btn-primary\" href=\"{{link.url}}\" target=\"_blank\"><span class=\"glyphicon glyphicon-link\"></span></a>\r\n    <form class=\"form-group\">\r\n      <label for=\"link_url\">{{link.name}}</label>\r\n      <input class=\"form-control\" type=\"text\" id=\"link_url\" name=\"link_url\" [value]=\"link.url\" required\r\n             [(ngModel)]=\"link.url\" (keyup)=\"onKey($event)\">\r\n    </form>\r\n  </div>\r\n</div>\r\n<div>\r\n  <button *ngIf=\"project.admin\" type=\"button\" class=\"btn btn-success\" (click)=\"add()\" >Add link</button>\r\n  <button type=\"button\" class=\"btn btn-primary right {{isSaved() ? 'disabled' : ''}}\" (click)=\"save()\" >Save <span [hidden]=\"!saving\"><span class=\"glyphicon glyphicon-hourglass\"></span></span></button>\r\n  <button type=\"button\" class=\"btn btn-primary right {{isSaved() ? 'disabled' : ''}}\" (click)=\"reset()\" >Reset</button>\r\n</div>\r\n<app-link-modal></app-link-modal>\r\n"

/***/ }),
/* 244 */
/***/ (function(module, exports) {

module.exports = "<div class=\"glyphicon glyphicon-refresh\" *ngIf=\"project.name == null\">\r\n</div>\r\n\r\n<div *ngIf=\"project.name != null\">\r\n    <ol class=\"breadcrumb\">\r\n        <li><a href=\"javascript:void(0);\" routerLink=\"/projects\">Projects</a></li>\r\n        <li class=\"active\">{{project.name}}</li>\r\n    </ol>\r\n    <h1>{{project.name}}</h1>\r\n    <div class=\"progress\">\r\n        <div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" [attr.aria-valuenow]=\"projectLogic.getInfoPercentage()\" aria-valuemin=\"0\" aria-valuemax=\"100\" [style.width]=\"projectLogic.getInfoPercentage()+'%'\">\r\n            <span class=\"sr-only\">{{projectLogic.getInfoPercentage()}}% Complete</span>\r\n        </div>\r\n    </div>\r\n    <ul class=\"nav nav-pills\">\r\n        <li role=\"presentation\" [class]=\"tabImages.pillClass\"><a href=\"javascript:void(0);\" (click)=\"showImages()\">{{tabImages.name}} <span [innerHTML]=\"getBadgeImage()\"></span></a></li>\r\n        <li role=\"presentation\" [class]=\"tabTexts.pillClass\"><a href=\"javascript:void(0);\" (click)=\"showTexts()\" >{{tabTexts.name}} <span [innerHTML]=\"getBadgeText()\"></span></a></li>\r\n        <li role=\"presentation\" [class]=\"tabLinks.pillClass\"><a href=\"javascript:void(0);\" (click)=\"showLinks()\">{{tabLinks.name}} </a></li>\r\n        <li *ngIf=\"project.admin\" role=\"presentation\" [class]=\"tabUsers.pillClass\"><a href=\"javascript:void(0);\" (click)=\"showUsers()\">{{tabUsers.name}} </a></li>\r\n    </ul>\r\n\r\n    <div class=\"tab-content\">\r\n      <router-outlet></router-outlet>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 245 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n  <div class=\"modal-dialog modal-lg\">\r\n\r\n    <!-- Modal content-->\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n        <h4 class=\"modal-title\">Choose Language</h4>\r\n      </div>\r\n      <div class=\"modal-body row\">\r\n        <a *ngFor=\"let language of languages\" class=\"col-sm-4 col-md-2 {{projectHasLanguage(language) ? 'disabled' : ''}}\" href=\"javascript:void(0)\" (click)=\"selectLanguage(language)\">{{language.name}}</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),
/* 246 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n    <div class=\"modal-dialog\">\r\n\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n                <h4 class=\"modal-title\">New Text</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <form #textForm=\"ngForm\">\r\n                    <div class=\"form-group\">\r\n                        <label for=\"name\">Name</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"name\" required\r\n                               [(ngModel)]=\"model.name\" name=\"name\" #name=\"ngModel\">\r\n                        <div [hidden]=\"name.valid || name.pristine\"\r\n                             class=\"alert alert-danger\">\r\n                            Name is required\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"description\">Description</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"description\" required\r\n                               [(ngModel)]=\"model.description\" name=\"description\">\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"minLength\">Minimum length</label>\r\n                        <input type=\"number\" class=\"form-control\" name=\"minLength\" id=\"minLength\" required\r\n                               [(ngModel)]=\"model.minLength\">\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"maxLength\">Maximum length</label>\r\n                        <input type=\"number\" class=\"form-control\" name=\"maxLength\" id=\"maxLength\" required\r\n                               [(ngModel)]=\"model.maxLength\">\r\n                    </div>\r\n                </form>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\" [disabled]=\"!textForm.form.valid\">Save</button>\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Cancel</button>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n"

/***/ }),
/* 247 */
/***/ (function(module, exports) {

module.exports = "<ul class=\"nav nav-tabs\">\r\n  <li *ngFor=\"let tab of languageTabs; let i = index\" role=\"presentation\" [class]=\"tab.pillClass\"><a href=\"javascript:void(0);\" (click)=\"navigate(i)\">{{tab.name}} <span [innerHTML]=\"getBadgeLocaleText(i)\"></span></a></li>\r\n</ul>\r\n<form id=\"textList\">\r\n  <div *ngIf=\"project.languages.length === 0\" class=\"alert alert-info\" role=\"alert\">Texts belonging to your project, will appear here. First you must add a language by clicking to the \"add language\" button.</div>\r\n  <div *ngIf=\"project.languages.length !== 0 && project.texts.length === 0\" class=\"alert alert-info\" role=\"alert\">Texts belonging to your project, will appear here. You can start adding texts by clicking on the \"add text\" button.</div>\r\n  <div *ngIf=\"project.texts.length !== 0\" class=\"checkbox\">\r\n    <label><input type=\"checkbox\"  [checked]=\"filter\" (change)=\"toggleFilter()\">Only show texts with warnings</label>\r\n  </div>\r\n  <div *ngFor=\"let entry of textEntries\">\r\n    <h2 *ngIf=\"entry.text.startGroup != null && entry.text.startGroup.length != 0\">{{entry.text.startGroup}}</h2>\r\n    <div class=\"form-group\">\r\n      <div class=\"thumbnail\">\r\n        <div class=\"caption\">\r\n          <label for=\"{{'i'+entry.id}}\">{{entry.text.name}}</label>\r\n          <p>{{entry.text.description}}</p>\r\n          <div class=\"input-group\">\r\n            <span class=\"input-group-addon\" id=\"{{'l'+entry.id}}\"><span class=\"glyphicon {{getTextIndicator(entry)}}\"></span></span>\r\n            <textarea class=\"form-control\" autosize rows=\"1\"\r\n                      name=\"{{'i'+entry.id}}\" id=\"{{'i'+entry.id}}\"\r\n                      [attr.aria-describedby]=\"'l'+entry.id\"\r\n                      [(ngModel)]=\"entry.localText.value\"  #textvalue=\"ngModel\" (keyup)=\"onKey($event)\" (changed)=\"changed()\">\r\n\r\n                        </textarea>\r\n          </div>\r\n          <div [hidden]=\"textvalue.value?.length > 0\"\r\n               class=\"alert alert-warning\">\r\n            You must fill out this field!\r\n          </div>\r\n          <div [hidden]=\"entry.text.minLength <= textvalue.value?.length || textvalue.value?.length == 0\"\r\n               class=\"alert alert-warning\">\r\n            Text is too short! Minimum required length is: {{entry.text.minLength}}, current length is: {{textvalue.value?.length}}\r\n          </div>\r\n          <div [hidden]=\"entry.text.maxLength >= textvalue.value?.length\"\r\n               class=\"alert alert-warning\">\r\n            Text is too long! Maximum required length is: {{entry.text.maxLength}}, current length is: {{textvalue.value?.length}}\r\n          </div>\r\n        </div>\r\n        <button type=\"button\" class=\"btn btn-primary\" (click)=\"resetText(entry.text)\" >Reset</button>\r\n        <span [hidden]=\"!project.admin\">\r\n        <button type=\"button\" class=\"btn btn-success\" (click)=\"edit(entry.text)\" ><span class=\"glyphicon glyphicon-edit\"></span></button>\r\n        <button type=\"button\" class=\"btn btn-success\" (click)=\"deleteText(entry.text)\" ><span class=\"glyphicon glyphicon-trash\"></span></button>\r\n        </span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</form>\r\n<div>\r\n    <span [hidden]=\"!project.admin\">\r\n      <button type=\"button\" class=\"btn btn-success\" [disabled]=\"project.languages.length === 0\" (click)=\"add()\" >Add text</button>\r\n      <button type=\"button\" class=\"btn btn-success\" (click)=\"addNewLanguage()\" >Add language</button>\r\n      <button type=\"button\" class=\"btn btn-success\" [disabled]=\"project.languages.length < 2\" (click)=\"removeLanguage()\" >Remove language</button>\r\n    </span>\r\n  <span class=\"floating-buttons\">\r\n  <button type=\"button\" class=\"btn btn-primary right\" [disabled]=\"isSaved()\" (click)=\"save()\" >Save <span [hidden]=\"!saving\"><span class=\"glyphicon glyphicon-hourglass\"></span></span></button>\r\n  <button type=\"button\" class=\"btn btn-primary right\" [disabled]=\"isSaved()\" (click)=\"reset()\" >Reset</button>\r\n    </span>\r\n</div>\r\n<app-new-text-modal></app-new-text-modal>\r\n<app-language-selector></app-language-selector>\r\n"

/***/ }),
/* 248 */
/***/ (function(module, exports) {

module.exports = "<div [class]=\"modal.hClass\" role=\"dialog\" [style.display]=\"modal.shown? 'block' : 'none'\">\r\n    <div class=\"modal-dialog\">\r\n\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" (click)=\"modal.hide()\">×</button>\r\n                <h4 class=\"modal-title\">{{isNewUser ? 'New' : 'Edit'}} User</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <form #newUserForm=\"ngForm\">\r\n                    {{diagnostic}}\r\n                    <div class=\"form-group\">\r\n                        <label for=\"name\">Name</label>\r\n                        <input type=\"text\" class=\"form-control\" id=\"name\" required\r\n                               [(ngModel)]=\"user.name\" name=\"name\" (keypress)=\"nameChanged()\" #name=\"ngModel\">\r\n                        <div [hidden]=\"name.valid || name.pristine\"\r\n                             class=\"alert alert-danger\">\r\n                            Name is required\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"email\">E-mail</label>\r\n                        <input type=\"email\" class=\"form-control\" id=\"email\" email\r\n                               [(ngModel)]=\"user.email\" name=\"email\" #email=\"ngModel\">\r\n                        <div [hidden]=\"email.valid || email.pristine\"\r\n                             class=\"alert alert-danger\">\r\n                            Not a valid e-mail address\r\n                        </div>\r\n                    </div>\r\n                  <div *ngIf=\"isNewUser\" class=\"form-group\">\r\n                    <label for=\"message\">Message</label>\r\n                    <textarea type=\"text\" class=\"form-control\" id=\"message\" required\r\n                           [(ngModel)]=\"message\" name=\"message\" #messageM=\"ngModel\">\r\n                    </textarea>\r\n                    <div [hidden]=\"messageM.valid || messageM.pristine\"\r\n                         class=\"alert alert-danger\">\r\n                      You must fill out the message!\r\n                    </div>\r\n                  </div>\r\n                </form>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\">Save</button>\r\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"modal.hide()\">Cancel</button>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<div [hidden]=\"!modal.shown\" class=\"modal-backdrop fade in\"></div>\r\n"

/***/ }),
/* 249 */
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\r\n    <table class=\"table\">\r\n        <thead>\r\n        <tr>\r\n            <th>Name</th>\r\n            <th>Email</th>\r\n            <th>Login link</th>\r\n            <th></th>\r\n        </tr>\r\n        </thead>\r\n        <tbody>\r\n        <tr *ngFor=\"let user of project.users\">\r\n            <td>{{user.name}}</td>\r\n            <td>{{user.email}}</td>\r\n            <td><span [hidden]=\"user.loginToken == null || user.loginToken.length === 0\">{{getLoginLink(user)}}</span></td>\r\n            <td>\r\n                <button type=\"button\" class=\"btn btn-primary\" (click)=\"edit(user)\" ><span class=\"glyphicon glyphicon-edit\"></span></button>\r\n                <button type=\"button\" class=\"btn btn-primary\" (click)=\"deleteUser(user)\" [disabled]=\"user.email === presenter.user.email\" ><span class=\"glyphicon glyphicon-trash\"></span></button>\r\n            </td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n<button type=\"button\" class=\"btn btn-primary\" (click)=\"add()\" >Add user</button>\r\n<app-user-modal></app-user-modal>\r\n"

/***/ }),
/* 250 */
/***/ (function(module, exports) {

module.exports = "<h1>Token Login</h1>"

/***/ }),
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(113);


/***/ })
],[302]);
//# sourceMappingURL=main.bundle.js.map