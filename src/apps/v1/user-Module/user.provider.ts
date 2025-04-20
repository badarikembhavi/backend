import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HelperService } from "apps/helpers/helpers/helper.service";
import { User } from "entities/user/user.entity";
import { UsersProfile } from "entities/user/users-profile.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserProvider {
    constructor(
        private helper: HelperService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UsersProfile) private userProfileRepository: Repository<UsersProfile>
    ){}

    async register(body:{emailAddress: string, password: string}){
        
        try {
            let {emailAddress, password } = body
            emailAddress = await this.helper.decryptBodyParam(emailAddress)
            password = await this.helper.decryptBodyParam(password)
            let emailAddressHash = await this.helper.hashString(emailAddress);

            let passwordHash = await this.helper.hashPassword(password);

            let emailAddressEncrypt = await this.helper.encrypt(emailAddress)
            console.log(emailAddressEncrypt,'encrypt')

            let newuser = await this.userRepository.create({
                emailAddress: emailAddressEncrypt,
                emailAddressHash,
                password: passwordHash
            })

            let getuser = await this.userRepository.save(newuser)

            let user = await this.userRepository.findOne({
                where: {emailAddressHash}
            })

            let newprofile = await this.userProfileRepository.create({
                user: {id: user?.id}
            })

            let saveProfile = await this.userProfileRepository.save(newprofile)
            let profile = await this.userProfileRepository.findOne({
                where: {user: {id: user?.id}}
            })

            return this.helper.responseHandler(true, 'Action Successful', {user, profile}, HttpStatus.CREATED)
        } catch (error) {
            return this.helper.responseHandler(false, 'Something Went Wrong', error.message, HttpStatus.FORBIDDEN)
        }
    }

    async login(body: {emailAddress: string, password: string}){
        try {
            let { emailAddress, password } = body;
            emailAddress = await this.helper.decryptBodyParam(emailAddress)
            let emailAddressHash = await this.helper.hashString(emailAddress)

            password = await this.helper.decryptBodyParam(password)

            let userData = await this.userRepository.findOne({
                where: {emailAddressHash}
            })

            let profile = await this.userProfileRepository.findOne({
                where: {user:{id: userData?.id}}
            })

            if(userData){

                let {password: passwordHash} = userData;
                let isSame = await this.helper.comparePassword(password, passwordHash)
                console.log(isSame, 'same')
                if(isSame){
                    delete userData.emailAddressHash
                    delete userData.password
                    let userObject = {...userData, profile}
                    let jwtToken = await this.helper.generateJWT(userObject)
                    
                    return this.helper.responseHandler(true, 'Action Successful', {token: jwtToken, user: userObject}, HttpStatus.OK)
                }else{
                    return this.helper.responseHandler(false, 'InValid cerdentials', 'Mismatch', HttpStatus.UNAUTHORIZED)
                }
            }else{
                return this.helper.responseHandler(false, 'User not Registered', 'User Not Found', HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            return this.helper.responseHandler(false, 'Something Went Wrong', error.message, HttpStatus.FORBIDDEN)
        }
    }

    async getUser(user: any){
        try {
            const { id } = user;
            let profile = await this.userProfileRepository.findOne({
                where: {user: {id: id}}
            })
            console.log(profile, 'profile')
            return this.helper.responseHandler(true, 'Action Successful', {user, profile}, HttpStatus.OK)
        } catch (error) {
            return this.helper.responseHandler(false, 'Something Wrong', error.message, HttpStatus.FORBIDDEN)
        }
    }

    async getUsers(){
        try {
            let user = await this.userRepository.find({
                relations: ['profiles']
            })
            console.log(user,'user')

            return this.helper.responseHandler(true, 'Action Successful', user, HttpStatus.OK)

        } catch (error) {
            return this.helper.responseHandler(false, 'Something Went Wrong', error.message, HttpStatus.FORBIDDEN)
        }
    }

    async getUsersPaginated(page: number, limit: number) {
        try {
          const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['profiles'], 
            order: { createdAt: 'DESC' }, // optional
          });
      
          const totalPages = Math.ceil(total / limit);
      
          return this.helper.responseHandler(true,'Users fetched successfully',{users,pagination: {total,page,limit,totalPages}},HttpStatus.OK);
        } catch (error) {
            return this.helper.responseHandler(false,'Something went wrong',error.message,HttpStatus.FORBIDDEN);
        }
      }
      
    
}