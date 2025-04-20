import { profile } from "console";
import { Base } from "entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UsersProfile } from "./users-profile.entity";



@Entity()
export class User extends Base{
    @Column({nullable: true})
    emailAddress: string;

    @Column({nullable: true})
    emailAddressHash: string

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    countryCode: string;

    @OneToMany(() => UsersProfile, profile => profile.user, {onDelete: 'CASCADE'})
    profiles: UsersProfile[];
}