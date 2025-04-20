import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, genSaltSync, hashSync} from 'bcrypt'
import { createCipheriv, createHash, randomBytes } from 'crypto';


@Injectable()
export class HelperService {
    ENC_ALGORITHM: string;
    constructor(private readonly jwtService: JwtService, private config: ConfigService){
        this.ENC_ALGORITHM = this.config.get('ENC_ALGORITHM')??"";
    }

    decryptBodyParam(str: string){
        return this.base64Decode(str)
    }

    encryptBodyParam(str: string){
        return this.base64Encode(str)
    }

    base64Decode(str: string){
        return Buffer.from(str,'base64').toString('utf-8')
    }

    base64Encode(str: string){
        return Buffer.from(str).toString('base64')
    }

    hashPassword(password: string):string{
        let salt = genSaltSync(10)
        let pw = hashSync(password, salt);
        return pw
    }

    comparePassword(password: string, passwordHash: string): any| boolean{
        return compareSync(password, passwordHash)
    }

    hashString(str: string){
        return createHash('sha256').update(str).digest('hex')
    }

    responseHandler(success: boolean, message: string, data: any = null, statusCode = HttpStatus.OK){
        return {success, message, data, statusCode}
    }

    sendResponse(responseData: any, res: any){
        let {statusCode} = responseData;
        res.status(statusCode)
        return responseData;
    }

    decrypt(text: any){
        text = Buffer.from(text, 'base64').toString('utf-8')
        const [ivPart, encryptText, KeyPart] = text.split(':')
        let iv = Buffer.from(ivPart, 'hex')
        let key = Buffer.from(KeyPart, 'hex')
        let encryptedText = Buffer.from(encryptText,'hex')
        let decipher = createCipheriv(this.ENC_ALGORITHM, key,iv)
        let decrypted = decipher.update(encryptedText)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString();
    }

    encrypt(text: string){
        // console.log(text,'text')
        let iv = randomBytes(16);
        let key = randomBytes(32);
        let cipher = createCipheriv(this.ENC_ALGORITHM, key, iv)
        // console.log(cipher,'cipher')
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()])
        let encryptedText = iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + key.toString('hex')
        return Buffer.from(encryptedText).toString('base64');
    }

    generateJWT(payload: any): string {
        return this.jwtService.sign(payload)
    }

    verifyJWT(payload: any){
        return this.jwtService.verify(payload,{publicKey: this.config.get('JWT_SECRET')})
    }
}