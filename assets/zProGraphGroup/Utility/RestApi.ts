import {AuthType} from "../Services/GameService/Models/AuthType";
import LoginPlatformProfile from "../Services/GameService/Models/LoginPlatformProfile";
import {LoginPlatformType} from "../Platforms/LoginPlatforms/BaseClasses/LoginPlatform";

// @ts-ignore
const {ccclass, property} = cc._decorator;


class RestApiQueryParam {
    constructor(public keyName: string,
                public keyValue: string) {
    }
}

class RestApiQueryParams {

    private params: RestApiQueryParam[];

    constructor() {
        this.params = [];
    }

    addParam(keyName: string, keyValue: string): RestApiQueryParams {
        this.params.push(new RestApiQueryParam(keyName, keyValue));
        return this;
    }


    getParams(): RestApiQueryParam[] {
        return this.params;
    }

    toString(isStart: boolean = true) {

        let res: string = "";

        if (isStart)
            res += "?";

        for (let i = 0; i < this.params.length; i++) {

            if (i > 0)
                res += "&";

            res += this.params[i].keyName + "=" + this.params[i].keyValue;
        }

        return res;
    }


}


// @ccclass('RestApiRequestHeaderParam')
// class RestApiRequestHeaderParam {
//     constructor(public keyName: string,
//                 public keyValue: string) {
//     }
// }
//
// @ccclass('RestApiRequestHeaderParams')
// class RestApiRequestHeaderParams {
//
//     private params: RestApiRequestHeaderParam[];
//
//     constructor() {
//         this.params = [];
//     }
//
//     addParam(keyName: string, keyValue: string): RestApiRequestHeaderParams {
//         this.params.push(new RestApiRequestHeaderParam(keyName, keyValue));
//         return this;
//     }
//
//     toString() {
//
//         let res: string = "";
//
//         for (let i = 0; i < this.params.length; i++) {
//             res += this.params[i].keyName + "=" + this.params[i].keyValue;
//         }
//
//         return res;
//     }
// }

export const enum RestApiMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}


export class RestApiRequest {

    private xhttp: XMLHttpRequest;
    private restApiQueryParams: RestApiQueryParams;
    private bodyData: string;
    private requestHeader: any[];

    private isFetch: boolean = true;

    constructor(public restApiMethods: RestApiMethods, public  url: string) {
        this.xhttp = new XMLHttpRequest();
        this.restApiQueryParams = new RestApiQueryParams();
        this.requestHeader = [];
    }

    addRequestHeader(keyName: string, keyValue: string): RestApiRequest {
        this.requestHeader.push({keyName: keyName, keyValue: keyValue});
        return this;
    }

    addQueryParam(keyName: string, keyValue: string): RestApiRequest {
        this.restApiQueryParams.addParam(keyName, keyValue);
        return this;
    }

    setBodyData(bodyData: any): RestApiRequest {
        this.bodyData = bodyData;
        return this;
    }

    send(onDone: (result) => void) {

        const self = this;

        if (this.isFetch) {

            let reqHeader = new Headers();
            for (let head of this.requestHeader) {
                reqHeader.append(head.keyName, head.keyValue);
            }

            let options = {
                method: this.restApiMethods.toString(), headers: reqHeader, body: this.bodyData
            };

            fetch(this.url + (this.restApiQueryParams.getParams().length > 0 ? this.restApiQueryParams.toString() : ""), options)
                .then(self.handleResponse)
                .then(function (data) {
                    // console.log('success', data);
                    if (onDone)
                        onDone(data);
                })
                .catch(function (e) {
                    console.error("rest error : ", e.toString());
                    console.error("error: ", e);
                    console.error("error: ", JSON.stringify(e));
                    if (onDone)
                        onDone(null);
                });

        } else {
            try {
                this.xhttp.onreadystatechange = () => {

                    // console.warn("onreadystatechange rest this.xhttp.responseText: " ,this.xhttp.responseText);

                    if (this.xhttp.responseText && this.xhttp.readyState === 4 && this.xhttp.status !== 200) {
                        if (onDone)
                            onDone(null);
                        return;
                    }

                    // @ts-ignore
                    if (!this.xhttp.responseText || this.xhttp.readyState !== 4 || this.xhttp.status !== 200) {
                        return;
                    }

                    // @ts-ignore
                    let res = JSON.parse(this.xhttp.responseText);

                    if (onDone)
                        onDone(res);
                };

                this.xhttp.open(this.restApiMethods.toString(),
                    this.url + (this.restApiQueryParams.getParams().length > 0 ? this.restApiQueryParams.toString() : ""),
                    true
                );

                for (let head of this.requestHeader) {
                    this.xhttp.setRequestHeader(head.keyName, head.keyValue);
                }

                // console.warn("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                // console.warn(">>> [on send restApi] :" ,this.toString());
                // console.warn("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                this.xhttp.onerror = function (e) {
                    console.error("rest error : ", e.toString());
                    console.error("error: ", e);
                    console.error("error: ", JSON.stringify(e));
                    if (onDone)
                        onDone(null);
                };

                this.xhttp.send(this.bodyData);
            } catch (e) {
                console.error("rest error : ", e.toString());
                console.error("error: ", e);
                console.error("error: ", JSON.stringify(e));
                if (onDone)
                    onDone(null);
            }
        }
    }

    toString(): string {
        // return `Headers: ${JSON.stringify(this.requestHeader)} QueryParams: ${JSON.stringify(this.restApiQueryParams)}  Body: ${JSON.stringify(this.bodyData)}`;
        // @ts-ignore
        return "URL: ${0} Headers: ${1} QueryParams: ${2}  Body: ${3}".format(
            this.url,
            JSON.stringify(this.requestHeader),
            JSON.stringify(this.restApiQueryParams),
            JSON.stringify(this.bodyData));
    }

    cancel() {
        this.xhttp.abort();
    }

    public changeRequestHeader(keyName: string, keyValue: string): RestApiRequest {
        // @ts-ignore
        let founded: any = this.requestHeader.find(x => x.keyName === keyName);
        if (founded)
            founded.keyValue = keyValue;
        return this;
    }

    private handleResponse(response) {
        return response.json()
            .then(function (json) {
                if (response.ok) {
                    return json;
                } else {
                    return Promise.reject(response);
                }
            });
    }

}

@ccclass
// @ts-ignore
export default class RestApi {

}
