import {LanguageCode} from "../Services/MultiLanguage/MultiLanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserModel {

    _id: string;
    publicData: PublicDataModel;
    mutableData: MutableDataModel;
    privateData: PrivateDataModel;
    userType: string;
    loginPlatforms: LoginPlatformUserDataModel[];

}

export const enum GenderType {
    NONE = 0,
    MALE = 1,
    FEMALE = 2
}

@ccclass
export class PublicDataModel {
    name: string;
    photoUrl: string;
    level : number;
}

@ccclass
export class MutableDataModel {

    passWelcomePage : boolean;
    ageRangeMin: number;
    ageRangeMax: number;
    gender: GenderType;
    gameLanguageCode : LanguageCode;
    puzzleLanguageCode : LanguageCode;

}

@ccclass
export class PrivateDataModel {


}

@ccclass
export class LoginPlatformUserDataModel {


}
