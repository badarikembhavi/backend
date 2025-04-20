import {HttpStatus, Injectable} from '@nestjs/common'
import { HelperService } from 'apps/helpers/helpers/helper.service';



@Injectable()
export class EncryptProvider{
    constructor(
        private helper: HelperService
    ){}

    async encrypted(str: string) {
        console.log(str, 'str');
        try {
            let encryptText = await this.helper.encrypt(str);
            console.log(encryptText, 'encrypt');
            return this.helper.responseHandler(true, 'Action Successful', encryptText, HttpStatus.OK);
        } catch (error) {
            return this.helper.responseHandler(false, 'something went wrong', error.message, HttpStatus.FORBIDDEN);
        }
    }

    async decrypted(str: string){
        console.log(str,'str')
        try {
            let decryptText = await this.helper.decrypt(str);
            console.log(decryptText,'decrypt')
            return this.helper.responseHandler(true, 'Action Successful', decryptText, HttpStatus.OK);
        } catch (error) {
            console.log(error,'error')
            return this.helper.responseHandler(false, 'something went wrong', error.message, HttpStatus.FORBIDDEN);
        }
    }
    
}