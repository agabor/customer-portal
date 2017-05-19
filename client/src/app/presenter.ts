
import {URLSearchParams, Http} from "@angular/http"
import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";

@Injectable()
export class Presenter {
    constructor (private http: Http) {}

    login(model: LoginData){
        let data = new URLSearchParams();
        data.append('user_name', model.name);
        data.append('password', model.password);

        this.http
            .post('http://localhost:8000/api/v1/login', data)
            .subscribe(data => {
                // alert('ok');
                console.log(data);
            }, error => {
                console.log(error.json());
            });
    }
}