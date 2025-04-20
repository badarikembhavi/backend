import { Base } from "entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";



@Entity()
export class UsersProfile extends Base{
    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    salutation: string;

    @Column({nullable: true})
    gender: string;

    @Column({nullable: true})
    maritalStatus: string;

    @Column({nullable: true, type: 'datetime', default: null})
    dateOfBirth: Date;

    @ManyToOne(() => User, user => user.profiles, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user', referencedColumnName: 'id'})
    user: User;
}